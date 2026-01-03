import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { calculateCompatibility } from '@/components/utils/calculateCompatibility';

/**
 * Fetch recommended profiles sorted by compatibility score
 * Uses the existing get_browsable_profiles function and adds client-side ranking
 */
export function useRecommendedProfiles(limit = 20) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recommendedProfiles', user?.id, limit],
    queryFn: async () => {
      if (!user) return { profiles: [], userProfile: null };

      // First, get the current user's profile for compatibility calculation
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!userProfile) return { profiles: [], userProfile: null };

      // Fetch browsable profiles (already filtered by preferences, blocked, etc.)
      const { data: profiles, error } = await supabase
        .rpc('get_browsable_profiles', {
          p_user_id: user.id,
          p_limit: 100 // Get more to sort and pick top matches
        });

      if (error) throw error;
      if (!profiles || profiles.length === 0) return { profiles: [], userProfile };

      // Calculate compatibility and add to each profile
      const profilesWithCompatibility = profiles.map(profile => ({
        ...profile,
        compatibility: calculateCompatibility(userProfile, profile)
      }));

      // Sort by compatibility (descending)
      profilesWithCompatibility.sort((a, b) => b.compatibility - a.compatibility);

      // Return top N profiles with userProfile for shared interests calculation
      return {
        profiles: profilesWithCompatibility.slice(0, limit),
        userProfile
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes - recommendations don't need to refresh often
  });
}
