-- =============================================
-- MILESTONE 2 PHASE 2: MESSAGING
-- Date: January 3, 2025
-- =============================================

-- =============================================
-- CONVERSATIONS TABLE
-- =============================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT conversations_users_check CHECK (user1_id < user2_id),
  UNIQUE(user1_id, user2_id)
);

-- =============================================
-- MESSAGES TABLE
-- =============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 2000),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_conversations_user1 ON conversations(user1_id);
CREATE INDEX idx_conversations_user2 ON conversations(user2_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_unread ON messages(conversation_id, read_at) WHERE read_at IS NULL;

-- =============================================
-- RLS POLICIES - CONVERSATIONS
-- =============================================
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Insert conversation as participant" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Update own conversations" ON conversations
  FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- =============================================
-- RLS POLICIES - MESSAGES
-- =============================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View messages in own conversations" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    )
  );

CREATE POLICY "Send messages in own conversations" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id
      AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    )
  );

CREATE POLICY "Update own messages" ON messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    )
  );

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Get or create conversation between two users
CREATE OR REPLACE FUNCTION get_or_create_conversation(p_user1 UUID, p_user2 UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_conversation_id UUID;
  v_smaller_id UUID;
  v_larger_id UUID;
BEGIN
  -- Ensure consistent ordering (smaller UUID first)
  IF p_user1 < p_user2 THEN
    v_smaller_id := p_user1;
    v_larger_id := p_user2;
  ELSE
    v_smaller_id := p_user2;
    v_larger_id := p_user1;
  END IF;

  -- Try to find existing conversation
  SELECT id INTO v_conversation_id
  FROM conversations
  WHERE user1_id = v_smaller_id AND user2_id = v_larger_id;

  -- Create if not exists
  IF v_conversation_id IS NULL THEN
    INSERT INTO conversations (user1_id, user2_id)
    VALUES (v_smaller_id, v_larger_id)
    RETURNING id INTO v_conversation_id;
  END IF;

  RETURN v_conversation_id;
END;
$$;

-- Get conversations with last message and other user info
CREATE OR REPLACE FUNCTION get_user_conversations(p_user_id UUID)
RETURNS TABLE (
  conversation_id UUID,
  other_user_id UUID,
  other_user_name TEXT,
  other_user_photo TEXT,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  last_message_sender_id UUID,
  unread_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id AS conversation_id,
    CASE
      WHEN c.user1_id = p_user_id THEN c.user2_id
      ELSE c.user1_id
    END AS other_user_id,
    p.first_name AS other_user_name,
    p.photos[1] AS other_user_photo,
    m.content AS last_message,
    c.last_message_at,
    m.sender_id AS last_message_sender_id,
    (
      SELECT COUNT(*)
      FROM messages msg
      WHERE msg.conversation_id = c.id
      AND msg.sender_id != p_user_id
      AND msg.read_at IS NULL
    ) AS unread_count
  FROM conversations c
  JOIN profiles p ON p.id = CASE
    WHEN c.user1_id = p_user_id THEN c.user2_id
    ELSE c.user1_id
  END
  LEFT JOIN LATERAL (
    SELECT msg.content, msg.sender_id
    FROM messages msg
    WHERE msg.conversation_id = c.id
    ORDER BY msg.created_at DESC
    LIMIT 1
  ) m ON true
  WHERE c.user1_id = p_user_id OR c.user2_id = p_user_id
  ORDER BY c.last_message_at DESC;
END;
$$;

-- Get total unread count for a user
CREATE OR REPLACE FUNCTION get_total_unread_count(p_user_id UUID)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count BIGINT;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM messages m
  JOIN conversations c ON c.id = m.conversation_id
  WHERE (c.user1_id = p_user_id OR c.user2_id = p_user_id)
  AND m.sender_id != p_user_id
  AND m.read_at IS NULL;

  RETURN v_count;
END;
$$;

-- Update conversation last_message_at when new message is sent
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_conversation_timestamp
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();

-- =============================================
-- ENABLE REALTIME
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
