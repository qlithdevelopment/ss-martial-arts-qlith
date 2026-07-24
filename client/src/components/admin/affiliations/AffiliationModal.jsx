import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, AlignLeft, Phone, MapPin, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/storage/')) return `${BASE_URL}${path}`;
  return `${BASE_URL}/storage/${path}`;
};

const AffiliationModal = ({ isOpen, onClose, affiliation = null, fetchAffiliations }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    location: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");

  const isEdit = Boolean(affiliation);

  const resetForm = () => {
    setFormData({ name: '', description: '', phone: '', location: '' });
    setImageFile(null);
    setImagePreview(null);
  };

  useEffect(() => {
    if (!isOpen) return;

    if (affiliation) {
      setFormData({
        name: affiliation.name || '',
        description: affiliation.description || '',
        phone: affiliation.phone || '',
        location: affiliation.location || '',
      });
      setImagePreview(affiliation.image ? getImageUrl(affiliation.image) : null);
      setImageFile(null);
    } else {
      resetForm();
    }
  }, [isOpen, affiliation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const MAX_SIZE_MB = 2;
  const ALLOWED_TYPES = ["image/jpeg", "image/png"];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError("Only JPG, JPEG, or PNG allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setImageError(`Image must be under ${MAX_SIZE_MB}MB.`);
      e.target.value = "";
      return;
    }

    setImageError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate image is present — required only if there's no file AND no existing preview (e.g. add mode, or edit mode where image was cleared)
    if (!imageFile && !imagePreview) {
      setImageError("Please select an image.");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('phone', formData.phone);
      payload.append('location', formData.location);
      if (imageFile) {
        payload.append('image', imageFile);
      }

      if (isEdit) {
        payload.append('_method', 'PUT');
        await api.post(`/affiliations/${affiliation.id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Affiliation updated successfully!');
      } else {
        await api.post('/affiliations', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Affiliation created successfully!');
      }
      fetchAffiliations();
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to save affiliation');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
    setImageError("")
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
                    {isEdit ? 'Edit Affiliation' : 'Add Affiliation'}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {isEdit ? 'Update this partner/affiliation' : 'Add a new partner or affiliated brand'}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Form Body */}
              <form id="affiliation-form" onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto flex-1 custom-scrollbar">

                {/* Image Upload */}
                <div className="flex flex-col gap-1.5 mb-4">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <ImagePlus size={12} className="text-orange-500" /> LOGO / IMAGE
                  </label>
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-20 h-20 rounded-xl bg-gray-50 border flex items-center justify-center overflow-hidden shrink-0 ${imageError ? "border-red-400" : "border-gray-200"
                        }`}
                    >
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-1" />
                      ) : (
                        <Building2 className="text-gray-300" size={28} />
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="cursor-pointer px-4 py-2.5 text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all w-fit">
                        Choose File
                        <input
                          type="file"                         
                          accept=".jpeg,.jpg,.png,image/jpeg,image/png"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      {imageError ? (
                        <p className="text-[10px] font-semibold text-red-500">{imageError}</p>
                      ) : (
                        <p className="text-[10px] text-gray-400">JPG, JPEG or PNG · Max 2MB</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5 mb-4">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Building2 size={12} className="text-orange-500" /> NAME *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium placeholder:text-gray-400"
                    placeholder="e.g. Nike"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5 mb-4">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <AlignLeft size={12} className="text-orange-500" /> DESCRIPTION
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium resize-y placeholder:text-gray-400"
                    placeholder="Brief description of this affiliation..."
                  ></textarea>
                </div>

                {/* Phone & Location row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Phone size={12} className="text-orange-500" /> PHONE
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium placeholder:text-gray-400"
                      placeholder="+91 9090909090"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <MapPin size={12} className="text-orange-500" /> LOCATION
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium placeholder:text-gray-400"
                      placeholder="e.g. Bhubaneswar"
                    />
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-4 sm:p-5 border-t border-gray-50 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 text-sm font-bold shadow-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="affiliation-form"
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>Save Affiliation</>
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

export default AffiliationModal;