import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from '../../../api/axios';


const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/storage/')) return `${BASE_URL}${path}`;
  return `${BASE_URL}/storage/${path}`;
};

const spanPattern = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
];

const GallerySkeleton = () => (
  <>
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className={`relative rounded-2xl overflow-hidden bg-white/5 animate-pulse ${spanPattern[index % spanPattern.length]}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-white/[0.01]" />
      </div>
    ))}
  </>
);

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const res = await api.get('/galleries?per_page=4');
        const galleries = res?.data?.data || res.data || [];

        // Flatten all images from all galleries into a single array for the masonry grid
        const allImages = [];
        galleries.forEach(gallery => {
            if (gallery.images && Array.isArray(gallery.images)) {
                gallery.images.forEach(image => {
                    allImages.push({
                        id: `${gallery.id}-${image}`,
                        image_path: image,
                        title: gallery.name
                    });
                });
            }
        });

        setImages(allImages.slice(0,4));

      } catch (error) {
        console.error("Failed to load gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <section id="gallery" className="relative overflow-hidden w-full min-h-screen bg-black flex flex-col justify-center pt-16 pb-12 md:pt-24 md:pb-16 lg:pt-32 lg:pb-24">
      {/* MASSIVE BACKGROUND TEXT */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.03] uppercase tracking-tighter pointer-events-none z-0 whitespace-nowrap select-none">
        GALLERY
      </div>
      <div className="global-container relative z-10 w-full">

        {/* Header Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-1 w-12 bg-[#f97316]"></div>
            <h3 className="text-[#f97316] font-bold tracking-[0.2em] uppercase text-sm">Inside The Academy</h3>
            <div className="h-1 w-12 bg-[#f97316]"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter text-center text-white">
            OUR  <span className="text-[#26c0ff]">GALLERY</span>
          </h2>
        </div>

        {/* MASONRY GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:pl-2 gap-4 auto-rows-[250px] md:auto-rows-[220px]">

          {loading ? (
            <GallerySkeleton />
          ) : (
            images.map((img, index) => (
              <motion.div
                key={img.id || index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`relative rounded-2xl overflow-hidden group shadow-md ${spanPattern[index % spanPattern.length]}`}
              >
                <img
                  src={getImageUrl(img.image_path)}
                  alt={img.title || `Gallery ${index}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
              </motion.div>
            ))
          )}

        </div>

        {/* View More Button */}
        <div className="w-full flex justify-center mt-12">
          <Link to="/gallery" className="text-white font-bold text-sm tracking-widest uppercase hover:text-[#f97316] transition-colors flex items-center gap-2 border-b-2 border-transparent hover:border-[#f97316] pb-1">
            View More <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
