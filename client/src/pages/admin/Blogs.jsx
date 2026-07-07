import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Globe, EyeOff, Search, Eye } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import BlogModal from "../../components/admin/blogs/BlogModal";
import ViewBlogModal from "../../components/admin/blogs/ViewBlogModal";
import PaginationComponent from "../../components/PaginationComponent";
import ConfirmModal from "../../components/admin/reusecomponents/ConfirmationModal";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editBlogId, setEditBlogId] = useState(null);

  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  // Create/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // View modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewBlogId, setViewBlogId] = useState(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, [page, search]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/blogs?page=${page}&search=${search}`);

      setBlogs(res?.data?.data);
      setPagination(res?.data?.pagination);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setBlogToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`/blogs/${blogToDelete}`);
      toast.success('Blog deleted successfully');
      fetchBlogs();
      setIsDeleteModalOpen(false);
      setBlogToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete blog');
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Create / Edit modal ──────────────────────────────────────────────────
  const openCreateModal = () => {
    setEditBlogId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (id) => {
    setEditBlogId(id);
    setIsModalOpen(true);
  };

  const closeBlogModal = () => {
    setIsModalOpen(false);
    setEditBlogId(null);
  };

  // ── View modal ────────────────────────────────────────────────────────────
  const openViewModal = (id) => {
    setViewBlogId(id);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewBlogId(null);
  };

  // Called from within ViewBlogModal's "Edit" button
  const handleEditFromView = (id) => {
    closeViewModal();
    openEditModal(id);
  };

  return (
    <div className="">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">

        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="shrink-0 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-orange-500/20"
          >
            <Plus size={18} />{" "}
            <span className="hidden lg:inline">Create Blog</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border md:w-full border-gray-100 overflow-hidden shadow-sm flex flex-col animate-pulse"
            >
              {/* Image skeleton */}
              <div className="relative h-48 bg-gray-200 w-full">
                <div className="absolute top-3 right-3">
                  <div className="h-5 w-20 bg-gray-300 rounded-md"></div>
                </div>
              </div>

              {/* Body skeleton */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-3 w-14 bg-gray-100 rounded"></div>
                </div>

                <div className="space-y-2 mb-4 flex-1">
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                </div>

                {/* Actions skeleton */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 mt-auto">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No blogs found
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Start writing articles to engage with your audience.
          </p>
          <button
            onClick={openCreateModal}
            className="text-orange-500 font-bold hover:text-orange-600 text-sm"
          >
            + Create your first blog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-2xl border md:w-full border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
            >
              {/* Image */}
              <button
                onClick={() => openViewModal(blog.id)}
                className="relative h-48 bg-gray-100 overflow-hidden w-full text-left cursor-pointer"
              >
                {blog.featured_image ? (
                  <img
                    src={blog?.featured_image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Globe size={40} />
                  </div>
                )}
                {/* Status badge */}
                <div className="absolute top-3 right-3">
                  {blog.is_published ? (
                    <span className="bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Globe size={10} /> Published
                    </span>
                  ) : (
                    <span className="bg-gray-800/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <EyeOff size={10} /> Draft
                    </span>
                  )}
                </div>
              </button>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded">
                    {blog.category}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {blog.posted_date}
                  </span>
                </div>

                <h3
                  onClick={() => openViewModal(blog.id)}
                  className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2 cursor-pointer hover:text-orange-600 transition-colors"
                >
                  {blog.title}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                  {blog.short_description}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 mt-auto">

                  <button
                    onClick={() => openEditModal(blog.id)}
                    className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => openViewModal(blog.id)}
                    className="px-3 py-1.5 text-xs font-bold text-[#f97316] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-100 flex items-center gap-1"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
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

      {/* Create/Edit Modal */}
      <BlogModal
        isOpen={isModalOpen}
        onClose={closeBlogModal}
        blogId={editBlogId}
        fetchBlogs={fetchBlogs}
      />

      {/* View Modal */}
      <ViewBlogModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        blogId={viewBlogId}
        onEdit={handleEditFromView}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Blog?"
        message="Are you sure you want to delete this Blog? This action cannot be undone."
        type="delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Blogs;
