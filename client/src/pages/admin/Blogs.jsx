import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Globe, EyeOff, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import BlogModal from '../../components/admin/blogs/BlogModal';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blogs');
      setBlogs(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  const openCreateModal = () => {
    setSelectedBlog(null);
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const filteredBlogs = blogs.filter(b => b.title?.toLowerCase().includes(search.toLowerCase()) || b.category?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Blog Management</h1>
          <p className="text-gray-500 mt-1">Create, edit, and manage articles on your website.</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search blogs..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
            />
          </div>
          <button 
            onClick={openCreateModal}
            className="shrink-0 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-orange-500/20"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Create Blog</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No blogs found</h3>
          <p className="text-gray-500 text-sm mb-6">Start writing articles to engage with your audience.</p>
          <button onClick={openCreateModal} className="text-orange-500 font-bold hover:text-orange-600 text-sm">
            + Create your first blog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
              {/* Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {blog.featured_image ? (
                  <img src={`http://localhost:8000/storage/${blog.featured_image}`} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded">
                    {blog.category}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{blog.posted_date}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                  {blog.short_description}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <button onClick={() => openEditModal(blog)} className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(blog.id)} className="flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Render Modal */}
      <BlogModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        blogData={selectedBlog} 
        fetchBlogs={fetchBlogs}
      />
    </div>
  );
};

export default Blogs;