import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import UniqueFeatures from '@/components/landing/UniqueFeatures';
import Testimonials from '@/components/landing/Testimonials';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorks />
      <UniqueFeatures />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}