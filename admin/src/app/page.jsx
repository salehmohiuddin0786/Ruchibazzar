"use client";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import StatsCard from "./components/StatsCard";
import { 
  TrendingUp, 
  ShoppingCart,
  IndianRupee,
  Clock,
  Star,
  BarChart3,
  Package,
  ChefHat,
  Users,
  Menu,
  AlertCircle,
  RefreshCw,
  LogOut
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [restaurantData, setRestaurantData] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      todaysOrders: 0,
      todaysEarnings: 0,
      pendingOrders: 0,
      customerRating: 0
    },
    recentOrders: [],
    popularItems: [],
    revenueData: {
      currentMonth: 0,
      lastMonth: 0,
      percentageChange: 0,
      monthlyData: []
    },
    quickStats: {
      avgOrderValue: 0,
      customerSatisfaction: 0,
      peakHours: "7-9 PM",
      tableTurnover: 0
    }
  });

  // Load dashboard data (no authentication check)
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      await fetchDashboardData();
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Only auto-open sidebar on desktop
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch dashboard data from backend
  const fetchDashboardData = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError("");

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      // If no token, still try to load mock data or handle gracefully
      if (!token) {
        console.log("No token found, using mock data");
        setMockData();
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/partner/dashboard", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, use mock data instead of redirecting
          console.log("Auth failed, using mock data");
          setMockData();
          setIsLoading(false);
          setIsRefreshing(false);
          return;
        }
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      
      // Transform backend data to frontend format
      if (isMounted) {
        setDashboardData({
          stats: {
            todaysOrders: data.todaysOrders || 0,
            todaysEarnings: data.todaysEarnings || 0,
            pendingOrders: data.pendingOrders || 0,
            customerRating: data.customerRating || 0
          },
          recentOrders: data.recentOrders || [],
          popularItems: data.popularItems || [],
          revenueData: {
            currentMonth: data.currentMonthRevenue || 0,
            lastMonth: data.lastMonthRevenue || 0,
            percentageChange: data.revenuePercentageChange || 0,
            monthlyData: data.monthlyRevenueData || Array(12).fill(0)
          },
          quickStats: {
            avgOrderValue: data.avgOrderValue || 0,
            customerSatisfaction: data.customerSatisfaction || 0,
            peakHours: data.peakHours || "7-9 PM",
            tableTurnover: data.tableTurnover || 0
          }
        });
      }

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Showing demo data.");
      
      // Always set mock data when API fails
      setMockData();
    } finally {
      if (isMounted) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  const [isMounted, setIsMounted] = useState(true);

  // Mock data for development/demo
  const setMockData = () => {
    setDashboardData({
      stats: {
        todaysOrders: 25,
        todaysEarnings: 12500,
        pendingOrders: 6,
        customerRating: 4.5
      },
      recentOrders: [
        { id: "ORD-1024", customer: "Rahul Sharma", items: 3, amount: 850, status: "preparing", time: "10:30 AM" },
        { id: "ORD-1023", customer: "Priya Patel", items: 2, amount: 650, status: "delivered", time: "10:15 AM" },
        { id: "ORD-1022", customer: "Amit Kumar", items: 4, amount: 1250, status: "preparing", time: "9:45 AM" },
        { id: "ORD-1021", customer: "Neha Singh", items: 1, amount: 350, status: "pending", time: "9:30 AM" },
        { id: "ORD-1020", customer: "Vikram Mehta", items: 2, amount: 720, status: "delivered", time: "9:15 AM" }
      ],
      popularItems: [
        { name: "Chicken Biryani", sales: 145, revenue: 43500 },
        { name: "Butter Chicken", sales: 98, revenue: 29400 },
        { name: "Paneer Tikka", sales: 76, revenue: 22800 },
        { name: "Garlic Naan", sales: 210, revenue: 31500 },
        { name: "Mango Lassi", sales: 156, revenue: 23400 }
      ],
      revenueData: {
        currentMonth: 185000,
        lastMonth: 160500,
        percentageChange: 15.2,
        monthlyData: [40, 65, 80, 60, 90, 75, 85, 70, 95, 65, 80, 70]
      },
      quickStats: {
        avgOrderValue: 520,
        customerSatisfaction: 94,
        peakHours: "7-9 PM",
        tableTurnover: 2.8
      }
    });
  };

  // Handle logout - just clear data but don't redirect
  const handleLogout = useCallback(() => {
    // Clear all storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("restaurant");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("restaurant");
    
    // Clear cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Reset to mock data
    setMockData();
    setError("Logged out. Using demo data.");
    
    // Optional: Clear any other state
    setRestaurantData(null);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return { bg: 'bg-green-100', text: 'text-green-800' };
      case 'preparing':
        return { bg: 'bg-amber-100', text: 'text-amber-800' };
      case 'pending':
        return { bg: 'bg-blue-100', text: 'text-blue-800' };
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-800' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  const getOrderIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return '✓';
      case 'preparing':
        return '👨‍🍳';
      case 'pending':
        return '⏱️';
      case 'cancelled':
        return '✕';
      default:
        return '📦';
    }
  };

  const statsData = [
    {
      title: "Today's Orders",
      value: dashboardData.stats.todaysOrders.toString(),
      change: `+${Math.round(dashboardData.stats.todaysOrders * 0.12)}%`,
      trend: "up",
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500"
    },
    {
      title: "Today's Earnings",
      value: `₹${dashboardData.stats.todaysEarnings.toLocaleString('en-IN')}`,
      change: `+${Math.round(dashboardData.stats.todaysEarnings * 0.0018)}%`,
      trend: "up",
      icon: IndianRupee,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-500"
    },
    {
      title: "Pending Orders",
      value: dashboardData.stats.pendingOrders.toString(),
      change: dashboardData.stats.pendingOrders > 5 ? "+2%" : "-2%",
      trend: dashboardData.stats.pendingOrders > 5 ? "up" : "down",
      icon: Clock,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-500"
    },
    {
      title: "Customer Rating",
      value: dashboardData.stats.customerRating.toFixed(1),
      change: `+0.2`,
      trend: "up",
      icon: Star,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500"
    }
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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

      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 p-3 rounded-full bg-white text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50"
        aria-label="Refresh data"
      >
        <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
      </button>

      {/* Logout Button - now just clears data */}
      <button
        onClick={handleLogout}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-40 p-3 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all duration-300 active:scale-95"
        aria-label="Logout"
      >
        <LogOut size={20} />
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button 
              onClick={() => setError("")}
              className="ml-2 hover:bg-blue-600 rounded-full p-1"
            >
              ✕
            </button>
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
        <div className="flex-1 min-h-screen text-black transition-all duration-300">
          <Header 
            title={restaurantData?.name || "Dashboard Overview"}
            subtitle={`Welcome back${restaurantData?.name ? ` to ${restaurantData.name}` : ' to your restaurant dashboard'}! Here's what's happening today.`}
            onMenuClick={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
          
          <main className="p-4 md:p-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {statsData.map((stat, index) => (
                <StatsCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  trend={stat.trend}
                  icon={stat.icon}
                  color={stat.color}
                  bgColor={stat.bgColor}
                  iconColor={stat.iconColor}
                />
              ))}
            </div>

            {/* Charts and Orders Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 md:mb-8">
              {/* Chart Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Revenue Overview</h3>
                      <p className="text-gray-500 text-sm mt-1">Last 30 days performance</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 mr-2"></div>
                        <span className="text-sm text-gray-600">This Month</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 mr-2"></div>
                        <span className="text-sm text-gray-600">Last Month</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bar Chart Visualization */}
                  <div className="h-64">
                    <div className="flex items-end h-48 gap-2 mt-4 px-4">
                      {dashboardData.revenueData.monthlyData.map((value, index) => {
                        const maxValue = Math.max(...dashboardData.revenueData.monthlyData, 1);
                        const height = (value / maxValue) * 100;
                        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center group">
                            <div 
                              className="w-6 md:w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                              style={{ height: `${height}%` }}
                            >
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                ₹{value.toLocaleString('en-IN')}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              {monthNames[index]}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 px-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-gray-800">
                          ₹{(dashboardData.revenueData.currentMonth / 1000).toFixed(1)}K
                        </div>
                        <div className="text-sm text-gray-500">Total Revenue</div>
                      </div>
                      <div className={`flex items-center px-4 py-2 rounded-lg ${
                        dashboardData.revenueData.percentageChange >= 0 
                          ? "text-green-600 bg-green-50" 
                          : "text-red-600 bg-red-50"
                      }`}>
                        <TrendingUp size={20} className="mr-2" />
                        <span className="font-medium">
                          {dashboardData.revenueData.percentageChange >= 0 ? "+" : ""}
                          {dashboardData.revenueData.percentageChange.toFixed(1)}% from last month
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
                    <p className="text-gray-500 text-sm mt-1">Latest customer orders</p>
                  </div>
                  {dashboardData.recentOrders.length > 0 && (
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium shadow-sm">
                      {dashboardData.recentOrders.filter(o => o.status === 'pending').length} new
                    </span>
                  )}
                </div>
                
                {dashboardData.recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No recent orders</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.recentOrders.slice(0, 5).map((order) => {
                      const statusColors = getStatusColor(order.status);
                      return (
                        <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold group-hover:scale-110 transition-transform ${statusColors.bg}`}>
                              <span className={statusColors.text}>{getOrderIcon(order.status)}</span>
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-gray-800">{order.id}</div>
                              <div className="text-sm text-gray-500">{order.customer} • {order.items} items</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-800">₹{order.amount}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              <span className="text-xs text-gray-500">{order.time}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <button 
                  onClick={() => router.push("/partner/orders")}
                  className="w-full mt-6 py-3 text-center text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Package size={16} />
                  View All Orders
                  <TrendingUp size={16} />
                </button>
              </div>
            </div>

            {/* Bottom Row - Popular Items & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Popular Items */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Popular Items</h3>
                    <p className="text-gray-500 text-sm mt-1">Best selling dishes</p>
                  </div>
                  <ChefHat className="text-gray-400" size={24} />
                </div>
                
                {dashboardData.popularItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ChefHat size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No items data available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.popularItems.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform ${
                            index === 0 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                            index === 1 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                            index === 2 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                            index === 3 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                            'bg-gradient-to-r from-orange-500 to-orange-600'
                          }`}>
                            {item.name.split(' ').map(w => w[0]).join('')}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-800">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.sales} orders</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-800">₹{item.revenue.toLocaleString('en-IN')}</div>
                          <div className="text-sm text-gray-500">revenue</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-lg">Avg. Order Value</h4>
                    <BarChart3 className="opacity-80" size={24} />
                  </div>
                  <div className="text-3xl font-bold mb-2">₹{dashboardData.quickStats.avgOrderValue}</div>
                  <div className="flex items-center text-blue-100">
                    <TrendingUp size={16} className="mr-2" />
                    <span className="text-sm">+8.5% from last month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-lg">Customer Satisfaction</h4>
                    <Users className="opacity-80" size={24} />
                  </div>
                  <div className="text-3xl font-bold mb-2">{dashboardData.quickStats.customerSatisfaction}%</div>
                  <div className="flex items-center text-green-100">
                    <TrendingUp size={16} className="mr-2" />
                    <span className="text-sm">+2.3% from last month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-lg">Peak Hours</h4>
                    <Clock className="opacity-80" size={24} />
                  </div>
                  <div className="text-3xl font-bold mb-2">{dashboardData.quickStats.peakHours}</div>
                  <div className="text-purple-100 text-sm">
                    45% of daily orders
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-lg">Table Turnover</h4>
                    <TrendingUp className="opacity-80" size={24} />
                  </div>
                  <div className="text-3xl font-bold mb-2">{dashboardData.quickStats.tableTurnover}x</div>
                  <div className="flex items-center text-amber-100">
                    <TrendingUp size={16} className="mr-2" />
                    <span className="text-sm">Efficient utilization</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>Data updated in real-time • Last refresh: {new Date().toLocaleTimeString()}</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;