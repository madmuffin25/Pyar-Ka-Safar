import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { encode as hexEncode } from 'https://deno.land/std@0.168.0/encoding/hex.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Generate HMAC-SHA256 signature
async function generateHmacSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(payload)

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
  return new TextDecoder().decode(hexEncode(new Uint8Array(signature)))
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const veriffApiKey = Deno.env.get('VERIFF_API_KEY')
    const veriffSharedSecret = Deno.env.get('VERIFF_SHARED_SECRET')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!veriffApiKey || !veriffSharedSecret) {
      throw new Error('Missing Veriff configuration')
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

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, first_name, is_premium, is_verified')
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

    // Prepare Veriff session request
    const timestamp = new Date().toISOString()
    const veriffPayload = {
      verification: {
        callback: callbackUrl,
        person: {
          firstName: profile.first_name || '',
        },
        vendorData: user.id,
        timestamp: timestamp,
      }
    }

    const payloadString = JSON.stringify(veriffPayload)
    const hmacSignature = await generateHmacSignature(payloadString, veriffSharedSecret)

    // Call Veriff API to create session
    const veriffResponse = await fetch('https://stationapi.veriff.com/v1/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AUTH-CLIENT': veriffApiKey,
        'X-HMAC-SIGNATURE': hmacSignature,
      },
      body: payloadString,
    })

    if (!veriffResponse.ok) {
      const errorText = await veriffResponse.text()
      console.error('Veriff API error:', errorText)
      throw new Error(`Veriff API error: ${veriffResponse.status}`)
    }

    const veriffData = await veriffResponse.json()
    console.log('Veriff session created:', veriffData)

    const sessionId = veriffData.verification?.id
    const sessionUrl = veriffData.verification?.url

    if (!sessionId || !sessionUrl) {
      throw new Error('Invalid response from Veriff')
    }

    // Update profile with Veriff session ID
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ veriff_session_id: sessionId })
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
        veriff_session_id: sessionId,
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
