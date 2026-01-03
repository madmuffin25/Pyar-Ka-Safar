import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/api/supabaseClient';
import { useMutualMatches } from '@/hooks/useMatches';
import { calculateCompatibility } from '@/components/utils/calculateCompatibility';
import { Heart, User, MessageCircle, Sparkles, Search, LogOut, Loader2, MapPin, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Matches() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Fetch current user's profile for compatibility calculation
  const { data: userProfile } = useQuery({
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

  // Fetch mutual matches
  const { data: matches = [], isLoading } = useMutualMatches();

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
              <Button variant="ghost" size="icon" className="rounded-full bg-[#C46A4A]/10">
                <MessageCircle className="w-5 h-5 text-[#C46A4A]" />
              </Button>
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
        <div className="max-w-2xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full mb-4">
              <Heart className="w-4 h-4 text-[#C46A4A] fill-[#C46A4A]" />
              <span className="text-sm font-medium text-[#C46A4A]">Your Matches</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
            </h1>
          </div>

          {matches.length === 0 ? (
            // Empty state
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-[#C46A4A]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">No Matches Yet</h2>
              <p className="text-gray-600 mb-6">
                Keep browsing to find your perfect match! When you and someone both like each other, they'll appear here.
              </p>
              <Link to={createPageUrl('Browse')}>
                <Button className="bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full">
                  Start Browsing
                </Button>
              </Link>
            </div>
          ) : (
            // Matches grid
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matches.map((match) => (
                <MatchCard
                  key={match.match_id}
                  match={match}
                  userProfile={userProfile}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Match Card Component
function MatchCard({ match, userProfile }) {
  const compatibility = userProfile
    ? calculateCompatibility(userProfile, match)
    : null;

  const goalLabels = {
    dil_se_casual: "Dil-Se Casual",
    vibe_check: "Vibe Check",
    lets_see: "Let's See",
    light_dating: "Light Dating",
    real_connection: "Real Connection",
    long_term_serious: "Long-Term Serious",
    shaadi_ready: "Shaadi-Ready"
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Photo */}
      <div className="relative aspect-square">
        {match.photos?.[0] ? (
          <img
            src={match.photos[0]}
            alt={match.first_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#C46A4A]/20 to-[#D4A853]/20 flex items-center justify-center">
            <span className="text-5xl font-bold text-[#C46A4A]/50">
              {match.first_name?.[0]?.toUpperCase()}
            </span>
          </div>
        )}

        {/* Compatibility badge */}
        {compatibility && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-[#C46A4A] to-[#D4A853] text-white px-2 py-1 rounded-full text-xs font-medium">
            {compatibility}% Match
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-bold">
            {match.first_name}, {match.age}
          </h3>
          <div className="flex items-center gap-1 text-sm text-white/80">
            <MapPin className="w-3 h-3" />
            {match.city}, {match.state}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3">
        {match.relationship_goal && (
          <Badge className="bg-[#C46A4A]/10 text-[#C46A4A] border-0">
            <Heart className="w-3 h-3 mr-1" />
            {goalLabels[match.relationship_goal] || match.relationship_goal}
          </Badge>
        )}

        <Button
          className="w-full bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full"
          disabled
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Message Coming Soon
        </Button>
      </div>
    </div>
  );
}
