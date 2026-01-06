import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useUnreadCount } from '@/hooks/useMessages';
import { Heart, User, MessageCircle, Sparkles, Search, LogOut, Home, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

/**
 * Shared header component for authenticated pages
 * Provides consistent navigation across all logged-in pages
 *
 * Props:
 * - mobileBackButton: { show: boolean, onClick: function } - Show back button on mobile
 * - mobileTitle: { show: boolean, photo: string, name: string } - Show title on mobile instead of logo
 * - hideLogo: boolean - Hide logo on mobile (when showing title)
 */
export default function AuthHeader({ mobileBackButton, mobileTitle, hideLogo }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: unreadCount = 0 } = useUnreadCount();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Determine which page is currently active
  const currentPath = location.pathname;
  const isActive = (path) => currentPath === path || currentPath.startsWith(path + '/');

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/recommended-profiles', icon: Sparkles, label: 'Recommended' },
    { path: '/browse', icon: Search, label: 'Browse' },
    { path: '/matches', icon: Heart, label: 'Matches' },
    { path: '/messages', icon: MessageCircle, label: 'Messages', badge: unreadCount },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile back button */}
          {mobileBackButton?.show && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full md:hidden"
              onClick={mobileBackButton.onClick}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}

          {/* Logo - can be hidden on mobile */}
          <Link
            to={createPageUrl('Home')}
            className={`flex items-center gap-2 ${hideLogo ? 'hidden md:flex' : ''}`}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">PyarKaSafar</span>
          </Link>

          {/* Mobile title (e.g., conversation name) */}
          {mobileTitle?.show && (
            <div className="flex items-center gap-2 md:hidden">
              <img
                src={mobileTitle.photo || `https://ui-avatars.com/api/?name=${mobileTitle.name}&background=C46A4A&color=fff`}
                alt={mobileTitle.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-semibold">{mobileTitle.name}</span>
            </div>
          )}

          <nav className="flex items-center gap-2">
            {navItems.map(({ path, icon: Icon, label, badge }) => (
              <Link key={path} to={path}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full relative ${
                    isActive(path) ? 'bg-[#C46A4A]/10' : ''
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive(path) ? 'text-[#C46A4A]' : ''}`} />
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C46A4A] text-white text-xs rounded-full flex items-center justify-center">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </Button>
              </Link>
            ))}
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
  );
}
