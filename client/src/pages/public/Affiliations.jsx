import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Building2 } from 'lucide-react';
import api from '../../api/axios';
import SectionHeader from "../../components/SectionHeader"
import AffiliationDetailModal from '../../components/public/AffiliationDetailModal';

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/storage/')) return `${BASE_URL}${path}`;
  return `${BASE_URL}/storage/${path}`;
};

// Bento pattern — mirrors the sizing rhythm used in GalleryPage
const spanClasses = [
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
];

const Affiliation = () => {
  const [affiliations, setAffiliations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAffiliation, setSelectedAffiliation] = useState(null);

  useEffect(() => {
    const fetchAffiliations = async () => {
      try {
        setLoading(true);
        const res = await api.get('/affiliations');
        const payload = res?.data?.data;
        setAffiliations(payload?.data || []);
      } catch (error) {
        console.error('Failed to fetch affiliations', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAffiliations();
  }, []);

  return (
    <section className="w-full min-h-screen bg-white px-4 md:px-8 py-16 md:py-24 relative overflow-hidden">

      <div className="global-container lg:!px-14 relative z-10">
        <div className="fixed top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[16vw] font-black text-black/[0.05] uppercase tracking-tighter pointer-events-none  whitespace-nowrap select-none">
          AFFILIATED
        </div>
        <motion.div
        initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
        <SectionHeader
          label="Our Network"
          title="OUR"
          titleColor="text-black"
          highlight="AFFILIATIONS"
        />
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[220px] md:auto-rows-[300px] gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className={`relative rounded-[24px] overflow-hidden bg-gray-900 border border-gray-800 animate-pulse ${spanClasses[idx % spanClasses.length]}`}
              />
            ))
          ) : affiliations.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <Building2 className="text-gray-600 mb-4" size={40} />
              <p className="text-gray-400 font-medium">No affiliations to show right now.</p>
            </div>
          ) : (
            affiliations.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => setSelectedAffiliation(item)}
                className={`relative rounded-[24px] cursor-pointer overflow-hidden bg-gray-300 shadow-2xl group hover:shadow-[0_10px_40px_rgba(38,192,255,0.2)] transition-shadow duration-300 ${spanClasses[idx % spanClasses.length]}`}
              >
                {/* Logo as full-bleed background, scales with card size */}

                <div className="relative rounded-[24px] overflow-hidden bg-white flex flex-col h-full">
                  {/* TOP: Logo section */}
                  <div className="relative w-full h-full md:h-[55%]  bg-gray-50 flex items-center justify-center shrink-0">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-[50%] h-[90%] object-cover p-6 md:p-0 transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <Building2 className="text-gray-300" size={48} />
                      </div>
                    )}
                  </div>

                  {/* BOTTOM: Content section */}
                  <div className="flex-1 p-5 md:p-8 md:py-3 flex flex-col justify-start bg-white">
                    <h4 className="text-base md:text-lg font-black text-black uppercase tracking-tight leading-tight line-clamp-2 mb-1">
                      {item.name}
                    </h4>

                    {item.description && (
                      <p className="text-xs text-gray-500 font-medium line-clamp-2 mb-2 max-w-[95%]">
                        {item.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      {item.phone && (
                        <a
                          href={`tel:${item.phone}`}
                          className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-[#f97316] transition-colors"
                        >
                          <Phone size={12} className="shrink-0" />
                          <span className="truncate">{item.phone}</span>
                        </a>
                      )}
                      {item.location && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <MapPin size={12} className="shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div >

      </div >
      <AffiliationDetailModal
        affiliation={selectedAffiliation}
        onClose={() => setSelectedAffiliation(null)}
        getImageUrl={getImageUrl}
      />
    </section >
  );
};

export default Affiliation;