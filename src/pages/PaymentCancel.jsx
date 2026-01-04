import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';
import MandalaPattern from '@/components/ui/MandalaPattern';

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white flex items-center justify-center p-4">
      <MandalaPattern className="absolute top-0 right-0 w-96 h-96 text-[#C46A4A]" opacity={0.06} />
      <MandalaPattern className="absolute bottom-0 left-0 w-96 h-96 text-[#D4A853]" opacity={0.06} />

      <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-lg w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
          <XCircle className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-8">
          Your payment was cancelled. No charges were made to your account.
          You can try again whenever you're ready.
        </p>

        <div className="space-y-4">
          <Link to="/membership">
            <Button className="w-full py-6 rounded-full text-lg bg-gradient-to-r from-[#C46A4A] to-[#8B2635] hover:from-[#B35A3A] hover:to-[#7A2030] text-white">
              <CreditCard className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          </Link>

          <Link to="/browse">
            <Button variant="outline" className="w-full py-6 rounded-full text-lg border-gray-200 text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Browsing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
