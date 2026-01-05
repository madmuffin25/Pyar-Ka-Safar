import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Fetch mutual matches
 * Returns all users where both parties have liked each other
 */
export function useMutualMatches() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['mutualMatches', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .rpc('get_mutual_matches', {
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
 * Get match count for badge notification
 */
export function useMatchCount() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['matchCount', user?.id],
    queryFn: async () => {
      if (!user) return 0;

      const { data, error } = await supabase
        .rpc('get_mutual_matches', {
          p_user_id: user.id
        });

      if (error) throw error;
      return data?.length || 0;
    },
    enabled: !!user,
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Get a single profile by ID
 * Used for viewing match profile details
 */
export function useProfileById(profileId) {
  return useQuery({
    queryKey: ['profile', profileId],
    queryFn: async () => {
      if (!profileId) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!profileId,
  });
}

/**
 * Get profiles that liked the current user (includes all likes)
 * Used for "Likes You" tab
 */
export function useLikesReceived() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['likesReceived', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get all profiles that liked the current user
      const { data: incomingLikes, error: likesError } = await supabase
        .from('matches')
        .select('user_id, created_at')
        .eq('target_user_id', user.id)
        .eq('action', 'like');

      if (likesError) throw likesError;
      if (!incomingLikes?.length) return [];

      const likerIds = incomingLikes.map(l => l.user_id);

      // Fetch profiles of people who liked us
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', likerIds)
        .eq('is_hidden', false);

      if (profilesError) throw profilesError;
      return profiles || [];
    },
    enabled: !!user,
    staleTime: 1000 * 30,
  });
}

/**
 * Get profiles the current user liked (includes all likes)
 * Used for "Sent" tab
 */
export function useLikesSent() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['likesSent', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get all profiles the current user liked
      const { data: outgoingLikes, error: likesError } = await supabase
        .from('matches')
        .select('target_user_id, created_at')
        .eq('user_id', user.id)
        .eq('action', 'like');

      if (likesError) throw likesError;
      if (!outgoingLikes?.length) return [];

      const likedIds = outgoingLikes.map(l => l.target_user_id);

      // Fetch profiles of people we liked
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', likedIds)
        .eq('is_hidden', false);

      if (profilesError) throw profilesError;
      return profiles || [];
    },
    enabled: !!user,
    staleTime: 1000 * 30,
  });
}
