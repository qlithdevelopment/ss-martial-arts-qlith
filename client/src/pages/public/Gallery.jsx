import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, ImageIcon, ChevronRight } from 'lucide-react';
import axios from '../../api/axios';

import { getImageUrl } from '../../utils/imageUtils'
import LightboxModal from '../../components/public/galleries/LightboxModal'
import PublicAlbumCard from '../../components/public/galleries/PublicAlbumCard'
import AlbumDetailView from '../../components/public/galleries/AlbumDetailView'

const parseImages = (imgs) => {
  if (!imgs) return [];
  if (typeof imgs === 'string') {
    try {
      return JSON.parse(imgs);
    } catch (e) {
      return [];
    }
  }
  return Array.isArray(imgs) ? imgs : [];
};

const GalleryPage = () => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [albumsData, setAlbumsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    // API Fetch logic
    const fetchAlbums = async () => {
      try {
        const response = await axios.get('/galleries');
        if (response.data && response.data.data) {
          setAlbumsData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch galleries from backend:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, [selectedAlbum]);

  useEffect(() => {
    if (lightboxImage) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [lightboxImage]);

  const handleAlbumClick = async (album) => {
    try {
      const res = await axios.get(`/galleries/${album.id}`);
      if (res.data && res.data.data) {
        setSelectedAlbum(res.data.data);
      } else {
        setSelectedAlbum(album);
      }
    } catch (error) {
      console.error(error);
      setSelectedAlbum(album);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f9fafb] pt-24 pb-12 md:pt-28 md:pb-16 lg:pt-32 lg:pb-24 px-4 md:px-8 font-sans selection:bg-[var(--color-primary2)] selection:text-white relative">
      
      <LightboxModal
        lightboxImage={lightboxImage}
        setLightboxImage={setLightboxImage}
      />

      {/* MASSIVE BACKGROUND TEXT */}
      <div className="fixed top-[35vh] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-black/[0.03] uppercase tracking-tighter pointer-events-none z-0 whitespace-nowrap select-none">
        GALLERY
      </div>

      <div className="global-container relative z-10">

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
                    <div className="h-1 w-12 bg-[var(--color-primary2)]"></div>
                    <h3 className="text-[var(--color-primary2)] font-bold tracking-[0.2em] uppercase text-sm">Gallery</h3>
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter text-black">
                    OUR  <span className="text-[var(--color-primary)]">GALLERY</span>
                  </h2>
                </div>
                <p className="text-gray-600 mt-4 max-w-xl font-medium text-lg">
                  Relive the unforgettable moments from our championships, seminars, and academy gatherings. Select an album to view all photos.
                </p>
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] md:auto-rows-[300px] gap-6">
                {albumsData.map((album, idx) => (
                  <PublicAlbumCard
                    key={album.id}
                    album={album}
                    idx={idx}
                    onClick={handleAlbumClick}
                    parseImages={parseImages}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            /* ========================================= */
            /*              INSIDE ALBUM VIEW            */
            /* ========================================= */
            <AlbumDetailView
              selectedAlbum={selectedAlbum}
              setSelectedAlbum={setSelectedAlbum}
              parseImages={parseImages}
              setLightboxImage={setLightboxImage}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default GalleryPage;
