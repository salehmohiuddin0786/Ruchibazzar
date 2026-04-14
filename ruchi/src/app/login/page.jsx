'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    const result = await login(data.email, data.password);
    
    if (result.success) {
      // Check user role to ensure it's customer
      if (result.user && result.user.role === 'customer') {
        router.push('/');
      } else if (result.user && result.user.role === 'partner') {
        // If somehow a partner tries to login here, show appropriate message
        setError('Please use the partner login portal');
        // Optional: redirect to partner login after 2 seconds
        setTimeout(() => {
          router.push('/Login');
        }, 2000);
      } else if (result.user && result.user.role === 'admin') {
        setError('Please use the admin login portal');
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      } else {
        router.push('/');
      }
    } else {
      // Handle specific error messages from backend
      if (result.error?.toLowerCase().includes('use appropriate login portal')) {
        setError('This account is for partners/admins. Please use the correct login portal.');
      } else if (result.error?.toLowerCase().includes('invalid credentials')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4 sm:p-6">
      {/* Background Pattern - hidden on very small screens for performance */}
      <div className="absolute inset-0 bg-grid-white opacity-10 hidden sm:block" />
      
      <div className="relative w-full max-w-md mx-auto">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5 sm:space-y-6">
          {/* Header */}
          <div className="text-center space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base text-gray-500">Customer Login</p>
            <p className="text-xs text-gray-400">Sign in to access your account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className={`border-l-4 p-3 sm:p-4 rounded ${
              error.includes('partner') || error.includes('admin') 
                ? 'bg-yellow-50 border-yellow-500' 
                : 'bg-red-50 border-red-500'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {error.includes('partner') || error.includes('admin') ? (
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                  ) : (
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-xs sm:text-sm ${
                    error.includes('partner') || error.includes('admin') 
                      ? 'text-yellow-700' 
                      : 'text-red-600'
                  }`}>
                    {error}
                  </p>
                  {(error.includes('partner') || error.includes('admin')) && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Redirecting to appropriate login page...
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-sm sm:text-base border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-black placeholder-gray-400`}
                  placeholder="customer@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className={`block w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 text-sm sm:text-base border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-black placeholder-gray-400`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition duration-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-0">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-xs sm:text-sm text-gray-600">Remember me</span>
              </label>
              <Link 
                href="/forgot-password" 
                className="text-xs sm:text-sm text-purple-600 hover:text-purple-500 hover:underline transition duration-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 sm:py-2.5 px-4 rounded-lg text-sm sm:text-base font-semibold hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-300 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Sign In as Customer</span>
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center pt-3 sm:pt-4 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600">
              Don't have a customer account?{' '}
              <Link 
                href="/signup" 
                className="text-purple-600 hover:text-purple-500 font-semibold hover:underline transition duration-200"
              >
                Create one now
              </Link>
            </p>
          </div>

          {/* Partner Login Link */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Are you a restaurant partner?{' '}
              <Link 
                href="/Login" 
                className="text-purple-600 hover:text-purple-500 hover:underline transition duration-200"
              >
                Partner Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}