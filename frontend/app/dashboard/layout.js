'use client';

import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogOut, Crown, User, Building, Zap } from 'lucide-react';
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Notes App</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Building className="h-4 w-4" />
                <span>{user?.tenant?.name}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Subscription Status */}
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                user?.tenant?.subscription === 'pro' 
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user?.tenant?.subscription === 'pro' ? (
                  <>
                    <Crown className="h-4 w-4" />
                    <span>Pro</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    <span>Free</span>
                  </>
                )}
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{user?.email}</div>
                    <div className="text-gray-500 capitalize">{user?.role}</div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className='w-full p-2 text-center fixed bottom-0 left-0 bg-gray-50 text-gray-600 text-sm'>Made with ❤️ by <Link href="https://adityacodes.com" target="_blank">Aditya Sharma</Link></footer>
    </div>
  );
}