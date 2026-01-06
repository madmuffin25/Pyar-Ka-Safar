-- Migration: Add occupation to get_mutual_matches function
-- Created: 2025-01-07
-- Description: Updates get_mutual_matches to include occupation field

-- Drop the old function first (required when changing return type)
DROP FUNCTION IF EXISTS get_mutual_matches(UUID);

-- ============================================
-- UPDATED FUNCTION: Get Mutual Matches (with occupation)
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
  occupation TEXT,
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
    prof.occupation,
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
