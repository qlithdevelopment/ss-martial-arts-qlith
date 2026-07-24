import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Search, CopyPlus, Edit2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AlbumModal from '../../components/admin/galleries/AlbumModal';
import ConfirmModal from '../../components/admin/reusecomponents/ConfirmationModal';
import PaginationComponent from '../../components/PaginationComponent.jsx';
import { formatDate } from '../../components/CommonFormats.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '');
const MAX_TOTAL_IMAGES = 100; // Global limit across all galleries combined

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/storage/')) return `${BASE_URL}${path}`;
  return `${BASE_URL}/storage/${path}`;
};

const Galleries = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [viewAlbum, setViewAlbum] = useState(null);
  const [totalImagesCount, setTotalImagesCount] = useState(0);



  useEffect(() => {
    fetchAlbums();
  }, [page]);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/galleries?per_page=8&page=${page}`);
      setAlbums(res?.data?.data);
      setPagination(res?.data?.pagination);
      setTotalImagesCount(res?.data?.total_all_gallery_images || 0);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load galleries');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setAlbumToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!albumToDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`/galleries/${albumToDelete}`);
      toast.success('Album deleted successfully');
      fetchAlbums();
      setIsDeleteModalOpen(false);
      setAlbumToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete album');
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateModal = () => {
    setSelectedAlbum(null);
    setIsModalOpen(true);
  };

  const openEditModal = (album) => {
    setSelectedAlbum(album);
    setIsModalOpen(true);
  };

  return (
    <div className="">
      {/* Header section */}
      <div className="flex flex-col mb-14 md:mb-8 md:flex-row justify-between items-start md:items-center gap-4 ">
        <div className="flex w-full justify-between md:w-full  gap-4">

          <div className=" top-30  md:top-0   md:top-18  text-sm text-gray-500 font-medium">
            Total Images: <span className="font-bold text-gray-900">{totalImagesCount}/{MAX_TOTAL_IMAGES}</span>
            <p className="text-xs text-gray-400">Max {MAX_TOTAL_IMAGES} images allowed</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex-1 sm:flex-none px-5 py-3 bg-[#f97316] hover:bg-orange-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#f97316]/20 shrink-0"
          >
            <Plus size={18} /> <span className="hidden lg:inline">Create Album</span>
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
                </div>

                <div className="space-y-2 mb-4 flex-1">
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                </div>

                {/* Actions skeleton */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 mt-auto">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : albums.length === 0 ? (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {albums.map((album) => (
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
                    {formatDate(new Date(album.created_at).toLocaleDateString())}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditModal(album)} className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(album.id)} className="flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8">
        {!loading && albums.length > 0 && pagination?.total > 0 && (
          <PaginationComponent
            pagination={pagination}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>

      {/* Create/Edit Album Modal */}
      <AlbumModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        albumData={selectedAlbum}
        fetchAlbums={fetchAlbums}
        totalImagesCount={totalImagesCount}
        maxImages={MAX_TOTAL_IMAGES}
      />

      {/* View Album Modal */}
      <AnimatePresence>
        {viewAlbum && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewAlbum(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                <div>
                  <h3 className="text-xl font-black text-gray-900">{viewAlbum.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{viewAlbum.description || 'No description'}</p>
                </div>
                <button onClick={() => setViewAlbum(null)} className="text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 overflow-auto flex-1 bg-gray-50 custom-scrollbar">
                {viewAlbum.images && viewAlbum.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {viewAlbum.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-200 shadow-sm group">
                        <img src={getImageUrl(img)} alt={`${viewAlbum.name} ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
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
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Album?"
        message="Are you sure you want to delete this Album? This action cannot be undone."
        type="delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Galleries;