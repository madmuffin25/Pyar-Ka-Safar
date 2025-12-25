import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Heart, User, MessageCircle, Sparkles, Search, LogOut, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user, signOut } = useAuth();
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
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user
  });

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

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

        {/* Coming Soon Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-[#C46A4A]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Matching Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              Your profile is set up! The matching feature will be available in the next update.
              In the meantime, you can view and edit your profile.
            </p>
            <div className="flex flex-col gap-3">
              <Link to={createPageUrl('Profile')}>
                <Button className="w-full bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full">
                  View My Profile
                </Button>
              </Link>
              <Link to={createPageUrl('EditProfile')}>
                <Button variant="outline" className="w-full rounded-full">
                  Edit Profile
                </Button>
              </Link>
            </div>
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
