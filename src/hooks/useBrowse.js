import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Fetch browsable profiles using the database function
 * Returns profiles filtered by user preferences, excluding already interacted and blocked users
 */
export function useBrowsableProfiles(limit = 50) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['browsableProfiles', user?.id, limit],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .rpc('get_browsable_profiles', {
          p_user_id: user.id,
          p_limit: limit
        });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Record a match action (like/pass)
 * Returns whether this created a mutual match
 */
export function useMatchAction() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ targetUserId, action }) => {
      if (!user) throw new Error('Not authenticated');

      // Insert the match action
      const { data, error } = await supabase
        .from('matches')
        .upsert({
          user_id: user.id,
          target_user_id: targetUserId,
          action: action
        }, {
          onConflict: 'user_id,target_user_id'
        })
        .select()
        .single();

      if (error) throw error;

      // Check for mutual match if action is like
      if (action === 'like') {
        const { data: isMutual, error: mutualError } = await supabase
          .rpc('check_mutual_match', {
            p_user_id: user.id,
            p_target_user_id: targetUserId
          });

        if (mutualError) throw mutualError;

        return { match: data, isMutualMatch: isMutual };
      }

      return { match: data, isMutualMatch: false };
    },
    onSuccess: () => {
      // Don't invalidate browsableProfiles - managed locally in Browse.jsx for smooth UX
      // Only invalidate mutualMatches to update Matches page
      queryClient.invalidateQueries({ queryKey: ['mutualMatches'] });
    }
  });
}

/**
 * Block a user
 * Blocked users won't appear in browse or matches
 */
export function useBlockUser() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blockedUserId) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('blocks')
        .insert({
          blocker_id: user.id,
          blocked_id: blockedUserId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Don't invalidate browsableProfiles - managed locally in Browse.jsx
      queryClient.invalidateQueries({ queryKey: ['mutualMatches'] });
    }
  });
}
