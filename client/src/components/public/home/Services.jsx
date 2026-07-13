import React, { useState, useRef, useEffect } from "react";
import RegistrationModal from "../shared/RegistrationModal";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { servicesCategories as categories, allServices } from "../../../data/homeData";

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const scrollRef = useRef(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Track window size to adapt mobile layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredServices = activeCategory === "ALL" 
    ? allServices 
    : allServices.filter(s => s.category === activeCategory);

  // Limit to 3 items on mobile
  const displayServices = isMobile ? filteredServices.slice(0, 3) : filteredServices;

  return (
    <section id="services" className="relative w-full min-h-screen overflow-hidden flex flex-col md:flex-row bg-[#f8f9fa]">
      
      {/* MASSIVE BACKGROUND TEXT */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-black/[0.03] uppercase tracking-tighter pointer-events-none z-0 whitespace-nowrap select-none">
        SERVICES
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* LEFT SIDE: Cyan Menu Column - Made thinner */}
      <div className="w-full md:w-[30%] lg:w-[25%] bg-primary h-auto md:min-h-screen flex flex-col justify-center px-6 md:px-8 lg:px-10 py-12 md:py-0 relative shrink-0 z-20 shadow-2xl">
        
        <div className="relative z-10 w-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-1 w-12 bg-[#f97316]"></div>
            <h3 className="text-[#f97316] font-bold tracking-[0.2em] uppercase text-sm">Choose Your Path</h3>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter mb-10 text-black">
            OUR  <span className="text-black">SERVICES</span>
          </h2>

          <div className="flex flex-row md:flex-col gap-3 md:gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 hide-scrollbar w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  if (scrollRef.current && !isMobile) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                  }
                }}
                className={`text-left text-xs md:text-sm font-bold uppercase tracking-widest px-4 md:px-5 py-3 md:py-4 transition-all duration-300 whitespace-nowrap md:whitespace-normal break-words border-l-4 rounded-r-lg w-full ${
                  activeCategory === cat
                    ? "bg-black/10 text-black border-black shadow-[inset_4px_0_0_#000]"
                    : "bg-transparent text-black/60 border-transparent hover:text-black hover:bg-black/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Services Container */}
      <div 
        ref={scrollRef}
        className="flex-1 h-auto min-h-screen relative z-10 flex flex-col pb-12 md:pb-0"
      >
        {/* Scrollable Area - Vertical on Mobile, Grid on Desktop */}
        <div className="flex-1 w-full flex flex-col md:grid md:grid-cols-2 xl:grid-cols-3 content-start items-start gap-8 md:gap-x-6 md:gap-y-8 px-6 md:px-12 py-12 md:py-16 hide-scrollbar scroll-smooth">
          
          <AnimatePresence mode="popLayout">
            {displayServices.map((service, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={service.id}
                className="w-full max-w-[340px] mx-auto md:mx-0 md:max-w-none md:w-full h-[280px] md:h-[300px] flex flex-col bg-white shrink-0 shadow-lg border border-gray-100 group relative rounded-2xl overflow-hidden"
              >
                {/* TOP: Image Section */}
                <div className="w-full h-[160px] md:h-[180px] relative overflow-hidden bg-gray-100 shrink-0">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Brand Badge */}
                  <div className="absolute top-3 left-3 bg-primary2 text-white text-[9px] font-black px-3 py-1.5 uppercase tracking-widest rounded shadow-md">
                    {service.badge}
                  </div>
                </div>

                {/* BOTTOM: Content Section */}
                <div className="flex flex-col p-4 md:p-5 bg-white flex-1">
                  
                  {/* Title */}
                  <h3 className="text-sm md:text-base font-black text-[#26c0ff] uppercase tracking-tight mb-1 leading-tight line-clamp-2">
                    {service.title}
                  </h3>
                  
                  {/* Subtitle */}
                  <p className="text-primary2 text-[9px] font-bold uppercase tracking-[0.1em] mb-2">
                    {service.subtitle}
                  </p>
                  
                  {/* Button */}
                  <button onClick={() => setSelectedService(service)} className="w-full mt-auto bg-[#26c0ff] text-white py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-[#0b1b24] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(38,192,255,0.3)] transition-all duration-300 rounded-lg">
                    Explore Services
                  </button>
                  
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Spacer removed as we are no longer using horizontal scrolling */}
        </div>
        
        {/* View More Button - Bottom Right Floating */}
        <div className="w-full flex justify-center md:block md:w-auto md:absolute md:bottom-10 md:right-10 z-30 pt-4 md:pt-0">
          <Link to="/services">
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="group relative flex items-center gap-3 bg-white px-6 py-2.5 rounded-full shadow-[0_10px_40px_rgba(38,192,255,0.25)] hover:shadow-[0_15px_50px_rgba(38,192,255,0.4)] transition-all duration-300 border border-gray-100 cursor-pointer"
            >
              {/* Subtle hover glow background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#26c0ff]/10 to-transparent opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300" />
              
              <span className="text-[#0b1b24] font-black text-[10px] md:text-xs tracking-[0.2em] uppercase relative z-10">
                View More
              </span>
              
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#26c0ff] flex items-center justify-center relative z-10 group-hover:bg-[#0b1b24] transition-colors duration-300">
                <svg 
                  className="text-white transform group-hover:translate-x-1 transition-transform duration-300 w-3 h-3 md:w-4 md:h-4" 
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
        
      <RegistrationModal 
        isOpen={!!selectedService} 
        onClose={() => setSelectedService(null)} 
        details={selectedService} 
        type="course" 
      />
    
    </section>
  );
};

export default Services;
