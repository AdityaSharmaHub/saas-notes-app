'use client';

import { useAuth } from '../lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ArrowRight, CheckCircle, Crown, Users, Shield } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Notes App</h1>
            </div>
            <Link
              href="/login"
              className="btn-primary"
            >
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Multi-Tenant 
              <span className="text-primary-600"> SaaS Notes</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Secure, scalable note-taking application with multi-tenancy, role-based access control, and subscription management.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <Link
                href="/login"
                className="btn-primary text-lg px-8 py-3"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Enterprise Features
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Built for modern businesses with security and scalability in mind.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Multi-Tenancy */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Multi-Tenant Architecture
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Complete tenant isolation ensures your data is secure and separated from other organizations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Role-Based Access */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <Shield className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Role-Based Access Control
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Admin and member roles with granular permissions to control who can do what.
                    </p>
                  </div>
                </div>
              </div>

              {/* Subscription Management */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <Crown className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Flexible Subscriptions
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Free plan with limits, Pro plan with unlimited access. Upgrade anytime.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Test Accounts Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Try It Now
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Use these test accounts to explore the application
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Acme Corp</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">admin@acme.test</code>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Admin
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">user@acme.test</code>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Member
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Globex Corporation</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">admin@globex.test</code>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Admin
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">user@globex.test</code>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Member
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-500">
              All test accounts use password: <code className="bg-gray-100 px-2 py-1 rounded">password</code>
            </p>
            <Link
              href="/login"
              className="btn-primary mt-4"
            >
              Sign In to Test
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400">
            © 2025 SaaS Notes App. Built with ❤️ by <Link href="https://adityacodes.com" className='text-white' target="_blank">Aditya Sharma</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}