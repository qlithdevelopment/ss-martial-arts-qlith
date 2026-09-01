import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../../api/axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

const getImageUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http")) return path;

  if (path.startsWith("/storage/")) {
    return `${BASE_URL}${path}`;
  }

  return `${BASE_URL}/storage/${path}`;
};

const BlogSkeleton = () => (
  <>
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 animate-pulse"
      >
        <div className="h-56 bg-white/10" />

        <div className="p-6 space-y-3">
          <div className="h-4 w-1/3 bg-white/10 rounded" />

          <div className="h-6 w-4/5 bg-white/10 rounded" />

          <div className="h-4 w-full bg-white/10 rounded" />

          <div className="h-4 w-2/3 bg-white/10 rounded" />
        </div>
      </div>
    ))}
  </>
);

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);

        const res = await api.get("/blogs", {
          params: {
            per_page: 4,
          },
        });

        const blogData = res?.data?.data || res?.data || [];

        setBlogs(blogData.slice(0, 4));
      } catch (error) {
        console.error("Failed to load blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section
      id="blog"
      className="overflow-hidden w-full min-h-screen bg-transparent flex flex-col justify-center py-16 md:py-24 lg:py-32"
    >
      <div className="global-container lg:!px-23 z-10 w-full">
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-1 w-12 bg-[#f97316]" />

            <h3 className="text-[#f97316] font-bold tracking-[0.2em] uppercase text-sm">
              From The Academy
            </h3>

            <div className="h-1 w-12 bg-[#f97316]" />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter text-center text-white">
            Latest <span className="text-[#26c0ff]">Blogs</span>
          </h2>

          <p className="text-gray-400 text-sm md:text-base text-center max-w-2xl mt-5">
            Discover training tips, martial arts insights, academy updates, and
            stories from our community.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <BlogSkeleton />
          ) : blogs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-sm">
                No blogs available at the moment.
              </p>
            </div>
          ) : (
            blogs.map((blog, index) => (
              <motion.article
                key={blog.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                  margin: "-50px",
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <Link to={`/blog/${blog.slug || blog.id}`}>
                  <div className="relative h-56 overflow-hidden">
                    {blog.featured_image ? (
                      <img
                        src={getImageUrl(blog.featured_image)}
                        alt={blog.title || "Blog"}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#15232d] flex items-center justify-center">
                        <span className="text-white/40 font-bold uppercase tracking-widest text-sm">
                          No Image
                        </span>
                      </div>
                    )}

                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6">
                  {/* Date */}
                  {blog.created_at && (
                    <p className="text-[#f97316] text-xs font-bold uppercase tracking-widest mb-3">
                      {new Date(blog.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}

                  {/* Title */}
                  <Link to={`/blog/${blog.slug || blog.id}`}>
                    <h3 className="text-lg md:text-xl font-black text-[#15232d] leading-tight line-clamp-2 group-hover:text-[#26c0ff] transition-colors duration-300">
                      {blog.title}
                    </h3>
                  </Link>

                  {/* Description */}
                  <p className="text-[#64748b] text-sm leading-relaxed mt-3 line-clamp-3">
                    {blog.short_description ||
                      blog.description ||
                      "Read more about our latest academy updates and martial arts insights."}
                  </p>

                  {/* Read More */}
                  <Link
                    to={`/blog/${blog.slug || blog.id}`}
                    className="inline-flex items-center gap-2 mt-5 text-[#15232d] font-bold text-xs uppercase tracking-widest group-hover:text-[#f97316] transition-colors duration-300"
                  >
                    Read More
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </motion.article>
            ))
          )}
        </div>

        {/* View More */}
        {!loading && blogs.length > 0 && (
          <div className="w-full flex justify-center mt-12">
            <Link
              to="/blog"
              className="text-white font-bold text-sm tracking-widest uppercase hover:text-[#f97316] transition-colors flex items-center gap-2 border-b-2 border-transparent hover:border-[#f97316] pb-1"
            >
              View More Blogs
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
