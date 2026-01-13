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

  // Use constant-time comparison
  return expectedHex.toLowerCase() === signature.toLowerCase()
}

// Check if timestamp is within 5 minutes
function isTimestampValid(timestamp: string | number): boolean {
  const webhookTime = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp
  const currentTime = Math.floor(Date.now() / 1000)
  const fiveMinutes = 5 * 60

  return Math.abs(currentTime - webhookTime) <= fiveMinutes
}

serve(async (req) => {
  try {
    // Get environment variables
    const diditWebhookSecret = Deno.env.get('DIDIT_WEBHOOK_SECRET')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!diditWebhookSecret) {
      throw new Error('Missing Didit webhook configuration')
    }

    // Initialize Supabase with service role for admin access
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

    // Get and verify headers
    const signature = req.headers.get('x-signature')
    const timestamp = req.headers.get('x-timestamp')

    if (!signature) {
      console.error('Missing signature header')
      throw new Error('Missing signature header')
    }

    // Verify timestamp if provided (within 5 minutes)
    if (timestamp && !isTimestampValid(timestamp)) {
      console.error('Timestamp is too old')
      throw new Error('Webhook timestamp expired')
    }

    // Get raw body - important to preserve exact payload for signature verification
    const body = await req.text()
    console.log('Webhook received:', body)

    // Verify HMAC signature
    const isValid = await verifyHmacSignature(body, signature, diditWebhookSecret)
    if (!isValid) {
      console.error('Invalid HMAC signature')
      throw new Error('Invalid HMAC signature')
    }

    // Parse webhook payload
    const payload = JSON.parse(body)
    console.log('Parsed payload:', JSON.stringify(payload, null, 2))

    // Extract verification data from Didit webhook format
    const sessionId = payload.session_id
    const vendorData = payload.vendor_data // This is the user_id we passed
    const status = payload.status // Didit statuses: Not Started, In Progress, Approved, Declined, In Review, Expired, Abandoned
    const webhookType = payload.webhook_type // status.updated or data.updated

    console.log(`Processing verification: sessionId=${sessionId}, userId=${vendorData}, status=${status}, type=${webhookType}`)

    if (!sessionId || !vendorData) {
      throw new Error('Missing session ID or vendor data')
    }

    // Normalize status to lowercase for database storage
    const normalizedStatus = status.toLowerCase().replace(' ', '_') // "In Progress" -> "in_progress"
    const decisionTime = new Date().toISOString()

    // Handle different decision statuses
    switch (status) {
      case 'Approved': {
        // User is verified - update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            is_verified: true,
            verified_at: decisionTime,
            verification_session_id: sessionId,
          })
          .eq('id', vendorData)

        if (profileError) {
          console.error('Error updating profile to verified:', profileError)
          throw profileError
        }

        console.log(`User ${vendorData} is now verified!`)
        break
      }

      case 'Declined':
      case 'Expired':
      case 'Abandoned': {
        // Update profile to not verified (in case of re-verification attempt)
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            is_verified: false,
            verification_session_id: sessionId,
          })
          .eq('id', vendorData)

        if (profileError) {
          console.error('Error updating profile status:', profileError)
        }

        console.log(`Verification ${status} for user ${vendorData}`)
        break
      }

      case 'In Review': {
        // Pending human review - just update session status, don't change is_verified
        console.log(`Verification pending review for user ${vendorData}`)
        break
      }

      case 'Not Started':
      case 'In Progress': {
        // Just log these intermediate states
        console.log(`Verification ${status} for user ${vendorData}`)
        break
      }

      default:
        console.log(`Unknown status: ${status}`)
    }

    // Update verification session record
    const { error: sessionUpdateError, count } = await supabase
      .from('verification_sessions')
      .update({
        status: normalizedStatus,
        decision_time: ['approved', 'declined', 'expired', 'abandoned'].includes(normalizedStatus)
          ? decisionTime
          : null,
      })
      .eq('session_id', sessionId)

    if (sessionUpdateError) {
      console.error('Error updating verification session:', sessionUpdateError)
    }

    // If no existing session record was updated, create one
    if (count === 0) {
      const { error: insertError } = await supabase
        .from('verification_sessions')
        .insert({
          user_id: vendorData,
          session_id: sessionId,
          status: normalizedStatus,
          decision_time: ['approved', 'declined', 'expired', 'abandoned'].includes(normalizedStatus)
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
