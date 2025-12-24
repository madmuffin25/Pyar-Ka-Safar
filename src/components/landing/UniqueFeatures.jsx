import React from 'react';
import { Shield, Users, Sparkles, Globe, Heart, CheckCircle } from 'lucide-react';
import MandalaPattern from '@/components/ui/MandalaPattern';

const features = [
  {
    icon: Globe,
    title: "Cultural Connection",
    description: "Find someone who shares your values, traditions, and understands the beauty of Indian culture."
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description: "Every profile is verified for authenticity. Connect with real people who are serious about finding love."
  },
  {
    icon: Users,
    title: "Community Focused",
    description: "Join a community of like-minded Indian singles in North America who value genuine relationships."
  },
  {
    icon: Sparkles,
    title: "Smart Matching",
    description: "Our algorithm considers cultural preferences, lifestyle, and values for better compatibility."
  },
  {
    icon: Heart,
    title: "Relationship Goals",
    description: "Whether you're looking for friendship, dating, or marriage — find people with the same intentions."
  },
  {
    icon: CheckCircle,
    title: "Privacy First",
    description: "Your data is secure. Control who sees your profile and maintain your privacy at all times."
  }
];

export default function UniqueFeatures() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#F9F2EB] via-[#FDF8F5] to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <MandalaPattern className="absolute top-0 right-0 w-80 h-80 text-[#C46A4A]" opacity={0.05} />
      <MandalaPattern className="absolute bottom-0 left-0 w-96 h-96 text-[#D4A853]" opacity={0.04} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="text-[#C46A4A] font-medium text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              What Makes 
              <span className="bg-gradient-to-r from-[#C46A4A] to-[#D4A853] bg-clip-text text-transparent"> PyarKaSafar </span>
              Unique
            </h2>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              We understand the nuances of Indian culture and the importance of finding someone who truly gets you. 
              That's why we've built a platform that celebrates our heritage while embracing modern connections.
            </p>
            
            {/* Image */}
            <div className="mt-10 relative hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1615966650071-855b15f29ad1?w=600&h=400&fit=crop"
                  alt="Indian celebration"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#D4A853]/20 rounded-full blur-2xl" />
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-[#C46A4A]/5 hover:border-[#C46A4A]/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-[#C46A4A]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}