import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Check, X, Crown, Star, Loader2, Calendar, CreditCard, ExternalLink, BadgeCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MandalaPattern from '@/components/ui/MandalaPattern';
import Footer from '@/components/landing/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/api/supabaseClient';

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
      { text: "Profile Boost", included: false },
      { text: "Identity Verification", included: false },
    ]
  },
  {
    name: "Premium",
    price: "24.99",
    yearlyPrice: "240",
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
      { text: "Profile Boost", included: true },
      { text: "Identity Verification", included: true },
    ]
  }
];

export default function Membership() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Check premium status on mount
  useEffect(() => {
    const checkPremiumStatus = async () => {
      // Wait for auth to finish loading first
      if (authLoading) {
        return;
      }

      if (!isAuthenticated || !user) {
        setCheckingStatus(false);
        return;
      }

      try {
        // Get profile premium status
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', user.id)
          .single();

        if (profile?.is_premium) {
          setIsPremium(true);

          // Get subscription details
          const { data: sub } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

          if (sub) {
            setSubscription(sub);
          }
        }
      } catch (err) {
        console.error('Error checking premium status:', err);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkPremiumStatus();
  }, [isAuthenticated, user, authLoading]);

  const handleSubscribe = async () => {
    setError(null);

    // If not logged in, redirect to onboarding
    if (!isAuthenticated) {
      navigate('/onboarding');
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate('/login');
        return;
      }

      const response = await supabase.functions.invoke('create-checkout', {
        body: { priceType: billingCycle },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create checkout session');
      }

      if (response.data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const response = await supabase.functions.invoke('create-portal-session', {
        body: {},
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to open billing portal');
      }

      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error('Portal error:', err);
      setError('Unable to open billing portal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth and premium status
  if (authLoading || checkingStatus) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C46A4A]" />
      </div>
    );
  }

  // Show premium member view
  if (isPremium) {
    return (
      <div className="min-h-screen bg-white">
        {/* Premium Member Section */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#F9F2EB] to-white overflow-hidden">
          <MandalaPattern className="absolute -top-20 -right-20 w-96 h-96 text-[#C46A4A]" opacity={0.06} />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-2xl mx-auto">
              {/* Premium Status Card */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-[#C46A4A]">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full flex items-center justify-center">
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">You're a Premium Member!</h1>
                  <p className="text-gray-600">Thank you for supporting PyarKaSafar</p>
                </div>

                {/* Subscription Details */}
                {subscription && (
                  <div className="bg-gradient-to-r from-[#F9F2EB] to-[#FEF3E7] rounded-2xl p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Subscription Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                          <CreditCard className="w-4 h-4" />
                          <span>Status</span>
                        </div>
                        <span className="font-medium text-green-600 capitalize">{subscription.status}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Next billing date</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      {subscription.cancel_at_period_end && (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-sm text-amber-700">
                            Your subscription will end on {new Date(subscription.current_period_end).toLocaleDateString()}.
                            You'll continue to have premium access until then.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Premium Benefits */}
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Your Premium Benefits</h3>
                  <div className="space-y-3">
                    {[
                      "Unlimited likes",
                      "Profile Boost - appear first in Browse",
                      "Upload up to 6 photos",
                      "Priority in search results",
                      "Identity Verification with verified badge"
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Link to="/browse">
                    <Button className="w-full py-6 rounded-full text-lg bg-gradient-to-r from-[#C46A4A] to-[#8B2635] hover:from-[#B35A3A] hover:to-[#7A2030] text-white">
                      Start Browsing
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleManageSubscription}
                    disabled={loading}
                    className="w-full py-6 rounded-full text-lg border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <ExternalLink className="w-5 h-5 mr-2" />
                    )}
                    Manage Subscription
                  </Button>
                </div>

                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center text-sm">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // Show regular pricing page for non-premium users
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
          {error && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                {error}
              </div>
            </div>
          )}

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
                    ${billingCycle === 'yearly' && plan.yearlyPrice
                      ? plan.yearlyPrice
                      : plan.price}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {billingCycle === 'yearly' && plan.price !== '0' ? '/year' : `/${plan.period}`}
                  </span>
                </div>

                {plan.price === '0' ? (
                  <Link to={createPageUrl('Onboarding')}>
                    <Button
                      className="w-full py-6 rounded-full text-lg bg-gray-100 text-gray-900 hover:bg-gray-200"
                    >
                      Get Started Free
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full py-6 rounded-full text-lg bg-gradient-to-r from-[#C46A4A] to-[#8B2635] hover:from-[#B35A3A] hover:to-[#7A2030] text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Choose Plan'
                    )}
                  </Button>
                )}

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
              { q: "Is my payment secure?", a: "Absolutely. We use industry-standard encryption and never store your card details. All payments are processed securely through Stripe." },
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
