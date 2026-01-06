
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Heart, Menu, X, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

export default function Layout({ children, currentPageName }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  // Pages that don't need the header (they have their own)
  const pagesWithoutHeader = ['Onboarding', 'Dashboard', 'Browse', 'Matches', 'Profile', 'RecommendedProfiles', 'EditProfile', 'Messages', 'Login', 'ViewProfile'];
  const showHeader = !pagesWithoutHeader.includes(currentPageName);
  
  const navLinks = [
    { name: 'About', page: 'About' },
    ...(isAuthenticated ? [{ name: 'Recommended Profiles', page: 'RecommendedProfiles' }] : []),
    { name: 'Membership', page: 'Membership' },
    { name: 'Safety', page: 'Safety' },
    { name: 'Help', page: 'FAQ' },
  ];
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        :root {
          --color-primary: #C46A4A;
          --color-primary-dark: #8B2635;
          --color-accent: #D4A853;
          --color-bg-warm: #F9F2EB;
        }
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .text-primary { color: var(--color-primary); }
        .bg-primary { background-color: var(--color-primary); }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background: #C46A4A;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #8B2635;
        }
        
        /* Smooth scroll */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      
      {showHeader && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">PyarKaSafar</span>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    className={`text-sm font-medium transition-colors hover:text-[#C46A4A] ${
                      currentPageName === link.page ? 'text-[#C46A4A]' : 'text-gray-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              
              {/* CTA Buttons */}
              <div className="hidden lg:flex items-center gap-4">
                {loading ? (
                  <div className="w-24 h-10" />
                ) : isAuthenticated ? (
                  <Link to={createPageUrl('Dashboard')}>
                    <Button className="bg-gradient-to-r from-[#C46A4A] to-[#8B2635] hover:from-[#B35A3A] hover:to-[#7A2030] text-white px-6 rounded-full">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="text-gray-600 hover:text-[#C46A4A]"
                      onClick={() => navigate('/login')}
                    >
                      Sign In
                    </Button>
                    <Link to={createPageUrl('Onboarding')}>
                      <Button className="bg-gradient-to-r from-[#C46A4A] to-[#8B2635] hover:from-[#B35A3A] hover:to-[#7A2030] text-white px-6 rounded-full">
                        Join Now
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-900" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-900" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden bg-white border-t border-gray-100">
              <div className="container mx-auto px-4 py-4 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    className="block py-2 text-gray-600 hover:text-[#C46A4A] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  {loading ? null : isAuthenticated ? (
                    <Link to={createPageUrl('Dashboard')}>
                      <Button className="w-full bg-gradient-to-r from-[#C46A4A] to-[#8B2635] text-white rounded-full">
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full rounded-full"
                        onClick={() => navigate('/login')}
                      >
                        Sign In
                      </Button>
                      <Link to={createPageUrl('Onboarding')}>
                        <Button className="w-full bg-gradient-to-r from-[#C46A4A] to-[#8B2635] text-white rounded-full">
                          Join Now
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </header>
      )}
      
      {/* Main Content */}
      <main className={showHeader ? 'pt-16 lg:pt-20' : ''}>
        {children}
      </main>
    </div>
  );
}
