import React, { useState } from 'react';
import { ChevronDown, Search, MessageCircle, Mail, Phone } from 'lucide-react';
import { Input } from "@/components/ui/input";
import MandalaPattern from '@/components/ui/MandalaPattern';
import Footer from '@/components/landing/Footer';

const faqCategories = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I create an account?",
        a: "Creating an account is easy! Click 'Join Now' on our homepage and follow the guided onboarding process. You can sign up with your email, Google, Apple, or phone number. Our 8-step process takes about 5-10 minutes."
      },
      {
        q: "Is PyarKaSafar free to use?",
        a: "Yes! You can create a profile, browse matches, and send likes for free. Premium features like unlimited likes, seeing who liked you, and advanced filters require a subscription."
      },
      {
        q: "What makes PyarKaSafar different from other dating apps?",
        a: "PyarKaSafar is specifically designed for Indian singles in the USA and Canada. We understand cultural nuances, family values, and traditions that matter to our community. Our matching algorithm considers cultural compatibility along with lifestyle preferences."
      },
      {
        q: "Can I use PyarKaSafar if I'm not Indian?",
        a: "While PyarKaSafar is designed primarily for Indian singles and those interested in Indian culture, we welcome anyone who respects and appreciates our community values."
      }
    ]
  },
  {
    category: "Profile & Photos",
    questions: [
      {
        q: "How many photos can I upload?",
        a: "Free members can upload up to 3 photos, while Premium members can upload up to 6 photos. We recommend having at least 2-3 clear photos that show your face."
      },
      {
        q: "What kind of photos should I use?",
        a: "Use clear, recent photos that show your face. Avoid heavy filters, group photos where you're hard to identify, and blurry images. A mix of headshots and full-body photos works best."
      },
      {
        q: "How do I verify my profile?",
        a: "Profile verification is done through photo verification. We'll ask you to take a selfie in a specific pose to match against your profile photos. This helps ensure authenticity."
      },
      {
        q: "Can I hide my profile?",
        a: "Yes! You can pause your profile at any time from settings. This makes you invisible to other members until you unpause."
      }
    ]
  },
  {
    category: "Matching & Messaging",
    questions: [
      {
        q: "How does matching work?",
        a: "When you like someone and they like you back, it's a match! You can then start messaging each other. Our algorithm also shows you recommended matches based on compatibility."
      },
      {
        q: "What's Profile Boost?",
        a: "Profile Boost makes your profile appear first in Browse results, increasing your visibility to potential matches. Premium members get Profile Boost automatically."
      },
      {
        q: "Can I see who liked me?",
        a: "Yes, this is a Premium feature. With Premium membership, you can see everyone who has liked your profile and decide if you want to match with them."
      },
      {
        q: "How do icebreaker prompts work?",
        a: "Icebreaker prompts are conversation starters that appear when you match. They help break the ice with fun, thoughtful questions based on your profiles."
      }
    ]
  },
  {
    category: "Subscription & Billing",
    questions: [
      {
        q: "What's included in Premium?",
        a: "Premium includes unlimited likes, Profile Boost (appear first in Browse), upload up to 6 photos, seeing who liked you, advanced filters, and priority in search results."
      },
      {
        q: "How do I cancel my subscription?",
        a: "You can cancel anytime from your account settings. Your premium features will remain active until the end of your billing period."
      },
      {
        q: "Can I get a refund?",
        a: "We offer refunds within 7 days of purchase if you haven't used premium features. Contact our support team for assistance."
      }
    ]
  },
  {
    category: "Safety & Privacy",
    questions: [
      {
        q: "How do you verify profiles?",
        a: "We use photo verification technology to match selfies with profile photos. Verified profiles display a verification badge."
      },
      {
        q: "How do I report someone?",
        a: "You can report any profile by tapping the three dots on their profile and selecting 'Report.' Our safety team reviews all reports within 24 hours."
      },
      {
        q: "Is my data secure?",
        a: "Absolutely. We use industry-standard encryption for all data. Your messages are end-to-end encrypted, and we never sell your data to third parties."
      },
      {
        q: "Can I block someone?",
        a: "Yes. You can block any user from their profile. They won't be able to see your profile or contact you, and you won't see them either."
      }
    ]
  }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({});
  
  const toggleItem = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#F9F2EB] to-white overflow-hidden">
        <MandalaPattern className="absolute -top-20 -right-20 w-96 h-96 text-[#C46A4A]" opacity={0.06} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              How Can We 
              <span className="bg-gradient-to-r from-[#C46A4A] to-[#D4A853] bg-clip-text text-transparent"> Help?</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              Find answers to common questions or reach out to our support team.
            </p>
            
            {/* Search Box */}
            <div className="mt-10 max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg rounded-full border-2 border-[#C46A4A]/20 focus:border-[#C46A4A] bg-white shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Sections */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {filteredCategories.map((category, cIndex) => (
              <div key={cIndex} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-[#C46A4A] to-[#D4A853] rounded-full" />
                  {category.category}
                </h2>
                
                <div className="space-y-4">
                  {category.questions.map((faq, qIndex) => {
                    const isOpen = openItems[`${cIndex}-${qIndex}`];
                    return (
                      <div 
                        key={qIndex}
                        className="bg-white rounded-2xl border border-gray-100 hover:border-[#C46A4A]/30 transition-colors overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(cIndex, qIndex)}
                          className="w-full px-6 py-5 flex items-center justify-between text-left"
                        >
                          <span className="font-medium text-gray-900 pr-8">{faq.q}</span>
                          <ChevronDown 
                            className={`w-5 h-5 text-[#C46A4A] flex-shrink-0 transition-transform duration-300 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <div 
                          className={`px-6 overflow-hidden transition-all duration-300 ${
                            isOpen ? 'pb-5 max-h-96' : 'max-h-0'
                          }`}
                        >
                          <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[#F9F2EB] to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-gray-600">
              Our support team is here to help you every step of the way.
            </p>
          </div>
          
          <div className="flex justify-center max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow w-full max-w-md">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-[#C46A4A]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 text-sm mb-4">Response within 24h</p>
              <a href="mailto:support@pyarkasafar.com" className="text-[#C46A4A] font-medium hover:underline">
                support@pyarkasafar.com
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}