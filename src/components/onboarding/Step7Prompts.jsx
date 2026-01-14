import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, MessageSquare, Plus, X } from 'lucide-react';

const promptOptions = [
  "One thing my friends love about me…",
  "My weekend looks like…",
  "A cultural tradition I love is…",
  "Let's bond over…",
  "My love language is…",
  "A perfect date for me is…",
  "I'm looking for someone who…",
  "The way to my heart is…",
  "My most controversial opinion is…",
  "I geek out on…",
  "Two truths and a lie…",
  "I'll know it's love when…"
];

export default function Step7Prompts({ data, updateData, onNext, onBack }) {
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const prompts = data.prompts || [];
  
  const addPrompt = () => {
    if (selectedPrompt && prompts.length < 3) {
      updateData({ 
        prompts: [...prompts, { question: selectedPrompt, answer: '' }]
      });
      setSelectedPrompt('');
    }
  };
  
  const removePrompt = (index) => {
    const newPrompts = prompts.filter((_, i) => i !== index);
    updateData({ prompts: newPrompts });
  };
  
  const updatePromptAnswer = (index, answer) => {
    const newPrompts = [...prompts];
    newPrompts[index] = { ...newPrompts[index], answer };
    updateData({ prompts: newPrompts });
  };
  
  const hasValidPrompt = prompts.length > 0 && prompts.some(p => p.answer?.trim().length > 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasValidPrompt) {
      onNext();
    }
  };
  
  const availablePrompts = promptOptions.filter(
    p => !prompts.some(existing => existing.question === p)
  );
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full mb-4">
          <MessageSquare className="w-8 h-8 text-[#C46A4A]" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Prompt Questions</h2>
        <p className="text-gray-600">Add 1-3 prompts to personalize your profile</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selected Prompts */}
        {prompts.map((prompt, index) => (
          <div key={index} className="bg-[#F9F2EB] rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <Label className="text-[#C46A4A] font-medium">{prompt.question}</Label>
              <button
                type="button"
                onClick={() => removePrompt(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Textarea
              value={prompt.answer}
              onChange={(e) => updatePromptAnswer(index, e.target.value)}
              placeholder="Write your answer..."
              className="bg-white border-0 resize-none focus:ring-2 focus:ring-[#C46A4A] rounded-lg"
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-2 text-right">
              {prompt.answer.length}/200
            </p>
          </div>
        ))}
        
        {/* Add New Prompt */}
        {prompts.length < 3 && (
          <div className="space-y-3">
            <Label className="text-gray-700">Choose a prompt to answer</Label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
              {availablePrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setSelectedPrompt(prompt)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                    selectedPrompt === prompt
                      ? 'bg-gradient-to-r from-[#C46A4A] to-[#D4A853] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
            
            {selectedPrompt && (
              <Button
                type="button"
                onClick={addPrompt}
                variant="outline"
                className="w-full py-4 rounded-xl border-2 border-dashed border-[#C46A4A] text-[#C46A4A] hover:bg-[#C46A4A]/5"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add This Prompt
              </Button>
            )}
          </div>
        )}
        
        {prompts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Select a prompt above to get started</p>
          </div>
        )}
        
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
            disabled={!hasValidPrompt}
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