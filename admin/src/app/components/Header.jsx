"use client";
import { Bell, Search, ChevronDown, LogOut, Settings, User, Store } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Header = ({ title, subtitle, onMenuClick, sidebarOpen }) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const [userName, setUserName] = useState("");
  const [userInitial, setUserInitial] = useState("P");

  useEffect(() => {
    // Get restaurant and user data from localStorage
    const loadUserData = () => {
      try {
        const restaurantData = localStorage.getItem("restaurant");
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        
        // Check if user is authenticated
        if (!token || !userData) {
          router.push("/Login");
          return;
        }
        
        if (restaurantData) {
          const restaurant = JSON.parse(restaurantData);
          setRestaurantName(restaurant.name || "Restaurant");
        }
        
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.name || "Partner");
          setUserInitial(user.name?.charAt(0).toUpperCase() || "P");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    
    loadUserData();
  }, [router]);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("restaurant");
    localStorage.removeItem("partnerToken"); // Remove old token if exists
    
    // Redirect to partner login page
    router.push("/Login");
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            {!sidebarOpen && onMenuClick && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Store className="w-6 h-6 text-red-500" />
                {restaurantName || title || "Restaurant Dashboard"}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-500 hidden sm:block mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search - Hidden on mobile */}
            <div className="hidden lg:flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, menu items..."
                className="bg-transparent border-none outline-none px-2 text-sm w-64 focus:outline-none"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2 p-1.5 md:p-2 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-lg transition-all">
                  {userInitial}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700 leading-tight">
                    {userName || "Partner"}
                  </p>
                  <p className="text-xs text-gray-500 leading-tight">Restaurant Owner</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 hidden md:block transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 animate-in slide-in-from-top-2 duration-200">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{userName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{restaurantName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Restaurant Partner</p>
                    </div>
                    
                    {/* Menu Items */}
                    <button 
                      onClick={() => {
                        setShowDropdown(false);
                        router.push("/partner/profile");
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      Profile Settings
                    </button>
                    
                    <button 
                      onClick={() => {
                        setShowDropdown(false);
                        router.push("/partner/settings");
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      Restaurant Settings
                    </button>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Logout Button (Quick access) */}
            <button
              onClick={handleLogout}
              className="md:hidden p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search - Shows below header on small screens */}
        <div className="mt-3 lg:hidden">
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none px-2 text-sm w-full focus:outline-none"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;