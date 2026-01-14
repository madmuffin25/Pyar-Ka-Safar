import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Ruler } from 'lucide-react';

const maritalStatuses = [
  { value: "never_married", label: "Never Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
  { value: "separated", label: "Separated" },
  { value: "annulled", label: "Annulled" }
];

const educationLevels = [
  { value: "high_school", label: "High School" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree" },
  { value: "doctorate", label: "Doctorate (PhD)" },
  { value: "professional", label: "Professional Degree (MD, JD, etc.)" },
  { value: "other", label: "Other" }
];

const diets = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "non_veg", label: "Non-Vegetarian" },
  { value: "eggetarian", label: "Eggetarian" },
  { value: "jain_veg", label: "Jain Vegetarian" },
  { value: "pescatarian", label: "Pescatarian" }
];

const drinkingHabits = [
  { value: "never", label: "Never" },
  { value: "socially", label: "Socially" },
  { value: "regularly", label: "Regularly" },
  { value: "prefer_not_to_say", label: "Prefer Not to Say" }
];

const smokingHabits = [
  { value: "never", label: "Never" },
  { value: "socially", label: "Socially" },
  { value: "regularly", label: "Regularly" },
  { value: "trying_to_quit", label: "Trying to Quit" },
  { value: "prefer_not_to_say", label: "Prefer Not to Say" }
];

const languages = [
  "English", "Hindi", "Punjabi", "Gujarati", "Bengali", "Tamil", "Telugu", 
  "Kannada", "Malayalam", "Marathi", "Urdu", "Sindhi", "Kashmiri", "Odia",
  "Assamese", "Nepali", "Sanskrit", "French", "Spanish", "Mandarin"
];

export default function Step4Lifestyle({ data, updateData, onNext, onBack }) {
  const toggleLanguage = (lang) => {
    const current = data.languages || [];
    const newLangs = current.includes(lang)
      ? current.filter(l => l !== lang)
      : [...current, lang];
    updateData({ languages: newLangs });
  };
  
  const isComplete =
    data.marital_status &&
    data.education &&
    data.diet &&
    data.drinking &&
    data.smoking &&
    data.height_feet &&
    data.height_inches !== undefined &&
    data.height_inches !== '' &&
    data.languages?.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isComplete) {
      onNext();
    }
  };
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Lifestyle & Values</h2>
        <p className="text-gray-600">Help us find compatible matches for you</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-gray-700">Marital Status</Label>
          <Select value={data.marital_status || ''} onValueChange={(v) => updateData({ marital_status: v })}>
            <SelectTrigger className="py-6 text-lg rounded-xl border-2 border-gray-200">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {maritalStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-700">Education</Label>
          <Select value={data.education || ''} onValueChange={(v) => updateData({ education: v })}>
            <SelectTrigger className="py-6 text-lg rounded-xl border-2 border-gray-200">
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              {educationLevels.map((edu) => (
                <SelectItem key={edu.value} value={edu.value}>{edu.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="occupation" className="text-gray-700">Occupation (Optional)</Label>
          <Input
            id="occupation"
            value={data.occupation || ''}
            onChange={(e) => updateData({ occupation: e.target.value })}
            placeholder="e.g., Software Engineer, Doctor, Teacher"
            className="py-6 text-lg rounded-xl border-2 border-gray-200 focus:border-[#C46A4A]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-700">Diet</Label>
          <Select value={data.diet || ''} onValueChange={(v) => updateData({ diet: v })}>
            <SelectTrigger className="py-6 text-lg rounded-xl border-2 border-gray-200">
              <SelectValue placeholder="Select your diet" />
            </SelectTrigger>
            <SelectContent>
              {diets.map((diet) => (
                <SelectItem key={diet.value} value={diet.value}>{diet.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-700">Drinking</Label>
            <Select value={data.drinking || ''} onValueChange={(v) => updateData({ drinking: v })}>
              <SelectTrigger className="py-6 rounded-xl border-2 border-gray-200">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {drinkingHabits.map((habit) => (
                  <SelectItem key={habit.value} value={habit.value}>{habit.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">Smoking</Label>
            <Select value={data.smoking || ''} onValueChange={(v) => updateData({ smoking: v })}>
              <SelectTrigger className="py-6 rounded-xl border-2 border-gray-200">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {smokingHabits.map((habit) => (
                  <SelectItem key={habit.value} value={habit.value}>{habit.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-700 flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            Height
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <Select value={data.height_feet?.toString() || ''} onValueChange={(v) => updateData({ height_feet: parseInt(v) })}>
              <SelectTrigger className="py-6 rounded-xl border-2 border-gray-200">
                <SelectValue placeholder="Feet" />
              </SelectTrigger>
              <SelectContent>
                {[4, 5, 6, 7].map((ft) => (
                  <SelectItem key={ft} value={ft.toString()}>{ft} ft</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={data.height_inches?.toString() || ''} onValueChange={(v) => updateData({ height_inches: parseInt(v) })}>
              <SelectTrigger className="py-6 rounded-xl border-2 border-gray-200">
                <SelectValue placeholder="Inches" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(12)].map((_, i) => (
                  <SelectItem key={i} value={i.toString()}>{i} in</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-700">Languages Spoken</Label>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguage(lang)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  (data.languages || []).includes(lang)
                    ? 'bg-[#C46A4A] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {lang}
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