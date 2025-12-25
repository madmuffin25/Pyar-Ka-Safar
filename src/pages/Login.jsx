import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import MandalaPattern from '@/components/ui/MandalaPattern';
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] via-white to-[#FDF8F5] relative overflow-hidden">
      {/* Decorative Patterns */}
      <MandalaPattern className="absolute -top-40 -right-40 w-[500px] h-[500px] text-[#C46A4A]" opacity={0.04} />
      <MandalaPattern className="absolute -bottom-40 -left-40 w-[600px] h-[600px] text-[#D4A853]" opacity={0.03} />

      {/* Header */}
      <header className="relative z-10 py-6 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PyarKaSafar</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome Back</h2>
            <p className="text-gray-600">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-12 py-6 text-lg rounded-xl border-2 border-gray-200 focus:border-[#C46A4A]"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-12 py-6 text-lg rounded-xl border-2 border-gray-200 focus:border-[#C46A4A]"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 text-lg rounded-xl bg-gradient-to-r from-[#C46A4A] to-[#8B2635] hover:from-[#B35A3A] hover:to-[#7A2030] group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to={createPageUrl('Onboarding')} className="text-[#C46A4A] hover:underline font-medium">
              Join Now
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
