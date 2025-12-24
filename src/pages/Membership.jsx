import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles, Crown, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MandalaPattern from '@/components/ui/MandalaPattern';
import Footer from '@/components/landing/Footer';

const plans = [
  {
    name: "Free",
    price: "0",
    period: "Forever",
    description: "Start your journey with essential features",
    icon: Star,
    color: "from-gray-600 to-gray-800",
    features: [
      { text: "Create your profile", included: true },
      { text: "Upload up to 3 photos", included: true },
      { text: "Browse profiles", included: true },
      { text: "Send up to 5 likes per day", included: true },
      { text: "Unlimited likes", included: false },
      { text: "Super Likes", included: false },
    ]
  },
  {
    name: "Premium",
    price: "24.99",
    period: "per month",
    description: "Unlock your full potential with premium features",
    icon: Crown,
    popular: true,
    color: "from-[#C46A4A] to-[#8B2635]",
    features: [
      { text: "Create your profile", included: true },
      { text: "Upload up to 6 photos", included: true },
      { text: "Browse profiles", included: true },
      { text: "Unlimited likes", included: true },
      { text: "5 Super Likes per day", included: true },
    ]
  }
];

export default function Membership() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#F9F2EB] to-white overflow-hidden">
        <MandalaPattern className="absolute -top-20 -right-20 w-96 h-96 text-[#C46A4A]" opacity={0.06} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-[#C46A4A] font-medium text-sm uppercase tracking-wider">Membership Plans</span>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Find Love at 
              <span className="bg-gradient-to-r from-[#C46A4A] to-[#D4A853] bg-clip-text text-transparent"> Your Pace</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              Choose the plan that fits your journey. Upgrade anytime to unlock more features.
            </p>
            
            {/* Billing Toggle */}
            <div className="mt-10 inline-flex items-center gap-4 bg-white rounded-full p-2 shadow-md">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'monthly' 
                    ? 'bg-gradient-to-r from-[#C46A4A] to-[#8B2635] text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'yearly' 
                    ? 'bg-gradient-to-r from-[#C46A4A] to-[#8B2635] text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Plans Grid */}
      <section className="py-20 lg:py-28 -mt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-[#C46A4A] shadow-xl scale-105' 
                    : 'border-gray-100 hover:border-[#C46A4A]/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#C46A4A] to-[#8B2635] text-white text-sm font-medium px-6 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-6`}>
                  <plan.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-500 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${billingCycle === 'yearly' && plan.price !== '0' 
                      ? (parseFloat(plan.price) * 0.8 * 12).toFixed(0)
                      : plan.price}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {billingCycle === 'yearly' && plan.price !== '0' ? '/year' : `/${plan.period}`}
                  </span>
                </div>
                
                <Link to={createPageUrl('Onboarding')}>
                  <Button 
                    className={`w-full py-6 rounded-full text-lg ${
                      plan.popular
                        ? 'bg-gradient-to-r from-[#C46A4A] to-[#8B2635] hover:from-[#B35A3A] hover:to-[#7A2030] text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.price === '0' ? 'Get Started Free' : 'Choose Plan'}
                  </Button>
                </Link>
                
                <div className="mt-8 space-y-4">
                  {plan.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <X className="w-3 h-3 text-gray-400" />
                        </div>
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[#F9F2EB] to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Common Questions
            </h2>
          </div>
          
          <div className="max-w-2xl mx-auto space-y-6">
            {[
              { q: "Can I cancel anytime?", a: "Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period." },
              { q: "Is my payment secure?", a: "Absolutely. We use industry-standard encryption and never store your card details. All payments are processed securely." },
              { q: "Can I upgrade or downgrade?", a: "Yes, you can change your plan at any time. If you upgrade, you'll be charged the prorated difference." },
              { q: "What's included in the free plan?", a: "The free plan includes creating your profile, browsing matches, and sending up to 5 likes per day. Perfect for getting started!" }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}