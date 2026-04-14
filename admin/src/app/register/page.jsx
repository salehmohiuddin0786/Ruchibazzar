"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, Phone, Store, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

const PartnerRegister = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    restaurantName: "",
    phone: "",
    agreeTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!formData.restaurantName.trim()) {
      setError("Restaurant name is required");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!formData.agreeTerms) {
      setError("You must agree to the terms and conditions");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // 🔥 FIXED: Include restaurantName in the request body
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "partner",
        restaurantName: formData.restaurantName // 🔥 ADDED THIS
      };
      
      console.log("Sending registration request to:", 'http://localhost:5000/api/auth/register');
      console.log("Request data:", userData);
      
      // Add timeout to fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log("Response status:", response.status);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log("Response data:", data);
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 500));
        throw new Error(`Server returned non-JSON response. Status: ${response.status}. Make sure your backend is running on port 5000.`);
      }
      
      if (response.ok) {
        // 🔥 Store user data and token
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // 🔥 Store restaurant data if returned
        if (data.restaurant) {
          localStorage.setItem("restaurant", JSON.stringify(data.restaurant));
        }
        
        setSuccess(true);
        
        // Redirect after success
        setTimeout(() => {
          router.push("/"); // 🔥 Redirect to partner dashboard instead of home
        }, 2000);
      } else {
        if (data.message?.toLowerCase().includes('already exists')) {
          setError("An account with this email already exists. Please use a different email or login.");
        } else if (data.message) {
          setError(data.message);
        } else {
          setError("Registration failed. Please try again.");
        }
      }
      
    } catch (err) {
      console.error("Registration error:", err);
      
      if (err.name === 'AbortError') {
        setError("Request timeout. Please check if backend server is running on port 5000.");
      } else if (err.message.includes('Failed to fetch')) {
        setError("Cannot connect to backend server. Please make sure your backend is running on http://localhost:5000");
      } else {
        setError(err.message || "Network error. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-2">Your partner account has been created.</p>
          <p className="text-sm text-gray-500 mb-4">Restaurant: {formData.restaurantName}</p>
          <p className="text-sm text-gray-500 mb-4">Redirecting to partner dashboard...</p>
          <button
            onClick={() => router.push("/pa")}
            className="text-red-600 hover:text-red-700 font-medium transition-colors hover:underline"
          >
            Click here if not redirected
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500 rounded-full opacity-5 blur-3xl"></div>
      </div>

      {/* Main card */}
      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-red-100 transform transition-all duration-300 hover:scale-[1.01]">
        {/* Top gradient bar */}
        <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-black"></div>
        
        <div className="p-8">
          {/* Logo and Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-black rounded-2xl mb-4 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="text-3xl font-bold text-white">P</span>
            </div>
            <h1 className="text-3xl font-bold text-black">
              Partner Registration
            </h1>
            <p className="text-gray-600 text-sm mt-2">
              Join our restaurant partner network
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-black ml-1">
                  Full Name *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white text-black placeholder-gray-400"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-black ml-1">
                  Email Address *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white text-black placeholder-gray-400"
                    placeholder="partner@restaurant.com"
                    required
                  />
                </div>
              </div>

              {/* Restaurant Name */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-black ml-1">
                  Restaurant Name *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Store className="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white text-black placeholder-gray-400"
                    placeholder="La Bella Italia"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 ml-1">This will be your restaurant's display name</p>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-black ml-1">
                  Phone Number *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white text-black placeholder-gray-400"
                    placeholder="+1 234 567 8900"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-black ml-1">
                  Password *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white text-black placeholder-gray-400"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-black ml-1">
                  Confirm Password *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white text-black placeholder-gray-400"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Hint */}
            <p className="text-xs text-gray-500 ml-1 -mt-2">Minimum 6 characters</p>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3 mt-4">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-2 cursor-pointer mt-1"
                required
              />
              <label className="text-sm text-black">
                I agree to the{" "}
                <button
                  type="button"
                  className="text-red-600 hover:text-red-700 font-medium hover:underline"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="text-red-600 hover:text-red-700 font-medium hover:underline"
                >
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-black text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group mt-6"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Partner Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Partner Account</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-black opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have a partner account?{" "}
              <button
                type="button"
                onClick={handleLogin}
                className="text-red-600 hover:text-red-700 font-medium transition-colors hover:underline"
              >
                Sign in here
              </button>
            </p>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Partner registration</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
            <p className="text-xs font-semibold text-red-600 mb-2">✨ Partner Benefits:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="text-gray-700">• Restaurant dashboard</span>
              <span className="text-gray-700">• Order management system</span>
              <span className="text-gray-700">• Real-time analytics</span>
              <span className="text-gray-700">• Menu management tools</span>
              <span className="text-gray-700">• Sales reports</span>
              <span className="text-gray-700">• Customer insights</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            © 2024 Partner Portal. Secure registration powered by industry-grade encryption.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegister;