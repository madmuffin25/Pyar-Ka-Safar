import React from 'react';
import { UserPlus, Search, Heart } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Create Your Profile",
    description: "Sign up and share your story. Add photos, interests, and what makes you unique. Our guided process makes it easy."
  },
  {
    icon: Search,
    number: "02",
    title: "Discover Matches",
    description: "Our smart matching considers culture, values, and lifestyle. Browse profiles tailored just for you."
  },
  {
    icon: Heart,
    number: "03",
    title: "Connect & Flourish",
    description: "Start meaningful conversations, find your connection, and begin your journey to lasting love."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C46A4A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#C46A4A] font-medium text-sm uppercase tracking-wider">Simple Process</span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Finding your perfect match is just three simple steps away
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-[#C46A4A]/20 via-[#D4A853]/40 to-[#C46A4A]/20" />
          
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-gradient-to-br from-[#F9F2EB] to-white rounded-3xl p-8 lg:p-10 border border-[#C46A4A]/10 hover:border-[#C46A4A]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-[#C46A4A]" />
                </div>
                
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}