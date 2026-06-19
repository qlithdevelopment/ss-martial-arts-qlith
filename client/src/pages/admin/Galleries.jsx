import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import toast from "react-hot-toast";
import { useModal } from "../../context/ModalContext";

import { parseImages, getImageUrl } from '../../utils/imageUtils';
import AlbumCard from '../../components/admin/galleries/AlbumCard';
import AlbumModal from '../../components/admin/galleries/AlbumModal';
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { X, Type, AlignLeft, Calendar, Image as ImageIcon, Plus, ArrowLeft, Save, Upload, Trash2, Star, CopyPlus } from "lucide-react";

const AdminGalleries = () => {
  const [albums, setAlbums] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [isImageManagerOpen, setIsImageManagerOpen] = useState(false);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const [formData, setFormData] = useState({ name: "", description: "" });
  
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const fetchAlbums = async (page = 1, append = false) => {
    if (page > 1) setIsLoadingMore(true);
    try {
      const response = await axios.get(`/galleries?page=${page}`);
      if (response.data && response.data.data) {
        if (append) {
          setAlbums(prev => [...prev, ...response.data.data]);
        } else {
          setAlbums(response.data.data);
        }
        if (response.data.pagination) setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch galleries from backend:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (pagination.current_page < pagination.last_page) {
      fetchAlbums(pagination.current_page + 1, true);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const validFiles = [];
      const validPreviews = [];

      files.forEach(file => {
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
          toast.error(`Invalid format: ${file.name}. Only JPG/PNG allowed.`);
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          toast.error(`File too large: ${file.name} (Max 2MB)`);
          return;
        }
        validFiles.push(file);
        validPreviews.push(URL.createObjectURL(file));
      });

      if (validFiles.length > 0) {
        setGalleryImages(prev => [...prev, ...validFiles]);
        setGalleryPreviews(prev => [...prev, ...validPreviews]);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchFullGallery = async (id, fallbackAlbum) => {
    try {
      const res = await axios.get(`/galleries/${id}`);
      if (res.data && res.data.data) {
        setAlbums(prev => prev.map(a => a.id === id ? res.data.data : a));
        return res.data.data;
      }
      return fallbackAlbum;
    } catch (error) {
      console.error(error);
      return fallbackAlbum;
    }
  };

  const handleEdit = async (album) => {
    const fullAlbum = await fetchFullGallery(album.id, album);
    setEditingAlbum(fullAlbum);
    setIsViewing(false);
    setFormData({ name: fullAlbum.name || "", description: fullAlbum.description || "" });
    setGalleryImages([]);
    setGalleryPreviews([]);
    setOldImages(parseImages(fullAlbum.images));
    setIsModalOpen(true);
  };
  const handleView = async (album) => {
    const fullAlbum = await fetchFullGallery(album.id, album);
    setEditingAlbum(fullAlbum);
    setIsViewing(true);
    setFormData({ name: fullAlbum.name || "", description: fullAlbum.description || "" });
    setGalleryImages([]);
    setGalleryPreviews([]);
    setOldImages(parseImages(fullAlbum.images));
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingAlbum(null);
    setIsViewing(false);
    setFormData({ name: "", description: "" });
    setGalleryImages([]);
    setGalleryPreviews([]);
    setOldImages([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    showConfirm({
      title: "Delete Gallery",
      message: "Are you sure you want to delete this album? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await axios.delete(`/galleries/${id}`);
          setAlbums(albums.filter(a => a.id !== id));
          showSuccess({ title: "Deleted!", message: "Gallery deleted successfully." });
        } catch (err) {
          console.error(err);
          showError({ title: "Error", message: "Failed to delete gallery." });
        }
      }
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      if (formData.description) dataToSend.append("description", formData.description);
      
      oldImages.forEach(img => {
        dataToSend.append("old_images[]", img);
      });

      galleryImages.forEach(file => {
        dataToSend.append("images[]", file);
      });

      if (editingAlbum) {
        const res = await axios.post(`/galleries/${editingAlbum.id}`, dataToSend, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setAlbums(albums.map(a => a.id === editingAlbum.id ? res.data.data : a));
        toast.success("Gallery updated successfully");
      } else {
        const res = await axios.post("/galleries", dataToSend, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setAlbums([res.data.data, ...albums]);
        toast.success("Gallery created successfully");
      }

      setIsModalOpen(false);
      setEditingAlbum(null);
    } catch (error) {
      console.error("Error saving gallery:", error);
      toast.error(editingAlbum ? "Error updating gallery" : "Error creating gallery");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="w-full max-w-6xl mx-auto pb-10 pt-0 px-4 md:px-8 relative">
      
      {/* HEADING AND ADD BUTTON */}
      <div className="flex flex-row items-center justify-between mb-8 w-full">
        <AdminPageHeader 
          subtitle="Media Management" 
          titlePart1="ADMIN" 
          titlePart2="GALLERIES" 
        />
        <Button 
          onClick={handleAddNew}
          variant="primary"
          className="flex items-center gap-2 w-fit whitespace-nowrap"
        >
          <Plus size={18} strokeWidth={3} />
          <span className="hidden sm:inline">ADD NEW ALBUM</span>
          <span className="sm:hidden">ADD</span>
        </Button>
      </div>

      {/* ALBUM LIST CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map(album => (
          <AlbumCard 
            key={album.id}
            album={album}
            parseImages={parseImages}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* LOAD MORE BUTTON */}
      {pagination.current_page < pagination.last_page && (
        <div className="flex justify-center mt-8">
          <Button 
            onClick={loadMore} 
            disabled={isLoadingMore}
            variant="secondary"
            className="text-gray-700 hover:text-black border-gray-300 shadow-md"
          >
            {isLoadingMore ? "Loading..." : "Load More Albums"}
          </Button>
        </div>
      )}

      <AlbumModal 
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        isViewing={isViewing}
        editingAlbum={editingAlbum}
        formData={formData}
        handleInputChange={handleInputChange}
        oldImages={oldImages}
        setOldImages={setOldImages}
        galleryPreviews={galleryPreviews}
        setGalleryPreviews={setGalleryPreviews}
        galleryImages={galleryImages}
        setGalleryImages={setGalleryImages}
        handleImageChange={handleImageChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isImageManagerOpen={isImageManagerOpen}
        setIsImageManagerOpen={setIsImageManagerOpen}
      />



    </div>
  );
};

export default AdminGalleries;
