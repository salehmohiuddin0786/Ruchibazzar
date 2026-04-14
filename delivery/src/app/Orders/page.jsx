// app/delivery/orders/page.jsx
"use client";
import { useState } from 'react';
import SuperLayout from '../SuperLayout/page';
import {
  Package,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Clock,
  CheckCircle,
  MapPin,
  User,
  Phone,
  IndianRupee,
  Calendar,
  ArrowUpDown,
  AlertCircle,
  ShoppingBag,
  Store,
  TrendingUp,
  Star,
  Truck,
  Timer,
  Wallet,
  Award,
  Zap,
  Gift,
  Shield,
  Coffee,
  Map,
  Navigation
} from 'lucide-react';

export default function DeliveryOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const ordersPerPage = 6;

  const orders = [
    { 
      id: "RB-101", 
      customer: "Rahul Sharma", 
      address: "Jubilee Hills, Hyderabad - 500033", 
      status: "assigned",
      amount: "₹450",
      items: 3,
      time: "10:30 AM",
      distance: "2.5 km",
      phone: "+91 98765 43210",
      priority: "high",
      restaurant: "Spicy Bites",
      rating: 4.8,
      deliveryFee: "₹40",
      paymentMethod: "Online",
      orderDate: "2024-01-15",
      estimatedTime: "25 min",
      customerNote: "Leave at door, call upon arrival"
    },
    { 
      id: "RB-102", 
      customer: "Aisha Khan", 
      address: "Banjara Hills, Secunderabad - 500034", 
      status: "picked",
      amount: "₹780",
      items: 5,
      time: "11:15 AM",
      distance: "3.2 km",
      phone: "+91 87654 32109",
      priority: "medium",
      restaurant: "Biryani House",
      rating: 4.5,
      deliveryFee: "₹50",
      paymentMethod: "Cash",
      orderDate: "2024-01-15",
      estimatedTime: "35 min",
      customerNote: "Ring bell twice"
    },
    { 
      id: "RB-103", 
      customer: "Priya Patel", 
      address: "Gachibowli, Hyderabad - 500032", 
      status: "delivered",
      amount: "₹320",
      items: 2,
      time: "09:45 AM",
      distance: "1.8 km",
      phone: "+91 76543 21098",
      priority: "low",
      restaurant: "Fresh Bites",
      rating: 4.9,
      deliveryFee: "₹30",
      paymentMethod: "Online",
      orderDate: "2024-01-15",
      estimatedTime: "15 min"
    },
    { 
      id: "RB-104", 
      customer: "Arjun Reddy", 
      address: "Madhapur, Hyderabad - 500081", 
      status: "assigned",
      amount: "₹650",
      items: 4,
      time: "12:00 PM",
      distance: "4.1 km",
      phone: "+91 65432 10987",
      priority: "high",
      restaurant: "Tandoori Nights",
      rating: 4.7,
      deliveryFee: "₹60",
      paymentMethod: "Online",
      orderDate: "2024-01-15",
      estimatedTime: "40 min"
    },
    { 
      id: "RB-105", 
      customer: "Neha Gupta", 
      address: "Kukatpally, Hyderabad - 500072", 
      status: "picked",
      amount: "₹520",
      items: 3,
      time: "10:00 AM",
      distance: "3.5 km",
      phone: "+91 54321 09876",
      priority: "medium",
      restaurant: "Spice Kitchen",
      rating: 4.6,
      deliveryFee: "₹45",
      paymentMethod: "Cash",
      orderDate: "2024-01-15",
      estimatedTime: "30 min"
    },
    { 
      id: "RB-106", 
      customer: "Vikram Singh", 
      address: "Hitech City, Hyderabad - 500084", 
      status: "assigned",
      amount: "₹890",
      items: 6,
      time: "01:30 PM",
      distance: "5.2 km",
      phone: "+91 43210 98765",
      priority: "high",
      restaurant: "Royal Dining",
      rating: 4.9,
      deliveryFee: "₹70",
      paymentMethod: "Online",
      orderDate: "2024-01-15",
      estimatedTime: "45 min"
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      assigned: { 
        color: "bg-amber-100 text-amber-700 border-amber-200", 
        icon: Clock, 
        label: "Assigned",
        gradient: "from-amber-500 to-orange-500"
      },
      picked: { 
        color: "bg-blue-100 text-blue-700 border-blue-200", 
        icon: Package, 
        label: "Picked Up",
        gradient: "from-blue-500 to-cyan-500"
      },
      delivered: { 
        color: "bg-emerald-100 text-emerald-700 border-emerald-200", 
        icon: CheckCircle, 
        label: "Delivered",
        gradient: "from-emerald-500 to-teal-500"
      },
    };
    const config = statusConfig[status];
    const Icon = config?.icon || Package;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config?.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {config?.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { 
        color: "bg-rose-100 text-rose-700 border-rose-200", 
        label: "High Priority",
        icon: Zap
      },
      medium: { 
        color: "bg-amber-100 text-amber-700 border-amber-200", 
        label: "Medium",
        icon: Clock
      },
      low: { 
        color: "bg-emerald-100 text-emerald-700 border-emerald-200", 
        label: "Low",
        icon: CheckCircle
      },
    };
    const Icon = priorityConfig[priority].icon;
    return (
      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${priorityConfig[priority].color}`}>
        <Icon className="w-3 h-3" />
        {priorityConfig[priority].label}
      </span>
    );
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.restaurant.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Stats
  const stats = [
    { 
      label: 'Total Orders', 
      value: orders.length, 
      icon: ShoppingBag, 
      color: 'emerald',
      change: '+12%',
      bg: 'from-emerald-500 to-teal-500'
    },
    { 
      label: 'Active Deliveries', 
      value: orders.filter(o => o.status !== 'delivered').length, 
      icon: Truck, 
      color: 'amber',
      change: '3 now',
      bg: 'from-amber-500 to-orange-500'
    },
    { 
      label: 'Completed', 
      value: orders.filter(o => o.status === 'delivered').length, 
      icon: CheckCircle, 
      color: 'blue',
      change: 'today',
      bg: 'from-blue-500 to-cyan-500'
    },
    { 
      label: 'Total Earnings', 
      value: '₹3,610', 
      icon: Wallet, 
      color: 'purple',
      change: '+8%',
      bg: 'from-purple-500 to-pink-500'
    },
  ];

  return (
    <SuperLayout>
      <div className="space-y-6 pb-8">
        {/* Animated Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 p-6 text-white">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-8 h-8" />
                  <h1 className="text-3xl font-bold">Delivery Orders</h1>
                </div>
                <p className="text-emerald-100 text-lg">Manage and track all your delivery orders in real-time</p>
              </div>
              <div className="flex gap-3">
                <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl text-sm font-medium transition-all backdrop-blur-sm border border-white/20 flex items-center gap-2">
                  <Calendar size={18} />
                  Today's Schedule
                </button>
                <button className="bg-white text-emerald-600 px-6 py-3 rounded-xl text-sm font-medium hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2">
                  <Download size={18} />
                  Export Report
                </button>
              </div>
            </div>

            {/* Quick Date Info */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <Calendar size={16} />
                <span className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <Clock size={16} />
                <span className="text-sm">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards with Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bg} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  
                  {/* Progress bar */}
                  <div className="mt-3 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${stat.bg} rounded-full`} style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters and View Toggle */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by order ID, customer, address, or restaurant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Status Filter */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                <Filter className="text-gray-400 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-sm focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="assigned">Assigned</option>
                  <option value="picked">Picked Up</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Package size={18} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Map size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Display - Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
                    {['Order ID', 'Customer', 'Delivery Address', 'Restaurant', 'Amount', 'Status', 'Actions'].map((header, i) => (
                      <th key={i} className="px-6 py-4 text-left">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {header}
                          {header !== 'Actions' && <ArrowUpDown size={12} className="text-gray-400" />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className="hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-all group cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                            <Package className="w-4 h-4 text-emerald-700" />
                          </div>
                          <div>
                            <span className="font-mono text-sm font-medium text-gray-900">{order.id}</span>
                            <div className="mt-1">{getPriorityBadge(order.priority)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                            <User size={14} className="text-emerald-600" />
                            {order.customer}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Phone size={10} />
                            {order.phone}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star size={10} className="text-amber-400 fill-amber-400" />
                            <span className="text-xs text-gray-600">{order.rating}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-xs truncate flex items-center gap-1">
                          <MapPin size={14} className="text-emerald-600 flex-shrink-0" />
                          {order.address}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Navigation size={10} />
                            {order.distance}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Timer size={10} />
                            {order.estimatedTime}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Store size={14} className="text-emerald-600" />
                          {order.restaurant}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{order.items} items</p>
                        <p className="text-xs text-gray-500">Fee: {order.deliveryFee}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">{order.amount}</p>
                        <p className="text-xs text-gray-500 mt-1">{order.paymentMethod}</p>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-emerald-100 rounded-lg transition-colors" title="View Details">
                            <Eye size={16} className="text-gray-500 hover:text-emerald-600" />
                          </button>
                          <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="Call Customer">
                            <Phone size={16} className="text-gray-500 hover:text-blue-600" />
                          </button>
                          <button className="p-2 hover:bg-purple-100 rounded-lg transition-colors" title="Navigate">
                            <Navigation size={16} className="text-gray-500 hover:text-purple-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Display - Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentOrders.map((order) => (
              <div 
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
                onClick={() => setSelectedOrder(order)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <span className="font-mono text-sm font-bold text-gray-900">{order.id}</span>
                      <div className="mt-1">{getPriorityBadge(order.priority)}</div>
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Customer Info */}
                <div className="mb-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {order.customer.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{order.customer}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone size={10} />
                        {order.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Restaurant</p>
                    <p className="text-sm font-medium truncate">{order.restaurant}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Items</p>
                    <p className="text-sm font-medium">{order.items} items</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="text-sm font-medium">{order.distance}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Est. Time</p>
                    <p className="text-sm font-medium">{order.estimatedTime}</p>
                  </div>
                </div>

                {/* Amount and Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-lg font-bold text-gray-900">{order.amount}</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-emerald-100 rounded-lg transition-colors">
                      <Eye size={16} className="text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                      <Phone size={16} className="text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-purple-100 rounded-lg transition-colors">
                      <Navigation size={16} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Customer Note */}
                {order.customerNote && (
                  <div className="mt-3 p-2 bg-amber-50 rounded-lg text-xs text-amber-700 border border-amber-100">
                    📝 {order.customerNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:shadow-lg transition-all"
            >
              <Filter size={16} />
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastOrder, filteredOrders.length)}</span>{' '}
                of <span className="font-medium">{filteredOrders.length}</span> orders
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    currentPage === 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      currentPage === i + 1
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    currentPage === totalPages 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Performance Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform"></div>
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-6 h-6" />
                <h3 className="font-semibold text-lg">Today's Performance</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-xs text-emerald-100">Deliveries</p>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-xs text-emerald-200">+2 vs yesterday</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-xs text-emerald-100">On Time</p>
                  <p className="text-2xl font-bold">98%</p>
                  <p className="text-xs text-emerald-200">Top performer</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-xs text-emerald-100">Rating</p>
                  <p className="text-2xl font-bold">4.9</p>
                  <p className="text-xs text-emerald-200">⭐ 245 reviews</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-xs text-emerald-100">Earned</p>
                  <p className="text-2xl font-bold">₹850</p>
                  <p className="text-xs text-emerald-200">Today</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Tips */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertCircle size={16} className="text-amber-600" />
              </div>
              Pro Delivery Tips
            </h3>
            <ul className="space-y-3">
              {[
                'Call customer 5 mins before arrival',
                'Check order items before leaving',
                'Keep food warm in thermal bag',
                'Always wear helmet and safety gear',
                'Maintain 4.8+ rating for bonus'
              ].map((tip, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Peak Hours & Rewards */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Timer size={20} />
                <h3 className="font-semibold">Peak Hours Today</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>12:00 - 14:00</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">High Demand</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>19:00 - 21:00</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">High Demand</span>
                </div>
                <p className="text-xs text-amber-100 mt-2">Extra ₹50 per delivery in peak hours!</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Gift size={20} className="text-purple-600" />
                <h3 className="font-semibold text-gray-800">Rewards Progress</h3>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Gold Tier</span>
                  <span className="font-medium text-purple-600">75%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                </div>
              </div>
              <p className="text-xs text-gray-500">45 more deliveries to reach Gold tier</p>
            </div>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Order Details #{selectedOrder.id}</h2>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white rounded-lg">
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Order details content */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Customer</p>
                    <p className="font-medium">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium">{selectedOrder.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Delivery Address</p>
                    <p className="font-medium">{selectedOrder.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Restaurant</p>
                    <p className="font-medium">{selectedOrder.restaurant}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="font-medium text-lg">{selectedOrder.amount}</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    Close
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg">
                    Start Navigation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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