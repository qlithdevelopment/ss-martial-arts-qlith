import React, { useRef, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from 'framer-motion';

import { testimonialsData } from '../../../data/homeData';

const QuoteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-800">
    <path d="M11 11V19H3V11C3 6.58172 6.58172 3 11 3V7C8.79086 7 7 8.79086 7 11H11ZM21 11V19H13V11C13 6.58172 16.5817 3 21 3V7C18.7909 7 17 8.79086 17 11H21Z" fill="currentColor"/>
  </svg>
);

const Stars = ({ count = 5 }) => (
  <div className="flex gap-1 text-yellow-400 my-2">
    {[...Array(5)].map((_, i) => (
      <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < count ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

const Testimonials = () => {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const parentRef = useRef(null);
  const childRef = useRef(null);
  const [maxScroll, setMaxScroll] = useState(0);
  const [dynamicScale, setDynamicScale] = useState(1);

  useEffect(() => {
    const updateLayout = () => {
      // 1. Calculate dynamic scale based on exact viewport height to GUARANTEE no clipping
      // Reserve ~280px for the Header and padding. The tallest column is ~620px.
      const availableHeight = window.innerHeight - 280;
      const newScale = Math.min(1, availableHeight / 620);
      setDynamicScale(newScale);

      // 2. Wait for Framer Motion to apply scale, then read scaled width for perfect scrolling
      setTimeout(() => {
        if (parentRef.current && childRef.current) {
          const pWidth = parentRef.current.clientWidth;
          const cWidth = childRef.current.getBoundingClientRect().width;
          setMaxScroll(Math.max(0, cWidth - pWidth));
        }
      }, 50);
    };
    
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -maxScroll]);

  return (
    <section ref={targetRef} id="testimonials" className="relative h-[300vh] bg-[#e0e1e5]">
      
      <style>{`
        .bubble-down::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 15px 15px 0;
          border-style: solid;
          border-color: white transparent transparent transparent;
          display: block;
          width: 0;
        }
        .bubble-up::after {
          content: '';
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 0 15px 15px;
          border-style: solid;
          border-color: transparent transparent white transparent;
          display: block;
          width: 0;
        }
      `}</style>

      {/* Sticky Container */}
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col pt-[70px] md:pt-20 pb-4 md:pb-8">
        
        {/* Header */}
        <div className="global-container mb-2 md:mb-4 shrink-0 right- lg-right-0 flex flex-col md:flex-row justify-center items-center lg:items-end gap-2 md:gap-4 z-10 relative">
          <div>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3 md:gap-4 mb-2">
                <div className="h-1 w-8 md:w-12 bg-[#f97316]"></div>
                <h3 className="text-[#f97316] font-bold tracking-[0.2em] uppercase text-[10px] md:text-sm">Success Stories</h3>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase leading-none tracking-tighter text-[#0b1b24]">
                MEMBER  <span className="text-[#26c0ff]">REVIEWS</span>
              </h2>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 mb-2">
             <div className="w-2 h-2 rounded-full bg-[#26c0ff] animate-pulse" />
             <p className="text-gray-600 font-bold text-xs tracking-widest uppercase">Scroll Down to Explore</p>
          </div>
        </div>

        {/* Scrolling Track */}
        <div ref={parentRef} className="w-full flex-1 min-h-0 overflow-hidden flex items-center relative">
          <motion.div 
            ref={childRef}
            style={{ 
              x,
              scale: dynamicScale,
              transformOrigin: "left center" 
            }} 
            className="flex gap-4 md:gap-6 px-4 md:px-8 xl:px-[calc((100vw-1400px)/2+2rem)] items-center h-max w-max"
          >
            
            {/* We render the 4 columns THREE times so there is a continuous stream of cards with no gaps at the end */}
            {[1, 2, 3].map((setIndex) => (
            <React.Fragment key={setIndex}>
              {/* COLUMN 1 */}
              <div className="flex flex-col gap-4 md:gap-6 shrink-0 h-auto w-[260px] xl:w-[300px] justify-center py-6">
                {/* Card 1: Quote Box */}
                <div className="bg-white rounded-[20px] p-5 xl:p-6 shadow-sm relative h-auto">
                  <QuoteIcon />
                  <p className="text-[10px] xl:text-[11px] text-gray-600 mt-3 font-medium leading-relaxed">
                    {testimonialsData[0].text}
                  </p>
                  <div className="flex items-center gap-3 mt-4 border-t border-gray-100 pt-3">
                    <img src={testimonialsData[0].image} className="w-8 h-8 rounded-full object-cover shrink-0" alt="User" />
                    <div>
                      <h4 className="text-[10px] xl:text-[11px] font-bold text-gray-900">{testimonialsData[0].name}</h4>
                      <p className="text-[9px] text-[#0b1b24]">{testimonialsData[0].role}</p>
                    </div>
                  </div>
                </div>
                
                {/* Card 2: Square Text Box */}
                <div className="bg-white rounded-[20px] p-5 xl:p-6 shadow-sm h-auto flex flex-col justify-between">
                  <p className="text-[11px] xl:text-[12px] text-gray-800 font-medium leading-relaxed mt-2">
                    {testimonialsData[1].text}
                  </p>
                  <div className="flex items-center justify-between mt-4 xl:mt-6">
                    <div className="flex items-center gap-3">
                      <img src={testimonialsData[1].image} className="w-8 h-8 xl:w-10 xl:h-10 rounded-full object-cover shrink-0" alt="User" />
                      <div>
                        <h4 className="text-[11px] xl:text-[12px] font-bold text-gray-900">{testimonialsData[1].name}</h4>
                        <p className="text-[9px] xl:text-[10px] text-gray-500">{testimonialsData[1].role}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Down Bubble */}
                <div className="bg-white rounded-[20px] p-5 xl:p-6 shadow-sm relative bubble-down mt-2 h-auto">
                  <h4 className="text-center text-xs xl:text-sm font-black text-gray-900 mb-2">{testimonialsData[2].title}</h4>
                  <p className="text-[10px] xl:text-[11px] text-gray-600 text-center font-medium leading-relaxed">
                    {testimonialsData[2].text}
                  </p>
                </div>
              </div>

              {/* COLUMN 2 */}
              <div className="flex flex-col shrink-0 h-auto w-[220px] xl:w-[240px] pt-12 pb-6 justify-center">
                {/* Card 4: Tall Card */}
                <div className="bg-white rounded-[24px] p-6 xl:p-8 shadow-sm flex flex-col items-center text-center h-auto">
                  <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-full overflow-hidden mb-4 border-[3px] border-white shadow-md relative -top-[40px] shrink-0">
                    <img src={testimonialsData[3].image} className="w-full h-full object-cover" alt="User" />
                  </div>
                  <div className="-mt-8 xl:-mt-6">
                    <Stars count={testimonialsData[3].stars} />
                  </div>
                  <h4 className="text-[12px] xl:text-[14px] font-black text-gray-900 mb-2 xl:mb-3">{testimonialsData[3].title}</h4>
                  <p className="text-[11px] xl:text-[12px] text-gray-600 font-medium leading-relaxed flex-1 pb-4">
                    {testimonialsData[3].text}
                  </p>
                  <div className="mt-auto w-full text-right">
                    <div className="inline-block transform scale-x-[-1]">
                      <QuoteIcon />
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMN 3 */}
              <div className="flex flex-col gap-4 md:gap-6 shrink-0 h-auto w-[240px] xl:w-[280px] justify-center py-6">
                {/* Card 5: Large Image Card */}
                <div className="bg-white rounded-[24px] p-3 shadow-sm h-auto">
                  <div className="w-full h-[160px] xl:h-[220px] rounded-[16px] overflow-hidden mb-3 xl:mb-4 bg-gray-100 shrink-0">
                    <img src={testimonialsData[4].image} className="w-full h-full object-cover" alt="Training" />
                  </div>
                  <div className="px-2 xl:px-3 pb-2 xl:pb-3">
                    <p className="text-[10px] xl:text-[11px] text-gray-600 font-medium leading-relaxed text-center">
                      {testimonialsData[4].text}
                    </p>
                  </div>
                </div>

                {/* Card 6: Small Bubble */}
                <div className="bg-white rounded-[20px] p-5 xl:p-6 shadow-sm relative bubble-down mt-6 xl:mt-8 flex flex-col items-center h-auto">
                  <div className="absolute -top-[24px] xl:-top-[30px] left-1/2 -translate-x-1/2">
                    <img src={testimonialsData[5].image} className="w-10 h-10 xl:w-12 xl:h-12 rounded-full border-[3px] border-white shadow-sm shrink-0" alt="User" />
                  </div>
                  <div className="mt-4">
                    <Stars count={testimonialsData[5].stars} />
                  </div>
                  <p className="text-[10px] xl:text-[11px] text-gray-600 font-medium leading-relaxed text-center mt-2">
                    {testimonialsData[5].text}
                  </p>
                </div>
              </div>

              {/* COLUMN 4 */}
              <div className="flex flex-col gap-4 md:gap-6 shrink-0 h-auto w-[280px] xl:w-[340px] justify-center py-6 pt-12">
                {/* Card 7: Wide Top */}
                <div className="bg-white rounded-[20px] p-5 xl:p-6 shadow-sm relative bubble-up h-auto mt-2">
                  <div className="absolute -top-[30px] xl:-top-[40px] right-6 xl:right-8">
                    <img src={testimonialsData[6].image} className="w-10 h-10 xl:w-12 xl:h-12 rounded-full border-[3px] border-[#e0e1e5] shrink-0" alt="User" />
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-[11px] xl:text-[13px] font-black text-gray-900">{testimonialsData[6].name}</h4>
                    <Stars count={testimonialsData[6].stars} />
                  </div>
                  <p className="text-[10px] xl:text-[11px] text-gray-600 font-medium leading-relaxed">
                    {testimonialsData[6].text}
                  </p>
                </div>

                {/* Card 8: Wide Middle */}
                <div className="bg-white rounded-[20px] p-5 xl:p-6 shadow-sm flex items-center gap-3 xl:gap-4 h-auto">
                  <img src={testimonialsData[7].image} className="w-16 h-16 xl:w-20 xl:h-20 rounded-lg object-cover shrink-0" alt="User" />
                  <div>
                    <QuoteIcon />
                    <p className="text-[10px] xl:text-[11px] text-gray-800 font-bold leading-relaxed mt-2">
                      {testimonialsData[7].text}
                    </p>
                  </div>
                </div>

                {/* Card 9: Wide Bottom */}
                <div className="bg-white rounded-[20px] p-5 xl:p-6 shadow-sm flex items-center justify-between gap-4 h-auto">
                  <p className="text-[10px] xl:text-[11px] text-gray-600 font-medium leading-relaxed">
                    {testimonialsData[8].text}
                  </p>
                  <div className="flex flex-col items-center shrink-0">
                    <img src={testimonialsData[8].image} className="w-10 h-10 xl:w-14 xl:h-14 rounded-full object-cover shadow-sm mb-1 xl:mb-2 shrink-0" alt="User" />
                    <h4 className="text-[9px] xl:text-[10px] font-bold text-gray-900">{testimonialsData[8].name}</h4>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
          </motion.div>
        </div>
      </div>
    
        </section>
  );
};

export default Testimonials;
