import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

const festivals = [
  "Diwali", "Holi", "Navratri", "Dussehra", "Raksha Bandhan", "Ganesh Chaturthi",
  "Durga Puja", "Pongal", "Onam", "Baisakhi", "Lohri", "Eid", "Christmas",
  "Karwa Chauth", "Janmashtami", "Maha Shivaratri", "Thanksgiving", "New Year"
];

const relocateOptions = [
  { value: "yes", label: "Yes, I'm open to relocating" },
  { value: "no", label: "No, I prefer to stay where I am" },
  { value: "maybe", label: "Maybe, depends on the opportunity" },
  { value: "for_right_person", label: "For the right person, absolutely" }
];

const familyInvolvement = [
  { value: "very_involved", label: "Very Involved - Family is everything" },
  { value: "somewhat_involved", label: "Somewhat Involved - They have input" },
  { value: "minimal", label: "Minimal - I make my own decisions" },
  { value: "independent", label: "Fully Independent" },
  { value: "prefer_not_to_say", label: "Prefer Not to Say" }
];

const cultureImportance = [
  { value: "very_important", label: "Very Important - Core to who I am" },
  { value: "important", label: "Important - I value my roots" },
  { value: "somewhat_important", label: "Somewhat Important" },
  { value: "not_important", label: "Not a Priority" }
];

export default function Step5Cultural({ data, updateData, onNext, onBack }) {
  const toggleFestival = (festival) => {
    const current = data.festivals_celebrated || [];
    const newFestivals = current.includes(festival)
      ? current.filter(f => f !== festival)
      : [...current, festival];
    updateData({ festivals_celebrated: newFestivals });
  };
  
  const isComplete =
    data.comfortable_long_distance !== undefined &&
    data.willing_to_relocate &&
    data.family_involvement &&
    data.culture_importance &&
    data.festivals_celebrated?.length > 0;

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
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Cultural Preferences</h2>
        <p className="text-gray-600">This is what makes PyarKaSafar unique</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-gray-700">Comfortable with long-distance?</Label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => updateData({ comfortable_long_distance: true })}
              className={`py-4 px-6 rounded-xl border-2 font-medium transition-all ${
                data.comfortable_long_distance === true
                  ? 'border-[#C46A4A] bg-[#C46A4A]/10 text-[#C46A4A]'
                  : 'border-gray-200 hover:border-[#C46A4A]/50 text-gray-700'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => updateData({ comfortable_long_distance: false })}
              className={`py-4 px-6 rounded-xl border-2 font-medium transition-all ${
                data.comfortable_long_distance === false
                  ? 'border-[#C46A4A] bg-[#C46A4A]/10 text-[#C46A4A]'
                  : 'border-gray-200 hover:border-[#C46A4A]/50 text-gray-700'
              }`}
            >
              No
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-700">Willing to relocate?</Label>
          <Select value={data.willing_to_relocate || ''} onValueChange={(v) => updateData({ willing_to_relocate: v })}>
            <SelectTrigger className="py-6 text-lg rounded-xl border-2 border-gray-200">
              <SelectValue placeholder="Select your preference" />
            </SelectTrigger>
            <SelectContent>
              {relocateOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-700">Family involvement level</Label>
          <Select value={data.family_involvement || ''} onValueChange={(v) => updateData({ family_involvement: v })}>
            <SelectTrigger className="py-6 text-lg rounded-xl border-2 border-gray-200">
              <SelectValue placeholder="How involved is your family?" />
            </SelectTrigger>
            <SelectContent>
              {familyInvolvement.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-700">Importance of culture/tradition</Label>
          <Select value={data.culture_importance || ''} onValueChange={(v) => updateData({ culture_importance: v })}>
            <SelectTrigger className="py-6 text-lg rounded-xl border-2 border-gray-200">
              <SelectValue placeholder="How important is culture to you?" />
            </SelectTrigger>
            <SelectContent>
              {cultureImportance.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-700">Festivals you celebrate</Label>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
            {festivals.map((festival) => (
              <button
                key={festival}
                type="button"
                onClick={() => toggleFestival(festival)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  (data.festivals_celebrated || []).includes(festival)
                    ? 'bg-gradient-to-r from-[#C46A4A] to-[#D4A853] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {festival}
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