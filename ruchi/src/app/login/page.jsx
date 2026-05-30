'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, 
  Phone, KeyRound, ArrowLeft, Send, CheckCircle 
} from 'lucide-react';
import axios from "axios";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [tempUserData, setTempUserData] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  // ✅ FIX 2: Remove loginWithOTP - only use login
  const { login } = useAuth();
  const router = useRouter();

  const getRecaptchaVerifier = () => {
    if (!window.loginRecaptchaVerifier) {
      window.loginRecaptchaVerifier = new RecaptchaVerifier(
        auth,
        "login-recaptcha-container",
        { size: "invisible" }
      );
    }

    return window.loginRecaptchaVerifier;
  };

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const sendOTP = async () => {
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }

    // Validate phone number
    let cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setSendingOtp(true);
    setError('');
    
    try {
      const appVerifier = getRecaptchaVerifier();
      const result = await signInWithPhoneNumber(auth, `+91${cleanPhone}`, appVerifier);

      setConfirmationResult(result);
      setTempUserData({ phone: cleanPhone });
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

  const verifyOTPAndLogin = async () => {
    if (!tempUserData) {
      setError('Session expired. Please request OTP again.');
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
        throw new Error('Session expired. Please request OTP again.');
      }

      const firebaseResult = await confirmationResult.confirm(otp);
      const firebaseIdToken = await firebaseResult.user.getIdToken();

      const response = await axios.post(`${API_URL}/auth/phone-login`, {
        phone: tempUserData.phone,
        firebaseIdToken,
      });
      
      if (response.data.success) {
        // Store user data and token
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Update auth context if needed
        if (typeof login === 'function') {
          // If your login function can handle token, use it
          await login({ token: response.data.token, user: response.data.user });
        }
        
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        successDiv.textContent = 'Login Successful! 🎉';
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 3000);
        
        // Redirect based on role
        if (response.data.user.role === 'customer') {
          router.push('/');
        } else if (response.data.user.role === 'partner') {
          router.push('/partner/dashboard');
        } else if (response.data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      } else {
        setError(response.data.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error("Verify OTP Error:", error.response?.data || error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(error.message || "Verification failed. Please try again.");
      }
    } finally {
      setVerifyingOtp(false);
    }
  };

  // ✅ FIX 1: Correct login call with proper object structure
  const onSubmit = async (data) => {
    // Debug: Log the data to verify it's correct
    console.log("📝 LOGIN DATA:", data);
    console.log("📧 Email:", data.email);
    console.log("🔒 Password:", data.password);
    
    setLoading(true);
    setError('');
    
    // ✅ CRITICAL FIX: Pass object with email and password
    const result = await login({ 
      email: data.email, 
      password: data.password 
    });
    
    console.log("✅ Login result:", result);
    
    if (result.success) {
      if (result.user && result.user.role === 'customer') {
        router.push('/');
      } else if (result.user && result.user.role === 'partner') {
        setError('Please use the partner login portal');
        setTimeout(() => router.push('/Login'), 2000);
      } else if (result.user && result.user.role === 'admin') {
        setError('Please use the admin login portal');
        setTimeout(() => router.push('/admin/login'), 2000);
      } else {
        router.push('/');
      }
    } else {
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

  const resendOTP = async () => {
    if (resendCooldown > 0) {
      setError(`Please wait ${resendCooldown} seconds before resending`);
      return;
    }
    await sendOTP();
  };

  // OTP Step
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-grid-white opacity-10" />
        
        <div className="relative w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
            <button
              onClick={() => {
                setStep(1);
                setError('');
                setOtp('');
                setTempUserData(null);
                setConfirmationResult(null);
              }}
              className="flex items-center text-gray-600 hover:text-gray-800 transition duration-200"
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
                We&apos;ve sent a verification code to <strong>{phoneNumber}</strong>
              </p>
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
                    if (value.length === 6) setError('');
                  }}
                  placeholder="Enter OTP"
                  className="block w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-black"
                  maxLength="8"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && /^\d{4,8}$/.test(otp)) {
                      verifyOTPAndLogin();
                    }
                  }}
                />
              </div>

              <button
                onClick={verifyOTPAndLogin}
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
                    <span>Verify & Login</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={resendOTP}
                  disabled={sendingOtp || resendCooldown > 0}
                  className="text-purple-600 hover:text-purple-500 text-sm font-medium hover:underline transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingOtp ? 'Sending...' : resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Password Login Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-grid-white opacity-10 hidden sm:block" />
      
      <div className="relative w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5 sm:space-y-6">
          {/* Login Method Toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => {
                setLoginMethod('password');
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                loginMethod === 'password'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Mail className="h-4 w-4 inline mr-2" />
              Email Login
            </button>
            <button
              onClick={() => {
                setLoginMethod('otp');
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                loginMethod === 'otp'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Phone className="h-4 w-4 inline mr-2" />
              OTP Login
            </button>
          </div>

          <div className="text-center space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              {loginMethod === 'password' ? 'Customer Login' : 'Login with OTP'}
            </p>
            <p className="text-xs text-gray-400">
              {loginMethod === 'password' ? 'Sign in to access your account' : 'Get OTP on your registered phone number'}
            </p>
          </div>

          {error && (
            <div className={`border-l-4 p-3 sm:p-4 rounded ${
              error.includes('partner') || error.includes('admin') 
                ? 'bg-yellow-50 border-yellow-500' 
                : 'bg-red-50 border-red-500'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className={`h-4 w-4 sm:h-5 sm:w-5 ${
                    error.includes('partner') || error.includes('admin') 
                      ? 'text-yellow-400' 
                      : 'text-red-400'
                  }`} />
                </div>
                <div className="ml-3">
                  <p className={`text-xs sm:text-sm ${
                    error.includes('partner') || error.includes('admin') 
                      ? 'text-yellow-700' 
                      : 'text-red-600'
                  }`}>
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {loginMethod === 'password' ? (
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
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-0">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                  <span className="text-xs sm:text-sm text-gray-600">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-xs sm:text-sm text-purple-600 hover:text-purple-500 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-300 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
          ) : (
            <div className="space-y-4">
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
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhoneNumber(value);
                      setError('');
                    }}
                    placeholder="9876543210"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-black"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter 10-digit mobile number
                </p>
              </div>

              <button
                onClick={sendOTP}
                disabled={sendingOtp || phoneNumber.length !== 10}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-300 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {sendingOtp ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send OTP</span>
                  </>
                )}
              </button>
              <div id="login-recaptcha-container" />
            </div>
          )}

          <div className="text-center pt-3 sm:pt-4 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600">
              Don&apos;t have a customer account?{' '}
              <Link href="/signup" className="text-purple-600 hover:text-purple-500 font-semibold hover:underline">
                Create one now
              </Link>
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Are you a restaurant partner?{' '}
              <Link href="/Login" className="text-purple-600 hover:text-purple-500 hover:underline">
                Partner Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
