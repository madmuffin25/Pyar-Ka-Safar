import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/api/supabaseClient';
import { useMutualMatches, useLikesReceived, useLikesSent } from '@/hooks/useMatches';
import { useMatchAction } from '@/hooks/useBrowse';
import AuthHeader from '@/components/layout/AuthHeader';
import { Heart, MessageCircle, Loader2, Users, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

export default function Matches() {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  // Like back action
  const matchAction = useMatchAction();

  // Filter out mutual matches from likesReceived (they already appear in Matches tab)
  const matchedUserIds = new Set(matches.map(m => m.matched_user_id));
  const pendingLikes = likesReceived.filter(profile => !matchedUserIds.has(profile.id));

  const handleLikeBack = (profile) => {
    matchAction.mutate(
      { targetUserId: profile.id, action: 'like' },
      {
        onSuccess: (result) => {
          if (result.isMutualMatch) {
            toast.success(`It's a match with ${profile.first_name}! 🎉`);
          } else {
            toast.success(`You liked ${profile.first_name}`);
          }
        },
        onError: () => {
          toast.error('Failed to like profile');
        }
      }
    );
  };

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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Matches & Likes</h1>

        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Matches ({matches.length})
            </TabsTrigger>
            <TabsTrigger value="likes" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Likes You ({pendingLikes.length})
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
              pendingLikes.length === 0 ? (
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
                  {pendingLikes.map((profile) => (
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
                        <Button
                          className="w-full bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full"
                          onClick={() => handleLikeBack(profile)}
                          disabled={matchAction.isPending}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Like Back
                        </Button>
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
                  {pendingLikes.length} people liked you
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
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                You've liked {likesSent.length} profiles
              </h2>
              <p className="text-gray-600">
                Keep swiping to make more connections!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
