"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Star,
  Edit2,
  Camera,
  Save,
  Shield,
  Bell,
  Lock,
  CheckCircle,
  XCircle,
  Menu as MenuIcon,
  X,
  AlertCircle
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

// Custom hook for sidebar management
const useSidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => isMobile && setSidebarOpen(false);

  return { isMobile, sidebarOpen, toggleSidebar, closeSidebar };
};

const Profile = () => {
  const router = useRouter();
  const { isMobile, sidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileImage, setProfileImage] = useState(null);
  const [showMobileTabs, setShowMobileTabs] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [profileData, setProfileData] = useState({
    restaurantName: "",
    ownerName: "",
    phone: "",
    email: "",
    address: "",
    openingTime: "10:00",
    closingTime: "22:00",
    website: "",
    description: "",
    cuisineType: [],
    deliveryRadius: "5",
    avgPreparationTime: "25-30",
    restaurantSince: "",
    rating: 0,
    totalReviews: 0
  });

  // Load user and restaurant data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        const restaurantData = localStorage.getItem("restaurant");
        
        if (!token || !userData) {
          router.push("/Login");
          return;
        }
        
        const user = JSON.parse(userData);
        
        // Set user data
        setProfileData(prev => ({
          ...prev,
          ownerName: user.name || "",
          email: user.email || "",
          phone: user.phone || ""
        }));
        
        // Set restaurant data if available
        if (restaurantData) {
          const restaurant = JSON.parse(restaurantData);
          setProfileData(prev => ({
            ...prev,
            restaurantName: restaurant.name || "",
            address: restaurant.address || "",
            description: restaurant.description || "",
            openingTime: restaurant.openingTime || "10:00",
            closingTime: restaurant.closingTime || "22:00",
            website: restaurant.website || "",
            cuisineType: restaurant.cuisineType || [],
            deliveryRadius: restaurant.deliveryRadius || "5",
            avgPreparationTime: restaurant.avgPreparationTime || "25-30",
            rating: restaurant.rating || 0,
            totalReviews: restaurant.totalReviews || 0
          }));
          
          if (restaurant.image) {
            setProfileImage(restaurant.image);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading user data:", error);
        setError("Failed to load profile data");
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [router]);

  // Body scroll lock effect
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = sidebarOpen ? 'hidden' : 'auto';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobile, sidebarOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setError("");
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/Login");
        return;
      }
      
      // Update restaurant data in backend
      const response = await fetch('http://localhost:5000/api/restaurant/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...profileData,
          image: profileImage
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Update localStorage with new restaurant data
        localStorage.setItem("restaurant", JSON.stringify(data.restaurant));
        
        // Update user data in localStorage
        const userData = {
          ...JSON.parse(localStorage.getItem("user")),
          name: profileData.ownerName,
          email: profileData.email,
          phone: profileData.phone
        };
        localStorage.setItem("user", JSON.stringify(userData));
        
        setSaveSuccess(true);
        setIsEditing(false);
        
        // Hide success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(data.message || "Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("restaurant");
    router.push("/Login");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Building2 },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const stats = [
    { label: "Total Orders", value: "2,450", icon: MenuIcon, color: "bg-blue-500" },
    { label: "Regular Customers", value: "850", icon: User, color: "bg-green-500" },
    { label: "Monthly Revenue", value: "₹1.2L", icon: Star, color: "bg-purple-500" },
    { label: "Avg. Rating", value: profileData.rating.toFixed(1), icon: Star, color: "bg-amber-500" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const MobileTabsDrawer = () => (
    <>
      {showMobileTabs && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={() => setShowMobileTabs(false)}
        />
      )}
      
      <div className={`
        fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 md:hidden
        transform transition-transform duration-300 ease-in-out
        ${showMobileTabs ? 'translate-y-0' : 'translate-y-full'}
        shadow-2xl max-h-[80vh] overflow-y-auto
      `}>
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Settings Menu</h3>
            <button 
              onClick={() => setShowMobileTabs(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowMobileTabs(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 p-4 rounded-xl transition-all
                    ${activeTab === tab.id
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && (
                    <CheckCircle size={16} className="ml-auto" />
                  )}
                </button>
              );
            })}
            
            {/* Logout button in mobile drawer */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all mt-4"
            >
              <Lock size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Toggle Button */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 active:scale-95"
          aria-label="Open menu"
        >
          <MenuIcon size={24} />
        </button>
      )}

      {/* Mobile Settings Button */}
      {isMobile && (
        <button
          onClick={() => setShowMobileTabs(true)}
          className="md:hidden fixed bottom-24 right-4 z-40 p-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 active:scale-95"
          aria-label="Settings menu"
        >
          <Building2 size={24} />
        </button>
      )}

      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Success Message */}
      {saveSuccess && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle size={20} />
            <span>Profile saved successfully!</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          onToggle={toggleSidebar}
        />
        
        {/* Main Content */}
        <div className="text-black flex-1 min-h-screen w-full transition-all duration-300">
          <Header 
            title={profileData.restaurantName || "Restaurant Profile"} 
            subtitle={isMobile ? "Manage your restaurant" : "Manage your restaurant details, settings, and preferences"}
            onMenuClick={toggleSidebar}
            sidebarOpen={sidebarOpen}
            onClose={closeSidebar}
          />
          
          <main className="p-3 sm:p-4 md:p-6 pb-24 md:pb-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 sm:border-4 border-white/30 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                      {profileImage ? (
                        <img 
                          src={profileImage} 
                          alt={profileData.restaurantName} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 size={32} className="sm:size-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-white text-gray-700 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <Camera size={14} className="sm:size-4" />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  <div className="text-center sm:text-left">
                    <h1 className="text-xl sm:text-2xl font-bold">{profileData.restaurantName}</h1>
                    <p className="text-red-100 opacity-90 text-xs sm:text-sm mt-1 max-w-md">
                      {profileData.description || "Add a description for your restaurant"}
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="sm:size-4 text-amber-300 fill-amber-300" />
                        <span className="font-bold text-sm sm:text-base">{profileData.rating.toFixed(1)}</span>
                        <span className="text-red-100 text-[10px] sm:text-xs">({profileData.totalReviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="sm:size-4" />
                        <span className="text-xs sm:text-sm">{profileData.openingTime} - {profileData.closingTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3 justify-center sm:justify-end">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/30 transition-colors text-xs sm:text-sm"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-red-600 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm shadow-lg disabled:opacity-50"
                      >
                        <Save size={16} className="sm:size-5" />
                        {isLoading ? "Saving..." : "Save"}
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-red-600 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm shadow-lg active:scale-95"
                    >
                      <Edit2 size={16} className="sm:size-5" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 transform hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-[10px] sm:text-xs font-medium">{stat.label}</p>
                        <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mt-1 sm:mt-2">{stat.value}</h3>
                      </div>
                      <div className={`p-2 sm:p-3 ${stat.color} rounded-lg sm:rounded-xl`}>
                        <Icon className="text-white" size={16} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Left Column - Tabs (Desktop) */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800">Settings</h3>
                  </div>
                  <div className="p-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 p-3 sm:p-4 rounded-lg mb-1 transition-all ${
                            activeTab === tab.id
                              ? "bg-gradient-to-r from-red-50 to-red-100 text-red-600"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <Icon size={18} />
                          <span className="font-medium text-sm sm:text-base">{tab.label}</span>
                          {activeTab === tab.id && (
                            <CheckCircle size={16} className="ml-auto text-red-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column - Content */}
              <div className="lg:col-span-3">
                {activeTab === "profile" && (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Restaurant Details Card */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">Restaurant Details</h3>
                        {!isEditing && (
                          <button 
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-1 sm:space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Building2 size={14} className="sm:size-4" />
                              Restaurant Name
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                name="restaurantName"
                                value={profileData.restaurantName}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                              />
                            ) : (
                              <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg font-medium text-gray-800 text-sm sm:text-base">
                                {profileData.restaurantName || "Not set"}
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-1 sm:space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
                              <User size={14} className="sm:size-4" />
                              Owner Name
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                name="ownerName"
                                value={profileData.ownerName}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                              />
                            ) : (
                              <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg font-medium text-gray-800 text-sm sm:text-base">
                                {profileData.ownerName || "Not set"}
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-1 sm:space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Phone size={14} className="sm:size-4" />
                              Phone Number
                            </label>
                            {isEditing ? (
                              <input
                                type="tel"
                                name="phone"
                                value={profileData.phone}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                              />
                            ) : (
                              <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg font-medium text-gray-800 text-sm sm:text-base">
                                {profileData.phone || "Not set"}
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-1 sm:space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Mail size={14} className="sm:size-4" />
                              Email Address
                            </label>
                            {isEditing ? (
                              <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                              />
                            ) : (
                              <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg font-medium text-gray-800 text-sm sm:text-base">
                                {profileData.email || "Not set"}
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-1 sm:space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Clock size={14} className="sm:size-4" />
                              Opening Time
                            </label>
                            {isEditing ? (
                              <input
                                type="time"
                                name="openingTime"
                                value={profileData.openingTime}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                              />
                            ) : (
                              <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg font-medium text-gray-800 text-sm sm:text-base">
                                {profileData.openingTime}
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-1 sm:space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Clock size={14} className="sm:size-4" />
                              Closing Time
                            </label>
                            {isEditing ? (
                              <input
                                type="time"
                                name="closingTime"
                                value={profileData.closingTime}
                                onChange={handleInputChange}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                              />
                            ) : (
                              <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg font-medium text-gray-800 text-sm sm:text-base">
                                {profileData.closingTime}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-1 sm:space-y-2">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
                            <MapPin size={14} className="sm:size-4" />
                            Restaurant Address
                          </label>
                          {isEditing ? (
                            <textarea
                              name="address"
                              value={profileData.address}
                              onChange={handleInputChange}
                              rows="2"
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                            />
                          ) : (
                            <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg text-gray-800 text-sm sm:text-base">
                              {profileData.address || "Not set"}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-1 sm:space-y-2">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700">
                            Restaurant Description
                          </label>
                          {isEditing ? (
                            <textarea
                              name="description"
                              value={profileData.description}
                              onChange={handleInputChange}
                              rows="3"
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                            />
                          ) : (
                            <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg text-gray-800 text-sm sm:text-base">
                              {profileData.description || "No description added"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Tabs Drawer */}
      <MobileTabsDrawer />

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden z-30">
        <div className="flex justify-around items-center">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center px-3 py-1 ${activeTab === "profile" ? "text-red-600" : "text-gray-600"}`}
          >
            <User size={22} />
            <span className="text-xs mt-0.5">Profile</span>
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`flex flex-col items-center px-3 py-1 ${activeTab === "settings" ? "text-red-600" : "text-gray-600"}`}
          >
            <Building2 size={22} />
            <span className="text-xs mt-0.5">Settings</span>
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`flex flex-col items-center px-3 py-1 ${activeTab === "security" ? "text-red-600" : "text-gray-600"}`}
          >
            <Shield size={22} />
            <span className="text-xs mt-0.5">Security</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;