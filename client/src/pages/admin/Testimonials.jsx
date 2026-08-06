import React, { useState, useEffect } from "react";
import {
    Plus,
    Edit2,
    Trash2,
    Eye,
    MessageSquareQuote,
    Star,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import TestimonialModal from "../../components/admin/testimonials/TestimonialModal";
import ViewTestimonialModal from "../../components/admin/testimonials/ViewTestimonialModal";
import ConfirmModal from "../../components/admin/reusecomponents/ConfirmationModal";

const MAX_TESTIMONIALS = 100;

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [testimonialToDelete, setTestimonialToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const isLimitReached = testimonials.length >= MAX_TESTIMONIALS;

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/testimonials`);
            const payload = res?.data?.data;
            // Handles both a plain array response and a paginated { data: [...] } shape
            setTestimonials(Array.isArray(payload) ? payload : payload?.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load testimonials");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        setTestimonialToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!testimonialToDelete) return;
        try {
            setIsDeleting(true);
            await api.delete(`/testimonials/${testimonialToDelete}`);
            toast.success("Testimonial deleted successfully");
            fetchTestimonials();
            setIsDeleteModalOpen(false);
            setTestimonialToDelete(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete testimonial");
        } finally {
            setIsDeleting(false);
        }
    };

    const openCreateModal = () => {
        if (isLimitReached) {
            toast.error(`You can only add up to ${MAX_TESTIMONIALS} testimonials`);
            return;
        }
        setSelectedTestimonial(null);
        setIsModalOpen(true);
    };

    const openEditModal = (testimonial) => {
        setSelectedTestimonial(testimonial);
        setIsModalOpen(true);
    };

    const openViewModal = (testimonial) => {
        setSelectedTestimonial(testimonial);
        setIsViewModalOpen(true);
    };
    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedTestimonial(null);
    };
    const closeTestimonialModal = () => {
        setIsModalOpen(false);
        setSelectedTestimonial(null);
    };

    return (
        <div className="">
            {/* Header section */}
            <div className="flex w-full flex-col justify-start md:flex-row items-end md:items-center gap-4 mb-3">
                <div className="flex w-full md:w-full justify-between items-center gap-4">
                    <span className="md:text-lg text-[12px] font-bold text-black">
                        {/* {testimonials.length}/{MAX_TESTIMONIALS} */}
                        <span className="px-4 ">Add Minimum 15 Testimonials For Better UI</span>

                    </span>
                    <button
                        onClick={openCreateModal}
                        disabled={isLimitReached}
                        title={
                            isLimitReached
                                ? `Limit of ${MAX_TESTIMONIALS} testimonials reached`
                                : undefined
                        }
                        className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold transition-all shadow-md ${isLimitReached
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                            : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20"
                            }`}
                    >
                        <Plus size={18} />{" "}
                        <span className="hidden lg:inline">Add Testimonial</span>
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
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                                <div className="space-y-2 mb-4 flex-1">
                                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                                    <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                                    <div className="h-3 bg-gray-100 rounded w-4/6"></div>
                                </div>
                                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 mt-auto">
                                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : testimonials?.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquareQuote className="text-gray-400" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                        No testimonials found
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                        Start adding customer testimonials and reviews here.
                    </p>
                    <button
                        onClick={openCreateModal}
                        className="text-orange-500 font-bold hover:text-orange-600 text-sm"
                    >
                        + Add your first testimonial
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
                        >
                            {/* Body */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-1">
                                        {testimonial.name || "Unnamed"}
                                    </h3>
                                    {testimonial.stars ? (
                                        <div className="flex items-center gap-0.5 shrink-0">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={12}
                                                    className={
                                                        i < testimonial.stars
                                                            ? "text-orange-400 fill-orange-400"
                                                            : "text-gray-200 fill-gray-200"
                                                    }
                                                />
                                            ))}
                                        </div>
                                    ) : null}
                                </div>

                                {testimonial.role && (
                                    <p className="text-xs font-bold text-orange-500 uppercase tracking-wide mb-2">
                                        {testimonial.role}
                                    </p>
                                )}

                                {testimonial.title && (
                                    <p className="text-sm font-bold text-gray-800 mb-1 line-clamp-1">
                                        {testimonial.title}
                                    </p>
                                )}

                                <p className="text-gray-500 text-sm leading-snug line-clamp-3 mb-3 flex-1">
                                    {testimonial.text || "No text"}
                                </p>

                                <span className="inline-block w-fit text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wide mb-2">
                                    {testimonial.type || "N/A"}
                                </span>

                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 mt-auto">
                                    <button
                                        onClick={() => openEditModal(testimonial)}
                                        className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg"
                                    >
                                        <Edit2 size={14} />
                                    </button>

                                    <button
                                        onClick={() => openViewModal(testimonial)}
                                        className="px-3 py-1.5 text-xs font-bold text-[#f97316] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-100 flex items-center gap-1"
                                    >
                                        <Eye size={14} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(testimonial.id)}
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

            <TestimonialModal
                isOpen={isModalOpen}
                onClose={closeTestimonialModal}
                testimonial={selectedTestimonial}
                fetchTestimonials={fetchTestimonials}
            />
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Testimonial?"
                message="Are you sure you want to delete this testimonial? This action cannot be undone."
                type="delete"
                isLoading={isDeleting}
            />
            <ViewTestimonialModal
                isOpen={isViewModalOpen}
                onClose={closeViewModal}
                testimonial={selectedTestimonial}
                onEdit={(testimonial) => {
                    closeViewModal();
                    openEditModal(testimonial);
                }}
            />
        </div>
    );
};

export default Testimonials;

