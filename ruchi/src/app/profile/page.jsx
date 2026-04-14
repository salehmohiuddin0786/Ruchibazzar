"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Shield,
  Heart,
  Clock,
  Award,
  Settings,
  Edit,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  ShoppingBag,
  Star,
  Truck,
  Package,
  Calendar,
  Gift,
  Utensils,
  Save,
  X,
  Check,
  AlertCircle,
  Loader,
  Plus,
  Trash2,
  ChevronRight,
  Home,
  Briefcase,
  MapPinned
} from 'lucide-react';

const Page = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // User Data States
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    profilePic: null,
    joinDate: '',
    loyaltyPoints: 0,
    membershipLevel: 'Bronze Member'
  });

  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: '₹0',
    favoriteRestaurant: '',
    favoriteCuisine: '',
    averageRating: 0,
    deliveryStreak: 0
  });

  // Form States
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const [addingAddress, setAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    type: 'home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: '',
    phone: '',
    isDefault: false
  });

  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addingPayment, setAddingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    type: 'credit_card',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    isDefault: false
  });

  const [preferences, setPreferences] = useState({
    notifications: {
      orderUpdates: true,
      promotions: true,
      priceDrops: false,
      newRestaurants: true,
      deliveryStatus: true
    },
    diet: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false
    },
    delivery: {
      contactless: true,
      leaveAtDoor: false,
      callBeforeDelivery: true
    }
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

  // 🔐 Protect page
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/profile');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch all user data
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // Fetch user profile
      const profileRes = await fetch(`${apiUrl}/users/profile`, { headers });
      if (!profileRes.ok) throw new Error('Failed to fetch profile');
      const profileData = await profileRes.json();
      
      setUserData({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        profilePic: profileData.profilePic || null,
        joinDate: profileData.joinDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        loyaltyPoints: profileData.loyaltyPoints || 0,
        membershipLevel: profileData.membershipLevel || 'Bronze Member'
      });

      setProfileForm({
        name: profileData.name || '',
        phone: profileData.phone || '',
        email: profileData.email || ''
      });

      // Fetch addresses
      const addressRes = await fetch(`${apiUrl}/users/addresses`, { headers });
      if (addressRes.ok) {
        const addressData = await addressRes.json();
        setAddresses(addressData);
      }

      // Fetch payment methods
      const paymentRes = await fetch(`${apiUrl}/users/payment-methods`, { headers });
      if (paymentRes.ok) {
        const paymentData = await paymentRes.json();
        setPaymentMethods(paymentData);
      }

      // Fetch orders
      const ordersRes = await fetch(`${apiUrl}/users/orders`, { headers });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
        
        // Calculate stats from orders
        if (ordersData.length > 0) {
          const total = ordersData.reduce((sum, order) => sum + order.total, 0);
          const restaurantCounts = {};
          ordersData.forEach(order => {
            restaurantCounts[order.restaurantName] = (restaurantCounts[order.restaurantName] || 0) + 1;
          });
          const favoriteRestaurant = Object.keys(restaurantCounts).reduce((a, b) => 
            restaurantCounts[a] > restaurantCounts[b] ? a : b
          );
          
          setStats({
            totalOrders: ordersData.length,
            totalSpent: `${currencySymbol}${total.toFixed(2)}`,
            favoriteRestaurant: favoriteRestaurant || 'N/A',
            favoriteCuisine: 'North Indian', // This would come from order items
            averageRating: 4.8, // Calculate from order ratings
            deliveryStreak: 5 // Track consecutive days
          });
        }
      }

      // Fetch favorites
      const favRes = await fetch(`${apiUrl}/users/favorites`, { headers });
      if (favRes.ok) {
        const favData = await favRes.json();
        setFavorites(favData);
      }

      // Fetch notifications
      const notifRes = await fetch(`${apiUrl}/users/notifications`, { headers });
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(notifData);
      }

      // Fetch user preferences
      const prefRes = await fetch(`${apiUrl}/users/preferences`, { headers });
      if (prefRes.ok) {
        const prefData = await prefRes.json();
        setPreferences(prefData);
      }

      // Fetch rewards
      const rewardRes = await fetch(`${apiUrl}/users/rewards`, { headers });
      if (rewardRes.ok) {
        const rewardData = await rewardRes.json();
        setRewards(rewardData);
      }

    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update Profile
  const updateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });

      if (!response.ok) throw new Error('Failed to update profile');

      setUserData(prev => ({ ...prev, ...profileForm }));
      setEditingProfile(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Add Address
  const addAddress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/users/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressForm)
      });

      if (!response.ok) throw new Error('Failed to add address');

      const newAddress = await response.json();
      setAddresses(prev => [...prev, newAddress]);
      setAddingAddress(false);
      setAddressForm({
        type: 'home',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        landmark: '',
        phone: '',
        isDefault: false
      });
      setSuccess('Address added successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update Address
  const updateAddress = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/users/addresses/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressForm)
      });

      if (!response.ok) throw new Error('Failed to update address');

      const updatedAddress = await response.json();
      setAddresses(prev => prev.map(addr => 
        addr.id === addressId ? updatedAddress : addr
      ));
      setEditingAddressId(null);
      setSuccess('Address updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete Address
  const deleteAddress = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/users/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete address');

      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      setSuccess('Address deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Set Default Address
  const setDefaultAddress = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/users/addresses/${addressId}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to set default address');

      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      })));
      setSuccess('Default address updated!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update Preferences
  const updatePreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/users/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) throw new Error('Failed to update preferences');

      setSuccess('Preferences updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account, preferences, and orders</p>
          </div>

          {/* Success/Error Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="flex-1">{error}</p>
              <button onClick={() => setError(null)} className="hover:text-red-900">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
              <Check className="w-5 h-5 flex-shrink-0" />
              <p className="flex-1">{success}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Left Column - Navigation & Quick Stats */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                      {userData.profilePic ? (
                        <img src={userData.profilePic} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-3xl">{userData.name?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                    <button 
                      onClick={() => setEditingProfile(true)}
                      className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{userData.name || 'User'}</h2>
                  <p className="text-gray-600 text-sm mb-3">{userData.membershipLevel}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    Member since {userData.joinDate}
                  </div>

                  {/* Loyalty Points */}
                  <div className="w-full bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-600" />
                        <span className="font-semibold text-gray-900">Loyalty Points</span>
                      </div>
                      <span className="text-2xl font-bold text-yellow-600">{userData.loyaltyPoints}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                        style={{ width: `${Math.min((userData.loyaltyPoints / 2000) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{2000 - userData.loyaltyPoints} points to next level</p>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-1">
                  {[
                    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
                    { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-5 h-5" />, count: addresses.length },
                    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" />, count: paymentMethods.length },
                    { id: 'orders', label: 'My Orders', icon: <ShoppingBag className="w-5 h-5" />, count: stats.totalOrders },
                    { id: 'favorites', label: 'Favorites', icon: <Heart className="w-5 h-5" />, count: favorites.length },
                    { id: 'preferences', label: 'Preferences', icon: <Settings className="w-5 h-5" /> },
                    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, count: notifications.filter(n => !n.read).length },
                    { id: 'rewards', label: 'Rewards', icon: <Gift className="w-5 h-5" />, count: rewards.filter(r => r.status === 'available').length },
                    { id: 'help', label: 'Help & Support', icon: <HelpCircle className="w-5 h-5" /> }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg mb-1 last:mb-0 transition-colors duration-200 ${
                        activeTab === item.id
                          ? 'bg-orange-50 text-orange-600'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium flex-1 text-left">{item.label}</span>
                      {item.count > 0 && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          activeTab === item.id
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Total Orders</span>
                    <span className="font-bold text-xl">{stats.totalOrders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Total Spent</span>
                    <span className="font-bold">{stats.totalSpent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Avg. Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold">{stats.averageRating}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-blue-400">
                    <div className="text-sm text-blue-200">
                      Delivery streak: {stats.deliveryStreak} days 🔥
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="lg:col-span-3">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                      {!editingProfile ? (
                        <button 
                          onClick={() => setEditingProfile(true)}
                          className="flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingProfile(false);
                              setProfileForm({
                                name: userData.name,
                                phone: userData.phone,
                                email: userData.email
                              });
                            }}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={updateProfile}
                            className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {editingProfile ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                              type="text"
                              value={profileForm.name}
                              onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-lg text-black focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                              type="tel"
                              value={profileForm.phone}
                              onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-lg text-black focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                              type="email"
                              value={profileForm.email}
                              onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-lg text-black focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-black">
                              {userData.name || 'Not set'}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-2 text-black">
                              <Phone className="w-4 h-4 text-gray-400" />
                              {userData.phone || 'Not set'}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                            <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 text-black">
                              {userData.membershipLevel}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-2 text-black">
                              <Mail className="w-4 h-4 text-gray-400" />
                              {userData.email || 'Not set'}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-2 text-black">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {userData.joinDate}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                            <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-green-700 font-semibold">
                              ✅ Verified Account
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h2>
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
                              <p className="text-sm text-gray-600">{order.restaurantName} • {order.items.length} items</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                            <div className="font-semibold text-gray-900">{currencySymbol}{order.total}</div>
                          </div>
                        </div>
                      ))}
                      {orders.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No orders yet</p>
                      )}
                    </div>
                    {orders.length > 0 && (
                      <button 
                        onClick={() => setActiveTab('orders')}
                        className="mt-4 text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
                      >
                        View All Orders
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
                      {!addingAddress ? (
                        <button 
                          onClick={() => setAddingAddress(true)}
                          className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add New Address
                        </button>
                      ) : (
                        <button 
                          onClick={() => setAddingAddress(false)}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Add Address Form */}
                    {addingAddress && (
                      <div className="mb-6 p-4 border-2 border-orange-200 rounded-xl bg-orange-50">
                        <h3 className="font-semibold text-gray-900 mb-4">Add New Address</h3>
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            {['home', 'office', 'other'].map((type) => (
                              <button
                                key={type}
                                onClick={() => setAddressForm({...addressForm, type})}
                                className={`px-4 py-2 rounded-lg capitalize ${
                                  addressForm.type === type
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white text-gray-700 border border-gray-200'
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                          
                          <input
                            type="text"
                            placeholder="Street Address *"
                            value={addressForm.street}
                            onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-orange-500"
                          />
                          
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="City *"
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-orange-500"
                            />
                            <input
                              type="text"
                              placeholder="State *"
                              value={addressForm.state}
                              onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="ZIP Code *"
                              value={addressForm.zipCode}
                              onChange={(e) => setAddressForm({...addressForm, zipCode: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-orange-500"
                            />
                            <input
                              type="text"
                              placeholder="Landmark"
                              value={addressForm.landmark}
                              onChange={(e) => setAddressForm({...addressForm, landmark: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          
                          <input
                            type="tel"
                            placeholder="Phone Number *"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-orange-500"
                          />
                          
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={addressForm.isDefault}
                              onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                              className="rounded text-orange-500"
                            />
                            <span className="text-sm text-gray-700">Set as default address</span>
                          </label>
                          
                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={addAddress}
                              className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600"
                            >
                              Save Address
                            </button>
                            <button
                              onClick={() => setAddingAddress(false)}
                              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Address List */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {addresses.map((address) => (
                        <div key={address.id} className="border border-gray-200 rounded-xl p-5 hover:border-orange-300 transition-colors duration-300">
                          {editingAddressId === address.id ? (
                            // Edit Form
                            <div className="space-y-3">
                              <div className="flex gap-3">
                                {['home', 'office', 'other'].map((type) => (
                                  <button
                                    key={type}
                                    onClick={() => setAddressForm({...addressForm, type})}
                                    className={`px-3 py-1 text-sm rounded-lg capitalize ${
                                      addressForm.type === type
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                              
                              <input
                                type="text"
                                value={addressForm.street}
                                onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                                className="w-full p-2 border border-gray-200 rounded text-sm"
                              />
                              
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={addressForm.city}
                                  onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                                  className="w-full p-2 border border-gray-200 rounded text-sm"
                                />
                                <input
                                  type="text"
                                  value={addressForm.state}
                                  onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                                  className="w-full p-2 border border-gray-200 rounded text-sm"
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={addressForm.zipCode}
                                  onChange={(e) => setAddressForm({...addressForm, zipCode: e.target.value})}
                                  className="w-full p-2 border border-gray-200 rounded text-sm"
                                />
                                <input
                                  type="text"
                                  value={addressForm.landmark}
                                  onChange={(e) => setAddressForm({...addressForm, landmark: e.target.value})}
                                  className="w-full p-2 border border-gray-200 rounded text-sm"
                                />
                              </div>
                              
                              <input
                                type="tel"
                                value={addressForm.phone}
                                onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                                className="w-full p-2 border border-gray-200 rounded text-sm"
                              />
                              
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => updateAddress(address.id)}
                                  className="flex-1 bg-orange-500 text-white py-2 rounded text-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingAddressId(null);
                                    setAddressForm({});
                                  }}
                                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Display Address
                            <>
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className={`p-2 rounded-lg ${
                                    address.type === 'home' ? 'bg-blue-100' :
                                    address.type === 'office' ? 'bg-purple-100' :
                                    'bg-gray-100'
                                  }`}>
                                    {address.type === 'home' ? <Home className="w-4 h-4 text-blue-600" /> :
                                     address.type === 'office' ? <Briefcase className="w-4 h-4 text-purple-600" /> :
                                     <MapPinned className="w-4 h-4 text-gray-600" />}
                                  </div>
                                  <div>
                                    <span className="font-bold text-gray-900 capitalize">{address.type}</span>
                                    {address.isDefault && (
                                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <button 
                                    onClick={() => {
                                      setEditingAddressId(address.id);
                                      setAddressForm(address);
                                    }}
                                    className="p-1 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  {!address.isDefault && (
                                    <button 
                                      onClick={() => deleteAddress(address.id)}
                                      className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-1 text-sm text-gray-600 mt-3">
                                <p>{address.street}</p>
                                <p>{address.city}, {address.state} - {address.zipCode}</p>
                                {address.landmark && <p className="text-gray-500">Landmark: {address.landmark}</p>}
                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                                  <Phone className="w-3 h-3" />
                                  <span>{address.phone}</span>
                                </div>
                              </div>
                              
                              {!address.isDefault && (
                                <button
                                  onClick={() => setDefaultAddress(address.id)}
                                  className="mt-3 text-sm font-semibold text-orange-600 hover:text-orange-700"
                                >
                                  Set as Default
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                      
                      {addresses.length === 0 && !addingAddress && (
                        <div className="col-span-2 text-center py-12 text-gray-500">
                          <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No saved addresses yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
                      {!addingPayment ? (
                        <button 
                          onClick={() => setAddingPayment(true)}
                          className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add New Card
                        </button>
                      ) : (
                        <button 
                          onClick={() => setAddingPayment(false)}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Add Payment Form */}
                    {addingPayment && (
                      <div className="mb-6 p-4 border-2 border-orange-200 rounded-xl bg-orange-50">
                        <h3 className="font-semibold text-gray-900 mb-4">Add Payment Method</h3>
                        <div className="space-y-3">
                          <select
                            value={paymentForm.type}
                            onChange={(e) => setPaymentForm({...paymentForm, type: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-lg text-black"
                          >
                            <option value="credit_card">Credit Card</option>
                            <option value="debit_card">Debit Card</option>
                            <option value="upi">UPI</option>
                          </select>

                          {paymentForm.type !== 'upi' ? (
                            <>
                              <input
                                type="text"
                                placeholder="Card Number"
                                value={paymentForm.cardNumber}
                                onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-lg text-black"
                              />
                              <input
                                type="text"
                                placeholder="Name on Card"
                                value={paymentForm.cardName}
                                onChange={(e) => setPaymentForm({...paymentForm, cardName: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-lg text-black"
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  placeholder="MM/YY"
                                  value={paymentForm.expiry}
                                  onChange={(e) => setPaymentForm({...paymentForm, expiry: e.target.value})}
                                  className="w-full p-3 border border-gray-200 rounded-lg text-black"
                                />
                                <input
                                  type="password"
                                  placeholder="CVV"
                                  value={paymentForm.cvv}
                                  onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})}
                                  className="w-full p-3 border border-gray-200 rounded-lg text-black"
                                />
                              </div>
                            </>
                          ) : (
                            <input
                              type="text"
                              placeholder="UPI ID (e.g., name@okhdfcbank)"
                              value={paymentForm.upiId}
                              onChange={(e) => setPaymentForm({...paymentForm, upiId: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-lg text-black"
                            />
                          )}

                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={paymentForm.isDefault}
                              onChange={(e) => setPaymentForm({...paymentForm, isDefault: e.target.checked})}
                              className="rounded text-orange-500"
                            />
                            <span className="text-sm text-gray-700">Set as default payment method</span>
                          </label>

                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={() => {
                                // Add payment method logic
                                setAddingPayment(false);
                              }}
                              className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setAddingPayment(false)}
                              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors duration-300">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-6 h-6 text-gray-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{method.name}</h4>
                              <p className="text-sm text-gray-600">
                                {method.type === 'credit_card' ? `•••• ${method.last4} • Expires ${method.expiry}` :
                                 method.type === 'upi' ? `ID: ${method.id}` :
                                 `Balance: ${method.balance}`}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {method.isDefault && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                                Default
                              </span>
                            )}
                            <div className="flex gap-2">
                              <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg">
                                <Edit className="w-4 h-4" />
                              </button>
                              {!method.isDefault && (
                                <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {paymentMethods.length === 0 && !addingPayment && (
                        <div className="text-center py-12 text-gray-500">
                          <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No payment methods added yet</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Payment Security */}
                    <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Payment Security</h4>
                          <p className="text-sm text-gray-600">Your payment information is encrypted and secure</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">My Orders</h2>
                    
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-xl p-5 hover:border-orange-300 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-pink-100 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-orange-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
                                <p className="text-sm text-gray-600">{order.restaurantName}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="font-bold text-gray-900">{currencySymbol}{order.total}</div>
                                <div className="text-sm text-gray-500">{order.items.length} items</div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                                order.status === 'on-the-way' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {order.status || 'Pending'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 justify-between items-center">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              {new Date(order.createdAt).toLocaleString()}
                            </div>
                            <button className="text-orange-600 hover:text-orange-700 font-semibold text-sm">
                              Track Order
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {orders.length === 0 && (
                        <div className="text-center py-12">
                          <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-gray-500 mb-4">No orders yet</p>
                          <button
                            onClick={() => router.push('/')}
                            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600"
                          >
                            Browse Restaurants
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === 'favorites' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Favorite Items</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {favorites.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors">
                          <div className="flex gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                  <span className="text-gray-400 text-xl">🍽️</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                <button className="text-red-500 hover:text-red-600">
                                  <Heart className="w-4 h-4 fill-current" />
                                </button>
                              </div>
                              <p className="text-sm text-gray-500 mb-2">{item.restaurantName}</p>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-900">{currencySymbol}{item.price}</span>
                                <button className="text-sm bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600">
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {favorites.length === 0 && (
                        <div className="col-span-2 text-center py-12">
                          <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-gray-500 mb-4">No favorite items yet</p>
                          <button
                            onClick={() => router.push('/')}
                            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600"
                          >
                            Browse Items
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Your Preferences</h2>
                      <button
                        onClick={updatePreferences}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                    
                    <div className="space-y-8">
                      {/* Diet Preferences */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Utensils className="w-5 h-5" />
                          Diet Preferences
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {Object.entries(preferences.diet).map(([key, value]) => (
                            <label key={key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={() => setPreferences({
                                  ...preferences,
                                  diet: { ...preferences.diet, [key]: !value }
                                })}
                                className="rounded text-orange-500"
                              />
                              <span className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Preferences */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Truck className="w-5 h-5" />
                          Delivery Preferences
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(preferences.delivery).map(([key, value]) => (
                            <label key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={value}
                                  onChange={() => setPreferences({
                                    ...preferences,
                                    delivery: { ...preferences.delivery, [key]: !value }
                                  })}
                                  className="rounded text-orange-500"
                                />
                                <span className="font-medium text-gray-900">
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </span>
                              </div>
                              {key === 'contactless' && (
                                <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">Recommended</span>
                              )}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Notification Preferences */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Bell className="w-5 h-5" />
                          Notification Preferences
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(preferences.notifications).map(([key, value]) => (
                            <label key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={value}
                                  onChange={() => setPreferences({
                                    ...preferences,
                                    notifications: { ...preferences.notifications, [key]: !value }
                                  })}
                                  className="rounded text-orange-500"
                                />
                                <span className="font-medium text-gray-900">
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </span>
                              </div>
                              {key === 'orderUpdates' && (
                                <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">Important</span>
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rewards Tab */}
              {activeTab === 'rewards' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Loyalty Rewards</h2>
                        <p className="text-purple-100">Earn points with every order and unlock exclusive benefits</p>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-1">{userData.loyaltyPoints}</div>
                        <div className="text-purple-200">Total Points</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Available Rewards</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {rewards.map((reward) => (
                        <div key={reward.id} className={`p-5 border rounded-xl ${
                          reward.status === 'earned' ? 'border-green-300 bg-green-50' :
                          reward.status === 'in-progress' ? 'border-yellow-300 bg-yellow-50' :
                          'border-gray-200 bg-gray-50'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                reward.status === 'earned' ? 'bg-green-100' :
                                reward.status === 'in-progress' ? 'bg-yellow-100' :
                                'bg-gray-100'
                              }`}>
                                <Gift className={`w-5 h-5 ${
                                  reward.status === 'earned' ? 'text-green-600' :
                                  reward.status === 'in-progress' ? 'text-yellow-600' :
                                  'text-gray-400'
                                }`} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{reward.title}</h4>
                                <div className="flex items-center gap-2 text-sm">
                                  <Award className="w-4 h-4 text-yellow-500" />
                                  <span className="font-semibold">{reward.points} points</span>
                                </div>
                              </div>
                            </div>
                            
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                              reward.status === 'earned' ? 'bg-green-100 text-green-700' :
                              reward.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-500'
                            }`}>
                              {reward.status === 'earned' ? 'Claimed' :
                               reward.status === 'in-progress' ? `${reward.progress}%` :
                               'Locked'}
                            </span>
                          </div>
                          
                          {reward.status === 'in-progress' && (
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                              <div 
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                                style={{ width: `${reward.progress}%` }}
                              ></div>
                            </div>
                          )}
                          
                          {reward.status === 'earned' && (
                            <button className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300">
                              Use Reward
                            </button>
                          )}
                        </div>
                      ))}
                      
                      {rewards.length === 0 && (
                        <div className="col-span-2 text-center py-12">
                          <Gift className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-gray-500">No rewards available yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Notifications</h2>
                    
                    <div className="space-y-3">
                      {notifications.map((notif) => (
                        <div key={notif.id} className={`p-4 rounded-lg border ${
                          notif.read ? 'border-gray-200 bg-white' : 'border-orange-200 bg-orange-50'
                        }`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{notif.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
                            </div>
                            {!notif.read && (
                              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {notifications.length === 0 && (
                        <div className="text-center py-12">
                          <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-gray-500">No notifications</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Help Tab */}
              {activeTab === 'help' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Help & Support</h2>
                    
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Frequently Asked Questions</h3>
                        <div className="space-y-2">
                          {[
                            'How do I track my order?',
                            'What is your return policy?',
                            'How can I change my delivery address?',
                            'What payment methods do you accept?'
                          ].map((question, i) => (
                            <button key={i} className="w-full text-left p-2 hover:bg-gray-50 rounded-lg text-gray-600 text-sm">
                              {question}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                        <p className="text-sm text-gray-600 mb-3">Get help from our support team</p>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                          Contact Us
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8 text-center">
            <button 
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 font-semibold"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}

export default Page