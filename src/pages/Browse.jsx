import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/api/supabaseClient';
import { useBrowsableProfiles, useMatchAction, useBlockUser } from '@/hooks/useBrowse';
import { useUnreadCount } from '@/hooks/useMessages';
import { calculateCompatibility } from '@/components/utils/calculateCompatibility';
import ProfileCard from '@/components/dashboard/ProfileCard';
import MatchModal from '@/components/dashboard/MatchModal';
import { Heart, User, MessageCircle, Sparkles, Search, LogOut, Loader2, RefreshCw, Frown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

export default function Browse() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // State - local queue for smooth UX (no flash on like/pass)
  const [localQueue, setLocalQueue] = useState([]);
  const [queueInitialized, setQueueInitialized] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);

  // Fetch current user's profile
  const { data: userProfile, isLoading: loadingUser } = useQuery({
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

  // Fetch browsable profiles
  const {
    data: profiles = [],
    isLoading: loadingProfiles,
    refetch: refetchProfiles
  } = useBrowsableProfiles(50);

  // Mutations
  const matchAction = useMatchAction();
  const blockUser = useBlockUser();

  // Get unread message count
  const { data: unreadCount = 0 } = useUnreadCount();

  // Sync server data to local queue (only on initial load or refresh)
  useEffect(() => {
    // Initialize queue when loading finishes, even if empty
    if (!loadingProfiles && !queueInitialized) {
      setLocalQueue(profiles);
      setQueueInitialized(true);
    }
  }, [profiles, loadingProfiles, queueInitialized]);

  // Current profile is always the first in the local queue
  const currentProfile = localQueue[0];

  // Calculate compatibility for current profile
  const compatibility = useMemo(() => {
    if (!userProfile || !currentProfile) return null;
    return calculateCompatibility(userProfile, currentProfile);
  }, [userProfile, currentProfile]);

  // Handlers with optimistic updates
  const handleLike = async (profile) => {
    // Optimistic update - remove from queue immediately
    setLocalQueue(prev => prev.filter(p => p.id !== profile.id));

    try {
      const result = await matchAction.mutateAsync({
        targetUserId: profile.id,
        action: 'like'
      });

      if (result.isMutualMatch) {
        setMatchedProfile(profile);
        setShowMatchModal(true);
      }
    } catch (error) {
      // Rollback on error - add profile back to front of queue
      setLocalQueue(prev => [profile, ...prev]);
      toast.error('Failed to like profile');
      console.error(error);
    }
  };

  const handlePass = async (profile) => {
    // Optimistic update - remove from queue immediately
    setLocalQueue(prev => prev.filter(p => p.id !== profile.id));

    try {
      await matchAction.mutateAsync({
        targetUserId: profile.id,
        action: 'pass'
      });
    } catch (error) {
      // Rollback on error
      setLocalQueue(prev => [profile, ...prev]);
      toast.error('Failed to pass profile');
      console.error(error);
    }
  };

  const handleBlock = async (profile) => {
    // Optimistic update - remove from queue immediately
    setLocalQueue(prev => prev.filter(p => p.id !== profile.id));

    try {
      await blockUser.mutateAsync(profile.id);
      toast.success('User blocked', {
        description: 'They will no longer appear in your browse'
      });
    } catch (error) {
      // Rollback on error
      setLocalQueue(prev => [profile, ...prev]);
      toast.error('Failed to block user');
      console.error(error);
    }
  };

  const handleRefresh = () => {
    setQueueInitialized(false);
    setLocalQueue([]);
    refetchProfiles();
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleSendMessage = (profile) => {
    setShowMatchModal(false);
    navigate(`/chat/${profile.id}`);
  };

  // Loading state - also wait for queue to be initialized
  if (loadingUser || loadingProfiles || !queueInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#C46A4A] animate-spin" />
      </div>
    );
  }

  // No profiles available - check local queue
  const noProfiles = localQueue.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">PyarKaSafar</span>
            </Link>

            <nav className="flex items-center gap-2">
              <Link to={createPageUrl('Dashboard')}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('RecommendedProfiles')}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Sparkles className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="rounded-full bg-[#C46A4A]/10">
                <Search className="w-5 h-5 text-[#C46A4A]" />
              </Button>
              <Link to={createPageUrl('Messages')}>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                  <MessageCircle className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C46A4A] text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to={createPageUrl('Profile')}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {noProfiles ? (
          // Empty state
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="w-20 h-20 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Frown className="w-10 h-10 text-[#C46A4A]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">No More Profiles</h2>
              <p className="text-gray-600 mb-6">
                You've seen all available profiles. Check back later or adjust your preferences.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleRefresh}
                  className="bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Profiles
                </Button>
                <Link to={createPageUrl('EditProfile')}>
                  <Button variant="outline" className="w-full rounded-full">
                    Edit Preferences
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Profile Card
          <div className="max-w-md mx-auto">
            <ProfileCard
              profile={currentProfile}
              onLike={handleLike}
              onPass={handlePass}
              onBlock={handleBlock}
              compatibility={compatibility}
              distance={currentProfile?.distance_miles}
            />

            {/* Progress indicator - show remaining profiles */}
            {localQueue.length > 1 && (
              <div className="mt-4 text-center text-sm text-gray-500">
                {localQueue.length - 1} more {localQueue.length - 1 === 1 ? 'profile' : 'profiles'}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Match Modal */}
      <MatchModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        matchedProfile={matchedProfile}
        currentUser={userProfile}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
