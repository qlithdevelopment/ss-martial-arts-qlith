import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, AlignLeft, Type, Image as ImageIcon, Save, CopyPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axios';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/storage/')) return `http://127.0.0.1:8000${path}`;
  return `http://127.0.0.1:8000/storage/${path}`;
};

const AlbumModal = ({ isOpen, onClose, albumData = null, fetchAlbums }) => {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [galleryImages, setGalleryImages] = useState([]); 
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [oldImages, setOldImages] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (albumData) {
        setFormData({
          name: albumData.name || '',
          description: albumData.description || '',
        });
        
        // Load existing images
        if (albumData.images && Array.isArray(albumData.images)) {
          setOldImages(albumData.images);
        } else {
          setOldImages([]);
        }
      } else {
        resetForm();
      }
    }
  }, [isOpen, albumData]);

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setGalleryImages([]);
    setGalleryPreviews([]);
    setOldImages([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const validFiles = files.filter(file => {
      if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
        toast.error(`Invalid format: ${file.name}`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Too large: ${file.name} (Max 2MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length) {
      setGalleryImages(prev => [...prev, ...validFiles]);
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeNewImage = (index) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeOldImage = (index) => {
    setOldImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Please enter an album name');
      return;
    }

    if (!albumData && galleryImages.length === 0) {
      toast.error('Please upload at least one image to create an album');
      return;
    }

    setLoading(true);
    const payload = new FormData();
    
    payload.append('name', formData.name);
    if (formData.description) payload.append('description', formData.description);

    galleryImages.forEach((file) => {
      payload.append('images[]', file);
    });

    try {
      if (albumData) {
        // Since we are not appending old_images[], the backend might wipe them if we aren't careful. I'll append old_images[] if the backend supports it, but earlier I saw GalleryController only had store(). Let's assume there is an update or we just use it as is.
        oldImages.forEach((img) => {
          payload.append('old_images[]', img);
        });
        await api.post(`/galleries/${albumData.id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Gallery updated successfully!');
      } else {
        await api.post('/galleries', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Gallery created successfully!');
      }
      fetchAlbums();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to save gallery');
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
                    {albumData ? 'Edit Album' : 'Create Album'}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {albumData ? 'Update gallery details' : 'Create a new photo gallery'}
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
              <form id="album-form" onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto flex-1 custom-scrollbar">
                
                {/* Album Name & Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Type size={12} className="text-orange-500" /> ALBUM NAME
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium placeholder:text-gray-400"
                      placeholder="e.g. Winter Grading 2026"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <AlignLeft size={12} className="text-orange-500" /> DESCRIPTION
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium placeholder:text-gray-400"
                      placeholder="e.g. Dan Promotions"
                    />
                  </div>
                </div>

                {/* Photo Upload Section */}
                <div className="flex flex-col gap-1.5 mt-2 border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <CopyPlus size={12} className="text-orange-500" /> GALLERY PHOTOS
                  </label>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {/* Upload Button */}
                    <div className="relative group aspect-square">
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg, image/png, image/jpg, image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                        id="album-image-upload"
                      />
                      <label 
                        htmlFor="album-image-upload"
                        className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-orange-200 bg-orange-50/50 hover:bg-orange-50 hover:border-orange-300 text-orange-600 rounded-xl cursor-pointer transition-all"
                      >
                        <Upload size={18} className="mb-1" /> 
                        <span className="text-[9px] font-bold">ADD PHOTOS</span>
                      </label>
                    </div>

                    {/* Previews of Old Images */}
                    {oldImages.map((img, idx) => (
                      <div key={`old-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white group">
                        <img src={getImageUrl(img)} alt={`Old ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeOldImage(idx)}
                          className="absolute top-1 right-1 bg-red-500/90 backdrop-blur-sm text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                    ))}

                    {/* Previews of New Images */}
                    {galleryPreviews.map((preview, idx) => (
                      <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-orange-200 bg-white group">
                        <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                          NEW
                        </div>
                        <button
                          type="button"
                          onClick={() => removeNewImage(idx)}
                          className="absolute top-1 right-1 bg-red-500/90 backdrop-blur-sm text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <span className="text-[9px] text-gray-400 mt-2 uppercase tracking-widest block text-right">
                    Max 2MB per image. Format: JPG, PNG, WEBP
                  </span>
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
                  form="album-form"
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all shadow-md shadow-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {loading ? 'Saving...' : 'Save Gallery'}
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AlbumModal;
