import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, MapPin, Sparkles, ChevronLeft, ChevronRight, Ban, BadgeCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from 'lucide-react';

const formatLabel = (value) => {
  if (!value) return '';
  return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function ProfileCard({ profile, onLike, onPass, onBlock, compatibility, distance }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const photos = profile.photos || [];
  
  const nextPhoto = (e) => {
    e.stopPropagation();
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
    }
  };
  
  const prevPhoto = (e) => {
    e.stopPropagation();
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1);
    }
  };
  
  const goalLabels = {
    dil_se_casual: "Dil-Se Casual",
    vibe_check: "Vibe Check Only",
    lets_see: "Let's See Where It Goes",
    light_dating: "Light Dating",
    real_connection: "Real Connection",
    long_term_serious: "Long-Term Serious",
    shaadi_ready: "Shaadi-Ready 💍"
  };
  
  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md mx-auto">
      {/* Photo Section */}
      <div 
        className="relative aspect-[3/4] cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        {photos.length > 0 ? (
          <img 
            src={photos[currentPhotoIndex]}
            alt={profile.first_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#C46A4A]/20 to-[#D4A853]/20 flex items-center justify-center">
            <span className="text-6xl">{profile.first_name?.[0]?.toUpperCase()}</span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Photo Navigation */}
        {photos.length > 1 && (
          <>
            <div className="absolute top-4 left-4 right-4 flex gap-1">
              {photos.map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full transition-all ${
                    i === currentPhotoIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
        
        {/* Verified Badge (top-left) */}
        {profile.is_verified && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-green-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium shadow-lg">
            <BadgeCheck className="w-4 h-4" />
            Verified
          </div>
        )}

        {/* Compatibility Badge & Block Menu */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {compatibility && (
            <div className="bg-gradient-to-r from-[#C46A4A] to-[#D4A853] text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              {compatibility}% Match
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onBlock && onBlock(profile);
                }}
                className="text-red-600 focus:text-red-600"
              >
                <Ban className="w-4 h-4 mr-2" />
                Block User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Profile Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-3xl font-bold mb-1">
            {profile.first_name}, {profile.age}
          </h3>
          <div className="flex items-center gap-2 text-white/90 mb-3">
            <MapPin className="w-4 h-4" />
            <span>
              {profile.city}, {profile.state}
              {distance != null && ` • ${Math.round(distance)} mi`}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {profile.ethnicity && (
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                {formatLabel(profile.ethnicity)}
              </Badge>
            )}
            {profile.relationship_goal && (
              <Badge className="bg-[#C46A4A]/80 text-white border-0">
                <Heart className="w-3 h-3 mr-1" />
                {goalLabels[profile.relationship_goal] || formatLabel(profile.relationship_goal)}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {/* Expanded Details */}
      {showDetails && (
        <div className="p-6 space-y-4 border-t max-h-64 overflow-y-auto">
          {profile.prompts && profile.prompts.length > 0 && (
            <div className="space-y-3">
              {profile.prompts.map((prompt, index) => (
                prompt.answer && (
                  <div key={index} className="bg-[#F9F2EB] rounded-xl p-4">
                    <p className="text-sm text-[#C46A4A] font-medium mb-1">{prompt.question}</p>
                    <p className="text-gray-700">{prompt.answer}</p>
                  </div>
                )
              ))}
            </div>
          )}
          
          {profile.interests && profile.interests.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Interests</p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, i) => (
                  <Badge key={i} variant="outline">{interest}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="p-6 pt-4">
        <div className="flex items-center justify-center gap-6">
          <Button
            onClick={() => onPass(profile)}
            variant="outline"
            size="lg"
            className="w-16 h-16 rounded-full border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 transition-all group"
          >
            <X className="w-8 h-8 text-gray-400 group-hover:text-red-500 transition-colors" />
          </Button>

          <Button
            onClick={() => onLike(profile)}
            size="lg"
            className="w-16 h-16 rounded-full bg-gradient-to-r from-[#C46A4A] to-[#8B2635] hover:from-[#B35A3A] hover:to-[#7A2030] shadow-lg hover:shadow-xl transition-all"
          >
            <Heart className="w-8 h-8 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}