import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, AlignLeft, Type, BadgeInfo, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axios';

const ServiceModal = ({ isOpen, onClose, serviceData = null, fetchServices }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    badge: '',
    description: '',
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (serviceData) {
        setFormData({
          title: serviceData.title || '',
          subtitle: serviceData.subtitle || '',
          badge: serviceData.badge || '',
          description: serviceData.description || '',
        });
        setImagePreview(serviceData.image ? `http://127.0.0.1:8000/storage/${serviceData.image}` : null);
      } else {
        setFormData({ title: '', subtitle: '', badge: '', description: '' });
        setImage(null);
        setImagePreview(null);
      }
    }
  }, [isOpen, serviceData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Only JPG, JPEG, PNG, or WEBP files are allowed');
        return;
      }
      
      // Validate file size (1MB)
      if (file.size > 1 * 1024 * 1024) {
        toast.error('Image size must be less than 1MB');
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('subtitle', formData.subtitle);
      if (formData.badge) payload.append('badge', formData.badge);
      payload.append('description', formData.description);
      if (image) payload.append('image', image);

      if (serviceData) {
        await api.post(`/services/${serviceData.id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Service updated successfully!');
      } else {
        await api.post('/services', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Service created successfully!');
      }
      fetchServices();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div className="bg-white w-full max-w-2xl rounded-[1.5rem] shadow-2xl flex flex-col max-h-[85dvh] pointer-events-auto overflow-hidden">
              
              {/* Header */}
              <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-50 shrink-0 bg-white">
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">
                    {serviceData ? 'Edit Service' : 'Add Service'}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {serviceData ? 'Update program details' : 'Add a new program or class offering'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Form Body */}
              <form id="service-form" onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto flex-1 custom-scrollbar">
                
                {/* Title & Subtitle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Type size={12} className="text-orange-500" /> TITLE *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium placeholder:text-gray-400"
                      placeholder="e.g. Mixed Martial Arts"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Type size={12} className="text-orange-500" /> SUBTITLE *
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium placeholder:text-gray-400"
                      placeholder="e.g. Elite Striking & Grappling"
                    />
                  </div>
                </div>

                {/* Badge (Optional) */}
                <div className="flex flex-col gap-1.5 mb-4">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <BadgeInfo size={12} className="text-orange-500" /> BADGE / LABEL (Optional)
                  </label>
                  <input
                    type="text"
                    name="badge"
                    value={formData.badge}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium placeholder:text-gray-400"
                    placeholder="e.g. BEST SELLER or BEGINNER FRIENDLY"
                  />
                </div>

                {/* Image Upload */}
                <div className="flex flex-col gap-1.5 mb-4">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <ImageIcon size={12} className="text-orange-500" /> SERVICE IMAGE <span className="text-gray-400 lowercase normal-case tracking-normal">(Max 1MB)</span>
                  </label>
                  
                  <div className="relative group w-full h-40 mx-auto md:mx-0">
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/jpg, image/webp"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="service-image-upload"
                    />
                    <label 
                      htmlFor="service-image-upload"
                      className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-xl cursor-pointer transition-all overflow-hidden relative ${
                        imagePreview 
                          ? 'border-gray-200 bg-gray-50' 
                          : 'border-orange-200 bg-orange-50/50 hover:bg-orange-50 hover:border-orange-300 text-orange-600'
                      }`}
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-[10px] font-bold flex items-center gap-1">
                              <Upload size={12} /> Change Image
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1 font-bold text-[10px]">
                          <Upload size={16} /> 
                          <span>UPLOAD IMAGE</span>
                        </div>
                      )}
                    </label>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); removeImage(); }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors z-10"
                      >
                        <X size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <AlignLeft size={12} className="text-orange-500" /> FULL DESCRIPTION *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium resize-y placeholder:text-gray-400"
                    placeholder="Describe the curriculum, benefits, and requirements for this service..."
                  ></textarea>
                </div>

              </form>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-4 sm:p-5 border-t border-gray-50 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="service-form"
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>Save Service</>
                  )}
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ServiceModal;
