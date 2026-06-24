import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios'; 

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch blogs dynamically from backend API
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAllBlogs = async () => {
      try {
        const response = await api.get('/blogs');
        // Unpack payload dynamically depending on backend wrapper resource configurations
        const fetchedData = Array.isArray(response.data) ? response.data : (response.data.data || []);
        
        // Filter: Keep only published entries active
        const publishedBlogs = fetchedData.filter(b => b.is_published);
        setBlogs(publishedBlogs);
      } catch (error) {
        console.error("Error retrieving dynamic article payloads collection:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBlogs();
  }, []);

  // 1. Get explicitly featured blogs
  const featuredBlogs = blogs.filter(b => b.featured || b.is_featured === true || b.is_featured === 1);
  
  // 2. Assign slider blogs (max 2 items)
  const finalFeatured = featuredBlogs.length > 0 ? featuredBlogs.slice(0, 2) : blogs.slice(0, 2);
  
  // 3. FIXED: If total blogs count is low (e.g., 3 or less), let them show in the grid as well 
  // so the "Latest Articles" section never stays empty.
  const remainingBlogs = blogs.length <= 3 
    ? blogs 
    : blogs.filter(b => !finalFeatured.some(f => f.id === b.id)).slice(0, 9);

  // Auto-advance slider hook
  useEffect(() => {
    if (finalFeatured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % finalFeatured.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [finalFeatured.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <span className="w-10 h-10 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden w-full min-h-screen bg-[#f8f9fa] pt-24 pb-20 font-sans">
      {/* MASSIVE BACKGROUND TEXT */}
      <div className="fixed top-[35vh] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-black/[0.03] uppercase tracking-tighter pointer-events-none z-0 whitespace-nowrap select-none">
        BLOG
      </div>
      
      <div className="global-container max-w-7xl mx-auto px-4 sm:px-6 lg:!px-[8rem] ">
        
        {/* HEADER */}
        <div className="mb-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col items-start mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-1 w-12 bg-[var(--color-primary2)]"></div>
                <h3 className="text-[var(--color-primary2)] font-bold tracking-[0.2em] uppercase text-sm">Blog & Newsroom</h3>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter text-black">
                OUR <span className="text-[var(--color-primary)]">BLOG</span>
              </h2>
            </div>
          </motion.div>
        </div>

        {/* FEATURED SLIDER */}
        {finalFeatured.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mb-20 border border-gray-100 relative z-10"
          >
            <div className="relative h-[600px] md:h-[500px] w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 flex flex-col md:flex-row h-full w-full"
                >
                  {/* Text Side (Light Theme) */}
                  <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-12 lg:p-16 flex flex-col justify-center order-2 md:order-1 bg-white">
                    <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4">
                      {finalFeatured[currentSlide].category}
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0b1b24] mb-4 leading-tight tracking-tight">
                      {finalFeatured[currentSlide].title}
                    </h2>
                    <p className="text-gray-600 mb-8 text-sm md:text-base lg:text-lg leading-relaxed line-clamp-3">
                      {finalFeatured[currentSlide].short_description}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {finalFeatured[currentSlide].posted_date}
                      </span>
                      {/* Navigating cleanly via dynamic ID route bindings */}
                      <Link 
                        to={`/blog/${finalFeatured[currentSlide].id}`}
                        className="text-sm font-bold text-white bg-[#0b1b24] hover:bg-[var(--color-primary)] px-6 py-3 rounded-lg transition-colors shadow-md"
                      >
                        Read Article
                      </Link>
                    </div>
                  </div>
                  
                  {/* Image Side */}
                  <div className="w-full md:w-1/2 h-1/2 md:h-full order-1 md:order-2 relative bg-gray-100">
                    <img 
                      src={finalFeatured[currentSlide].featured_image} 
                      alt={finalFeatured[currentSlide].title} 
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Indicators */}
            <div className="absolute bottom-6 left-0 right-0 md:left-8 md:right-auto md:w-1/2 flex justify-center md:justify-start gap-2 z-10 px-8">
              {finalFeatured.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === idx ? 'w-8 bg-[var(--color-primary)]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* LATEST ARTICLES HEADING SECTION */}
        <div className="mb-8 flex items-center justify-between relative z-10">
          <h3 className="text-2xl font-bold text-[#0b1b24]">Latest Articles</h3>
          <div className="h-px bg-gray-200 flex-grow ml-6 hidden sm:block"></div>
        </div>
        
        {/* THUMBNAIL GRID SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {remainingBlogs.map((blog, idx) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              {/* Navigating cleanly via dynamic ID route bindings */}
              <Link to={`/blog/${blog.id}`} className="flex flex-col h-full">
                {/* Image Area */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                  <img 
                    src={blog.featured_image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                     <span className="text-[10px] font-bold text-[#0b1b24] uppercase tracking-wider">
                      {blog.category}
                    </span>
                  </div>
                </div>
                {/* Text Context Content Container */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      {blog.posted_date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0b1b24] leading-tight mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                    {blog.short_description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* EMPTY STATE CONTEXT CHECKS */}
        {blogs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm relative z-10">
            <p className="text-gray-500 text-lg font-medium">No published blog posts found.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogPage;