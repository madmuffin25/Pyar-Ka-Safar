import React from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";

const iceBreakers = [
  "What's the one dish from home you can't live without? 🍛",
  "Bollywood or Hollywood — what's your go-to for a movie night?",
  "If you could travel anywhere in India, where would you go?",
  "What's your favorite festival memory growing up?",
  "Chai or coffee — and how do you take it? ☕",
  "What's a hobby you've recently picked up?",
  "If you could have dinner with anyone, who would it be?",
  "What's the last show you binge-watched?",
  "Beach vacation or mountain getaway?",
  "What's a song that always puts you in a good mood?",
  "What's something on your bucket list?",
  "Describe your perfect Sunday in 3 words.",
  "What's a skill you wish you had?",
  "Early bird or night owl?",
  "What's the best advice you've ever received?"
];

export default function IceBreakerPrompts({ onSelectPrompt }) {
  // Pick 3 random prompts
  const getRandomPrompts = () => {
    const shuffled = [...iceBreakers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const [prompts] = React.useState(getRandomPrompts);

  return (
    <div className="p-4 bg-gradient-to-r from-[#F9F2EB] to-white rounded-xl border border-[#C46A4A]/10 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-[#D4A853]" />
        <span className="text-sm font-medium text-gray-700">Break the ice!</span>
      </div>
      <div className="space-y-2">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(prompt)}
            className="w-full text-left px-4 py-3 bg-white rounded-lg border border-gray-100 hover:border-[#C46A4A]/30 hover:bg-[#F9F2EB]/50 transition-all text-sm text-gray-700 flex items-center justify-between group"
          >
            <span>{prompt}</span>
            <Send className="w-4 h-4 text-[#C46A4A] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
}