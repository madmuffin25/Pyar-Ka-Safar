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
