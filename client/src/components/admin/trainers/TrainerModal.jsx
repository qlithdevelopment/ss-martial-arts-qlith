import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, AlignLeft, Type, Star, Zap, Quote, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

// ── Moved OUTSIDE to prevent remount on every render (fixes input focus loss) ──
const ArrayField = ({ label, icon: Icon, items, placeholder, onArrayChange, onAdd, onRemove, required = false, }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
      <Icon size={12} className="text-orange-500" /> {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => onArrayChange(index, e.target.value)}
            required={required && index === 0}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium placeholder:text-gray-400"
            placeholder={`${placeholder} ${index + 1}`}
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="self-start text-[11px] font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-orange-50 transition-all"
      >
        + Add {label.toLowerCase()}
      </button>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

// trainerId: pass an id to edit that trainer (fetched fresh from API).
// Pass null/undefined to open in "create" mode.
const TrainerModal = ({ isOpen, onClose, trainerId = null, fetchTrainers }) => {
  const isEditMode = !!trainerId;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);      // initial data fetch loading
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    biography: '',
    motivation_line: '',
  });

  const [achievements, setAchievements] = useState(['']);
  const [expertise, setExpertise] = useState(['']);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const [existingTrainerId, setExistingTrainerId] = useState(null); // used for the PUT url

  // ── Parse array from API (handles array or JSON string) ──────────────────────
  const parseArray = (val) => {
    if (Array.isArray(val) && val.length) return val;
    if (typeof val === 'string') {
      try {
        const p = JSON.parse(val);
        return Array.isArray(p) && p.length ? p : [''];
      } catch { return ['']; }
    }
    return [''];
  };

  // ── Populate form from a fetched trainer object ───────────────────────────────
  const populateFromTrainer = (trainer) => {
    setFormData({
      name: trainer.name || '',
      designation: trainer.designation || '',
      biography: trainer.biography || '',
      motivation_line: trainer.motivation_line || '',
    });
    setAchievements(parseArray(trainer.achievements));
    setExpertise(parseArray(trainer.expertise));
    setImagePreview(trainer.image_path ? `${BASE_URL}${trainer.image_path}` : null);
    setImage(null);
    setExistingTrainerId(trainer.id);
    setImageError("");
  };

  const resetForm = () => {
    setFormData({ name: '', designation: '', biography: '', motivation_line: '' });
    setAchievements(['']);
    setExpertise(['']);
    setImage(null);
    setImagePreview(null);
    setExistingTrainerId(null);
    setImageError("");
  };

  // ── Fetch trainer by id ────────────────────────────────────────────────────────
  const fetchTrainerDetails = async (id) => {
    try {
      setFetching(true);
      const res = await api.get(`/trainers/${id}`);
      const trainer = res.data.data || res.data;
      populateFromTrainer(trainer);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load trainer details');
      onClose();
    } finally {
      setFetching(false);
    }
  };

  // ── On open: fetch from API if editing, reset if creating ────────────────────
  useEffect(() => {
    if (!isOpen) return;
    if (isEditMode) {
      fetchTrainerDetails(trainerId);
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, trainerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Achievement handlers ──────────────────────────────────────────────────────
  const handleAchievementChange = (index, value) => {
    setAchievements(prev => prev.map((item, i) => (i === index ? value : item)));
  };
  const addAchievement = () => setAchievements(prev => [...prev, '']);
  const removeAchievement = (index) => {
    setAchievements(prev => (prev.length === 1 ? [''] : prev.filter((_, i) => i !== index)));
  };

  // ── Expertise handlers ────────────────────────────────────────────────────────
  const handleExpertiseChange = (index, value) => {
    setExpertise(prev => prev.map((item, i) => (i === index ? value : item)));
  };
  const addExpertise = () => setExpertise(prev => [...prev, '']);
  const removeExpertise = (index) => {
    setExpertise(prev => (prev.length === 1 ? [''] : prev.filter((_, i) => i !== index)));
  };

  // ── Image ─────────────────────────────────────────────────────────────────────
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setImageError('Only JPG, JPEG, PNG, or WEBP files are allowed');
      e.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Image size must be less than 2MB');
      e.target.value = "";
      return;
    }

    setImageError("");
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // ── Build FormData payload from current form state ───────────────────────────
  const buildPayload = () => {
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('designation', formData.designation);
    payload.append('biography', formData.biography);
    payload.append('motivation_line', formData.motivation_line);

    achievements.filter(v => v.trim()).forEach((val, i) => {
      payload.append(`achievements[${i}]`, val);
    });
    expertise.filter(v => v.trim()).forEach((val, i) => {
      payload.append(`expertise[${i}]`, val);
    });

    if (image) payload.append('image', image);

    return payload;
  };

  // ── Create a new trainer ──────────────────────────────────────────────────────
  const createTrainer = async () => {
    const payload = buildPayload();
    await api.post('/trainers', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    toast.success('Trainer created successfully!');
  };

  // ── Update an existing trainer ────────────────────────────────────────────────
  const updateTrainer = async () => {
    const payload = buildPayload();
    payload.append('_method', 'PUT');
    await api.post(`/trainers/${existingTrainerId}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    toast.success('Trainer updated successfully!');
  };

  // ── Submit: routes to create or update ────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!formData.designation.trim()) {
      toast.error('Designation is required');
      return;
    }
    if (!imagePreview) {
      setImageError('Please select a profile photo');
      toast.error('Please select a profile photo');
      return;
    }
    if (!achievements.some((a) => a.trim() !== '')) {
      toast.error('At least one achievement is required');
      return;
    }
    if (!expertise.some((e) => e.trim() !== '')) {
      toast.error('At least one expertise is required');
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        await updateTrainer();
      } else {
        await createTrainer();
      }

      try {
        await fetchTrainers();
      } catch (refreshError) {
        console.error('Failed to refresh trainer list:', refreshError);
      }

      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to save trainer');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div
              className="bg-white w-full max-w-2xl rounded-[1.5rem] shadow-2xl flex flex-col max-h-[85dvh] pointer-events-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 shrink-0">
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">
                    {isEditMode ? 'Edit Trainer' : 'Add Trainer'}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {isEditMode ? 'Update team member details' : 'Add a new member to your team'}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Body */}
              {fetching ? (
                <div className="flex-1 flex justify-center items-center py-20">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
                </div>
              ) : (
                <form id="trainer-form" onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">

                  {/* Name & Designation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Type size={12} className="text-orange-500" /> NAME *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. John Doe"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium placeholder:text-gray-400"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Type size={12} className="text-orange-500" /> DESIGNATION *
                      </label>
                      <input
                        type="text"
                        name="designation"
                        required
                        value={formData.designation}
                        onChange={handleInputChange}
                        placeholder="e.g. Head Sensei"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Upload size={12} className="text-orange-500" /> PROFILE PHOTO *
                      <span className="text-gray-400 normal-case tracking-normal font-medium">(Max 2MB · JPG, PNG, WEBP)</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative group w-24 h-24 shrink-0">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,image/webp"
                          onChange={handleImageSelect}
                          className="hidden"
                          id="trainer-image-upload"
                        />
                        <label
                          htmlFor="trainer-image-upload"
                          className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-xl cursor-pointer transition-all overflow-hidden relative ${
                            imageError
                              ? 'border-red-400 bg-red-50/50'
                              : imagePreview
                              ? 'border-gray-200 bg-gray-50'
                              : 'border-orange-200 bg-orange-50/50 hover:bg-orange-50 hover:border-orange-300 text-orange-500'
                          }`}
                        >
                          {imagePreview ? (
                            <>
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-[10px] font-bold flex items-center gap-1">
                                  <Upload size={12} /> Change
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-1 font-bold text-[10px]">
                              <UserIcon size={20} />
                              <span>UPLOAD</span>
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
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Click the box to upload a profile photo.<br />
                          Recommended: square image, at least 300×300px.
                        </p>
                        {imageError && (
                          <p className="text-[10px] font-semibold text-red-500">{imageError}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Biography */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <AlignLeft size={12} className="text-orange-500" /> BIOGRAPHY
                    </label>
                    <textarea
                      name="biography"
                      required
                      value={formData.biography}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Brief background and experience of the trainer..."
                      className="w-full scrollbar-thin bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium resize-y placeholder:text-gray-400"
                    />
                  </div>

                  {/* Motivation Line */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Quote size={12} className="text-orange-500" /> MOTIVATION LINE
                    </label>
                    <input
                      type="text"
                      name="motivation_line"
                      required
                      value={formData.motivation_line}
                      onChange={handleInputChange}
                      placeholder="e.g. Push harder every single day"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium placeholder:text-gray-400"
                    />
                  </div>

                  {/* Achievements & Expertise */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ArrayField
                      label="Achievements"
                      icon={Star}
                      items={achievements}
                      placeholder="Achievement"
                      onArrayChange={handleAchievementChange}
                      onAdd={addAchievement}
                      onRemove={removeAchievement}
                      required
                    />
                    <ArrayField
                      label="Expertise"
                      icon={Zap}
                      items={expertise}
                      placeholder="Expertise"
                      onArrayChange={handleExpertiseChange}
                      onAdd={addExpertise}
                      onRemove={removeExpertise}
                      required
                    />
                  </div>

                </form>
              )}

              {/* Footer */}
              <div className="flex justify-end gap-3 p-4 sm:p-5 border-t border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-bold shadow-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="trainer-form"
                  disabled={loading || fetching}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    isEditMode ? 'Save Changes' : 'Add Trainer'
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

export default TrainerModal;
