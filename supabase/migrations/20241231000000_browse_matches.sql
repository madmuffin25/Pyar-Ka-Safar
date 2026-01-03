-- Migration: Browse + Like/Pass + Matches Feature
-- Created: 2024-12-31
-- Description: Creates matches and blocks tables with RLS policies and helper functions

-- ============================================
-- MATCHES TABLE (for Like/Pass actions)
-- ============================================
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('like', 'pass')),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate actions on same user
  UNIQUE(user_id, target_user_id)
);

-- ============================================
-- BLOCKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate blocks
  UNIQUE(blocker_id, blocked_id)
);

-- ============================================
-- INDEXES
-- ============================================
-- Matches indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_target_user_id ON matches(target_user_id);
CREATE INDEX IF NOT EXISTS idx_matches_action ON matches(action);
CREATE INDEX IF NOT EXISTS idx_matches_user_action ON matches(user_id, action);
-- Composite index for finding mutual matches
CREATE INDEX IF NOT EXISTS idx_matches_mutual ON matches(target_user_id, action) WHERE action = 'like';

-- Blocks indexes
CREATE INDEX IF NOT EXISTS idx_blocks_blocker_id ON blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocked_id ON blocks(blocked_id);

-- ============================================
-- ROW LEVEL SECURITY - MATCHES
-- ============================================

-- Enable RLS on matches
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own matches (actions they took)
CREATE POLICY "View own matches"
  ON matches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can see if someone liked them (for mutual match detection)
CREATE POLICY "View incoming likes"
  ON matches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = target_user_id AND action = 'like');

-- Policy: Users can insert their own match actions
CREATE POLICY "Insert own matches"
  ON matches
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own match actions (e.g., change pass to like)
CREATE POLICY "Update own matches"
  ON matches
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own match actions
CREATE POLICY "Delete own matches"
  ON matches
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- ROW LEVEL SECURITY - BLOCKS
-- ============================================

-- Enable RLS on blocks
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own blocks
CREATE POLICY "View own blocks"
  ON blocks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = blocker_id);

-- Policy: Users can see if they've been blocked (to hide content)
CREATE POLICY "View if blocked"
  ON blocks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = blocked_id);

-- Policy: Users can insert their own blocks
CREATE POLICY "Insert own blocks"
  ON blocks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = blocker_id);

-- Policy: Users can delete their own blocks (unblock)
CREATE POLICY "Delete own blocks"
  ON blocks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = blocker_id);

-- ============================================
-- HELPER FUNCTION: Check for Mutual Match
-- ============================================
CREATE OR REPLACE FUNCTION check_mutual_match(
  p_user_id UUID,
  p_target_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM matches
    WHERE user_id = p_target_user_id
      AND target_user_id = p_user_id
      AND action = 'like'
  );
END;
$$;

-- ============================================
-- HELPER FUNCTION: Get Mutual Matches
-- ============================================
CREATE OR REPLACE FUNCTION get_mutual_matches(p_user_id UUID)
RETURNS TABLE (
  match_id UUID,
  matched_user_id UUID,
  first_name TEXT,
  age INTEGER,
  city TEXT,
  state TEXT,
  photos TEXT[],
  ethnicity TEXT,
  religion TEXT,
  relationship_goal TEXT,
  interests TEXT[],
  diet TEXT,
  drinking TEXT,
  smoking TEXT,
  culture_importance TEXT,
  family_involvement TEXT,
  matched_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    m1.id as match_id,
    prof.id as matched_user_id,
    prof.first_name,
    prof.age,
    prof.city,
    prof.state,
    prof.photos,
    prof.ethnicity,
    prof.religion,
    prof.relationship_goal,
    prof.interests,
    prof.diet,
    prof.drinking,
    prof.smoking,
    prof.culture_importance,
    prof.family_involvement,
    GREATEST(m1.created_at, m2.created_at) as matched_at
  FROM matches m1
  INNER JOIN matches m2
    ON m1.user_id = m2.target_user_id
    AND m1.target_user_id = m2.user_id
  INNER JOIN profiles prof
    ON prof.id = m1.target_user_id
  WHERE
    m1.user_id = p_user_id
    AND m1.action = 'like'
    AND m2.action = 'like'
    -- Exclude blocked users
    AND NOT EXISTS (
      SELECT 1 FROM blocks b
      WHERE (b.blocker_id = p_user_id AND b.blocked_id = prof.id)
         OR (b.blocker_id = prof.id AND b.blocked_id = p_user_id)
    )
    -- Only show active profiles
    AND prof.is_hidden = false
  ORDER BY matched_at DESC;
END;
$$;

-- ============================================
-- HELPER FUNCTION: Get Browsable Profiles
-- ============================================
CREATE OR REPLACE FUNCTION get_browsable_profiles(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  first_name TEXT,
  age INTEGER,
  gender TEXT,
  city TEXT,
  state TEXT,
  photos TEXT[],
  ethnicity TEXT,
  religion TEXT,
  relationship_goal TEXT,
  interests TEXT[],
  prompts JSONB,
  diet TEXT,
  drinking TEXT,
  smoking TEXT,
  culture_importance TEXT,
  family_involvement TEXT,
  distance_miles DOUBLE PRECISION
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_profile RECORD;
BEGIN
  -- Get current user's profile and preferences
  SELECT
    p.id,
    p.preference_gender,
    p.preference_age_min,
    p.preference_age_max,
    p.preference_distance_miles,
    p.location_coordinates,
    p.gender,
    p.age
  INTO v_user_profile
  FROM profiles p
  WHERE p.id = p_user_id;

  -- Return matching profiles
  RETURN QUERY
  SELECT
    prof.id,
    prof.first_name,
    prof.age,
    prof.gender,
    prof.city,
    prof.state,
    prof.photos,
    prof.ethnicity,
    prof.religion,
    prof.relationship_goal,
    prof.interests,
    prof.prompts,
    prof.diet,
    prof.drinking,
    prof.smoking,
    prof.culture_importance,
    prof.family_involvement,
    CASE
      WHEN v_user_profile.location_coordinates IS NOT NULL
           AND prof.location_coordinates IS NOT NULL
      THEN ST_Distance(
        v_user_profile.location_coordinates::geography,
        prof.location_coordinates::geography
      ) / 1609.34  -- Convert meters to miles
      ELSE NULL
    END as distance_miles
  FROM profiles prof
  WHERE
    -- Exclude own profile
    prof.id != p_user_id
    -- Only complete, visible profiles
    AND prof.profile_complete = true
    AND prof.is_hidden = false
    -- Gender preference matching (bidirectional)
    AND (v_user_profile.preference_gender IS NULL OR prof.gender = v_user_profile.preference_gender)
    AND (prof.preference_gender IS NULL OR prof.preference_gender = v_user_profile.gender)
    -- Age preference matching (bidirectional - both users must be in each other's age range)
    AND (v_user_profile.preference_age_min IS NULL OR prof.age >= v_user_profile.preference_age_min)
    AND (v_user_profile.preference_age_max IS NULL OR prof.age <= v_user_profile.preference_age_max)
    AND (prof.preference_age_min IS NULL OR v_user_profile.age >= prof.preference_age_min)
    AND (prof.preference_age_max IS NULL OR v_user_profile.age <= prof.preference_age_max)
    -- Exclude already interacted profiles
    AND NOT EXISTS (
      SELECT 1 FROM matches m
      WHERE m.user_id = p_user_id AND m.target_user_id = prof.id
    )
    -- Exclude blocked users (both directions)
    AND NOT EXISTS (
      SELECT 1 FROM blocks b
      WHERE (b.blocker_id = p_user_id AND b.blocked_id = prof.id)
         OR (b.blocker_id = prof.id AND b.blocked_id = p_user_id)
    )
    -- Distance filter (bidirectional - both users must be within each other's distance preference)
    AND (
      v_user_profile.location_coordinates IS NULL
      OR prof.location_coordinates IS NULL
      OR (
        (v_user_profile.preference_distance_miles IS NULL OR ST_DWithin(
          v_user_profile.location_coordinates::geography,
          prof.location_coordinates::geography,
          v_user_profile.preference_distance_miles * 1609.34
        ))
        AND
        (prof.preference_distance_miles IS NULL OR ST_DWithin(
          v_user_profile.location_coordinates::geography,
          prof.location_coordinates::geography,
          prof.preference_distance_miles * 1609.34
        ))
      )
    )
  -- Prioritize boosted profiles, then by distance, then random for variety
  ORDER BY
    (prof.boosted_until IS NOT NULL AND prof.boosted_until > NOW()) DESC,
    CASE
      WHEN v_user_profile.location_coordinates IS NOT NULL
           AND prof.location_coordinates IS NOT NULL
      THEN ST_Distance(
        v_user_profile.location_coordinates::geography,
        prof.location_coordinates::geography
      )
      ELSE 999999999
    END,
    RANDOM()
  LIMIT p_limit;
END;
$$;
