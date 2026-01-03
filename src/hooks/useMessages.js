import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Fetch user's conversations list
 * Returns conversations with other user info, last message, and unread count
 */
export function useConversations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .rpc('get_user_conversations', {
          p_user_id: user.id
        });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Get or create a conversation with another user
 * Returns the conversation ID
 */
export function useGetOrCreateConversation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (otherUserId) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .rpc('get_or_create_conversation', {
          p_user1: user.id,
          p_user2: otherUserId
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
}

/**
 * Fetch messages for a conversation
 */
export function useMessages(conversationId) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!conversationId && !!user,
    staleTime: 1000 * 10, // 10 seconds
  });
}

/**
 * Send a message to a conversation
 */
export function useSendMessage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, content }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Update messages list
      queryClient.invalidateQueries({ queryKey: ['messages', data.conversation_id] });
      // Update conversations list (for last message preview)
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      // Update unread count
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    }
  });
}

/**
 * Mark messages as read in a conversation
 */
export function useMarkAsRead() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .is('read_at', null);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    }
  });
}

/**
 * Get total unread message count for badge
 */
export function useUnreadCount() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['unreadCount', user?.id],
    queryFn: async () => {
      if (!user) return 0;

      const { data, error } = await supabase
        .rpc('get_total_unread_count', {
          p_user_id: user.id
        });

      if (error) throw error;
      return data || 0;
    },
    enabled: !!user,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute
  });
}

/**
 * Subscribe to real-time messages for a conversation
 * Returns messages array that updates in real-time
 */
export function useRealtimeMessages(conversationId) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!conversationId || !user) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          // Add new message to cache
          queryClient.setQueryData(['messages', conversationId], (old) => {
            if (!old) return [payload.new];
            // Avoid duplicates
            if (old.some(m => m.id === payload.new.id)) return old;
            return [...old, payload.new];
          });
          // Update conversations list for last message
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
          // Update unread count if message is from other user
          if (payload.new.sender_id !== user.id) {
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
          }
        }
      )
      .subscribe((status) => {
        setIsSubscribed(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
      setIsSubscribed(false);
    };
  }, [conversationId, user, queryClient]);

  return { isSubscribed };
}

/**
 * Subscribe to real-time conversation updates (for conversations list)
 */
export function useRealtimeConversations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`user-messages:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        () => {
          // Invalidate conversations to refresh the list
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
          queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
}

/**
 * Get conversation details by other user ID
 */
export function useConversationByUserId(otherUserId) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['conversationByUser', user?.id, otherUserId],
    queryFn: async () => {
      if (!user || !otherUserId) return null;

      // Determine the correct order for user1_id and user2_id
      const user1 = user.id < otherUserId ? user.id : otherUserId;
      const user2 = user.id < otherUserId ? otherUserId : user.id;

      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user1_id', user1)
        .eq('user2_id', user2)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user && !!otherUserId,
  });
}
