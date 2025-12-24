import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Heart, User, MessageCircle, Sparkles, Search, Settings, LogOut, Loader2, RefreshCw, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ProfileCard from '@/components/dashboard/ProfileCard';
import MatchModal from '@/components/dashboard/MatchModal';
import { calculateCompatibility } from '@/components/utils/calculateCompatibility';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);
  
  // Get current user's profile
  const { data: userProfiles, isLoading: loadingUser } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.UserProfile.filter({ created_by: user.email });
    }
  });
  
  const currentUserProfile = userProfiles?.[0];
  
  // Get potential matches (excluding own profile)
  const { data: profiles = [], isLoading: loadingProfiles, refetch } = useQuery({
    queryKey: ['browseProfiles'],
    queryFn: async () => {
      const allProfiles = await base44.entities.UserProfile.filter({ profile_complete: true });
      const user = await base44.auth.me();
      // Filter out own profile and hidden profiles
      return allProfiles.filter(p => p.created_by !== user.email && !p.is_hidden);
    },
    enabled: !!currentUserProfile
  });
  
  // Get existing matches to filter out already liked/passed profiles
  const { data: existingMatches = [] } = useQuery({
    queryKey: ['existingMatches'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const userProfile = userProfiles?.[0];
      if (!userProfile) return [];
      return base44.entities.Match.filter({ user_id: userProfile.id });
    },
    enabled: !!currentUserProfile
  });

  // Get blocked users
  const { data: blockedUsers = [] } = useQuery({
    queryKey: ['blockedUsers'],
    queryFn: async () => {
      if (!currentUserProfile?.id) return [];
      return base44.entities.Block.filter({ blocker_id: currentUserProfile.id });
    },
    enabled: !!currentUserProfile
  });
  
  // Filter profiles that haven't been acted on or blocked
  const blockedProfileIds = blockedUsers.map(b => b.blocked_id);
  const availableProfiles = profiles.filter(p => 
    !existingMatches.some(m => m.target_user_id === p.id) &&
    !blockedProfileIds.includes(p.id)
  );
  
  const currentProfile = availableProfiles[currentIndex];
  
  // Create match mutation
  const createMatchMutation = useMutation({
    mutationFn: async ({ targetProfile, action }) => {
      const match = await base44.entities.Match.create({
        user_id: currentUserProfile.id,
        target_user_id: targetProfile.id,
        action,
        compatibility_score: calculateCompatibility(currentUserProfile, targetProfile)
      });
      
      // Check if there's a mutual like
      if (action === 'like' || action === 'super_like') {
        const mutualMatches = await base44.entities.Match.filter({
          user_id: targetProfile.id,
          target_user_id: currentUserProfile.id,
          action: 'like'
        });
        
        if (mutualMatches.length > 0) {
          // It's a match!
          await base44.entities.Match.update(match.id, { is_mutual: true });
          await base44.entities.Match.update(mutualMatches[0].id, { is_mutual: true });
          return { match, isMutual: true, matchedProfile: targetProfile };
        }
      }
      
      return { match, isMutual: false };
    },
    onSuccess: (result) => {
      if (result.isMutual) {
        setMatchedProfile(result.matchedProfile);
        setShowMatch(true);
      }
      queryClient.invalidateQueries({ queryKey: ['existingMatches'] });
      nextProfile();
    }
  });
  
  const nextProfile = () => {
    if (currentIndex < availableProfiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };
  
  const handleLike = (profile) => {
    createMatchMutation.mutate({ targetProfile: profile, action: 'like' });
  };
  
  const handlePass = (profile) => {
    createMatchMutation.mutate({ targetProfile: profile, action: 'pass' });
  };
  
  const handleSuperLike = (profile) => {
    createMatchMutation.mutate({ targetProfile: profile, action: 'super_like' });
  };

  const blockMutation = useMutation({
    mutationFn: (targetProfileId) =>
      base44.entities.Block.create({
        blocker_id: currentUserProfile.id,
        blocked_id: targetProfileId
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] });
      nextProfile();
    }
  });

  const handleBlock = (profile) => {
    if (window.confirm(`Block ${profile.first_name}? They won't be able to see or contact you.`)) {
      blockMutation.mutate(profile.id);
    }
  };
  
  const handleLogout = () => {
    base44.auth.logout();
  };
  
  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#C46A4A] animate-spin" />
      </div>
    );
  }
  
  if (!currentUserProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Heart className="w-16 h-16 text-[#C46A4A] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Profile</h2>
          <p className="text-gray-600 mb-6">
            Create your profile to start finding matches
          </p>
          <Link to={createPageUrl('Onboarding')}>
            <Button className="bg-gradient-to-r from-[#C46A4A] to-[#8B2635] px-8 py-6 rounded-full text-lg">
              Create Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
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
              <Link to={createPageUrl('RecommendedProfiles')}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Sparkles className="w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('Browse')}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Search className="w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('Matches')}>
                                    <Button variant="ghost" size="icon" className="rounded-full relative">
                                      <Heart className="w-5 h-5" />
                                    </Button>
                                  </Link>
                                  <Link to={createPageUrl('Messages')}>
                                    <Button variant="ghost" size="icon" className="rounded-full relative">
                                      <MessageCircle className="w-5 h-5" />
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
        {/* Daily Matches Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-[#C46A4A]" />
            <span className="text-sm font-medium text-[#C46A4A]">Daily Matches</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Discover Your Matches
          </h1>
        </div>
        
        {loadingProfiles ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#C46A4A] animate-spin" />
          </div>
        ) : availableProfiles.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">No More Profiles</h2>
            <p className="text-gray-600 mb-6">
              You've seen all available profiles. Check back later!
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setCurrentIndex(0);
                refetch();
              }}
              className="rounded-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        ) : currentProfile ? (
          <ProfileCard
            profile={currentProfile}
            onLike={handleLike}
            onPass={handlePass}
            onSuperLike={handleSuperLike}
            onBlock={handleBlock}
            compatibility={calculateCompatibility(currentUserProfile, currentProfile)}
          />
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600">Loading profiles...</p>
          </div>
        )}
      </main>
      
      {/* Match Modal */}
      <MatchModal
        isOpen={showMatch}
        onClose={() => setShowMatch(false)}
        matchedProfile={matchedProfile}
        currentUser={currentUserProfile}
      />
    </div>
  );
}