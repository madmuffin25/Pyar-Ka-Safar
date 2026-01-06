import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Users, Globe, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MandalaPattern from '@/components/ui/MandalaPattern';
import Footer from '@/components/landing/Footer';

const values = [
  {
    icon: Heart,
    title: "Connection",
    description: "We believe in meaningful connections that go beyond surface-level attraction. Every feature is designed to help you find someone who truly understands you."
  },
  {
    icon: Globe,
    title: "Culture",
    description: "We celebrate Indian heritage while embracing modern relationships. Our platform honors traditions while creating space for contemporary connections."
  },
  {
    icon: Users,
    title: "Community",
    description: "PyarKaSafar is more than a dating site—it's a community of like-minded individuals who share similar values, dreams, and cultural backgrounds."
  },
  {
    icon: Shield,
    title: "Trust",
    description: "Your safety and privacy are our top priorities. With verified profiles and secure messaging, you can connect with confidence."
  }
];

/* Stats temporarily commented out
const stats = [
  { number: "50,000+", label: "Active Members" },
  { number: "10,000+", label: "Successful Matches" },
  { number: "2,000+", label: "Marriages" },
  { number: "98%", label: "Satisfaction Rate" }
];
*/

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#F9F2EB] to-white overflow-hidden">
        <MandalaPattern className="absolute -top-20 -right-20 w-96 h-96 text-[#C46A4A]" opacity={0.06} />
        <MandalaPattern className="absolute -bottom-32 -left-32 w-[500px] h-[500px] text-[#D4A853]" opacity={0.05} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-[#C46A4A] font-medium text-sm uppercase tracking-wider">About Us</span>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Our Mission is to Help You Find 
              <span className="bg-gradient-to-r from-[#C46A4A] to-[#D4A853] bg-clip-text text-transparent"> Real Love</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              PyarKaSafar was founded with a simple belief: that every Indian single in North America 
              deserves to find a partner who truly gets them—their culture, values, and dreams.
            </p>
          </div>
        </div>
      </section>
      
      {/* Story Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=600&h=500&fit=crop"
                  alt="Diverse Indian community"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-[#C46A4A] to-[#D4A853] rounded-2xl p-6 text-white shadow-xl">
                <p className="text-3xl font-bold">2025</p>
                <p className="text-white/80">Founded</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <span className="text-[#C46A4A] font-medium text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Built by Indians, for Indians
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  As first-generation Indians in America, our founders experienced firsthand the challenge of 
                  finding partners who understood both worlds—the richness of Indian culture and the realities 
                  of life in North America.
                </p>
                <p>
                  Traditional matchmaking felt outdated, while mainstream dating apps didn't account for the 
                  cultural nuances that matter so much to our community. That's why we created PyarKaSafar—a 
                  platform that bridges the gap.
                </p>
                <p>
                  Today, we're proud to have helped thousands of couples find their "safar" partner—someone to 
                  share life's journey with, celebrating Diwali and Thanksgiving alike.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[#F9F2EB] to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#C46A4A] font-medium text-sm uppercase tracking-wider">Our Values</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">
              What Drives Us Every Day
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#C46A4A]/5"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-[#C46A4A]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section - temporarily commented out
      <section className="py-20 lg:py-28 bg-gradient-to-r from-[#8B2635] via-[#C46A4A] to-[#D4A853]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="text-white">
                <p className="text-4xl lg:text-5xl font-bold mb-2">{stat.number}</p>
                <p className="text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}
      
      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <Sparkles className="w-12 h-12 text-[#D4A853] mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our community of Indian singles and find your perfect match today.
            </p>
            <Link to={createPageUrl('Onboarding')}>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-[#C46A4A] to-[#8B2635] hover:from-[#B35A3A] hover:to-[#7A2030] text-white px-10 py-6 text-lg rounded-full shadow-lg group"
              >
                Create Your Profile
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}