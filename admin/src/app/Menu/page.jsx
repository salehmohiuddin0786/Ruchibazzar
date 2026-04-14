"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Plus,
  X,
  Search,
  Grid,
  List,
  ChevronDown,
  Download,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ChefHat,
  Utensils,
  Image as ImageIcon,
  Tag,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  Filter,
  AlertTriangle,
  Package,
  Store,
  MapPin,
  LogOut,
  User,
  Bell
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ===============================
// STAT CARD COMPONENT
// ===============================
const StatCard = ({ icon: Icon, title, value, bgColor, trend }) => (
  <div className={`${bgColor} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/20`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/90 text-sm font-medium mb-1 flex items-center gap-2">
          {title}
          {trend && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{trend}</span>}
        </p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
        <Icon className="text-white" size={28} />
      </div>
    </div>
  </div>
);

// ===============================
// DELETE CONFIRMATION MODAL
// ===============================
const DeleteModal = ({ isOpen, onClose, onConfirm, dishName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
          <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-t-3xl p-6 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white">Delete Item</h2>
          </div>

          <div className="p-6 text-center">
            <p className="text-gray-800 text-lg mb-2">Are you sure you want to delete?</p>
            <p className="text-gray-600 font-medium mb-6">"{dishName}"</p>
            <p className="text-sm text-gray-500 mb-8">This action cannot be undone.</p>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===============================
// ADD ITEM MODAL COMPONENT (Updated)
// ===============================
const AddItemModal = ({ onClose, onAdd, restaurantId }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    isAvailable: true,
    image: null
  });
  
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: "Please upload an image file" });
        return;
      }

      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors({ ...errors, image: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) newErrors.name = "Dish name is required";
    if (!formData.price) newErrors.price = "Price is required";
    else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) 
      newErrors.price = "Please enter a valid price";
    
    if (!formData.description?.trim()) newErrors.description = "Description is required";
    if (!formData.image) newErrors.image = "Dish image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('price', formData.price);
      submitData.append('description', formData.description);
      submitData.append('isAvailable', formData.isAvailable);
      submitData.append('restaurantId', restaurantId); // Auto-set from logged-in restaurant
      submitData.append('image', formData.image);
      
      await onAdd(submitData);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-3xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Plus className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Add New Menu Item</h2>
                  <p className="text-blue-100 text-sm mt-1">Fill in the details to create a new dish</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                <X className="text-white" size={24} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-5">
              {/* Dish Name */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Dish Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 text-gray-900 ${
                    errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                  }`}
                  placeholder="e.g., Chicken Biryani"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 text-gray-900 ${
                    errors.price ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'
                  }`}
                  placeholder="299"
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 text-gray-900 ${
                    errors.description ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-200'
                  }`}
                  placeholder="Describe your dish in detail..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Dish Image <span className="text-red-500">*</span>
                </label>
                <div className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
                  errors.image ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  {imagePreview ? (
                    <div className="relative group">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <p className="text-white text-sm">Click to change image</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="text-sm text-gray-700 mt-2">
                        <span className="text-purple-600 font-medium">Upload an image</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                </div>
                {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
              </div>

              {/* Availability Toggle */}
              <div>
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <Eye className={formData.isAvailable ? 'text-green-600' : 'text-gray-400'} size={20} />
                    <span className="font-medium text-gray-800">Available</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isAvailable ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.isAvailable ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 mt-8 pt-5 border-t border-gray-200">
              <button type="button" onClick={onClose} className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-70 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Create Dish
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ===============================
// EDIT ITEM MODAL COMPONENT (Updated - No Restaurant Selection)
// ===============================
const EditItemModal = ({ onClose, onEdit, dish }) => {
  const [formData, setFormData] = useState({
    name: dish.name || "",
    price: dish.price || "",
    description: dish.description || "",
    isAvailable: dish.isAvailable ?? true,
    image: null
  });
  
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(dish.image ? `${API}${dish.image}` : null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: "Please upload an image file" });
        return;
      }

      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors({ ...errors, image: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) newErrors.name = "Dish name is required";
    if (!formData.price) newErrors.price = "Price is required";
    else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) 
      newErrors.price = "Please enter a valid price";
    
    if (!formData.description?.trim()) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('price', formData.price);
      submitData.append('description', formData.description);
      submitData.append('isAvailable', formData.isAvailable);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      await onEdit(dish.id, submitData);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-3xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Edit2 className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Edit Menu Item</h2>
                  <p className="text-purple-100 text-sm mt-1">Update the details of your dish</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                <X className="text-white" size={24} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-5">
              {/* Dish Name */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Dish Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 text-gray-900 ${
                    errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-200'
                  }`}
                  placeholder="e.g., Chicken Biryani"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 text-gray-900 ${
                    errors.price ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-200'
                  }`}
                  placeholder="299"
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 text-gray-900 ${
                    errors.description ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-pink-200'
                  }`}
                  placeholder="Describe your dish in detail..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Dish Image
                </label>
                <div className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
                  errors.image ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50'
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  {imagePreview ? (
                    <div className="relative group">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <p className="text-white text-sm">Click to change image</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="text-sm text-gray-700 mt-2">
                        <span className="text-pink-600 font-medium">Upload an image</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                </div>
                {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
              </div>

              {/* Availability Toggle */}
              <div>
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <Eye className={formData.isAvailable ? 'text-green-600' : 'text-gray-400'} size={20} />
                    <span className="font-medium text-gray-800">Available</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isAvailable ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.isAvailable ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 mt-8 pt-5 border-t border-gray-200">
              <button type="button" onClick={onClose} className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-70 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Update Dish
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ===============================
// ENHANCED DISH CARD
// ===============================
const EnhancedDishCard = ({ dish, onDelete, onEdit }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const imageUrl = dish.image 
    ? (dish.image.startsWith('http') ? dish.image : `${API}${dish.image}`)
    : null;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
        <div className="relative h-48 overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={dish.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <ChefHat className="text-gray-400" size={48} />
            </div>
          )}
          
          {/* Availability Badge */}
          <div className="absolute top-3 left-3">
            {!dish.isAvailable && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                <EyeOff size={12} /> UNAVAILABLE
              </span>
            )}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">{dish.name}</h3>
            <p className="text-2xl font-bold text-blue-600">₹{dish.price}</p>
          </div>
          
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">{dish.description}</p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onEdit(dish)}
                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
              dish.isAvailable ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
            }`}>
              <Eye size={14} />
              <span className="text-xs font-medium">{dish.isAvailable ? 'Available' : 'Unavailable'}</span>
            </div>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDelete(dish.id);
          setShowDeleteModal(false);
        }}
        dishName={dish.name}
      />
    </>
  );
};

// ===============================
// MAIN MENU COMPONENT (Updated with Auth)
// ===============================
const Menu = () => {
  const [dishes, setDishes] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  
  const router = useRouter();

  // Get auth token from storage
  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Get auth headers
  const getAuthHeaders = () => {
    const token = getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  // Check authentication and get restaurant info
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
      const restaurantData = localStorage.getItem("restaurant") || sessionStorage.getItem("restaurant");

      if (!token || !userData) {
        router.push("/login");
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        
        // Check if user is partner
        if (parsedUser.role !== "partner") {
          router.push("/login");
          return;
        }

        setUser(parsedUser);

        if (restaurantData) {
          setRestaurant(JSON.parse(restaurantData));
        } else {
          // Fetch restaurant details for this partner
          await fetchRestaurantDetails(parsedUser.id);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  // Fetch restaurant details for the logged-in partner
  const fetchRestaurantDetails = async (partnerId) => {
    try {
      const response = await fetch(`${API}/api/restaurants/partner/${partnerId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const restaurantData = data.data || data;
        setRestaurant(restaurantData);
        // Store restaurant data
        const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
        storage.setItem("restaurant", JSON.stringify(restaurantData));
      }
    } catch (error) {
      console.error("Error fetching restaurant:", error);
    }
  };

  // Fetch dishes for the logged-in restaurant
  const fetchDishes = async () => {
    if (!restaurant) return;
    
    try {
      setLoading(true);
      const token = getToken();
      
      const response = await axios.get(`${API}/api/dishes/restaurant/${restaurant.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setDishes(response.data.data || response.data || []);
    } catch (err) {
      console.error("Error fetching dishes:", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
      setDishes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurant) {
      fetchDishes();
    }
  }, [restaurant]);

  // Add dish
  const handleAddDish = async (formData) => {
    if (!restaurant) return;
    
    try {
      const token = getToken();
      
      await axios.post(`${API}/api/dishes`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchDishes();
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding dish:", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // Edit dish
  const handleEditDish = async (id, formData) => {
    try {
      const token = getToken();
      
      await axios.put(`${API}/api/dishes/${id}`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchDishes();
      setShowEditModal(false);
      setSelectedDish(null);
    } catch (err) {
      console.error("Error updating dish:", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // Delete dish
  const deleteDish = async (id) => {
    try {
      const token = getToken();
      
      await axios.delete(`${API}/api/dishes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchDishes();
    } catch (err) {
      console.error("Error deleting dish:", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("restaurant");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("restaurant");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/login");
  };

  // Calculate stats
  const stats = {
    total: dishes.length,
    available: dishes.filter(d => d.isAvailable).length,
    unavailable: dishes.filter(d => !d.isAvailable).length,
  };

  // Filter dishes
  const filteredDishes = dishes
    .filter(dish => {
      const matchesSearch = dish.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dish.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAvailability = availabilityFilter === "all" || 
                                 (availabilityFilter === "available" && dish.isAvailable) ||
                                 (availabilityFilter === "unavailable" && !dish.isAvailable);
      
      return matchesSearch && matchesAvailability;
    });

  // Show loading state
  if (loading && !restaurant) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-800 text-lg font-medium">Loading your menu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return null;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar restaurantName={restaurant.name} onLogout={handleLogout} />

      <div className="flex-1">
        <Header 
          title="Menu Management" 
          restaurantName={restaurant.name}
          userName={user?.name}
          onLogout={handleLogout}
        />

        <div className="p-6">
          {/* Restaurant Welcome Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back, {restaurant.name}!</h2>
                <p className="text-blue-100">
                  Manage your menu items from here. Currently managing {dishes.length} dishes.
                </p>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <Store size={48} />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard icon={Utensils} title="Total Items" value={stats.total} bgColor="bg-gradient-to-br from-blue-600 to-blue-700" />
            <StatCard icon={Eye} title="Available" value={stats.available} bgColor="bg-gradient-to-br from-green-600 to-green-700" />
            <StatCard icon={EyeOff} title="Unavailable" value={stats.unavailable} bgColor="bg-gradient-to-br from-red-600 to-red-700" />
          </div>

          {/* Search and Actions Bar */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search your dishes by name or description..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-6 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 font-medium"
                >
                  <Filter size={20} />
                  Filters
                  <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 rounded-lg transition-all ${
                      viewMode === "grid" ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 rounded-lg transition-all ${
                      viewMode === "list" ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus size={20} />
                  Add New Item
                </button>
              </div>
            </div>

            {/* Filter Chips */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-800 mb-3">Availability</p>
                <div className="flex flex-wrap gap-2">
                  {["all", "available", "unavailable"].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setAvailabilityFilter(filter)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                        availabilityFilter === filter
                          ? filter === "all" 
                            ? 'bg-blue-600 text-white shadow-md'
                            : filter === "available"
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-red-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter === "all" ? "All Items" : filter === "available" ? "Available" : "Unavailable"}
                      <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                        {filter === "all" 
                          ? filteredDishes.length 
                          : filter === "available" 
                          ? filteredDishes.filter(d => d.isAvailable).length
                          : filteredDishes.filter(d => !d.isAvailable).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {restaurant.name} Menu
              </h2>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <span>Showing {filteredDishes.length} of {dishes.length} items</span>
                {searchTerm && (
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    Search: "{searchTerm}"
                  </span>
                )}
              </p>
            </div>
            <button 
              onClick={() => {
                // Export menu as JSON
                const dataStr = JSON.stringify(filteredDishes, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const exportFileDefaultName = `${restaurant.name}-menu-${new Date().toISOString().split('T')[0]}.json`;
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
              }}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2 bg-gray-100 rounded-xl hover:bg-gray-200"
            >
              <Download size={18} />
              Export Menu
            </button>
          </div>

          {/* Dishes Grid/List */}
          {filteredDishes.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDishes.map((dish) => (
                  <EnhancedDishCard 
                    key={dish.id} 
                    dish={dish} 
                    onDelete={deleteDish}
                    onEdit={(dish) => {
                      setSelectedDish(dish);
                      setShowEditModal(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDishes.map((dish) => (
                  <div key={dish.id} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                        {dish.image ? (
                          <img 
                            src={`${API}${dish.image}`} 
                            alt={dish.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ChefHat className="text-gray-400" size={32} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{dish.name}</h3>
                          {!dish.isAvailable && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Unavailable</span>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm line-clamp-2">{dish.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">₹{dish.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setSelectedDish(dish);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedDish(dish);
                            const event = new CustomEvent('openDeleteModal', { detail: dish });
                            window.dispatchEvent(event);
                          }}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-gray-100">
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <ChefHat className="text-blue-600" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No menu items found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm 
                  ? `No items matching "${searchTerm}" in your menu`
                  : `Your menu is empty. Start by adding your first delicious dish to ${restaurant.name}!`}
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all inline-flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus size={20} />
                Add Your First Item
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddDish}
          restaurantId={restaurant.id}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedDish && (
        <EditItemModal
          onClose={() => {
            setShowEditModal(false);
            setSelectedDish(null);
          }}
          onEdit={handleEditDish}
          dish={selectedDish}
        />
      )}
    </div>
  );
};

export default Menu;