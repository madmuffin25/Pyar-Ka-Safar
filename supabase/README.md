# Supabase Setup

This directory contains database migrations and configuration for the PyarKaSafar Supabase backend.

## Quick Setup (Dashboard)

### 1. Run Migration

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New query**
5. Copy the contents of `migrations/20241225000000_initial_schema.sql`
6. Click **Run**

This single migration creates:
- `profiles` table with all fields
- Row Level Security (RLS) policies
- Database indexes
- Auto-update trigger for `updated_at`
- `profile-photos` storage bucket (public, 5MB limit)
- Storage policies for upload/read/update/delete

### 2. Disable Email Confirmation (Development)

1. Go to **Authentication** → **Providers**
2. Click on **Email**
3. Turn OFF **Confirm email**
4. Click **Save**

## Using Supabase CLI (Alternative)

If you have the Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref smxpsjjtzccsqnfgywnd

# Run migrations
supabase db push

# Or reset and run all migrations
supabase db reset
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Migration Files

| File | Description |
|------|-------------|
| `20241225000000_initial_schema.sql` | Creates profiles table, RLS policies, indexes, triggers |
| `20241231000000_browse_matches.sql` | Creates matches and blocks tables, browsable profiles function |
| `20250103000000_messaging.sql` | Creates messages table with real-time support |
| `20250104000000_premium_boost.sql` | Adds premium boost to get_browsable_profiles |
| `20250104100000_subscriptions.sql` | Adds stripe_customer_id and subscriptions table |

## Edge Functions (Stripe Integration)

### Deploy Edge Functions

```bash
# Login to Supabase
supabase login

# Link to project
supabase link --project-ref smxpsjjtzccsqnfgywnd

# Deploy functions
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook
```

### Set Stripe Secrets

Get these from Stripe Dashboard:
- **Secret Key:** Dashboard → Developers → API keys
- **Webhook Secret:** Dashboard → Developers → Webhooks → Your endpoint → Signing secret
- **Price IDs:** Dashboard → Products → Your product → Price IDs

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_secret
supabase secrets set STRIPE_MONTHLY_PRICE_ID=price_monthly_id
supabase secrets set STRIPE_YEARLY_PRICE_ID=price_yearly_id
```

### Stripe Dashboard Setup

1. Create a Product "PyarKaSafar Premium" with 2 prices:
   - Monthly: $24.99 recurring
   - Yearly: $240.00 recurring

2. Create Webhook endpoint:
   - URL: `https://smxpsjjtzccsqnfgywnd.supabase.co/functions/v1/stripe-webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`, `customer.subscription.updated`

## Future Migrations

When adding new migrations, follow the naming convention:
```
YYYYMMDDHHMMSS_description.sql
```

Example: `20241226120000_add_matches_table.sql`
