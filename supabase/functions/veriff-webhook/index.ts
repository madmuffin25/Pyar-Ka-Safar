import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { encode as hexEncode } from 'https://deno.land/std@0.168.0/encoding/hex.ts'

// Verify HMAC-SHA256 signature
async function verifyHmacSignature(payload: string, signature: string, secret: string): Promise<boolean> {
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

  const expectedSignature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
  const expectedHex = new TextDecoder().decode(hexEncode(new Uint8Array(expectedSignature)))

  return expectedHex.toLowerCase() === signature.toLowerCase()
}

serve(async (req) => {
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

    // Get and verify headers
    const authClient = req.headers.get('x-auth-client')
    const hmacSignature = req.headers.get('x-hmac-signature')

    if (!authClient || !hmacSignature) {
      console.error('Missing authentication headers')
      throw new Error('Missing authentication headers')
    }

    // Verify API key matches
    if (authClient !== veriffApiKey) {
      console.error('Invalid API key')
      throw new Error('Invalid API key')
    }

    // Get raw body
    const body = await req.text()
    console.log('Webhook received:', body)

    // Verify HMAC signature
    const isValid = await verifyHmacSignature(body, hmacSignature, veriffSharedSecret)
    if (!isValid) {
      console.error('Invalid HMAC signature')
      throw new Error('Invalid HMAC signature')
    }

    // Parse webhook payload
    const payload = JSON.parse(body)
    console.log('Parsed payload:', JSON.stringify(payload, null, 2))

    // Extract verification data
    const verification = payload.verification
    if (!verification) {
      console.error('No verification data in payload')
      throw new Error('No verification data in payload')
    }

    const sessionId = verification.id
    const vendorData = verification.vendorData // This is the user_id we passed
    const status = verification.status

    console.log(`Processing verification: sessionId=${sessionId}, userId=${vendorData}, status=${status}`)

    if (!sessionId || !vendorData) {
      throw new Error('Missing session ID or vendor data')
    }

    // Map Veriff status to our status
    let dbStatus = status
    const decisionTime = new Date().toISOString()

    // Handle different decision statuses
    switch (status) {
      case 'approved': {
        // User is verified - update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            is_verified: true,
            verified_at: decisionTime,
            veriff_session_id: sessionId,
          })
          .eq('id', vendorData)

        if (profileError) {
          console.error('Error updating profile to verified:', profileError)
          throw profileError
        }

        console.log(`User ${vendorData} is now verified!`)
        break
      }

      case 'declined':
      case 'resubmission_requested':
      case 'expired':
      case 'abandoned': {
        // Update profile to not verified (in case of re-verification attempt)
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            is_verified: false,
            veriff_session_id: sessionId,
          })
          .eq('id', vendorData)

        if (profileError) {
          console.error('Error updating profile status:', profileError)
        }

        console.log(`Verification ${status} for user ${vendorData}`)
        break
      }

      case 'started':
      case 'submitted': {
        // Just log these intermediate states
        console.log(`Verification ${status} for user ${vendorData}`)
        break
      }

      default:
        console.log(`Unknown status: ${status}`)
        dbStatus = status
    }

    // Update verification session record
    const { error: sessionError } = await supabase
      .from('verification_sessions')
      .update({
        status: dbStatus,
        decision_time: ['approved', 'declined', 'resubmission_requested', 'expired', 'abandoned'].includes(status)
          ? decisionTime
          : null,
      })
      .eq('veriff_session_id', sessionId)

    if (sessionError) {
      console.error('Error updating verification session:', sessionError)
      // Don't throw - this is for audit trail only
    }

    // If no existing session record, create one
    if (sessionError?.code === 'PGRST116') {
      const { error: insertError } = await supabase
        .from('verification_sessions')
        .insert({
          user_id: vendorData,
          veriff_session_id: sessionId,
          status: dbStatus,
          decision_time: ['approved', 'declined', 'resubmission_requested', 'expired', 'abandoned'].includes(status)
            ? decisionTime
            : null,
        })

      if (insertError) {
        console.error('Error inserting verification session:', insertError)
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
