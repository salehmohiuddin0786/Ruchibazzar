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
  Star,
  Truck,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  Award,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const ManagePartners = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedPartners, setSelectedPartners] = useState([]);
  const itemsPerPage = 8;

  // Sample partners data
  const partners = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul.s@delivery.com",
      phone: "+91 98765 43210",
      location: "Mumbai Central",
      area: "South Mumbai",
      totalDeliveries: 1245,
      completedDeliveries: 1198,
      rating: 4.9,
      status: "active",
      vehicle: "Motorcycle",
      vehicleNumber: "MH-01-AB-1234",
      joinedDate: "2023-08-15",
      earnings: "₹45,890",
      avatar: "RS",
      avatarColor: "from-blue-500 to-blue-600",
      todayDeliveries: 18,
      online: true,
    },
    {
      id: 2,
      name: "Priya Verma",
      email: "priya.v@delivery.com",
      phone: "+91 87654 32109",
      location: "Andheri East",
      area: "Western Suburbs",
      totalDeliveries: 892,
      completedDeliveries: 876,
      rating: 4.8,
      status: "active",
      vehicle: "Scooter",
      vehicleNumber: "MH-02-CD-5678",
      joinedDate: "2023-10-22",
      earnings: "₹32,450",
      avatar: "PV",
      avatarColor: "from-purple-500 to-purple-600",
      todayDeliveries: 15,
      online: true,
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit.k@delivery.com",
      phone: "+91 76543 21098",
      location: "Borivali West",
      area: "Western Suburbs",
      totalDeliveries: 1567,
      completedDeliveries: 1489,
      rating: 4.7,
      status: "active",
      vehicle: "Motorcycle",
      vehicleNumber: "MH-03-EF-9012",
      joinedDate: "2023-06-10",
      earnings: "₹52,780",
      avatar: "AK",
      avatarColor: "from-green-500 to-green-600",
      todayDeliveries: 12,
      online: true,
    },
    {
      id: 4,
      name: "Sneha Patil",
      email: "sneha.p@delivery.com",
      phone: "+91 65432 10987",
      location: "Thane West",
      area: "Thane",
      totalDeliveries: 678,
      completedDeliveries: 645,
      rating: 4.6,
      status: "offline",
      vehicle: "Scooter",
      vehicleNumber: "MH-04-GH-3456",
      joinedDate: "2024-01-05",
      earnings: "₹24,560",
      avatar: "SP",
      avatarColor: "from-amber-500 to-amber-600",
      todayDeliveries: 0,
      online: false,
    },
    {
      id: 5,
      name: "Vikram Singh",
      email: "vikram.s@delivery.com",
      phone: "+91 54321 09876",
      location: "Navi Mumbai",
      area: "Navi Mumbai",
      totalDeliveries: 2034,
      completedDeliveries: 1987,
      rating: 5.0,
      status: "active",
      vehicle: "Motorcycle",
      vehicleNumber: "MH-05-IJ-7890",
      joinedDate: "2023-04-18",
      earnings: "₹68,450",
      avatar: "VS",
      avatarColor: "from-red-500 to-red-600",
      todayDeliveries: 22,
      online: true,
    },
    {
      id: 6,
      name: "Anjali Deshmukh",
      email: "anjali.d@delivery.com",
      phone: "+91 43210 98765",
      location: "Pune Station",
      area: "Pune City",
      totalDeliveries: 945,
      completedDeliveries: 912,
      rating: 4.8,
      status: "active",
      vehicle: "Scooter",
      vehicleNumber: "MH-06-KL-1234",
      joinedDate: "2023-09-12",
      earnings: "₹34,780",
      avatar: "AD",
      avatarColor: "from-pink-500 to-pink-600",
      todayDeliveries: 14,
      online: true,
    },
    {
      id: 7,
      name: "Karthik Nair",
      email: "karthik.n@delivery.com",
      phone: "+91 32109 87654",
      location: "Chembur",
      area: "Central Mumbai",
      totalDeliveries: 456,
      completedDeliveries: 423,
      rating: 4.4,
      status: "inactive",
      vehicle: "Bicycle",
      vehicleNumber: "MH-07-MN-5678",
      joinedDate: "2024-02-01",
      earnings: "₹15,670",
      avatar: "KN",
      avatarColor: "from-indigo-500 to-indigo-600",
      todayDeliveries: 0,
      online: false,
    },
    {
      id: 8,
      name: "Meera Iyer",
      email: "meera.i@delivery.com",
      phone: "+91 21098 76543",
      location: "Bangalore Central",
      area: "Bangalore",
      totalDeliveries: 1123,
      completedDeliveries: 1089,
      rating: 4.9,
      status: "active",
      vehicle: "Motorcycle",
      vehicleNumber: "KA-01-OP-9012",
      joinedDate: "2023-07-25",
      earnings: "₹41,230",
      avatar: "MI",
      avatarColor: "from-teal-500 to-teal-600",
      todayDeliveries: 16,
      online: true,
    },
    {
      id: 9,
      name: "Arjun Reddy",
      email: "arjun.r@delivery.com",
      phone: "+91 10987 65432",
      location: "Hyderabad",
      area: "Secunderabad",
      totalDeliveries: 1678,
      completedDeliveries: 1623,
      rating: 4.7,
      status: "active",
      vehicle: "Motorcycle",
      vehicleNumber: "TS-01-QR-3456",
      joinedDate: "2023-05-30",
      earnings: "₹56,890",
      avatar: "AR",
      avatarColor: "from-cyan-500 to-cyan-600",
      todayDeliveries: 19,
      online: true,
    },
    {
      id: 10,
      name: "Divya Gupta",
      email: "divya.g@delivery.com",
      phone: "+91 98765 01234",
      location: "Delhi NCR",
      area: "Gurgaon",
      totalDeliveries: 789,
      completedDeliveries: 756,
      rating: 4.6,
      status: "offline",
      vehicle: "Scooter",
      vehicleNumber: "DL-01-ST-7890",
      joinedDate: "2023-11-14",
      earnings: "₹28,450",
      avatar: "DG",
      avatarColor: "from-orange-500 to-orange-600",
      todayDeliveries: 0,
      online: false,
    },
  ];

  // Calculate stats
  const stats = [
    {
      title: "Total Partners",
      value: partners.length,
      change: "+15%",
      icon: Truck,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Now",
      value: partners.filter((p) => p.online).length,
      change: "+5",
      icon: Clock,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Total Deliveries",
      value: partners.reduce((acc, p) => acc + p.totalDeliveries, 0).toLocaleString(),
      change: "+23%",
      icon: Package,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Avg Rating",
      value: (partners.reduce((acc, p) => acc + p.rating, 0) / partners.length).toFixed(1),
      change: "+0.2",
      icon: Star,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  // Filter partners
  const filteredPartners = partners.filter((partner) => {
    const matchesSearch = 
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.phone.includes(searchTerm) ||
      partner.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "active") return matchesSearch && partner.status === "active";
    if (selectedFilter === "offline") return matchesSearch && partner.status === "offline";
    if (selectedFilter === "inactive") return matchesSearch && partner.status === "inactive";
    if (selectedFilter === "online") return matchesSearch && partner.online;
    
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPartners = filteredPartners.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = () => {
    if (selectedPartners.length === paginatedPartners.length) {
      setSelectedPartners([]);
    } else {
      setSelectedPartners(paginatedPartners.map((p) => p.id));
    }
  };

  const handleSelectPartner = (id) => {
    if (selectedPartners.includes(id)) {
      setSelectedPartners(selectedPartners.filter((partnerId) => partnerId !== id));
    } else {
      setSelectedPartners([...selectedPartners, id]);
    }
  };

  return (
    <SuperLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Delivery Partners
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Manage your delivery fleet and track partner performance
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg text-sm font-medium inline-flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" />
              <span>Add Partner</span>
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium inline-flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Live Online Status Bar */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span className="font-medium">{partners.filter(p => p.online).length} Partners Online Now</span>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{partners.reduce((acc, p) => acc + p.todayDeliveries, 0)}</p>
                <p className="text-xs opacity-90">Today's Deliveries</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{(partners.reduce((acc, p) => acc + p.rating, 0) / partners.length).toFixed(1)}</p>
                <p className="text-xs opacity-90">Avg Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">98%</p>
                <p className="text-xs opacity-90">Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search partners by name, email, phone, area, or vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
              >
                <option value="all">All Partners</option>
                <option value="online">Online</option>
                <option value="active">Active</option>
                <option value="offline">Offline</option>
                <option value="inactive">Inactive</option>
              </select>
              <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Partners Grid/Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paginatedPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedPartners.includes(partner.id)}
                    onChange={() => handleSelectPartner(partner.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${partner.avatarColor} flex items-center justify-center text-white font-semibold text-lg`}>
                    {partner.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{partner.name}</h3>
                    <p className="text-sm text-gray-500">ID: #{partner.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    partner.online
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-50 text-gray-600"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      partner.online ? "bg-green-500 animate-pulse" : "bg-gray-400"
                    }`} />
                    {partner.online ? "Online" : "Offline"}
                  </span>
                  <button className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{partner.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{partner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{partner.area}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4 text-gray-400" />
                    <span>{partner.vehicle} • {partner.vehicleNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span>{partner.totalDeliveries} total deliveries</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span>₹{partner.earnings} earned</span>
                  </div>
                </div>
              </div>

              {/* Performance Bar */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Success</span>
                  <span className="font-medium text-gray-900">
                    {((partner.completedDeliveries / partner.totalDeliveries) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                    style={{ width: `${(partner.completedDeliveries / partner.totalDeliveries) * 100}%` }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{partner.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{partner.todayDeliveries} today</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-indigo-50 rounded-lg transition-colors group">
                    <Eye className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                  </button>
                  <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group">
                    <Edit className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group">
                    <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPartners.length)} of{" "}
            {filteredPartners.length} partners
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border ${
                currentPage === 1
                  ? "border-gray-100 text-gray-300 cursor-not-allowed"
                  : "border-gray-200 hover:bg-gray-50 text-gray-600"
              } transition-colors`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border ${
                currentPage === totalPages
                  ? "border-gray-100 text-gray-300 cursor-not-allowed"
                  : "border-gray-200 hover:bg-gray-50 text-gray-600"
              } transition-colors`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-gray-900">Top Performer</h3>
            </div>
            <p className="text-lg font-bold text-gray-900">Vikram Singh</p>
            <p className="text-sm text-gray-600">5.0 rating • 2,034 deliveries</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <h3 className="font-medium text-gray-900">Busiest Area</h3>
            </div>
            <p className="text-lg font-bold text-gray-900">South Mumbai</p>
            <p className="text-sm text-gray-600">1,245 deliveries this month</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-purple-600" />
              <h3 className="font-medium text-gray-900">Fleet Efficiency</h3>
            </div>
            <p className="text-lg font-bold text-gray-900">94%</p>
            <p className="text-sm text-gray-600">Average success rate</p>
          </div>
        </div>
      </div>
    </SuperLayout>
  );
};

export default ManagePartners;