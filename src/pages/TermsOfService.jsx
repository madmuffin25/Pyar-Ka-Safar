import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Scale } from 'lucide-react';
import Footer from '@/components/landing/Footer';

export default function TermsOfService() {
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
              Last Updated: January 8, 2026
            </p>
            <p className="text-gray-600">
              Please read these terms carefully before using Pyarkasafar.com
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">

            {/* Section 1: Eligibility */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Eligibility</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                To use Pyarkasafar.com, you must meet all of the following requirements:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>You are at least 18 years of age at the time of registration.</li>
                <li>You are legally permitted to use online dating services under the laws of your country, state, or province.</li>
                <li>You have not been convicted of a violent offense, sexual offense, or crime involving exploitation or harm to others, and you are not required to register as a sex offender in any jurisdiction.</li>
                <li>You are using the Service for personal dating and social connection purposes only, not for commercial, political, or promotional use.</li>
                <li>You have not previously been banned or removed from Pyarkasafar or any of its affiliated services unless expressly authorized by us.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mb-4">
                By creating an account, you represent and warrant that:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>All information you submit (including age, relationship status, photos, and personal details) is accurate, current, and not misleading.</li>
                <li>You will maintain the accuracy of your account information.</li>
                <li>You will use the Service in a manner consistent with these Terms and all applicable laws.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                Pyarkasafar reserves the right to refuse service, suspend, or terminate accounts that do not meet eligibility requirements, even if the user appears to meet the minimum age requirement.
              </p>
            </div>

            {/* Section 2: Account Registration & Responsibility */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Account Registration & Responsibility</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You must create an account to access most features of Pyarkasafar. By registering, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>Provide truthful information during registration and profile setup.</li>
                <li>Keep your login credentials confidential.</li>
                <li>Notify us immediately if you suspect unauthorized access to your account.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                You are responsible for all activities that occur under your account.
              </p>
            </div>

            {/* Section 3: Profile Content & Conduct */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Profile Content & Conduct</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Pyarkasafar allows users to create personalized profiles and upload content to share with other users. You agree that all content you post, including photos, biographical information, and written responses, will:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                <li>Accurately represent who you are.</li>
                <li>Not contain nudity, sexually explicit material, or graphic violence.</li>
                <li>Not infringe on the intellectual property or privacy rights of others.</li>
                <li>Not contain hate speech, discriminatory content, or harassment.</li>
                <li>Comply with all applicable laws and regulations.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 User Content</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                You retain ownership of any photos, text, or other materials you upload to Pyarkasafar ("User Content"). By posting User Content, you grant us a non-exclusive, royalty-free, worldwide license to use, reproduce, modify, and display that content in connection with operating and promoting the Service.
              </p>
              <p className="text-gray-600 leading-relaxed mb-2">
                You represent and warrant that:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>You own or have the right to post your User Content.</li>
                <li>Your User Content does not violate any third party's rights.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                Pyarkasafar may, at its sole discretion, remove any User Content that violates these Terms or is deemed inappropriate.
              </p>
            </div>

            {/* Section 4: Profile Verification & No Background Checks */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Profile Verification & No Background Checks</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                While Pyarkasafar may offer optional photo or identity verification features, we do not conduct background checks on users. We cannot guarantee the accuracy, authenticity, or legal standing of any user's profile or conduct.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Users interact with others at their own risk.
              </p>
            </div>

            {/* Section 5: Safety & User Interactions */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Safety & User Interactions</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Pyarkasafar is not responsible for the behavior of users, whether on or off the platform. We encourage you to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>Report suspicious or inappropriate behavior.</li>
                <li>Use caution when sharing personal information.</li>
                <li>Meet in public places if arranging in-person meetings.</li>
                <li>Trust your instincts if something feels wrong.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                For more guidance, please refer to our Safety Tips.
              </p>
            </div>

            {/* Section 6: Prohibited Activities */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Prohibited Activities</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                To maintain a safe, respectful, and authentic community, users are strictly prohibited from engaging in the following behaviors:
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">6.1 Misrepresentation & Deceptive Behavior</h3>
              <p className="text-gray-600 mb-2">You may not:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                <li>Provide false or misleading information about your identity, age, marital status, location, intentions, or background.</li>
                <li>Impersonate another person, brand, or organization.</li>
                <li>Use photos that do not clearly represent you, including heavily altered images or images of another individual.</li>
                <li>Operate an account on behalf of someone else without explicit authorization.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">6.2 Harassment, Abuse & Harmful Conduct</h3>
              <p className="text-gray-600 mb-2">You may not:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                <li>Harass, threaten, intimidate, stalk, or bully other users.</li>
                <li>Send repeated unwanted messages after being asked to stop.</li>
                <li>Promote hate, discrimination, or violence based on race, ethnicity, nationality, religion, gender, sexual orientation, or disability.</li>
                <li>Engage in sexually explicit, coercive, or exploitative behavior without mutual consent.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">6.3 Fraud, Scams & Financial Exploitation</h3>
              <p className="text-gray-600 mb-2">You may not:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                <li>Solicit money, gifts, cryptocurrency, or financial assistance from other users.</li>
                <li>Promote investment schemes, giveaways, or "too good to be true" offers.</li>
                <li>Attempt to redirect users to external platforms for deceptive or exploitative purposes.</li>
                <li>Use the Service for romance scams, catfishing, or financial manipulation.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">6.4 Commercial & Promotional Use</h3>
              <p className="text-gray-600 mb-2">You may not:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                <li>Use Pyarkasafar for advertising, lead generation, or solicitation.</li>
                <li>Promote products, services, events, or websites without prior written approval.</li>
                <li>Recruit users for third-party platforms, dating services, or social media followings.</li>
                <li>Use the Service for escorting, sugar-dating arrangements, or transactional relationships.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">6.5 Technical Abuse & Platform Manipulation</h3>
              <p className="text-gray-600 mb-2">You may not:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                <li>Use bots, scripts, scrapers, or automated tools to access or interact with the Service.</li>
                <li>Create multiple accounts to bypass restrictions or enforcement actions.</li>
                <li>Interfere with or disrupt the operation, security, or integrity of the platform.</li>
                <li>Reverse engineer, copy, or exploit any part of the Service.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">6.6 Offline Misconduct Related to the Service</h3>
              <p className="text-gray-600 mb-2">You may not:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                <li>Use information obtained from Pyarkasafar to harm, harass, or exploit another user offline.</li>
                <li>Engage in behavior that places other users at risk during in-person interactions arranged through the Service.</li>
                <li>Violate local, state, provincial, or federal laws in connection with your use of Pyarkasafar.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">6.7 Enforcement</h3>
              <p className="text-gray-600 leading-relaxed mb-2">Pyarkasafar reserves the right to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>Investigate suspected violations.</li>
                <li>Remove content, restrict features, or terminate accounts without notice.</li>
                <li>Cooperate with law enforcement where required by law.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                Enforcement decisions are made at our sole discretion and may occur even if the behavior is not explicitly listed but is deemed unsafe, deceptive, or harmful to the community.
              </p>
            </div>

            {/* Section 7: Paid Features & Subscriptions */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Paid Features & Subscriptions</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Certain features may require payment. By purchasing a subscription, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>Pay all applicable fees and taxes.</li>
                <li>Automatic renewal unless canceled prior to the renewal date.</li>
                <li>Refund policies as stated at the time of purchase or as required by law.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                Pyarkasafar reserves the right to modify pricing or features at any time.
              </p>
            </div>

            {/* Section 8: Termination & Account Suspension */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Termination & Account Suspension</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may suspend or terminate your account at our sole discretion, without notice, if:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>You violate these Terms.</li>
                <li>Your behavior poses a risk to other users.</li>
                <li>We are required to do so by law.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                You may terminate your account at any time through account settings.
              </p>
            </div>

            {/* Section 9: Intellectual Property */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                All content on Pyarkasafar (excluding User Content), including logos, branding, text, graphics, and software, is owned by or licensed to Pyarkasafar and protected by intellectual property laws.
              </p>
              <p className="text-gray-600 leading-relaxed">
                You may not copy, distribute, or use our content without prior written permission.
              </p>
            </div>

            {/* Section 10: Privacy */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                Your use of the Service is also governed by our{' '}
                <Link to={createPageUrl('Privacy')} className="text-[#C46A4A] hover:underline">
                  Privacy Policy
                </Link>
                , which explains how we collect, use, and protect your information.
              </p>
            </div>

            {/* Section 11: Disclaimers */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Disclaimers</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                The Service is provided "AS IS" and "AS AVAILABLE."
              </p>
              <p className="text-gray-600 leading-relaxed mb-2">Pyarkasafar makes no warranties regarding:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Compatibility, success of matches, or relationship outcomes.</li>
                <li>Accuracy or reliability of user profiles.</li>
                <li>Continuous, error-free operation of the Service.</li>
              </ul>
            </div>

            {/* Section 12: Limitation of Liability */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed mb-2">
                To the fullest extent permitted by law, Pyarkasafar shall not be liable for:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Personal injury, emotional distress, or damages arising from user interactions.</li>
                <li>Loss of data, profits, or reputation.</li>
                <li>Any indirect, incidental, or consequential damages.</li>
              </ul>
            </div>

            {/* Section 13: Indemnification */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Indemnification</h2>
              <p className="text-gray-600 leading-relaxed mb-2">
                You agree to indemnify and hold harmless Pyarkasafar, its affiliates, and employees from any claims, damages, or expenses arising out of:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Your use of the Service.</li>
                <li>Your violation of these Terms.</li>
                <li>Your interactions with other users.</li>
              </ul>
            </div>

            {/* Section 14: Governing Law & Dispute Resolution */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Governing Law & Dispute Resolution</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                These Terms shall be governed by the laws of the State of California, without regard to conflict-of-law principles.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Any disputes shall be resolved through binding arbitration or small claims court, as permitted by law.
              </p>
            </div>

            {/* Section 15: Changes to These Terms */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Changes to These Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update these Terms from time to time. Continued use of the Service after changes are posted constitutes acceptance of the revised Terms.
              </p>
            </div>

            {/* Section 16: Contact Information */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Contact Information</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                For questions or concerns regarding these Terms, contact us at:
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong>{' '}
                <a href="mailto:support@pyarkasafar.com" className="text-[#C46A4A] hover:underline">
                  support@pyarkasafar.com
                </a>
              </p>
              <p className="text-gray-600">
                <strong>Website:</strong>{' '}
                <a href="https://www.pyarkasafar.com" className="text-[#C46A4A] hover:underline" target="_blank" rel="noopener noreferrer">
                  https://www.pyarkasafar.com
                </a>
              </p>
            </div>

            {/* Agreement Notice */}
            <div className="bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-2xl p-8 text-center">
              <p className="text-gray-700">
                By using Pyarkasafar, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
