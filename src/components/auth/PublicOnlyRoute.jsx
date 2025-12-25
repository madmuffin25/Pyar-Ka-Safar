import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9F2EB] via-white to-[#FDF8F5]">
        <Loader2 className="w-10 h-10 text-[#C46A4A] animate-spin" />
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
