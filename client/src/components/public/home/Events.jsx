import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { X, Send, Calendar } from "lucide-react";
import api from "../../../api/axios";

const Events = () => {
  const targetRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data.data || []);
      } catch (err) {
        console.error('Failed to load events');
      }
    };
    fetchEvents();
  }, []);

  const featuredEvents = events.slice(0, 3);
  const eventsList = events.slice(0, 4);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const N = featuredEvents.length > 0 ? featuredEvents.length : 3;
  const x = useTransform(scrollYProgress, [0, 1], ["0%", N > 1 ? `-${((N - 1) / N) * 100}%` : "0%"]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.round(latest * (N - 1));
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  });

  return (
    <section id="events" ref={targetRef} className="h-[300vh] bg-black relative pb-0">
      
      {/* Sticky Container */}
      <div className="sticky top-0 h-[100svh] flex flex-col justify-center overflow-hidden">
        {/* MASSIVE BACKGROUND TEXT */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.03] uppercase tracking-tighter pointer-events-none z-0 whitespace-nowrap select-none">
          EVENTS
        </div>
        <div className="global-container grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center relative z-10">
          
          {/* LEFT SIDE: Horizontal Device Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex w-full perspective-1000 py-0 px-0 md:py-0 md:px-0 mt-0 lg:mt-0"
          >
            {/* Horizontal Device Frame (Minimal Bezel) */}
            <div className="relative w-full aspect-[16/10] md:aspect-[16/10] bg-gray-900 rounded-[28px] md:rounded-[40px] shadow-[0_40px_80px_rgba(212,175,55,0.4)] p-[6px] md:p-[8px] border border-gray-800 flex items-center justify-center">
              
              {/* Landscape Camera Hole (Left Side Bezel) */}
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 bg-[#111] rounded-full z-50 shadow-inner" />

              {/* Screen (Dynamic Background) */}
              <motion.div 
                animate={{ backgroundColor: activeIndex % 2 === 0 ? "#26c0ff" : "#f97316" }}
                transition={{ duration: 0.5 }}
                className="w-full h-full rounded-[26px] md:rounded-[32px] relative overflow-hidden flex flex-col py-5 px-5 md:py-6 md:px-8 shadow-inner"
              >
                
                {/* Fake Status Bar (Landscape) */}
                <div className="absolute top-3 left-6 text-[9px] font-bold text-white z-40 opacity-80">9:41</div>
                <div className="absolute top-3 right-6 flex items-center gap-1 z-40 opacity-80">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                  <div className="w-4 h-2 border border-white rounded-[3px] p-[1px]"><div className="bg-white h-full w-[80%] rounded-[1px]" /></div>
                </div>

                {/* Top Row: Pill */}
                <div className="hidden md:flex justify-between items-start w-full relative z-20 shrink-0 mt-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                    <span className="text-sm">🔥</span>
                    <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase text-white">Featured</span>
                  </div>
                </div>

                {/* Scrollable Horizontal Area inside Screen (Driven by Scroll) */}
                <div className="flex-1 overflow-hidden relative z-20 w-full mt-4 pb-4">
                  <motion.div 
                    style={{ x, width: `${N * 100}%` }}
                    className="flex h-full items-center"
                  >
                    {featuredEvents.map((evt) => (
                      <div 
                        key={evt.id} 
                        style={{ width: `${100 / N}%` }} 
                        className="shrink-0 flex flex-col justify-center items-start text-left pr-2 md:pr-4 lg:pr-6"
                      >
                        <p className="text-white/90 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-1 md:mb-2">
                          {evt.date}
                        </p>
                        <h3 className="text-[16px] leading-[1.1] md:text-2xl lg:text-3xl font-black md:leading-tight tracking-tight mb-1 md:mb-2 text-white drop-shadow-sm w-full text-wrap pr-2 md:pr-0">
                          {evt.name}
                        </h3>
                        <p className="text-white/80 text-[10px] md:text-xs font-medium mb-3 md:mb-4 line-clamp-2 max-w-[95%] md:max-w-md">
                          {evt.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-3 w-full mt-auto">
                          <button 
                            onClick={() => { setSelectedEventId(evt.id); setIsModalOpen(true); }}
                            className="px-5 py-2.5 md:py-3 rounded-full border border-white bg-white backdrop-blur-sm flex items-center gap-1.5 hover:bg-white/90 text-black transition-all text-[10px] md:text-xs font-bold"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            Register
                          </button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-auto shrink-0 relative z-20">
                  {featuredEvents.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === i ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} 
                    />
                  ))}
                </div>
                
                {/* Home Indicator Line (Landscape Right Edge) */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1/4 bg-white/30 rounded-full z-50 hidden md:block" />

                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              </motion.div>

              {/* Side Buttons (Volume / Power) */}
              <div className="absolute top-[30px] -left-[2px] w-[3px] h-[30px] bg-gray-800 rounded-l-md" />
              <div className="absolute top-[80px] -left-[2px] w-[3px] h-[50px] bg-gray-800 rounded-l-md" />
              <div className="absolute top-[60px] -right-[2px] w-[3px] h-[60px] bg-gray-800 rounded-r-md" />
            </div>
          </motion.div>

          {/* RIGHT SIDE: Title and Static List */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col justify-start pb-2 md:pb-0 px-2 md:px-0 lg:-mt-10"
          >
            <div className="flex flex-col items-start mb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-1 w-12 bg-[#f97316]"></div>
                <h3 className="text-[#f97316] font-bold tracking-[0.2em] uppercase text-sm">Join The Action</h3>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter text-white">
                UPCOMING  <span className="text-[#26c0ff]">EVENTS</span>
              </h2>
            </div>

            <div className="flex flex-col gap-1 md:gap-8 mt-1">
              {eventsList.map((evt) => (
                <div key={evt.id} className="flex items-start gap-4 group cursor-pointer">
                  {/* Icon Circle */}
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#f97316] group-hover:text-white text-[#f97316] transition-colors duration-300">
                    <Calendar size={20} />
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex flex-col pt-0">
                    <h4 className="text-base md:text-xl font-bold text-white mb-0.5 group-hover:text-[#f97316] transition-colors">
                      {evt.name}
                    </h4>
                    <p className="text-gray-400 text-xs md:text-base leading-snug max-w-md line-clamp-2">
                      {evt.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#f9fafb] rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-4 right-4 z-50 w-8 h-8 bg-white/80 backdrop-blur-sm shadow-md hover:bg-[#f97316] text-[#0b1b24] hover:text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
              
              <div className="p-5 md:p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                <div>
                  <h3 className="text-xl font-black text-[#26c0ff] uppercase tracking-tighter mb-1">Register Now</h3>
                  <p className="text-gray-500 text-xs font-medium">Secure your spot for the event. Limited availability.</p>
                </div>
                
                <form className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#0b1b24]/50 text-[9px] font-bold uppercase tracking-widest">Full Name</label>
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-lg p-2 md:p-2.5 text-sm text-[#0b1b24] placeholder-gray-400 focus:outline-none focus:border-[#f97316]/50 focus:ring-2 focus:ring-[#f97316]/20 transition-all shadow-sm" placeholder="John Doe" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#0b1b24]/50 text-[9px] font-bold uppercase tracking-widest">Email Address</label>
                    <input type="email" className="w-full bg-white border border-gray-200 rounded-lg p-2 md:p-2.5 text-sm text-[#0b1b24] placeholder-gray-400 focus:outline-none focus:border-[#f97316]/50 focus:ring-2 focus:ring-[#f97316]/20 transition-all shadow-sm" placeholder="john@example.com" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#0b1b24]/50 text-[9px] font-bold uppercase tracking-widest">Phone Number</label>
                    <input type="tel" className="w-full bg-white border border-gray-200 rounded-lg p-2 md:p-2.5 text-sm text-[#0b1b24] placeholder-gray-400 focus:outline-none focus:border-[#f97316]/50 focus:ring-2 focus:ring-[#f97316]/20 transition-all shadow-sm" placeholder="+1 (555) 000-0000" />
                  </div>

                  <button type="button" className="mt-4 w-full bg-[#26c0ff] hover:bg-[#0a192f] text-white font-black uppercase tracking-widest py-3 md:py-3.5 text-sm rounded-lg transition-all shadow shadow-[#26c0ff]/30 flex items-center justify-center gap-2">
                    Confirm Registration <Send size={14} className="text-[#f97316]" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Events;
