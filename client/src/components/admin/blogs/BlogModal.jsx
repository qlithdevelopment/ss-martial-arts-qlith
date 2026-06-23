import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Plus, Trash2, Image as ImageIcon, PlusCircle, ArrowRight, Save, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axios'; 

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

// Pre-defined smart tag suggestions
const SUGGESTED_TAGS = [
  "karate", "martial arts", "beginners", "self defense", "fitness", 
  "dojo", "kata", "kumite", "black belt", "training", "discipline"
];

// Tailwind color combinations for dynamic tag styling
const TAG_COLORS = [
  { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-900/50' },
  { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-900/50' },
  { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-900/50' },
  { bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-700 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-900/50' },
  { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-900/50' },
  { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-900/50' },
  { bg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-900/50' }
];

const BlogModal = ({ isOpen, onClose, blogData = null, fetchBlogs }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); 
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    posted_date: new Date().toISOString().split('T')[0], // Automatically tracks current date
    short_description: '',
    is_published: true,
    meta_title: '',
    meta_description: '',
  });

  const [featuredImage, setFeaturedImage] = useState(null); 
  const [featuredImagePreview, setFeaturedImagePreview] = useState(null); 

  // Content blocks state matching layout payload
  const [contentBlocks, setContentBlocks] = useState([
    { title: '', description: [''], keypoints: [''], image: null, preview: null }
  ]);

  // Visual Tags State management (stores objects with text and style index)
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

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
        });
        setFeaturedImagePreview(blogData.featured_image ? blogData.featured_image : null);
        
        // Parse array of tags safely and assign color mappings
        if (blogData.meta_keywords) {
          try {
            const parsed = Array.isArray(blogData.meta_keywords) 
              ? blogData.meta_keywords 
              : JSON.parse(blogData.meta_keywords);
            
            const rawTags = Array.isArray(parsed) ? parsed : [];
            setTags(rawTags.map((t, idx) => ({ text: t, colorIdx: idx % TAG_COLORS.length })));
          } catch (e) {
            const rawTags = typeof blogData.meta_keywords === 'string' ? blogData.meta_keywords.split(',').map(t => t.trim()) : [];
            setTags(rawTags.map((t, idx) => ({ text: t, colorIdx: idx % TAG_COLORS.length })));
          }
        } else {
          setTags([]);
        }

        if (blogData.content && Array.isArray(blogData.content)) {
          const blocks = blogData.content.map(b => ({
            title: b.title || '',
            description: Array.isArray(b.description) ? [...b.description] : [b.description || ''],
            keypoints: Array.isArray(b.keypoints) ? [...b.keypoints] : (b.keypoints ? [b.keypoints] : ['']),
            image: null,
            preview: b.image || null 
          }));
          setContentBlocks(blocks.length > 0 ? blocks : [{ title: '', description: [''], keypoints: [''], image: null, preview: null }]);
        } else {
          setContentBlocks([{ title: '', description: [''], keypoints: [''], image: null, preview: null }]);
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
      short_description: '', is_published: true, meta_title: '', meta_description: ''
    });
    setFeaturedImage(null);
    setFeaturedImagePreview(null);
    setTags([]);
    setTagInput('');
    setContentBlocks([{ title: '', description: [''], keypoints: [''], image: null, preview: null }]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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

  // Content block standard management actions
  const addContentBlock = () => {
    setContentBlocks([...contentBlocks, { title: '', description: [''], keypoints: [''], image: null, preview: null }]);
  };

  const removeContentBlock = (index) => {
    const newBlocks = contentBlocks.filter((_, i) => i !== index);
    setContentBlocks(newBlocks.length > 0 ? newBlocks : [{ title: '', description: [''], keypoints: [''], image: null, preview: null }]);
  };

  const updateBlockTitle = (index, value) => {
    const newBlocks = [...contentBlocks];
    newBlocks[index].title = value;
    setContentBlocks(newBlocks);
  };

  const addParagraph = (blockIdx) => {
    const newBlocks = [...contentBlocks];
    newBlocks[blockIdx].description.push('');
    setContentBlocks(newBlocks);
  };

  const updateParagraph = (blockIdx, paraIdx, value) => {
    const newBlocks = [...contentBlocks];
    newBlocks[blockIdx].description[paraIdx] = value;
    setContentBlocks(newBlocks);
  };

  const removeParagraph = (blockIdx, paraIdx) => {
    const newBlocks = [...contentBlocks];
    newBlocks[blockIdx].description = newBlocks[blockIdx].description.filter((_, i) => i !== paraIdx);
    if (newBlocks[blockIdx].description.length === 0) newBlocks[blockIdx].description.push('');
    setContentBlocks(newBlocks);
  };

  const addKeypoint = (blockIdx) => {
    const newBlocks = [...contentBlocks];
    newBlocks[blockIdx].keypoints.push('');
    setContentBlocks(newBlocks);
  };

  const updateKeypoint = (blockIdx, keyIdx, value) => {
    const newBlocks = [...contentBlocks];
    newBlocks[blockIdx].keypoints[keyIdx] = value;
    setContentBlocks(newBlocks);
  };

  const removeKeypoint = (blockIdx, keyIdx) => {
    const newBlocks = [...contentBlocks];
    newBlocks[blockIdx].keypoints = newBlocks[blockIdx].keypoints.filter((_, i) => i !== keyIdx);
    if (newBlocks[blockIdx].keypoints.length === 0) newBlocks[blockIdx].keypoints.push('');
    setContentBlocks(newBlocks);
  };

  // Tag list modifications handlers
  const handleTagKeyDown = (e) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleTagInputChange = (e) => {
    const val = e.target.value;
    if (val.endsWith(',')) {
      addTag(val.slice(0, -1));
    } else {
      setTagInput(val);
    }
  };

  const addTag = (tagText) => {
    const cleaned = tagText.trim().toLowerCase();
    if (!cleaned) return;
    
    // Avoid duplicates
    if (tags.some(t => t.text === cleaned)) {
      setTagInput('');
      return;
    }

    // Pick a color theme sequentially based on index length
    const randomColorIdx = tags.length % TAG_COLORS.length;
    setTags([...tags, { text: cleaned, colorIdx: randomColorIdx }]);
    setTagInput('');
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, i) => i !== indexToRemove));
  };

  // Section Validation Engine Checks
  const validateSections = () => {
    // FIXED: Skip section structure layout validation checks entirely if editing
    if (blogData) return true;

    for (let i = 0; i < contentBlocks.length; i++) {
      const block = contentBlocks[i];
      const hasTitle = block.title.trim() !== '';
      const hasImage = block.preview !== null;
      const hasDescription = block.description.some(p => p.trim() !== '');
      const hasKeypoints = block.keypoints.some(k => k.trim() !== '');

      // Check if everything is completely empty
      if (!hasTitle && !hasImage && !hasDescription && !hasKeypoints) {
        toast.error(`Section #${i + 1} is entirely empty. Please remove it or enter a title.`);
        return false;
      }
      
      // If data is filled, ensure title exists (Title Mandatory requirement)
      if (!hasTitle && (hasDescription || hasKeypoints || hasImage)) {
        toast.error(`Title is required for Section #${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (activeTab === 'basic') {
      // FIXED: Basic Fields validation checks run ONLY if creating a new post, skipped entirely on edit
      if (!blogData) {
        if (!formData.title.trim()) {
          toast.error('Blog Title is required.');
          return;
        }
        if (!formData.category.trim()) {
          toast.error('Category field is required.');
          return;
        }
        if (!formData.short_description.trim()) {
          toast.error('Short Description summary text is required.');
          return;
        }
        if (!featuredImagePreview) {
          toast.error('Please upload a Featured Header Image.');
          return;
        }
      }
      setActiveTab('content');
    } else if (activeTab === 'content') {
      if (!validateSections()) return;
      setActiveTab('seo');
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateSections()) return;

    setLoading(true);
    const payload = new FormData();
    
    Object.keys(formData).forEach(key => {
      payload.append(key, formData[key]);
    });

    // Convert structured tags objects back to flat string array for backend payload requirements
    const flatKeywords = tags.map(t => t.text);
    payload.append('meta_keywords', JSON.stringify(flatKeywords));

    // FIXED: Only append the file object if a new one was actually chosen.
    // Never append an absolute preview image string path wrapper into the file stream.
    if (featuredImage) {
      payload.append('featured_image', featuredImage);
    }

    const cleanContent = contentBlocks.map((block, idx) => {
      // Only upload block section file stream arrays if explicitly modified as a File object instance
      if (block.image instanceof File) {
        payload.append(`block_image_${idx}`, block.image);
      }
      return {
        title: block.title.trim(),
        description: block.description.filter(p => p.trim() !== ''),
        keypoints: block.keypoints.filter(k => k.trim() !== ''),
        image: block.preview && !(block.image instanceof File) ? block.preview : '' 
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
          className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{blogData ? 'Edit Blog' : 'Create New Blog'}</h2>
              <p className="text-xs text-gray-500 mt-0.5">Fill out details below to build your blog layout workflow.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Navigation Tab Bars */}
          <div className="flex border-b border-gray-100 px-5 pt-2 bg-gray-50/50 flex-shrink-0">
            {['basic', 'content', 'seo'].map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 font-medium text-sm capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {tab} Details
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 bg-white">
            
            {/* BASIC TAB */}
            <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Featured Header Image {!blogData && '*'}</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors relative h-[220px] flex flex-col items-center justify-center overflow-hidden group">
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
                        <span className="text-xs text-gray-500 block mb-1">Click to upload image</span>
                        <span className="text-[10px] text-gray-400 block">PNG, JPG, JPEG, WEBP (Max 1MB)</span>
                      </div>
                    )}
                    <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" onChange={(e) => handleImageSelect(e, null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Blog Title *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Enter title" required />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                    <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="e.g. Karate" required />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Short Description *</label>
                    <textarea name="short_description" value={formData.short_description} onChange={handleInputChange} rows="3" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Brief summary of the blog post" required />
                  </div>

                  <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleInputChange} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
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
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600 font-medium">Build your article structure by setting up section layout maps.</p>
                <button type="button" onClick={addContentBlock} className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
                  <Plus size={16} /> Add New Block Section
                </button>
              </div>

              <div className="space-y-6">
                {contentBlocks.map((block, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-5 relative shadow-sm group">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button type="button" onClick={() => removeContentBlock(idx)} className="text-gray-400 hover:text-red-500 p-1.5 bg-white rounded shadow-sm border border-gray-200">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Left Side: Optional Image Upload Section */}
                      <div className="lg:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Section Image (Optional)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white relative h-36 flex flex-col items-center justify-center overflow-hidden hover:bg-gray-50 transition-colors group/img">
                          {block.preview ? (
                            <>
                              <img src={block.preview} alt="Section Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                <button type="button" onClick={() => removeImage(idx)} className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-2">
                              <Upload size={18} className="mx-auto text-gray-400 mb-1" />
                              <span className="text-[10px] text-gray-500 block">Max: 1MB</span>
                            </div>
                          )}
                          <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" onChange={(e) => handleImageSelect(e, idx)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                      </div>

                      {/* Right Side: Title (Mandatory) & Content items arrays */}
                      <div className="lg:col-span-3 space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Section Title *</label>
                          <input type="text" value={block.title} onChange={(e) => updateBlockTitle(idx, e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="e.g. Benefits of Karate (Required)" />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Paragraphs Descriptions</label>
                            <button type="button" onClick={() => addParagraph(idx)} className="text-xs flex items-center gap-1 text-orange-600 hover:text-orange-700 font-bold">
                              <PlusCircle size={13} /> Add Paragraph
                            </button>
                          </div>
                          <div className="space-y-2">
                            {block.description.map((pText, pIdx) => (
                              <div key={pIdx} className="flex gap-2 items-start">
                                <textarea rows="2" value={pText} onChange={(e) => updateParagraph(idx, pIdx, e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder={`Paragraph text entry field #${pIdx + 1}`} />
                                <button type="button" onClick={() => removeParagraph(idx, pIdx)} className="p-2 text-gray-400 hover:text-red-500 mt-1">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Keypoints Bullets</label>
                            <button type="button" onClick={() => addKeypoint(idx)} className="text-xs flex items-center gap-1 text-orange-600 hover:text-orange-700 font-bold">
                              <PlusCircle size={13} /> Add Keypoint
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {block.keypoints.map((kText, kIdx) => (
                              <div key={kIdx} className="flex gap-2 items-center">
                                <input type="text" value={kText} onChange={(e) => updateKeypoint(idx, kIdx, e.target.value)} className="w-full border border-gray-300 rounded-lg p-1.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder={`Key point info bullet #${kIdx + 1}`} />
                                <button type="button" onClick={() => removeKeypoint(idx, kIdx)} className="text-gray-400 hover:text-red-500">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
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
                  <input type="text" name="meta_title" value={formData.meta_title} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="SEO Title Tag" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Description</label>
                  <textarea name="meta_description" value={formData.meta_description} onChange={handleInputChange} rows="3" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="SEO Summary Snippet Description" />
                </div>

                {/* Tag Box Inputs and Keyword Suggestions row layouts */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Tag size={16} className="text-gray-500" /> Meta Keywords / Article Tags
                  </label>
                  <span className="text-[11px] text-gray-400 block mb-2 font-medium">Type a tag name and hit Enter or Comma ( , ) to log it.</span>
                  
                  {/* Interactive Multi-Colored Box Input Field */}
                  <div className="w-full border border-gray-300 bg-white rounded-lg p-2 flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 min-h-[44px]">
                    {tags.map((tag, tIdx) => {
                      const color = TAG_COLORS[tag.colorIdx || 0];
                      return (
                        <span key={tIdx} className={`inline-flex items-center gap-1 border px-2.5 py-1 rounded-md text-xs font-bold tracking-wide shadow-sm transition-all ${color.bg} ${color.text} ${color.border}`}>
                          {tag.text}
                          <button type="button" onClick={() => removeTag(tIdx)} className="hover:opacity-70 focus:outline-none ml-0.5">
                            <X size={12} className="stroke-[3]" />
                          </button>
                        </span>
                      );
                    })}
                    <input 
                      type="text" 
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleTagKeyDown}
                      className="flex-1 min-w-[120px] bg-transparent text-sm focus:outline-none border-none p-0 focus:ring-0" 
                      placeholder={tags.length === 0 ? "e.g. self defense, fitness" : "Add more tags..."} 
                    />
                  </div>

                  {/* Smart Suggestion Tags Container */}
                  <div className="mt-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Suggested Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_TAGS.map((sTag) => {
                        const isAlreadySelected = tags.some(t => t.text === sTag);
                        return (
                          <button
                            key={sTag}
                            type="button"
                            disabled={isAlreadySelected}
                            onClick={() => addTag(sTag)}
                            className={`text-xs px-2.5 py-1 rounded-full border transition-all font-semibold ${
                              isAlreadySelected 
                                ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600 shadow-sm'
                            }`}
                          >
                            + {sTag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              Cancel
            </button>
            
            {activeTab !== 'seo' ? (
              <button 
                type="button" 
                onClick={handleNextStep} 
                className="px-6 py-2 text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors shadow-md flex items-center gap-2"
              >
                Next Step <ArrowRight size={15} />
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleSubmit} 
                disabled={loading} 
                className="px-6 py-2 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors shadow-md disabled:opacity-70 flex items-center gap-2"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Processing...</>
                ) : (
                  <><Save size={15} /> {blogData ? 'Save Changes' : 'Create Blog Post'}</>
                )}
              </button>
            )}
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BlogModal;