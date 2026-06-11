import React, { useRef } from 'react';
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from 'framer-motion';
import { trainersData as trainers } from '../../../data/homeData';

const OurTrainers = () => {
  const targetRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["calc(0% + 0vw)", "calc(-100% + 100vw)"]);

  return (
    <section ref={targetRef} id="trainers" className="relative h-[300vh] bg-black">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* MASSIVE BACKGROUND TEXT */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.03] uppercase tracking-tighter pointer-events-none z-0 whitespace-nowrap select-none">
          TRAINERS
        </div>
        <motion.div style={{ x }} className="flex w-[340vw] md:w-[325vw] h-full">
          
          {trainers.map((current, index) => (
            <div key={current.id} className="w-screen h-full flex flex-col md:flex-row items-center relative flex-shrink-0">
              
              {/* SPLIT BACKGROUND */}
              <div className="absolute inset-y-0 right-0 w-1/2 bg-[#26c0ff] z-0" />

              {/* BACKGROUND TEXT EFFECT */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden mix-blend-overlay opacity-30">
                <h1 className="text-[25vw] font-black text-white whitespace-nowrap">
                  {current.title}
                </h1>
              </div>

              {/* LEFT CONTENT */}
              <div className="w-full md:w-1/3 flex flex-col justify-center px-6 md:pl-32 md:pr-4 h-[30vh] md:h-full relative z-20 pt-12 md:pt-0">
                <p className="text-[#f97316] tracking-[0.3em] text-[10px] md:text-xs font-bold mb-2 md:mb-4 uppercase">
                  {current.subtitle}
                </p>
                <h1 className="text-4xl md:text-[70px] font-black text-white tracking-widest uppercase mb-2 md:mb-6 leading-none drop-shadow-2xl relative">
                  <span className="relative z-10">{current.title}</span>
                  <span className="absolute top-0 left-[3px] -z-10 text-[#26c0ff] opacity-50 animate-pulse">{current.title}</span>
                </h1>
                <div className="h-[2px] bg-[#26c0ff] mb-2 md:mb-6 w-[40px]" />
                <p className="text-gray-300 text-[10px] md:text-base leading-relaxed md:leading-loose tracking-wider max-w-md">
                  {current.description}
                </p>
              </div>

              {/* CENTER IMAGE */}
              <div className="w-full md:w-1/3 h-[40vh] md:h-[90vh] flex items-end justify-center relative z-30 mt-auto pointer-events-auto group">
                <img 
                  src={current.image} 
                  alt={current.title} 
                  className="max-h-full max-w-full w-auto h-auto object-contain object-bottom opacity-100 transition-all duration-700 drop-shadow-[0_0_60px_rgba(0,0,0,0.8)] md:scale-125"
                />
              </div>

              {/* RIGHT CONTENT */}
              <div className="w-full md:w-1/3 flex flex-col justify-center px-6 md:pl-16 md:pr-8 h-[30vh] md:h-full relative z-20 pb-12 md:pb-0">
                <h4 className="text-white/70 font-black text-[10px] md:text-sm uppercase tracking-widest mb-1 md:mb-2">
                  What They Teach
                </h4>
                <p className="text-white font-black text-sm md:text-2xl mb-2 md:mb-8 drop-shadow-md uppercase tracking-wide">
                  {current.teach}
                </p>
                <div className="h-[2px] w-12 bg-black/20 mb-2 md:mb-8" />
                <h4 className="text-white/70 font-black text-[10px] md:text-sm uppercase tracking-widest mb-1 md:mb-2">
                  Experience
                </h4>
                <p className="text-white/90 font-medium text-[10px] md:text-sm leading-relaxed max-w-xs drop-shadow-md">
                  {current.experience}
                </p>
              </div>

            </div>
          ))}

        
            {/* See More Card */}
            <div className="w-[40vw] md:w-[25vw] h-full flex flex-col items-center justify-center relative flex-shrink-0 bg-[#0b1b24]">
              <Link to="/trainers" className="flex flex-col items-center gap-2 md:gap-4 group">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#f97316] text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-[#26c0ff] transition-all duration-500 shadow-xl">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
                <h2 className="text-base md:text-3xl font-black text-white tracking-widest uppercase">
                  See More
                </h2>
                <p className="text-white/50 text-[8px] md:text-xs uppercase tracking-widest text-center px-2">Meet all trainers</p>
              </Link>
            </div>

        </motion.div>
      </div>
    
        </section>
  );
};

export default OurTrainers;

