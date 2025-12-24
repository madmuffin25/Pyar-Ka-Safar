import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Heart, Search, SlidersHorizontal, MapPin, User, MessageCircle, LogOut, Loader2, X, Sparkles, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { geocodeLocation, calculateDistance } from '@/components/utils/distanceCalculator';

const formatLabel = (value) => {
  if (!value) return '';
  return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    ageMin: 18,
    ageMax: 50,
    ethnicities: [],
    religions: [],
    relationshipGoals: [],
    languages: [],
    personalityTypes: []
  });
  const [userCoords, setUserCoords] = useState(null);
  const [profileDistances, setProfileDistances] = useState({});
  
  // Get current user profile
  const { data: currentUserProfile } = useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email });
      return profiles[0];
    }
  });
  
  // Get all profiles
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['allProfiles'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const allProfiles = await base44.entities.UserProfile.filter({ profile_complete: true });
      // Filter out own profile and hidden profiles
      return allProfiles.filter(p => p.created_by !== user.email && !p.is_hidden);
    }
  });
  
  // Geocode current user location
  useEffect(() => {
    if (currentUserProfile?.city && currentUserProfile?.state) {
      geocodeLocation(currentUserProfile.city, currentUserProfile.state, base44.integrations)
        .then(coords => setUserCoords(coords));
    }
  }, [currentUserProfile]);
  
  // Calculate distances for all profiles
  useEffect(() => {
    if (!userCoords || !profiles.length) return;
    
    const calculateDistances = async () => {
      const distances = {};
      for (const profile of profiles) {
        if (profile.city && profile.state) {
          const coords = await geocodeLocation(profile.city, profile.state, base44.integrations);
          if (coords) {
            distances[profile.id] = calculateDistance(
              userCoords.latitude,
              userCoords.longitude,
              coords.latitude,
              coords.longitude
            );
          }
        }
      }
      setProfileDistances(distances);
    };
    
    calculateDistances();
  }, [userCoords, profiles]);
  
  // Apply filters
  const filteredProfiles = profiles.filter(profile => {
    // Search query
    if (searchQuery && !profile.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !profile.city?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Age filter
    if (profile.age < filters.ageMin || profile.age > filters.ageMax) {
      return false;
    }
    
    // Ethnicity filter
    if (filters.ethnicities.length > 0 && !filters.ethnicities.includes(profile.ethnicity)) {
      return false;
    }
    
    // Religion filter
    if (filters.religions.length > 0 && !filters.religions.includes(profile.religion)) {
      return false;
    }
    
    // Relationship goal filter
    if (filters.relationshipGoals.length > 0 && !filters.relationshipGoals.includes(profile.relationship_goal)) {
      return false;
    }

    // Language filter
    if (filters.languages.length > 0 && profile.languages) {
      const hasMatchingLanguage = filters.languages.some(lang => profile.languages.includes(lang));
      if (!hasMatchingLanguage) {
        return false;
      }
    }

    // Personality type filter
    if (filters.personalityTypes.length > 0 && !filters.personalityTypes.includes(profile.personality_type)) {
      return false;
    }

    // Distance filter
    if (currentUserProfile?.preference_distance_miles !== null && 
        currentUserProfile?.preference_distance_miles !== undefined &&
        profileDistances[profile.id] !== undefined) {
      if (profileDistances[profile.id] > currentUserProfile.preference_distance_miles) {
        return false;
      }
    }
    
    return true;
  });
  
  const handleLogout = () => {
    base44.auth.logout();
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
              <Link to={createPageUrl('Matches')}>
                <Button variant="ghost" size="icon" className="rounded-full">
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
      
      {/* Search and Filters */}
      <div className="sticky top-[73px] z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 rounded-full border-2 border-gray-200 focus:border-[#C46A4A]"
              />
            </div>
            
            {/* Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-full px-6 py-6">
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Matches</SheetTitle>
                </SheetHeader>
                
                <div className="mt-8 space-y-8">
                  {/* Age Range */}
                  <div className="space-y-4">
                    <label className="font-medium text-gray-900">Age Range</label>
                    <div className="text-center text-2xl font-bold text-[#C46A4A]">
                      {filters.ageMin} - {filters.ageMax}
                    </div>
                    <div className="space-y-4">
                      <Slider
                        value={[filters.ageMin]}
                        onValueChange={([v]) => setFilters(prev => ({ ...prev, ageMin: v }))}
                        min={18}
                        max={70}
                        step={1}
                      />
                      <Slider
                        value={[filters.ageMax]}
                        onValueChange={([v]) => setFilters(prev => ({ ...prev, ageMax: v }))}
                        min={18}
                        max={70}
                        step={1}
                      />
                    </div>
                  </div>
                  
                  {/* Ethnicity */}
                  <div className="space-y-2">
                    <label className="font-medium text-gray-900">Ethnicity</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {filters.ethnicities.length === 0 
                            ? "All Ethnicities" 
                            : `${filters.ethnicities.length} selected`}
                          <SlidersHorizontal className="w-4 h-4 ml-2" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-4" align="start">
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {[
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
                          ].map(eth => (
                            <label key={eth.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                              <Checkbox
                                checked={filters.ethnicities.includes(eth.value)}
                                onCheckedChange={(checked) => {
                                  setFilters(prev => ({
                                    ...prev,
                                    ethnicities: checked 
                                      ? [...prev.ethnicities, eth.value]
                                      : prev.ethnicities.filter(e => e !== eth.value)
                                  }));
                                }}
                              />
                              <span className="text-sm">{eth.label}</span>
                            </label>
                          ))}
                        </div>
                        {filters.ethnicities.length > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={() => setFilters(prev => ({ ...prev, ethnicities: [] }))}
                          >
                            Clear All
                          </Button>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* Religion */}
                  <div className="space-y-2">
                    <label className="font-medium text-gray-900">Religion</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {filters.religions.length === 0 
                            ? "All Religions" 
                            : `${filters.religions.length} selected`}
                          <SlidersHorizontal className="w-4 h-4 ml-2" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-4" align="start">
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {[
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
                            { value: 'prefer_not_to_say', label: 'Prefer Not To Say' }
                          ].map(rel => (
                            <label key={rel.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                              <Checkbox
                                checked={filters.religions.includes(rel.value)}
                                onCheckedChange={(checked) => {
                                  setFilters(prev => ({
                                    ...prev,
                                    religions: checked 
                                      ? [...prev.religions, rel.value]
                                      : prev.religions.filter(r => r !== rel.value)
                                  }));
                                }}
                              />
                              <span className="text-sm">{rel.label}</span>
                            </label>
                          ))}
                        </div>
                        {filters.religions.length > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={() => setFilters(prev => ({ ...prev, religions: [] }))}
                          >
                            Clear All
                          </Button>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* Relationship Goal */}
                  <div className="space-y-2">
                    <label className="font-medium text-gray-900">Looking For</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {filters.relationshipGoals.length === 0 
                            ? "All Goals" 
                            : `${filters.relationshipGoals.length} selected`}
                          <SlidersHorizontal className="w-4 h-4 ml-2" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-4" align="start">
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {[
                            { value: 'shaadi_ready', label: 'Shaadi-Ready' },
                            { value: 'long_term_serious', label: 'Long-Term Serious' },
                            { value: 'real_connection', label: 'Real Connection' },
                            { value: 'light_dating', label: 'Light Dating' },
                            { value: 'lets_see', label: "Let's See Where It Goes" },
                            { value: 'vibe_check', label: 'Vibe Check Only' },
                            { value: 'dil_se_casual', label: 'Dil-Se Casual' }
                          ].map(goal => (
                            <label key={goal.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                              <Checkbox
                                checked={filters.relationshipGoals.includes(goal.value)}
                                onCheckedChange={(checked) => {
                                  setFilters(prev => ({
                                    ...prev,
                                    relationshipGoals: checked 
                                      ? [...prev.relationshipGoals, goal.value]
                                      : prev.relationshipGoals.filter(g => g !== goal.value)
                                  }));
                                }}
                              />
                              <span className="text-sm">{goal.label}</span>
                            </label>
                          ))}
                        </div>
                        {filters.relationshipGoals.length > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={() => setFilters(prev => ({ ...prev, relationshipGoals: [] }))}
                          >
                            Clear All
                          </Button>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Language */}
                  <div className="space-y-2">
                    <label className="font-medium text-gray-900">Languages Spoken</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {filters.languages.length === 0 
                            ? "All Languages" 
                            : `${filters.languages.length} selected`}
                          <SlidersHorizontal className="w-4 h-4 ml-2" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-4" align="start">
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {['English', 'Hindi', 'Punjabi', 'Gujarati', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Marathi', 'Bengali', 'Urdu'].map(lang => (
                            <label key={lang} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                              <Checkbox
                                checked={filters.languages.includes(lang)}
                                onCheckedChange={(checked) => {
                                  setFilters(prev => ({
                                    ...prev,
                                    languages: checked 
                                      ? [...prev.languages, lang]
                                      : prev.languages.filter(l => l !== lang)
                                  }));
                                }}
                              />
                              <span className="text-sm">{lang}</span>
                            </label>
                          ))}
                        </div>
                        {filters.languages.length > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={() => setFilters(prev => ({ ...prev, languages: [] }))}
                          >
                            Clear All
                          </Button>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Personality Type */}
                  <div className="space-y-2">
                    <label className="font-medium text-gray-900">Personality Type</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {filters.personalityTypes.length === 0 
                            ? "All Types" 
                            : `${filters.personalityTypes.length} selected`}
                          <SlidersHorizontal className="w-4 h-4 ml-2" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-4" align="start">
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {[
                            { value: 'reserved_thoughtful', label: 'Reserved & Thoughtful' },
                            { value: 'low_key_social', label: 'Low-Key Social' },
                            { value: 'quiet_warm', label: 'Quiet but Warm' },
                            { value: 'balanced_ambivert', label: 'Balanced Ambivert' },
                            { value: 'social_explorer', label: 'Social Explorer' },
                            { value: 'full_on_outgoing', label: 'Full-On Outgoing' },
                            { value: 'total_patakha', label: 'Total Patakha' }
                          ].map(type => (
                            <label key={type.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                              <Checkbox
                                checked={filters.personalityTypes.includes(type.value)}
                                onCheckedChange={(checked) => {
                                  setFilters(prev => ({
                                    ...prev,
                                    personalityTypes: checked 
                                      ? [...prev.personalityTypes, type.value]
                                      : prev.personalityTypes.filter(t => t !== type.value)
                                  }));
                                }}
                              />
                              <span className="text-sm">{type.label}</span>
                            </label>
                          ))}
                        </div>
                        {filters.personalityTypes.length > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={() => setFilters(prev => ({ ...prev, personalityTypes: [] }))}
                          >
                            Clear All
                          </Button>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Reset Filters */}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setFilters({
                      ageMin: 18,
                      ageMax: 50,
                      ethnicities: [],
                      religions: [],
                      relationshipGoals: [],
                      languages: [],
                      personalityTypes: []
                    })}
                    >
                    Reset Filters
                    </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredProfiles.length} {filteredProfiles.length === 1 ? 'profile' : 'profiles'} found
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#C46A4A] animate-spin" />
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No profiles found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {filteredProfiles.map((profile) => (
              <div 
                key={profile.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
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
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-lg">
                      {profile.first_name}, {profile.age}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-white/80">
                      <MapPin className="w-3 h-3" />
                      {profile.city}
                      {profileDistances[profile.id] && (
                        <span className="ml-1">• {Math.round(profileDistances[profile.id])} mi</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="p-3 flex flex-wrap gap-1">
                  {profile.ethnicity && (
                    <Badge variant="secondary" className="text-xs bg-[#C46A4A]/10 text-[#C46A4A]">
                      {formatLabel(profile.ethnicity)}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}