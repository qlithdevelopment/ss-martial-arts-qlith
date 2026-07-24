import React, { useState } from 'react';
import RegistrationModal from '../shared/RegistrationModal';
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { Check,ArrowRight } from 'lucide-react';
import { programsData } from '../../../data/homeData';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 15 }
  }
};

const Programs = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const showprogram = programsData.slice(0, 3)

  return (
    <section id="programs" className="w-full min-h-screen bg-[#f8f9fa] flex flex-col justify-center items-center pt-16 pb-12 md:pt-24 md:pb-16 lg:pt-32 lg:pb-24">

      <div className="global-container !px-0  w-full z-10 flex flex-col items-center">

        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full text-center mb-10 md:mb-16 px-4"
        >

          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-1 w-12 bg-[#f97316]"></div>
              <h3 className="text-[#f97316] font-bold tracking-[0.2em] uppercase text-sm">What We Offer</h3>
              <div className="h-1 w-12 bg-[#f97316]"></div>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter text-[#0b1b24] text-center">
              our <span className='text-primary'> programs</span>

            </h2>
          </div>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Whether you're looking for flexible access, personalized coaching, or energetic group sessions, we have the perfect training environment for you.
          </p>
        </motion.div>

        {/* 4 COLUMN CARD GRID (3 programs + Show More) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="global-container lg:!px-22 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4  gap-8 md:gap-10"
        >

          {showprogram.map((program) => (
            <motion.div
              variants={cardVariants}
              key={program.id}
              onClick={() => setSelectedProgram(program)}
              className="group flex flex-col w-full bg-white rounded-[32px] overflow-hidden shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_60px_-15px_rgba(38,192,255,0.2)] transition-all duration-500 hover:-translate-y-2 border border-gray-100 cursor-pointer"
            >

              {/* TOP IMAGE HALF */}
              <div className="w-full h-[240px] bg-gray-100 overflow-hidden flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 right-4 z-20">
                  <span className="bg-white/90 backdrop-blur-sm text-[#0b1b24] px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                    {program.tag}
                  </span>
                </div>
              </div>

              {/* BOTTOM DETAILS HALF */}
              <div className="w-full bg-white p-8 justify-end flex flex-col relative flex-1">
                <div className='h-full flex flex-col justify-start'>

                  <h3 className="text-2xl font-black text-[#1a1a1a] uppercase tracking-tight mb-6 group-hover:text-[#26c0ff] transition-colors duration-300">
                    {program.title}
                  </h3>

                  <div className="flex flex-col gap-4">
                    {program.bullets.map((bullet, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 w-4 h-4 rounded-full bg-[#26c0ff]/10 flex items-center justify-center flex-shrink-0">
                          <Check size={10} strokeWidth={3} className="text-[#0b1b24]" />
                        </div>
                        <span className="text-gray-600 text-[13px] md:text-sm font-medium leading-tight">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA — always visible on this page, not just hover */}
                {/* <div className="mt-4 pt-2 border-t border-gray-100 flex items-center max-h-10 justify-between">
                  <span className="text-[#0b1b24] font-bold text-sm tracking-wide">
                    Explore Program
                  </span>
                  <div className="w-9 h-9 rounded-full bg-[#f97316]/10 flex items-center justify-center group-hover:bg-[#f97316] transition-colors duration-300">
                    <ArrowRight size={16} className="text-[#f97316] group-hover:text-white transition-colors duration-300" />
                  </div>
                </div> */}

              </div>              

            </motion.div>
          ))}

          {/* SHOW MORE CARD — 4th column */}
          <motion.div className='h-full lg:w-auto md:w-screen justify-center flex items-center' variants={cardVariants}>
            <Link
              to="/allprograms"
              className=" group flex flex-col items-center justify-center w-full bg-transparent rounded-[32px] overflow-hidden   transition-all duration-500 hover:-translate-y-2  cursor-pointer p-0 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-6 group-hover:bg-[#f97316] transition-colors duration-300">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:text-white transition-colors duration-300"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </div>
              <h3 className="text-2xl font-black text-primary2 uppercase tracking-tight mb-3 group-hover:text-[#26c0ff] transition-colors duration-300">
                Show More
              </h3>
              <p className="text-gray-400 text-[13px] md:text-sm font-medium leading-relaxed">
                Explore our full range of programs and find the perfect fit for you.
              </p>
            </Link>
          </motion.div>

        </motion.div>


      </div>

      <RegistrationModal
        isOpen={!!selectedProgram}
        onClose={() => setSelectedProgram(null)}
        details={selectedProgram}
        type="program"
      />
    </section>
  );
};

export default Programs;

