import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import PaginationComponent from '../../components/PaginationComponent';

const formatCategory = (str) =>
  str
    ? str
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
    : '';

// Static category tabs — value must match what's stored in blog.category on the backend
const categories = [
  { label: 'All', value: 'all' },
  { label: 'Martial Arts Training', value: 'martial_arts_training' },
  { label: 'Self Defense', value: 'self_defense' },
  { label: 'Fitness Conditioning', value: 'fitness_conditioning' },
  { label: 'Nutrition Wellness', value: 'nutrition_wellness' },
  { label: 'Competitions Events', value: 'competitions_events' },
  { label: 'Kids Martial Arts', value: 'kids_martial_arts' },
  { label: 'Womens Martial Arts', value: 'womens_martial_arts' },
  { label: 'Mindset Discipline', value: 'mindset_discipline' },
  { label: 'Instructor Tips', value: 'instructor_tips' },
  { label: 'Academy News', value: 'academy_news' },

];

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );

  // Fetch blogs from backend, filtered by category when one is selected
  const fetchAllBlogs = async () => {
    setLoading(true);
    try {
      const categoryQuery =
        selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
      const response = await api.get(`/blogs?page=${page}&per_page=8${categoryQuery}`);
      const fetchedData = Array.isArray(response.data) ? response.data : (response.data.data || []);
      const publishedBlogs = fetchedData.filter(b => b.is_published);
      setBlogs(publishedBlogs);
      setPagination(response?.data?.pagination);
    } catch (error) {
      console.error("Error retrieving dynamic article payloads collection:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'all';
    if (urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
      setPage(1);
      setCurrentSlide(0);
    }
  }, [searchParams]);

  // Re-fetch every time page OR category changes
  useEffect(() => {
    fetchAllBlogs();
  }, [page, selectedCategory]);

  useEffect(() => {
    if (blogs.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % blogs.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [currentSlide, blogs.length]);

  const handleCategoryChange = (value) => {
    if (value === selectedCategory) return;
    setSelectedCategory(value);
    setPage(1);
    setCurrentSlide(0);
    if (value === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: value });
    }
  };

  const finalFeatured = blogs;
  const remainingBlogs = blogs;

  const BlogPageSkeleton = () => (
    <div className="relative overflow-hidden w-full min-h-screen bg-[#f8f9fa] pt-24 pb-20 font-sans animate-fadeIn">
      <div className="global-container max-w-7xl mx-auto px-4 sm:px-6 lg:!px-[8rem]">
        <div className="mb-12">
          <div className="flex flex-col items-start mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-1 w-12 bg-gray-200" />
              <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-10 md:h-16 w-64 md:w-96 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="flex gap-3 mb-10">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-9 w-24 bg-gray-200 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="relative w-full bg-white rounded-3xl shadow-sm overflow-hidden mb-20 border border-gray-100">
          <div className="relative h-[600px] md:h-[500px] w-full flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-12 lg:p-16 flex flex-col justify-center order-2 md:order-1 bg-white">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-9 md:h-12 w-full bg-gray-200 rounded-lg animate-pulse mb-3" />
              <div className="h-9 md:h-12 w-2/3 bg-gray-200 rounded-lg animate-pulse mb-6" />
              <div className="space-y-2 mb-8">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="w-full md:w-1/2 h-1/2 md:h-full order-1 md:order-2 bg-gray-200 animate-pulse" />
          </div>
        </div>
        <div className="mb-8 flex items-center justify-between">
          <div className="h-7 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-px bg-gray-200 flex-grow ml-6 hidden sm:block" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
              <div className="relative w-full aspect-[4/3] bg-gray-200 animate-pulse" />
              <div className="p-6 md:p-8 flex flex-col flex-grow gap-3">
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
  );

  // Full skeleton only on the very first load ever
  if (loading && page === 1 && selectedCategory === 'all' && blogs.length === 0 && pagination.total === undefined) {
    return <BlogPageSkeleton />;
  }

  return (
    <div className="relative overflow-hidden w-full min-h-screen bg-[#f8f9fa] pt-24 pb-20 font-sans">
      <div className="fixed top-[35vh] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-black/[0.03] uppercase tracking-tighter pointer-events-none z-0 whitespace-nowrap select-none">
        BLOG
      </div>

      <div className="global-container max-w-7xl mx-auto px-4 sm:px-6 lg:!px-[8rem] ">

        {/* HEADER */}
        <div className="mb-8 relative z-10">
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

        {/* CATEGORY TABS */}
        <div className="flex flex-row overflow-x-scroll scrollbar-track-transparent gap-3 mb-10 relative z-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              disabled={loading}
              className={`px-5 py-2 rounded-full text-sm font-semibold text-nowrap tracking-wider transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${selectedCategory === cat.value
                ? 'bg-[#0b1b24] text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FEATURED SLIDER */}
        {loading ? (
          <div className="relative w-full h-[600px] md:h-[500px] bg-white rounded-3xl shadow-sm overflow-hidden mb-20 border border-gray-100 flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-12 lg:p-16 flex flex-col justify-center order-2 md:order-1 bg-white">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-9 md:h-12 w-full bg-gray-200 rounded-lg animate-pulse mb-3" />
              <div className="h-9 md:h-12 w-2/3 bg-gray-200 rounded-lg animate-pulse mb-6" />
              <div className="space-y-2 mb-8">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
              </div>
            </div>
            <div className="w-full md:w-1/2 h-1/2 md:h-full order-1 md:order-2 bg-gray-200 animate-pulse" />
          </div>
        ) : finalFeatured.length > 0 && (
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
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0 flex flex-col md:flex-row h-full w-full"
                >
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
                      <Link
                        to={`/blog/${finalFeatured[currentSlide].id}`}
                        className="text-sm font-bold text-white bg-[#0b1b24] hover:bg-[var(--color-primary)] px-6 py-3 rounded-lg transition-colors shadow-md"
                      >
                        Read Article
                      </Link>
                    </div>
                  </div>

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

            <div className="absolute bottom-6 left-0 right-0 md:left-8 md:right-auto md:w-1/2 flex justify-center md:justify-start gap-2 z-10 px-8">
              {finalFeatured.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-[var(--color-primary)]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* LATEST ARTICLES HEADING */}
        <div className="mb-8 flex items-center justify-between relative z-10">
          <h3 className="text-2xl font-bold text-[#0b1b24]">
            {selectedCategory === 'all'
              ? 'Latest Articles'
              : categories.find(c => c.value === selectedCategory)?.label}
          </h3>
          <div className="h-px bg-gray-200 flex-grow ml-6 hidden sm:block"></div>
        </div>

        {/* THUMBNAIL GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                <div className="relative w-full aspect-[4/3] bg-gray-200 animate-pulse" />
                <div className="p-6 md:p-8 flex flex-col flex-grow gap-3">
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-5/6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
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
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={blog.featured_image}
                      alt={blog.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-[10px] font-bold text-[#0b1b24] uppercase tracking-wider">
                        {formatCategory(blog.category)}
                      </span>
                    </div>
                  </div>
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
        )}

        <div className="mt-8">
          {!loading && blogs.length > 0 && pagination?.total > 0 && (
            <PaginationComponent
              pagination={pagination}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </div>

        {!loading && blogs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm relative z-10">
            <p className="text-gray-500 text-lg font-medium">
              {selectedCategory === 'all'
                ? 'No published blog posts found.'
                : `No published posts found in "${categories.find(c => c.value === selectedCategory)?.label}".`}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogPage;