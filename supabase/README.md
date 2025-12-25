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

## Future Migrations

When adding new migrations, follow the naming convention:
```
YYYYMMDDHHMMSS_description.sql
```

Example: `20241226120000_add_matches_table.sql`
