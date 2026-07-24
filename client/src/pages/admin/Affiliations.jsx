import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Building2,  
  Phone,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import AffiliationModal from "../../components/admin/affiliations/AffiliationModal";
import ViewAffiliationModal from "../../components/admin/affiliations/ViewAffiliationModal";
import ConfirmModal from "../../components/admin/reusecomponents/ConfirmationModal";


const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/storage/")) return `${BASE_URL}${path}`;
  return `${BASE_URL}/storage/${path}`;
};

const Affiliations = () => {
  const [affiliations, setAffiliations] = useState([]);
  const [loading, setLoading] = useState(true); 
  


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAffiliation, setSelectedAffiliation] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [affiliationToDelete, setAffiliationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    

  useEffect(() => {
    fetchAffiliations();
  }, []);

  const fetchAffiliations = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/affiliations`);      
      const payload = res?.data?.data;
      setAffiliations(payload?.data || []);      
    } catch (error) {
      console.error(error);
      toast.error("Failed to load affiliations");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setAffiliationToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!affiliationToDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`/affiliations/${affiliationToDelete}`);
      toast.success("Affiliation deleted successfully");
      fetchAffiliations();
      setIsDeleteModalOpen(false);
      setAffiliationToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete affiliation");
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateModal = () => {
    setSelectedAffiliation(null);   
    setIsModalOpen(true);
  };

  const openEditModal = (affiliation) => {
    setSelectedAffiliation(affiliation);
    setIsModalOpen(true);
  };

  const openViewModal = (affiliation) => {
   setSelectedAffiliation(affiliation);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedAffiliation(null)
  };
  const closeAffiliationModal = () => {
    setIsModalOpen(false);
    setSelectedAffiliation(null);
  };

  return (
    <div className="">
      {/* Header section */}
      <div className="flex w-full flex-col justify-end md:flex-row items-end md:items-center gap-4 mb-3">
        <div className="flex w-full md:w-auto items-center gap-4">          
          <button
            onClick={openCreateModal}
            className="shrink-0  flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg text-sm font-bold transition-all shadow-md shadow-orange-500/20"
          >
            <Plus size={18} />{" "}
            <span className="hidden lg:inline">Add Affiliation</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border md:w-full border-gray-100 overflow-hidden shadow-sm flex flex-col animate-pulse"
            >
              {/* Image skeleton */}
              <div className="relative h-48 bg-gray-200 w-full"></div>

              {/* Body skeleton */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
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
      ) : affiliations?.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No affiliations found
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Start adding your partner brands and affiliations here.
          </p>
          <button
            onClick={openCreateModal}
            className="text-orange-500 font-bold hover:text-orange-600 text-sm"
          >
            + Add your first affiliation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {affiliations.map((affiliation) => (
            <div
              key={affiliation.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
                {affiliation.image ? (
                  <img
                    src={getImageUrl(affiliation.image)}
                    alt={affiliation.name}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "/default-logo.png";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Building2 size={40} />
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-1 px-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-1">
                  {affiliation.name}
                </h3>

                <p className="text-gray-500 text-sm leading-snug line-clamp-2 mb-3">
                  {affiliation.description || "No description"}
                </p>

                <div className="space-y-1.5 mb-2">
                  {affiliation.phone && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Phone size={12} className="text-orange-500 shrink-0" />
                      <span className="truncate">{affiliation.phone}</span>
                    </div>
                  )}
                  {affiliation.location && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MapPin size={12} className="text-orange-500 shrink-0" />
                      <span className="truncate">{affiliation.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 mt-auto">
                  <button
                    onClick={() => openEditModal(affiliation)}
                    className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg"
                  >
                    <Edit2 size={14} />
                  </button>

                  <button
                    onClick={() => openViewModal(affiliation)}
                    className="px-3 py-1.5 text-xs font-bold text-[#f97316] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-100 flex items-center gap-1"
                  >
                    <Eye size={14} />
                  </button>

                  <button
                    onClick={() => handleDelete(affiliation.id)}
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

      <AffiliationModal
        isOpen={isModalOpen}
        onClose={closeAffiliationModal}
        affiliation={selectedAffiliation}
        fetchAffiliations={fetchAffiliations}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Affiliation?"
        message="Are you sure you want to delete this affiliation? This action cannot be undone."
        type="delete"
        isLoading={isDeleting}
      />
      <ViewAffiliationModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        affiliation={selectedAffiliation}
        onEdit={(affiliation) => {
          closeViewModal();
          openEditModal(affiliation);
        }}
      />
    </div>
  );
};

export default Affiliations;