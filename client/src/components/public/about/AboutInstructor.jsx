import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode } from 'lucide-react';
import { instructorData } from '../../../data/aboutData';

const AboutInstructor = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);
  return (
    <section className="w-full bg-black flex items-center justify-center px-4 md:px-8 py-12 lg:py-24">
      
      {/* MASTER CONTAINER - Natural height */}
      <div className="global-container lg:!px-14 h-auto bg-gray-900 rounded-[30px] p-4 sm:p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row gap-8 lg:gap-12 border border-gray-800">
        
        {/* LEFT COLUMN: Photo & Contact Box (Sticky) */}
        <div className="w-full lg:w-[35%] flex flex-col gap-4 lg:gap-6 shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-140px)]">
          
          {/* Photo Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative w-full h-[350px] sm:h-[450px] lg:flex-1  bg-[#26c0ff] rounded-tl-[60px] rounded-br-[60px] rounded-tr-[20px] rounded-bl-[20px] overflow-hidden"
          >
            <img 
              src={instructorData.photo} 
              alt={instructorData.name} 
              className="w-full h-full object-cover object-top transition-all duration-500"
            />
          </motion.div>

          {/* Let's Work Together Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, delay: 0.2 }}
            className="bg-[#26c0ff] rounded-[20px] p-5 flex justify-center items-center gap-4 shrink-0 shadow-lg"
          >
            
            <div>
              <h4 className="text-[#0b1b24] font-black text-base mb-1">Let's Work Together :</h4>
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#0b1b24] flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border border-[#0b1b24] flex items-center justify-center text-[10px]">@</span>
                  ssmartialartsschool@gmail.com
                </p>
                <p className="text-xs font-bold text-[#0b1b24] flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border border-[#0b1b24] flex items-center justify-center text-[10px]">#</span>
                  +91 9090224658
                </p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Info & Grids */}
        <div className="w-full lg:w-[65%] lg:flex-1 min-h-0 pb-4">
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="pt-2"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-4xl text-gray-500 font-serif leading-none">"</span>
              <h2 className="text-4xl md:text-6xl font-black text-[#26c0ff] tracking-tight uppercase">HELLO.</h2>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide">{instructorData.name}</h3>
              <p className="text-gray-300 font-black tracking-widest text-sm mb-4">{instructorData.subtitle}</p>
              <div className="flex flex-wrap gap-2">
                {instructorData.badges.map((badge, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#26c0ff] text-[#0b1b24] text-[10px] font-bold rounded-md uppercase tracking-wider shadow-sm">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* GRIDS: Details & Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b-2 border-gray-800 pb-8">
            
            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, delay: 0.1 }}
            >
              <h3 className="text-lg font-black text-[#26c0ff] mb-4 border-b-2 border-[#26c0ff] inline-block pb-1">Details</h3>
              <div className="space-y-4">
                {instructorData.details.map((item, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5">{item.label}</span>
                    <span className="text-sm font-bold whitespace-pre-line text-gray-200">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, delay: 0.2 }}
            >
              <h3 className="text-lg font-black text-[#26c0ff] mb-4 border-b-2 border-[#26c0ff] inline-block pb-1">Key Achievements</h3>
              <div className="flex flex-col gap-3">
                {instructorData.achievements.map((achievement, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#26c0ff] mt-1.5 shrink-0 shadow-[0_0_5px_#26c0ff]" />
                    <p className="text-sm text-gray-300 font-bold leading-relaxed">{achievement}</p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* EXPERIENCE */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, delay: 0.3 }}
          >
            <h3 className="text-lg font-black text-[#26c0ff] mb-4 border-b-2 border-[#26c0ff] inline-block pb-1">Working Experience</h3>
            <p className="text-sm font-bold text-gray-300 leading-relaxed bg-white/5 p-6 rounded-xl border border-gray-800 shadow-inner">
              {instructorData.experience}
            </p>
          </motion.div>

        </div>

      </div>
      
      {/* Custom CSS for hiding the scrollbar specifically inside the container if needed, though custom-scrollbar class usually handles it */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111827;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #26c0ff;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #38b6ff;
        }
      `}} />

    </section>
  );
};

export default AboutInstructor;
