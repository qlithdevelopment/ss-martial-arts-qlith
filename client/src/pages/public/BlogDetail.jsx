import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation,useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight,ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import { formatDate } from '../../components/CommonFormats.js';

const BlogBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin/blog");

  const handleBack = () => {
    navigate(isAdmin ? "/admin/blogs" : "/blog");
  };

  return (
    <button
      onClick={handleBack}
      className={`z-50 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 text-gray-700 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all ${
        isAdmin
          ? "relative  mb-8 lg:mb-44 lg:-ml-14"
          : "relative w-20  my-8 "
      }`}
    >
      <ArrowLeft size={16} /> Back
    </button>
  );
};


const formatCategory = (str) =>
  str
    ? str
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
    : '';

const BlogDetail = () => {
  const { id } = useParams();
  const location = useLocation();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [relatedTotalCount, setRelatedTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [contentBlocks, setContentBlocks] = useState([]);

  const isAdminView = location.pathname.startsWith('/admin');

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchBlogData = async () => {
      try {
        setLoading(true);

        // 1. Fetch the blog itself
        const response = await api.get(`/blogs/${id}`);
        const currentBlog = response?.data?.data ?? response?.data ?? null;
        setBlog(currentBlog);

        if (!currentBlog) return;

        // 2. Parse this blog's own content blocks (array or JSON string)
        let parsedContent = [];
        if (Array.isArray(currentBlog.content)) {
          parsedContent = currentBlog.content;
        } else if (typeof currentBlog.content === 'string') {
          try {
            parsedContent = JSON.parse(currentBlog.content);
          } catch (e) {
            console.error("Failed to parse blog.content JSON string", e);
          }
        }
        setContentBlocks(parsedContent);

        // 3. Fetch other blogs in the same category for "Related Articles"
        const collectionResponse = await api.get(`/blogs?category=${currentBlog.category}`);
        const collectionPayload = collectionResponse?.data?.data ?? collectionResponse?.data ?? [];
        const allBlogs = Array.isArray(collectionPayload) ? collectionPayload : [];

        // Only exclude the current blog itself — rest is shown exactly as fetched
        const sameCategoryBlogs = allBlogs.filter((b) => String(b.id) !== String(currentBlog.id));

        setRelatedTotalCount(sameCategoryBlogs.length);
        setRelatedBlogs(sameCategoryBlogs.slice(0, 3));
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

  const BlogDetailSkeleton = () => (
    <div className="w-full min-h-screen bg-[#f8f9fa] animate-fadeIn">
      {/* Hero Skeleton */}
      <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute global-container lg:!px-14 inset-0 flex flex-col justify-end pb-12 md:pb-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-6 w-24 bg-white/30 rounded-sm" />
                <div className="h-4 w-20 bg-white/30 rounded-sm" />
              </div>
              <div className="h-10 md:h-14 w-3/4 bg-white/30 rounded-lg" />
              <div className="h-10 md:h-14 w-1/2 bg-white/30 rounded-lg" />
              <div className="h-5 w-2/3 bg-white/20 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Blocks Skeleton */}
      <div className="w-full global-container lg:!px-14 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-6">
              <div className="h-8 w-1/3 bg-gray-200 rounded-lg animate-pulse pb-3 border-b border-gray-200" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="mt-6 bg-white border border-gray-100 p-6 rounded-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Array.from({ length: 4 }).map((_, k) => (
                        <div key={k} className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1 rounded-2xl overflow-hidden bg-gray-200 animate-pulse aspect-[4/3] lg:aspect-square" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Blogs Skeleton (skip entirely for admin view) */}
      {!isAdminView && (
        <div className="w-full global-container lg:!px-14 bg-white py-16 md:py-24 border-t border-gray-100 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-1 w-12 bg-gray-200" />
              <div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 bg-white">
                  <div className="h-48 md:h-56 bg-gray-200 animate-pulse" />
                  <div className="p-6 md:p-8 space-y-3">
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-5/6 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );


  if (loading) {
    return <BlogDetailSkeleton />;
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center pt-20">
        <h1 className="text-4xl text-[#0b1b24] font-black uppercase">Article Not Found</h1>
        <Link to="/blog" className="mt-6 text-[var(--color-primary)] hover:text-[#0b1b24] font-bold transition-colors">Return to Blog</Link>
      </div>
    );
  }

  const showViewMore = relatedTotalCount > 3;

  return (
    <div className="w-full min-h-screenn  bg-[#f8f9fa] text-[#0b1b24] font-sans">

      {/* HERO SECTION */}
      <div className="relative w-full  h-[50vh] md:h-[45vh] lg:h-[65vh] overflow-hidden">        
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          src={blog.featured_image}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
         
        <div className="absolute global-container !py-10 lg:!px-14 inset-0 z-20 flex flex-col justify-end pb-12 md:pb-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
               <BlogBackButton />
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[var(--color-primary)] text-white text-[10px] md:text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-sm shadow-md">
                  {formatCategory(blog?.category)}
                </span>
                <span className="text-white text-xs md:text-sm font-medium tracking-wide drop-shadow-md">
                  
                    {formatDate(blog?.posted_date)}
                  
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-4 drop-shadow-lg">
                {blog?.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-100 font-medium max-w-2xl drop-shadow-md border-l-4 border-[var(--color-primary)] pl-4">
                {blog?.short_description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CONTENT BLOCKS */}
      <div className="w-full global-container lg:!px-14 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full text-lg leading-relaxed text-gray-600 space-y-16"
          >
            {contentBlocks.map((block, index) => {
              const hasTitle = block.title && block.title.trim() !== '';
              const hasKeypoints = block.keypoints && Array.isArray(block.keypoints) && block.keypoints.length > 0;
              const hasImage = block.image && block.image.trim() !== '';

              return (
                <div key={index} className="space-y-6">
                  {/* Block Title */}
                  {hasTitle && (
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight text-[#0b1b24] uppercase border-b pb-3 border-gray-200">
                      {block.title}
                    </h2>
                  )}

                  <div className={`grid grid-cols-1 ${hasImage ? 'lg:grid-cols-3' : 'grid-cols-1'} gap-8 items-start`}>

                    {/* Description + keypoints */}
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

                    {/* Optional side image */}
                    {hasImage && (
                      <div className="lg:col-span-1 rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-gray-50 aspect-[4/3] lg:aspect-square">
                        <img
                          src={block.image}
                          alt={block.title || "Section visual"}
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

      {/* RELATED BLOGS (same category) — hidden when viewed from admin */}
      {!isAdminView && relatedBlogs.length > 0 && (
        <div className="w-full global-container lg:!px-14 bg-white py-16 md:py-24 border-t border-gray-100 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-1 w-12 bg-[var(--color-primary)]"></div>
              <h3 className="text-[#0b1b24] text-2xl md:text-3xl font-black tracking-tight">
                Related Articles
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
                          {formatCategory(item.category)}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">                         
                            {item.posted_date}                          
                        </span>
                      </div>
                      <h4 className="text-md font-bold text-[#0b1b24] leading-tight mb-3 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                        {item.short_description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}

              {/* View More tile — shown only if this category has more than 3 other published articles */}
              {showViewMore && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: relatedBlogs.length * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link
                    to={`/blog?category=${blog.category}`}
                    className="h-full min-h-[280px] flex flex-col items-center justify-center gap-3 rounded-2xl transition-all duration-300 text-center p-8"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary2 border-gray-200 group-hover:border-[var(--color-primary)] group-hover:bg-[var(--color-primary)] flex items-center justify-center shadow-sm transition-colors duration-300">
                      <ArrowRight size={20} className="text-white group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-widest text-[#020000] group-hover:text-[var(--color-primary)] transition-colors">
                        View More
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        More in {formatCategory(blog.category)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BlogDetail;