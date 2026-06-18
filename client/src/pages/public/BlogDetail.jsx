import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogData } from '../../data/blogData';

const BlogDetail = () => {
  const { id } = useParams();
  const blog = blogData.find(b => b.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center pt-20">
        <h1 className="text-4xl text-[#0b1b24] font-black uppercase">Article Not Found</h1>
        <Link to="/blog" className="mt-6 text-[#26c0ff] hover:text-[#0b1b24] font-bold transition-colors">Return to Blog</Link>
      </div>
    );
  }

  // Get 6 related blogs (excluding current)
  const relatedBlogs = blogData.filter(b => b.id !== id).slice(0, 6);

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] text-[#0b1b24] font-sans">
      
      {/* HERO SECTION */}
      <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img 
          src={blog.image} 
          alt={blog.title} 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 md:pb-24">
          {/* Aligned with Navbar */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#26c0ff] text-white text-[10px] md:text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-sm shadow-md">
                  {blog.category}
                </span>
                <span className="text-white text-xs md:text-sm font-medium tracking-wide drop-shadow-md">
                  {blog.date}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-4 drop-shadow-lg">
                {blog.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-100 font-medium max-w-2xl drop-shadow-md border-l-4 border-[#26c0ff] pl-4">
                {blog.subtitle}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="w-full py-12 md:py-20">
        {/* Aligned with Navbar, removed the white card, writing directly on background */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full text-lg leading-relaxed text-gray-600"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </div>

      {/* RELATED BLOGS */}
      <div className="w-full bg-white py-16 md:py-24 border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-1 w-12 bg-[#26c0ff]"></div>
            <h3 className="text-[#0b1b24] text-2xl md:text-3xl font-black tracking-tight">
              Related Articles
            </h3>
          </div>

          {/* Changed to max 6 columns depending on layout, usually 3 is good for a row, so 2 rows of 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {relatedBlogs.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <Link to={`/blog/${item.id}`} className="flex flex-col h-full">
                  <div className="relative h-48 md:h-56 overflow-hidden bg-gray-100">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                      <span className="text-[10px] font-bold text-[#0b1b24] uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        {item.date}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-[#0b1b24] leading-tight mb-3 group-hover:text-[#26c0ff] transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default BlogDetail;
