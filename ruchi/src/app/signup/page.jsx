'use client';

import { useState, useEffect, useRef } from 'react';
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
  KeyRound
} from 'lucide-react';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import axios from "axios";

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(null);
  const [otp, setOtp] = useState('');
  const [confirmObj, setConfirmObj] = useState(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const router = useRouter();
  const recaptchaContainerRef = useRef(null);

  const password = watch('password');

  // Initialize Firebase reCAPTCHA with correct syntax
  useEffect(() => {
    if (!recaptchaContainerRef.current) return;

    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth, // ✅ FIRST PARAM - Firebase Auth instance
          recaptchaContainerRef.current, // ✅ SECOND PARAM - Container element
          {
            size: "invisible",
            "expired-callback": () => {
              console.log("reCAPTCHA expired");
              window.recaptchaVerifier = null;
            },
          }
        );

        console.log("Firebase reCAPTCHA initialized ✅");
      } catch (error) {
        console.error("Error setting up reCAPTCHA:", error);
      }
    }

    // Cleanup on unmount
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (e) {
          console.log("Error clearing recaptcha:", e);
        }
      }
    };
  }, []);

  const sendOTP = async (userData) => {
    setSendingOtp(true);
    setError('');
    
    try {
      // Check if reCAPTCHA is initialized
      if (!window.recaptchaVerifier) {
        // Try to recreate it
        if (recaptchaContainerRef.current) {
          window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            recaptchaContainerRef.current,
            {
              size: "invisible",
              "expired-callback": () => {
                console.log("reCAPTCHA expired");
                window.recaptchaVerifier = null;
              },
            }
          );
        } else {
          throw new Error("Security verification not ready. Please refresh the page.");
        }
      }

      // Format phone number
      let phoneNumber = userData.phone.trim();
      if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+91' + phoneNumber;
      }
      
      if (!/^\+\d{10,15}$/.test(phoneNumber)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      console.log("Sending OTP to:", phoneNumber);
      
      // Send OTP via Firebase
      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );

      setConfirmObj(result);
      setFormData(userData);
      setStep(2);
      alert("OTP Sent Successfully! ✅");
    } catch (error) {
      console.error("Send OTP Error:", error);
      if (error.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number. Please enter a 10-digit number.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      } else if (error.code === 'auth/quota-exceeded') {
        setError('SMS quota exceeded. Please try again later.');
      } else if (error.message === 'recaptcha has already been rendered in this element') {
        // Reset and try again
        if (window.recaptchaVerifier) {
          await window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        }
        setError('Please try again. Refreshing security verification...');
        // Reload reCAPTCHA
        if (recaptchaContainerRef.current) {
          window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            recaptchaContainerRef.current,
            {
              size: "invisible",
              "expired-callback": () => {
                window.recaptchaVerifier = null;
              },
            }
          );
        }
      } else {
        setError(error.message || 'Error sending OTP. Please try again.');
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOTP = async () => {
    if (!confirmObj) {
      setError('Session expired. Please go back and request OTP again.');
      return;
    }
    
    setVerifyingOtp(true);
    setError('');
    
    try {
      // Verify OTP with Firebase
      const result = await confirmObj.confirm(otp);
      
      // Get the Firebase ID Token
      const idToken = await result.user.getIdToken();
      
      // Send ID Token to backend for verification
      const response = await axios.post("http://localhost:5000/api/auth/phone-signup", {
        idToken: idToken,
        userData: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: 'customer'
        }
      });

      if (response.data.success) {
        alert("Signup Successful! 🎉");
        router.push('/login');
      } else {
        setError(response.data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      if (error.code === 'auth/invalid-verification-code') {
        setError("Invalid OTP. Please check the code and try again.");
      } else if (error.code === 'auth/session-expired') {
        setError("Session expired. Please go back and request OTP again.");
      } else if (error.response?.data?.message?.toLowerCase().includes('already exists')) {
        setError('An account with this email already exists. Please login instead.');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(error.response?.data?.message || "Verification failed. Please try again.");
      }
    } finally {
      setVerifyingOtp(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    const userData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: 'customer'
    };
    
    await sendOTP(userData);
    setLoading(false);
  };

  const resendOTP = async () => {
    if (formData) {
      setConfirmObj(null);
      setOtp('');
      await sendOTP(formData);
    }
  };

  // OTP Verification Step
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-grid-white opacity-10" />
        
        <div className="relative w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <KeyRound className="h-8 w-8 text-purple-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Verify Your Phone
              </h1>
              <p className="text-gray-500 text-sm">
                We've sent a verification code to {formData?.phone}
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
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-600">{error}</p>
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
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP"
                  className="block w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-black"
                  maxLength="6"
                  autoFocus
                />
              </div>

              <button
                onClick={verifyOTP}
                disabled={verifyingOtp || otp.length !== 6}
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
                  disabled={sendingOtp}
                  className="text-purple-600 hover:text-purple-500 text-sm font-medium hover:underline transition duration-200"
                >
                  {sendingOtp ? 'Sending...' : 'Resend OTP'}
                </button>
              </div>

              <button
                onClick={() => {
                  setStep(1);
                  setError('');
                  setOtp('');
                }}
                className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium transition duration-200"
              >
                ← Back to registration
              </button>
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-500">Join us as a customer! It's free and easy.</p>
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
                Full Name
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
                Email Address
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
                Phone Number
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
                Enter 10-digit mobile number
              </p>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
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
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
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
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-300 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                  <span>Sending OTP...</span>
                </div>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Send OTP & Continue</span>
                </>
              )}
            </button>
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

      {/* Firebase reCAPTCHA Container */}
      <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
    </div>
  );
}