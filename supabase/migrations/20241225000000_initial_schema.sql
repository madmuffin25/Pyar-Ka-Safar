-- Migration: Initial Schema for PyarKaSafar
-- Created: 2024-12-25
-- Description: Creates profiles table, RLS policies, indexes, and triggers

-- Enable PostGIS for location data
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- PROFILES TABLE
-- ============================================
-- Main user profile table linked to Supabase auth.users
CREATE TABLE IF NOT EXISTS profiles (
  -- Primary key linked to auth.users
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,

  -- Basic Info
  first_name TEXT,
  age INTEGER CHECK (age >= 18 AND age <= 100),
  gender TEXT CHECK (gender IN ('male', 'female')),

  -- Location
  country TEXT DEFAULT 'USA',
  state TEXT,
  city TEXT,
  location_coordinates GEOGRAPHY(POINT, 4326),

  -- Background
  ethnicity TEXT,
  religion TEXT,
  marital_status TEXT,

  -- Professional
  education TEXT,
  occupation TEXT,

  -- Lifestyle
  diet TEXT,
  drinking TEXT,
  smoking TEXT,
  height_feet INTEGER,
  height_inches INTEGER,
  languages TEXT[] DEFAULT '{}',

  -- Preferences & Values
  comfortable_long_distance BOOLEAN,
  willing_to_relocate TEXT,
  family_involvement TEXT,
  culture_importance TEXT,
  festivals_celebrated TEXT[] DEFAULT '{}',

  -- Personality & Interests
  interests TEXT[] DEFAULT '{}',
  personality_type TEXT,
  relationship_goal TEXT,
  prompts JSONB DEFAULT '[]',
  bio TEXT,
  traits JSONB DEFAULT '{}',

  -- Media
  photos TEXT[] DEFAULT '{}',

  -- Partner Preferences
  preference_gender TEXT,
  preference_age_min INTEGER DEFAULT 21,
  preference_age_max INTEGER DEFAULT 45,
  preference_distance_miles INTEGER DEFAULT 50,
  preference_languages TEXT[] DEFAULT '{}',

  -- Status & Flags
  profile_complete BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 1,
  is_hidden BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  boosted_until TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view complete, non-hidden profiles
CREATE POLICY "Public profiles viewable"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (profile_complete = true AND is_hidden = false);

-- Policy: Users can always view their own profile
CREATE POLICY "View own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Users can delete their own profile
CREATE POLICY "Delete own profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_complete ON profiles(profile_complete);
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON profiles(gender);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles USING GIST(location_coordinates);
CREATE INDEX IF NOT EXISTS idx_profiles_age ON profiles(age);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);

-- ============================================
-- TRIGGERS
-- ============================================
-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call update_updated_at on profile updates
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- STORAGE BUCKET
-- ============================================
-- Create the profile-photos bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES
-- ============================================
-- Policy: Anyone can view photos (public bucket)
CREATE POLICY "Public read access"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'profile-photos');

-- Policy: Authenticated users can upload to their own folder
CREATE POLICY "Users can upload own photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can update their own photos
CREATE POLICY "Users can update own photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can delete their own photos
CREATE POLICY "Users can delete own photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
