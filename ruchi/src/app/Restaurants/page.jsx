"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, Filter, Star, Clock, MapPin, 
  ChevronRight, Heart, CheckCircle, Truck, Shield,
  Zap, Flame, Leaf, Sparkles, Award, Coffee, Pizza,
  Sandwich, Salad, Cake, ChefHat, ThumbsUp,
  TrendingUp, ShoppingBag, Navigation, 
  Users, Crown, Rocket, Percent, Tag, ArrowRight,
  X, UtensilsCrossed, IceCream, Coffee as CoffeeIcon,
  Loader, IndianRupee
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RestaurantsPage = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get currency symbol from environment variables
  const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Fetch restaurants from backend
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/Restaurants`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      
      const data = await response.json();
      
      // Transform backend data to match frontend format
      const transformedData = data.map(restaurant => ({
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description || "Authentic cuisine restaurant",
        address: restaurant.address || "Location available",
        cuisine: restaurant.cuisine || "Various Cuisine",
        rating: restaurant.rating || 4.5,
        reviewCount: restaurant.reviewCount || Math.floor(Math.random() * 1000) + 100,
        deliveryTime: restaurant.deliveryTime || "25-35 min",
        deliveryFee: restaurant.deliveryFee ? `${currencySymbol}${restaurant.deliveryFee}` : `${currencySymbol}2.99`,
        minOrder: restaurant.minOrder ? `${currencySymbol}${restaurant.minOrder}` : `${currencySymbol}15`,
        tags: restaurant.tags || ["Fresh", "Quality"],
        priceRange: restaurant.priceRange || "₹₹",
        distance: restaurant.distance || "1.2 km",
        featured: restaurant.featured || false,
        offers: restaurant.offers || ["Special Offer"],
        color: getRandomColor(),
        trending: restaurant.trending || false,
        chefChoice: restaurant.chefChoice || false,
        healthy: restaurant.healthy || false,
        spicy: restaurant.spicy || false,
        isOpen: restaurant.isOpen !== undefined ? restaurant.isOpen : true,
        image: restaurant.image,
        ownerId: restaurant.ownerId
      }));
      
      setRestaurants(transformedData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get random color for cards
  const getRandomColor = () => {
    const colors = [
      "from-orange-100 to-red-100",
      "from-amber-100 to-yellow-100",
      "from-blue-50 to-teal-50",
      "from-emerald-50 to-green-50",
      "from-red-50 to-orange-50",
      "from-pink-50 to-rose-50",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Toggle favorite restaurant
  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  // Navigate to restaurant menu - FIXED: using 'restaurant' not 'resturent'
  const viewMenu = (restaurantId) => {
    router.push(`/Restaurants/${restaurantId}`);
  };

  // Categories with Lucide icons only (no emojis)
  const categories = [
    { id: 'all', label: 'All', count: restaurants.length, lucideIcon: UtensilsCrossed },
    { id: 'fast-food', label: 'Fast Food', count: 12, lucideIcon: Sandwich },
    { id: 'italian', label: 'Italian', count: 8, lucideIcon: Pizza },
    { id: 'asian', label: 'Asian', count: 10, lucideIcon: UtensilsCrossed },
    { id: 'indian', label: 'Indian', count: 6, lucideIcon: Flame },
    { id: 'vegetarian', label: 'Veg', count: 5, lucideIcon: Leaf },
    { id: 'dessert', label: 'Desserts', count: 4, lucideIcon: IceCream },
    { id: 'coffee', label: 'Cafés', count: 7, lucideIcon: CoffeeIcon },
  ];

  // Price ranges with rupee symbol
  const priceRanges = [
    { id: 'all', label: 'All Price', icon: IndianRupee },
    { id: 'low', label: `${currencySymbol}`, description: 'Budget', icon: IndianRupee },
    { id: 'medium', label: `${currencySymbol}${currencySymbol}`, description: 'Moderate', icon: IndianRupee },
    { id: 'high', label: `${currencySymbol}${currencySymbol}${currencySymbol}`, description: 'Premium', icon: Crown },
  ];

  // Sort options
  const sortOptions = [
    { id: 'recommended', label: 'Recommended', icon: ThumbsUp },
    { id: 'rating', label: 'Highest Rated', icon: Star },
    { id: 'delivery-time', label: 'Fastest Delivery', icon: Rocket },
    { id: 'price-low', label: `Price: Low to High`, icon: IndianRupee },
    { id: 'price-high', label: `Price: High to Low`, icon: TrendingUp },
  ];

  // Filter restaurants based on selections
  const filteredRestaurants = restaurants.filter(restaurant => {
    if (selectedCategory !== 'all' && !restaurant.cuisine.toLowerCase().includes(selectedCategory)) {
      return false;
    }
    
    if (priceFilter !== 'all') {
      if (priceFilter === 'low' && restaurant.priceRange !== currencySymbol) return false;
      if (priceFilter === 'medium' && restaurant.priceRange !== `${currencySymbol}${currencySymbol}`) return false;
      if (priceFilter === 'high' && restaurant.priceRange !== `${currencySymbol}${currencySymbol}${currencySymbol}`) return false;
    }
    
    if (ratingFilter > 0 && restaurant.rating < ratingFilter) {
      return false;
    }
    
    if (searchQuery && !restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Sort restaurants
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'delivery-time':
        return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
      case 'price-low':
        return a.priceRange.length - b.priceRange.length;
      case 'price-high':
        return b.priceRange.length - a.priceRange.length;
      default:
        return 0;
    }
  });

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading restaurants...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="bg-white min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load restaurants</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchRestaurants}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      {/* Main Container with White Background */}
      <div className="bg-white min-h-screen">
        {/* Hero Section - Colorful Gradient */}
        <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 py-10 md:py-16 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white/90" />
                <span className="text-white/90 font-medium text-sm md:text-base">Discover & Order</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                Taste the <span className="text-yellow-200">Best</span> Restaurants<br className="hidden xs:block" />
                in Your <span className="text-yellow-200">City</span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto md:mx-0">
                From sizzling street food to gourmet dining experiences. 
                Fresh, fast, and delivered to your door.
              </p>
              
              {/* Quick Stats - Scrollable on mobile */}
              <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-start gap-4 mb-6 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 flex-shrink-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg md:rounded-xl flex items-center justify-center">
                    <Truck className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="font-bold text-xl md:text-2xl text-white">30min</div>
                    <div className="text-xs md:text-sm text-white/80">Avg. Delivery</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 flex-shrink-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg md:rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-xl md:text-2xl text-white">{restaurants.length}+</div>
                    <div className="text-xs md:text-sm text-white/80">Restaurants</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 flex-shrink-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg md:rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div>
                    <div className="font-bold text-xl md:text-2xl text-white">4.8</div>
                    <div className="text-xs md:text-sm text-white/80">Avg. Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Offers Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
            <div className="flex flex-nowrap md:flex-wrap gap-3 justify-start md:justify-center overflow-x-auto no-scrollbar">
              {[
                { icon: Percent, text: "50% OFF First Order", bgColor: "bg-red-50", textColor: "text-red-700", iconColor: "text-red-600" },
                { icon: Truck, text: "Free Delivery", bgColor: "bg-green-50", textColor: "text-green-700", iconColor: "text-green-600" },
                { icon: Star, text: "Top Rated", bgColor: "bg-yellow-50", textColor: "text-yellow-700", iconColor: "text-yellow-600" },
                { icon: Zap, text: "Fast Delivery", bgColor: "bg-blue-50", textColor: "text-blue-700", iconColor: "text-blue-600" },
              ].map((offer, index) => (
                <div key={index} className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 ${offer.bgColor} rounded-full border border-gray-100 shadow-sm flex-shrink-0`}>
                  <offer.icon className={`w-3 h-3 md:w-4 md:h-4 ${offer.iconColor}`} />
                  <span className={`text-xs md:text-sm font-semibold whitespace-nowrap ${offer.textColor}`}>{offer.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 bg-white">
          {/* Search and Filter Bar */}
          <div className="mb-8 md:mb-12 bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 md:p-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6 justify-between items-start lg:items-center">
              {/* Categories */}
              <div className="w-full overflow-x-auto pb-2 no-scrollbar">
                <div className="flex gap-2 md:gap-3">
                  {categories.map((category) => {
                    const IconComponent = category.lucideIcon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex flex-col items-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-3 rounded-xl whitespace-nowrap transition-all duration-300 min-w-[80px] md:min-w-[100px] ${
                          selectedCategory === category.id
                            ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-md'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                        }`}
                      >
                        <div className={`p-2 md:p-3 rounded-full ${
                          selectedCategory === category.id
                            ? 'bg-white/20'
                            : 'bg-white shadow-sm'
                        }`}>
                          <IconComponent className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 ${
                            selectedCategory === category.id
                              ? 'text-white'
                              : 'text-gray-600'
                          }`} />
                        </div>
                        <span className="font-semibold text-xs md:text-sm">{category.label}</span>
                        <span className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full ${
                          selectedCategory === category.id
                            ? 'bg-white/20'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {category.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort and Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                {/* Search */}
                <div className="relative flex-1 lg:flex-none lg:w-80">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl blur-sm opacity-20"></div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search restaurants..."
                      className="w-full pl-9 md:pl-12 pr-9 md:pr-12 py-2.5 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-white"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <div className="w-6 h-6 md:w-7 md:h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                          <X className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Filter Toggle - Mobile Only */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all text-sm"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="font-medium">Filters</span>
                    {(priceFilter !== 'all' || ratingFilter > 0) && (
                      <span className="w-5 h-5 bg-white text-red-600 text-xs rounded-full flex items-center justify-center">
                        {(priceFilter !== 'all' ? 1 : 0) + (ratingFilter > 0 ? 1 : 0)}
                      </span>
                    )}
                  </button>

                  {/* Sort Dropdown */}
                  <div className="relative group flex-1 sm:flex-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-transparent py-2.5 md:py-3 pl-3 md:pl-4 pr-10 md:pr-12 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <div className="w-6 h-6 md:w-7 md:h-7 bg-gray-100 rounded-full flex items-center justify-center">
                          <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-500 rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Panel (Mobile) */}
            {showFilters && (
              <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowFilters(false)}>
                <div className="absolute inset-0 bg-black/50" />
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Filter Options</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Price Range */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-green-500" />
                        Price Range
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {priceRanges.map((range) => {
                          const IconComponent = range.icon;
                          return (
                            <button
                              key={range.id}
                              onClick={() => setPriceFilter(range.id)}
                              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                                priceFilter === range.id
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <IconComponent className={`w-6 h-6 mb-2 ${
                                priceFilter === range.id ? 'text-red-600' : 'text-gray-600'
                              }`} />
                              <span className="font-bold text-lg">{range.label}</span>
                              {range.description && (
                                <span className="text-xs text-gray-500 mt-1">{range.description}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        Minimum Rating
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setRatingFilter(ratingFilter === rating ? 0 : rating)}
                            className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                              ratingFilter === rating
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-0.5 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-2.5 h-2.5 ${
                                    i < Math.floor(rating)
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className={`font-bold text-sm ${
                              ratingFilter === rating ? 'text-red-600' : 'text-gray-700'
                            }`}>
                              {rating}+
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => {
                        setPriceFilter('all');
                        setRatingFilter(0);
                      }}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-red-500 hover:text-red-600 transition-colors text-sm"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all text-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Sidebar Filters (Desktop) */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-28 space-y-6">
                {/* Price Filter Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <IndianRupee className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">Price Range</h3>
                  </div>
                  <div className="space-y-3">
                    {priceRanges.map((range) => {
                      const IconComponent = range.icon;
                      return (
                        <button
                          key={range.id}
                          onClick={() => setPriceFilter(range.id)}
                          className={`flex items-center justify-between w-full p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                            priceFilter === range.id
                              ? 'bg-gradient-to-r from-red-50 to-orange-50 text-red-600 border-2 border-red-200'
                              : 'hover:bg-gray-50 text-gray-700 border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${
                              priceFilter === range.id
                                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <div className="font-semibold">{range.label}</div>
                              {range.description && (
                                <div className="text-sm text-gray-500">{range.description}</div>
                              )}
                            </div>
                          </div>
                          {priceFilter === range.id && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rating Filter Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-white fill-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">Ratings</h3>
                  </div>
                  <div className="space-y-3">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setRatingFilter(ratingFilter === rating ? 0 : rating)}
                        className={`flex items-center justify-between w-full p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                          ratingFilter === rating
                            ? 'bg-gradient-to-r from-yellow-50 to-amber-50 text-amber-600 border-2 border-yellow-200'
                            : 'hover:bg-gray-50 text-gray-700 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${
                            ratingFilter === rating
                              ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <Star className="w-5 h-5" />
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(rating)
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-semibold">{rating}+</span>
                          </div>
                        </div>
                        {ratingFilter === rating && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features Filter Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">Features</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Free Delivery', icon: Truck, color: 'from-green-500 to-emerald-500' },
                      { label: 'Top Rated', icon: Star, color: 'from-yellow-500 to-amber-500' },
                      { label: 'Fast Delivery', icon: Rocket, color: 'from-blue-500 to-cyan-500' },
                      { label: 'Vegetarian', icon: Leaf, color: 'from-emerald-500 to-green-500' },
                    ].map((feature) => (
                      <button
                        key={feature.label}
                        className="flex items-center gap-4 w-full p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                      >
                        <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-medium text-gray-700">{feature.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Restaurant Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="mb-6 md:mb-8 bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg md:rounded-xl flex items-center justify-center">
                        <ChefHat className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                          {sortedRestaurants.length} Amazing Restaurants
                        </h2>
                        <p className="text-xs md:text-sm text-gray-600 flex items-center gap-1 flex-wrap">
                          <Navigation className="w-3 h-3 md:w-4 md:h-4" />
                          {selectedCategory !== 'all' && `in ${categories.find(c => c.id === selectedCategory)?.label} • `}
                          {priceFilter !== 'all' && `${priceRanges.find(p => p.id === priceFilter)?.description} • `}
                          {ratingFilter > 0 && `Rating ${ratingFilter}+`}
                          {selectedCategory === 'all' && priceFilter === 'all' && ratingFilter === 0 && 'All available near you'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg md:rounded-xl hover:from-red-600 hover:to-orange-600 hover:shadow-lg transition-all duration-300 text-sm md:text-base w-full md:w-auto">
                    <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                    <span>View All Deals</span>
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
              </div>

              {/* Restaurant Grid - Cards */}
              {sortedRestaurants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {sortedRestaurants.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      className="group bg-white rounded-xl md:rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-red-200 transition-all duration-300"
                    >
                      {/* Restaurant Image Header */}
                      <div className="relative h-40 sm:h-48 md:h-52 lg:h-56 overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${restaurant.color}`} />
                        
                        {/* Featured Badge */}
                        {restaurant.featured && (
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] md:text-xs font-bold px-2.5 md:px-4 py-1 md:py-2 rounded-full shadow-lg flex items-center gap-1">
                            <Award className="w-2.5 h-2.5 md:w-3 md:h-3" />
                            <span>Featured</span>
                          </div>
                        )}
                        
                        {/* Open/Closed Badge */}
                        {!restaurant.isOpen && (
                          <div className="absolute top-3 left-3 bg-gray-800/90 text-white text-[10px] md:text-xs font-bold px-2.5 md:px-4 py-1 md:py-2 rounded-full shadow-lg">
                            Closed
                          </div>
                        )}
                        
                        {/* Favorite Button */}
                        <button
                          onClick={() => toggleFavorite(restaurant.id)}
                          className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg"
                        >
                          <Heart
                            className={`w-4 h-4 md:w-5 md:h-5 transition-all ${
                              favorites.has(restaurant.id)
                                ? 'text-red-500 fill-red-500 scale-110'
                                : 'text-gray-400 group-hover:text-red-400'
                            }`}
                          />
                        </button>
                        
                        {/* Offers */}
                        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
                          {restaurant.offers.map((offer, index) => (
                            <div
                              key={index}
                              className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg"
                            >
                              {offer}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Restaurant Info */}
                      <div className="p-4 md:p-5 lg:p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-base md:text-lg lg:text-xl text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                              {restaurant.name}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                              <ChefHat className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                              <span className="line-clamp-1">{restaurant.cuisine}</span>
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 md:gap-2 bg-gradient-to-r from-yellow-50 to-amber-50 px-2 md:px-3 py-1 md:py-2 rounded-lg">
                              <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-bold text-sm md:text-base">{restaurant.rating}</span>
                              <span className="text-gray-500 text-[10px] md:text-xs">({restaurant.reviewCount})</span>
                            </div>
                            <div className="mt-1 text-[10px] md:text-xs text-gray-500 flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3" />
                              {restaurant.distance}
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {restaurant.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-[10px] md:text-xs px-2 md:px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Delivery Info */}
                        <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4">
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-2 md:p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                <Clock className="w-4 h-4 md:w-5 md:h-5 text-white" />
                              </div>
                              <div>
                                <div className="text-[10px] md:text-xs text-gray-500">Delivery</div>
                                <div className="font-semibold text-xs md:text-sm text-gray-900">{restaurant.deliveryTime}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-2 md:p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                <IndianRupee className="w-4 h-4 md:w-5 md:h-5 text-white" />
                              </div>
                              <div>
                                <div className="text-[10px] md:text-xs text-gray-500">Fee</div>
                                <div className="font-semibold text-xs md:text-sm text-gray-900">{restaurant.deliveryFee}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Button - FIXED NAVIGATION */}
                        <button 
                          onClick={() => viewMenu(restaurant.id)}
                          disabled={!restaurant.isOpen}
                          className={`group/btn w-full py-2.5 md:py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-sm md:text-base rounded-lg md:rounded-xl transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2 ${
                            !restaurant.isOpen ? 'opacity-50 cursor-not-allowed' : 'hover:from-red-600 hover:to-orange-600'
                          }`}
                        >
                          <span>{restaurant.isOpen ? 'View Menu' : 'Closed'}</span>
                          {restaurant.isOpen && <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:translate-x-1 transition-transform" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 md:py-16 bg-white rounded-xl md:rounded-2xl border-2 border-dashed border-gray-300">
                  <div className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <Search className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-gray-400" />
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-700 mb-2">No restaurants found</h3>
                  <p className="text-sm md:text-base text-gray-500 mb-6 max-w-md mx-auto px-4">
                    Try adjusting your search or filters. We have many amazing restaurants waiting for you!
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setPriceFilter('all');
                      setRatingFilter(0);
                      setSearchQuery('');
                    }}
                    className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-sm md:text-base rounded-xl hover:from-red-600 hover:to-orange-600 hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <Filter className="w-4 h-4 md:w-5 md:h-5" />
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Load More */}
              {sortedRestaurants.length > 0 && (
                <div className="text-center mt-8 md:mt-12">
                  <button className="group px-6 md:px-10 py-3 md:py-4 border-2 border-gray-300 text-gray-700 font-bold text-sm md:text-base rounded-xl hover:border-red-500 hover:text-red-600 hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto">
                    <span>Load More</span>
                    <div className="w-6 h-6 md:w-7 md:h-7 bg-gray-100 group-hover:bg-red-50 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:text-red-600 transition-colors" />
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Promotion Banner */}
          <div className="mt-12 md:mt-16 relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 p-6 md:p-10 text-white">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Percent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold">Limited Time Offer!</h3>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-3">Get 50% OFF Your First Order!</h3>
                <p className="text-white/90 mb-4 text-sm md:text-base lg:text-lg">
                  Use code: <span className="font-black text-yellow-200">WELCOME50</span> • Valid for new users only
                </p>
                <button className="group px-6 md:px-8 py-3 md:py-4 bg-white text-red-600 font-bold text-sm md:text-base rounded-xl hover:bg-gray-100 hover:shadow-2xl transition-all duration-300 flex items-center gap-2 mx-auto lg:mx-0">
                  <span>Claim Your Deal Now</span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black">{restaurants.length}+</div>
                  <div className="text-[10px] md:text-xs lg:text-sm text-white/80">Restaurants</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
                    <Rocket className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black">30min</div>
                  <div className="text-[10px] md:text-xs lg:text-sm text-white/80">Avg. Delivery</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white fill-white" />
                  </div>
                  <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black">4.8★</div>
                  <div className="text-[10px] md:text-xs lg:text-sm text-white/80">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
};

export default RestaurantsPage;