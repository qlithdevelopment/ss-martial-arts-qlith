import React, { useState, useEffect } from "react";
import { X, Link as LinkIcon, Calendar, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../api/axios";

const emptyForm = {
    url: "",
    published_date: "",
};

const isValidUrl = (value) => {
    try {
        const parsed = new URL(value);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
};

const NewsModal = ({ isOpen, onClose, news, fetchNews }) => {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = Boolean(news?.id);

    useEffect(() => {
        if (!isOpen) return;

        if (news) {
            setForm({
                url: news.url || "",
                // Normalize any datetime string down to yyyy-MM-dd for the date input
                published_date: news.published_date
                    ? String(news.published_date).slice(0, 10)
                    : "",
            });
        } else {
            setForm(emptyForm);
        }
        setErrors({});
    }, [isOpen, news]);

    if (!isOpen) return null;

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = () => {
        const nextErrors = {};

        if (!form.url.trim()) {
            nextErrors.url = "URL is required.";
        } else if (form.url.trim().length > 500) {
            nextErrors.url = "URL must be under 500 characters.";
        } else if (!isValidUrl(form.url.trim())) {
            nextErrors.url = "Enter a valid URL (including https://).";
        }

        if (!form.published_date) {
            nextErrors.published_date = "Published date is required.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            url: form.url.trim(),
            published_date: form.published_date,
        };

        try {
            setIsSubmitting(true);
            if (isEditMode) {
                await api.put(`/news/${news.id}`, payload);
                toast.success("News updated successfully");
            } else {
                await api.post(`/news`, payload);
                toast.success("News created successfully");
            }
            fetchNews?.();
            onClose();
        } catch (error) {
            console.error(error);
            const serverErrors = error?.response?.data?.errors;
            if (serverErrors) {
                setErrors(
                    Object.fromEntries(
                        Object.entries(serverErrors).map(([key, val]) => [
                            key,
                            Array.isArray(val) ? val[0] : val,
                        ])
                    )
                );
            }
            toast.error(
                error?.response?.data?.message ||
                    `Failed to ${isEditMode ? "update" : "create"} news`
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-black text-gray-900 tracking-tight">
                        {isEditMode ? "Edit News" : "Add News"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* URL */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                            <LinkIcon size={13} />
                            Article URL
                        </label>
                        <input
                            type="text"
                            value={form.url}
                            onChange={handleChange("url")}
                            placeholder="https://example.com/news/article"
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                                errors.url
                                    ? "border-red-300 focus:ring-red-100"
                                    : "border-gray-200 focus:ring-orange-100 focus:border-orange-400"
                            }`}
                        />
                        {errors.url && (
                            <p className="text-xs text-red-500 font-semibold mt-1">
                                {errors.url}
                            </p>
                        )}
                    </div>

                    {/* Published Date */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                            <Calendar size={13} />
                            Published Date
                        </label>
                        <input
                            type="date"
                            value={form.published_date}
                            onChange={handleChange("published_date")}
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 transition-colors ${
                                errors.published_date
                                    ? "border-red-300 focus:ring-red-100"
                                    : "border-gray-200 focus:ring-orange-100 focus:border-orange-400"
                            }`}
                        />
                        {errors.published_date && (
                            <p className="text-xs text-red-500 font-semibold mt-1">
                                {errors.published_date}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting && <Loader2 size={15} className="animate-spin" />}
                            {isEditMode ? "Save Changes" : "Add News"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewsModal;