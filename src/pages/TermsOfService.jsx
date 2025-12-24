import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Heart, Scale, Shield, FileText } from 'lucide-react';
import Footer from '@/components/landing/Footer';

export default function TermsOfService() {
  const sections = [
    {
      icon: FileText,
      title: "1. Acceptance of Terms",
      content: "By accessing and using PyarKaSafar, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform."
    },
    {
      icon: Shield,
      title: "2. Eligibility",
      content: "You must be at least 18 years old to use PyarKaSafar. By creating an account, you represent that you meet this age requirement and that all information you provide is accurate and truthful."
    },
    {
      icon: Heart,
      title: "3. User Accounts",
      content: "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized access or use of your account. PyarKaSafar reserves the right to suspend or terminate accounts that violate our terms or community guidelines."
    },
    {
      icon: Scale,
      title: "4. User Conduct",
      content: "You agree not to use PyarKaSafar for any unlawful purpose or in violation of our community guidelines. Prohibited conduct includes harassment, impersonation, spam, fraud, or posting inappropriate content. We reserve the right to remove content and ban users who violate these rules."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#F9F2EB] via-white to-[#FDF8F5] py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full mb-6">
              <Scale className="w-8 h-8 text-[#C46A4A]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Last Updated: December 6, 2025
            </p>
            <p className="text-gray-600">
              Please read these terms carefully before using PyarKaSafar
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Key Sections with Icons */}
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#C46A4A]" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                      <p className="text-gray-600 leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Additional Sections */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Privacy & Data</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Your privacy is important to us. Our collection and use of personal information is described in our{' '}
                  <Link to={createPageUrl('Privacy')} className="text-[#C46A4A] hover:underline">
                    Privacy Policy
                  </Link>
                  . By using PyarKaSafar, you consent to our data practices as described in that policy.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
                <p className="text-gray-600 leading-relaxed">
                  All content on PyarKaSafar, including text, graphics, logos, and software, is the property of PyarKaSafar or its licensors and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. User Content</h2>
                <p className="text-gray-600 leading-relaxed mb-3">
                  You retain ownership of content you post on PyarKaSafar. However, by posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content in connection with operating the platform.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  You represent that you have all necessary rights to the content you post and that it does not violate any third-party rights or applicable laws.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Subscriptions & Payments</h2>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Premium subscriptions are billed in advance on a recurring basis (monthly or annually). You may cancel your subscription at any time, but no refunds will be provided for partial subscription periods.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to change our pricing and subscription plans at any time, with notice to active subscribers.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimers</h2>
                <p className="text-gray-600 leading-relaxed mb-3">
                  PyarKaSafar is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, secure, or error-free. We do not verify the identity or background of users, and you are solely responsible for your interactions with other users.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We are not responsible for the conduct of users on or off the platform. You agree to take reasonable precautions in all interactions with other users.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
                <p className="text-gray-600 leading-relaxed">
                  To the maximum extent permitted by law, PyarKaSafar shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. Our total liability shall not exceed the amount you paid us in the past 12 months.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Indemnification</h2>
                <p className="text-gray-600 leading-relaxed">
                  You agree to indemnify and hold harmless PyarKaSafar from any claims, damages, losses, or expenses arising from your use of the platform, your violation of these terms, or your violation of any rights of another user.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Termination</h2>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to suspend or terminate your account at any time for any reason, including violation of these terms. Upon termination, your right to use the platform will immediately cease, and we may delete your account and content.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
                <p className="text-gray-600 leading-relaxed">
                  These Terms of Service shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts located in the United States.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the platform. Your continued use of PyarKaSafar after such changes constitutes acceptance of the new terms.
                </p>
              </div>
            </div>

            {/* Agreement Notice */}
            <div className="bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-2xl p-8 text-center">
              <p className="text-gray-700">
                By using PyarKaSafar, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}