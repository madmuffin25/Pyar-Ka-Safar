import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Heart, Sparkles } from 'lucide-react';

const interests = [
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

const relationshipGoals = [
  { value: "dil_se_casual", label: "Dil-Se Casual", emoji: "💫", desc: "Open to connections, no pressure" },
  { value: "vibe_check", label: "Vibe Check Only", emoji: "✨", desc: "Just seeing what's out there" },
  { value: "lets_see", label: "Let's See Where It Goes", emoji: "🌊", desc: "Open to possibilities" },
  { value: "light_dating", label: "Light Dating", emoji: "🌷", desc: "Getting to know new people" },
  { value: "real_connection", label: "Looking for Real Connection", emoji: "💕", desc: "Seeking something meaningful" },
  { value: "long_term_serious", label: "Long-Term Serious", emoji: "💑", desc: "Ready for a committed relationship" },
  { value: "shaadi_ready", label: "Shaadi-Ready", emoji: "💍", desc: "Marriage is the goal" }
];

export default function Step6Personality({ data, updateData, onNext, onBack }) {
  const toggleInterest = (interest) => {
    const current = data.interests || [];
    const newInterests = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    updateData({ interests: newInterests });
  };
  
  const isComplete =
    data.interests?.length > 0 &&
    data.personality_type &&
    data.relationship_goal;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isComplete) {
      onNext();
    }
  };
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-[#C46A4A]" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Personality & Interests</h2>
        <p className="text-gray-600">Show your unique personality</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <Label className="text-gray-700">Your Interests & Hobbies</Label>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
            {interests.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  (data.interests || []).includes(interest)
                    ? 'bg-gradient-to-r from-[#C46A4A] to-[#D4A853] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <Label className="text-gray-700">Personality Type</Label>
          <div className="grid gap-3">
            {personalityTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => updateData({ personality_type: type.value })}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  data.personality_type === type.value
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
        
        <div className="space-y-3">
          <Label className="text-gray-700 flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#C46A4A]" />
            Relationship Goal
          </Label>
          <div className="grid gap-3">
            {relationshipGoals.map((goal) => (
              <button
                key={goal.value}
                type="button"
                onClick={() => updateData({ relationship_goal: goal.value })}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  data.relationship_goal === goal.value
                    ? 'border-[#C46A4A] bg-[#C46A4A]/5'
                    : 'border-gray-200 hover:border-[#C46A4A]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{goal.emoji}</span>
                  <div>
                    <p className="font-medium text-gray-900">{goal.label}</p>
                    <p className="text-sm text-gray-500">{goal.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button 
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 py-6 text-lg rounded-xl border-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            disabled={!isComplete}
            className="flex-1 py-6 text-lg rounded-xl bg-gradient-to-r from-[#C46A4A] to-[#8B2635] hover:from-[#B35A3A] hover:to-[#7A2030] group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </form>
    </div>
  );
}