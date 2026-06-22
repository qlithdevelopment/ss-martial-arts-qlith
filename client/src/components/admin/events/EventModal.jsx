import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Calendar, AlignLeft, Type, Image as ImageIcon, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axios'; 

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const EventModal = ({ isOpen, onClose, eventData = null, fetchEvents }) => {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [featuredImage, setFeaturedImage] = useState(null); 
  const [featuredImagePreview, setFeaturedImagePreview] = useState(null); 

  useEffect(() => {
    if (isOpen) {
      if (eventData) {
        setFormData({
          name: eventData.name || '',
          description: eventData.description || '',
          date: eventData.date || new Date().toISOString().split('T')[0],
        });
        setFeaturedImagePreview(eventData.image ? `http://127.0.0.1:8000/storage/${eventData.image}` : null);
      } else {
        resetForm();
      }
    }
  }, [isOpen, eventData]);

  const resetForm = () => {
    setFormData({
      name: '', description: '', date: new Date().toISOString().split('T')[0]
    });
    setFeaturedImage(null);
    setFeaturedImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, JPEG, PNG, or WEBP are allowed');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setFeaturedImage(file);
    setFeaturedImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setFeaturedImage(null);
    setFeaturedImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date) {
      toast.error('Please fill required fields: Name and Date');
      return;
    }

    setLoading(true);
    const payload = new FormData();
    
    payload.append('name', formData.name);
    if (formData.description) payload.append('description', formData.description);
    payload.append('date', formData.date);

    if (featuredImage) {
      payload.append('image', featuredImage);
    }

    try {
      if (eventData) {
        await api.post(`/events/${eventData.id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Event updated successfully!');
      } else {
        await api.post('/events', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Event created successfully!');
      }
      fetchEvents();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to save event');
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
                    {eventData ? 'Edit Event' : 'Create Event'}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {eventData ? 'Update event details' : 'Add a new event to the calendar'}
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
              <form id="event-form" onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto flex-1 custom-scrollbar">
                
                {/* Event Name */}
                <div className="flex flex-col gap-1.5 mb-4">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Type size={12} className="text-orange-500" /> EVENT NAME
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium placeholder:text-gray-400"
                    placeholder="e.g. Winter Grading 2026"
                  />
                </div>

                {/* Date & Image Upload row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar size={12} className="text-orange-500" /> DATE
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <ImageIcon size={12} className="text-orange-500" /> EVENT COVER IMAGE
                    </label>
                    
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/jpeg, image/png, image/jpg, image/webp"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="event-image-upload"
                      />
                      <label 
                        htmlFor="event-image-upload"
                        className={`flex items-center justify-center w-full h-11 border-2 border-dashed rounded-xl cursor-pointer transition-all overflow-hidden relative ${
                          featuredImagePreview 
                            ? 'border-gray-200 bg-gray-50' 
                            : 'border-orange-200 bg-orange-50/50 hover:bg-orange-50 hover:border-orange-300 text-orange-600'
                        }`}
                      >
                        {featuredImagePreview ? (
                          <>
                            <img src={featuredImagePreview} alt="Preview" className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white text-xs font-bold flex items-center gap-1.5">
                                <Upload size={14} /> Change Image
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 font-bold text-xs">
                            <Upload size={14} /> 
                            <span>UPLOAD IMAGE</span>
                          </div>
                        )}
                      </label>
                      {featuredImagePreview && (
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
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <AlignLeft size={12} className="text-orange-500" /> DESCRIPTION
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium resize-y placeholder:text-gray-400"
                    placeholder="Enter detailed information about the event..."
                  ></textarea>
                </div>
              </form>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-4 sm:p-5 border-t border-gray-50 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="event-form"
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all shadow-md shadow-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {loading ? 'Saving...' : 'Save Event'}
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EventModal;
