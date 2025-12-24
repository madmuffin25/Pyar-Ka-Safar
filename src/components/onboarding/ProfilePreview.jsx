import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, MapPin, Briefcase, GraduationCap, Heart, Sparkles, Loader2 } from 'lucide-react';

const formatLabel = (value) => {
  if (!value) return '';
  return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function ProfilePreview({ data, onBack, onPublish, isPublishing }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const photos = data.photos || [];
  
  const personalityLabels = {
    reserved_thoughtful: "Reserved & Thoughtful",
    low_key_social: "Low-Key Social",
    quiet_warm: "Quiet But Warm",
    balanced_ambivert: "Balanced Ambivert",
    social_explorer: "Social Explorer",
    full_on_outgoing: "Full-On Outgoing",
    total_patakha: "Total Patakha 🔥"
  };
  
  const goalLabels = {
    dil_se_casual: "Dil-Se Casual",
    vibe_check: "Vibe Check Only",
    lets_see: "Let's See Where It Goes",
    light_dating: "Light Dating",
    real_connection: "Looking for Real Connection",
    long_term_serious: "Long-Term Serious",
    shaadi_ready: "Shaadi-Ready 💍"
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-[#C46A4A]" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Preview Your Profile</h2>
        <p className="text-gray-600">This is how others will see you</p>
      </div>
      
      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Photo Carousel */}
        <div className="relative aspect-[3/4]">
          {photos.length > 0 ? (
            <>
              <img 
                src={photos[currentPhotoIndex]}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Photo Indicators */}
              {photos.length > 1 && (
                <div className="absolute top-4 left-4 right-4 flex gap-1">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPhotoIndex(i)}
                      className={`flex-1 h-1 rounded-full transition-all ${
                        i === currentPhotoIndex ? 'bg-white' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}
              
              {/* Name & Age Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-3xl font-bold mb-1">
                  {data.first_name}, {data.age}
                </h3>
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="w-4 h-4" />
                  <span>{data.city}, {data.state}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No photos</span>
            </div>
          )}
        </div>
        
        {/* Profile Details */}
        <div className="p-6 space-y-6">
          {/* Quick Info */}
          <div className="flex flex-wrap gap-2">
            {data.ethnicity && (
              <Badge variant="secondary" className="bg-[#C46A4A]/10 text-[#C46A4A] hover:bg-[#C46A4A]/20">
                {formatLabel(data.ethnicity)}
              </Badge>
            )}
            {data.religion && data.religion !== 'prefer_not_to_say' && (
              <Badge variant="secondary" className="bg-[#D4A853]/10 text-[#D4A853] hover:bg-[#D4A853]/20">
                {formatLabel(data.religion)}
              </Badge>
            )}
            {data.education && (
              <Badge variant="outline" className="border-gray-200">
                <GraduationCap className="w-3 h-3 mr-1" />
                {formatLabel(data.education)}
              </Badge>
            )}
            {data.height_feet && (
              <Badge variant="outline" className="border-gray-200">
                {data.height_feet}'{data.height_inches || 0}"
              </Badge>
            )}
          </div>
          
          {/* Relationship Goal */}
          {data.relationship_goal && (
            <div className="flex items-center gap-2 text-[#C46A4A]">
              <Heart className="w-4 h-4" />
              <span className="font-medium">{goalLabels[data.relationship_goal]}</span>
            </div>
          )}
          
          {/* Prompts */}
          {data.prompts && data.prompts.length > 0 && (
            <div className="space-y-4">
              {data.prompts.map((prompt, index) => (
                prompt.answer && (
                  <div key={index} className="bg-[#F9F2EB] rounded-xl p-4">
                    <p className="text-sm text-[#C46A4A] font-medium mb-1">{prompt.question}</p>
                    <p className="text-gray-700">{prompt.answer}</p>
                  </div>
                )
              ))}
            </div>
          )}
          
          {/* Interests */}
          {data.interests && data.interests.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Interests</p>
              <div className="flex flex-wrap gap-2">
                {data.interests.slice(0, 8).map((interest, index) => (
                  <Badge key={index} variant="outline" className="border-gray-200">
                    {interest}
                  </Badge>
                ))}
                {data.interests.length > 8 && (
                  <Badge variant="outline" className="border-gray-200">
                    +{data.interests.length - 8} more
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {/* Personality */}
          {data.personality_type && (
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4A853]" />
              <span className="text-gray-700">{personalityLabels[data.personality_type]}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <Button 
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 py-6 text-lg rounded-xl border-2"
          disabled={isPublishing}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Edit
        </Button>
        <Button 
          onClick={onPublish}
          disabled={isPublishing}
          className="flex-1 py-6 text-lg rounded-xl bg-gradient-to-r from-[#C46A4A] to-[#8B2635] hover:from-[#B35A3A] hover:to-[#7A2030] group"
        >
          {isPublishing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Check className="w-5 h-5 mr-2" />
              Publish Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
}