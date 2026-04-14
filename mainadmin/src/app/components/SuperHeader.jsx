"use client";
import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  HelpCircle,
  ChevronDown,
  Moon,
  Sun,
  Menu,
  Mail,
  Calendar,
  Award,
} from "lucide-react";
import Link from "next/link";

const SuperHeader = ({ toggleSidebar, isSidebarCollapsed }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: "New Order Received",
      message: "Order #ORD-12345 from Fresh Foods",
      time: "2 minutes ago",
      type: "order",
      read: false,
    },
    {
      id: 2,
      title: "Vendor Registration",
      message: "New vendor 'Organic Mart' requested approval",
      time: "15 minutes ago",
      type: "vendor",
      read: false,
    },
    {
      id: 3,
      title: "Delivery Partner Online",
      message: "Rahul Sharma is now available for deliveries",
      time: "1 hour ago",
      type: "delivery",
      read: true,
    },
    {
      id: 4,
      title: "Payment Received",
      message: "Payment of ₹12,450 from Daily Needs",
      time: "3 hours ago",
      type: "payment",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Menu Button & Welcome */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button - Only shown on mobile */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            {/* Welcome Message - Hidden on mobile */}
            <div className="hidden sm:block">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, Super Admin
              </h2>
              <p className="text-xs text-gray-500">
                {formatDate(currentTime)} • {formatTime(currentTime)}
              </p>
            </div>

            {/* Mobile Welcome - Shown only on mobile */}
            <div className="sm:hidden">
              <h2 className="text-sm font-medium text-gray-700">Super Admin</h2>
              <p className="text-xs text-gray-500">{formatTime(currentTime)}</p>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, vendors, partners..."
                className="w-64 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <span className="text-xs text-indigo-600 font-medium">
                        {unreadCount} unread
                      </span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notification.read ? "bg-indigo-50/30" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-lg ${
                            notification.type === 'order' ? 'bg-blue-50' :
                            notification.type === 'vendor' ? 'bg-purple-50' :
                            notification.type === 'delivery' ? 'bg-green-50' :
                            'bg-amber-50'
                          }`}>
                            {notification.type === 'order' && <Mail className="w-4 h-4 text-blue-600" />}
                            {notification.type === 'vendor' && <User className="w-4 h-4 text-purple-600" />}
                            {notification.type === 'delivery' && <Award className="w-4 h-4 text-green-600" />}
                            {notification.type === 'payment' && <Calendar className="w-4 h-4 text-amber-600" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-100 text-center">
                    <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">SA</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700">Super Admin</p>
                  <p className="text-xs text-gray-500">admin@ruchibazzar.com</p>
                </div>
                <ChevronDown className="hidden md:block w-4 h-4 text-gray-500" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <p className="text-sm font-medium text-gray-900">Super Admin</p>
                    <p className="text-xs text-gray-500 mt-0.5">admin@ruchibazzar.com</p>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      Settings
                    </Link>
                    <Link
                      href="/help"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <HelpCircle className="w-4 h-4 text-gray-500" />
                      Help & Support
                    </Link>
                    <div className="border-t border-gray-100 my-2"></div>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => {
                        // Add your logout logic here
                        console.log("Logout clicked");
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="text-right">
                <p className="text-xs text-gray-500">Today's Revenue</p>
                <p className="text-sm font-semibold text-gray-900">₹12,450</p>
              </div>
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Shown only on mobile */}
        <div className="md:hidden py-3 border-t border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, vendors, partners..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default SuperHeader;