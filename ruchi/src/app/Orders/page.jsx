"use client"
import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  CreditCard, 
  Truck, 
  CheckCircle,
  Package,
  ChevronRight,
  AlertCircle,
  Star,
  Phone,
  MessageCircle,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader,
  Utensils,
  Coffee,
  Pizza,
  Beef,
  Salad,
  ShoppingCart,
  Bike,
  Timer,
  Calendar,
  Receipt,
  Wallet,
  Home,
  Mail,
  Copy,
  CheckCheck
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('active')
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [orders, setOrders] = useState({
    active: [],
    past: []
  })
  const [expandedSections, setExpandedSections] = useState({
    tracking: true,
    address: true,
    payment: true
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [copiedId, setCopiedId] = useState(null)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  // Check if desktop view
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  // Get auth token from localStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  }

  // Get user ID from localStorage
  const getUserId = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      if (user) {
        try {
          const parsedUser = JSON.parse(user)
          return parsedUser.id || parsedUser._id || null
        } catch (e) {
          console.error('Error parsing user:', e)
          return null
        }
      }
    }
    return null
  }

  // Check if user is logged in
  useEffect(() => {
    const token = getAuthToken()
    const userId = getUserId()
    setIsLoggedIn(!!(token && userId))
  }, [])

  // Copy order ID to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(text)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Fetch orders from backend
  const fetchOrders = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = getAuthToken()
      
      // If no token, show login message
      if (!token) {
        setError('Please log in to view your orders')
        setLoading(false)
        return
      }

      console.log('Fetching orders with token')

      const res = await fetch("http://localhost:5000/api/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      console.log("Orders fetched:", data)

      if (res.status === 401) {
        // Unauthorized - token expired or invalid
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setError('Your session has expired. Please log in again.')
        setLoading(false)
        return
      }
      
      if (!res.ok) {
        throw new Error(`Failed to fetch orders: ${res.status}`)
      }

      // Check if data has orders array (based on your API response structure)
      let ordersArray = []
      
      if (data && data.success && Array.isArray(data.orders)) {
        ordersArray = data.orders
        console.log('Orders array:', ordersArray)
      } else if (Array.isArray(data)) {
        ordersArray = data
        console.log('Orders array (direct array):', ordersArray)
      } else {
        console.error("Expected array but got:", data)
        setOrders({ active: [], past: [] })
        setLoading(false)
        return
      }

      // Debug: Log all order statuses to see what's coming from API
      ordersArray.forEach((order, index) => {
        console.log(`Order ${index} status:`, order.status || order.orderStatus)
      })

      // Separate orders into active and past with case-insensitive comparison
      // Using order.status as per your request
      const activeOrders = ordersArray.filter(order => 
        ['pending', 'confirmed', 'preparing', 'out_for_delivery']
          .includes((order.status || order.orderStatus)?.toLowerCase())
      )
      
      const pastOrders = ordersArray.filter(order => 
        ['delivered', 'cancelled', 'rejected']
          .includes((order.status || order.orderStatus)?.toLowerCase())
      )

      console.log('Active orders count:', activeOrders.length)
      console.log('Past orders count:', pastOrders.length)

      // Transform backend data to match frontend format
      const transformedActive = activeOrders.map(order => transformOrderData(order))
      const transformedPast = pastOrders.map(order => transformOrderData(order))

      setOrders({
        active: transformedActive,
        past: transformedPast
      })

    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Failed to load orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Get food icon based on item name
  const getFoodIcon = (itemName) => {
    const name = itemName.toLowerCase()
    if (name.includes('pizza')) return <Pizza className="w-4 h-4" />
    if (name.includes('burger')) return <Beef className="w-4 h-4" />
    if (name.includes('salad')) return <Salad className="w-4 h-4" />
    if (name.includes('coffee') || name.includes('tea')) return <Coffee className="w-4 h-4" />
    if (name.includes('naan') || name.includes('roti')) return <Utensils className="w-4 h-4" />
    return <ShoppingBag className="w-4 h-4" />
  }

  // Transform backend order data to frontend format
  const transformOrderData = (order) => {
    const isRestaurant = order.restaurant?.type === 'RESTAURANT'
    const status = getOrderStatus(order.status || order.orderStatus)
    
    // Format items properly with better details
    const items = order.items?.map(item => ({
      name: item.dish?.name || item.name || 'Unknown Item',
      quantity: item.quantity || 1,
      price: item.price || 0,
      totalPrice: (item.price || 0) * (item.quantity || 1),
      dishId: item.dishId || item.dish?.id,
      icon: getFoodIcon(item.dish?.name || item.name || ''),
      customizations: item.customizations || [],
      specialInstructions: item.specialInstructions || ''
    })) || []

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
    const tax = subtotal * 0.05 // 5% tax
    const deliveryFee = order.deliveryFee || 40
    const total = order.totalAmount || order.total || (subtotal + tax + deliveryFee)

    return {
      id: order.orderId || `#ORD-${order.id || order._id}`,
      orderId: order.id || order._id,
      type: isRestaurant ? 'Restaurant' : 'Grocery',
      restaurant: order.restaurant?.name || order.restaurantName || 'Restaurant',
      store: order.restaurant?.name || order.restaurantName || 'Store',
      restaurantImage: order.restaurant?.image || '/restaurant-placeholder.jpg',
      items: items,
      subtotal: subtotal,
      tax: tax,
      deliveryFee: deliveryFee,
      total: formatINR(total),
      status: status,
      statusText: getStatusText(order.status || order.orderStatus),
      time: getOrderTime(order.createdAt),
      estimatedDelivery: getEstimatedDelivery(order.createdAt),
      driver: order.driver ? {
        name: order.driver.name,
        rating: order.driver.rating || 4.8,
        phone: order.driver.phone,
        image: order.driver.image || '/driver-placeholder.jpg',
        vehicle: order.driver.vehicle || 'Bike'
      } : null,
      rating: order.rating || 0,
      review: order.review || '',
      orderStatus: order.status || order.orderStatus,
      createdAt: order.createdAt,
      deliveryAddress: order.deliveryAddress || {},
      paymentMethod: order.paymentMethod || { type: 'cash', text: 'Cash on Delivery' },
      paymentStatus: order.paymentStatus || 'pending'
    }
  }

  // Helper functions with case-insensitive comparison - UPDATED as per your request
  const getOrderStatus = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'pending'
      case 'confirmed': return 'confirmed'
      case 'preparing': return 'preparing'
      case 'out_for_delivery': return 'on_the_way'
      case 'delivered': return 'delivered'
      case 'cancelled': return 'cancelled'
      case 'rejected': return 'cancelled'
      default: return 'pending'
    }
  }

  const getStatusText = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'Order placed'
      case 'confirmed': return 'Order confirmed'
      case 'preparing': return 'Preparing your order'
      case 'out_for_delivery': return 'Out for delivery'
      case 'delivered': return 'Delivered'
      case 'cancelled': return 'Cancelled'
      case 'rejected': return 'Rejected'
      default: return 'Processing'
    }
  }

  const getOrderTime = (createdAt) => {
    if (!createdAt) return 'Just now'
    
    const date = new Date(createdAt)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) {
      return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short',
        year: 'numeric'
      })
    }
  }

  const getEstimatedDelivery = (createdAt) => {
    if (!createdAt) return '30-40 mins'
    
    const date = new Date(createdAt)
    date.setMinutes(date.getMinutes() + 45) // Add 45 minutes
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Fetch orders on component mount and when login status changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [isLoggedIn])

  // Handle login redirect
  const handleLoginRedirect = () => {
    router.push('/login?redirect=orders')
  }

  // Delivery address from user profile or localStorage
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    default: true
  })

  // Fetch user profile for address
  const fetchUserProfile = async () => {
    const token = getAuthToken()

    if (token) {
      try {
        const response = await fetch(`${apiUrl}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const userData = await response.json()
          
          setDeliveryAddress({
            name: userData.name || 'User Name',
            address: userData.address || '123, Sample Address',
            city: userData.city || 'City, State 123456',
            phone: userData.phone || '+91 98765 43210',
            default: true
          })
        } else if (response.status === 401) {
          console.error('Unauthorized access to profile')
        }
      } catch (err) {
        console.error('Error fetching user profile:', err)
      }
    }
  }

  // Call fetchUserProfile when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile()
    }
  }, [isLoggedIn])

  // Payment methods from user profile
  const [paymentMethods, setPaymentMethods] = useState([
    { type: 'cash', text: 'Cash on Delivery', default: true }
  ])

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200'
      case 'on_the_way': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200'
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'confirmed': return 'bg-purple-100 text-purple-700 border-purple-200'
      default: return 'bg-orange-100 text-orange-700 border-orange-200'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'on_the_way': return <Bike className="w-4 h-4" />
      case 'cancelled': return <AlertCircle className="w-4 h-4" />
      case 'pending': return <Timer className="w-4 h-4" />
      case 'confirmed': return <CheckCheck className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  // Reorder function
  const handleReorder = async (order) => {
    try {
      // Get original order ID from the formatted ID
      const orderId = order.orderId || order.id.replace('#ORD-', '')
      
      // Navigate to restaurant page
      router.push(`/restaurant/${orderId}`)
    } catch (err) {
      console.error('Error reordering:', err)
    }
  }

  // Track order function
  const handleTrackOrder = (order) => {
    router.push(`/track-order/${order.orderId || order.id.replace('#ORD-', '')}`)
  }

  // Call driver function
  const handleCallDriver = (phone) => {
    window.location.href = `tel:${phone}`
  }

  // Message driver function
  const handleMessageDriver = (phone) => {
    window.location.href = `sms:${phone}`
  }

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Package className="w-10 h-10 text-orange-500" />
              </div>
              <Loader className="w-8 h-8 text-orange-500 animate-spin absolute top-6 left-1/2 transform -translate-x-1/2" />
            </div>
            <p className="text-gray-600 font-medium">Loading your delicious orders...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // Show login message if not logged in
  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <Package className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Hungry for Orders?</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Log in to view your order history and track your delicious meals!
            </p>
            <button
              onClick={handleLoginRedirect}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 mx-auto"
            >
              <ShoppingBag className="w-5 h-5" />
              Log In to Continue
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error && !orders.active.length && !orders.past.length) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={fetchOrders}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          {/* Header with animation */}
          <div className="mb-8 lg:mb-12 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-3">
              Your Orders
            </h1>
            <p className="text-gray-600 text-lg">
              Track your delicious journey with us
            </p>
          </div>

          {/* Mobile Order Stats - Enhanced */}
          <div className="lg:hidden grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-orange-100 transform hover:scale-105 transition-transform">
              <div className="flex items-center gap-3 text-orange-600 mb-2">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="font-semibold">Active</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{orders.active.length}</p>
              <p className="text-xs text-gray-500 mt-1">orders in progress</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-green-100 transform hover:scale-105 transition-transform">
              <div className="flex items-center gap-3 text-green-600 mb-2">
                <div className="p-2 bg-green-100 rounded-xl">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="font-semibold">Completed</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{orders.past.length}</p>
              <p className="text-xs text-gray-500 mt-1">total orders</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
            
            {/* Left Column - Order List */}
            <div className="lg:col-span-2">
              
              {/* Order Tabs - Enhanced */}
              <div className="flex gap-2 bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl mb-8 border border-gray-200">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`flex-1 py-3 px-4 text-center text-sm sm:text-base font-semibold rounded-xl transition-all ${
                    activeTab === 'active'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200'
                      : 'text-gray-600 hover:bg-orange-50'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Active ({orders.active.length})
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`flex-1 py-3 px-4 text-center text-sm sm:text-base font-semibold rounded-xl transition-all ${
                    activeTab === 'past'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200'
                      : 'text-gray-600 hover:bg-orange-50'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    Past ({orders.past.length})
                  </span>
                </button>
              </div>

              {/* Empty State - Enhanced */}
              {orders[activeTab].length === 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-100 p-12 text-center">
                  <div className="w-28 h-28 bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3 hover:rotate-0 transition-transform">
                    <Package className="w-14 h-14 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No {activeTab} orders yet
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    {activeTab === 'active' 
                      ? 'Ready to satisfy your cravings? Place your first order!'
                      : 'Your order history will appear here'}
                  </p>
                  <Link href="/">
                    <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Browse Restaurants
                    </button>
                  </Link>
                </div>
              )}

              {/* Orders List - Enhanced with better items display */}
              <div className="space-y-6">
                {orders[activeTab].map((order) => (
                  <div 
                    key={order.id} 
                    className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-100 overflow-hidden transform hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Order Header - Enhanced */}
                    <div 
                      className="p-6 border-b border-orange-100 cursor-pointer lg:cursor-default bg-gradient-to-r from-orange-50 to-transparent"
                      onClick={() => toggleOrderExpand(order.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Restaurant Image Placeholder */}
                          <div className={`p-3 rounded-2xl flex-shrink-0 ${
                            order.type === 'Restaurant' ? 'bg-gradient-to-br from-orange-400 to-orange-500' : 'bg-gradient-to-br from-green-400 to-green-500'
                          }`}>
                            {order.type === 'Restaurant' ? (
                              <Utensils className="w-5 h-5 text-white" />
                            ) : (
                              <ShoppingCart className="w-5 h-5 text-white" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                                {order.restaurant}
                              </h3>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  copyToClipboard(order.id)
                                }}
                                className="text-gray-400 hover:text-orange-500 transition-colors"
                              >
                                {copiedId === order.id ? (
                                  <CheckCheck className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{order.time}</span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span>{order.items.length} items</span>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Expand/Collapse Icon */}
                        <button className="lg:hidden p-2 hover:bg-orange-100 rounded-xl transition-colors">
                          {expandedOrder === order.id ? (
                            <ChevronUp className="w-5 h-5 text-orange-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-orange-500" />
                          )}
                        </button>
                      </div>

                      {/* Order Summary - Enhanced */}
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                            {order.total}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">Total amount</p>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span>{order.statusText}</span>
                        </div>
                      </div>

                      {/* Quick Items Preview - Mobile */}
                      {expandedOrder !== order.id && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 lg:hidden">
                          <div className="flex -space-x-2">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="w-8 h-8 bg-orange-100 rounded-full border-2 border-white flex items-center justify-center">
                                {item.icon}
                              </div>
                            ))}
                          </div>
                          <span>{order.items.length} items in this order</span>
                        </div>
                      )}
                    </div>

                    {/* Expanded Content - Enhanced with better items display */}
                    {(expandedOrder === order.id) && (
                      <div className="p-6 border-t border-orange-100 lg:hidden">
                        {/* Order Items - Enhanced */}
                        <div className="mb-6">
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Receipt className="w-5 h-5 text-orange-500" />
                            Order Items
                          </h4>
                          <div className="space-y-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 bg-orange-50/50 rounded-xl">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                  {item.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-semibold text-gray-900">{item.name}</p>
                                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="font-semibold text-orange-600">
                                      {formatINR(item.price * item.quantity)}
                                    </span>
                                  </div>
                                  {item.customizations?.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      {item.customizations.join(', ')}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary - Enhanced */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-orange-500" />
                            Price Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subtotal</span>
                              <span className="font-medium">{formatINR(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tax (5%)</span>
                              <span className="font-medium">{formatINR(order.tax)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Delivery Fee</span>
                              <span className="font-medium">{formatINR(order.deliveryFee)}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 mt-2">
                              <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span className="text-orange-600">{order.total}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons - Enhanced */}
                        {activeTab === 'active' ? (
                          <>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              {order.driver?.phone && (
                                <>
                                  <button 
                                    onClick={() => handleCallDriver(order.driver.phone)}
                                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                                  >
                                    <Phone className="w-4 h-4" />
                                    Call
                                  </button>
                                  <button 
                                    onClick={() => handleMessageDriver(order.driver.phone)}
                                    className="border-2 border-orange-200 text-gray-700 py-3 px-4 rounded-xl font-semibold text-sm hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                    Message
                                  </button>
                                </>
                              )}
                            </div>
                            
                            <button 
                              onClick={() => handleTrackOrder(order)}
                              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg shadow-orange-200 mb-4 flex items-center justify-center gap-2"
                            >
                              <Bike className="w-4 h-4" />
                              Track Order
                            </button>

                            {/* Driver Info - Enhanced */}
                            {order.driver && (
                              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center text-white">
                                    <Bike className="w-6 h-6" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900">{order.driver.name}</h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                      <span>{order.driver.rating}</span>
                                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                      <Timer className="w-4 h-4" />
                                      <span>{order.estimatedDelivery}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-5 h-5 ${i < order.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <button 
                                onClick={() => handleReorder(order)}
                                className="text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1"
                              >
                                <ShoppingBag className="w-4 h-4" />
                                Reorder
                              </button>
                            </div>
                            {order.review && (
                              <div className="p-4 bg-gray-50 rounded-xl italic text-gray-600">
                                "{order.review}"
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Desktop View - Enhanced with better items */}
                    <div className="hidden lg:block p-6">
                      {/* Order Items - Enhanced Desktop */}
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-orange-500" />
                        Order Items
                      </h4>
                      <div className="space-y-3 mb-6">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-orange-50/50 rounded-xl hover:bg-orange-100/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                {item.icon}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                                {item.customizations?.length > 0 && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {item.customizations.join(', ')}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className="font-semibold text-orange-600">
                              {formatINR(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Price Summary - Desktop */}
                      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-orange-500" />
                          Price Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">{formatINR(order.subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax (5%)</span>
                            <span className="font-medium">{formatINR(order.tax)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Fee</span>
                            <span className="font-medium">{formatINR(order.deliveryFee)}</span>
                          </div>
                          <div className="border-t border-gray-200 pt-2 mt-2">
                            <div className="flex justify-between font-bold">
                              <span>Total</span>
                              <span className="text-orange-600 text-lg">{order.total}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Action Buttons */}
                      {activeTab === 'active' ? (
                        <div className="mt-6 pt-6 border-t border-orange-100">
                          <div className="flex gap-3">
                            {order.driver?.phone && (
                              <>
                                <button 
                                  onClick={() => handleCallDriver(order.driver.phone)}
                                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                                >
                                  <Phone className="w-4 h-4" />
                                  Call Driver
                                </button>
                                <button 
                                  onClick={() => handleMessageDriver(order.driver.phone)}
                                  className="flex-1 border-2 border-orange-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  Message
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => handleTrackOrder(order)}
                              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                            >
                              <Bike className="w-4 h-4" />
                              Track
                            </button>
                          </div>

                          {order.driver && (
                            <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center text-white">
                                    <Bike className="w-7 h-7" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{order.driver.name}</h4>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                      <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        <span>{order.driver.rating}</span>
                                      </div>
                                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                      <div className="flex items-center gap-1">
                                        <Timer className="w-4 h-4" />
                                        <span>{order.estimatedDelivery}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-6 pt-6 border-t border-orange-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-6 h-6 ${i < order.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                              <span className="ml-2 text-gray-700 font-semibold">{order.rating}/5</span>
                            </div>
                            <button 
                              onClick={() => handleReorder(order)}
                              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg shadow-orange-200 flex items-center gap-2"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              Reorder
                            </button>
                          </div>
                          {order.review && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-xl italic text-gray-600 border-l-4 border-orange-400">
                              "{order.review}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Enhanced Info Cards */}
            <div className="space-y-6">
              
              {/* Order Tracking - Enhanced */}
              {activeTab === 'active' && orders.active.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
                  <div 
                    className="p-6 flex items-center justify-between cursor-pointer lg:cursor-default bg-gradient-to-r from-orange-50 to-transparent border-b border-orange-100"
                    onClick={() => toggleSection('tracking')}
                  >
                    <h3 className="font-bold text-gray-900 flex items-center gap-3 text-lg">
                      <div className="p-2 bg-orange-100 rounded-xl">
                        <Clock className="w-5 h-5 text-orange-500" />
                      </div>
                      <span>Live Tracking</span>
                    </h3>
                    <button className="lg:hidden">
                      {expandedSections.tracking ? (
                        <ChevronUp className="w-5 h-5 text-orange-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-orange-500" />
                      )}
                    </button>
                  </div>
                  
                  {(expandedSections.tracking || isDesktop) && orders.active[0] && (
                    <div className="p-6">
                      <div className="relative">
                        {getOrderSteps(orders.active[0]).map((step, index) => (
                          <div key={step.id} className="flex items-start mb-8 last:mb-0">
                            <div className="relative flex-shrink-0">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                step.completed 
                                  ? 'bg-gradient-to-br from-green-400 to-green-500 text-white shadow-lg shadow-green-200'
                                  : step.active
                                  ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-200 animate-pulse'
                                  : 'bg-gray-100 text-gray-400'
                              }`}>
                                {step.completed ? (
                                  <CheckCircle className="w-5 h-5" />
                                ) : (
                                  <span className="text-sm font-bold">{step.id}</span>
                                )}
                              </div>
                              {index < getOrderSteps(orders.active[0]).length - 1 && (
                                <div className={`absolute top-10 left-5 w-0.5 h-12 ${
                                  step.completed ? 'bg-green-400' : 'bg-gray-200'
                                }`}></div>
                              )}
                            </div>
                            <div className="ml-4 flex-1">
                              <h4 className={`font-semibold ${
                                step.active ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {step.title}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                <Timer className="w-3 h-3" />
                                {step.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Delivery Address - Enhanced */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
                <div 
                  className="p-6 flex items-center justify-between cursor-pointer lg:cursor-default bg-gradient-to-r from-orange-50 to-transparent border-b border-orange-100"
                  onClick={() => toggleSection('address')}
                >
                  <h3 className="font-bold text-gray-900 flex items-center gap-3 text-lg">
                    <div className="p-2 bg-orange-100 rounded-xl">
                      <MapPin className="w-5 h-5 text-orange-500" />
                    </div>
                    <span>Delivery Address</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <Link href="/profile">
                      <button className="text-sm text-orange-600 font-semibold hover:text-orange-700 hidden lg:flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-xl">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </Link>
                    <button className="lg:hidden">
                      {expandedSections.address ? (
                        <ChevronUp className="w-5 h-5 text-orange-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-orange-500" />
                      )}
                    </button>
                  </div>
                </div>
                
                {(expandedSections.address || isDesktop) && (
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <Home className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg">{deliveryAddress.name}</p>
                        <p className="text-gray-600 mt-1">{deliveryAddress.address}</p>
                        <p className="text-gray-600">{deliveryAddress.city}</p>
                        <div className="flex items-center gap-2 mt-3 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{deliveryAddress.phone}</span>
                        </div>
                        
                        {deliveryAddress.default && (
                          <span className="inline-block mt-4 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-xl">
                            Default Address
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Mobile Edit Button */}
                    <Link href="/profile" className="lg:hidden block w-full mt-4">
                      <button className="w-full border-2 border-orange-200 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
                        <Edit className="w-4 h-4" />
                        Edit Address
                      </button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Payment Methods - Enhanced */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
                <div 
                  className="p-6 flex items-center justify-between cursor-pointer lg:cursor-default bg-gradient-to-r from-orange-50 to-transparent border-b border-orange-100"
                  onClick={() => toggleSection('payment')}
                >
                  <h3 className="font-bold text-gray-900 flex items-center gap-3 text-lg">
                    <div className="p-2 bg-orange-100 rounded-xl">
                      <CreditCard className="w-5 h-5 text-orange-500" />
                    </div>
                    <span>Payment Methods</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <Link href="/profile">
                      <button className="text-sm text-orange-600 font-semibold hover:text-orange-700 hidden lg:block bg-orange-50 px-3 py-1.5 rounded-xl">
                        Add New
                      </button>
                    </Link>
                    <button className="lg:hidden">
                      {expandedSections.payment ? (
                        <ChevronUp className="w-5 h-5 text-orange-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-orange-500" />
                      )}
                    </button>
                  </div>
                </div>
                
                {(expandedSections.payment || isDesktop) && (
                  <div className="p-6">
                    <div className="space-y-3">
                      {paymentMethods.map((method, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-orange-50/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-gray-700" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {method.text}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Default payment method</p>
                            </div>
                          </div>
                          {method.default && (
                            <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1.5 rounded-xl">
                              Default
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Mobile Add Payment Button */}
                    <Link href="/profile" className="lg:hidden block w-full mt-4">
                      <button className="w-full border-2 border-orange-200 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-orange-50 transition-all">
                        + Add Payment Method
                      </button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Help Section - Enhanced */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-xl">Need Help?</h3>
                </div>
                <p className="text-white/90 mb-6">
                  Having issues with your order? Our support team is here 24/7!
                </p>
                <div className="space-y-3">
                  <Link href="/support">
                    <button className="w-full bg-white text-orange-600 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Chat with Support
                    </button>
                  </Link>
                  <a href="tel:1800123456">
                    <button className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-all transform hover:scale-105 flex items-center justify-center gap-2 border border-white/30">
                      <Phone className="w-4 h-4" />
                      Call: 1800-123-456
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}

// Helper function to get order tracking steps - Enhanced
const getOrderSteps = (order) => {
  const steps = [
    { id: 1, title: 'Order Placed', time: order.time, active: false, completed: false },
    { id: 2, title: 'Order Confirmed', time: order.time, active: false, completed: false },
    { id: 3, title: 'Preparing', time: order.time, active: false, completed: false },
    { id: 4, title: 'Out for Delivery', time: order.estimatedDelivery, active: false, completed: false },
    { id: 5, title: 'Delivered', time: order.status === 'delivered' ? order.time : 'Pending', active: false, completed: false }
  ]

  // Adjust based on actual status
  const status = order.orderStatus?.toLowerCase()
  
  if (status === 'pending') {
    steps[0].completed = true
    steps[1].active = true
  } else if (status === 'confirmed') {
    steps[0].completed = true
    steps[1].completed = true
    steps[2].active = true
  } else if (status === 'preparing') {
    steps[0].completed = true
    steps[1].completed = true
    steps[2].completed = true
    steps[3].active = true
  } else if (status === 'out_for_delivery') {
    steps[0].completed = true
    steps[1].completed = true
    steps[2].completed = true
    steps[3].completed = true
    steps[4].active = true
  } else if (status === 'delivered') {
    steps.forEach(step => step.completed = true)
  } else if (status === 'cancelled' || status === 'rejected') {
    steps[0].completed = true
  }

  return steps
}

export default Page