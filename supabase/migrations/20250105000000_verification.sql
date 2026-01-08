-- Profile Verification with Veriff
-- Migration: 20250105000000_verification.sql

-- Add verification columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS veriff_session_id TEXT;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

-- Create verification_sessions table for audit trail
CREATE TABLE IF NOT EXISTS verification_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  veriff_session_id TEXT NOT NULL,
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'started', 'submitted', 'approved', 'declined', 'resubmission_requested', 'expired', 'abandoned')),
  decision_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for verification_sessions
CREATE INDEX IF NOT EXISTS idx_verification_sessions_user ON verification_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_sessions_veriff ON verification_sessions(veriff_session_id);
CREATE INDEX IF NOT EXISTS idx_verification_sessions_status ON verification_sessions(status);

-- Enable RLS on verification_sessions
ALTER TABLE verification_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for verification_sessions
-- Users can view their own verification sessions
CREATE POLICY "Users can view own verification sessions"
  ON verification_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own verification sessions
CREATE POLICY "Users can insert own verification sessions"
  ON verification_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can do anything (for webhook updates)
CREATE POLICY "Service role full access to verification_sessions"
  ON verification_sessions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_verification_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER verification_sessions_updated_at
  BEFORE UPDATE ON verification_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_verification_sessions_updated_at();
