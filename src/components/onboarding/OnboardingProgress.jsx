import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  "Account",
  "Basic Info",
  "Photos",
  "Lifestyle",
  "Cultural",
  "Personality",
  "Prompts",
  "Preferences"
];

export default function OnboardingProgress({ currentStep }) {
  return (
    <div className="w-full px-4 py-6">
      {/* Mobile View - Simple Progress Bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Step {currentStep} of {steps.length}</span>
          <span className="text-sm text-[#C46A4A] font-medium">{steps[currentStep - 1]}</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#C46A4A] to-[#D4A853] transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Desktop View - Step Indicators */}
      <div className="hidden md:flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;
          
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center relative">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-[#C46A4A] to-[#D4A853] text-white' 
                      : isCurrent 
                        ? 'bg-white border-2 border-[#C46A4A] text-[#C46A4A]' 
                        : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                </div>
                <span 
                  className={`mt-2 text-xs font-medium whitespace-nowrap ${
                    isCurrent ? 'text-[#C46A4A]' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {step}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2">
                  <div className={`h-0.5 transition-all duration-300 ${
                    currentStep > stepNumber 
                      ? 'bg-gradient-to-r from-[#C46A4A] to-[#D4A853]' 
                      : 'bg-gray-200'
                  }`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}