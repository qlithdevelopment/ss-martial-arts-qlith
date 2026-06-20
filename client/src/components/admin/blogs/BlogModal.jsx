import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axios'; 

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

const BlogModal = ({ isOpen, onClose, blogData = null, fetchBlogs }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); 
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    posted_date: new Date().toISOString().split('T')[0],
    short_description: '',
    is_published: true,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });

  const [featuredImage, setFeaturedImage] = useState(null); 
  const [featuredImagePreview, setFeaturedImagePreview] = useState(null); 

  const [contentBlocks, setContentBlocks] = useState([
    { heading: '', text: '', image: null, preview: null }
  ]);

  useEffect(() => {
    if (isOpen) {
      if (blogData) {
        setFormData({
          title: blogData.title || '',
          category: blogData.category || '',
          posted_date: blogData.posted_date || new Date().toISOString().split('T')[0],
          short_description: blogData.short_description || '',
          is_published: blogData.is_published ?? true,
          meta_title: blogData.meta_title || '',
          meta_description: blogData.meta_description || '',
          meta_keywords: Array.isArray(blogData.meta_keywords) ? blogData.meta_keywords.join(', ') : (blogData.meta_keywords || ''),
        });
        setFeaturedImagePreview(blogData.featured_image ? `http://127.0.0.1:8000/storage/${blogData.featured_image}` : null);
        
        if (blogData.content && Array.isArray(blogData.content)) {
          const blocks = blogData.content.map(b => ({
            heading: b.heading || '',
            text: b.text || '',
            image: null,
            preview: b.image || null 
          }));
          setContentBlocks(blocks.length > 0 ? blocks : [{ heading: '', text: '', image: null, preview: null }]);
        } else {
          setContentBlocks([{ heading: '', text: '', image: null, preview: null }]);
        }
      } else {
        resetForm();
      }
      setActiveTab('basic');
    }
  }, [isOpen, blogData]);

  const resetForm = () => {
    setFormData({
      title: '', category: '', posted_date: new Date().toISOString().split('T')[0],
      short_description: '', is_published: true, meta_title: '', meta_description: '', meta_keywords: ''
    });
    setFeaturedImage(null);
    setFeaturedImagePreview(null);
    setContentBlocks([{ heading: '', text: '', image: null, preview: null }]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageSelect = (e, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, JPEG, PNG, or WEBP are allowed');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image size must be less than 1MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (index === null) {
      setFeaturedImage(file);
      setFeaturedImagePreview(previewUrl);
    } else {
      const newBlocks = [...contentBlocks];
      newBlocks[index].image = file;
      newBlocks[index].preview = previewUrl;
      setContentBlocks(newBlocks);
    }
  };

  const removeImage = (index = null) => {
    if (index === null) {
      setFeaturedImage(null);
      setFeaturedImagePreview(null);
    } else {
      const newBlocks = [...contentBlocks];
      newBlocks[index].image = null;
      newBlocks[index].preview = null;
      setContentBlocks(newBlocks);
    }
  };

  const addContentBlock = () => {
    setContentBlocks([...contentBlocks, { heading: '', text: '', image: null, preview: null }]);
  };

  const removeContentBlock = (index) => {
    const newBlocks = contentBlocks.filter((_, i) => i !== index);
    setContentBlocks(newBlocks.length > 0 ? newBlocks : [{ heading: '', text: '', image: null, preview: null }]);
  };

  const updateContentBlock = (index, field, value) => {
    const newBlocks = [...contentBlocks];
    newBlocks[index][field] = value;
    setContentBlocks(newBlocks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.posted_date || !formData.short_description) {
      toast.error('Please fill all required basic fields');
      return;
    }

    setLoading(true);
    const payload = new FormData();
    
    // Append basic text fields
    Object.keys(formData).forEach(key => {
      if (key === 'meta_keywords') {
        const keywordsArray = formData.meta_keywords.split(',').map(k => k.trim()).filter(k => k);
        payload.append(key, JSON.stringify(keywordsArray));
      } else {
        payload.append(key, formData[key]);
      }
    });

    if (featuredImage) {
      payload.append('featured_image', featuredImage);
    }

    const cleanContent = contentBlocks.map((block, idx) => {
      if (block.image) {
        payload.append(`block_image_${idx}`, block.image);
      }
      return {
        heading: block.heading,
        text: block.text,
        image: block.preview && !block.image ? block.preview : '' 
      };
    });
    
    payload.append('content', JSON.stringify(cleanContent));

    try {
      if (blogData) {
        payload.append('_method', 'PUT');
        await api.post(`/blogs/${blogData.id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Blog updated successfully!');
      } else {
        await api.post('/blogs', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Blog created successfully!');
      }
      fetchBlogs();
      onClose();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || error.response?.data?.error || 'Failed to save blog';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 md:p-5 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{blogData ? 'Edit Blog' : 'Create New Blog'}</h2>
              <p className="text-xs text-gray-500 mt-1">Fill out the details below to publish an article.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-5 pt-2 bg-gray-50/50">
            {['basic', 'content', 'seo'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 font-medium text-sm capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {tab} Details
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-hidden p-5 bg-white">
            
            {/* BASIC TAB */}
            <div className={activeTab === 'basic' ? 'block h-full' : 'hidden'}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                
                {/* Left Column: Image */}
                <div className="lg:col-span-1 flex flex-col">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Featured Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors relative flex-1 min-h-[200px] flex flex-col items-center justify-center overflow-hidden group">
                    {featuredImagePreview ? (
                      <>
                        <img src={featuredImagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button type="button" onClick={() => removeImage(null)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon size={28} className="mx-auto text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500 block mb-1">Click to upload</span>
                        <span className="text-[10px] text-gray-400 block font-medium">PNG, JPG, JPEG</span>
                        <span className="text-[10px] text-orange-500 block font-bold mt-1">Max: 1MB</span>
                      </div>
                    )}
                    <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" onChange={(e) => handleImageSelect(e, null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                </div>

                {/* Right Column: Fields */}
                <div className="lg:col-span-2 flex flex-col justify-between">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Blog Title *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Enter title" required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                      <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="e.g. Training Tips" required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Posted Date *</label>
                      <input type="date" name="posted_date" value={formData.posted_date} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Short Description *</label>
                    <textarea name="short_description" value={formData.short_description} onChange={handleInputChange} rows="2" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none" placeholder="Brief summary of the blog post" required />
                  </div>

                  <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleInputChange} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Published Status</span>
                      <span className="text-[10px] text-gray-500">Is this article visible to the public?</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* CONTENT TAB */}
            <div className={activeTab === 'content' ? 'block' : 'hidden'}>
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600 font-medium">Build your article by stacking content blocks.</p>
                <button type="button" onClick={addContentBlock} className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
                  <Plus size={16} /> Add Block
                </button>
              </div>

              <div className="space-y-6">
                {contentBlocks.map((block, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-5 relative shadow-sm group">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => removeContentBlock(idx)} className="text-gray-400 hover:text-red-500 p-1 bg-white rounded shadow-sm border border-gray-200">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="lg:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Section Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white relative h-32 flex flex-col items-center justify-center overflow-hidden hover:bg-gray-50 transition-colors group/img">
                          {block.preview ? (
                            <>
                              <img src={block.preview.startsWith('http') ? block.preview : block.preview} alt="Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                <button type="button" onClick={() => removeImage(idx)} className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-2">
                              <Upload size={18} className="mx-auto text-gray-400 mb-1" />
                              <span className="text-[10px] text-gray-500 block">Max 1MB</span>
                            </div>
                          )}
                          <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" onChange={(e) => handleImageSelect(e, idx)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                      </div>

                      <div className="lg:col-span-3 space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Heading</label>
                          <input type="text" value={block.heading} onChange={(e) => updateContentBlock(idx, 'heading', e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Section Heading" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Paragraph Text</label>
                          <textarea rows="4" value={block.text} onChange={(e) => updateContentBlock(idx, 'text', e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none" placeholder="Write content here..." />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO TAB */}
            <div className={activeTab === 'seo' ? 'block' : 'hidden'}>
              <div className="space-y-5 max-w-3xl">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Title</label>
                  <input type="text" name="meta_title" value={formData.meta_title} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="SEO Title" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Description</label>
                  <textarea name="meta_description" value={formData.meta_description} onChange={handleInputChange} rows="3" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none" placeholder="SEO Description" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Keywords</label>
                  <input type="text" name="meta_keywords" value={formData.meta_keywords} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="martial arts, training, fitness (comma separated)" />
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 md:p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 mt-auto">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              Cancel
            </button>
            <button type="button" onClick={handleSubmit} disabled={loading} className="px-6 py-2 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors shadow-md disabled:opacity-70 flex items-center gap-2">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Saving...</>
              ) : 'Save Blog Post'}
            </button>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BlogModal;
