import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios'; 

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        // 1. Fetch data payload matching the route ID parameter parameter mapping
        const response = await api.get(`/blogs/${id}`);
        
        // Unpack payload data securely if Laravel resource wrappers are present
        let currentBlog = null;
        if (response.data) {
          currentBlog = response.data.data ? response.data.data : response.data;
        }
        setBlog(currentBlog);

        // 2. Fetch full global article index to dynamically compute recommendation modules
        const collectionResponse = await api.get('/blogs');
        const allBlogs = Array.isArray(collectionResponse.data) 
          ? collectionResponse.data 
          : (collectionResponse.data?.data || []);
        
        if (currentBlog) {
          const matchingRelated = allBlogs
            .filter(b => b.is_published && String(b.id) !== String(currentBlog.id))
            .slice(0, 6);
          setRelatedBlogs(matchingRelated);
        }
      } catch (error) {
        console.error("Error retrieving article item payload details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <span className="w-10 h-10 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center pt-20">
        <h1 className="text-4xl text-[#0b1b24] font-black uppercase">Article Not Found</h1>
        <Link to="/blog" className="mt-6 text-[var(--color-primary)] hover:text-[#0b1b24] font-bold transition-colors">Return to Blog</Link>
      </div>
    );
  }

  // Parse payload array matrices safely
  let contentBlocks = [];
  if (blog.content) {
    if (Array.isArray(blog.content)) {
      contentBlocks = blog.content;
    } else if (typeof blog.content === 'string') {
      try {
        contentBlocks = JSON.parse(blog.content);
      } catch (e) {
        console.error("Content string failed matrix collection translation parse routines", e);
      }
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] text-[#0b1b24] font-sans">
      
      {/* HERO SECTION */}
      <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img 
          src={blog.featured_image} 
          alt={blog.title} 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 md:pb-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[var(--color-primary)] text-white text-[10px] md:text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-sm shadow-md">
                  {blog.category}
                </span>
                <span className="text-white text-xs md:text-sm font-medium tracking-wide drop-shadow-md">
                  {blog.posted_date}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-4 drop-shadow-lg">
                {blog.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-100 font-medium max-w-2xl drop-shadow-md border-l-4 border-[var(--color-primary)] pl-4">
                {blog.short_description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* DYNAMIC MATRIX CONTENT BLOCKS RENDER SECTION */}
      <div className="w-full py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full text-lg leading-relaxed text-gray-600 space-y-16"
          >
            {contentBlocks.map((block, index) => {
              const hasTitle = block.title && block.title.trim() !== '';
              const hasDescription = Array.isArray(block.description) 
                ? block.description.some(p => p && p.trim() !== '') 
                : (block.description && block.description.trim() !== '');
              const hasKeypoints = block.keypoints && Array.isArray(block.keypoints) && block.keypoints.length > 0;
              const hasImage = block.image && block.image.trim() !== '';

              return (
                <div key={index} className="space-y-6">
                  {/* Block Title Header */}
                  {hasTitle && (
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight text-[#0b1b24] uppercase border-b pb-3 border-gray-200">
                      {block.title}
                    </h2>
                  )}

                  {/* Flexible Responsive Inner Column Layout grids */}
                  <div className={`grid grid-cols-1 ${hasImage ? 'lg:grid-cols-3' : 'grid-cols-1'} gap-8 items-start`}>
                    
                    {/* Descriptions Paragraph stacks and dynamic Bullet points sets items layout maps */}
                    <div className={hasImage ? 'lg:col-span-2 space-y-4' : 'space-y-4'}>
                      {Array.isArray(block.description) ? (
                        block.description.map((paragraph, pIdx) => (
                          paragraph && paragraph.trim() !== '' && (
                            <p key={pIdx} className="text-gray-600 text-base md:text-lg leading-relaxed">
                              {paragraph}
                            </p>
                          )
                        ))
                      ) : (
                        block.description && block.description.trim() !== '' && (
                          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                            {block.description}
                          </p>
                        )
                      )}

                      {/* Displaying bullet matrices maps if present */}
                      {hasKeypoints && (
                        <div className="mt-6 bg-white border border-gray-100 p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {block.keypoints.map((point, kIdx) => (
                              point && point.trim() !== '' && (
                                <li key={kIdx} className="flex items-start gap-3 text-sm md:text-base font-bold text-gray-700">
                                  <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0" />
                                  {point}
                                </li>
                              )
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Optional inline side block section media attachments image container */}
                    {hasImage && (
                      <div className="lg:col-span-1 rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-gray-50 aspect-[4/3] lg:aspect-square">
                        <img 
                          src={block.image} 
                          alt={block.title || "Section visual content component graphic block element element details attachment"} 
                          className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-500"
                        />
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* RELATED BLOGS */}
      <div className="w-full bg-white py-16 md:py-24 border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-1 w-12 bg-[var(--color-primary)]"></div>
            <h3 className="text-[#0b1b24] text-2xl md:text-3xl font-black tracking-tight">
              Related Articles
            </h3>
          </div>

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
                      src={item.featured_image} 
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
                        {item.posted_date}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-[#0b1b24] leading-tight mb-3 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                      {item.short_description}
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