import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Heart, Sparkles, Search, Loader2, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useMutualMatches } from '@/hooks/useMatches';
import AuthHeader from '@/components/layout/AuthHeader';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get current user's profile
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

  // Get mutual matches count
  const { data: matches = [] } = useMutualMatches();

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#C46A4A] animate-spin" />
      </div>
    );
  }

  if (!userProfile) {
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
      <AuthHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-[#C46A4A]" />
            <span className="text-sm font-medium text-[#C46A4A]">Welcome back!</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hello, {userProfile.first_name || 'there'}!
          </h1>
        </div>

        {/* Action Cards */}
        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Browse Card */}
          <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[#C46A4A]" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Find Your Match</h2>
            <p className="text-gray-600 text-sm mb-4">
              Browse profiles and find someone special
            </p>
            <Link to={createPageUrl('Browse')}>
              <Button className="w-full bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full">
                Start Browsing
              </Button>
            </Link>
          </div>

          {/* Matches Card */}
          <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-[#C46A4A]" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Your Matches</h2>
            <p className="text-gray-600 text-sm mb-4">
              {matches.length > 0
                ? `You have ${matches.length} ${matches.length === 1 ? 'match' : 'matches'}!`
                : 'No matches yet. Keep browsing!'}
            </p>
            <Link to={createPageUrl('Matches')}>
              <Button variant="outline" className="w-full rounded-full">
                View Matches
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[#C46A4A]">{userProfile.photos?.length || 0}</div>
            <div className="text-sm text-gray-600">Photos</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[#C46A4A]">{userProfile.interests?.length || 0}</div>
            <div className="text-sm text-gray-600">Interests</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[#C46A4A]">{userProfile.languages?.length || 0}</div>
            <div className="text-sm text-gray-600">Languages</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[#C46A4A]">{userProfile.prompts?.length || 0}</div>
            <div className="text-sm text-gray-600">Prompts</div>
          </div>
        </div>
      </main>
    </div>
  );
}
