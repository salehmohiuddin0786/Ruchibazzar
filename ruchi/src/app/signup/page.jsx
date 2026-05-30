'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User, 
  Mail, 
  Phone, 
  Lock, 
  CheckCircle,
  Eye,
  EyeOff,
  AlertCircle,
  Send,
  KeyRound,
  ArrowLeft
} from 'lucide-react';
import axios from "axios";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(null);
  const [otp, setOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const router = useRouter();

  const password = watch('password');

  const getRecaptchaVerifier = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "signup-recaptcha-container",
        { size: "invisible" }
      );
    }

    return window.recaptchaVerifier;
  };

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const sendOTP = async (userData) => {
    setSendingOtp(true);
    setError('');
    
    try {
      if (!/^[6-9]\d{9}$/.test(userData.phone)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      const appVerifier = getRecaptchaVerifier();
      const result = await signInWithPhoneNumber(auth, `+91${userData.phone}`, appVerifier);

      setConfirmationResult(result);
      setFormData(userData);
      setStep(2);
      setResendCooldown(30);
      
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      successDiv.textContent = 'OTP Sent Successfully! ✅';
      document.body.appendChild(successDiv);
      setTimeout(() => successDiv.remove(), 3000);
      
    } catch (error) {
      console.error("Send OTP Error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(error.message || 'Error sending OTP. Please try again.');
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOTP = async () => {
    if (!formData) {
      setError('Session expired. Please go back and request OTP again.');
      return;
    }
    
    if (!/^\d{4,8}$/.test(otp)) {
      setError('Please enter a valid OTP');
      return;
    }
    
    setVerifyingOtp(true);
    setError('');
    
    try {
      if (!confirmationResult) {
        throw new Error('Session expired. Please go back and request OTP again.');
      }

      const firebaseResult = await confirmationResult.confirm(otp);
      const firebaseIdToken = await firebaseResult.user.getIdToken();
      
      const registerResponse = await axios.post(`${API_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'customer',
        firebaseIdToken,
      });
      
      if (registerResponse.data.success) {
        // Auto-login after registration
        localStorage.setItem('token', registerResponse.data.token);
        localStorage.setItem('user', JSON.stringify(registerResponse.data.user));
        
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        successDiv.textContent = 'Signup Successful! 🎉 Redirecting...';
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 3000);
        
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(registerResponse.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error("Verify OTP Error:", error.response?.data || error);
      
      if (error.code === 'auth/invalid-verification-code') {
        setError("Invalid OTP. Please check the code and try again.");
      } else if (error.code === 'auth/session-expired') {
        setError("Session expired. Please go back and request OTP again.");
      } else if (error.response?.data?.message) {
        if (error.response.data.message.toLowerCase().includes('already exists')) {
          setError('An account with this email or phone already exists. Please login instead.');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setError(error.response.data.message);
        }
      } else {
        setError(error.message || "Verification failed. Please try again.");
      }
    } finally {
      setVerifyingOtp(false);
    }
  };

  const onSubmit = async (data) => {
    setError('');
    
    // Validate phone number format
    if (!/^\d{10}$/.test(data.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    // Validate password match
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (data.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    const userData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: 'customer'
    };
    
    await sendOTP(userData);
  };

  const resendOTP = async () => {
    if (resendCooldown > 0) {
      setError(`Please wait ${resendCooldown} seconds before resending`);
      return;
    }
    
    if (formData) {
      setOtp('');
      await sendOTP(formData);
    }
  };

  const goBackToForm = () => {
    setStep(1);
    setError('');
    setOtp('');
    setFormData(null);
    setConfirmationResult(null);
  };

  // OTP Verification Step
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-grid-white opacity-10" />
        
        <div className="relative w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
            <button
              onClick={goBackToForm}
              className="flex items-center text-gray-600 hover:text-gray-800 transition duration-200 mb-2"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span className="text-sm">Back</span>
            </button>

            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <KeyRound className="h-8 w-8 text-purple-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Verify Your Phone
              </h1>
              <p className="text-gray-500 text-sm">
                We&apos;ve sent a verification code to <strong>{formData?.phone}</strong>
              </p>
            </div>

            {error && (
              <div className={`border-l-4 p-4 rounded ${
                error.includes('already exists') 
                  ? 'bg-yellow-50 border-yellow-500' 
                  : 'bg-red-50 border-red-500'
              }`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className={`h-5 w-5 ${
                      error.includes('already exists') ? 'text-yellow-400' : 'text-red-400'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm ${
                      error.includes('already exists') ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                    setOtp(value);
                    if (value.length === 6) {
                      setError('');
                    }
                  }}
                  placeholder="Enter OTP"
                  className="block w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-black"
                  maxLength="8"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && /^\d{4,8}$/.test(otp)) {
                      verifyOTP();
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Enter the code sent to your phone
                </p>
              </div>

              <button
                onClick={verifyOTP}
                disabled={verifyingOtp || !/^\d{4,8}$/.test(otp)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-300 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {verifyingOtp ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Verify & Complete Signup</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={resendOTP}
                  disabled={sendingOtp || resendCooldown > 0}
                  className="text-purple-600 hover:text-purple-500 text-sm font-medium hover:underline transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingOtp ? (
                    'Sending...'
                  ) : resendCooldown > 0 ? (
                    `Resend OTP in ${resendCooldown}s`
                  ) : (
                    'Resend OTP'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Registration Form Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-white opacity-10" />
      
      <div className="relative w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-500">Join us as a customer! It&apos;s free and easy.</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-black placeholder-gray-400`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-black placeholder-gray-400`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number'
                    }
                  })}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-black placeholder-gray-400`}
                  placeholder="9876543210"
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Enter 10-digit mobile number (without country code)
              </p>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className={`block w-full pl-10 pr-12 py-2.5 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-black placeholder-gray-400`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Minimum 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CheckCircle className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  className={`block w-full pl-10 pr-12 py-2.5 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-black placeholder-gray-400`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms */}
            <div className="space-y-1">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('terms', { required: 'You must accept the terms and conditions' })}
                  className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-purple-600 hover:text-purple-500 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-purple-600 hover:text-purple-500 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="text-sm text-red-600 mt-1">{errors.terms.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || sendingOtp}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-300 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6"
            >
              {loading || sendingOtp ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                  <span>{sendingOtp ? 'Sending OTP...' : 'Processing...'}</span>
                </div>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Send OTP & Continue</span>
                </>
              )}
            </button>
            <div id="signup-recaptcha-container" />
          </form>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-600 hover:text-purple-500 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
