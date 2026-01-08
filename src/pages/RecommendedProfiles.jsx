import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/api/supabaseClient';
import { useRecommendedProfiles } from '@/hooks/useRecommendations';
import { useMatchAction } from '@/hooks/useBrowse';
import MatchModal from '@/components/dashboard/MatchModal';
import AuthHeader from '@/components/layout/AuthHeader';
import { Heart, Sparkles, Loader2, MapPin, BadgeCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

const FREE_DAILY_LIKE_LIMIT = 5;

const formatLabel = (value) => {
  if (!value) return '';
  return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function RecommendedProfiles() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [likedProfiles, setLikedProfiles] = useState(new Set());
  const [dailyLikeCount, setDailyLikeCount] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);

  // Fetch recommended profiles
  const { data = { profiles: [], userProfile: null }, isLoading } = useRecommendedProfiles(20);
  const { profiles: recommendedProfiles, userProfile } = data;

  // Match action mutation
  const matchAction = useMatchAction();

  // Get already liked profiles
  const { data: existingLikes = [] } = useQuery({
    queryKey: ['existingLikes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('matches')
        .select('target_user_id')
        .eq('user_id', user.id);
      if (error) throw error;
      return data.map(m => m.target_user_id);
    },
    enabled: !!user
  });

  // Update liked profiles set when data loads
  useEffect(() => {
    if (existingLikes.length > 0) {
      setLikedProfiles(new Set(existingLikes));
    }
  }, [existingLikes]);

  // Count today's likes for free users
  useEffect(() => {
    const countTodayLikes = async () => {
      if (!user || userProfile?.is_premium) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('action', 'like')
        .gte('created_at', today.toISOString());

      setDailyLikeCount(count || 0);
    };

    countTodayLikes();
  }, [user, userProfile?.is_premium]);

  const handleLike = async (profile) => {
    // Check like limit for free users
    if (!userProfile?.is_premium && dailyLikeCount >= FREE_DAILY_LIKE_LIMIT) {
      toast.error("You've reached your daily like limit", {
        description: "Upgrade to Premium for unlimited likes!",
        action: {
          label: "Upgrade",
          onClick: () => navigate('/membership')
        }
      });
      return;
    }

    // Optimistic update
    setLikedProfiles(prev => new Set([...prev, profile.id]));

    try {
      const result = await matchAction.mutateAsync({
        targetUserId: profile.id,
        action: 'like'
      });

      // Increment local like count for free users
      if (!userProfile?.is_premium) {
        setDailyLikeCount(prev => prev + 1);
      }

      if (result.isMutualMatch) {
        setMatchedProfile(profile);
        setShowMatchModal(true);
      } else {
        toast.success('Profile liked!');
      }
    } catch (error) {
      // Rollback on error
      setLikedProfiles(prev => {
        const next = new Set(prev);
        next.delete(profile.id);
        return next;
      });
      toast.error('Failed to like profile');
      console.error(error);
    }
  };

  const handleSendMessage = () => {
    setShowMatchModal(false);
    navigate('/messages');
  };

  // Filter out already liked profiles
  const availableProfiles = recommendedProfiles.filter(p => !likedProfiles.has(p.id));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#C46A4A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white">
      <AuthHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-[#C46A4A]" />
            <span className="text-sm font-medium text-[#C46A4A]">Just For You</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Recommended Profiles
          </h1>
          <p className="text-gray-600">
            Based on your preferences and interests
          </p>
        </div>

        {availableProfiles.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No recommendations yet</h3>
            <p className="text-gray-600 mb-6">
              Complete your profile to get better recommendations
            </p>
            <Link to={createPageUrl('EditProfile')}>
              <Button className="bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full">
                Complete Profile
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {availableProfiles.length} {availableProfiles.length === 1 ? 'profile' : 'profiles'} recommended for you
              </p>

              {/* Like counter for free users */}
              {userProfile && !userProfile.is_premium && (
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  dailyLikeCount >= FREE_DAILY_LIKE_LIMIT
                    ? 'bg-red-100 text-red-700'
                    : 'bg-[#C46A4A]/10 text-[#C46A4A]'
                }`}>
                  <Heart className="w-4 h-4 inline mr-1" />
                  {FREE_DAILY_LIKE_LIMIT - dailyLikeCount} likes left today
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {availableProfiles.map((profile) => {
                // Calculate shared interests
                const sharedInterests = profile.interests && userProfile?.interests
                  ? profile.interests.filter(i => userProfile.interests?.includes(i))
                  : [];

                return (
                  <div
                    key={profile.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group flex flex-col"
                  >
                    <Link to={`/view-profile/${profile.id}`} className="aspect-[3/4] relative overflow-hidden block">
                      {profile.photos?.[0] ? (
                        <img
                          src={profile.photos[0]}
                          alt={profile.first_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#C46A4A]/20 to-[#D4A853]/20 flex items-center justify-center">
                          <span className="text-4xl font-bold text-[#C46A4A]">
                            {profile.first_name?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}

                      {/* Verified Badge (top-left) */}
                      {profile.is_verified && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium shadow-lg">
                          <BadgeCheck className="w-3 h-3" />
                          Verified
                        </div>
                      )}

                      {/* Compatibility Badge */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#C46A4A]" />
                        <span className="text-xs font-bold text-[#C46A4A]">
                          {profile.compatibility}%
                        </span>
                      </div>

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-bold text-lg">
                          {profile.first_name}, {profile.age}
                        </h3>
                        {profile.occupation && (
                          <p className="text-sm text-white/90 truncate">{profile.occupation}</p>
                        )}
                        {profile.city && (
                          <div className="flex items-center gap-1 text-sm text-white/80">
                            <MapPin className="w-3 h-3" />
                            {profile.city}
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Tags and Like Button */}
                    <div className="p-3 flex flex-col flex-grow">
                      <div className="flex flex-wrap gap-1">
                        {profile.ethnicity && (
                          <Badge variant="secondary" className="text-xs bg-[#C46A4A]/10 text-[#C46A4A]">
                            {formatLabel(profile.ethnicity)}
                          </Badge>
                        )}
                        {profile.relationship_goal && (
                          <Badge variant="secondary" className="text-xs bg-[#D4A853]/10 text-[#D4A853]">
                            {formatLabel(profile.relationship_goal)}
                          </Badge>
                        )}
                      </div>

                      {/* Shared interests count */}
                      {sharedInterests.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          {sharedInterests.length} shared {sharedInterests.length === 1 ? 'interest' : 'interests'}
                        </p>
                      )}

                      {/* Spacer to push button to bottom */}
                      <div className="flex-grow min-h-3" />

                      {/* Like Button - always at bottom */}
                      <Button
                        size="sm"
                        onClick={() => handleLike(profile)}
                        disabled={matchAction.isPending}
                        className="w-full bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        Like
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
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
