import React from 'react';
import { Shield, Lock, Eye, UserCheck, AlertTriangle, MessageSquare, Flag, Heart } from 'lucide-react';
import MandalaPattern from '@/components/ui/MandalaPattern';
import Footer from '@/components/landing/Footer';

const safetyFeatures = [
  {
    icon: UserCheck,
    title: "Profile Verification",
    description: "Look for the verified badge to connect with confidence."
  },
  {
    icon: Lock,
    title: "Secure Messaging",
    description: "Your conversations are encrypted end-to-end. Only you and your match can read your messages."
  },
  {
    icon: Eye,
    title: "Privacy Controls",
    description: "You control who sees your profile. Block or hide from specific users anytime."
  },
  {
    icon: Flag,
    title: "Report & Block",
    description: "Easy reporting tools help us maintain a safe community. Report suspicious behavior instantly."
  }
];

const safetyTips = [
  {
    title: "Protect Your Information",
    tips: [
      "Never share your home address until you trust someone completely",
      "Keep financial information private",
      "Use the app's messaging system before sharing personal contact info",
      "Be wary of requests for money or financial help"
    ]
  },
  {
    title: "Meeting in Person",
    tips: [
      "Always meet in a public place for first dates",
      "Tell a friend or family member about your plans",
      "Arrange your own transportation",
      "Trust your instincts—if something feels off, leave"
    ]
  },
  {
    title: "Spotting Red Flags",
    tips: [
      "Profiles with very few photos or vague information",
      "Requests to move off the app quickly",
      "Avoiding video calls or in-person meetings",
      "Inconsistent stories or details about their life"
    ]
  }
];

export default function Safety() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#F9F2EB] to-white overflow-hidden">
        <MandalaPattern className="absolute -top-20 -right-20 w-96 h-96 text-[#C46A4A]" opacity={0.06} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full mb-6">
              <Shield className="w-10 h-10 text-[#C46A4A]" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Your Safety is Our 
              <span className="bg-gradient-to-r from-[#C46A4A] to-[#D4A853] bg-clip-text text-transparent"> Priority</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              We're committed to creating a safe, respectful environment where you can focus on what matters—finding meaningful connections.
            </p>
          </div>
        </div>
      </section>
      
      {/* Safety Features */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#C46A4A] font-medium text-sm uppercase tracking-wider">Built-in Protection</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">
              How We Keep You Safe
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {safetyFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-[#F9F2EB] to-white rounded-2xl p-8 border border-[#C46A4A]/10 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-[#C46A4A]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Safety Tips */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[#F9F2EB] to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#C46A4A] font-medium text-sm uppercase tracking-wider">Stay Safe</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">
              Safety Tips for Online Dating
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {safetyTips.map((section, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">{section.title}</h3>
                <ul className="space-y-4">
                  {section.tips.map((tip, tIndex) => (
                    <li key={tIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#C46A4A] mt-2 flex-shrink-0" />
                      <span className="text-gray-600">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Report Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-[#8B2635] to-[#C46A4A] rounded-3xl p-10 text-center text-white">
            <AlertTriangle className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              See Something Concerning?
            </h2>
            <p className="text-white/90 mb-8 leading-relaxed">
              If you encounter inappropriate behavior, harassment, or suspicious activity, 
              please report it immediately. Our safety team reviews all reports within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#C46A4A] font-medium px-8 py-3 rounded-full hover:bg-white/90 transition-colors">
                Report an Issue
              </button>
              <button className="border-2 border-white text-white font-medium px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Privacy Policy Preview */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Privacy & Data Protection
              </h2>
              <p className="text-gray-600">
                Your data belongs to you. Here's how we protect it.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8">
                <h3 className="font-bold text-gray-900 mb-4">What We Collect</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Profile information you provide</li>
                  <li>• Photos you upload</li>
                  <li>• Messages you send through the app</li>
                  <li>• Usage data to improve your experience</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-8">
                <h3 className="font-bold text-gray-900 mb-4">How We Protect It</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• End-to-end encryption for messages</li>
                  <li>• Secure data storage with encryption</li>
                  <li>• Regular security audits</li>
                  <li>• Strict access controls for our team</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}