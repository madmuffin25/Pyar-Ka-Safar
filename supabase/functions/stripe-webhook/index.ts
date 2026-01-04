import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
  try {
    // Get environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!stripeSecretKey || !webhookSecret) {
      throw new Error('Missing Stripe configuration')
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Initialize Supabase with service role for admin access
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

    // Get the signature from headers
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      throw new Error('No signature header')
    }

    // Get raw body
    const body = await req.text()

    // Verify webhook signature
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    )

    console.log(`Received event: ${event.type}`)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(supabase, stripe, session)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(supabase, subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(supabase, subscription)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
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

async function handleCheckoutCompleted(
  supabase: any,
  stripe: Stripe,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.supabase_user_id
  if (!userId) {
    console.error('No user ID in session metadata')
    return
  }

  // Get subscription details
  const subscriptionId = session.subscription as string
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // Update profile to premium
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      is_premium: true,
      stripe_customer_id: session.customer as string,
    })
    .eq('id', userId)

  if (profileError) {
    console.error('Error updating profile:', profileError)
    throw profileError
  }

  // Create or update subscription record
  const { error: subError } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_subscription_id: subscriptionId,
      stripe_customer_id: session.customer as string,
      status: subscription.status,
      price_id: subscription.items.data[0]?.price.id,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    }, {
      onConflict: 'stripe_subscription_id',
    })

  if (subError) {
    console.error('Error creating subscription record:', subError)
    throw subError
  }

  console.log(`User ${userId} is now premium!`)
}

async function handleSubscriptionUpdated(
  supabase: any,
  subscription: Stripe.Subscription
) {
  const userId = subscription.metadata?.supabase_user_id
  if (!userId) {
    // Try to find user by stripe_customer_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', subscription.customer)
      .single()

    if (!profile) {
      console.error('Could not find user for subscription')
      return
    }

    await updateSubscriptionStatus(supabase, profile.id, subscription)
    return
  }

  await updateSubscriptionStatus(supabase, userId, subscription)
}

async function handleSubscriptionDeleted(
  supabase: any,
  subscription: Stripe.Subscription
) {
  const userId = subscription.metadata?.supabase_user_id

  let targetUserId = userId

  if (!targetUserId) {
    // Try to find user by stripe_customer_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', subscription.customer)
      .single()

    if (!profile) {
      console.error('Could not find user for subscription')
      return
    }
    targetUserId = profile.id
  }

  // Set is_premium to false
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ is_premium: false })
    .eq('id', targetUserId)

  if (profileError) {
    console.error('Error updating profile:', profileError)
    throw profileError
  }

  // Update subscription record
  const { error: subError } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (subError) {
    console.error('Error updating subscription record:', subError)
  }

  console.log(`User ${targetUserId} subscription canceled, no longer premium`)
}

async function updateSubscriptionStatus(
  supabase: any,
  userId: string,
  subscription: Stripe.Subscription
) {
  // Determine if user should be premium based on subscription status
  const isPremium = ['active', 'trialing'].includes(subscription.status)

  // Update profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ is_premium: isPremium })
    .eq('id', userId)

  if (profileError) {
    console.error('Error updating profile:', profileError)
    throw profileError
  }

  // Update subscription record
  const { error: subError } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (subError) {
    console.error('Error updating subscription record:', subError)
  }

  console.log(`User ${userId} subscription updated, is_premium: ${isPremium}`)
}
