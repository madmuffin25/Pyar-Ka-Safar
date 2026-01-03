import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useRecommendedProfiles } from '@/hooks/useRecommendations';
import { useUnreadCount } from '@/hooks/useMessages';
import { Heart, User, MessageCircle, Sparkles, Search, LogOut, Loader2, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const formatLabel = (value) => {
  if (!value) return '';
  return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function RecommendedProfiles() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  // Fetch recommended profiles
  const { data = { profiles: [], userProfile: null }, isLoading } = useRecommendedProfiles(20);
  const { profiles: recommendedProfiles, userProfile } = data;

  // Get unread message count
  const { data: unreadCount = 0 } = useUnreadCount();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#C46A4A] animate-spin" />
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
              <Link to={createPageUrl('Dashboard')}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="rounded-full bg-[#C46A4A]/10">
                <Sparkles className="w-5 h-5 text-[#C46A4A]" />
              </Button>
              <Link to={createPageUrl('Browse')}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Search className="w-5 h-5" />
                </Button>
              </Link>
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

        {recommendedProfiles.length === 0 ? (
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
            <div className="mb-6">
              <p className="text-gray-600">
                {recommendedProfiles.length} {recommendedProfiles.length === 1 ? 'profile' : 'profiles'} recommended for you
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {recommendedProfiles.map((profile) => {
                // Calculate shared interests
                const sharedInterests = profile.interests && userProfile?.interests
                  ? profile.interests.filter(i => userProfile.interests?.includes(i))
                  : [];

                return (
                  <Link
                    key={profile.id}
                    to={createPageUrl('Dashboard')}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
                  >
                    <div className="aspect-[3/4] relative overflow-hidden">
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
                        {profile.city && (
                          <div className="flex items-center gap-1 text-sm text-white/80">
                            <MapPin className="w-3 h-3" />
                            {profile.city}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="p-3 space-y-2">
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
                        <p className="text-xs text-gray-500">
                          {sharedInterests.length} shared {sharedInterests.length === 1 ? 'interest' : 'interests'}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
