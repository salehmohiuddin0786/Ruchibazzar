"use client";
import { useState } from "react";
import SuperLayout from "../SuperLayout/page";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Wallet,
  CreditCard,
  Smartphone,
  Landmark,
  PieChart,
  BarChart3,
  LineChart,
  Award,
  Users,
  Store,
  ShoppingBag,
  Truck,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Earnings = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [showFilters, setShowFilters] = useState(false);

  // Sample earnings data
  const earningsData = {
    totalRevenue: 4850000,
    platformFee: 485000,
    vendorPayout: 4365000,
    deliveryPartnerPayout: 291000,
    netProfit: 194000,
    growth: 23.5,
  };

  // Monthly revenue data
  const monthlyRevenue = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue 2024',
        data: [425000, 455000, 485000, 512000, 548000, 589000, 623000, 667000, 712000, 758000, 805000, 854000],
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

  // Revenue breakdown by source
  const revenueBySource = {
    labels: ['Commission', 'Delivery Fees', 'Subscription', 'Advertising'],
    datasets: [
      {
        data: [65, 20, 10, 5],
        backgroundColor: [
          '#6366f1',
          '#8b5cf6',
          '#ec4899',
          '#f59e0b',
        ],
        borderWidth: 0,
      },
    ],
  };

  // Weekly revenue data
  const weeklyRevenue = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'This Week',
        data: [125000, 142000, 138000, 156000, 189000, 245000, 198000],
        backgroundColor: '#6366f1',
        borderRadius: 8,
      },
      {
        label: 'Last Week',
        data: [112000, 128000, 135000, 142000, 168000, 212000, 175000],
        backgroundColor: '#94a3b8',
        borderRadius: 8,
      },
    ],
  };

  // Transaction history
  const transactions = [
    {
      id: "TXN-001",
      date: "2024-03-15T10:30:00",
      description: "Commission from Fresh Foods",
      amount: 12500,
      type: "credit",
      status: "completed",
      category: "commission",
    },
    {
      id: "TXN-002",
      date: "2024-03-15T09:15:00",
      description: "Delivery fees from Order #ORD-1234",
      amount: 4500,
      type: "credit",
      status: "completed",
      category: "delivery",
    },
    {
      id: "TXN-003",
      date: "2024-03-14T16:45:00",
      description: "Vendor payout - Organic Mart",
      amount: 25000,
      type: "debit",
      status: "completed",
      category: "payout",
    },
    {
      id: "TXN-004",
      date: "2024-03-14T14:20:00",
      description: "Subscription fee - Daily Needs",
      amount: 5000,
      type: "credit",
      status: "completed",
      category: "subscription",
    },
    {
      id: "TXN-005",
      date: "2024-03-14T11:30:00",
      description: "Advertising fee - Gourmet Foods",
      amount: 2500,
      type: "credit",
      status: "pending",
      category: "advertising",
    },
    {
      id: "TXN-006",
      date: "2024-03-13T15:10:00",
      description: "Delivery partner payout - Rahul Sharma",
      amount: 8900,
      type: "debit",
      status: "completed",
      category: "payout",
    },
  ];

  // Top performing vendors
  const topVendors = [
    { name: "Fresh Foods", revenue: 345000, commission: 34500, orders: 1250 },
    { name: "Organic Mart", revenue: 289000, commission: 28900, orders: 980 },
    { name: "Daily Needs", revenue: 267000, commission: 26700, orders: 890 },
    { name: "Spice Bazaar", revenue: 198000, commission: 19800, orders: 670 },
    { name: "Gourmet Foods", revenue: 156000, commission: 15600, orders: 520 },
  ];

  // Chart options
  const lineChartOptions = {
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
        padding: 8,
        cornerRadius: 6,
        callbacks: {
          label: function(context) {
            return `₹${(context.parsed.y / 1000).toFixed(1)}K`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value) {
            return '₹' + (value / 1000).toFixed(0) + 'K';
          },
          font: {
            size: 10
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10
          }
        }
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            size: 10
          }
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 8,
        cornerRadius: 6,
        callbacks: {
          label: function(context) {
            return `₹${(context.parsed.y / 1000).toFixed(1)}K`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value) {
            return '₹' + (value / 1000).toFixed(0) + 'K';
          },
          font: {
            size: 10
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10
          }
        }
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 10,
          font: {
            size: 10
          }
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 8,
        cornerRadius: 6,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      },
    },
    cutout: '65%',
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `₹${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', { 
      day: '2-digit', 
      month: 'short',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Mobile card view for transactions
  const MobileTransactionCard = ({ transaction }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-4 mb-3 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-medium text-gray-900 text-sm">{transaction.id}</p>
          <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
        </div>
        <span className={`text-xs font-semibold ${
          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
        }`}>
          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{transaction.description}</p>
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
          transaction.type === 'credit' 
            ? 'bg-green-50 text-green-700'
            : 'bg-red-50 text-red-700'
        }`}>
          {transaction.type}
        </span>
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          transaction.status === 'completed'
            ? 'bg-green-50 text-green-700'
            : 'bg-amber-50 text-amber-700'
        }`}>
          {transaction.status === 'completed' ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <Clock className="w-3 h-3" />
          )}
          {transaction.status}
        </span>
      </div>
    </div>
  );

  // Mobile card view for vendors
  const MobileVendorCard = ({ vendor, index }) => {
    const contribution = (vendor.revenue / earningsData.totalRevenue) * 100;
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-3 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
            index === 0 ? 'from-yellow-500 to-yellow-600' :
            index === 1 ? 'from-gray-400 to-gray-500' :
            index === 2 ? 'from-amber-700 to-amber-800' :
            'from-indigo-500 to-indigo-600'
          } flex items-center justify-center text-white font-semibold text-sm`}>
            {vendor.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-900">{vendor.name}</p>
            <p className="text-xs text-gray-500">{vendor.orders} orders</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-sm font-semibold text-gray-900">{formatCurrency(vendor.revenue)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Commission</p>
            <p className="text-sm font-semibold text-gray-900">{formatCurrency(vendor.commission)}</p>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-600">Contribution</span>
            <span className="text-gray-900 font-medium">{contribution.toFixed(1)}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${contribution}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <SuperLayout>
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Earnings & Analytics
            </h1>
            <p className="text-gray-500 mt-0.5 text-xs sm:text-sm">
              Track your platform's financial performance
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5">
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Export</span>
            </button>
            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Select Date</span>
            </button>
          </div>
        </div>

        {/* Main Stats Cards - Responsive grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg">
                <IndianRupee className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                +{earningsData.growth}%
              </span>
            </div>
            <div className="mt-2 sm:mt-3">
              <h3 className="text-gray-600 text-[10px] sm:text-xs font-medium">Total Revenue</h3>
              <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mt-0.5">
                {formatCurrency(earningsData.totalRevenue)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="p-1.5 sm:p-2 bg-purple-50 rounded-lg">
                <Wallet className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
                Fee
              </span>
            </div>
            <div className="mt-2 sm:mt-3">
              <h3 className="text-gray-600 text-[10px] sm:text-xs font-medium">Commission</h3>
              <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mt-0.5">
                {formatCurrency(earningsData.platformFee)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg">
                <TrendingUp className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                Net
              </span>
            </div>
            <div className="mt-2 sm:mt-3">
              <h3 className="text-gray-600 text-[10px] sm:text-xs font-medium">Net Profit</h3>
              <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mt-0.5">
                {formatCurrency(earningsData.netProfit)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="p-1.5 sm:p-2 bg-amber-50 rounded-lg">
                <Award className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-600" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                Margin
              </span>
            </div>
            <div className="mt-2 sm:mt-3">
              <h3 className="text-gray-600 text-[10px] sm:text-xs font-medium">Profit Margin</h3>
              <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mt-0.5">
                {((earningsData.netProfit / earningsData.totalRevenue) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period.toLowerCase())}
                  className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    selectedPeriod === period.toLowerCase()
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
              >
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
              </select>
              {selectedPeriod === "monthly" && (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                >
                  <option>Jan</option>
                  <option>Feb</option>
                  <option>Mar</option>
                  <option>Apr</option>
                  <option>May</option>
                  <option>Jun</option>
                  <option>Jul</option>
                  <option>Aug</option>
                  <option>Sep</option>
                  <option>Oct</option>
                  <option>Nov</option>
                  <option>Dec</option>
                </select>
              )}
              <button className="p-1.5 sm:p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-gray-800">Revenue Overview</h2>
                <p className="text-xs text-gray-500">{selectedYear}</p>
              </div>
              <div className="p-1.5 sm:p-2 bg-indigo-50 rounded-lg">
                <LineChart className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              </div>
            </div>
            <div className="h-48 sm:h-64 lg:h-72">
              <Line data={monthlyRevenue} options={lineChartOptions} />
            </div>
          </div>

          {/* Revenue Distribution */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-gray-800">Revenue Sources</h2>
                <p className="text-xs text-gray-500">Breakdown</p>
              </div>
              <div className="p-1.5 sm:p-2 bg-purple-50 rounded-lg">
                <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
            </div>
            <div className="h-48 sm:h-56">
              <Doughnut data={revenueBySource} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Weekly Comparison */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-gray-800">Weekly Revenue</h2>
              <p className="text-xs text-gray-500">This week vs last week</p>
            </div>
            <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
          </div>
          <div className="h-48 sm:h-64">
            <Bar data={weeklyRevenue} options={barChartOptions} />
          </div>
        </div>

        {/* Payout Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-white rounded-lg">
                <Store className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Vendor Payouts</h3>
            </div>
            <p className="text-base sm:text-lg font-bold text-gray-900">{formatCurrency(earningsData.vendorPayout)}</p>
            <p className="text-xs text-gray-600 mt-1">+15.3% vs last month</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-white rounded-lg">
                <Truck className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Partner Payouts</h3>
            </div>
            <p className="text-base sm:text-lg font-bold text-gray-900">{formatCurrency(earningsData.deliveryPartnerPayout)}</p>
            <p className="text-xs text-gray-600 mt-1">+8.7% vs last month</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-white rounded-lg">
                <Wallet className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Pending Payouts</h3>
            </div>
            <p className="text-base sm:text-lg font-bold text-gray-900">₹1.25L</p>
            <p className="text-xs text-gray-600 mt-1">Next: Mar 20</p>
          </div>
        </div>

        {/* Top Vendors - Mobile View */}
        <div className="sm:hidden">
          <h2 className="text-base font-semibold text-gray-800 mb-3">Top Vendors</h2>
          {topVendors.map((vendor, index) => (
            <MobileVendorCard key={index} vendor={vendor} index={index} />
          ))}
        </div>

        {/* Top Vendors - Desktop Table */}
        <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-semibold text-gray-800">Top Performing Vendors</h2>
              <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contribution</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topVendors.map((vendor, index) => {
                  const contribution = (vendor.revenue / earningsData.totalRevenue) * 100;
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${
                            index === 0 ? 'from-yellow-500 to-yellow-600' :
                            index === 1 ? 'from-gray-400 to-gray-500' :
                            index === 2 ? 'from-amber-700 to-amber-800' :
                            'from-indigo-500 to-indigo-600'
                          } flex items-center justify-center text-white font-semibold text-xs`}>
                            {vendor.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{vendor.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(vendor.revenue)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatCurrency(vendor.commission)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{vendor.orders}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">{contribution.toFixed(1)}%</span>
                          <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${contribution}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions - Mobile View */}
        <div className="sm:hidden">
          <h2 className="text-base font-semibold text-gray-800 mb-3">Recent Transactions</h2>
          {transactions.map((transaction) => (
            <MobileTransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>

        {/* Recent Transactions - Desktop Table */}
        <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-semibold text-gray-800">Recent Transactions</h2>
              <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-medium text-gray-900">{transaction.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600">{formatDate(transaction.date)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-900">{transaction.description}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        transaction.type === 'credit' 
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === 'completed'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {transaction.status === 'completed' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SuperLayout>
  );
};

export default Earnings;