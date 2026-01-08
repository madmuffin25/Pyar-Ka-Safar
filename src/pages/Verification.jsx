import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Heart,
  Loader2,
  BadgeCheck,
  Shield,
  IdCard,
  Crown,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import AuthHeader from '@/components/layout/AuthHeader';

export default function Verification() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Get current user's profile
  const { data: profile, isLoading: profileLoading } = useQuery({
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

  // Get verification history
  const { data: verificationHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['verificationHistory', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('verification_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Check if there's a pending verification
  const latestSession = verificationHistory?.[0];
  const isPendingVerification = latestSession?.status === 'created' ||
                                latestSession?.status === 'started' ||
                                latestSession?.status === 'submitted';

  const handleStartVerification = async () => {
    if (!profile?.is_premium) {
      toast.error('Verification is only available for Premium members');
      return;
    }

    if (profile?.is_verified) {
      toast.info('Your profile is already verified');
      return;
    }

    if (isPendingVerification) {
      toast.info('You already have a pending verification. Please wait for the results.');
      return;
    }

    setIsLoading(true);
    try {
      // Get the current URL for callback
      const callbackUrl = `${window.location.origin}/verification-complete`;

      const response = await supabase.functions.invoke('create-veriff-session', {
        body: { callbackUrl },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create verification session');
      }

      if (response.data?.url) {
        // Redirect to Veriff
        window.location.href = response.data.url;
      } else {
        throw new Error('No verification URL received');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.message || 'Failed to start verification');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get status display info
  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return { icon: CheckCircle2, color: 'text-green-500', label: 'Approved' };
      case 'declined':
        return { icon: XCircle, color: 'text-red-500', label: 'Declined' };
      case 'resubmission_requested':
        return { icon: AlertCircle, color: 'text-orange-500', label: 'Resubmission Needed' };
      case 'expired':
        return { icon: Clock, color: 'text-gray-500', label: 'Expired' };
      case 'abandoned':
        return { icon: XCircle, color: 'text-gray-500', label: 'Incomplete' };
      case 'created':
      case 'started':
      case 'submitted':
        return { icon: Clock, color: 'text-blue-500', label: 'Pending Review' };
      default:
        return { icon: Clock, color: 'text-gray-400', label: status };
    }
  };

  // Show loading while fetching profile AND verification history
  if (profileLoading || historyLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#C46A4A] animate-spin" />
      </div>
    );
  }

  // Check if user is not premium
  if (!profile?.is_premium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white">
        <AuthHeader />

        <main className="container mx-auto px-4 py-8 max-w-lg">
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-[#C46A4A] to-[#D4A853] rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Premium Feature</h2>
            <p className="text-gray-600 mb-6">
              Identity verification is exclusively available for Premium members.
              Upgrade now to verify your profile and build trust with potential matches.
            </p>
            <Link to={createPageUrl('Membership')}>
              <Button className="bg-gradient-to-r from-[#C46A4A] to-[#8B2635] text-white">
                Upgrade to Premium
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Check if already verified
  if (profile?.is_verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white">
        <AuthHeader />

        <main className="container mx-auto px-4 py-8 max-w-lg">
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <BadgeCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Profile Verified!</h2>
            <p className="text-gray-600 mb-4">
              Your identity has been successfully verified. Your profile now displays
              the verified badge, helping you build trust with potential matches.
            </p>
            {profile.verified_at && (
              <p className="text-sm text-gray-500 mb-6">
                Verified on {new Date(profile.verified_at).toLocaleDateString()}
              </p>
            )}
            <Link to={createPageUrl('Profile')}>
              <Button variant="outline" className="rounded-full">
                Back to Profile
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Check if there's a pending verification - show status screen
  if (isPendingVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white">
        <AuthHeader />

        <main className="container mx-auto px-4 py-8 max-w-lg">
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Verification Pending</h2>
            <p className="text-gray-600 mb-4">
              Your verification is being reviewed. This usually takes just a few minutes,
              but can take up to 24 hours during busy periods.
            </p>

            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-700">
                Submitted on {new Date(latestSession.created_at).toLocaleString()}
              </p>
            </div>

            <div className="space-y-3">
              <Link to="/verification-complete" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-6 rounded-xl">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Check Status
                </Button>
              </Link>
              <Link to={createPageUrl('Profile')} className="block">
                <Button variant="outline" className="w-full py-6 rounded-xl">
                  Back to Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Previous Attempts (excluding current pending one) */}
          {verificationHistory && verificationHistory.length > 1 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Previous Attempts</h3>
              <div className="space-y-3">
                {verificationHistory.slice(1).map((session) => {
                  const statusInfo = getStatusInfo(session.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                        <span className="text-sm text-gray-700">
                          {statusInfo.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(session.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Main verification page for premium users who aren't verified yet and have no pending verification
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white">
      <AuthHeader />

      <main className="container mx-auto px-4 py-8 max-w-lg">
        {/* Info Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <BadgeCheck className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
            Verify Your Identity
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Get verified to show others you're a real person and increase your
            chances of getting matches.
          </p>

          {/* Benefits */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Build Trust</h3>
                <p className="text-sm text-gray-600">
                  Show potential matches that you're genuine and serious about finding a connection.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <BadgeCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Verified Badge</h3>
                <p className="text-sm text-gray-600">
                  Your profile will display a verified badge visible to all users.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">More Matches</h3>
                <p className="text-sm text-gray-600">
                  Verified profiles tend to receive more likes and messages.
                </p>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-[#F9F2EB] rounded-2xl p-5 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">How it works</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-[#C46A4A]">
                  1
                </div>
                <span className="text-sm text-gray-700">Take a photo of your government ID</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-[#C46A4A]">
                  2
                </div>
                <span className="text-sm text-gray-700">Take a selfie for face matching</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-[#C46A4A]">
                  3
                </div>
                <span className="text-sm text-gray-700">Get verified within minutes</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleStartVerification}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white py-6 text-lg rounded-xl"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Starting Verification...
              </>
            ) : (
              <>
                <IdCard className="w-5 h-5 mr-2" />
                Start Verification
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Your ID is securely processed by Veriff, a trusted identity verification provider.
            We do not store your ID documents.
          </p>
        </div>

        {/* Previous Attempts (only show if there are completed attempts) */}
        {verificationHistory && verificationHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Previous Attempts</h3>
            <div className="space-y-3">
              {verificationHistory.map((session) => {
                const statusInfo = getStatusInfo(session.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                      <span className="text-sm text-gray-700">
                        {statusInfo.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(session.created_at).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
