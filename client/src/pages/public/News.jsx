import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronRight, X, Link as LinkIcon, ExternalLink } from 'lucide-react';
import PaginationComponent from '../../components/PaginationComponent';
import api from '../../api/axios';

const formatDate = (d) =>
    d
        ? new Date(d).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
        : 'N/A';


const getYoutubeId = (url) => {
    if (!url) return null;

    const liveMatch = url.match(/youtube\.com\/live\/([^?&/]+)/);
    if (liveMatch) return liveMatch[1];

    const regExp =
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&/]+)/;

    const match = url.match(regExp);
    return match ? match[1] : null;
};


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
                className="max-h-16 max-w-[60%] object-contain transform group-hover:scale-110 transition-transform duration-700 ease-out"
            />
        </div>
    );
};

const News = () => {
    const [selectedNewsId, setSelectedNewsId] = useState(null);
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});

    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/news?page=${page}`);
            const payload = res?.data?.data;
            setNewsData(Array.isArray(payload) ? payload : payload?.data || []);
            setPagination(res?.data?.pagination);
        } catch (error) {
            console.error('Failed to load news', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchNews();
    }, [page]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (selectedNewsId) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedNewsId]);

    const selectedNews = newsData.find((n) => n.id === selectedNewsId);
    const selectedYtId = selectedNews ? getYoutubeId(selectedNews.url) : null;

    const handleCardClick = (news) => {
        // YouTube links open an inline player modal; article links open in a new tab
        if (getYoutubeId(news.url)) {
            setSelectedNewsId(news.id);
        } else {
            window.open(news.url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="relative overflow-hidden w-full min-h-screen bg-[#f9fafb] pt-24 pb-12 md:pt-28 md:pb-16 lg:pt-32 lg:pb-24 px-4 md:px-8 font-sans selection:bg-[#f97316] selection:text-white">

            {/* MASSIVE BACKGROUND TEXT */}
            <div className="fixed top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-black/[0.03] uppercase tracking-tighter pointer-events-none z-0 whitespace-nowrap select-none">
                NEWS
            </div>

            {/* Header */}
            <div className="global-container lg:!px-14 mb-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex flex-col items-start mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-1 w-12 bg-[#f97316]"></div>
                            <h3 className="text-[#f97316] font-bold tracking-[0.2em] uppercase text-sm">Latest Updates</h3>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter text-black">
                            LATEST <span className="text-[#26c0ff]">NEWS</span>
                        </h2>
                    </div>
                </motion.div>
            </div>

            {/* News List */}
            <div className="global-container lg:px-14! grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col animate-pulse"
                        >
                            <div className="w-full h-40 bg-gray-100" />
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                                <div className="h-3 bg-gray-100 rounded w-2/3 mb-4"></div>
                                <div className="h-3 bg-gray-100 rounded w-1/3 mt-auto"></div>
                            </div>
                        </div>
                    ))
                ) : newsData.length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No news found</h3>
                        <p className="text-gray-500 text-sm">Check back soon for updates.</p>
                    </div>
                ) : (
                    newsData.map((news, idx) => (
                        <motion.div
                            key={news.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => handleCardClick(news)}
                            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
                        >
                            <div className="relative w-full h-44 shrink-0">
                                <NewsThumbnail url={news.url} />
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-start gap-1.5 text-sm font-bold text-[#0b1b24] mb-2">
                                    <LinkIcon size={13} className="shrink-0 mt-0.5 text-[#f97316]" />
                                    <span className="line-clamp-2 break-all">{getHostname(news.url)}</span>
                                </div>

                                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                                        <Calendar size={12} className="shrink-0" />
                                        {formatDate(news.published_date)}
                                    </div>
                                    <div className="w-8 h-8 bg-gray-50 group-hover:bg-[#f97316] flex items-center justify-center rounded-lg transition-colors">
                                        {getYoutubeId(news.url) ? (
                                            <ChevronRight size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                                        ) : (
                                            <ExternalLink size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <div className="mt-8 global-container">
                {!loading && newsData.length > 0 && pagination?.total > 0 && (
                    <PaginationComponent
                        pagination={pagination}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                )}
            </div>

            {/* Video Modal (YouTube links only) */}
            <AnimatePresence>
                {selectedNewsId && selectedNews && selectedYtId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedNewsId(null)}
                        className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto custom-scrollbar"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-[720px] bg-white rounded-[24px] overflow-hidden relative shadow-2xl border border-gray-200"
                        >
                            <button
                                onClick={() => setSelectedNewsId(null)}
                                className="absolute top-4 right-4 z-50 w-8 h-8 bg-white/90 backdrop-blur-sm shadow-md hover:bg-[#f97316] text-[#0b1b24] hover:text-white rounded-full flex items-center justify-center transition-colors"
                            >
                                <X size={16} />
                            </button>

                            <div className="w-full aspect-video bg-black">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${selectedYtId}?autoplay=1`}
                                    title="News video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>

                            <div className="p-4 md:p-5 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                    <Calendar size={13} className="shrink-0" />
                                    {formatDate(selectedNews.published_date)}
                                </div>
                                <a
                                    href={selectedNews.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f97316] hover:text-orange-600"
                                >
                                    Watch on YouTube <ExternalLink size={12} />
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default News;