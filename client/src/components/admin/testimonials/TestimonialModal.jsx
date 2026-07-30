import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Star } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../api/axios"; // adjust if your api client lives elsewhere

const EMPTY_FORM = {
  type: "",
  title: "",
  text: "",
  name: "",
  role: "",
  stars: 0,
};

const TESTIMONIAL_TYPES = [
  "quote-box",
  "square-text",
  "bubble-down-avatars",
  "tall-card",
  "large-image",
  "bubble-down-small",
  "wide-top",
  "wide-middle",
  "wide-bottom",
];

// "bubble-down-avatars" -> "Bubble Down Avatars"
const formatTypeLabel = (type) =>
  type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const MAX_IMAGE_SIZE_MB = 1;
const ACCEPTED_IMAGE_TYPES = ["jpeg","jpg","png","image/jpeg", "image/jpg", "image/png"];

const TestimonialModal = ({ isOpen, onClose, testimonial, fetchTestimonials }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(testimonial?.id);

  useEffect(() => {
    if (isOpen) {
      setForm(
        testimonial
          ? {
              type: testimonial.type || "",
              title: testimonial.title || "",
              text: testimonial.text || "",
              name: testimonial.name || "",
              role: testimonial.role || "",
              stars: testimonial.stars || 0,
            }
          : EMPTY_FORM
      );
      setImageFile(null);
      setImagePreview(testimonial?.image || null);
      setImageError(false);
    }
  }, [isOpen, testimonial]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleStarClick = (value) => {
    setForm((prev) => ({ ...prev, stars: prev.stars === value ? 0 : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only JPG, JPEG, or PNG images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB.`);
      e.target.value = "";
      return;
    }

    setImageError(false);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type) return toast.error("Please select a type");
    if (!form.text) return toast.error("Please enter the testimonial text");
    console.log(imageFile,"this is image url");

    try {
      setIsSubmitting(true);
      toast.loading(isEditing ? "Updating testimonial..." : "Creating testimonial...", {
        id: "testimonial",
      });

      const formData = new FormData();
      formData.append("type", form.type);
      if (form.title) formData.append("title", form.title);
      formData.append("text", form.text);
      if (form.name) formData.append("name", form.name);
      if (form.role) formData.append("role", form.role);
      if (form.stars) formData.append("stars", form.stars);
      if (imageFile) formData.append("image", imageFile);

      if (isEditing) {
        formData.append("_method", "PUT");
        await api.post(`/testimonials/${testimonial.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post(`/testimonials`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success(
        isEditing ? "Testimonial updated successfully!" : "Testimonial created successfully!",
        { id: "testimonial" }
      );
      fetchTestimonials?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to save testimonial.",
        { id: "testimonial" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div className="bg-white w-full max-w-2xl rounded-[1.5rem] shadow-2xl flex flex-col max-h-[85dvh] pointer-events-auto overflow-hidden">

              {/* Header */}
              <div className="flex justify-between items-center p-5 py-2 sm:p-6 sm:py-4 border-b border-gray-50 shrink-0 bg-white">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                  {isEditing ? "Edit Testimonial" : "Add Testimonial"}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Form Body */}
              <form
                id="testimonial-form"
                onSubmit={handleSubmit}
                className="p-4 sm:p-5 sm:py-2 overflow-y-auto flex-1 custom-scrollbar"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                    <select
                      value={form.type}
                      onChange={handleChange("type")}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                      required
                    >
                      <option value="">Choose a type...</option>
                      {TESTIMONIAL_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {formatTypeLabel(type)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={handleChange("title")}
                      placeholder="e.g. Amazing Service"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Text</label>
                    <textarea
                      value={form.text}
                      onChange={handleChange("text")}
                      placeholder="The decoration team did an outstanding job..."
                      rows={4}
                      className="w-full px-4 pt-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={handleChange("name")}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                    <input
                      type="text"
                      value={form.role}
                      onChange={handleChange("role")}
                      placeholder="e.g. Customer"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Image</label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-2 min-h-[60px] flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative ${
                        imageError ? "border-red-500" : "border-gray-200"
                      }`}
                    >
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-20 h-18 object-cover rounded-lg mx-auto mb-2"
                        />
                      ) : (
                        <Upload size={16} className="mx-auto text-gray-400 mb-2" />
                      )}
                      <span className="text-xs text-gray-500 font-medium block">
                        {imageFile ? imageFile.name : "JPG, JPEG, PNG · Max 1MB"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Stars</label>
                    <div className="flex items-center gap-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl min-h-[55px]">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleStarClick(value)}
                          className="p-0.5"
                          aria-label={`${value} star${value > 1 ? "s" : ""}`}
                        >
                          <Star
                            size={22}
                            className={
                              value <= form.stars
                                ? "text-orange-400 fill-orange-400"
                                : "text-gray-300 fill-gray-100"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </form>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-4 sm:p-5 border-t border-gray-50 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-bold shadow-sm text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="testimonial-form"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-[#f97316] hover:bg-orange-600 rounded-xl transition-all shadow-md shadow-orange-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isEditing ? "Update Testimonial" : "Save Testimonial"}
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TestimonialModal;