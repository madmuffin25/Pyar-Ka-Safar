import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import MandalaPattern from '@/components/ui/MandalaPattern';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress';
import Step1Account from '@/components/onboarding/Step1Account';
import Step2BasicInfo from '@/components/onboarding/Step2BasicInfo';
import Step3Photos from '@/components/onboarding/Step3Photos';
import Step4Lifestyle from '@/components/onboarding/Step4Lifestyle';
import Step5Cultural from '@/components/onboarding/Step5Cultural';
import Step6Personality from '@/components/onboarding/Step6Personality';
import Step7Prompts from '@/components/onboarding/Step7Prompts';
import Step8Preferences from '@/components/onboarding/Step8Preferences';
import ProfilePreview from '@/components/onboarding/ProfilePreview';

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [profileData, setProfileData] = useState({
    country: 'USA',
    preference_age_min: 21,
    preference_age_max: 45,
    preference_distance_miles: 50
  });
  
  const updateData = (newData) => {
    setProfileData(prev => ({ ...prev, ...newData }));
  };
  
  const nextStep = () => {
    if (currentStep === 8) {
      setShowPreview(true);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    if (showPreview) {
      setShowPreview(false);
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const publishProfile = async () => {
    setIsPublishing(true);
    try {
      await base44.entities.UserProfile.create({
        ...profileData,
        profile_complete: true,
        onboarding_step: 8
      });
      navigate(createPageUrl('Dashboard'));
    } catch (error) {
      console.error('Error publishing profile:', error);
    } finally {
      setIsPublishing(false);
    }
  };
  
  const renderStep = () => {
    if (showPreview) {
      return (
        <ProfilePreview 
          data={profileData}
          onBack={prevStep}
          onPublish={publishProfile}
          isPublishing={isPublishing}
        />
      );
    }
    
    const stepProps = {
      data: profileData,
      updateData,
      onNext: nextStep,
      onBack: prevStep
    };
    
    switch (currentStep) {
      case 1: return <Step1Account {...stepProps} />;
      case 2: return <Step2BasicInfo {...stepProps} />;
      case 3: return <Step3Photos {...stepProps} />;
      case 4: return <Step4Lifestyle {...stepProps} />;
      case 5: return <Step5Cultural {...stepProps} />;
      case 6: return <Step6Personality {...stepProps} />;
      case 7: return <Step7Prompts {...stepProps} />;
      case 8: return <Step8Preferences {...stepProps} />;
      default: return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] via-white to-[#FDF8F5] relative overflow-hidden">
      {/* Decorative Patterns */}
      <MandalaPattern className="absolute -top-40 -right-40 w-[500px] h-[500px] text-[#C46A4A]" opacity={0.04} />
      <MandalaPattern className="absolute -bottom-40 -left-40 w-[600px] h-[600px] text-[#D4A853]" opacity={0.03} />
      
      {/* Header */}
      <header className="relative z-10 py-6 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PyarKaSafar</span>
          </Link>
        </div>
      </header>
      
      {/* Progress Bar */}
      {!showPreview && <OnboardingProgress currentStep={currentStep} />}
      
      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
        {renderStep()}
      </main>
    </div>
  );
}