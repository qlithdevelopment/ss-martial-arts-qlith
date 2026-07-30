import React, { useState, useEffect } from "react";
import {
    Plus,
    Edit2,
    Trash2,
    Eye,
    Newspaper,
    Link as LinkIcon,
    Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import NewsModal from "../../components/admin/news/NewsModal";
import ViewNewsModal from "../../components/admin/news/ViewNewsModal";
import ConfirmModal from "../../components/admin/reusecomponents/ConfirmationModal";

const formatDate = (d) =>
    d
        ? new Date(d).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
        : "N/A";




const getYoutubeId = (url) => {
    if (!url) return null;

    const liveMatch = url.match(/youtube\.com\/live\/([^?&/]+)/);
    if (liveMatch) return liveMatch[1];

    const regExp =
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&/]+)/;

    const match = url.match(regExp);
    return match ? match[1] : null;
};

// Clearbit's free Logo API (logo.clearbit.com) was shut down in December 2025
// and no longer resolves, so article thumbnails go straight to Google's
// favicon service instead.
const getFaviconUrl = (domain) =>
    domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null;

const getHostname = (url) => {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return url;
    }
};

const NewsThumbnail = ({ url }) => {
    const [imgFailed, setImgFailed] = useState(false);
    const [ogImage, setOgImage] = useState(null);
    const [checked, setChecked] = useState(false);
    const ytId = getYoutubeId(url);

    useEffect(() => {
        if (ytId || !url) return; // YouTube already has its own thumbnail
        let cancelled = false;

        fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}&image.fit=cover`)
            .then((res) => res.json())
            .then((data) => {
                if (cancelled) return;
                const img = data?.data?.image?.url || data?.data?.screenshot?.url || null;
                setOgImage(img);
            })
            .catch(() => { })
            .finally(() => !cancelled && setChecked(true));

        return () => { cancelled = true; };
    }, [url, ytId]);


    if (ytId) {
        return (
            <div className="relative w-full h-full overflow-hidden bg-black">
                <img
                    src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out opacity-80"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#f97316]/90 transition-colors">
                        <svg className="w-7 h-7 text-white fill-current ml-0.5" viewBox="0 0 24 24">
                            <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.553a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.553 9.388.553 9.388.553s7.518 0 9.388-.553a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

    const domain = getHostname(url);
    const faviconUrl = getFaviconUrl(domain);

    // Still resolving og:image — show a soft placeholder instead of flashing the favicon
    if (!checked) {
        return <div className="w-full h-full bg-gray-50 animate-pulse" />;
    }

    if (ogImage && !imgFailed) {
        return (
            <div className="relative w-full h-full overflow-hidden bg-gray-50">
                <img
                    src={ogImage}
                    onError={() => setImgFailed(true)}
                    alt={domain}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
            </div>
        );
    }

    // Fallback chain: og:image failed/missing → favicon → generic icon
    if (!faviconUrl) {
        return (
            <div className="relative w-full h-full overflow-hidden bg-gray-50 flex items-center justify-center">
                <LinkIcon size={28} className="text-gray-300" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-full overflow-hidden bg-gray-50 flex items-center justify-center">
            <img
                src={faviconUrl}
                onError={() => setImgFailed(true)}
                alt={domain}
                className="max-h-20 max-w-[60%] object-contain transform group-hover:scale-110 transition-transform duration-700 ease-out"
            />
        </div>
    );
};

const AdminNews = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/news`);
            const payload = res?.data?.data;
            // Handles both a plain array response and a paginated { data: [...] } shape
            setNewsList(Array.isArray(payload) ? payload : payload?.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load news");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        setNewsToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!newsToDelete) return;
        try {
            setIsDeleting(true);
            await api.delete(`/news/${newsToDelete}`);
            toast.success("News deleted successfully");
            fetchNews();
            setIsDeleteModalOpen(false);
            setNewsToDelete(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete news");
        } finally {
            setIsDeleting(false);
        }
    };

    const openCreateModal = () => {
        setSelectedNews(null);
        setIsModalOpen(true);
    };

    const openEditModal = (news) => {
        setSelectedNews(news);
        setIsModalOpen(true);
    };

    const openViewModal = (news) => {
        setSelectedNews(news);
        setIsViewModalOpen(true);
    };
    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedNews(null);
    };
    const closeNewsModal = () => {
        setIsModalOpen(false);
        setSelectedNews(null);
    };

    return (
        <div className="">
            {/* Header section */}
            <div className="flex w-full flex-col justify-start md:flex-row items-end md:items-center gap-4 mb-3">
                <div className="flex w-full md:w-full justify-end items-center gap-4">
                    <button
                        onClick={openCreateModal}
                        className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold transition-all shadow-md bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20"
                    >
                        <Plus size={18} />{" "}
                        <span className="hidden lg:inline">Add News</span>
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
                            <div className="w-full h-40 bg-gray-100" />
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                                <div className="h-3 bg-gray-100 rounded w-2/3 mb-4"></div>
                                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 mt-auto">
                                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : newsList?.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Newspaper className="text-gray-400" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                        No news found
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                        Start adding news article links here.
                    </p>
                    <button
                        onClick={openCreateModal}
                        className="text-orange-500 font-bold hover:text-orange-600 text-sm"
                    >
                        + Add your first news link
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {newsList.map((news) => (
                        <div
                            key={news.id}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
                        >
                            {/* Thumbnail: YouTube preview or article domain logo */}
                            <NewsThumbnail url={news.url} />

                            {/* Body */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex-1 mb-3 space-y-1.5">
                                    <a
                                        href={news.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 break-all"
                                        title={news.url}
                                    >
                                        <LinkIcon size={13} className="shrink-0 mt-0.5" />
                                        <span className="line-clamp-3">{news.url}</span>
                                    </a>
                                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                                        <Calendar size={12} className="shrink-0" />
                                        {formatDate(news.published_date)}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 mt-auto">
                                    <button
                                        onClick={() => openEditModal(news)}
                                        className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg"
                                    >
                                        <Edit2 size={14} />
                                    </button>

                                    <button
                                        onClick={() => openViewModal(news)}
                                        className="px-3 py-1.5 text-xs font-bold text-[#f97316] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-100 flex items-center gap-1"
                                    >
                                        <Eye size={14} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(news.id)}
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

            <NewsModal
                isOpen={isModalOpen}
                onClose={closeNewsModal}
                news={selectedNews}
                fetchNews={fetchNews}
            />
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete News?"
                message="Are you sure you want to delete this news item? This action cannot be undone."
                type="delete"
                isLoading={isDeleting}
            />
            <ViewNewsModal
                isOpen={isViewModalOpen}
                onClose={closeViewModal}
                news={selectedNews}
                onEdit={(news) => {
                    closeViewModal();
                    openEditModal(news);
                }}
            />
        </div>
    );
};

export default AdminNews;
