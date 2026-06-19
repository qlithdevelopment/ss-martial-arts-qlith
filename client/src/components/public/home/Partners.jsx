import React from 'react';
import { motion } from 'framer-motion';

import { row1Logos, row2Logos } from '../../../data/homeData';

const MarqueeRow = ({ logos, direction = "left", speed = 40 }) => {
  return (
    <div className="relative flex overflow-hidden w-full group py-4">
      <motion.div
        className="flex gap-6 whitespace-nowrap w-max"
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: speed }}
      >
        {/* We render the logos twice so it seamlessly loops */}
        {[...logos, ...logos, ...logos].map((src, i) => (
          <div 
            key={i} 
            className="w-[180px] h-[90px] md:w-[220px] md:h-[110px] bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0 hover:shadow-md transition-shadow duration-300"
          >
            <img 
              src={src} 
              alt="Partner Logo" 
              className="max-w-[100px] max-h-[40px] md:max-w-[130px] md:max-h-[50px] object-contain opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-300"
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
  return (
    <section className="w-full bg-[#fcfcfc] py-12 md:py-24 overflow-hidden flex flex-col items-center">
      
      <div className="global-container pt-16 pb-24 md:pt-20 md:pb-32 relative z-10">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-1 w-12 bg-[var(--color-primary2)]"></div>
            <h3 className="text-[var(--color-primary2)] font-bold tracking-[0.2em] uppercase text-sm">Trusted By</h3>
            <div className="h-1 w-12 bg-[var(--color-primary2)]"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter text-center">
            OUR  <span className="text-[var(--color-primary)]">PARTNERS</span>
          </h2>
        </div>
        <div className="w-16 h-1 bg-[var(--color-primary2)] mx-auto mt-4 md:mt-6 rounded-full" />
      </div>

      <div className="global-container flex flex-col gap-2 relative">
        {/* Soft gradient masks for the left/right edges to fade the logos in and out smoothly */}
        <div className="absolute inset-y-0 left-0 w-[10%] bg-gradient-to-r from-[#fcfcfc] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[10%] bg-gradient-to-l from-[#fcfcfc] to-transparent z-10 pointer-events-none" />
        
        {/* Top Row - Scrolls Right to Left */}
        <MarqueeRow logos={row1Logos} direction="left" speed={30} />
        
        {/* Bottom Row - Scrolls Left to Right */}
        <MarqueeRow logos={row2Logos} direction="right" speed={35} />
      </div>

    </section>
  );
};

export default Partners;
