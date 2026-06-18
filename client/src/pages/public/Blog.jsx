import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { blogData } from '../../data/blogData';

const BlogPage = () => {
  const featuredBlogs = blogData.filter(b => b.featured);
  const remainingBlogs = blogData.filter(b => !b.featured).slice(0, 9);
  
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-advance slider
  useEffect(() => {
    if (featuredBlogs.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredBlogs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredBlogs.length]);

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] flex flex-col pt-24 pb-20 font-sans">
      <div className="global-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0b1b24] tracking-tight mb-4"
          >
            Blog & <span className="text-[#26c0ff]">Newsroom</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 font-medium text-lg max-w-2xl mx-auto"
          >
            Insights, training guides, and resources from the leaders in martial arts and athletic development.
          </motion.p>
        </div>

        {/* FEATURED SLIDER */}
        {featuredBlogs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mb-20 border border-gray-100"
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
                    <span className="text-xs font-bold text-[#26c0ff] uppercase tracking-widest mb-4">
                      {featuredBlogs[currentSlide].category}
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0b1b24] mb-4 leading-tight tracking-tight">
                      {featuredBlogs[currentSlide].title}
                    </h2>
                    <p className="text-gray-600 mb-8 text-sm md:text-base lg:text-lg leading-relaxed line-clamp-3">
                      {featuredBlogs[currentSlide].subtitle}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {featuredBlogs[currentSlide].date}
                      </span>
                      <Link 
                        to={`/blog/${featuredBlogs[currentSlide].id}`}
                        className="text-sm font-bold text-white bg-[#0b1b24] hover:bg-[#26c0ff] px-6 py-3 rounded-lg transition-colors shadow-md"
                      >
                        Read Article
                      </Link>
                    </div>
                  </div>
                  
                  {/* Image Side */}
                  <div className="w-full md:w-1/2 h-1/2 md:h-full order-1 md:order-2 relative bg-gray-100">
                    <img 
                      src={featuredBlogs[currentSlide].image} 
                      alt={featuredBlogs[currentSlide].title} 
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Subtle gradient overlay to blend image edge if needed, though clean cut is also modern */}
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Indicators */}
            <div className="absolute bottom-6 left-0 right-0 md:left-8 md:right-auto md:w-1/2 flex justify-center md:justify-start gap-2 z-10 px-8">
              {featuredBlogs.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === idx ? 'w-8 bg-[#26c0ff]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* THUMBNAIL GRID (9 Cards) */}
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-[#0b1b24]">Latest Articles</h3>
          <div className="h-px bg-gray-200 flex-grow ml-6 hidden sm:block"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {remainingBlogs.map((blog, idx) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              <Link to={`/blog/${blog.id}`} className="flex flex-col h-full">
                {/* Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                     <span className="text-[10px] font-bold text-[#0b1b24] uppercase tracking-wider">
                      {blog.category}
                    </span>
                  </div>
                </div>
                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      {blog.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0b1b24] leading-tight mb-3 group-hover:text-[#26c0ff] transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                    {blog.subtitle}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default BlogPage;
