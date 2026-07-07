import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Edit2,
  Tag,
  Calendar,
  Layers,
  FileText,
  Search,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Eye,
  Link2,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../api/axios";

const parseList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return typeof val === "string" ? val.split(",").map((v) => v.trim()) : [];
  }
};

const parseContent = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "Not set";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "Not set";
  try {
    return new Date(dateStr.replace(" ", "T")).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

// blogId: id of the blog to view (fetched fresh from API).
const ViewBlogModal = ({ isOpen, onClose, blogId, onEdit }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && blogId) {
      fetchBlog();
    }
    if (!isOpen) {
      setBlog(null);
    }
  }, [isOpen, blogId]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/blogs/${blogId}`);
      setBlog(res?.data?.data || res?.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load blog details");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const tags = blog ? parseList(blog.meta_keywords) : [];
  const content = blog ? parseContent(blog.content) : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-xl z-50 overflow-hidden"
          >
            {loading || !blog ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-orange-100 flex items-center justify-center text-[#f97316] font-bold overflow-hidden">
                      {blog.featured_image ? (
                        <img
                          src={blog.featured_image}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.replaceWith(
                              Object.assign(document.createElement("div"), {
                                className: "flex items-center justify-center w-full h-full",
                              })
                            );
                          }}
                        />
                      ) : (
                        <ImageIcon size={20} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight truncate">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium truncate flex items-center gap-1">
                        <Link2 size={11} className="shrink-0" />
                        {blog.slug || "no-slug"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="shrink-0 text-gray-400 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 p-2 rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[65vh] overflow-y-auto scrollbar-thin space-y-6">
                  {/* Stat cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50">
                      <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Layers size={12} /> Category
                      </p>
                      <p className="text-sm font-semibold text-indigo-900 truncate">
                        {blog.category || "Not set"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Calendar size={12} /> Posted
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(blog.posted_date)}
                      </p>
                    </div>
                    <div className="bg-sky-50/50 p-3 rounded-xl border border-sky-100/50">
                      <p className="text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Eye size={12} /> Views
                      </p>
                      <p className="text-sm font-semibold text-sky-900">
                        {blog.views ?? 0}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-xl border ${
                        blog.is_published
                          ? "bg-emerald-50/50 border-emerald-100/50"
                          : "bg-amber-50/50 border-amber-100/50"
                      }`}
                    >
                      <p
                        className={`text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1 ${
                          blog.is_published ? "text-emerald-400" : "text-amber-500"
                        }`}
                      >
                        {blog.is_published ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        Status
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          blog.is_published ? "text-emerald-900" : "text-amber-900"
                        }`}
                      >
                        {blog.is_published ? "Published" : "Draft"}
                      </p>
                    </div>
                  </div>

                  {/* Short description */}
                  {blog.short_description && (
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <FileText size={12} /> Short Description
                      </p>
                      <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-4">
                        <p className="text-sm text-orange-800 leading-relaxed">
                          {blog.short_description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Content sections */}
                  {content.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Layers size={12} /> Content Sections ({content.length})
                      </p>
                      <div className="space-y-3">
                        {content.map((block, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 border border-gray-100 rounded-2xl p-4"
                          >
                            <div className="flex gap-3">
                              {block.image && (
                                <img
                                  src={block.image}
                                  alt={block.title}
                                  className="w-16 h-16 rounded-lg object-cover shrink-0 border border-gray-200"
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-gray-900 mb-1 truncate">
                                  {block.title || `Section ${idx + 1}`}
                                </p>
                                {Array.isArray(block.description) &&
                                  block.description.filter(Boolean).length > 0 && (
                                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                                      {block.description.filter(Boolean).join(" ")}
                                    </p>
                                  )}
                                {Array.isArray(block.keypoints) &&
                                  block.keypoints.filter(Boolean).length > 0 && (
                                    <ul className="mt-2 grid grid-cols-2 gap-1">
                                      {block.keypoints.filter(Boolean).map((kp, kIdx) => (
                                        <li
                                          key={kIdx}
                                          className="text-[11px] text-gray-500 flex items-start gap-1"
                                        >
                                          <span className="text-orange-400 mt-0.5">•</span>
                                          <span className="truncate">{kp}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SEO */}
                  {(blog.meta_title || blog.meta_description || tags.length > 0) && (
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Search size={12} /> SEO Details
                      </p>
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                        {blog.meta_title && (
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">
                              Meta Title
                            </p>
                            <p className="text-sm text-gray-800">{blog.meta_title}</p>
                          </div>
                        )}
                        {blog.meta_description && (
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">
                              Meta Description
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {blog.meta_description}
                            </p>
                          </div>
                        )}
                        {tags.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 flex items-center gap-1">
                              <Tag size={11} /> Keywords
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {tags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-xs font-semibold px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Clock size={12} /> Timestamps
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">
                          Created At
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {formatDateTime(blog.created_at)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">
                          Updated At
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {formatDateTime(blog.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm shadow-sm"
                  >
                    Close
                  </button>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(blog.id)}
                      className="px-5 py-2.5 bg-[#f97316] text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm flex items-center gap-2"
                    >
                      <Edit2 size={16} /> Edit Blog
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ViewBlogModal;