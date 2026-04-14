"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Filter, 
  Download, 
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  Package,
  User,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Menu,
  X,
  SlidersHorizontal,
  ChevronDown,
  AlertCircle,
  Check,
  Ban,
  Volume2,
  VolumeX
} from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import OrderCard from "../components/OrderCard";

// Import sound file directly (Option 2)
// import notificationSound from '../../../public/sounds/notification.mp3';

const Orders = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [restaurantData, setRestaurantData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef(null);
  const previousOrdersRef = useRef([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    preparing: 0,
    ready: 0,
    onTheWay: 0,
    delivered: 0,
    cancelled: 0
  });
  const [dateRange, setDateRange] = useState("today");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // Initialize audio with imported sound file (Option 2)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use the imported notification sound
      audioRef.current = new Audio('../../../public/sounds/notification.mp3');
      audioRef.current.preload = 'auto';
      audioRef.current.volume = 0.7; // Set volume to 70%
      
      // Load sound preference from localStorage
      const savedSoundPreference = localStorage.getItem('soundEnabled');
      if (savedSoundPreference !== null) {
        setSoundEnabled(savedSoundPreference === 'true');
      }
      
      // Cleanup on unmount
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, []);

  // Check authentication and load data
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const restaurant = localStorage.getItem("restaurant");

      if (!token || !user) {
        router.push("/Login");
        return false;
      }

      try {
        const userData = JSON.parse(user);
        if (userData.role !== "partner") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("restaurant");
          router.push("/Login");
          return false;
        }

        if (restaurant) {
          setRestaurantData(JSON.parse(restaurant));
        }

        return true;
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/Login");
        return false;
      }
    };

    if (checkAuth()) {
      fetchOrders();
      
      // Set up polling for new orders every 10 seconds
      const intervalId = setInterval(() => {
        fetchOrders(false, pagination.page, true); // silent refresh
      }, 10000);
      
      return () => clearInterval(intervalId);
    }
  }, [router]);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0; // Reset to start
      audioRef.current.play().catch(err => {
        console.log("Audio play failed:", err);
        // Silent fail - don't show error to user
      });
    }
  }, [soundEnabled]);

  // Check for new orders
  const checkForNewOrders = useCallback((newOrders, oldOrders) => {
    if (!oldOrders.length) return;
    
    // Find orders that are new (not in old orders list)
    const oldOrderIds = new Set(oldOrders.map(order => order.id));
    const newOrderIds = newOrders
      .filter(order => !oldOrderIds.has(order.id))
      .map(order => order.id);
    
    if (newOrderIds.length > 0) {
      // Play sound for new orders
      playNotificationSound();
      
      // Show browser notification if supported
      if (Notification.permission === "granted") {
        newOrderIds.forEach(orderId => {
          const newOrder = newOrders.find(o => o.id === orderId);
          if (newOrder) {
            new Notification("🔔 New Order Received!", {
              body: `Order #${newOrder.orderNumber} from ${newOrder.customer} - ₹${newOrder.total}`,
              icon: "/restaurant-icon.png",
              tag: `order-${orderId}`,
              badge: "/favicon.ico"
            });
          }
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
      }
      
      // Show visual alert
      setSuccessMessage(`🔔 ${newOrderIds.length} new order${newOrderIds.length > 1 ? 's' : ''} received!`);
      setTimeout(() => setSuccessMessage(""), 5000);
      
      // Flash the page title
      const originalTitle = document.title;
      document.title = `🔔 ${newOrderIds.length} New Order${newOrderIds.length > 1 ? 's' : ''}!`;
      setTimeout(() => {
        document.title = originalTitle;
      }, 5000);
    }
  }, [playNotificationSound]);

  // Toggle sound
  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem('soundEnabled', newState);
    if (newState) {
      // Play test sound when enabling
      playNotificationSound();
      setSuccessMessage("🔊 Sound notifications enabled");
      setTimeout(() => setSuccessMessage(""), 2000);
    } else {
      setSuccessMessage("🔇 Sound notifications disabled");
      setTimeout(() => setSuccessMessage(""), 2000);
    }
  };

  // Fetch orders from backend
  const fetchOrders = useCallback(async (showRefresh = false, page = 1, silent = false) => {
    if (showRefresh) {
      setIsRefreshing(true);
    } else if (!silent) {
      setIsLoading(true);
    }
    setError("");

    try {
      const token = localStorage.getItem("token");
      const restaurant = JSON.parse(localStorage.getItem("restaurant"));
      
      if (!token || !restaurant) {
        router.push("/Login");
        return;
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        dateRange: dateRange,
        ...(filter !== "all" && { status: filter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(
        `http://localhost:5000/api/orders/restaurant/${restaurant.id}?${params}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("restaurant");
          router.push("/Login");
          return;
        }
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      
      // Transform orders data
      const formattedOrders = data.orders.map(order => ({
        id: order.id,
        orderNumber: `ORD-${order.id}`,
        customer: order.user?.name || "Customer",
        phone: order.user?.phone || order.deliveryAddress?.phone || "",
        address: order.deliveryAddress ? 
          `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pincode}` : 
          "",
        items: order.items || [],
        amount: order.subtotal || 0,
        tax: order.tax || 0,
        delivery: order.deliveryFee || 0,
        discount: order.discount || 0,
        total: order.totalAmount || 0,
        status: order.status || "pending",
        time: new Date(order.createdAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit"
        }),
        date: new Date(order.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        }),
        deliveryType: order.deliveryType || "delivery",
        payment: order.paymentMethod || "Cash",
        paymentStatus: order.paymentStatus || "pending",
        orderType: order.orderType || "regular",
        estimatedTime: order.estimatedDeliveryTime ? 
          new Date(order.estimatedDeliveryTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
          }) : "",
        specialInstructions: order.specialInstructions || "",
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }));

      // Check for new orders (only if not silent and not first load)
      if (!silent && previousOrdersRef.current.length > 0) {
        checkForNewOrders(formattedOrders, previousOrdersRef.current);
      }
      
      // Store current orders for next comparison
      previousOrdersRef.current = formattedOrders;
      
      setOrders(formattedOrders);
      
      // Update stats
      setStats({
        total: data.totalOrders || 0,
        new: data.stats?.pending || 0,
        preparing: data.stats?.preparing || 0,
        ready: data.stats?.ready || 0,
        onTheWay: data.stats?.onTheWay || 0,
        delivered: data.stats?.delivered || 0,
        cancelled: data.stats?.cancelled || 0
      });

      // Update pagination
      setPagination({
        page: data.currentPage || 1,
        limit: data.limit || 20,
        total: data.totalOrders || 0,
        totalPages: data.totalPages || 1
      });

    } catch (err) {
      console.error("Error fetching orders:", err);
      if (!silent) {
        setError("Failed to load orders. Please try again.");
      }
      
      // Set mock data for development
      if (process.env.NODE_ENV === "development") {
        setMockData();
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [router, filter, searchTerm, dateRange, pagination.limit, checkForNewOrders]);

  // Mock data for development
  const setMockData = () => {
    const mockOrders = [
      { 
        id: 1024,
        orderNumber: "ORD-1024", 
        customer: "Rahul Sharma", 
        phone: "+91 98765 43210",
        address: "123 MG Road, Bangalore, Karnataka - 560001",
        items: [
          { name: "Chicken Biryani", quantity: 2, price: 280, total: 560 },
          { name: "Butter Naan", quantity: 3, price: 45, total: 135 },
          { name: "Coke 750ml", quantity: 2, price: 60, total: 120 }
        ],
        amount: 815, 
        tax: 122,
        delivery: 40,
        total: 977,
        status: "pending",
        time: "10:30 AM",
        date: "Today",
        deliveryType: "delivery",
        payment: "online",
        paymentStatus: "paid",
        orderType: "regular",
        estimatedTime: "11:30 AM",
        specialInstructions: "Less spicy, Extra napkins please"
      },
      { 
        id: 1023,
        orderNumber: "ORD-1023", 
        customer: "Ayesha Patel", 
        phone: "+91 87654 32109",
        address: "456 Koramangala, 3rd Block, Bangalore",
        items: [
          { name: "Paneer Butter Masala", quantity: 1, price: 320, total: 320 },
          { name: "Garlic Naan", quantity: 2, price: 50, total: 100 },
          { name: "Raita", quantity: 1, price: 40, total: 40 }
        ],
        amount: 460, 
        tax: 69,
        delivery: 0,
        total: 529,
        status: "preparing",
        time: "10:15 AM",
        date: "Today",
        deliveryType: "pickup",
        payment: "cash",
        paymentStatus: "pending",
        orderType: "regular",
        estimatedTime: "10:45 AM",
        specialInstructions: "No onion, no garlic"
      }
    ];

    setOrders(mockOrders);
    previousOrdersRef.current = mockOrders;
    setStats({
      total: mockOrders.length,
      new: mockOrders.filter(o => o.status === "pending").length,
      preparing: mockOrders.filter(o => o.status === "preparing").length,
      ready: 0,
      onTheWay: 0,
      delivered: 0,
      cancelled: 0
    });
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const data = await response.json();
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );

      // Update stats
      setStats(prev => {
        const updated = { ...prev };
        // Decrement old status count if exists
        const oldOrder = orders.find(o => o.id === orderId);
        if (oldOrder) {
          const oldStatusKey = getStatusKey(oldOrder.status);
          if (updated[oldStatusKey] > 0) updated[oldStatusKey]--;
        }
        // Increment new status count
        const newStatusKey = getStatusKey(newStatus);
        updated[newStatusKey]++;
        return updated;
      });

      setSuccessMessage(`Order #${orderId} marked as ${newStatus}`);
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update order status");
      setTimeout(() => setError(""), 3000);
    }
  };

  const getStatusKey = (status) => {
    const keyMap = {
      'pending': 'new',
      'preparing': 'preparing',
      'ready': 'ready',
      'on the way': 'onTheWay',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    return keyMap[status.toLowerCase()] || 'new';
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (isMobile) {
      document.body.style.overflow = !sidebarOpen ? 'hidden' : 'unset';
    }
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
      document.body.style.overflow = 'unset';
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleRefresh = () => {
    fetchOrders(true);
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      const restaurant = JSON.parse(localStorage.getItem("restaurant"));
      
      const params = new URLSearchParams({
        dateRange: dateRange,
        ...(filter !== "all" && { status: filter })
      });

      const response = await fetch(
        `http://localhost:5000/api/orders/restaurant/${restaurant.id}/export?${params}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccessMessage("Orders exported successfully");
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (err) {
      console.error("Export error:", err);
      setError("Failed to export orders");
      setTimeout(() => setError(""), 3000);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    return order.status.toLowerCase() === filter.toLowerCase();
  }).filter(order => {
    if (!searchTerm) return true;
    return (
      order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm)
    );
  });

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'from-blue-500 to-blue-600';
      case 'preparing': return 'from-amber-500 to-amber-600';
      case 'ready': return 'from-purple-500 to-purple-600';
      case 'on the way': return 'from-indigo-500 to-indigo-600';
      case 'delivered': return 'from-green-500 to-green-600';
      case 'cancelled': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return Clock;
      case 'preparing': return RefreshCw;
      case 'ready': return CheckCircle;
      case 'on the way': return Truck;
      case 'delivered': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Package;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  const MobileFilterDrawer = () => (
    <>
      {showMobileFilters && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={() => setShowMobileFilters(false)}
        />
      )}
      
      <div className={`
        fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 md:hidden
        transform transition-transform duration-300 ease-in-out
        ${showMobileFilters ? 'translate-y-0' : 'translate-y-full'}
        shadow-2xl
      `}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Filter Orders</h3>
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Order Status
              </label>
              <div className="space-y-2">
                {[
                  { value: "all", label: "All Orders", icon: "📦" },
                  { value: "pending", label: "New Orders", icon: "🆕" },
                  { value: "preparing", label: "Preparing", icon: "👨‍🍳" },
                  { value: "ready", label: "Ready", icon: "✅" },
                  { value: "on the way", label: "On the Way", icon: "🚚" },
                  { value: "delivered", label: "Delivered", icon: "✅" },
                  { value: "cancelled", label: "Cancelled", icon: "❌" }
                ].map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setFilter(value);
                      setShowMobileFilters(false);
                    }}
                    className={`
                      w-full px-4 py-3 rounded-xl text-left font-medium transition-all
                      ${filter === value 
                        ? `bg-gradient-to-r ${getStatusColor(value)} text-white shadow-md` 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>{icon} {label}</span>
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                        {value === "all" ? orders.length : orders.filter(o => o.status.toLowerCase() === value).length}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Toggle Button */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 active:scale-95"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sound Toggle Button */}
      <button
        onClick={toggleSound}
        className="fixed bottom-24 left-4 md:bottom-8 md:left-8 z-40 p-3 rounded-full bg-white text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
        aria-label="Toggle sound notifications"
      >
        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      {/* Mobile Filter Button */}
      {isMobile && (
        <button
          onClick={() => setShowMobileFilters(true)}
          className="md:hidden fixed bottom-24 right-4 z-50 p-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 active:scale-95"
          aria-label="Filter orders"
        >
          <SlidersHorizontal size={24} />
          {filter !== 'all' && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
              1
            </span>
          )}
        </button>
      )}

      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="fixed bottom-24 right-20 md:bottom-8 md:right-8 z-40 p-3 rounded-full bg-white text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50"
        aria-label="Refresh orders"
      >
        <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
      </button>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div className={`${successMessage.includes('new order') ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-green-500'} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`}>
            {successMessage.includes('new order') && '🔔'}
            <CheckCircle size={20} />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button 
              onClick={() => setError("")}
              className="ml-2 hover:bg-red-600 rounded-full p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={closeSidebar}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          onToggle={toggleSidebar}
        />
        
        {/* Main Content */}
        <div className="flex-1 min-h-screen text-black transition-all duration-300 w-full md:w-auto overflow-x-hidden">
          <Header 
            title="Orders Management" 
            subtitle={restaurantData?.name ? `Managing orders for ${restaurantData.name}` : "Track, manage, and fulfill customer orders efficiently"}
            onMenuClick={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
          
          <main className="p-4 md:p-6 pb-24 md:pb-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-xs mb-1">Total Orders</p>
                    <h3 className="text-xl font-bold">{stats.total}</h3>
                  </div>
                  <Package className="opacity-80" size={20} />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-xs mb-1">New Orders</p>
                    <h3 className="text-xl font-bold">{stats.new}</h3>
                  </div>
                  <Clock className="opacity-80" size={20} />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-xs mb-1">Preparing</p>
                    <h3 className="text-xl font-bold">{stats.preparing}</h3>
                  </div>
                  <RefreshCw className="opacity-80" size={20} />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-xs mb-1">Delivered</p>
                    <h3 className="text-xl font-bold">{stats.delivered}</h3>
                  </div>
                  <CheckCircle className="opacity-80" size={20} />
                </div>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by order ID, customer name or phone..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Desktop Filters */}
                <div className="hidden md:flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <select 
                      className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="all">All Orders</option>
                      <option value="pending">New Orders</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="on the way">On the Way</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    >
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={handleExport}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
                  >
                    <Download size={18} />
                    Export
                  </button>
                </div>
              </div>
              
              {/* Quick Filter Chips */}
              <div className="hidden md:flex flex-wrap gap-2 mt-3">
                {[
                  { value: "all", label: "All", icon: "📦" },
                  { value: "pending", label: "New", icon: "🆕" },
                  { value: "preparing", label: "Prep", icon: "👨‍🍳" },
                  { value: "ready", label: "Ready", icon: "✅" },
                  { value: "on the way", label: "On Way", icon: "🚚" },
                  { value: "delivered", label: "Done", icon: "✅" }
                ].map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() => setFilter(value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      filter === value 
                        ? `bg-gradient-to-r ${getStatusColor(value)} text-white shadow-md` 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {icon} {label}
                    <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                      {value === "all" ? orders.length : orders.filter(o => o.status.toLowerCase() === value).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">
                  Orders ({filteredOrders.length})
                </h2>
                {(filter !== "all" || searchTerm) && (
                  <button 
                    onClick={() => {
                      setFilter("all");
                      setSearchTerm("");
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {filteredOrders.length > 0 ? (
                <div className="space-y-3">
                  {filteredOrders.map((order) => (
                    <OrderCard 
                      key={order.id} 
                      order={order}
                      isExpanded={expandedOrder === order.id}
                      onToggleDetails={() => toggleOrderDetails(order.id)}
                      onUpdateStatus={updateOrderStatus}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <Package className="mx-auto text-gray-400 mb-3" size={48} />
                  <h3 className="text-lg font-bold text-gray-700 mb-2">No orders found</h3>
                  <p className="text-gray-500">
                    {searchTerm 
                      ? `No orders match "${searchTerm}"`
                      : `No ${filter === "all" ? "" : filter + " "}orders`}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchOrders(false, pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => fetchOrders(false, pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer />
    </div>
  );
};

export default Orders;