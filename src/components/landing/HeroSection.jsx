import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MandalaPattern from '@/components/ui/MandalaPattern';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-[#F9F2EB] via-white to-[#FDF8F5]">
      {/* Decorative Mandala Patterns */}
      <MandalaPattern className="absolute -top-20 -right-20 w-96 h-96 text-[#C46A4A]" opacity={0.08} />
      <MandalaPattern className="absolute -bottom-32 -left-32 w-[500px] h-[500px] text-[#D4A853]" opacity={0.06} />
      
      {/* Subtle Paisley Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C46A4A] to-transparent opacity-30" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8 max-w-xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#C46A4A]/20 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#D4A853]" />
              <span className="text-sm font-medium text-[#8B2635]">Where Culture Meets Connection</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-900">Find Your Perfect Match.</span>
              <br />
              <span className="bg-gradient-to-r from-[#C46A4A] via-[#8B2635] to-[#D4A853] bg-clip-text text-transparent">
                Begin Your Pyar Ka Safar.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              A space for Indian singles in the USA & Canada to connect, bond, and build lasting love. 
              Your journey to finding meaningful relationships starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to={createPageUrl('Onboarding')}>
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-[#C46A4A] to-[#8B2635] hover:from-[#B35A3A] hover:to-[#7A2030] text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Join Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to={createPageUrl('About')}>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto border-2 border-[#C46A4A] text-[#C46A4A] hover:bg-[#C46A4A] hover:text-white px-8 py-6 text-lg rounded-full transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>
            
{/*
            {/* Trust Indicators */}
            {/* <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Verified Profiles</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#D4A853]" />
                <span>10,000+ Members</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#C46A4A]" />
                <span>100% Secure</span>
              </div>
            </div>
*/}
          </div>
          
          {/* Hero Image Grid */}
          <div className="relative hidden lg:block">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main Image */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1617376431454-8195cf1fd668?w=600&h=750&fit=crop"
                  alt="Happy couple"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -left-8 top-20 bg-white rounded-2xl p-4 shadow-xl z-20 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#C46A4A] to-[#D4A853] flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">New Match!</p>
                    <p className="text-sm text-gray-500">98% Compatible</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-4 bottom-32 bg-white rounded-2xl p-4 shadow-xl z-20 animate-float-delayed">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Raj liked you</p>
                    <p className="text-sm text-[#C46A4A]">Say hi! 👋</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#D4A853]/20 rounded-full blur-2xl" />
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-[#C46A4A]/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 67.5C1200 60 1320 45 1380 37.5L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 4s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
}