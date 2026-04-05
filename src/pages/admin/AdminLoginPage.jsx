import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useAdminStore } from '../../stores/useAdminStore';
import { authService } from '../../services/authService';
import { SparklesIcon, EnvelopeIcon, LockClosedIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const isAdmin = useAdminStore(state => state.isAdmin);
  const checkAdminStatus = useAdminStore(state => state.checkAdminStatus);
  const becomeAdmin = useAdminStore(state => state.becomeAdmin);
  const isLoading = useAdminStore(state => state.isLoading);
  const error = useAdminStore(state => state.error);
  
  const [secretCode, setSecretCode] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Check if user is already admin
  const checkStatus = async (uid) => {
    const adminStatus = await checkAdminStatus(uid);
    if (adminStatus) {
      navigate('/admin/dashboard');
    }
  };

  if (user) {
    checkStatus(user.uid);
  }

  // If already admin, redirect
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const user = await authService.signInWithGoogle();
      const adminStatus = await checkAdminStatus(user.uid);
      if (adminStatus) {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Google login failed:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleBecomeAdmin = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login with Google first');
      return;
    }
    
    const success = await becomeAdmin(secretCode);
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#537A5A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#537A5A] rounded-2xl shadow-lg mb-4">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-gray-300 mt-2">Sign in to manage your courses</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
          {!user ? (
            // Not logged in - show Google login
            <div className="space-y-6">
              <button
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-700 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
              >
                {isGoogleLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continue with Google
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-800 text-gray-500">or</span>
                </div>
              </div>

              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#537A5A] text-white rounded-xl font-medium hover:bg-[#426649] transition-colors"
              >
                Go to Student Login
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            // Logged in but not admin - show secret code form
            <form onSubmit={handleBecomeAdmin} className="space-y-6">
              {/* User info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{user.displayName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>

              {/* Secret code input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter Admin Secret Code
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    placeholder="Enter secret code"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#537A5A] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || !secretCode}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#537A5A] text-white rounded-xl font-medium hover:bg-[#426649] transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    Become Admin
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to site */}
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#537A5A]">
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
