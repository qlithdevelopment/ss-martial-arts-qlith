import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, ImageIcon, ChevronRight } from 'lucide-react';

import eventSeminarImg from "../../assets/event_seminar.png";
import eventTournamentImg from "../../assets/event_tournament.png";
import masterKickImg from "../../assets/master_kick.png";
import femaleMmaImg from "../../assets/female_mma.png";
import yogaMasterImg from "../../assets/yoga_master.png";
import mastersGroupImg from "../../assets/masters_group.png";
import trainer1Img from "../../assets/group_classes.png";
import trainer2Img from "../../assets/generated_trainer2.png";
import trainer3Img from "../../assets/personal_training.png";
import PaginationComponent from '../../components/PaginationComponent';

import api from '../../api/axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '');

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/storage/')) return `${BASE_URL}${path}`;
  return `${BASE_URL}/storage/${path}`;
};

const spanClasses = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1"
];

const GalleryPage = () => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [albumsData, setAlbumsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/galleries?page=${currentPage}`);
      setAlbumsData(res?.data?.data);
      setPagination(res?.data?.pagination)
    } catch (error) {
      console.error('Failed to fetch galleries', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAlbums();
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedAlbum]);

  useEffect(() => {
    if (lightboxImage) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [lightboxImage]);

  return (
    <div className="w-full min-h-screen bg-[#f9fafb] pt-24 pb-12 md:pt-28 md:pb-16 lg:pt-32 lg:pb-24 px-4 md:px-8 font-sans selection:bg-[#f97316] selection:text-white relative">
      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-white transition-colors bg-white/5 rounded-full p-2"
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              src={lightboxImage}
              alt="Full Screen View"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* MASSIVE BACKGROUND TEXT */}
      <div className="fixed top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-black/[0.03] uppercase tracking-tighter pointer-events-none  whitespace-nowrap select-none">
        GALLERY
      </div>

      <div className="global-container lg:!px-[95px] relative z-10">

        <AnimatePresence mode="wait">
          {!selectedAlbum ? (
            /* ========================================= */
            /*              MAIN ALBUMS GRID             */
            /* ========================================= */
            <motion.div
              key="albums-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="mb-12">
                <div className="flex flex-col items-start mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-1 w-12 bg-[#f97316]"></div>
                    <h3 className="text-[#f97316] font-bold tracking-[0.2em] uppercase text-sm">Gallery</h3>
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter text-black">
                    OUR  <span className="text-[#26c0ff]">GALLERY</span>
                  </h2>
                </div>
                <p className="text-gray-600 mt-4 max-w-xl font-medium text-lg">
                  Relive the unforgettable moments from our championships, seminars, and academy gatherings. Select an album to view all photos.
                </p>
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] md:auto-rows-[300px] gap-6">
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`relative rounded-[32px] overflow-hidden bg-gray-200 animate-pulse ${spanClasses[idx % spanClasses.length]}`}
                    >
                      <div className="absolute inset-0 p-8 flex flex-col justify-end gap-3">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-20 bg-gray-300 rounded-full"></div>
                          <div className="h-5 w-28 bg-gray-300 rounded-full"></div>
                        </div>
                        <div className="h-8 bg-gray-300 rounded-lg w-3/4"></div>
                        <div className="h-10 w-32 bg-gray-300 rounded-full mt-2"></div>
                      </div>
                    </div>
                  ))
                ) : albumsData.map((album, idx) => (
                  <motion.div
                    key={album.id}
                    layoutId={`album-container-${album.id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    onClick={() => setSelectedAlbum(album)}
                    className={`relative rounded-[32px] overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-shadow ${spanClasses[idx % spanClasses.length]}`}
                  >
                    <motion.img
                      layoutId={`album-cover-${album.id}`}
                      src={getImageUrl(album.images && album.images[0])}
                      alt={album.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                    {/* <div className="absolute inset-0 bg-[#26c0ff]/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" /> */}

                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-[#f97316] text-black text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                          <ImageIcon size={12} /> {album.images ? album.images.length : 0} Photos
                        </span>
                        <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-white/20 line-clamp-1">
                          {album.description || 'No description'}
                        </span>
                      </div>
                      <motion.h2
                        layoutId={`album-title-${album.id}`}
                        className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight mb-6 max-w-[90%] line-clamp-2"
                      >
                        {album.name}
                      </motion.h2>

                      <button className="self-start px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold text-xs uppercase tracking-widest rounded-full flex items-center gap-2 group-hover:bg-[#f97316] group-hover:border-[#f97316] group-hover:text-black transition-all duration-300">
                        View Album <ChevronRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* ========================================= */
            /*              INSIDE ALBUM VIEW            */
            /* ========================================= */
            <motion.div
              key="album-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              {/* Back Button */}
              <button
                onClick={() => setSelectedAlbum(null)}
                className="self-start flex items-center gap-2 text-gray-500 hover:text-[#0b1b24] transition-colors font-bold uppercase tracking-widest text-xs mb-8 bg-white px-5 py-3 rounded-full shadow-sm border border-gray-200"
              >
                <ArrowLeft size={16} /> Back to Albums
              </button>

              {/* Album Header Banner */}
              <motion.div
                layoutId={`album-container-${selectedAlbum.id}`}
                className="w-full h-[40vh] md:h-[50vh] rounded-[40px] overflow-hidden relative mb-12 shadow-2xl"
              >
                <motion.img
                  layoutId={`album-cover-${selectedAlbum.id}`}
                  src={getImageUrl(selectedAlbum.images && selectedAlbum.images[0])}
                  alt={selectedAlbum.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 flex flex-col justify-end p-8 md:p-16">
                  <div className="inline-block bg-[#f97316] text-black text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full mb-4 w-fit shadow-lg">
                    {selectedAlbum.description || 'No description'}
                  </div>
                  <motion.h1
                    layoutId={`album-title-${selectedAlbum.id}`}
                    className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter max-w-4xl leading-none line-clamp-2"
                  >
                    {selectedAlbum.name}
                  </motion.h1>
                </div>
              </motion.div>

              {/* Photos Grid inside Album */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(selectedAlbum.images || []).map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (idx * 0.1) }}
                    onClick={() => setLightboxImage(getImageUrl(img))}
                    className="relative group rounded-3xl overflow-hidden aspect-square cursor-zoom-in bg-gray-200 shadow-md border border-gray-100"
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${selectedAlbum.name} ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-50 group-hover:scale-100 duration-300">
                        <ImageIcon size={20} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-8">
          {!loading && albumsData.length > 0 && pagination?.total > 0 && (
            <PaginationComponent
              pagination={pagination}
              onPageChange={(newPage) => setCurrentPage(newPage)}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default GalleryPage;
