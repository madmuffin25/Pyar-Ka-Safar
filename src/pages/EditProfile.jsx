import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Loader2, Trash2, Plus, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

const ethnicityOptions = [
  { value: 'north_indian', label: 'North Indian' },
  { value: 'south_indian', label: 'South Indian' },
  { value: 'gujarati', label: 'Gujarati' },
  { value: 'punjabi', label: 'Punjabi' },
  { value: 'sindhi', label: 'Sindhi' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'marathi', label: 'Marathi' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'malayali', label: 'Malayali' },
  { value: 'kashmiri', label: 'Kashmiri' },
  { value: 'rajasthani', label: 'Rajasthani' },
  { value: 'bihari', label: 'Bihari' },
  { value: 'odia', label: 'Odia' },
  { value: 'assamese', label: 'Assamese' },
  { value: 'other', label: 'Other' }
];

const religionOptions = [
  { value: 'hindu', label: 'Hindu' },
  { value: 'sikh', label: 'Sikh' },
  { value: 'muslim', label: 'Muslim' },
  { value: 'jain', label: 'Jain' },
  { value: 'christian', label: 'Christian' },
  { value: 'buddhist', label: 'Buddhist' },
  { value: 'jewish', label: 'Jewish' },
  { value: 'parsi', label: 'Parsi' },
  { value: 'spiritual', label: 'Spiritual' },
  { value: 'agnostic', label: 'Agnostic' },
  { value: 'atheist', label: 'Atheist' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' }
];

const dietOptions = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'non_veg', label: 'Non-Vegetarian' },
  { value: 'eggetarian', label: 'Eggetarian' },
  { value: 'jain_veg', label: 'Jain Vegetarian' },
  { value: 'pescatarian', label: 'Pescatarian' }
];

const drinkingOptions = [
  { value: 'never', label: 'Never' },
  { value: 'socially', label: 'Socially' },
  { value: 'regularly', label: 'Regularly' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' }
];

const smokingOptions = [
  { value: 'never', label: 'Never' },
  { value: 'socially', label: 'Socially' },
  { value: 'regularly', label: 'Regularly' },
  { value: 'trying_to_quit', label: 'Trying to quit' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' }
];

const relationshipGoals = [
  { value: 'dil_se_casual', label: 'Dil-Se Casual' },
  { value: 'vibe_check', label: 'Vibe Check Only' },
  { value: 'lets_see', label: "Let's See Where It Goes" },
  { value: 'light_dating', label: 'Light Dating' },
  { value: 'real_connection', label: 'Real Connection' },
  { value: 'long_term_serious', label: 'Long-Term Serious' },
  { value: 'shaadi_ready', label: 'Shaadi-Ready 💍' }
];

const interestOptions = [
  "Bollywood", "Hollywood", "Cooking", "Fitness", "Travel", "Music", "Dance",
  "Spirituality", "Reading", "Cricket", "Hiking", "Photography", "Art",
  "Gaming", "Yoga", "Meditation", "Fashion", "Technology", "Startups",
  "Food & Dining", "Wine Tasting", "Coffee", "Netflix", "Sports", "Volunteering",
  "Pets", "Nature", "Concerts", "Theater", "Stand-up Comedy", "Podcasts"
];

const personalityTypes = [
  { value: "reserved_thoughtful", label: "Reserved & Thoughtful", emoji: "🤔", desc: "I'm introspective and prefer deep conversations" },
  { value: "low_key_social", label: "Low-Key Social", emoji: "😌", desc: "I enjoy small gatherings over big parties" },
  { value: "quiet_warm", label: "Quiet But Warm", emoji: "🌸", desc: "I may be quiet at first, but I'm very caring" },
  { value: "balanced_ambivert", label: "Balanced Ambivert", emoji: "⚖️", desc: "Best of both worlds - social and reflective" },
  { value: "social_explorer", label: "Social Explorer", emoji: "🦋", desc: "I love meeting new people and trying new things" },
  { value: "full_on_outgoing", label: "Full-On Outgoing", emoji: "🎉", desc: "Life of the party, always ready for fun" },
  { value: "total_patakha", label: "Total Patakha 🔥", emoji: "💥", desc: "Bold, vibrant, and unapologetically myself" }
];

const languageOptions = [
  'English', 'Hindi', 'Punjabi', 'Gujarati', 'Bengali', 'Tamil',
  'Telugu', 'Marathi', 'Kannada', 'Malayalam', 'Urdu', 'Odia'
];

const FREE_PHOTO_LIMIT = 3;
const PREMIUM_PHOTO_LIMIT = 6;

export default function EditProfile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [formData, setFormData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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

  useEffect(() => {
    if (profile && !formData) {
      setFormData({ ...profile });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success('Profile updated successfully!');
      navigate(createPageUrl('Profile'));
    }
  });

  const maxPhotos = formData?.is_premium ? PREMIUM_PHOTO_LIMIT : FREE_PHOTO_LIMIT;

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const currentPhotos = formData?.photos || [];

    // Check photo limit
    if (currentPhotos.length >= maxPhotos) {
      if (!formData?.is_premium) {
        toast.error(`Free users can upload up to ${FREE_PHOTO_LIMIT} photos`, {
          description: "Upgrade to Premium for up to 6 photos!",
          action: {
            label: "Upgrade",
            onClick: () => navigate('/membership')
          }
        });
      } else {
        toast.error(`Maximum ${PREMIUM_PHOTO_LIMIT} photos allowed`);
      }
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${uuidv4()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        photos: [...(prev.photos || []), publicUrl]
      }));
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const toggleInterest = (interest) => {
    const current = formData.interests || [];
    if (current.includes(interest)) {
      setFormData(prev => ({ ...prev, interests: current.filter(i => i !== interest) }));
    } else {
      setFormData(prev => ({ ...prev, interests: [...current, interest] }));
    }
  };

  const toggleLanguage = (lang) => {
    const current = formData.languages || [];
    if (current.includes(lang)) {
      setFormData(prev => ({ ...prev, languages: current.filter(l => l !== lang) }));
    } else {
      setFormData(prev => ({ ...prev, languages: [...current, lang] }));
    }
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  if (isLoading || !formData) {
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
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('Profile')}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
            </div>
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Basic Info */}
          <TabsContent value="basic" className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input
                    value={formData.first_name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={formData.city || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    value={formData.state || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Height (feet)</Label>
                  <Input
                    type="number"
                    value={formData.height_feet || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, height_feet: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Height (inches)</Label>
                  <Input
                    type="number"
                    value={formData.height_inches || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, height_inches: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Occupation</Label>
                <Input
                  value={formData.occupation || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900">Background</h3>
              
              <div className="space-y-2">
                <Label>Ethnicity</Label>
                <Select
                  value={formData.ethnicity || ''}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, ethnicity: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select ethnicity" /></SelectTrigger>
                  <SelectContent>
                    {ethnicityOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Religion</Label>
                <Select
                  value={formData.religion || ''}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, religion: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select religion" /></SelectTrigger>
                  <SelectContent>
                    {religionOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Languages</Label>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        (formData.languages || []).includes(lang)
                          ? 'bg-[#C46A4A] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900">Interests & Hobbies</h3>
              <p className="text-sm text-gray-500">Select your interests</p>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {interestOptions.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      (formData.interests || []).includes(interest)
                        ? 'bg-[#C46A4A] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900">Personality Type</h3>
              <p className="text-sm text-gray-500">How would you describe yourself?</p>
              <div className="grid gap-3">
                {personalityTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, personality_type: type.value }))}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      formData.personality_type === type.value
                        ? 'border-[#C46A4A] bg-[#C46A4A]/5'
                        : 'border-gray-200 hover:border-[#C46A4A]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{type.emoji}</span>
                      <div>
                        <p className="font-medium text-gray-900">{type.label}</p>
                        <p className="text-sm text-gray-500">{type.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Photos */}
          <TabsContent value="photos">
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">Photos</h3>
                  <p className="text-sm text-gray-500">
                    Add up to {maxPhotos} photos
                    {!formData?.is_premium && (
                      <span className="text-[#C46A4A]"> (Premium: 6)</span>
                    )}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {(formData.photos || []).length}/{maxPhotos}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {(formData.photos || []).map((photo, index) => (
                  <div key={index} className="aspect-square rounded-xl overflow-hidden relative group">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {(formData.photos || []).length < maxPhotos && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#C46A4A] transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-500 mt-2">Add Photo</span>
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Lifestyle */}
          <TabsContent value="lifestyle" className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900">Lifestyle</h3>
              
              <div className="space-y-2">
                <Label>Diet</Label>
                <Select
                  value={formData.diet || ''}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, diet: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select diet" /></SelectTrigger>
                  <SelectContent>
                    {dietOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Drinking</Label>
                <Select
                  value={formData.drinking || ''}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, drinking: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {drinkingOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Smoking</Label>
                <Select
                  value={formData.smoking || ''}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, smoking: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {smokingOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900">Relationship Goals</h3>
              
              <div className="space-y-2">
                {relationshipGoals.map(goal => (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, relationship_goal: goal.value }))}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                      formData.relationship_goal === goal.value
                        ? 'border-[#C46A4A] bg-[#C46A4A]/10 text-[#C46A4A]'
                        : 'border-gray-200 hover:border-[#C46A4A]/50'
                    }`}
                  >
                    {goal.label}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900">Partner Preferences</h3>
              
              <div className="space-y-2">
                <Label>Looking for</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'male', label: 'Men' },
                    { value: 'female', label: 'Women' },
                    { value: 'everyone', label: 'Everyone' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, preference_gender: opt.value }))}
                      className={`py-3 rounded-xl border-2 font-medium transition-all ${
                        formData.preference_gender === opt.value
                          ? 'border-[#C46A4A] bg-[#C46A4A]/10 text-[#C46A4A]'
                          : 'border-gray-200 hover:border-[#C46A4A]/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Age</Label>
                  <Input
                    type="number"
                    value={formData.preference_age_min || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, preference_age_min: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Age</Label>
                  <Input
                    type="number"
                    value={formData.preference_age_max || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, preference_age_max: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Max Distance (miles)</Label>
                <Input
                  type="number"
                  value={formData.preference_distance_miles || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, preference_distance_miles: parseInt(e.target.value) }))}
                  placeholder="Leave empty for no limit"
                />
              </div>

              <div className="space-y-2">
                <Label>Preferred Languages</Label>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        const current = formData.preference_languages || [];
                        if (current.includes(lang)) {
                          setFormData(prev => ({ ...prev, preference_languages: current.filter(l => l !== lang) }));
                        } else {
                          setFormData(prev => ({ ...prev, preference_languages: [...current, lang] }));
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        (formData.preference_languages || []).includes(lang)
                          ? 'bg-[#C46A4A] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}