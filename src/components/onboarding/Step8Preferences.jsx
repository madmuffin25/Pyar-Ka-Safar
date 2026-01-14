import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, ArrowLeft, Target, MapPin, Languages } from 'lucide-react';

const languageOptions = [
  'English', 'Hindi', 'Punjabi', 'Gujarati', 'Bengali', 'Tamil', 
  'Telugu', 'Marathi', 'Kannada', 'Malayalam', 'Urdu', 'Odia'
];

export default function Step8Preferences({ data, updateData, onNext, onBack }) {
  const isComplete = !!data.preference_gender;

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
          <Target className="w-8 h-8 text-[#C46A4A]" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Preferences</h2>
        <p className="text-gray-600">What are you looking for in a partner?</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <Label className="text-gray-700">I'm looking for</Label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: 'male', label: 'Men' },
              { value: 'female', label: 'Women' },
              { value: 'everyone', label: 'Everyone' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateData({ preference_gender: option.value })}
                className={`py-4 px-4 rounded-xl border-2 font-medium transition-all ${
                  data.preference_gender === option.value
                    ? 'border-[#C46A4A] bg-[#C46A4A]/10 text-[#C46A4A]'
                    : 'border-gray-200 hover:border-[#C46A4A]/50 text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <Label className="text-gray-700">Age Range</Label>
          <div className="bg-[#F9F2EB] rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-[#C46A4A]">
                {data.preference_age_min || 21} - {data.preference_age_max || 45}
              </span>
              <span className="text-gray-500">years old</span>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Minimum Age</label>
                <Slider
                  value={[data.preference_age_min || 21]}
                  onValueChange={([v]) => updateData({ preference_age_min: v })}
                  min={18}
                  max={70}
                  step={1}
                  className="[&_[role=slider]]:bg-[#C46A4A]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Maximum Age</label>
                <Slider
                  value={[data.preference_age_max || 45]}
                  onValueChange={([v]) => updateData({ preference_age_max: v })}
                  min={18}
                  max={70}
                  step={1}
                  className="[&_[role=slider]]:bg-[#C46A4A]"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Label className="text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#C46A4A]" />
            Maximum Distance
          </Label>
          <div className="bg-[#F9F2EB] rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-[#C46A4A]">
                {data.preference_distance_miles === null ? 'No limit' : (data.preference_distance_miles || 50)}
              </span>
              {data.preference_distance_miles !== null && <span className="text-gray-500">miles</span>}
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              {[25, 50, 100, 250, 500, null].map((distance) => (
                <button
                  key={distance ?? 'none'}
                  type="button"
                  onClick={() => updateData({ preference_distance_miles: distance })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    data.preference_distance_miles === distance
                      ? 'bg-[#C46A4A] text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-[#C46A4A]/50'
                  }`}
                >
                  {distance === null ? 'None' : `${distance} mi`}
                </button>
              ))}
            </div>
            {data.preference_distance_miles !== null && (
              <>
                <Slider
                  value={[data.preference_distance_miles || 50]}
                  onValueChange={([v]) => updateData({ preference_distance_miles: v })}
                  min={10}
                  max={500}
                  step={10}
                  className="[&_[role=slider]]:bg-[#C46A4A]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>10 mi</span>
                  <span>250 mi</span>
                  <span>500 mi</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <Label className="text-gray-700 flex items-center gap-2">
            <Languages className="w-4 h-4 text-[#C46A4A]" />
            Preferred Languages
          </Label>
          <p className="text-sm text-gray-500">Select languages you'd like your partner to speak</p>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map((lang) => {
              const selected = (data.preference_languages || []).includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    const current = data.preference_languages || [];
                    if (selected) {
                      updateData({ preference_languages: current.filter(l => l !== lang) });
                    } else {
                      updateData({ preference_languages: [...current, lang] });
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selected
                      ? 'bg-[#C46A4A] text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-[#C46A4A]/50'
                  }`}
                >
                  {lang}
                </button>
              );
            })}
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
            Preview Profile
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </form>
    </div>
  );
}