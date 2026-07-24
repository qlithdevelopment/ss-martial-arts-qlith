import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../../api/axios';
import {Link} from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

// Ensures there are enough logos to visually fill a row, regardless of how few exist in the DB
const fillRow = (logos, minCount = 10) => {
  if (logos.length === 0) return [];
  const repeated = [];
  while (repeated.length < minCount) {
    repeated.push(...logos);
  }
  return repeated;
};

const MarqueeRow = ({ logos, direction = "left", speed = 40 }) => {
  const filledLogos = fillRow(logos);
  return (
    <div className="relative flex overflow-hidden w-full group py-4">
      <motion.div
        className="flex gap-6 whitespace-nowrap w-max"
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: speed }}
      >
        {/* Duplicated once more so the loop is seamless */}
        {[...filledLogos, ...filledLogos].map((src, i) => (
          <div
            key={i}
            className="w-[180px] h-[90px] md:w-[220px] md:h-[110px] bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0 hover:shadow-md transition-shadow duration-300"
          >
            <img
              src={src}
              alt="Partner Logo"
              className="max-w-[100px] max-h-[40px] md:max-w-[130px] md:max-h-[50px] object-contain opacity-100 hover:opacity-100 transition-opacity  hover:grayscale-0 duration-300"
              onError={(e) => {
                // Fallback text if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span style={{ display: 'none' }} className="font-bold text-gray-400 uppercase tracking-widest text-xs">PARTNER</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const Partners = () => {
  const [row1Logos, setRow1Logos] = useState([]);
  const [row2Logos, setRow2Logos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAffiliations();
  }, []);

  const fetchAffiliations = async () => {
    try {
      setLoading(true);

      const res = await api.get("/affiliations");
      const affiliations = res.data.data.data || [];

      const logos = affiliations.map(
        (item) => `${BASE_URL}/storage/${item.image}`
      );

      setRow1Logos(logos);
      setRow2Logos([...logos].reverse());
    } catch (error) {
      console.error(error);
      toast.error("Failed to load partner affiliations");
    } finally {
      setLoading(false);
    }
  };

  if (loading || row1Logos.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#fcfcfc]  py-12 lg:pl-2 md:py-24 md:py-12 overflow-hidden flex flex-col items-center">

      <div className="global-container pt-16 pb-24 md:pt-8 md:pb-28 relative z-10">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-1 w-12 bg-[#f97316]"></div>
            <h3 className="text-[#f97316] font-bold tracking-[0.2em] uppercase text-sm">Trusted By</h3>
            <div className="h-1 w-12 bg-[#f97316]"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter text-center">
            OUR  <span className="text-[#26c0ff]">PARTNERS</span>
          </h2>
        </div>
        <div className="w-16 h-1 bg-[#f97316] mx-auto mt-4 md:mt-6 rounded-full" />
      </div>

      <div className="global-container md:!px-22 flex flex-col gap-2 relative">
        {/* Soft gradient masks for the left/right edges to fade the logos in and out smoothly */}
        <div className="absolute inset-y-0 left-0 w-[10%] bg-gradient-to-r from-[#fcfcfc] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[10%] bg-gradient-to-l from-[#fcfcfc] to-transparent z-10 pointer-events-none" />
        {/* Top Row - Scrolls Right to Left */}
        <MarqueeRow logos={row1Logos} direction="left" speed={30} />
        {/* Bottom Row - Scrolls Left to Right */}
        <MarqueeRow logos={row2Logos} direction="right" speed={35} />
      </div>
      <div className="w-full flex justify-center mt-12">
          <Link to="/affiliations" className="text-black font-bold text-sm tracking-widest md:mt-8 uppercase hover:text-[#f97316] transition-colors flex items-center gap-2 border-b-2 border-transparent hover:border-[#f97316] pb-1">
            View More <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

    </section>
  );
};

export default Partners;
