import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useMatchAction } from '@/hooks/useBrowse';
import MatchModal from '@/components/dashboard/MatchModal';
import AuthHeader from '@/components/layout/AuthHeader';
import {
  Loader2,
  MapPin,
  GraduationCap,
  Crown,
  Heart,
  Briefcase,
  Utensils,
  Wine,
  Cigarette,
  Ruler,
  Globe,
  Users,
  Sparkles,
  Calendar,
  ArrowLeft,
  MessageCircle,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

const FREE_DAILY_LIKE_LIMIT = 5;

const formatLabel = (value) => {
  if (!value) return '';
  return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const goalLabels = {
  dil_se_casual: "Dil-Se Casual",
  vibe_check: "Vibe Check Only",
  lets_see: "Let's See Where It Goes",
  light_dating: "Light Dating",
  real_connection: "Real Connection",
  long_term_serious: "Long-Term Serious",
  shaadi_ready: "Shaadi-Ready"
};

const personalityLabels = {
  reserved_thoughtful: "Reserved & Thoughtful",
  low_key_social: "Low-Key Social",
  quiet_warm: "Quiet but Warm",
  balanced_ambivert: "Balanced Ambivert",
  social_explorer: "Social Explorer",
  full_on_outgoing: "Full-On Outgoing",
  total_patakha: "Total Patakha"
};

const dietLabels = {
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  non_vegetarian: "Non-Vegetarian",
  eggetarian: "Eggetarian",
  jain_vegetarian: "Jain Vegetarian",
  pescatarian: "Pescatarian"
};

const drinkingLabels = {
  never: "Never drinks",
  socially: "Drinks socially",
  regularly: "Drinks regularly",
  prefer_not_to_say: "Prefer not to say"
};

const smokingLabels = {
  never: "Never smokes",
  socially: "Smokes socially",
  regularly: "Smokes regularly",
  trying_to_quit: "Trying to quit",
  prefer_not_to_say: "Prefer not to say"
};

export default function ViewProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [hasLiked, setHasLiked] = useState(false);
  const [dailyLikeCount, setDailyLikeCount] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Get the profile being viewed
  const { data: profile, isLoading } = useQuery({
    queryKey: ['viewProfile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  // Get current user's profile
  const { data: currentUserProfile } = useQuery({
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

  // Check if already liked
  const { data: existingLike } = useQuery({
    queryKey: ['existingLike', user?.id, userId],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('matches')
        .select('id')
        .eq('user_id', user.id)
        .eq('target_user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!userId
  });

  // Check if it's a mutual match
  const { data: isMutualMatch } = useQuery({
    queryKey: ['mutualMatch', user?.id, userId],
    queryFn: async () => {
      if (!user) return false;
      // Check if both users have liked each other
      const { data: theyLikedMe } = await supabase
        .from('matches')
        .select('id')
        .eq('user_id', userId)
        .eq('target_user_id', user.id)
        .eq('action', 'like')
        .maybeSingle();

      const { data: iLikedThem } = await supabase
        .from('matches')
        .select('id')
        .eq('user_id', user.id)
        .eq('target_user_id', userId)
        .eq('action', 'like')
        .maybeSingle();

      return !!(theyLikedMe && iLikedThem);
    },
    enabled: !!user && !!userId
  });

  useEffect(() => {
    if (existingLike) {
      setHasLiked(true);
    }
  }, [existingLike]);

  // Count today's likes for free users
  useEffect(() => {
    const countTodayLikes = async () => {
      if (!user || currentUserProfile?.is_premium) return;

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
  }, [user, currentUserProfile?.is_premium]);

  // Match action mutation
  const matchAction = useMatchAction();

  const handleLike = async () => {
    if (hasLiked) return;

    // Check like limit for free users
    if (!currentUserProfile?.is_premium && dailyLikeCount >= FREE_DAILY_LIKE_LIMIT) {
      toast.error("You've reached your daily like limit", {
        description: "Upgrade to Premium for unlimited likes!",
        action: {
          label: "Upgrade",
          onClick: () => navigate('/membership')
        }
      });
      return;
    }

    setHasLiked(true);

    try {
      const result = await matchAction.mutateAsync({
        targetUserId: userId,
        action: 'like'
      });

      if (!currentUserProfile?.is_premium) {
        setDailyLikeCount(prev => prev + 1);
      }

      if (result.isMutualMatch) {
        setShowMatchModal(true);
      } else {
        toast.success('Profile liked!');
      }
    } catch (error) {
      setHasLiked(false);
      toast.error('Failed to like profile');
      console.error(error);
    }
  };

  const handleSendMessage = () => {
    setShowMatchModal(false);
    navigate('/messages');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#C46A4A] animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white">
        <AuthHeader />
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">This profile may have been deleted or hidden.</p>
            <Button onClick={() => navigate(-1)} className="bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate shared interests
  const sharedInterests = profile.interests && currentUserProfile?.interests
    ? profile.interests.filter(i => currentUserProfile.interests?.includes(i))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white">
      <AuthHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6">
          {/* Cover Photo Area */}
          <div className="h-32 bg-gradient-to-r from-[#C46A4A] to-[#D4A853]" />

          {/* Profile Photo */}
          <div className="px-6 pb-6">
            <div className="relative -mt-16 mb-4">
              <div
                className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer"
                onClick={() => profile.photos?.[0] && setSelectedPhoto(profile.photos[0])}
              >
                {profile.photos?.[0] ? (
                  <img
                    src={profile.photos[0]}
                    alt={profile.first_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#C46A4A]/20 to-[#D4A853]/20 flex items-center justify-center">
                    <span className="text-4xl font-bold text-[#C46A4A]">
                      {profile.first_name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.first_name}, {profile.age}
                  </h1>
                  {profile.is_premium && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[#C46A4A] to-[#D4A853] rounded-full">
                      <Crown className="w-3 h-3 text-white" />
                      <span className="text-xs font-medium text-white">Premium</span>
                    </div>
                  )}
                </div>
                {profile.occupation && (
                  <p className="text-gray-600 mt-1">{profile.occupation}</p>
                )}
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.city}{profile.state ? `, ${profile.state}` : ''}</span>
                </div>
              </div>

              {/* Liked indicator - only show when already liked (not mutual match) */}
              {hasLiked && !isMutualMatch && (
                <Button
                  disabled
                  className="bg-gray-200 text-gray-500 rounded-full"
                >
                  <Heart className="w-4 h-4 mr-2 fill-current" />
                  Liked
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Like counter for free users */}
        {currentUserProfile && !currentUserProfile.is_premium && !hasLiked && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-center ${
            dailyLikeCount >= FREE_DAILY_LIKE_LIMIT
              ? 'bg-red-100 text-red-700'
              : 'bg-[#C46A4A]/10 text-[#C46A4A]'
          }`}>
            <Heart className="w-4 h-4 inline mr-2" />
            {FREE_DAILY_LIKE_LIMIT - dailyLikeCount} likes left today
          </div>
        )}

        {/* Shared Interests Banner */}
        {sharedInterests.length > 0 && (
          <div className="bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#C46A4A]" />
            <span className="text-[#C46A4A] font-medium">
              You share {sharedInterests.length} {sharedInterests.length === 1 ? 'interest' : 'interests'}!
            </span>
          </div>
        )}

        {/* About Me */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="font-bold text-gray-900 mb-4">About {profile.first_name}</h3>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {profile.ethnicity && (
                <Badge className="bg-[#C46A4A]/10 text-[#C46A4A] hover:bg-[#C46A4A]/20">
                  {formatLabel(profile.ethnicity)}
                </Badge>
              )}
              {profile.religion && profile.religion !== 'prefer_not_to_say' && (
                <Badge className="bg-[#D4A853]/10 text-[#D4A853] hover:bg-[#D4A853]/20">
                  {formatLabel(profile.religion)}
                </Badge>
              )}
              {profile.marital_status && (
                <Badge variant="outline">
                  {formatLabel(profile.marital_status)}
                </Badge>
              )}
              {profile.education && (
                <Badge variant="outline">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  {formatLabel(profile.education)}
                </Badge>
              )}
              {profile.height_feet && (
                <Badge variant="outline">
                  <Ruler className="w-3 h-3 mr-1" />
                  {profile.height_feet}'{profile.height_inches || 0}"
                </Badge>
              )}
            </div>

            {profile.relationship_goal && (
              <div className="flex items-center gap-2 text-[#C46A4A]">
                <Heart className="w-4 h-4" />
                <span className="font-medium">
                  {goalLabels[profile.relationship_goal] || formatLabel(profile.relationship_goal)}
                </span>
              </div>
            )}

            {profile.personality_type && (
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span>
                  {personalityLabels[profile.personality_type] || formatLabel(profile.personality_type)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Lifestyle */}
        {(profile.diet || profile.drinking || profile.smoking || profile.languages?.length > 0) && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Lifestyle</h3>

            <div className="space-y-3">
              {profile.diet && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Utensils className="w-4 h-4" />
                  <span>{dietLabels[profile.diet] || formatLabel(profile.diet)}</span>
                </div>
              )}
              {profile.drinking && profile.drinking !== 'prefer_not_to_say' && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Wine className="w-4 h-4" />
                  <span>{drinkingLabels[profile.drinking] || formatLabel(profile.drinking)}</span>
                </div>
              )}
              {profile.smoking && profile.smoking !== 'prefer_not_to_say' && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Cigarette className="w-4 h-4" />
                  <span>{smokingLabels[profile.smoking] || formatLabel(profile.smoking)}</span>
                </div>
              )}
              {profile.languages && profile.languages.length > 0 && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Globe className="w-4 h-4" />
                  <span>{profile.languages.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cultural Values */}
        {(profile.culture_importance || profile.family_involvement || profile.festivals_celebrated?.length > 0) && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Cultural Values</h3>

            <div className="space-y-3">
              {profile.culture_importance && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Culture importance</span>
                  <Badge variant="outline">{formatLabel(profile.culture_importance)}</Badge>
                </div>
              )}
              {profile.family_involvement && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Family involvement</span>
                  <Badge variant="outline">{formatLabel(profile.family_involvement)}</Badge>
                </div>
              )}
              {profile.comfortable_long_distance !== null && profile.comfortable_long_distance !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Long distance</span>
                  <Badge variant="outline">{profile.comfortable_long_distance ? 'Open to it' : 'Not interested'}</Badge>
                </div>
              )}
              {profile.willing_to_relocate && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Willing to relocate</span>
                  <Badge variant="outline">{formatLabel(profile.willing_to_relocate)}</Badge>
                </div>
              )}
              {profile.festivals_celebrated && profile.festivals_celebrated.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Festivals celebrated</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.festivals_celebrated.map((festival, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {festival}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prompts */}
        {profile.prompts && profile.prompts.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Get to Know {profile.first_name}</h3>
            <div className="space-y-4">
              {profile.prompts.map((prompt, index) => (
                prompt.answer && (
                  <div key={index} className="bg-[#F9F2EB] rounded-xl p-4">
                    <p className="text-sm text-[#C46A4A] font-medium mb-1">{prompt.question}</p>
                    <p className="text-gray-700">{prompt.answer}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className={`py-2 ${
                    sharedInterests.includes(interest)
                      ? 'bg-[#C46A4A]/10 border-[#C46A4A] text-[#C46A4A]'
                      : ''
                  }`}
                >
                  {sharedInterests.includes(interest) && <Sparkles className="w-3 h-3 mr-1" />}
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Photos */}
        {profile.photos && profile.photos.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Photos</h3>
            <div className="grid grid-cols-3 gap-3">
              {profile.photos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Sticky Button - only show when action is available */}
        {isMutualMatch && (
          <div className="sticky bottom-4 mt-6">
            <Button
              onClick={() => navigate('/messages')}
              className="w-full bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full py-6 text-lg shadow-lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Send a Message
            </Button>
          </div>
        )}

        {!isMutualMatch && !hasLiked && (
          <div className="sticky bottom-4 mt-6">
            <Button
              onClick={handleLike}
              disabled={matchAction.isPending}
              className="w-full bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full py-6 text-lg shadow-lg"
            >
              <Heart className="w-5 h-5 mr-2" />
              Like {profile.first_name}
            </Button>
          </div>
        )}
      </main>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 text-white p-2"
            onClick={() => setSelectedPhoto(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedPhoto}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Match Modal */}
      <MatchModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        matchedProfile={profile}
        currentUser={currentUserProfile}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
