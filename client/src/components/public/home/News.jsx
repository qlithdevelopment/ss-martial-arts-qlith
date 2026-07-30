import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronRight, X, Link as LinkIcon, ExternalLink } from 'lucide-react';
import api from '../../../api/axios';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 80, damping: 15 }
    }
};

const formatDate = (d) =>
    d
        ? new Date(d).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
        : 'N/A';

// Extracts a YouTube video ID from any common URL shape (watch, youtu.be,
// embed, v, live). Returns null for non-YouTube URLs.
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
                className="max-h-16 max-w-[60%] object-contain transform group-hover:scale-110 transition-transform duration-700 ease-out"
            />
        </div>
    );
};

const News = () => {
    const [newsData, setNewsData] = useState([]);
    const [totalNews, setTotalNews] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedNewsId, setSelectedNewsId] = useState(null);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/news`);
            const payload = res?.data?.data;
            const list = Array.isArray(payload) ? payload : payload?.data || [];
            setTotalNews(res?.data?.pagination?.total ?? list.length);
            setNewsData(list.slice(0, 3));
        } catch (error) {
            console.error('Failed to load news', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchNews();
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
        <section id="news" className="w-full min-h-screen bg-[#f8f9fa] flex flex-col justify-center items-center pt-16 pb-12 md:pt-24 md:pb-16 lg:pt-32 lg:pb-24">

            <div className="global-container !px-0 w-full z-10 flex flex-col items-center">

                {/* Animated Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="w-full text-center mb-10 md:mb-16 px-4"
                >

                    <div className="flex flex-col items-center mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-1 w-12 bg-[#f97316]"></div>
                            <h3 className="text-[#f97316] font-bold tracking-[0.2em] uppercase text-sm">Stay Updated</h3>
                            <div className="h-1 w-12 bg-[#f97316]"></div>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter text-[#0b1b24] text-center">
                            latest <span className='text-primary'> news</span>
                        </h2>
                    </div>
                    <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        Catch up on our latest tournaments, seminars, and academy highlights — straight from the mat to your screen.
                    </p>
                </motion.div>

                {/* 4 COLUMN CARD GRID (3 news + Show More) */}

                <div className="global-container lg:!px-22 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10"
                >

                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex flex-col w-full bg-white rounded-[32px] overflow-hidden border border-gray-100 animate-pulse"
                            >
                                <div className="w-full h-[240px] bg-gray-100" />
                                <div className="p-8">
                                    <div className="h-3 bg-gray-100 rounded w-3/4 mb-3"></div>
                                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        newsData.map((news) => (
                            <motion.div
                                variants={cardVariants}
                                key={news.id}
                                onClick={() => handleCardClick(news)}
                                className="group flex flex-col w-full bg-white rounded-[32px] overflow-hidden shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_60px_-15px_rgba(38,192,255,0.2)] transition-all duration-500 hover:-translate-y-2 border border-gray-100 cursor-pointer"
                            >

                                {/* TOP IMAGE HALF — only render once a real url has come back from the backend */}
                                <div className="w-full h-[240px] bg-gray-100 overflow-hidden flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    {news.url && <NewsThumbnail url={news.url} />}
                                </div>

                                {/* BOTTOM DETAILS HALF */}
                                <div className="w-full bg-white p-8 justify-end flex flex-col relative flex-1">
                                    <div className='h-full flex flex-col justify-start'>

                                        <div className="flex items-start gap-2 mb-6 group-hover:text-[#26c0ff] transition-colors duration-300">
                                            <LinkIcon size={16} className="shrink-0 mt-1 text-[#f97316]" />
                                            <h3 className="text-xl font-black text-[#1a1a1a] uppercase tracking-tight break-all line-clamp-2 group-hover:text-[#26c0ff] transition-colors duration-300">
                                                {getHostname(news.url)}
                                            </h3>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-1.5 text-[13px] text-gray-500 font-medium">
                                                <Calendar size={13} className="shrink-0" />
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
                                </div>
                            </motion.div>
                        ))
                    )}

                    {/* SHOW MORE CARD — 4th column, only when there's more than what's shown here */}
                    {totalNews > 3 && (
                        <motion.div className='h-full lg:w-auto md:w-screen justify-center flex items-center' variants={cardVariants}>
                            <Link
                                to="/news"
                                className=" group flex flex-col items-center justify-center w-full bg-transparent rounded-[32px] overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-pointer p-0 text-center"
                            >
                                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-6 group-hover:bg-[#f97316] transition-colors duration-300">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:text-white transition-colors duration-300"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </div>
                                <h3 className="text-2xl font-black text-primary2 uppercase tracking-tight mb-3 group-hover:text-[#26c0ff] transition-colors duration-300">
                                    Show More
                                </h3>
                                <p className="text-gray-400 text-[13px] md:text-sm font-medium leading-relaxed">
                                    Explore all our news, tournaments, and seminar updates.
                                </p>
                            </Link>
                        </motion.div>
                    )}
                </div>



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

        </section>
    );
};

export default News;

