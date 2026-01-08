-- Migration: Add is_verified and is_premium fields to get_browsable_profiles function
-- Description: Include verification and premium status in browsable profiles for badge display

-- Drop existing function first (required when changing return type)
DROP FUNCTION IF EXISTS get_browsable_profiles(UUID, INTEGER);

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
  occupation TEXT,
  is_premium BOOLEAN,
  is_verified BOOLEAN,
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
    prof.occupation,
    prof.is_premium,
    prof.is_verified,
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
      -- Skip distance check if current user has no location or no distance preference
      v_user_profile.location_coordinates IS NULL
      OR v_user_profile.preference_distance_miles IS NULL
      OR prof.location_coordinates IS NULL
      -- Check distance is within current user's preference
      OR ST_Distance(
        v_user_profile.location_coordinates::geography,
        prof.location_coordinates::geography
      ) / 1609.34 <= v_user_profile.preference_distance_miles
    )
    AND (
      -- Skip distance check if target user has no location or no distance preference
      prof.location_coordinates IS NULL
      OR prof.preference_distance_miles IS NULL
      OR v_user_profile.location_coordinates IS NULL
      -- Check distance is within target user's preference
      OR ST_Distance(
        v_user_profile.location_coordinates::geography,
        prof.location_coordinates::geography
      ) / 1609.34 <= prof.preference_distance_miles
    )
  ORDER BY
    -- Premium users appear first (Profile Boost feature)
    prof.is_premium DESC,
    RANDOM()
  LIMIT p_limit;
END;
$$;
