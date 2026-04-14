"use client";
// import SuperHeader from "../components/SuperHeader";
import SuperLayout from "../SuperLayout/page";
import { 
  Store,
  ShoppingCart,
  Truck,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  LineChart,
  Package,
  Star,
  Users,
  Download,
  RefreshCw,
  Clock,
  Bell,
  ChevronRight
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SuperDashboard = () => {
  // Sample data for charts
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue 2024',
        data: [65000, 75000, 85000, 95000, 110000, 125000],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const orderData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [65, 75, 85, 95, 110, 125, 140],
        backgroundColor: '#8b5cf6',
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const stats = [
    {
      title: "Total Vendors",
      value: "48",
      change: "+12%",
      trend: "up",
      icon: Store,
      lightColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: "1,250",
      change: "+23%",
      trend: "up",
      icon: ShoppingCart,
      lightColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Delivery Partners",
      value: "120",
      change: "-3%",
      trend: "down",
      icon: Truck,
      lightColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Revenue",
      value: "₹4.85L",
      change: "+18%",
      trend: "up",
      icon: IndianRupee,
      lightColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  const recentActivities = [
    { id: 1, action: "New vendor registered", time: "5 minutes ago", icon: Store, color: "text-blue-600", bgColor: "bg-blue-50" },
    { id: 2, action: "Order #12345 completed", time: "15 minutes ago", icon: Package, color: "text-green-600", bgColor: "bg-green-50" },
    { id: 3, action: "New delivery partner joined", time: "1 hour ago", icon: Truck, color: "text-purple-600", bgColor: "bg-purple-50" },
    { id: 4, action: "Payment received", time: "2 hours ago", icon: IndianRupee, color: "text-amber-600", bgColor: "bg-amber-50" },
    { id: 5, action: "System update completed", time: "3 hours ago", icon: RefreshCw, color: "text-gray-600", bgColor: "bg-gray-50" },
  ];

  const topVendors = [
    { name: "Fresh Foods", orders: 245, revenue: "₹45,000", rating: 4.8 },
    { name: "Organic Mart", orders: 198, revenue: "₹38,500", rating: 4.9 },
    { name: "Daily Needs", orders: 167, revenue: "₹32,000", rating: 4.7 },
    { name: "Super Store", orders: 145, revenue: "₹28,500", rating: 4.6 },
    { name: "Green Grocers", orders: 132, revenue: "₹25,800", rating: 4.8 },
  ];

  return (
    <SuperLayout>
      {/* <SuperHeader title="Dashboard" /> */}
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Super Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">Welcome back! Here's what's happening with your platform today.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg text-sm font-medium inline-flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              <span>Report</span>
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium inline-flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button className="sm:hidden p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${stat.lightColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {stat.trend === 'up' ? 
                      <TrendingUp className="w-3 h-3" /> : 
                      <TrendingDown className="w-3 h-3" />
                    }
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
                  <div className="flex items-baseline justify-between mt-1">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Revenue Overview</h2>
                <p className="text-sm text-gray-500">Last 6 months</p>
              </div>
              <div className="p-2 bg-indigo-50 rounded-lg">
                <LineChart className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div className="h-64">
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Weekly Orders</h2>
                <p className="text-sm text-gray-500">Last 7 days</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="h-64">
              <Bar data={orderData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Vendors */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Top Performing Vendors</h2>
                <Users className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topVendors.map((vendor, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <Store className="w-4 h-4 text-indigo-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{vendor.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vendor.orders}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vendor.revenue}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-700">{vendor.rating}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-4">
            <p className="text-xs text-indigo-600 font-medium">Active Vendors</p>
            <p className="text-xl font-bold text-indigo-900">42</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4">
            <p className="text-xs text-green-600 font-medium">Pending Orders</p>
            <p className="text-xl font-bold text-green-900">18</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4">
            <p className="text-xs text-purple-600 font-medium">On Delivery</p>
            <p className="text-xl font-bold text-purple-900">24</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4">
            <p className="text-xs text-amber-600 font-medium">New Tickets</p>
            <p className="text-xl font-bold text-amber-900">7</p>
          </div>
        </div>
      </div>
    </SuperLayout>
  );
};

export default SuperDashboard;