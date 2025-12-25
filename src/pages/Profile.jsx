import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Heart, Search, User, MessageCircle, LogOut, Loader2, Camera, Edit2, MapPin, GraduationCap, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formatLabel = (value) => {
  if (!value) return '';
  return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function Profile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Get current user's profile
  const { data: profile, isLoading } = useQuery({
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

  // Calculate profile completeness
  const calculateCompleteness = () => {
    if (!profile) return 0;
    const fields = [
      'first_name', 'age', 'city', 'photos', 'ethnicity', 'religion',
      'education', 'occupation', 'diet', 'height_feet', 'interests',
      'personality_type', 'relationship_goal', 'prompts'
    ];

    let completed = 0;
    fields.forEach(field => {
      if (profile[field] && (Array.isArray(profile[field]) ? profile[field].length > 0 : true)) {
        completed++;
      }
    });

    return Math.round((completed / fields.length) * 100);
  };

  const completeness = calculateCompleteness();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
      if (error) throw error;
    },
    onSuccess: async () => {
      await signOut();
      navigate('/');
    }
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async (isHidden) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_hidden: isHidden })
        .eq('id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success(profile.is_hidden ? 'Profile is now visible' : 'Profile is now hidden');
    }
  });

  const handleDeleteProfile = () => {
    deleteMutation.mutate();
  };

  const handleToggleVisibility = () => {
    toggleVisibilityMutation.mutate(!profile.is_hidden);
  };

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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Profile Found</h2>
          <Link to={createPageUrl('Onboarding')}>
            <Button className="bg-gradient-to-r from-[#C46A4A] to-[#8B2635]">
              Create Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const goalLabels = {
    dil_se_casual: "Dil-Se Casual",
    vibe_check: "Vibe Check Only",
    lets_see: "Let's See Where It Goes",
    light_dating: "Light Dating",
    real_connection: "Real Connection",
    long_term_serious: "Long-Term Serious",
    shaadi_ready: "Shaadi-Ready"
  };

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
              <Link to={createPageUrl('Matches')}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MessageCircle className="w-5 h-5" />
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
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6">
          {/* Cover Photo Area */}
          <div className="h-32 bg-gradient-to-r from-[#C46A4A] to-[#D4A853]" />

          {/* Profile Photo */}
          <div className="px-6 pb-6">
            <div className="relative -mt-16 mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
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

              <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#C46A4A] rounded-full flex items-center justify-center text-white shadow-lg">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.first_name}, {profile.age}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.city}, {profile.state}</span>
                </div>
              </div>

              <Link to={createPageUrl('EditProfile')}>
                <Button variant="outline" className="rounded-full">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Completeness */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Profile Completeness</h3>
            <span className="text-[#C46A4A] font-bold">{completeness}%</span>
          </div>
          <Progress value={completeness} className="h-2" />
          {completeness < 100 && (
            <p className="text-sm text-gray-500 mt-3">
              Complete your profile to get more matches!
            </p>
          )}
        </div>

        {/* Quick Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="font-bold text-gray-900 mb-4">About Me</h3>

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
              {profile.education && (
                <Badge variant="outline">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  {formatLabel(profile.education)}
                </Badge>
              )}
              {profile.height_feet && (
                <Badge variant="outline">
                  {profile.height_feet}'{profile.height_inches || 0}"
                </Badge>
              )}
            </div>

            {profile.relationship_goal && (
              <div className="flex items-center gap-2 text-[#C46A4A]">
                <Heart className="w-4 h-4" />
                <span className="font-medium">{goalLabels[profile.relationship_goal] || formatLabel(profile.relationship_goal)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Prompts */}
        {profile.prompts && profile.prompts.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Prompts</h3>
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
                <Badge key={i} variant="outline" className="py-2">
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
                <div key={index} className="aspect-square rounded-xl overflow-hidden">
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

        {/* Settings Links */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <Link to={createPageUrl('Membership')} className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition-colors">
            <span className="font-medium text-gray-900">Upgrade to Premium</span>
            <Badge className="bg-gradient-to-r from-[#C46A4A] to-[#D4A853] text-white">
              Pro
            </Badge>
          </Link>
          <Link to={createPageUrl('Safety')} className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition-colors">
            <span className="font-medium text-gray-900">Privacy & Safety</span>
          </Link>
          <Link to={createPageUrl('FAQ')} className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition-colors">
            <span className="font-medium text-gray-900">Help & Support</span>
          </Link>

          <button
            onClick={handleToggleVisibility}
            disabled={toggleVisibilityMutation.isPending}
            className="w-full flex items-center justify-between p-4 border-b hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">
              {profile.is_hidden ? 'Show My Profile' : 'Hide My Profile'}
            </span>
            {toggleVisibilityMutation.isPending && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
          </button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors text-red-600">
                <span className="font-medium">Delete Account</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your profile,
                  all your photos, matches, and messages.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteProfile}
                  disabled={deleteMutation.isPending}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Delete Account'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
    </div>
  );
}
