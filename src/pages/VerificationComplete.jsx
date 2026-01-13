import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Loader2,
  BadgeCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import AuthHeader from '@/components/layout/AuthHeader';

export default function VerificationComplete() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [pollCount, setPollCount] = useState(0);

  // Get current user's profile
  const { data: profile, isLoading: profileLoading, refetch } = useQuery({
    queryKey: ['myProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Get latest verification session
  const { data: latestSession, refetch: refetchSession } = useQuery({
    queryKey: ['latestVerification', user?.id],
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
    enabled: !!user
  });

  // Poll for updates if status is pending
  useEffect(() => {
    const isPending = latestSession?.status === 'created' ||
                      latestSession?.status === 'not_started' ||
                      latestSession?.status === 'in_progress' ||
                      latestSession?.status === 'in_review';

    if (isPending && pollCount < 30) {
      const timer = setTimeout(() => {
        refetch();
        refetchSession();
        setPollCount(prev => prev + 1);
      }, 3000); // Poll every 3 seconds

      return () => clearTimeout(timer);
    }
  }, [latestSession?.status, pollCount, refetch, refetchSession]);

  // Invalidate relevant queries when verification completes
  useEffect(() => {
    if (profile?.is_verified) {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    }
  }, [profile?.is_verified, queryClient]);

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#C46A4A] animate-spin" />
      </div>
    );
  }

  const getStatusContent = () => {
    // If profile is verified, show success
    if (profile?.is_verified) {
      return {
        icon: <BadgeCheck className="w-12 h-12 text-white" />,
        iconBg: 'bg-gradient-to-r from-green-500 to-emerald-500',
        title: 'Verification Successful!',
        description: 'Your identity has been verified. Your profile now displays the verified badge.',
        showBackToProfile: true,
        status: 'approved',
      };
    }

    // Check latest session status
    const status = latestSession?.status;

    switch (status) {
      case 'approved':
        return {
          icon: <CheckCircle2 className="w-12 h-12 text-white" />,
          iconBg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          title: 'Verification Approved!',
          description: 'Your identity has been successfully verified. The badge will appear on your profile shortly.',
          showBackToProfile: true,
          status: 'approved',
        };

      case 'declined':
        return {
          icon: <XCircle className="w-12 h-12 text-white" />,
          iconBg: 'bg-gradient-to-r from-red-500 to-rose-500',
          title: 'Verification Declined',
          description: 'Unfortunately, we couldn\'t verify your identity. Please ensure your profile photo is clear and try again.',
          showTryAgain: true,
          status: 'declined',
        };

      case 'in_review':
        return {
          icon: <Clock className="w-12 h-12 text-white" />,
          iconBg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          title: 'Under Review',
          description: 'Your verification is being reviewed by our team. This may take a few minutes.',
          showPending: true,
          status: 'in_review',
        };

      case 'expired':
        return {
          icon: <Clock className="w-12 h-12 text-white" />,
          iconBg: 'bg-gradient-to-r from-gray-500 to-slate-500',
          title: 'Session Expired',
          description: 'Your verification session has expired. Please start a new verification.',
          showTryAgain: true,
          status: 'expired',
        };

      case 'abandoned':
        return {
          icon: <AlertCircle className="w-12 h-12 text-white" />,
          iconBg: 'bg-gradient-to-r from-gray-500 to-slate-500',
          title: 'Verification Incomplete',
          description: 'You didn\'t complete the verification process. Please try again when you\'re ready.',
          showTryAgain: true,
          status: 'abandoned',
        };

      case 'created':
      case 'not_started':
      case 'in_progress':
      default:
        return {
          icon: <Loader2 className="w-12 h-12 text-white animate-spin" />,
          iconBg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
          title: 'Verification in Progress',
          description: 'We\'re processing your verification. This usually takes just a few seconds.',
          showPending: true,
          status: 'pending',
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white">
      <AuthHeader />

      <main className="container mx-auto px-4 py-8 max-w-lg">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          <div className={`w-24 h-24 ${statusContent.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
            {statusContent.icon}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {statusContent.title}
          </h2>

          <p className="text-gray-600 mb-8">
            {statusContent.description}
          </p>

          {statusContent.showPending && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-700">
                Please wait while we process your verification. This page will update automatically.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {statusContent.showBackToProfile && (
              <Link to={createPageUrl('Profile')} className="block">
                <Button className="w-full bg-gradient-to-r from-[#C46A4A] to-[#8B2635] text-white py-6 rounded-xl">
                  Back to Profile
                </Button>
              </Link>
            )}

            {statusContent.showTryAgain && (
              <>
                <Link to={createPageUrl('Verification')} className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-6 rounded-xl">
                    Try Again
                  </Button>
                </Link>
                <Link to={createPageUrl('Profile')} className="block">
                  <Button variant="outline" className="w-full py-6 rounded-xl">
                    Back to Profile
                  </Button>
                </Link>
              </>
            )}

            {statusContent.showPending && (
              <Link to={createPageUrl('Profile')} className="block">
                <Button variant="outline" className="w-full py-6 rounded-xl">
                  Continue Browsing
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
