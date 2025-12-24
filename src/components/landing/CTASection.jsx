import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MandalaPattern from '@/components/ui/MandalaPattern';

export default function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-r from-[#8B2635] via-[#C46A4A] to-[#D4A853] relative overflow-hidden">
      {/* Decorative Patterns */}
      <MandalaPattern className="absolute top-0 left-0 w-80 h-80 text-white" opacity={0.1} />
      <MandalaPattern className="absolute bottom-0 right-0 w-96 h-96 text-white" opacity={0.08} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-8">
            <Heart className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Your Journey to Love Starts Here
          </h2>
          
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Join thousands of Indian singles who have found meaningful connections. 
            Your perfect match could be just a click away.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Onboarding')}>
              <Button 
                size="lg"
                className="bg-white text-[#C46A4A] hover:bg-white/90 px-10 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to={createPageUrl('Membership')}>
              <Button 
                size="lg"
                className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#C46A4A] px-10 py-6 text-lg rounded-full transition-all duration-300 font-semibold"
              >
                View Plans
              </Button>
            </Link>
          </div>
          
          <p className="mt-8 text-white/70 text-sm">
            Free to join • Verified profiles • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}