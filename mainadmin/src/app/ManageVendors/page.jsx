"use client";
import { useState } from "react";
import SuperLayout from "../SuperLayout/page";
import {
  Store,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Download,
  RefreshCw,
  Star,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

const ManageVendors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [vendorToApprove, setVendorToApprove] = useState(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [vendorToBlock, setVendorToBlock] = useState(null);
  const [blockReason, setBlockReason] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Responsive items per page
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Sample vendor data (same as before)
  const vendors = [
    {
      id: 1,
      name: "Spicy Hub",
      email: "contact@spicyhub.com",
      phone: "+91 98765 43210",
      location: "Mumbai, Maharashtra",
      status: "approved",
      joinedDate: "2024-01-15",
      totalOrders: 1250,
      totalRevenue: 345000,
      rating: 4.8,
      cuisine: "North Indian",
      avatar: "SH",
      avatarColor: "from-red-500 to-red-600",
      documents: "verified",
      commission: 10,
      payoutPending: 12500,
    },
    {
      id: 2,
      name: "Biryani Point",
      email: "info@biryanipoint.com",
      phone: "+91 87654 32109",
      location: "Hyderabad, Telangana",
      status: "pending",
      joinedDate: "2024-03-10",
      totalOrders: 0,
      totalRevenue: 0,
      rating: 0,
      cuisine: "Hyderabadi",
      avatar: "BP",
      avatarColor: "from-amber-500 to-amber-600",
      documents: "pending",
      commission: 10,
      payoutPending: 0,
    },
    {
      id: 3,
      name: "Fresh Bites",
      email: "orders@freshbites.com",
      phone: "+91 76543 21098",
      location: "Delhi, NCR",
      status: "approved",
      joinedDate: "2023-12-05",
      totalOrders: 2340,
      totalRevenue: 567000,
      rating: 4.9,
      cuisine: "Multi-cuisine",
      avatar: "FB",
      avatarColor: "from-green-500 to-green-600",
      documents: "verified",
      commission: 12,
      payoutPending: 23400,
    },
    {
      id: 4,
      name: "South Cafe",
      email: "cafe@southcafe.com",
      phone: "+91 65432 10987",
      location: "Chennai, Tamil Nadu",
      status: "suspended",
      joinedDate: "2024-02-20",
      totalOrders: 450,
      totalRevenue: 89000,
      rating: 3.5,
      cuisine: "South Indian",
      avatar: "SC",
      avatarColor: "from-blue-500 to-blue-600",
      documents: "verified",
      commission: 10,
      payoutPending: 4500,
      suspensionReason: "Customer complaints",
    },
    {
      id: 5,
      name: "Punjab Dhaba",
      email: "punjab@dhaba.com",
      phone: "+91 54321 09876",
      location: "Amritsar, Punjab",
      status: "approved",
      joinedDate: "2023-11-12",
      totalOrders: 1870,
      totalRevenue: 423000,
      rating: 4.7,
      cuisine: "Punjabi",
      avatar: "PD",
      avatarColor: "from-orange-500 to-orange-600",
      documents: "verified",
      commission: 10,
      payoutPending: 18900,
    },
    {
      id: 6,
      name: "Chinese Wok",
      email: "wok@chinese.com",
      phone: "+91 43210 98765",
      location: "Bangalore, Karnataka",
      status: "pending",
      joinedDate: "2024-03-15",
      totalOrders: 0,
      totalRevenue: 0,
      rating: 0,
      cuisine: "Chinese",
      avatar: "CW",
      avatarColor: "from-red-500 to-red-600",
      documents: "pending",
      commission: 10,
      payoutPending: 0,
    },
    {
      id: 7,
      name: "Gujarati Thali",
      email: "thali@gujarati.com",
      phone: "+91 32109 87654",
      location: "Ahmedabad, Gujarat",
      status: "approved",
      joinedDate: "2024-01-28",
      totalOrders: 890,
      totalRevenue: 178000,
      rating: 4.6,
      cuisine: "Gujarati",
      avatar: "GT",
      avatarColor: "from-purple-500 to-purple-600",
      documents: "verified",
      commission: 10,
      payoutPending: 8900,
    },
    {
      id: 8,
      name: "Kerala Kitchen",
      email: "kitchen@kerala.com",
      phone: "+91 21098 76543",
      location: "Kochi, Kerala",
      status: "approved",
      joinedDate: "2023-10-18",
      totalOrders: 1560,
      totalRevenue: 312000,
      rating: 4.8,
      cuisine: "Kerala",
      avatar: "KK",
      avatarColor: "from-green-500 to-green-600",
      documents: "verified",
      commission: 10,
      payoutPending: 15600,
    },
    {
      id: 9,
      name: "Bengal Sweets",
      email: "sweets@bengal.com",
      phone: "+91 10987 65432",
      location: "Kolkata, West Bengal",
      status: "approved",
      joinedDate: "2023-09-22",
      totalOrders: 2340,
      totalRevenue: 468000,
      rating: 4.9,
      cuisine: "Bengali",
      avatar: "BS",
      avatarColor: "from-pink-500 to-pink-600",
      documents: "verified",
      commission: 12,
      payoutPending: 23400,
    },
    {
      id: 10,
      name: "Mumbai Fast Food",
      email: "fastfood@mumbai.com",
      phone: "+91 98765 01234",
      location: "Mumbai, Maharashtra",
      status: "suspended",
      joinedDate: "2024-02-05",
      totalOrders: 320,
      totalRevenue: 64000,
      rating: 3.2,
      cuisine: "Fast Food",
      avatar: "MFF",
      avatarColor: "from-gray-500 to-gray-600",
      documents: "verified",
      commission: 10,
      payoutPending: 3200,
      suspensionReason: "Health code violations",
    },
  ];

  // Calculate stats
  const totalVendors = vendors.length;
  const approvedVendors = vendors.filter(v => v.status === "approved").length;
  const pendingVendors = vendors.filter(v => v.status === "pending").length;
  const suspendedVendors = vendors.filter(v => v.status === "suspended").length;
  const totalRevenue = vendors.reduce((acc, v) => acc + v.totalRevenue, 0);
  const totalOrders = vendors.reduce((acc, v) => acc + v.totalOrders, 0);

  const stats = [
    {
      title: "Total Vendors",
      value: totalVendors,
      change: "+15%",
      icon: Store,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Approved",
      value: approvedVendors,
      change: "+8",
      icon: CheckCircle,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Pending",
      value: pendingVendors,
      change: "+3",
      icon: Clock,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Suspended",
      value: suspendedVendors,
      change: "-2",
      icon: XCircle,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  // Filter vendors
  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.phone.includes(searchTerm) ||
      vendor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === "all") return matchesSearch;
    return matchesSearch && vendor.status === selectedFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVendors = filteredVendors.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = () => {
    if (selectedVendors.length === paginatedVendors.length && paginatedVendors.length > 0) {
      setSelectedVendors([]);
    } else {
      setSelectedVendors(paginatedVendors.map((v) => v.id));
    }
  };

  const handleSelectVendor = (id) => {
    if (selectedVendors.includes(id)) {
      setSelectedVendors(selectedVendors.filter((vendorId) => vendorId !== id));
    } else {
      setSelectedVendors([...selectedVendors, id]);
    }
  };

  const handleApprove = (vendor) => {
    setVendorToApprove(vendor);
    setShowApproveModal(true);
  };

  const handleBlock = (vendor) => {
    setVendorToBlock(vendor);
    setBlockReason("");
    setShowBlockModal(true);
  };

  const handleDelete = (vendor) => {
    setVendorToDelete(vendor);
    setShowDeleteModal(true);
  };

  const confirmApprove = () => {
    if (vendorToApprove) {
      console.log("Approved:", vendorToApprove.name);
      setShowApproveModal(false);
      setVendorToApprove(null);
    }
  };

  const confirmBlock = () => {
    if (vendorToBlock) {
      console.log("Blocked:", vendorToBlock.name, "Reason:", blockReason);
      setShowBlockModal(false);
      setVendorToBlock(null);
      setBlockReason("");
    }
  };

  const confirmDelete = () => {
    if (vendorToDelete) {
      console.log("Deleted:", vendorToDelete.name);
      setShowDeleteModal(false);
      setVendorToDelete(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { color: "bg-green-50 text-green-700", icon: CheckCircle, label: "Approved" },
      pending: { color: "bg-amber-50 text-amber-700", icon: Clock, label: "Pending" },
      suspended: { color: "bg-red-50 text-red-700", icon: XCircle, label: "Suspended" },
    };
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        <span className="hidden sm:inline">{config.label}</span>
        <span className="sm:hidden">{config.label.charAt(0)}</span>
      </span>
    );
  };

  // Mobile card view for vendors
  const MobileVendorCard = ({ vendor }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-4 mb-3 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selectedVendors.includes(vendor.id)}
            onChange={() => handleSelectVendor(vendor.id)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${vendor.avatarColor} flex items-center justify-center text-white font-semibold text-sm`}>
            {vendor.avatar}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{vendor.name}</p>
            <p className="text-xs text-gray-500">{vendor.cuisine}</p>
          </div>
        </div>
        {getStatusBadge(vendor.status)}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="flex items-center gap-1 text-gray-600">
          <Mail className="w-3 h-3 text-gray-400" />
          <span className="truncate">{vendor.email}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <Phone className="w-3 h-3 text-gray-400" />
          <span>{vendor.phone}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600 col-span-2">
          <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="truncate">{vendor.location}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs">
          <ShoppingBag className="w-3 h-3 text-gray-400" />
          <span>{vendor.totalOrders} orders</span>
          {vendor.rating > 0 && (
            <>
              <span className="text-gray-300">|</span>
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span>{vendor.rating}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-indigo-50 rounded-lg">
            <Eye className="w-3.5 h-3.5 text-gray-500" />
          </button>
          {vendor.status === "pending" && (
            <button onClick={() => handleApprove(vendor)} className="p-1.5 hover:bg-green-50 rounded-lg">
              <CheckCircle className="w-3.5 h-3.5 text-gray-500" />
            </button>
          )}
          {vendor.status === "approved" && (
            <button onClick={() => handleBlock(vendor)} className="p-1.5 hover:bg-red-50 rounded-lg">
              <XCircle className="w-3.5 h-3.5 text-gray-500" />
            </button>
          )}
          <button onClick={() => handleDelete(vendor)} className="p-1.5 hover:bg-red-50 rounded-lg">
            <Trash2 className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <SuperLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Vendor Management
            </h1>
            <p className="text-gray-500 mt-0.5 sm:mt-1 text-xs sm:text-sm">
              Manage and monitor all vendors on your platform
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1 sm:gap-2">
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Add</span>
            </button>
            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1 sm:gap-2">
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
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="mt-2 sm:mt-3">
                <h3 className="text-gray-600 text-xs font-medium">{stat.title}</h3>
                <p className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats Row - Hidden on mobile, visible on tablet/desktop */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
              <span className="text-xs sm:text-sm text-purple-600 font-medium">Total Orders</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-purple-900 mt-1">{totalOrders.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
              <span className="text-xs sm:text-sm text-blue-600 font-medium">Total Revenue</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-blue-900 mt-1">₹{(totalRevenue/100000).toFixed(1)}L</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
              <span className="text-xs sm:text-sm text-amber-600 font-medium">Avg Rating</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-amber-900 mt-1">
              {(vendors.reduce((acc, v) => acc + v.rating, 0) / vendors.filter(v => v.rating > 0).length || 0).toFixed(1)}
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="flex-1 sm:flex-none px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="all">All</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
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
          {paginatedVendors.map((vendor) => (
            <MobileVendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedVendors.length === paginatedVendors.length && paginatedVendors.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Docs</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedVendors.includes(vendor.id)}
                        onChange={() => handleSelectVendor(vendor.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${vendor.avatarColor} flex items-center justify-center text-white font-semibold text-xs`}>
                          {vendor.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{vendor.name}</p>
                          <p className="text-xs text-gray-500">{vendor.cuisine}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-[120px]">{vendor.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{vendor.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="truncate max-w-[100px]">{vendor.location}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs">
                          <ShoppingBag className="w-3 h-3 text-gray-400" />
                          <span>{vendor.totalOrders}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <IndianRupee className="w-3 h-3 text-gray-400" />
                          <span>{(vendor.totalRevenue/1000).toFixed(0)}k</span>
                        </div>
                        {vendor.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs">{vendor.rating}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(vendor.status)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        vendor.documents === "verified" 
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {vendor.documents === "verified" ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-indigo-50 rounded">
                          <Eye className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                        {vendor.status === "pending" && (
                          <button onClick={() => handleApprove(vendor)} className="p-1 hover:bg-green-50 rounded">
                            <CheckCircle className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                        )}
                        {vendor.status === "approved" && (
                          <button onClick={() => handleBlock(vendor)} className="p-1 hover:bg-red-50 rounded">
                            <XCircle className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                        )}
                        <button onClick={() => handleDelete(vendor)} className="p-1 hover:bg-red-50 rounded">
                          <Trash2 className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredVendors.length)} of {filteredVendors.length}
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

        {/* Modals (same as before) */}
        {showApproveModal && vendorToApprove && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-5">
              <div className="flex items-center gap-2 text-green-600 mb-3">
                <CheckCircle className="w-5 h-5" />
                <h3 className="text-base font-semibold">Approve Vendor?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Approve <span className="font-semibold">{vendorToApprove.name}</span>?
              </p>
              <div className="flex gap-2">
                <button onClick={confirmApprove} className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm">
                  Approve
                </button>
                <button onClick={() => { setShowApproveModal(false); setVendorToApprove(null); }} 
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showBlockModal && vendorToBlock && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-5">
              <div className="flex items-center gap-2 text-red-600 mb-3">
                <XCircle className="w-5 h-5" />
                <h3 className="text-base font-semibold">Block Vendor?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Block <span className="font-semibold">{vendorToBlock.name}</span>?
              </p>
              <textarea
                placeholder="Reason (optional)"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="w-full p-2 text-sm border border-gray-200 rounded-lg mb-3"
                rows="2"
              />
              <div className="flex gap-2">
                <button onClick={confirmBlock} className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm">
                  Block
                </button>
                <button onClick={() => { setShowBlockModal(false); setVendorToBlock(null); setBlockReason(""); }} 
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && vendorToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-5">
              <div className="flex items-center gap-2 text-red-600 mb-3">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-semibold">Delete Vendor?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Delete <span className="font-semibold">{vendorToDelete.name}</span>?
              </p>
              <div className="flex gap-2">
                <button onClick={confirmDelete} className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm">
                  Delete
                </button>
                <button onClick={() => { setShowDeleteModal(false); setVendorToDelete(null); }} 
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SuperLayout>
  );
};

export default ManageVendors;