import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Heart, Instagram, Twitter, Facebook } from 'lucide-react';

const footerLinks = {
  company: [
    { name: 'About Us', page: 'About' },
    { name: 'How It Works', page: 'Home' },
    { name: 'Success Stories', page: 'Home' },
    { name: 'Careers', page: 'Home' },
  ],
  support: [
    { name: 'Help Center', page: 'FAQ' },
    { name: 'Safety Tips', page: 'Safety' },
    { name: 'Community Guidelines', page: 'Safety' },
    { name: 'Contact Us', page: 'FAQ' },
  ],
  legal: [
    { name: 'Privacy Policy', page: 'Safety' },
    { name: 'Terms of Service', page: 'TermsOfService' },
    { name: 'Cookie Policy', page: 'Safety' },
  ]
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#C46A4A] to-[#D4A853] rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">PyarKaSafar</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Where Culture Meets Connection. Find your perfect match and begin your journey to lasting love.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#C46A4A] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#C46A4A] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#C46A4A] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Company Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">Company</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={createPageUrl(link.page)} 
                    className="text-gray-400 hover:text-[#D4A853] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">Support</h3>
            <ul className="space-y-4">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={createPageUrl(link.page)} 
                    className="text-gray-400 hover:text-[#D4A853] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">Legal</h3>
            <ul className="space-y-4">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={createPageUrl(link.page)} 
                    className="text-gray-400 hover:text-[#D4A853] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 PyarKaSafar.com. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-[#C46A4A]" /> for the Indian diaspora
          </p>
        </div>
      </div>
    </footer>
  );
}