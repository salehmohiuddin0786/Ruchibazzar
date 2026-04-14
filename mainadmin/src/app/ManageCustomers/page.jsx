"use client";
import { useState } from "react";
import SuperLayout from "../SuperLayout/page";
import {
  Search,
  UserPlus,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  User,
  Trash2,
  Edit,
  Eye,
  Award,
  TrendingUp,
} from "lucide-react";

const ManageCustomers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  
  // Responsive items per page
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default for mobile

  // Sample customer data
  const customers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh.k@example.com",
      phone: "+91 98765 43210",
      location: "Mumbai, Maharashtra",
      totalOrders: 24,
      joinedDate: "2024-01-15",
      status: "active",
      totalSpent: "₹12,450",
      lastOrder: "2024-03-10",
      rating: 4.8,
      avatar: "RK",
      avatarColor: "from-blue-500 to-blue-600",
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.s@example.com",
      phone: "+91 87654 32109",
      location: "Delhi, NCR",
      totalOrders: 18,
      joinedDate: "2024-02-20",
      status: "active",
      totalSpent: "₹8,920",
      lastOrder: "2024-03-12",
      rating: 4.9,
      avatar: "PS",
      avatarColor: "from-purple-500 to-purple-600",
    },
    {
      id: 3,
      name: "Amit Patel",
      email: "amit.p@example.com",
      phone: "+91 76543 21098",
      location: "Ahmedabad, Gujarat",
      totalOrders: 32,
      joinedDate: "2023-11-05",
      status: "active",
      totalSpent: "₹18,750",
      lastOrder: "2024-03-11",
      rating: 4.7,
      avatar: "AP",
      avatarColor: "from-green-500 to-green-600",
    },
    {
      id: 4,
      name: "Sneha Reddy",
      email: "sneha.r@example.com",
      phone: "+91 65432 10987",
      location: "Hyderabad, Telangana",
      totalOrders: 15,
      joinedDate: "2024-01-28",
      status: "inactive",
      totalSpent: "₹6,340",
      lastOrder: "2024-02-28",
      rating: 4.5,
      avatar: "SR",
      avatarColor: "from-amber-500 to-amber-600",
    },
    {
      id: 5,
      name: "Vikram Singh",
      email: "vikram.s@example.com",
      phone: "+91 54321 09876",
      location: "Jaipur, Rajasthan",
      totalOrders: 21,
      joinedDate: "2023-12-12",
      status: "active",
      totalSpent: "₹14,280",
      lastOrder: "2024-03-09",
      rating: 4.6,
      avatar: "VS",
      avatarColor: "from-red-500 to-red-600",
    },
    {
      id: 6,
      name: "Anjali Desai",
      email: "anjali.d@example.com",
      phone: "+91 43210 98765",
      location: "Pune, Maharashtra",
      totalOrders: 27,
      joinedDate: "2023-10-18",
      status: "active",
      totalSpent: "₹16,890",
      lastOrder: "2024-03-08",
      rating: 5.0,
      avatar: "AD",
      avatarColor: "from-pink-500 to-pink-600",
    },
    {
      id: 7,
      name: "Karthik Nair",
      email: "karthik.n@example.com",
      phone: "+91 32109 87654",
      location: "Chennai, Tamil Nadu",
      totalOrders: 12,
      joinedDate: "2024-02-05",
      status: "inactive",
      totalSpent: "₹5,230",
      lastOrder: "2024-02-20",
      rating: 4.3,
      avatar: "KN",
      avatarColor: "from-indigo-500 to-indigo-600",
    },
    {
      id: 8,
      name: "Meera Nair",
      email: "meera.n@example.com",
      phone: "+91 21098 76543",
      location: "Bangalore, Karnataka",
      totalOrders: 19,
      joinedDate: "2024-01-08",
      status: "active",
      totalSpent: "₹11,450",
      lastOrder: "2024-03-07",
      rating: 4.7,
      avatar: "MN",
      avatarColor: "from-teal-500 to-teal-600",
    },
    {
      id: 9,
      name: "Arjun Mehta",
      email: "arjun.m@example.com",
      phone: "+91 10987 65432",
      location: "Kolkata, West Bengal",
      totalOrders: 23,
      joinedDate: "2023-09-22",
      status: "active",
      totalSpent: "₹15,670",
      lastOrder: "2024-03-06",
      rating: 4.8,
      avatar: "AM",
      avatarColor: "from-cyan-500 to-cyan-600",
    },
    {
      id: 10,
      name: "Divya Gupta",
      email: "divya.g@example.com",
      phone: "+91 98765 01234",
      location: "Lucknow, UP",
      totalOrders: 14,
      joinedDate: "2024-02-15",
      status: "active",
      totalSpent: "₹7,890",
      lastOrder: "2024-03-05",
      rating: 4.6,
      avatar: "DG",
      avatarColor: "from-orange-500 to-orange-600",
    },
    {
      id: 11,
      name: "Rahul Mehta",
      email: "rahul.m@example.com",
      phone: "+91 99887 66554",
      location: "Surat, Gujarat",
      totalOrders: 31,
      joinedDate: "2023-08-12",
      status: "active",
      totalSpent: "₹22,450",
      lastOrder: "2024-03-04",
      rating: 4.9,
      avatar: "RM",
      avatarColor: "from-emerald-500 to-emerald-600",
    },
    {
      id: 12,
      name: "Neha Singh",
      email: "neha.s@example.com",
      phone: "+91 88776 55443",
      location: "Lucknow, UP",
      totalOrders: 8,
      joinedDate: "2024-02-28",
      status: "inactive",
      totalSpent: "₹3,450",
      lastOrder: "2024-03-01",
      rating: 4.2,
      avatar: "NS",
      avatarColor: "from-rose-500 to-rose-600",
    },
  ];

  // Filter customers based on search and status filter
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "active") return matchesSearch && customer.status === "active";
    if (selectedFilter === "inactive") return matchesSearch && customer.status === "inactive";
    
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  // Stats data
  const totalOrders = customers.reduce((acc, c) => acc + c.totalOrders, 0);
  const avgRating = (customers.reduce((acc, c) => acc + c.rating, 0) / customers.length).toFixed(1);
  const activeCustomers = customers.filter((c) => c.status === "active").length;

  const stats = [
    {
      title: "Total Customers",
      value: customers.length,
      change: "+12%",
      icon: User,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Active",
      value: activeCustomers,
      change: "+8%",
      icon: Award,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Orders",
      value: totalOrders,
      change: "+23%",
      icon: ShoppingBag,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Avg Rating",
      value: avgRating,
      change: "+0.3",
      icon: Star,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  const handleSelectAll = () => {
    if (selectedCustomers.length === paginatedCustomers.length && paginatedCustomers.length > 0) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(paginatedCustomers.map((c) => c.id));
    }
  };

  const handleSelectCustomer = (id) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter((customerId) => customerId !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  // Mobile card view for customers
  const MobileCustomerCard = ({ customer }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-4 mb-3 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selectedCustomers.includes(customer.id)}
            onChange={() => handleSelectCustomer(customer.id)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${customer.avatarColor} flex items-center justify-center text-white font-semibold text-sm`}>
            {customer.avatar}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{customer.name}</p>
            <p className="text-xs text-gray-500">ID: #{customer.id}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          customer.status === "active"
            ? "bg-green-50 text-green-700"
            : "bg-gray-50 text-gray-600"
        }`}>
          {customer.status === "active" ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="flex items-center gap-1 text-gray-600">
          <Mail className="w-3 h-3 text-gray-400" />
          <span className="truncate">{customer.email}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <Phone className="w-3 h-3 text-gray-400" />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600 col-span-2">
          <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="truncate">{customer.location}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-500">Orders</p>
          <p className="text-sm font-semibold text-gray-900">{customer.totalOrders}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-500">Spent</p>
          <p className="text-sm font-semibold text-gray-900">{customer.totalSpent}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-500">Rating</p>
          <div className="flex items-center justify-center gap-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-sm font-semibold text-gray-900">{customer.rating}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span>Last: {customer.lastOrder}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-indigo-50 rounded-lg">
            <Eye className="w-3.5 h-3.5 text-gray-500" />
          </button>
          <button className="p-1.5 hover:bg-blue-50 rounded-lg">
            <Edit className="w-3.5 h-3.5 text-gray-500" />
          </button>
          <button className="p-1.5 hover:bg-red-50 rounded-lg">
            <Trash2 className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <SuperLayout>
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Customer Management
            </h1>
            <p className="text-gray-500 mt-0.5 text-xs sm:text-sm">
              Manage and view all your registered customers
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Add</span>
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
                  {stat.value.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats Row - Hidden on mobile, visible on tablet/desktop */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
              <span className="text-xs sm:text-sm text-blue-600 font-medium">Loyalty Rate</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-blue-900 mt-1">78%</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
              <span className="text-xs sm:text-sm text-purple-600 font-medium">VIP Customers</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-purple-900 mt-1">24</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
              <span className="text-xs sm:text-sm text-amber-600 font-medium">Avg Order</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-amber-900 mt-1">₹{Math.round(customers.reduce((acc, c) => acc + parseInt(c.totalSpent.replace(/[^0-9]/g, '')), 0) / totalOrders).toLocaleString()}</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="flex-1 sm:flex-none px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
          {paginatedCustomers.map((customer) => (
            <MobileCustomerCard key={customer.id} customer={customer} />
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] lg:min-w-0">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.length === paginatedCustomers.length && paginatedCustomers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => handleSelectCustomer(customer.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${customer.avatarColor} flex items-center justify-center text-white font-semibold text-xs`}>
                          {customer.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{customer.name}</p>
                          <p className="text-xs text-gray-500">#{customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-[120px]">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="truncate max-w-[100px]">{customer.location}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{customer.totalOrders}</p>
                        <p className="text-xs text-gray-500">Last: {customer.lastOrder}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{customer.totalSpent}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        customer.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-50 text-gray-600"
                      }`}>
                        {customer.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-indigo-50 rounded">
                          <Eye className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-blue-50 rounded">
                          <Edit className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-red-50 rounded">
                          <Trash2 className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Desktop Pagination */}
          <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length}
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

        {/* Quick Actions - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <button className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-3 sm:p-4 rounded-lg hover:shadow-md transition-all text-left">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-white rounded-lg">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">Email Campaign</h3>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Send newsletters</p>
              </div>
            </div>
          </button>
          <button className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-3 sm:p-4 rounded-lg hover:shadow-md transition-all text-left">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-white rounded-lg">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">Reviews</h3>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Customer feedback</p>
              </div>
            </div>
          </button>
          <button className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-3 sm:p-4 rounded-lg hover:shadow-md transition-all text-left">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-white rounded-lg">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">Purchase History</h3>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Analyze patterns</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </SuperLayout>
  );
};

export default ManageCustomers;