import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  User as UserIcon,
  Search,
  Zap,
  Star,
  Briefcase,
  Award,
  Quote,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import TrainerModal from "../../components/admin/trainers/TrainerModal";
import PaginationComponent from "../../components/PaginationComponent";
import ViewTrainerModal from "../../components/admin/trainers/ViewTrainerModal";
import ConfirmModal from "../../components/admin/reusecomponents/ConfirmationModal";

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editTrainerId, setEditTrainerId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewTrainerId, setViewTrainerId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchTrainers();
  }, [page, debouncedSearch]);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/trainers?page=${page}&search=${debouncedSearch}`);
      setTrainers(res?.data?.data);
      setPagination(res?.data?.pagination);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load trainers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setTrainerToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!trainerToDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`/trainers/${trainerToDelete}`);
      toast.success('Trainer deleted successfully');
      fetchTrainers();
      setIsDeleteModalOpen(false);
      setTrainerToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete trainer');
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateModal = () => {
    setSelectedTrainer(null);
    setSearch("");
    setIsModalOpen(true);
  };

  const openEditModal = (id) => {
    setEditTrainerId(id);
    setIsModalOpen(true);
  };

  const openViewModal = (id) => {
    setViewTrainerId(id);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewTrainerId(null);
  };
  const closeTrainerModal = () => {
    setIsModalOpen(false)
    setEditTrainerId(null);
    // fetchTrainers(); // Refresh the list after closing the modal
  };

  return (
    <div className="">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex w-full md:w-full items-center gap-4">
          <div className="relative w-full md:w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search trainers..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="flex-1 sm:flex-none px-5 py-3 bg-[#f97316] hover:bg-orange-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#f97316]/20 shrink-0"
          >
            <Plus size={18} />{" "}
            <span className="hidden lg:inline">Add Trainer</span>
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
              <div className="relative h-48 bg-gray-200 w-full">
                <div className="absolute top-3 right-3">                  
                </div>
              </div>

              {/* Body skeleton */}
              <div className="p-5 flex-1 flex flex-col">                

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
      ) : trainers?.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No trainers found
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Start adding your team members and instructors here.
          </p>
          <button
            onClick={openCreateModal}
            className="text-orange-500 font-bold hover:text-orange-600 text-sm"
          >
            + Add your first trainer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
            >
              <div className="relative h-52 bg-gray-100 overflow-hidden">
                {trainer.image_path ? (
                  <img
                    src={`${BASE_URL}${trainer.image_path}`}
                    alt={trainer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "/default-trainer.png";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <UserIcon size={40} />
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                {/* Designation badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded">
                    {trainer.designation || "Instructor"}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-1">
                  {trainer.name}
                </h3>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 mt-auto">
                  <button
                    onClick={() => openEditModal(trainer.id)}
                    className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg"
                  >
                    <Edit2 size={14} />
                  </button>

                  <button
                    onClick={() => openViewModal(trainer.id)}
                    className="px-3 py-1.5 text-xs font-bold text-[#f97316] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-100 flex items-center gap-1"
                  >
                    <Eye size={14} />
                  </button>

                  <button
                    onClick={() => handleDelete(trainer.id)}
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
        {!loading && trainers.length > 0 && pagination?.total > 0 && (
          <PaginationComponent
            pagination={pagination}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>

      <TrainerModal
        isOpen={isModalOpen}
        onClose={closeTrainerModal}
        trainerId={editTrainerId}
        fetchTrainers={fetchTrainers}
      />
      < ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Trainer?"
        message="Are you sure you want to delete this Trainer? This action cannot be undone."
        type="delete"
        isLoading={isDeleting}
      />
      <ViewTrainerModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        trainerId={viewTrainerId}
        onEdit={(trainer) => {
          closeViewModal();
          openEditModal(trainer.id);
        }}
      />
    </div>
  );
};

export default Trainers;
