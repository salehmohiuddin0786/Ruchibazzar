"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Shield, Utensils, Crown } from "lucide-react";

const Login = () => {
  const router = useRouter();
  const isMounted = useRef(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const redirectTimeoutRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  // ✅ Check if already logged in - runs only once
  useEffect(() => {
    // Prevent running if already redirected
    if (hasRedirected) return;
    
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const user = localStorage.getItem("user") || sessionStorage.getItem("user");

        if (token && user && !hasRedirected) {
          try {
            const userData = JSON.parse(user);
            if (userData.role === "partner" || userData.role === "customer") {
              setHasRedirected(true);
              // Use router.push instead of window.location to avoid full reload
              router.push("/");
              return;
            }
          } catch (e) {
            console.error("Error parsing user data", e);
            // Clear invalid data
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        if (isMounted.current) {
          setIsCheckingAuth(false);
        }
      }
    };

    // Small delay to ensure storage is ready
    const timeoutId = setTimeout(checkAuth, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      isMounted.current = false;
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [hasRedirected, router]);

  // ✅ Debounced input handlers to prevent excessive updates
  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
    if (error) setError("");
  }, [error]);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    if (error) setError("");
  }, [error]);

  // ✅ LOGIN FUNCTION with proper error handling
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isLoading) return;
    
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Store data based on remember me
      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("token", data.token);
      storage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.role,
        })
      );

      if (data.restaurant) {
        storage.setItem("restaurant", JSON.stringify(data.restaurant));
      }

      // ✅ Also store in both storages for consistency
      if (rememberMe) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.role,
        }));
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.role,
        }));
      }

      // ✅ Set cookie for middleware with proper attributes
      const maxAge = rememberMe ? "max-age=2592000" : "max-age=3600";
      document.cookie = `token=${data.token}; path=/; ${maxAge}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;

      // ✅ Small delay to ensure cookie and storage are set before redirect
      redirectTimeoutRef.current = setTimeout(() => {
        if (data.role === "partner" || data.role === "customer") {
          router.push("/");
        } else {
          throw new Error("Invalid user role");
        }
      }, 100);
      
    } catch (err) {
      console.error("Login error:", err);
      
      if (err.name === "AbortError") {
        setError("Request timeout. Please check your connection and try again.");
      } else if (err.message.includes("Failed to fetch")) {
        setError("Cannot connect to server. Please ensure the backend is running.");
      } else {
        setError(err.message || "Invalid email or password");
      }
      setIsLoading(false);
    }
  };

  const handleRegister = useCallback(() => {
    router.push("/register");
  }, [router]);

  const handleForgotPassword = useCallback(() => {
    router.push("/forgot-password");
  }, [router]);

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-black rounded-2xl mb-4 animate-pulse">
            <Utensils className="h-8 w-8 text-white" />
          </div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600 rounded-full opacity-20 animate-pulse blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-700 rounded-full opacity-20 animate-pulse delay-1000 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500 rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-400 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-red-500/30 transform transition-all duration-300">
        {/* Top Gradient Bar */}
        <div className="h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-black"></div>

        <div className="p-8">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-black rounded-2xl mb-4 shadow-lg transform transition-all duration-300 group">
              <Utensils className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
              Partner Portal
            </h1>
            <p className="text-red-200 text-sm mt-2 flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3" />
              Welcome back to your dashboard
              <Sparkles className="h-3 w-3" />
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur-sm">
              <p className="text-sm text-red-200 text-center">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-red-200 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-red-300 group-focus-within:text-red-400 transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="partner@restaurant.com"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-red-500/30 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none transition-all text-white placeholder-red-300/50"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-red-200 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-red-300 group-focus-within:text-red-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 bg-black/50 border border-red-500/30 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none transition-all text-white placeholder-red-300/50"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-red-300 hover:text-red-200 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-red-600 border-red-500 rounded focus:ring-red-500 focus:ring-2 cursor-pointer bg-black/50"
                  disabled={isLoading}
                />
                <span className="text-sm text-red-200 group-hover:text-red-100 transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-red-300 hover:text-red-100 font-medium transition-colors hover:underline"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-black text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group mt-6"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>

            {/* Sign Up Link */}
            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-red-500/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-red-300">New to Partner Portal?</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRegister}
              className="w-full border-2 border-red-500/50 text-red-200 font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:bg-red-600/20 hover:border-red-500 hover:scale-[1.02]"
              disabled={isLoading}
            >
              Create an Account
            </button>
          </form>

          {/* Partner Benefits */}
          <div className="mt-6 p-4 bg-gradient-to-r from-red-950/50 to-black/50 rounded-xl border border-red-500/20">
            <p className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-1">
              <Crown className="h-3 w-3" />
              Partner Benefits:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-red-300/80">
              <span>• Restaurant dashboard</span>
              <span>• Order management</span>
              <span>• Real-time analytics</span>
              <span>• Menu management</span>
              <span>• Sales reports</span>
              <span>• 24/7 support</span>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-red-400/70">
            <Shield className="h-3 w-3" />
            <span>Secure login powered by industry-grade encryption</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-black/30 backdrop-blur-sm px-8 py-4 border-t border-red-500/20">
          <p className="text-xs text-red-400/60 text-center">
            © 2024 Partner Portal. All rights reserved.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.3; }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;