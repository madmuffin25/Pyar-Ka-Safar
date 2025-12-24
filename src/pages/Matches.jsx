import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Heart, Search, User, MessageCircle, LogOut, Loader2, Star, Users, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Matches() {
  const [activeTab, setActiveTab] = useState('matches');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Get current user's profile
  const { data: userProfiles } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.UserProfile.filter({ created_by: user.email });
    }
  });
  
  const currentUserProfile = userProfiles?.[0];
  
  // Get matches
  const { data: myMatches = [], isLoading } = useQuery({
    queryKey: ['myMatches', currentUserProfile?.id],
    queryFn: async () => {
      if (!currentUserProfile) return [];
      return base44.entities.Match.filter({ 
        user_id: currentUserProfile.id,
        is_mutual: true
      });
    },
    enabled: !!currentUserProfile
  });
  
  // Get likes sent
  const { data: likesSent = [] } = useQuery({
    queryKey: ['likesSent', currentUserProfile?.id],
    queryFn: async () => {
      if (!currentUserProfile) return [];
      return base44.entities.Match.filter({ 
        user_id: currentUserProfile.id,
        action: 'like'
      });
    },
    enabled: !!currentUserProfile
  });
  
  // Get likes received
  const { data: likesReceived = [] } = useQuery({
    queryKey: ['likesReceived', currentUserProfile?.id],
    queryFn: async () => {
      if (!currentUserProfile) return [];
      return base44.entities.Match.filter({ 
        target_user_id: currentUserProfile.id,
        action: 'like'
      });
    },
    enabled: !!currentUserProfile
  });
  
  // Get profiles for matches
  const { data: matchedProfiles = [] } = useQuery({
    queryKey: ['matchedProfiles', myMatches],
    queryFn: async () => {
      if (myMatches.length === 0) return [];
      const profileIds = myMatches.map(m => m.target_user_id);
      const allProfiles = await base44.entities.UserProfile.list();
      return allProfiles.filter(p => profileIds.includes(p.id));
    },
    enabled: myMatches.length > 0
  });
  
  const handleLogout = () => {
    base44.auth.logout();
  };

  // Start or open conversation
  const startConversationMutation = useMutation({
    mutationFn: async (targetProfile) => {
      // Check if conversation already exists
      const convs1 = await base44.entities.Conversation.filter({ 
        participant_1: currentUserProfile.id, 
        participant_2: targetProfile.id 
      });
      const convs2 = await base44.entities.Conversation.filter({ 
        participant_1: targetProfile.id, 
        participant_2: currentUserProfile.id 
      });
      
      if (convs1.length > 0) return convs1[0];
      if (convs2.length > 0) return convs2[0];
      
      // Create new conversation
      return base44.entities.Conversation.create({
        participant_1: currentUserProfile.id,
        participant_2: targetProfile.id
      });
    },
    onSuccess: () => {
      navigate(createPageUrl('Messages'));
    }
  });
  
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
              Matches ({matchedProfiles.length})
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
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#C46A4A] animate-spin" />
              </div>
            ) : matchedProfiles.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">No Matches Yet</h2>
                <p className="text-gray-600 mb-6">
                  Keep swiping to find your perfect match!
                </p>
                <Link to={createPageUrl('Dashboard')}>
                  <Button className="bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full">
                    Browse Profiles
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {matchedProfiles.map((profile) => (
                  <div 
                    key={profile.id}
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
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-[#C46A4A]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {likesReceived.length} people liked you
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