import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const monthlyPriceId = Deno.env.get('STRIPE_MONTHLY_PRICE_ID')
    const yearlyPriceId = Deno.env.get('STRIPE_YEARLY_PRICE_ID')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!stripeSecretKey || !monthlyPriceId || !yearlyPriceId) {
      throw new Error('Missing Stripe configuration')
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

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

    // Get request body
    const { priceType } = await req.json()

    if (!priceType || !['monthly', 'yearly'].includes(priceType)) {
      throw new Error('Invalid price type. Must be "monthly" or "yearly"')
    }

    const priceId = priceType === 'monthly' ? monthlyPriceId : yearlyPriceId

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, first_name, stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('Profile not found')
    }

    // Check if already premium
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', user.id)
      .single()

    if (existingProfile?.is_premium) {
      throw new Error('User is already a premium member')
    }

    let customerId = profile.stripe_customer_id

    // Create or get Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email,
        name: profile.first_name,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id

      // Save customer ID to profile
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Get the origin for redirect URLs
    const origin = req.headers.get('origin') || 'http://localhost:5173'

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
      metadata: {
        supabase_user_id: user.id,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
        },
      },
    })

    return new Response(
      JSON.stringify({ url: session.url }),
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
