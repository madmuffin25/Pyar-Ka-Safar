import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
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
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [profileData, setProfileData] = useState({
    country: 'USA',
    preference_age_min: 21,
    preference_age_max: 45,
    preference_distance_miles: 50
  });

  // Capture geolocation on mount (for Step 2 or later)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setProfileData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => {
          console.log('Geolocation not available or denied:', error.message);
        }
      );
    }
  }, []);

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
    if (!user) {
      toast.error('Please sign in to publish your profile');
      return;
    }

    setIsPublishing(true);
    try {
      // Prepare data for Supabase
      const supabaseData = {
        id: user.id,
        email: user.email,
        first_name: profileData.first_name,
        age: profileData.age ? parseInt(profileData.age) : null,
        gender: profileData.gender,
        country: profileData.country,
        state: profileData.state,
        city: profileData.city,
        ethnicity: profileData.ethnicity,
        religion: profileData.religion,
        photos: profileData.photos || [],
        marital_status: profileData.marital_status,
        education: profileData.education,
        occupation: profileData.occupation,
        diet: profileData.diet,
        drinking: profileData.drinking,
        smoking: profileData.smoking,
        height_feet: profileData.height_feet ? parseInt(profileData.height_feet) : null,
        height_inches: profileData.height_inches ? parseInt(profileData.height_inches) : null,
        languages: profileData.languages || [],
        comfortable_long_distance: profileData.comfortable_long_distance,
        willing_to_relocate: profileData.willing_to_relocate,
        family_involvement: profileData.family_involvement,
        culture_importance: profileData.culture_importance,
        festivals_celebrated: profileData.festivals_celebrated || [],
        interests: profileData.interests || [],
        personality_type: profileData.personality_type,
        relationship_goal: profileData.relationship_goal,
        prompts: profileData.prompts || [],
        preference_gender: profileData.preference_gender,
        preference_age_min: profileData.preference_age_min,
        preference_age_max: profileData.preference_age_max,
        preference_distance_miles: profileData.preference_distance_miles,
        preference_languages: profileData.preference_languages || [],
        profile_complete: true,
        onboarding_step: 8
      };

      // Add location coordinates if available
      if (profileData.latitude && profileData.longitude) {
        supabaseData.location_coordinates = `POINT(${profileData.longitude} ${profileData.latitude})`;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(supabaseData);

      if (error) throw error;

      toast.success('Profile published successfully!');
      navigate(createPageUrl('Dashboard'));
    } catch (error) {
      console.error('Error publishing profile:', error);
      toast.error(error.message || 'Failed to publish profile');
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
