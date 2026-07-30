import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from 'framer-motion';

import api from '../../../api/axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "")

const getImageUrl = (path) => {
  if (!path) return null;
  return `${BASE_URL}/storage${path.startsWith('/') ? '' : '/'}${path}`;
};

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

// Each "set" renders 4 visual columns and consumes up to 9 testimonials
// (columns 1 & 3 hold 3 cards, column 2 holds 1 tall card, column 4 holds 3 cards).
const COLUMNS_PER_SET = 4;
const TESTIMONIALS_PER_SET = 9;


const COLUMNS_PER_PAGE = 7;
const VH_PER_PAGE = 100;

const getSectionHeightVh = (totalColumns) => {
  const safeColumns = Math.max(1, totalColumns);
  const pages = Math.ceil(safeColumns / COLUMNS_PER_PAGE);
  return pages * VH_PER_PAGE;
};

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

  const [testimonialsData, setTestimonialsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const res = await api.get('/testimonials');
        const payload = res?.data?.data;
        setTestimonialsData(Array.isArray(payload) ? payload : payload?.data || []);
      } catch (error) {
        console.error(error);
        setTestimonialsData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Number of repeated column-sets to render. At least 3 (for a smooth,
  // gapless looping strip); grows if there's enough real data to fill
  // more unique sets, which in turn grows the section height/scroll length.
  const numSets = useMemo(() => {
    if (!testimonialsData.length) return 3;
    const setsNeededForData = Math.ceil(testimonialsData.length / TESTIMONIALS_PER_SET);
    return Math.max(3, setsNeededForData);
  }, [testimonialsData.length]);

  const totalColumns = numSets * COLUMNS_PER_SET;
  const sectionHeightVh = getSectionHeightVh(totalColumns);

  useEffect(() => {
    const updateLayout = () => {

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
  }, [testimonialsData, numSets]);

  const x = useTransform(scrollYProgress, [0, 1], [0, -maxScroll]);

  // Safe accessor so the fixed 9-slot-per-set layout below never crashes if
  // the backend returns fewer testimonials than needed (wraps around instead).
  const getTestimonial = (index) => {
    if (!testimonialsData.length) {
      return { text: '', name: '', role: '', title: '', image: '', stars: 0 };
    }
    return testimonialsData[index % testimonialsData.length] || {};
  };

  if (loading || testimonialsData.length === 0) {
    return null;
  }


  return (
    <section
      ref={targetRef}
      id="testimonials"
      className="relative bg-white"
      style={{ height: `${sectionHeightVh}vh` }}
    >

      {/* Sticky Container */}
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col pt-[70px] md:pt-20 pb-4 md:pb-8">

        {/* Header */}
        <div className="global-container mb-2 md:mb-4 shrink-0 right- lg-right-0 flex flex-col md:flex-col justify-center items-center lg:items-center gap-2 md:gap-4 z-10 relative">
          <div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-3 md:gap-4 mb-2">
                <div className="h-1 w-8 md:w-12 bg-[#f97316]"></div>
                <h3 className="text-[#f97316] font-bold tracking-[0.2em] uppercase text-[10px] md:text-sm">Success Stories</h3>
                <div className="h-1 w-8 md:w-12 bg-[#f97316]"></div>
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

            {/* Render `numSets` groups of 4 columns each. numSets scales with
                the amount of real testimonial data (min 3 for a seamless loop),
                which drives totalColumns -> sectionHeightVh above. */}
            {Array.from({ length: numSets }, (_, i) => i).map((setIndex) => {
              const base = setIndex * TESTIMONIALS_PER_SET;
              return (
              <React.Fragment key={setIndex}>
                {/* COLUMN 1 */}
                <div className="flex flex-col gap-4 md:gap-6 shrink-0 h-auto w-[260px] xl:w-[300px] justify-center py-6">
                  {/* Card 1: Quote Box */}
                  <div className="bg-white rounded-[20px] p-5 xl:p-6 shadow-2xl relative h-auto">
                    <QuoteIcon />
                    <p className="text-[10px] xl:text-[11px] text-gray-600 mt-3 font-medium leading-relaxed">
                      {getTestimonial(base + 0).text}
                    </p>
                    <div className="flex items-center gap-3 mt-4 border-t border-gray-100 pt-3">
                      <img src={getImageUrl(getTestimonial(base + 0).image)} className="w-8 h-8 rounded-full object-cover shrink-0" alt="User" />
                      <div>
                        <h4 className="text-[10px] xl:text-[11px] font-bold text-gray-900">{getTestimonial(base + 0).name}</h4>
                        <p className="text-[9px] text-[#0b1b24]">{getTestimonial(base + 0).role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Square Text Box */}
                  <div className="bg-white rounded-[20px] p-5 xl:p-6 shadow-2xl h-auto flex flex-col justify-between">
                    <p className="text-[11px] xl:text-[12px] text-gray-800 font-medium leading-relaxed mt-2">
                      {getTestimonial(base + 1).text}
                    </p>
                    <div className="flex items-center justify-between mt-4 xl:mt-6">
                      <div className="flex items-center gap-3">
                        <img src={getImageUrl(getTestimonial(base + 1).image)} className="w-8 h-8 xl:w-10 xl:h-10 rounded-full object-cover shrink-0" alt="User" />
                        <div>
                          <h4 className="text-[11px] xl:text-[12px] font-bold text-gray-900">{getTestimonial(base + 1).name}</h4>
                          <p className="text-[9px] xl:text-[10px] text-gray-500">{getTestimonial(base + 1).role}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Down Bubble */}
                  <div className="bg-white rounded-[20px] p-5 xl:p-6 shadow-2xl relative mt-2 h-auto after:content-[''] after:absolute after:-bottom-[15px] after:left-1/2 after:-translate-x-1/2 after:block after:w-0 after:border-x-[15px] after:border-x-transparent after:border-t-[15px] after:border-t-white after:border-b-0">
                    <h4 className="text-center text-xs xl:text-sm font-black text-gray-900 mb-2">{getTestimonial(base + 2).title}</h4>
                    <p className="text-[10px] xl:text-[11px] text-gray-600 text-center font-medium leading-relaxed">
                      {getTestimonial(base + 2).text}
                    </p>
                  </div>
                </div>

                {/* COLUMN 2 */}
                <div className="flex flex-col shrink-0 h-auto w-[220px] xl:w-[240px] pt-12 pb-6 justify-center">
                  {/* Card 4: Tall Card */}
                  <div className="bg-white rounded-[24px] p-6 xl:p-8 shadow-2xl flex flex-col items-center text-center h-auto">
                    <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-full overflow-hidden mb-4 border-[3px] border-white shadow-md relative -top-[40px] shrink-0">
                      <img src={getImageUrl(getTestimonial(base + 3).image)} className="w-full h-full object-cover" alt="User" />
                    </div>
                    <div className="-mt-8 xl:-mt-6">
                      <Stars count={getTestimonial(base + 3).stars} />
                    </div>
                    <h4 className="text-[12px] xl:text-[14px] font-black text-gray-900 mb-2 xl:mb-3">{getTestimonial(base + 3).title}</h4>
                    <p className="text-[11px] xl:text-[12px] text-gray-600 font-medium leading-relaxed flex-1 pb-4">
                      {getTestimonial(base + 3).text}
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
                  <div className="bg-white rounded-[24px] p-3 shadow-2xl h-auto">
                    <div className="w-full h-[160px] xl:h-[220px] rounded-[16px] overflow-hidden mb-3 xl:mb-4 bg-gray-100 shrink-0">
                      <img src={getImageUrl(getTestimonial(base + 4).image)} className="w-full h-full object-cover" alt="Training" />
                    </div>
                    <div className="px-2 xl:px-3 pb-2 xl:pb-3">
                      <p className="text-[10px] xl:text-[11px] text-gray-600 font-medium leading-relaxed text-center">
                        {getTestimonial(base + 4).text}
                      </p>
                    </div>
                  </div>

                  {/* Card 6: Small Bubble */}
                  <div className="bg-white rounded-[20px] p-5 xl:p-6 shadow-2xl relative mt-6 xl:mt-8 flex flex-col items-center h-auto after:content-[''] after:absolute after:-bottom-[15px] after:left-1/2 after:-translate-x-1/2 after:block after:w-0 after:border-x-[15px] after:border-x-transparent after:border-t-[15px] after:border-t-white after:border-b-0">
                    <div className="absolute -top-[24px] xl:-top-[30px] left-1/2 -translate-x-1/2">
                      <img src={getImageUrl(getTestimonial(base + 5).image)} className="w-10 h-10 xl:w-12 xl:h-12 rounded-full border-[3px] border-white shadow-2xl shrink-0" alt="User" />
                    </div>
                    <div className="mt-4">
                      <Stars count={getTestimonial(base + 5).stars} />
                    </div>
                    <p className="text-[10px] xl:text-[11px] text-gray-600 font-medium leading-relaxed text-center mt-2">
                      {getTestimonial(base + 5).text}
                    </p>
                  </div>
                </div>

                {/* COLUMN 4 */}
                <div className="flex flex-col gap-4 md:gap-6 shrink-0 h-auto w-[280px] xl:w-[340px] justify-center py-6 pt-12">
                  {/* Card 7: Wide Top */}
                  <div className="bg-white rounded-[20px] p-5 xl:p-6 shadow-2xl relative h-auto mt-2 after:content-[''] after:absolute after:-top-[15px] after:left-1/2 after:-translate-x-1/2 after:block after:w-0 after:border-x-[15px] after:border-x-transparent after:border-b-[15px] after:border-b-white after:border-t-0">
                    <div className="absolute -top-[30px] xl:-top-[40px] right-6 xl:right-8">
                      <img src={getImageUrl(getTestimonial(base + 6).image)} className="w-10 h-10 xl:w-12 xl:h-12 rounded-full border-[3px] border-[#e0e1e5] shrink-0" alt="User" />
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-[11px] xl:text-[13px] font-black text-gray-900">{getTestimonial(base + 6).name}</h4>
                      <Stars count={getTestimonial(base + 6).stars} />
                    </div>
                    <p className="text-[10px] xl:text-[11px] text-gray-600 font-medium leading-relaxed">
                      {getTestimonial(base + 6).text}
                    </p>
                  </div>

                  {/* Card 8: Wide Middle */}
                  <div className="bg-white rounded-[20px] p-5 xl:p-6 shadow-2xl flex items-center gap-3 xl:gap-4 h-auto">
                    <img src={getImageUrl(getTestimonial(base + 7).image)} className="w-16 h-16 xl:w-20 xl:h-20 rounded-lg object-cover shrink-0" alt="User" />
                    <div>
                      <QuoteIcon />
                      <p className="text-[10px] xl:text-[11px] text-gray-800 font-bold leading-relaxed mt-2">
                        {getTestimonial(base + 7).text}
                      </p>
                    </div>
                  </div>

                  {/* Card 9: Wide Bottom */}
                  <div className="bg-white rounded-[20px] p-5 xl:p-6 shadow-2xl flex items-center justify-between gap-4 h-auto">
                    <p className="text-[10px] xl:text-[11px] text-gray-600 font-medium leading-relaxed">
                      {getTestimonial(base + 8).text}
                    </p>
                    <div className="flex flex-col items-center shrink-0">
                      <img src={getImageUrl(getTestimonial(base + 8).image)} className="w-10 h-10 xl:w-14 xl:h-14 rounded-full object-cover shadow-2xl mb-1 xl:mb-2 shrink-0" alt="User" />
                      <h4 className="text-[9px] xl:text-[10px] font-bold text-gray-900">{getTestimonial(base + 8).name}</h4>
                    </div>
                  </div>
                </div>
              </React.Fragment>
              );
            })}
          </motion.div>
        </div>
      </div>

        </section>
  );
};

export default Testimonials;