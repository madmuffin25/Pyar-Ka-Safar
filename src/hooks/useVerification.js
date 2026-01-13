import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to get the current verification status of the user
 */
export function useVerificationStatus() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['verificationStatus', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('is_verified, verified_at, verification_session_id')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

/**
 * Hook to get verification session history
 */
export function useVerificationHistory(limit = 10) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['verificationHistory', user?.id, limit],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('verification_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

/**
 * Hook to get the latest verification session
 */
export function useLatestVerificationSession() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['latestVerificationSession', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('verification_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

/**
 * Hook to create a new Didit verification session
 */
export function useCreateVerificationSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (callbackUrl) => {
      const response = await supabase.functions.invoke('create-didit-session', {
        body: { callbackUrl },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create verification session');
      }

      if (!response.data?.url) {
        throw new Error('No verification URL received');
      }

      return response.data;
    },
    onSuccess: () => {
      // Invalidate verification queries
      queryClient.invalidateQueries({ queryKey: ['verificationStatus'] });
      queryClient.invalidateQueries({ queryKey: ['verificationHistory'] });
      queryClient.invalidateQueries({ queryKey: ['latestVerificationSession'] });
    },
  });
}

/**
 * Check if user can start verification
 * @param {Object} profile - User profile object
 * @returns {Object} - { canVerify: boolean, reason: string | null }
 */
export function canStartVerification(profile) {
  if (!profile) {
    return { canVerify: false, reason: 'Profile not loaded' };
  }

  if (!profile.is_premium) {
    return { canVerify: false, reason: 'Verification is only available for Premium members' };
  }

  if (profile.is_verified) {
    return { canVerify: false, reason: 'Profile is already verified' };
  }

  return { canVerify: true, reason: null };
}
