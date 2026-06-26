import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Search, CopyPlus, Edit2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AlbumModal from '../../components/admin/galleries/AlbumModal';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/storage/')) return `http://127.0.0.1:8000${path}`;
  return `http://127.0.0.1:8000/storage/${path}`;
};

const Galleries = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [viewAlbum, setViewAlbum] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const res = await api.get('/galleries');
      setAlbums(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load galleries');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium text-gray-900">Are you sure you want to delete this album?</p>
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/galleries/${id}`);
                toast.success('Album deleted successfully');
                fetchAlbums();
              } catch (error) {
                toast.error('Failed to delete album');
              }
            }} 
            className="px-3 py-1.5 text-xs font-bold text-white bg-red-500 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const openCreateModal = () => {
    setSelectedAlbum(null);
    setIsModalOpen(true);
  };

  const openEditModal = (album) => {
    setSelectedAlbum(album);
    setIsModalOpen(true);
  };

  const filteredAlbums = albums.filter(a => 
    a.name?.toLowerCase().includes(search.toLowerCase()) || 
    a.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gallery Management</h1>
          <p className="text-gray-500 mt-1">Upload and organize photo albums from dojo events.</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search albums..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
            />
          </div>
          <button 
            onClick={openCreateModal}
            className="shrink-0 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-orange-500/20"
          >
            <Plus size={18} /> <span className="hidden lg:inline">Create Album</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredAlbums.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CopyPlus className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No albums found</h3>
          <p className="text-gray-500 text-sm mb-6">Create a photo gallery to share with your students.</p>
          <button onClick={openCreateModal} className="text-orange-500 font-bold hover:text-orange-600 text-sm">
            + Create your first album
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album) => (
            <div key={album.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
              {/* Cover Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {album.images && album.images.length > 0 ? (
                  <>
                    <img src={getImageUrl(album.images[0])} alt={album.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => setViewAlbum(album)} className="text-white text-xs font-bold px-4 py-2 bg-black/60 rounded-full backdrop-blur-sm hover:bg-black/80 transition-colors">
                        View All Photos
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon size={40} />
                  </div>
                )}
                {/* Status badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1.5">
                  <CopyPlus size={10} /> {album.images ? album.images.length : 0} Photos
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
                  {album.name}
                </h3>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                  {album.description || 'No description provided.'}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div className="text-xs text-gray-400 font-medium">
                    {new Date(album.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditModal(album)} className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(album.id)} className="flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Album Modal */}
      <AlbumModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        albumData={selectedAlbum} 
        fetchAlbums={fetchAlbums}
      />

      {/* View Album Modal */}
      <AnimatePresence>
        {viewAlbum && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setViewAlbum(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" />
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                <div>
                  <h3 className="text-xl font-black text-gray-900">{viewAlbum.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{viewAlbum.description || 'No description'}</p>
                </div>
                <button onClick={() => setViewAlbum(null)} className="text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 overflow-auto flex-1 bg-gray-50 custom-scrollbar">
                {viewAlbum.images && viewAlbum.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {viewAlbum.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-200 shadow-sm group">
                        <img src={getImageUrl(img)} alt={`${viewAlbum.name} ${idx+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-400">
                    <ImageIcon size={64} className="mx-auto mb-4 opacity-30" />
                    <p className="font-bold text-lg">No photos in this album</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Galleries;