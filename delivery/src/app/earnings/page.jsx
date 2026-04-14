// app/delivery/earnings/page.jsx
"use client";
import { useState } from 'react';
import SuperLayout from '../SuperLayout/page';
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
  Wallet,
  CreditCard,
  Banknote,
  Award,
  Clock,
  Package,
  Star,
  Gift,
  Zap,
  Shield,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  MoreVertical,
  Eye,
  Receipt,
  FileText,
  Mail,
  Printer
} from 'lucide-react';

export default function DeliveryEarnings() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [currentPage, setCurrentPage] = useState(1);
  const [showChart, setShowChart] = useState(true);
  const transactionsPerPage = 5;

  // Earnings data
  const earnings = {
    today: 850,
    week: 5400,
    month: 18450,
    total: 124750,
    pending: 1250,
    withdrawable: 2450
  };

  // Weekly breakdown
  const weeklyData = [
    { day: 'Mon', amount: 780, deliveries: 8 },
    { day: 'Tue', amount: 920, deliveries: 10 },
    { day: 'Wed', amount: 850, deliveries: 9 },
    { day: 'Thu', amount: 1100, deliveries: 12 },
    { day: 'Fri', amount: 950, deliveries: 10 },
    { day: 'Sat', amount: 1250, deliveries: 14 },
    { day: 'Sun', amount: 550, deliveries: 6 },
  ];

  // Transaction history
  const transactions = [
    { 
      id: 'TXN-001', 
      date: '2024-01-15', 
      time: '10:30 AM',
      order: 'RB-101',
      amount: 450,
      type: 'delivery',
      status: 'completed',
      paymentMethod: 'Online',
      customer: 'Rahul Sharma'
    },
    { 
      id: 'TXN-002', 
      date: '2024-01-15', 
      time: '11:45 AM',
      order: 'RB-102',
      amount: 780,
      type: 'delivery',
      status: 'completed',
      paymentMethod: 'Cash',
      customer: 'Aisha Khan'
    },
    { 
      id: 'TXN-003', 
      date: '2024-01-15', 
      time: '02:15 PM',
      order: 'RB-103',
      amount: 320,
      type: 'delivery',
      status: 'completed',
      paymentMethod: 'Online',
      customer: 'Priya Patel'
    },
    { 
      id: 'TXN-004', 
      date: '2024-01-14', 
      time: '09:20 AM',
      order: 'RB-099',
      amount: 650,
      type: 'delivery',
      status: 'completed',
      paymentMethod: 'Online',
      customer: 'Arjun Reddy'
    },
    { 
      id: 'TXN-005', 
      date: '2024-01-14', 
      time: '01:30 PM',
      order: 'RB-100',
      amount: 520,
      type: 'delivery',
      status: 'completed',
      paymentMethod: 'Cash',
      customer: 'Neha Gupta'
    },
    { 
      id: 'TXN-006', 
      date: '2024-01-13', 
      time: '07:45 PM',
      order: 'RB-098',
      amount: 890,
      type: 'delivery',
      status: 'completed',
      paymentMethod: 'Online',
      customer: 'Vikram Singh'
    },
    { 
      id: 'TXN-007', 
      date: '2024-01-13', 
      time: '12:10 PM',
      order: 'RB-097',
      amount: 430,
      type: 'delivery',
      status: 'pending',
      paymentMethod: 'Cash',
      customer: 'Meera Reddy'
    },
  ];

  // Bonus data
  const bonuses = [
    { type: 'Peak Hour Bonus', amount: 150, date: '2024-01-15' },
    { type: '5-Star Rating Bonus', amount: 100, date: '2024-01-14' },
    { type: 'Referral Bonus', amount: 500, date: '2024-01-12' },
    { type: 'Completion Bonus', amount: 200, date: '2024-01-10' },
  ];

  const getStatusBadge = (status) => {
    const config = {
      completed: { color: 'bg-emerald-100 text-emerald-700', icon: TrendingUp },
      pending: { color: 'bg-amber-100 text-amber-700', icon: Clock },
    };
    const Icon = config[status]?.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config[status].color}`}>
        {Icon && <Icon size={12} />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentIcon = (method) => {
    return method === 'Online' ? <CreditCard size={14} /> : <Banknote size={14} />;
  };

  // Pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  // Calculate trend
  const previousWeekEarnings = 4850;
  const trend = ((earnings.week - previousWeekEarnings) / previousWeekEarnings * 100).toFixed(1);

  return (
    <SuperLayout>
      <div className="space-y-6 pb-8">
        {/* Animated Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 p-6 text-white">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <IndianRupee className="w-8 h-8" />
                  <h1 className="text-3xl font-bold">Earnings Dashboard</h1>
                </div>
                <p className="text-emerald-100 text-lg">Track your income, bonuses, and payment history</p>
              </div>
              <div className="flex gap-3">
                <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl text-sm font-medium transition-all backdrop-blur-sm border border-white/20 flex items-center gap-2">
                  <Calendar size={18} />
                  Select Period
                </button>
                <button className="bg-white text-emerald-600 px-6 py-3 rounded-xl text-sm font-medium hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2">
                  <Download size={18} />
                  Download Report
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                <p className="text-xs text-emerald-100">Withdrawable</p>
                <p className="text-xl font-bold">₹{earnings.withdrawable}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                <p className="text-xs text-emerald-100">Pending</p>
                <p className="text-xl font-bold">₹{earnings.pending}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                <p className="text-xs text-emerald-100">This Month</p>
                <p className="text-xl font-bold">₹{earnings.month}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                <p className="text-xs text-emerald-100">Lifetime</p>
                <p className="text-xl font-bold">₹{earnings.total}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Earnings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Earnings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
                <Clock size={24} />
              </div>
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                +12% vs yesterday
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Today's Earnings</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">₹{earnings.today}</p>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-emerald-600">
                <TrendingUp size={16} />
                <span>8 deliveries</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-amber-600">
                <Star size={16} className="fill-amber-400" />
                <span>4.9 avg</span>
              </div>
            </div>
          </div>

          {/* Week's Earnings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
                <Wallet size={24} />
              </div>
              <div className="flex items-center gap-1">
                {trend > 0 ? (
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                    <ArrowUpRight size={12} />
                    {trend}%
                  </span>
                ) : (
                  <span className="text-xs text-rose-600 bg-rose-50 px-2 py-1 rounded-full flex items-center gap-1">
                    <ArrowDownRight size={12} />
                    {Math.abs(trend)}%
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">This Week</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">₹{earnings.week}</p>
            <p className="text-xs text-gray-500">vs ₹{previousWeekEarnings} last week</p>
          </div>

          {/* Withdrawable Balance */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform"></div>
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <IndianRupee size={24} />
                </div>
                <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
                  Withdraw
                </button>
              </div>
              <p className="text-sm text-emerald-100 mb-1">Available Balance</p>
              <p className="text-4xl font-bold mb-4">₹{earnings.withdrawable}</p>
              <div className="flex items-center gap-4 text-sm text-emerald-100">
                <div className="flex items-center gap-1">
                  <Shield size={14} />
                  <span>Instant transfer</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap size={14} />
                  <span>No fees</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart and Period Selector */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-800">Earnings Overview</h2>
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                {['day', 'week', 'month', 'year'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      selectedPeriod === period
                        ? 'bg-white text-emerald-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowChart(!showChart)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {showChart ? <BarChart3 size={20} /> : <LineChart size={20} />}
            </button>
          </div>

          {/* Chart Area */}
          {showChart && (
            <div className="h-64 flex items-end justify-between gap-2">
              {weeklyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full">
                    <div 
                      className="w-full bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg group-hover:from-emerald-600 group-hover:to-teal-600 transition-all cursor-pointer"
                      style={{ height: `${(data.amount / 1400) * 200}px` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                        ₹{data.amount} • {data.deliveries} deliveries
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{data.day}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pie Chart Alternative */}
          {!showChart && (
            <div className="h-64 flex items-center justify-center">
              <div className="relative w-48 h-48">
                <PieChart size={192} className="text-emerald-600" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">75%</p>
                    <p className="text-xs text-gray-500">Completion Rate</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-800">Transaction History</h2>
                <span className="bg-emerald-100 text-emerald-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  {transactions.length} transactions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Filter size={18} className="text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download size={18} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-gray-900">{transaction.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-800">{transaction.date}</p>
                        <p className="text-xs text-gray-500">{transaction.time}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-600">{transaction.order}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-800">{transaction.customer}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">₹{transaction.amount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        {getPaymentIcon(transaction.paymentMethod)}
                        <span>{transaction.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded-lg" title="View Receipt">
                          <Receipt size={16} className="text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded-lg" title="Download">
                          <Download size={16} className="text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded-lg" title="More">
                          <MoreVertical size={16} className="text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {indexOfFirstTransaction + 1} to {Math.min(indexOfLastTransaction, transactions.length)} of {transactions.length} transactions
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft size={18} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bonuses and Withdrawals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bonuses Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Gift size={20} className="text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Recent Bonuses</h3>
            </div>
            
            <div className="space-y-3">
              {bonuses.map((bonus, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{bonus.type}</p>
                    <p className="text-xs text-gray-500">{bonus.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-amber-600">+₹{bonus.amount}</span>
                    <Award size={16} className="text-amber-500" />
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">
              View All Bonuses
            </button>
          </div>

          {/* Withdrawal Methods */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Wallet size={20} className="text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Withdrawal Methods</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:border-emerald-200 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Bank Transfer</p>
                    <p className="text-xs text-gray-500">HDFC Bank •••• 1234</p>
                  </div>
                </div>
                <div className="text-xs text-emerald-600 group-hover:underline">Default</div>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:border-emerald-200 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Wallet size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">UPI Transfer</p>
                    <p className="text-xs text-gray-500">rahul@okhdfcbank</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-2 py-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium border border-dashed border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">
                + Add Payment Method
              </button>
            </div>

            {/* Quick Withdraw */}
            <div className="mt-4 p-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Quick Withdraw</span>
                <Zap size={16} />
              </div>
              <p className="text-2xl font-bold mb-2">₹{earnings.withdrawable}</p>
              <button className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors">
                Withdraw Now
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Package size={16} className="text-emerald-600" />
              <span className="text-xs text-gray-500">Total Deliveries</span>
            </div>
            <p className="text-xl font-bold text-gray-800">1,247</p>
            <p className="text-xs text-emerald-600 mt-1">+156 this month</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} className="text-amber-500" />
              <span className="text-xs text-gray-500">Average Rating</span>
            </div>
            <p className="text-xl font-bold text-gray-800">4.9 ★</p>
            <p className="text-xs text-gray-500 mt-1">245 reviews</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-blue-600" />
              <span className="text-xs text-gray-500">Online Hours</span>
            </div>
            <p className="text-xl font-bold text-gray-800">328h</p>
            <p className="text-xs text-blue-600 mt-1">42h this week</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Award size={16} className="text-purple-600" />
              <span className="text-xs text-gray-500">Achievements</span>
            </div>
            <p className="text-xl font-bold text-gray-800">12</p>
            <p className="text-xs text-purple-600 mt-1">3 new this month</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </SuperLayout>
  );
}