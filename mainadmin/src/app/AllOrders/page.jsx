"use client";
import { useState } from "react";
import SuperLayout from "../SuperLayout/page";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Download,
  RefreshCw,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  IndianRupee,
  Calendar,
  User,
  Store,
  MapPin,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Hourglass,
  CheckCheck,
  Ban,
} from "lucide-react";

const AllOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [dateRange, setDateRange] = useState("today");
  const [selectedOrders, setSelectedOrders] = useState([]);
  
  // Responsive items per page
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default for mobile

  // Sample orders data
  const orders = [
    {
      id: "ORD-001",
      customer: "Rajesh Kumar",
      customerId: "CUST-001",
      vendor: "Fresh Foods",
      vendorId: "VEN-001",
      amount: 1250,
      status: "delivered",
      paymentStatus: "paid",
      items: 5,
      date: "2024-03-15T10:30:00",
      deliveryPartner: "Rahul Sharma",
      estimatedDelivery: "2024-03-15T14:00:00",
      actualDelivery: "2024-03-15T13:45:00",
      address: "Andheri East, Mumbai",
      paymentMethod: "UPI",
      rating: 5,
    },
    {
      id: "ORD-002",
      customer: "Priya Sharma",
      customerId: "CUST-002",
      vendor: "Organic Mart",
      vendorId: "VEN-002",
      amount: 890,
      status: "processing",
      paymentStatus: "paid",
      items: 3,
      date: "2024-03-15T11:15:00",
      deliveryPartner: "Priya Verma",
      estimatedDelivery: "2024-03-15T15:30:00",
      actualDelivery: null,
      address: "Borivali West, Mumbai",
      paymentMethod: "Card",
      rating: null,
    },
    {
      id: "ORD-003",
      customer: "Amit Patel",
      customerId: "CUST-003",
      vendor: "Daily Needs",
      vendorId: "VEN-003",
      amount: 2340,
      status: "out_for_delivery",
      paymentStatus: "paid",
      items: 8,
      date: "2024-03-15T09:45:00",
      deliveryPartner: "Amit Kumar",
      estimatedDelivery: "2024-03-15T13:00:00",
      actualDelivery: null,
      address: "Chembur, Mumbai",
      paymentMethod: "UPI",
      rating: null,
    },
    {
      id: "ORD-004",
      customer: "Sneha Reddy",
      customerId: "CUST-004",
      vendor: "Spice Bazaar",
      vendorId: "VEN-004",
      amount: 560,
      status: "pending",
      paymentStatus: "pending",
      items: 2,
      date: "2024-03-15T12:20:00",
      deliveryPartner: null,
      estimatedDelivery: "2024-03-15T16:00:00",
      actualDelivery: null,
      address: "Navi Mumbai",
      paymentMethod: "Cash",
      rating: null,
    },
    {
      id: "ORD-005",
      customer: "Vikram Singh",
      customerId: "CUST-005",
      vendor: "Gourmet Foods",
      vendorId: "VEN-005",
      amount: 3450,
      status: "delivered",
      paymentStatus: "paid",
      items: 12,
      date: "2024-03-14T18:30:00",
      deliveryPartner: "Vikram Singh",
      estimatedDelivery: "2024-03-14T21:00:00",
      actualDelivery: "2024-03-14T20:30:00",
      address: "South Mumbai",
      paymentMethod: "Card",
      rating: 5,
    },
    {
      id: "ORD-006",
      customer: "Anjali Desai",
      customerId: "CUST-006",
      vendor: "Fresh Produce",
      vendorId: "VEN-006",
      amount: 1120,
      status: "cancelled",
      paymentStatus: "refunded",
      items: 4,
      date: "2024-03-14T15:45:00",
      deliveryPartner: null,
      estimatedDelivery: "2024-03-14T19:00:00",
      actualDelivery: null,
      address: "Pune",
      paymentMethod: "UPI",
      rating: null,
      cancellationReason: "Customer cancelled",
    },
    {
      id: "ORD-007",
      customer: "Karthik Nair",
      customerId: "CUST-007",
      vendor: "Organic Express",
      vendorId: "VEN-007",
      amount: 780,
      status: "processing",
      paymentStatus: "paid",
      items: 3,
      date: "2024-03-15T08:15:00",
      deliveryPartner: "Karthik Nair",
      estimatedDelivery: "2024-03-15T12:30:00",
      actualDelivery: null,
      address: "Chennai",
      paymentMethod: "Card",
      rating: null,
    },
    {
      id: "ORD-008",
      customer: "Meera Nair",
      customerId: "CUST-008",
      vendor: "Daily Fresh",
      vendorId: "VEN-008",
      amount: 1890,
      status: "out_for_delivery",
      paymentStatus: "paid",
      items: 6,
      date: "2024-03-15T10:00:00",
      deliveryPartner: "Meera Iyer",
      estimatedDelivery: "2024-03-15T14:30:00",
      actualDelivery: null,
      address: "Bangalore",
      paymentMethod: "Wallet",
      rating: null,
    },
    {
      id: "ORD-009",
      customer: "Arjun Mehta",
      customerId: "CUST-009",
      vendor: "Spice World",
      vendorId: "VEN-009",
      amount: 2670,
      status: "delivered",
      paymentStatus: "paid",
      items: 9,
      date: "2024-03-14T12:30:00",
      deliveryPartner: "Arjun Reddy",
      estimatedDelivery: "2024-03-14T16:00:00",
      actualDelivery: "2024-03-14T15:45:00",
      address: "Kolkata",
      paymentMethod: "UPI",
      rating: 4,
    },
    {
      id: "ORD-010",
      customer: "Divya Gupta",
      customerId: "CUST-010",
      vendor: "Fresh Mart",
      vendorId: "VEN-010",
      amount: 430,
      status: "pending",
      paymentStatus: "pending",
      items: 2,
      date: "2024-03-15T13:10:00",
      deliveryPartner: null,
      estimatedDelivery: "2024-03-15T17:00:00",
      actualDelivery: null,
      address: "Delhi NCR",
      paymentMethod: "Cash",
      rating: null,
    },
    {
      id: "ORD-011",
      customer: "Rahul Mehta",
      customerId: "CUST-011",
      vendor: "Organic Valley",
      vendorId: "VEN-011",
      amount: 1560,
      status: "processing",
      paymentStatus: "paid",
      items: 5,
      date: "2024-03-15T09:30:00",
      deliveryPartner: "Rahul Sharma",
      estimatedDelivery: "2024-03-15T13:30:00",
      actualDelivery: null,
      address: "Thane",
      paymentMethod: "Card",
      rating: null,
    },
    {
      id: "ORD-012",
      customer: "Neha Singh",
      customerId: "CUST-012",
      vendor: "Daily Needs",
      vendorId: "VEN-003",
      amount: 890,
      status: "delivered",
      paymentStatus: "paid",
      items: 4,
      date: "2024-03-14T16:45:00",
      deliveryPartner: "Amit Kumar",
      estimatedDelivery: "2024-03-14T20:00:00",
      actualDelivery: "2024-03-14T19:30:00",
      address: "Andheri West, Mumbai",
      paymentMethod: "UPI",
      rating: 5,
    },
  ];

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);
  const deliveredOrders = orders.filter(o => o.status === "delivered").length;
  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "processing").length;
  const cancelledOrders = orders.filter(o => o.status === "cancelled").length;
  const outForDelivery = orders.filter(o => o.status === "out_for_delivery").length;

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      change: "+18%",
      icon: ShoppingBag,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Revenue",
      value: `₹${(totalRevenue/1000).toFixed(1)}K`,
      change: "+23%",
      icon: IndianRupee,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Delivered",
      value: deliveredOrders,
      change: "+15%",
      icon: CheckCircle,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Pending",
      value: pendingOrders,
      change: "-5%",
      icon: Hourglass,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  // Status config
  const statusConfig = {
    delivered: { color: "bg-emerald-50 text-emerald-700", icon: CheckCircle, label: "Delivered" },
    out_for_delivery: { color: "bg-blue-50 text-blue-700", icon: Truck, label: "Out for Delivery" },
    processing: { color: "bg-purple-50 text-purple-700", icon: Package, label: "Processing" },
    pending: { color: "bg-amber-50 text-amber-700", icon: Clock, label: "Pending" },
    cancelled: { color: "bg-red-50 text-red-700", icon: XCircle, label: "Cancelled" },
  };

  // Payment status config
  const paymentConfig = {
    paid: { color: "bg-green-50 text-green-700", icon: CheckCheck, label: "Paid" },
    pending: { color: "bg-amber-50 text-amber-700", icon: Clock, label: "Pending" },
    refunded: { color: "bg-gray-50 text-gray-700", icon: Ban, label: "Refunded" },
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === "all") return matchesSearch;
    return matchesSearch && order.status === selectedFilter;
  });

  // Date filter logic
  const getFilteredByDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateRange === "today") {
      return filteredOrders.filter(order => new Date(order.date) >= today);
    } else if (dateRange === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return filteredOrders.filter(order => new Date(order.date) >= weekAgo);
    }
    return filteredOrders;
  };

  const finalFilteredOrders = getFilteredByDate();

  // Pagination
  const totalPages = Math.ceil(finalFilteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = finalFilteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = () => {
    if (selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(paginatedOrders.map((o) => o.id));
    }
  };

  const handleSelectOrder = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((orderId) => orderId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
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

  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', { 
      day: '2-digit', 
      month: 'short',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Mobile card view for orders
  const MobileOrderCard = ({ order }) => {
    const StatusIcon = statusConfig[order.status].icon;
    const PaymentIcon = paymentConfig[order.paymentStatus]?.icon || Clock;
    
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-3 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedOrders.includes(order.id)}
              onChange={() => handleSelectOrder(order.id)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <p className="font-medium text-gray-900 text-sm">{order.id}</p>
              <p className="text-xs text-gray-500">{formatShortDate(order.date)}</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[order.status].color}`}>
            <StatusIcon className="w-3 h-3" />
            <span className="hidden xs:inline">{statusConfig[order.status].label}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="col-span-2">
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
              <User className="w-3 h-3 text-gray-400" />
              <span className="font-medium">{order.customer}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Store className="w-3 h-3 text-gray-400" />
              <span>{order.vendor}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Package className="w-3 h-3 text-gray-400" />
            <span>{order.items} items</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <IndianRupee className="w-3 h-3 text-gray-400" />
            <span className="font-medium">₹{order.amount}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${paymentConfig[order.paymentStatus]?.color || 'bg-gray-50 text-gray-600'}`}>
              <PaymentIcon className="w-3 h-3" />
              {paymentConfig[order.paymentStatus]?.label || order.paymentStatus}
            </span>
            {order.deliveryPartner && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Truck className="w-3 h-3 text-gray-400" />
                <span className="truncate max-w-[80px]">{order.deliveryPartner}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-indigo-50 rounded-lg">
              <Eye className="w-3.5 h-3.5 text-gray-500" />
            </button>
            <button className="p-1.5 hover:bg-gray-50 rounded-lg">
              <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
            </button>
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
              Order Management
            </h1>
            <p className="text-gray-500 mt-0.5 text-xs sm:text-sm">
              Track and manage all platform orders
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5">
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Create</span>
            </button>
            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5">
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Stats Cards - Responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-3 sm:p-4"
            >
              <div className="flex items-center justify-between">
                <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${stat.iconColor}`} />
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="mt-1.5 sm:mt-3">
                <h3 className="text-gray-600 text-[10px] sm:text-xs font-medium">{stat.title}</h3>
                <p className="text-sm sm:text-base lg:text-xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats Row - Hidden on mobile, visible on tablet/desktop */}
        <div className="hidden sm:grid sm:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-3 sm:p-4 rounded-lg">
            <p className="text-xs sm:text-sm text-amber-600 font-medium">Out for Delivery</p>
            <p className="text-base sm:text-lg font-bold text-amber-900 mt-1">{outForDelivery}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-3 sm:p-4 rounded-lg">
            <p className="text-xs sm:text-sm text-red-600 font-medium">Cancelled</p>
            <p className="text-base sm:text-lg font-bold text-red-900 mt-1">{cancelledOrders}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-3 sm:p-4 rounded-lg">
            <p className="text-xs sm:text-sm text-purple-600 font-medium">Avg Order</p>
            <p className="text-base sm:text-lg font-bold text-purple-900 mt-1">₹{(totalRevenue / totalOrders).toFixed(0)}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-3 sm:p-4 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-600 font-medium">Success Rate</p>
            <p className="text-base sm:text-lg font-bold text-blue-900 mt-1">{((deliveredOrders / totalOrders) * 100).toFixed(1)}%</p>
          </div>
        </div>

        {/* Mobile Quick Stats - 2x2 grid */}
        <div className="grid grid-cols-2 gap-2 sm:hidden">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-3 rounded-lg">
            <p className="text-xs text-amber-600 font-medium">Out for Delivery</p>
            <p className="text-lg font-bold text-amber-900">{outForDelivery}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-3 rounded-lg">
            <p className="text-xs text-red-600 font-medium">Cancelled</p>
            <p className="text-lg font-bold text-red-900">{cancelledOrders}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-3 rounded-lg">
            <p className="text-xs text-purple-600 font-medium">Avg Order</p>
            <p className="text-lg font-bold text-purple-900">₹{(totalRevenue / totalOrders).toFixed(0)}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-3 rounded-lg">
            <p className="text-xs text-blue-600 font-medium">Success</p>
            <p className="text-lg font-bold text-blue-900">{((deliveredOrders / totalOrders) * 100).toFixed(1)}%</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="flex-1 sm:flex-none px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="all">All Time</option>
              </select>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="flex-1 sm:flex-none px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
              </button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile View - Cards */}
        <div className="sm:hidden">
          {paginatedOrders.map((order) => (
            <MobileOrderCard key={order.id} order={order} />
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] lg:min-w-0">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-3 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status].icon;
                  const PaymentIcon = paymentConfig[order.paymentStatus]?.icon || Clock;
                  
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <span className="font-medium text-gray-900 text-sm">{order.id}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-900">{order.customer}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          <Store className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600">{order.vendor}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-sm text-gray-900">{order.items}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="font-medium text-gray-900">₹{order.amount}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[order.status].color}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span className="hidden lg:inline">{statusConfig[order.status].label}</span>
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${paymentConfig[order.paymentStatus]?.color || 'bg-gray-50 text-gray-600'}`}>
                          <PaymentIcon className="w-3 h-3" />
                          <span className="hidden lg:inline">{paymentConfig[order.paymentStatus]?.label || order.paymentStatus}</span>
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-xs text-gray-600">
                          {formatShortDate(order.date)}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          <button className="p-1 hover:bg-indigo-50 rounded">
                            <Eye className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-50 rounded">
                            <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Desktop Pagination */}
          <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, finalFilteredOrders.length)} of {finalFilteredOrders.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-1.5 rounded border ${
                  currentPage === 1
                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 hover:bg-gray-50 text-gray-600"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    pageNum = currentPage - 3 + i;
                  }
                }
                if (pageNum <= totalPages) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded text-xs font-medium ${
                        currentPage === pageNum
                          ? "bg-indigo-600 text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-1.5 rounded border ${
                  currentPage === totalPages
                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 hover:bg-gray-50 text-gray-600"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Pagination */}
        <div className="sm:hidden flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-xs text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Recent Activity - Hidden on mobile, visible on tablet/desktop */}
        <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Recent Order Activity</h2>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`p-1.5 sm:p-2 rounded-lg ${
                    order.status === 'delivered' ? 'bg-green-50' :
                    order.status === 'cancelled' ? 'bg-red-50' : 'bg-blue-50'
                  }`}>
                    {order.status === 'delivered' && <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />}
                    {order.status === 'cancelled' && <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />}
                    {order.status !== 'delivered' && order.status !== 'cancelled' && <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">{order.id} - {order.customer}</p>
                    <p className="text-xs text-gray-500">{formatShortDate(order.date)}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig[order.status].color}`}>
                  {statusConfig[order.status].label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SuperLayout>
  );
};

export default AllOrders;