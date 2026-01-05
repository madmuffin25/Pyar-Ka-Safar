import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/api/supabaseClient';
import { useMutualMatches, useLikesReceived, useLikesSent } from '@/hooks/useMatches';
import { useUnreadCount } from '@/hooks/useMessages';
import { Heart, User, MessageCircle, Sparkles, Search, LogOut, Loader2, Users, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

export default function Matches() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch current user's profile for premium check
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

  // Fetch all data for tabs
  const { data: matches = [], isLoading: loadingMatches } = useMutualMatches();
  const { data: likesReceived = [], isLoading: loadingReceived } = useLikesReceived();
  const { data: likesSent = [], isLoading: loadingSent } = useLikesSent();

  // Get unread message count
  const { data: unreadCount = 0 } = useUnreadCount();

  const isLoading = loadingMatches || loadingReceived || loadingSent;

  // Start or open conversation
  const startConversationMutation = useMutation({
    mutationFn: async (targetProfile) => {
      // Check if conversation already exists
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant_1.eq.${user.id},participant_2.eq.${targetProfile.matched_user_id || targetProfile.id}),and(participant_1.eq.${targetProfile.matched_user_id || targetProfile.id},participant_2.eq.${user.id})`)
        .maybeSingle();

      if (existingConv) {
        return existingConv;
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          participant_1: user.id,
          participant_2: targetProfile.matched_user_id || targetProfile.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, targetProfile) => {
      navigate(`/chat/${targetProfile.matched_user_id || targetProfile.id}`);
    },
    onError: () => {
      toast.error('Failed to start conversation');
    }
  });

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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Matches & Likes</h1>

        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Matches ({matches.length})
            </TabsTrigger>
            <TabsTrigger value="likes" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Likes You ({likesReceived.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Sent ({likesSent.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matches">
            {matches.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">No Matches Yet</h2>
                <p className="text-gray-600 mb-6">
                  Keep swiping to find your perfect match!
                </p>
                <Link to={createPageUrl('Browse')}>
                  <Button className="bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full">
                    Browse Profiles
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {matches.map((profile) => (
                  <div
                    key={profile.match_id}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    <div className="aspect-square relative">
                      {profile.photos?.[0] ? (
                        <img
                          src={profile.photos[0]}
                          alt={profile.first_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#C46A4A]/20 to-[#D4A853]/20 flex items-center justify-center">
                          <span className="text-3xl font-bold text-[#C46A4A]">
                            {profile.first_name?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-bold">{profile.first_name}, {profile.age}</h3>
                        <p className="text-sm text-white/80">{profile.city}</p>
                      </div>
                    </div>

                    <div className="p-3">
                      <Button
                        className="w-full bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full"
                        onClick={() => startConversationMutation.mutate(profile)}
                        disabled={startConversationMutation.isPending}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="likes">
            {userProfile?.is_premium ? (
              // Premium users can see who liked them
              likesReceived.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-[#C46A4A]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">No Likes Yet</h2>
                  <p className="text-gray-600">
                    When someone likes your profile, they'll appear here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {likesReceived.map((profile) => (
                    <div
                      key={profile.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                    >
                      <div className="aspect-square relative">
                        {profile.photos?.[0] ? (
                          <img
                            src={profile.photos[0]}
                            alt={profile.first_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#C46A4A]/20 to-[#D4A853]/20 flex items-center justify-center">
                            <span className="text-3xl font-bold text-[#C46A4A]">
                              {profile.first_name?.[0]?.toUpperCase()}
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="font-bold">{profile.first_name}, {profile.age}</h3>
                          <p className="text-sm text-white/80">{profile.city}</p>
                        </div>
                      </div>

                      <div className="p-3">
                        <Link to={`/browse`}>
                          <Button className="w-full bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full">
                            <Heart className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              // Free users see upgrade prompt
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-[#C46A4A]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {likesReceived.length} {likesReceived.length === 1 ? 'person liked' : 'people liked'} you
                </h2>
                <p className="text-gray-600 mb-6">
                  Upgrade to Premium to see who likes you
                </p>
                <Link to={createPageUrl('Membership')}>
                  <Button className="bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full">
                    Upgrade to Premium
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent">
            {likesSent.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  You haven't liked anyone yet
                </h2>
                <p className="text-gray-600 mb-6">
                  Start browsing to find your match!
                </p>
                <Link to={createPageUrl('Browse')}>
                  <Button className="bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full">
                    Browse Profiles
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  You've liked {likesSent.length} {likesSent.length === 1 ? 'profile' : 'profiles'}
                </h2>
                <p className="text-gray-600">
                  Keep swiping to make more connections!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
