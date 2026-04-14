"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { 
  FiShoppingCart, 
  FiMapPin, 
  FiCreditCard, 
  FiCheckCircle,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiTruck,
  FiHome,
  FiPhone,
  FiUser,
  FiArrowLeft,
  FiArrowRight,
  FiAlertCircle,
  FiTag,
  FiDollarSign,
  FiClock,
  FiShield,
  FiStar,
  FiGift
} from 'react-icons/fi';
import { FaMoneyBillWave, FaRupeeSign } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const steps = ['Cart Review', 'Delivery Details', 'Payment', 'Confirmation'];

// Format price in Indian Rupees
const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const CheckoutPage = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // Cart state from API
  const [cartItems, setCartItems] = useState([]);

  // Promo code state
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [availableOffers, setAvailableOffers] = useState([]);
  const [showOffers, setShowOffers] = useState(false);

  // Delivery state (matches controller fields)
  const [deliveryDetails, setDeliveryDetails] = useState({
    deliveryAddress: '',
    contactNumber: '',
    contactName: ''
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    upiId: ''
  });

  // Validation errors
  const [validationErrors, setValidationErrors] = useState({});

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const currencySymbol = '₹';

  // Get auth token from localStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Get cart ID from localStorage
  const getCartId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cartId');
    }
    return null;
  };

  // Get user ID from localStorage
  const getUserId = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          return JSON.parse(user).id;
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  };

  // Get user data
  const getUserData = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          return JSON.parse(user);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  };

  // Load promo code from session storage
  const loadPromoCode = () => {
    if (typeof window !== 'undefined') {
      const savedPromo = sessionStorage.getItem('appliedPromo');
      const savedDiscount = sessionStorage.getItem('promoDiscount');
      
      if (savedPromo && savedDiscount) {
        try {
          setAppliedPromo(JSON.parse(savedPromo));
          setPromoDiscount(parseFloat(savedDiscount));
        } catch (e) {
          console.error('Error loading promo code:', e);
        }
      }
    }
  };

  // Save promo code to session storage
  const savePromoCode = (promo, discount) => {
    if (typeof window !== 'undefined') {
      if (promo && discount) {
        sessionStorage.setItem('appliedPromo', JSON.stringify(promo));
        sessionStorage.setItem('promoDiscount', discount.toString());
      } else {
        sessionStorage.removeItem('appliedPromo');
        sessionStorage.removeItem('promoDiscount');
      }
    }
  };

  // Fetch available offers
  const fetchAvailableOffers = async () => {
    try {
      const response = await fetch(`${apiUrl}/offers`);
      if (response.ok) {
        const result = await response.json();
        setAvailableOffers(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
    }
  };

  useEffect(() => {
    const token = getAuthToken();
    setAuthToken(token);
    
    loadPromoCode();
    fetchAvailableOffers();
    
    const user = getUserData();
    if (user) {
      setDeliveryDetails(prev => ({
        ...prev,
        contactName: user.name || '',
        contactNumber: user.phone || '',
        deliveryAddress: user.address || ''
      }));
    }
    
    fetchCart();
  }, []);

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const cartId = getCartId();
      if (!cartId) {
        setCartItems([]);
        setInitialLoading(false);
        return;
      }

      const response = await fetch(`${apiUrl}/Cart/${cartId}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      
      const data = await response.json();
      setCartItems(data.items || data || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart items');
    } finally {
      setInitialLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const response = await fetch(`${apiUrl}/Cart/update/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (!response.ok) throw new Error('Failed to update quantity');
      
      await fetchCart();
      
      if (appliedPromo) {
        setAppliedPromo(null);
        setPromoDiscount(0);
        savePromoCode(null, null);
      }
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update cart');
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`${apiUrl}/Cart/delete/${itemId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to remove item');
      
      await fetchCart();
      
      if (appliedPromo) {
        setAppliedPromo(null);
        setPromoDiscount(0);
        savePromoCode(null, null);
      }
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item');
    }
  };

  // Validate promo code
  const validatePromoCode = (code) => {
    const subtotal = calculateSubtotal();
    const offer = availableOffers.find(o => o.couponCode?.toUpperCase() === code.toUpperCase());
    
    if (!offer) {
      return { valid: false, message: 'Invalid promo code' };
    }
    
    if (!offer.isActive) {
      return { valid: false, message: 'This promo code has expired' };
    }
    
    const now = new Date();
    if (offer.validFrom && now < new Date(offer.validFrom)) {
      return { valid: false, message: 'This offer has not started yet' };
    }
    if (offer.validTo && now > new Date(offer.validTo)) {
      return { valid: false, message: 'This offer has expired' };
    }
    
    if (offer.minOrderAmount && subtotal < Number(offer.minOrderAmount)) {
      return { 
        valid: false, 
        message: `Minimum order amount of ${formatINR(offer.minOrderAmount)} required` 
      };
    }
    
    let discount = (subtotal * Number(offer.discountPercent)) / 100;
    if (offer.maxDiscount && discount > Number(offer.maxDiscount)) {
      discount = Number(offer.maxDiscount);
    }
    
    return { 
      valid: true, 
      discount, 
      offer,
      message: `Promo code applied! ${offer.discountPercent}% OFF` 
    };
  };

  // Apply promo code
  const applyPromoCode = () => {
    setPromoError('');
    
    if (!promoCodeInput.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }
    
    const validation = validatePromoCode(promoCodeInput);
    
    if (validation.valid) {
      setPromoDiscount(validation.discount);
      setAppliedPromo(validation.offer);
      setPromoSuccess(true);
      setPromoError('');
      setShowPromoInput(false);
      setPromoCodeInput('');
      
      savePromoCode(validation.offer, validation.discount);
      
      setTimeout(() => setPromoSuccess(false), 3000);
    } else {
      setPromoError(validation.message);
    }
  };

  // Remove promo code
  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    savePromoCode(null, null);
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.Dish?.price || item.price || 0) * item.quantity, 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.05;
  };

  const calculateDeliveryFee = (subtotal) => {
    return subtotal > 500 ? 0 : 40;
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = calculateDeliveryFee(subtotal);
  const tax = calculateTax(subtotal - promoDiscount);
  const total = subtotal + deliveryFee + tax - promoDiscount;

  // Handle delivery details change
  const handleDeliveryChange = (e) => {
    setDeliveryDetails({
      ...deliveryDetails,
      [e.target.name]: e.target.value
    });
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      });
    }
  };

  // Handle payment details change
  const handlePaymentChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value
    });
  };

  // Validate delivery details
  const validateDeliveryDetails = () => {
    const errors = {};
    if (!deliveryDetails.deliveryAddress) errors.deliveryAddress = 'Delivery address is required';
    if (!deliveryDetails.contactNumber) errors.contactNumber = 'Contact number is required';
    if (!deliveryDetails.contactName) errors.contactName = 'Contact name is required';
    
    if (deliveryDetails.contactNumber && !/^[6-9]\d{9}$/.test(deliveryDetails.contactNumber)) {
      errors.contactNumber = 'Please enter a valid 10-digit Indian mobile number';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate payment details
  const validatePaymentDetails = () => {
    if (paymentMethod === 'card' || paymentMethod === 'debit') {
      const errors = {};
      if (!paymentDetails.cardNumber) errors.cardNumber = 'Card number is required';
      if (!paymentDetails.cardName) errors.cardName = 'Name on card is required';
      if (!paymentDetails.expiry) errors.expiry = 'Expiry date is required';
      if (!paymentDetails.cvv) errors.cvv = 'CVV is required';
      
      if (paymentDetails.cardNumber && !/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s/g, ''))) {
        errors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      if (paymentDetails.expiry && !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(paymentDetails.expiry)) {
        errors.expiry = 'Please enter a valid expiry date (MM/YY)';
      }
      if (paymentDetails.cvv && !/^\d{3}$/.test(paymentDetails.cvv)) {
        errors.cvv = 'Please enter a valid 3-digit CVV';
      }
      
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    }
    
    if (paymentMethod === 'upi') {
      if (!paymentDetails.upiId) {
        setValidationErrors({ upiId: 'UPI ID is required' });
        return false;
      }
      if (!/^[\w\.\-]+@[\w\.\-]+$/.test(paymentDetails.upiId)) {
        setValidationErrors({ upiId: 'Please enter a valid UPI ID' });
        return false;
      }
    }
    
    return true;
  };

  // Handle next step
  const handleNext = () => {
    setError('');
    
    if (activeStep === 0) {
      if (cartItems.length === 0) {
        setError('Your cart is empty');
        return;
      }
    } else if (activeStep === 1) {
      if (!validateDeliveryDetails()) {
        setError('Please fill in all required delivery details');
        return;
      }
    } else if (activeStep === 2) {
      if (!validatePaymentDetails()) {
        setError('Please fill in all payment details correctly');
        return;
      }
    }

    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  // Place order - matches controller fields exactly
  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const cartId = getCartId();
      if (!cartId) {
        throw new Error('Cart not found');
      }

      const restaurantId = cartItems[0]?.Dish?.restaurantId || cartItems[0]?.restaurantId;
      if (!restaurantId) {
        throw new Error('Restaurant information missing');
      }

      const userId = getUserId();
      const token = getAuthToken();

      // Format items exactly as controller expects
      const items = cartItems.map(item => ({
        dishId: item.dishId,
        quantity: item.quantity,
        price: item.Dish?.price || item.price || 0
      }));

      // Prepare order data matching controller fields
      const orderData = {
        items: items,
        restaurantId: restaurantId,
        deliveryAddress: deliveryDetails.deliveryAddress,
        couponCode: appliedPromo?.couponCode || null
      };

      console.log('Sending order data:', orderData);

      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(orderData)
      });

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        let errorMessage = 'Failed to place order';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = responseText || `Server responded with ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      let order;
      try {
        order = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Invalid response from server');
      }
      
      setCreatedOrder(order.order || order);
      setOrderSuccess(true);
      
      localStorage.removeItem('cartId');
      savePromoCode(null, null);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cartUpdated'));
      }
      
      setActiveStep(steps.length);
      
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading checkout...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Cart Review Step
  const renderCartReview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FiShoppingCart className="text-xl" />
              Review Your Items
            </h3>
          </div>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShoppingCart className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-500">Your cart is empty</p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-20 h-20 flex-shrink-0 relative rounded-xl overflow-hidden shadow-md">
                      {item.Dish?.image ? (
                        <img
                          src={`${apiUrl.replace('/api', '')}/uploads/${item.Dish.image}`}
                          alt={item.Dish.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">🍽️</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-gray-800 text-lg">{item.Dish?.name || 'Unknown Dish'}</h4>
                      <p className="text-sm text-gray-500 mt-1">{formatINR(item.Dish?.price || item.price || 0)} each</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus className="text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button 
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center hover:shadow-md transition-all"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <FiPlus className="text-white" />
                      </button>
                    </div>
                    <div className="text-right min-w-[100px]">
                      <span className="font-bold text-orange-600 text-lg">
                        {formatINR((item.Dish?.price || item.price || 0) * item.quantity)}
                      </span>
                    </div>
                    <button 
                      className="text-red-400 hover:text-red-600 p-2 transition-colors"
                      onClick={() => removeItem(item.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-lg sticky top-24 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
            <h3 className="text-lg font-semibold text-white">Order Summary</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  <FiTruck className="text-gray-400" />
                  Delivery Fee
                </span>
                {deliveryFee === 0 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  <span>{formatINR(deliveryFee)}</span>
                )}
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (5%)</span>
                <span>{formatINR(tax)}</span>
              </div>
              
              {appliedPromo && promoDiscount > 0 && (
                <div className="flex justify-between text-green-600 pt-2 border-t border-gray-200">
                  <span className="flex items-center gap-1">
                    <FiTag className="text-green-500" />
                    Discount ({appliedPromo.discountPercent}% OFF)
                  </span>
                  <span>-{formatINR(promoDiscount)}</span>
                </div>
              )}
            </div>
            
            {subtotal < 500 && subtotal > 0 && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-3 mb-4">
                <p className="text-sm text-orange-700 flex items-center gap-2">
                  <FiAlertCircle className="flex-shrink-0" />
                  Add {formatINR(500 - subtotal)} more for FREE delivery
                </p>
              </div>
            )}
            
            {/* Promo Code Section */}
            {!appliedPromo ? (
              <div className="mb-4">
                {showPromoInput ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <button
                        onClick={applyPromoCode}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm rounded-lg hover:shadow-md transition-all"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && <p className="text-xs text-red-500">{promoError}</p>}
                    <button
                      onClick={() => setShowPromoInput(false)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowPromoInput(true)}
                      className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      <FiTag className="w-4 h-4" />
                      Have a promo code?
                    </button>
                    
                    {availableOffers.length > 0 && (
                      <button
                        onClick={() => setShowOffers(!showOffers)}
                        className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        <FiGift className="w-4 h-4" />
                        View Available Offers ({availableOffers.length})
                      </button>
                    )}
                  </div>
                )}
                
                {showOffers && !appliedPromo && (
                  <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Available Offers:</p>
                    {availableOffers.filter(o => o.isActive).map((offer) => (
                      <div key={offer.id} className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800">{offer.title}</p>
                            <p className="text-xs text-orange-600 font-medium">{offer.discountPercent}% OFF</p>
                            <p className="text-xs text-gray-500">Min order: {formatINR(offer.minOrderAmount || 199)}</p>
                          </div>
                          <button
                            onClick={() => {
                              setPromoCodeInput(offer.couponCode);
                              applyPromoCode();
                            }}
                            className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-lg hover:shadow-md transition-all"
                          >
                            Apply
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Code: {offer.couponCode}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-green-700 flex items-center gap-1">
                    <FiCheckCircle className="text-green-600" />
                    {appliedPromo.title || 'Promo'} applied!
                  </span>
                  <p className="text-xs text-green-600">Code: {appliedPromo.couponCode}</p>
                </div>
                <button
                  onClick={removePromoCode}
                  className="text-green-700 hover:text-green-800"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-800 text-lg">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    {formatINR(total)}
                  </span>
                  {appliedPromo && (
                    <p className="text-xs text-green-600">You saved {formatINR(promoDiscount)}</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500">Including all taxes</p>
            </div>

            {cartItems[0]?.Dish?.restaurant && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-center gap-2 text-gray-600">
                <FiHome className="text-gray-400" />
                <span className="text-sm">{cartItems[0].Dish.restaurant.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Delivery Details Step
  const renderDeliveryDetails = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiMapPin className="text-xl" />
            Delivery Address
          </h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <FiHome className="text-orange-500" />
                Delivery Address *
              </label>
              <textarea
                name="deliveryAddress"
                rows="3"
                className={`w-full px-4 py-3 rounded-xl border ${
                  validationErrors.deliveryAddress ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none`}
                value={deliveryDetails.deliveryAddress}
                onChange={handleDeliveryChange}
                placeholder="Enter your complete delivery address"
              />
              {validationErrors.deliveryAddress && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.deliveryAddress}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <FiUser className="text-orange-500" />
                  Contact Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    validationErrors.contactName ? 'border-red-500' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
                  value={deliveryDetails.contactName}
                  onChange={handleDeliveryChange}
                  placeholder="Your full name"
                />
                {validationErrors.contactName && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.contactName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <FiPhone className="text-orange-500" />
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    validationErrors.contactNumber ? 'border-red-500' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
                  value={deliveryDetails.contactNumber}
                  onChange={handleDeliveryChange}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                />
                {validationErrors.contactNumber && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.contactNumber}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Payment Step
  const renderPayment = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiCreditCard className="text-xl" />
            Payment Method
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
              paymentMethod === 'card' 
                ? 'border-orange-500 bg-orange-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <FiCreditCard className={`text-2xl ${paymentMethod === 'card' ? 'text-orange-500' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-orange-500' : 'text-gray-600'}`}>
                  Credit Card
                </span>
              </div>
            </label>
            
            <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
              paymentMethod === 'debit' 
                ? 'border-orange-500 bg-orange-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="debit"
                checked={paymentMethod === 'debit'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <FiCreditCard className={`text-2xl ${paymentMethod === 'debit' ? 'text-orange-500' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${paymentMethod === 'debit' ? 'text-orange-500' : 'text-gray-600'}`}>
                  Debit Card
                </span>
              </div>
            </label>
            
            <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
              paymentMethod === 'upi' 
                ? 'border-orange-500 bg-orange-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <span className={`text-2xl font-bold ${paymentMethod === 'upi' ? 'text-orange-500' : 'text-gray-400'}`}>UPI</span>
                <span className={`text-sm font-medium ${paymentMethod === 'upi' ? 'text-orange-500' : 'text-gray-600'}`}>
                  UPI
                </span>
              </div>
            </label>
            
            <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
              paymentMethod === 'cash' 
                ? 'border-orange-500 bg-orange-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <FaMoneyBillWave className={`text-2xl ${paymentMethod === 'cash' ? 'text-orange-500' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${paymentMethod === 'cash' ? 'text-orange-500' : 'text-gray-600'}`}>
                  Cash on Delivery
                </span>
              </div>
            </label>
          </div>
          
          {(paymentMethod === 'card' || paymentMethod === 'debit') && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                <input
                  type="text"
                  name="cardNumber"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    validationErrors.cardNumber ? 'border-red-500' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
                  value={paymentDetails.cardNumber}
                  onChange={handlePaymentChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
                {validationErrors.cardNumber && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.cardNumber}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card *</label>
                <input
                  type="text"
                  name="cardName"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    validationErrors.cardName ? 'border-red-500' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
                  value={paymentDetails.cardName}
                  onChange={handlePaymentChange}
                  placeholder="John Doe"
                />
                {validationErrors.cardName && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.cardName}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                  <input
                    type="text"
                    name="expiry"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      validationErrors.expiry ? 'border-red-500' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
                    value={paymentDetails.expiry}
                    onChange={handlePaymentChange}
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                  {validationErrors.expiry && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.expiry}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                  <input
                    type="password"
                    name="cvv"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      validationErrors.cvv ? 'border-red-500' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
                    value={paymentDetails.cvv}
                    onChange={handlePaymentChange}
                    placeholder="123"
                    maxLength="3"
                  />
                  {validationErrors.cvv && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.cvv}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {paymentMethod === 'upi' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID *</label>
                <input
                  type="text"
                  name="upiId"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    validationErrors.upiId ? 'border-red-500' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
                  value={paymentDetails.upiId}
                  onChange={handlePaymentChange}
                  placeholder="username@okhdfcbank"
                />
                {validationErrors.upiId && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.upiId}</p>
                )}
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 flex items-start gap-3">
                <span className="text-blue-500 text-xl">📱</span>
                <p className="text-sm text-blue-700">
                  You will receive a payment request on your UPI app to complete the transaction.
                </p>
              </div>
            </div>
          )}
          
          {paymentMethod === 'cash' && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 flex items-start gap-3">
              <FaMoneyBillWave className="text-green-500 text-xl flex-shrink-0 mt-1" />
              <p className="text-sm text-green-700">
                Pay with cash when your order is delivered. Please have exact change if possible.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Confirmation Step
  const renderConfirmation = () => (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <FiCheckCircle className="text-white text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed! 🎉</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your order. Your order has been placed successfully.
        </p>
        
        {createdOrder && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Order #{createdOrder.id}</h3>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full shadow-md">
              <FiTruck />
              <span className="text-sm font-medium">Preparing your order</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Total: {formatINR(createdOrder.totalAmount || total)}
            </p>
            {appliedPromo && (
              <p className="text-xs text-green-600 mt-1">
                Promo savings: {formatINR(promoDiscount)}
              </p>
            )}
          </div>
        )}
        
        <p className="text-sm text-gray-500 mb-6">
          You will receive an email confirmation shortly. Track your order in the Orders page.
        </p>
        
        <div className="space-y-3">
          <Link href="/orders" className="block w-full">
            <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all">
              View My Orders
            </button>
          </Link>
          
          <Link href="/" className="block w-full">
            <button className="w-full border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );

  // Get step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderCartReview();
      case 1:
        return renderDeliveryDetails();
      case 2:
        return renderPayment();
      case 3:
        return renderConfirmation();
      default:
        return 'Unknown step';
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-8">
            Checkout
          </h1>
          
          {/* Stepper */}
          <div className="flex justify-between items-center mb-8 relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 rounded-full"></div>
            {steps.map((label, index) => (
              <div key={label} className="relative z-10 flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
                  index <= activeStep 
                    ? index < activeStep 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <span className={`text-sm font-medium ${
                  index <= activeStep ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          
          {promoSuccess && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
              <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm flex-1">Promo code applied successfully!</p>
            </div>
          )}
          
          {error && (
            <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex justify-between items-center">
              <span className="flex items-center gap-2">
                <FiAlertCircle />
                {error}
              </span>
              <button className="text-red-500 hover:text-red-600" onClick={() => setError('')}>×</button>
            </div>
          )}
          
          {orderSuccess ? (
            renderConfirmation()
          ) : (
            <>
              {getStepContent(activeStep)}
              
              <div className="flex justify-between mt-8 max-w-2xl mx-auto">
                <button
                  className="px-8 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  <FiArrowLeft className="inline mr-2" />
                  Back
                </button>
                
                <button
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={handleNext}
                  disabled={loading || cartItems.length === 0}
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Processing...
                    </>
                  ) : activeStep === steps.length - 1 ? (
                    'Place Order'
                  ) : (
                    <>
                      Next
                      <FiArrowRight />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CheckoutPage;