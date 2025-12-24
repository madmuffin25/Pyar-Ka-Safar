import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, User, MapPin } from 'lucide-react';

const ethnicities = [
  { value: "north_indian", label: "North Indian" },
  { value: "south_indian", label: "South Indian" },
  { value: "gujarati", label: "Gujarati" },
  { value: "punjabi", label: "Punjabi" },
  { value: "sindhi", label: "Sindhi" },
  { value: "bengali", label: "Bengali" },
  { value: "marathi", label: "Marathi" },
  { value: "telugu", label: "Telugu" },
  { value: "tamil", label: "Tamil" },
  { value: "malayali", label: "Malayali" },
  { value: "kashmiri", label: "Kashmiri" },
  { value: "rajasthani", label: "Rajasthani" },
  { value: "bihari", label: "Bihari" },
  { value: "odia", label: "Odia" },
  { value: "assamese", label: "Assamese" },
  { value: "other", label: "Other" }
];

const religions = [
  { value: "hindu", label: "Hindu" },
  { value: "sikh", label: "Sikh" },
  { value: "muslim", label: "Muslim" },
  { value: "jain", label: "Jain" },
  { value: "christian", label: "Christian" },
  { value: "buddhist", label: "Buddhist" },
  { value: "jewish", label: "Jewish" },
  { value: "parsi", label: "Parsi" },
  { value: "spiritual", label: "Spiritual" },
  { value: "agnostic", label: "Agnostic" },
  { value: "atheist", label: "Atheist" },
  { value: "prefer_not_to_say", label: "Prefer Not to Say" }
];

const usStates = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

const canadaProvinces = ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"];

export default function Step2BasicInfo({ data, updateData, onNext, onBack }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.first_name && data.gender && data.age && data.city) {
      onNext();
    }
  };
  
  const locations = data.country === 'Canada' ? canadaProvinces : usStates;
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Tell Us About Yourself</h2>
        <p className="text-gray-600">Let's start with the basics</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="first_name" className="text-gray-700">First Name</Label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="first_name"
              value={data.first_name || ''}
              onChange={(e) => updateData({ first_name: e.target.value })}
              placeholder="Your first name"
              className="pl-12 py-6 text-lg rounded-xl border-2 border-gray-200 focus:border-[#C46A4A]"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-700">I am a</Label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 'male', label: 'Man' },
              { value: 'female', label: 'Woman' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateData({ gender: option.value })}
                className={`py-4 px-6 rounded-xl border-2 font-medium transition-all ${
                  data.gender === option.value
                    ? 'border-[#C46A4A] bg-[#C46A4A]/10 text-[#C46A4A]'
                    : 'border-gray-200 hover:border-[#C46A4A]/50 text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age" className="text-gray-700">Age</Label>
            <Input
              id="age"
              type="number"
              min="18"
              max="100"
              value={data.age || ''}
              onChange={(e) => updateData({ age: parseInt(e.target.value) })}
              placeholder="Age"
              className="py-6 text-lg rounded-xl border-2 border-gray-200 focus:border-[#C46A4A]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">Country</Label>
            <Select value={data.country || 'USA'} onValueChange={(v) => updateData({ country: v, state: '' })}>
              <SelectTrigger className="py-6 text-lg rounded-xl border-2 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USA">USA</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-700">State/Province</Label>
            <Select value={data.state || ''} onValueChange={(v) => updateData({ state: v })}>
              <SelectTrigger className="py-6 rounded-xl border-2 border-gray-200">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city" className="text-gray-700">City</Label>
            <Input
              id="city"
              value={data.city || ''}
              onChange={(e) => updateData({ city: e.target.value })}
              placeholder="Your city"
              className="py-6 rounded-xl border-2 border-gray-200 focus:border-[#C46A4A]"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-700">Ethnicity</Label>
          <Select value={data.ethnicity || ''} onValueChange={(v) => updateData({ ethnicity: v })}>
            <SelectTrigger className="py-6 text-lg rounded-xl border-2 border-gray-200">
              <SelectValue placeholder="Select your ethnicity" />
            </SelectTrigger>
            <SelectContent>
              {ethnicities.map((eth) => (
                <SelectItem key={eth.value} value={eth.value}>{eth.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-700">Religion (Optional)</Label>
          <Select value={data.religion || ''} onValueChange={(v) => updateData({ religion: v })}>
            <SelectTrigger className="py-6 text-lg rounded-xl border-2 border-gray-200">
              <SelectValue placeholder="Select your religion" />
            </SelectTrigger>
            <SelectContent>
              {religions.map((rel) => (
                <SelectItem key={rel.value} value={rel.value}>{rel.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            className="flex-1 py-6 text-lg rounded-xl bg-gradient-to-r from-[#C46A4A] to-[#8B2635] hover:from-[#B35A3A] hover:to-[#7A2030] group"
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </form>
    </div>
  );
}