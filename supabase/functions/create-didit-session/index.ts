import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Fetch image and convert to Base64 with data URI prefix
async function fetchImageAsBase64(imageUrl: string): Promise<{ base64: string, mimeType: string, sizeKB: number }> {
  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`)
  }

  // Get content type from response
  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const mimeType = contentType.split(';')[0].trim()

  const arrayBuffer = await response.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)
  const sizeKB = Math.round(uint8Array.length / 1024)

  // Convert to base64
  let binary = ''
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i])
  }

  const base64 = btoa(binary)

  return { base64, mimeType, sizeKB }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const diditApiKey = Deno.env.get('DIDIT_API_KEY')
    const diditWorkflowId = Deno.env.get('DIDIT_WORKFLOW_ID')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!diditApiKey || !diditWorkflowId) {
      throw new Error('Missing Didit configuration')
    }

    // Initialize Supabase with service role for admin access
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Get user from JWT
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      throw new Error('Invalid user token')
    }

    // Get user profile with photos
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, first_name, is_premium, is_verified, photos')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('Profile not found')
    }

    // Check if user is premium
    if (!profile.is_premium) {
      throw new Error('Verification is only available for Premium members')
    }

    // Check if already verified
    if (profile.is_verified) {
      throw new Error('Profile is already verified')
    }

    // Check if user has a profile photo
    if (!profile.photos || profile.photos.length === 0) {
      throw new Error('Please upload a profile photo before verification')
    }

    // Get callback URL from request body (optional)
    let callbackUrl = 'https://pyarkasafar.vercel.app/verification-complete'
    try {
      const body = await req.json()
      if (body.callbackUrl) {
        callbackUrl = body.callbackUrl
      }
    } catch {
      // No body or invalid JSON, use default callback URL
    }

    // Fetch the first profile photo and convert to base64
    const profilePhotoUrl = profile.photos[0]
    console.log('Fetching profile photo:', profilePhotoUrl)

    let imageData: { base64: string, mimeType: string, sizeKB: number }
    try {
      imageData = await fetchImageAsBase64(profilePhotoUrl)
      console.log(`Profile photo fetched: ${imageData.sizeKB}KB, type: ${imageData.mimeType}`)

      // Check if image is too large (Didit has 1MB limit)
      if (imageData.sizeKB > 1024) {
        throw new Error(`Image too large: ${imageData.sizeKB}KB. Maximum is 1024KB (1MB).`)
      }
    } catch (error) {
      console.error('Failed to fetch profile photo:', error)
      throw new Error('Failed to process profile photo. Please ensure your photo is accessible.')
    }

    // Check if image format is supported (HEIC is NOT supported by Didit)
    const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!supportedFormats.includes(imageData.mimeType.toLowerCase())) {
      console.error('Unsupported image format:', imageData.mimeType)
      throw new Error(`Unsupported image format: ${imageData.mimeType}. Please use JPEG or PNG.`)
    }

    // Prepare Didit session request
    // Didit requires plain Base64 string (NO data URI prefix)
    const diditPayload = {
      workflow_id: diditWorkflowId,
      callback: callbackUrl,
      vendor_data: user.id,
      portrait_image: imageData.base64,
      metadata: {
        user_email: profile.email,
        user_name: profile.first_name,
      },
    }

    console.log('Didit payload prepared, portrait_image length:', imageData.base64.length, 'format:', imageData.mimeType)

    console.log('Creating Didit session for user:', user.id)

    // Call Didit API to create session
    const diditResponse = await fetch('https://verification.didit.me/v2/session/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': diditApiKey,
      },
      body: JSON.stringify(diditPayload),
    })

    if (!diditResponse.ok) {
      const errorText = await diditResponse.text()
      console.error('Didit API error:', errorText)
      throw new Error(`Didit API error: ${diditResponse.status}`)
    }

    const diditData = await diditResponse.json()
    console.log('Didit session created:', diditData)

    const sessionId = diditData.session_id
    const sessionUrl = diditData.url

    if (!sessionId || !sessionUrl) {
      throw new Error('Invalid response from Didit')
    }

    // Update profile with verification session ID
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ verification_session_id: sessionId })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      // Don't throw - session is created, we can still continue
    }

    // Create verification session record
    const { error: sessionError } = await supabase
      .from('verification_sessions')
      .insert({
        user_id: user.id,
        session_id: sessionId,
        status: 'created',
      })

    if (sessionError) {
      console.error('Error creating verification session record:', sessionError)
      // Don't throw - this is for audit trail only
    }

    return new Response(
      JSON.stringify({
        url: sessionUrl,
        sessionId: sessionId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
