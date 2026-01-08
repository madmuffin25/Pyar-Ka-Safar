import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle, Crown, ArrowRight, Loader2 } from 'lucide-react';
import MandalaPattern from '@/components/ui/MandalaPattern';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Short delay to ensure webhook has processed
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white flex items-center justify-center p-4">
      <MandalaPattern className="absolute top-0 right-0 w-96 h-96 text-[#C46A4A]" opacity={0.06} />
      <MandalaPattern className="absolute bottom-0 left-0 w-96 h-96 text-[#D4A853]" opacity={0.06} />

      <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-lg w-full text-center">
        {loading ? (
          <>
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-[#C46A4A] animate-spin" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Processing your payment...
            </h1>
            <p className="text-gray-600">
              Please wait while we confirm your subscription.
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Welcome to Premium!
            </h1>

            <p className="text-gray-600 mb-8">
              Your subscription has been activated successfully. You now have access to all premium features.
            </p>

            <div className="bg-gradient-to-r from-[#F9F2EB] to-[#FEF3E7] rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Crown className="w-6 h-6 text-[#C46A4A]" />
                <span className="text-lg font-semibold text-gray-900">Premium Benefits</span>
              </div>
              <ul className="text-left text-gray-700 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Unlimited likes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Profile Boost - appear first in Browse
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Priority in search results
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Upload up to 6 photos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Identity Verification with verified badge
                </li>
              </ul>
            </div>

            <Link to="/browse">
              <Button className="w-full py-6 rounded-full text-lg bg-gradient-to-r from-[#C46A4A] to-[#8B2635] hover:from-[#B35A3A] hover:to-[#7A2030] text-white">
                Start Browsing
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
