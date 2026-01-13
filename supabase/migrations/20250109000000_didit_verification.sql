-- Migration: Replace Veriff with Didit for verification
-- This migration renames columns to be provider-agnostic and updates status constraints

-- Rename column in profiles table (veriff_session_id -> verification_session_id)
ALTER TABLE profiles RENAME COLUMN veriff_session_id TO verification_session_id;

-- Rename column in verification_sessions table
ALTER TABLE verification_sessions RENAME COLUMN veriff_session_id TO session_id;

-- Drop old status constraint
ALTER TABLE verification_sessions DROP CONSTRAINT IF EXISTS verification_sessions_status_check;

-- Add new status constraint with Didit statuses
-- Didit uses: Not Started, In Progress, Approved, Declined, In Review, Expired, Abandoned
-- We normalize to lowercase with underscores for consistency
ALTER TABLE verification_sessions ADD CONSTRAINT verification_sessions_status_check
  CHECK (status IN ('created', 'not_started', 'in_progress', 'approved', 'declined', 'in_review', 'expired', 'abandoned'));

-- Rename index for clarity
ALTER INDEX IF EXISTS idx_verification_sessions_veriff RENAME TO idx_verification_sessions_session;
