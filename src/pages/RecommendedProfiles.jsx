import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, User, MessageCircle, Sparkles, Search, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function RecommendedProfiles() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">PyarKaSafar</span>
            </Link>

            <nav className="flex items-center gap-2">
              <Link to={createPageUrl('Dashboard')}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="rounded-full bg-[#C46A4A]/10">
                <Sparkles className="w-5 h-5 text-[#C46A4A]" />
              </Button>
              <Link to={createPageUrl('Browse')}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Search className="w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('Matches')}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MessageCircle className="w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('Profile')}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="w-20 h-20 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-[#C46A4A]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Recommendations Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              Our AI-powered recommendation system is being built.
              Soon you'll see personalized profile suggestions here!
            </p>
            <Link to={createPageUrl('Dashboard')}>
              <Button className="bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
