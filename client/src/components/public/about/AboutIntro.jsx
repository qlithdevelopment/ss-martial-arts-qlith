import React from 'react';
import { motion } from 'framer-motion';
import { aboutIntroData } from '../../../data/aboutData';
import { Target, Compass } from 'lucide-react';
import SectionHeader from "../../SectionHeader"

const AboutIntro = () => {
  return (
    <section className="relative w-full min-h-[100svh] flex items-center bg-[#fafafa] pt-16 pb-12 md:pt-20 md:pb-16 lg:pt-32 lg:pb-24 px-4 md:px-8 overflow-hidden">
     

      <div className="global-container lg:!px-14 relative z-10 flex flex-col xl:flex-row gap-16 xl:gap-24">

        <div className="w-full xl:w-[55%] flex flex-col justify-center">
          <SectionHeader
            bgText="ABOUT"            
            label="Welcome to SS Martial Arts"
            title="OUR"
            highlight="LEGACY"
            titleColor="text-black"            
          />
          

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6 text-gray-600 text-base leading-relaxed font-medium"
          >
            {aboutIntroData.paragraphs.map((paragraph, idx) => (
              <p key={idx} className={idx === 0 ? "text-lg text-[#0b1b24] font-semibold border-l-4 border-[#26c0ff] pl-6 py-1" : ""}>
                {paragraph}
              </p>
            ))}
          </motion.div>
        </div>

        {/* RIGHT: Mission & Vision */}
        <div className="w-full xl:w-[45%] flex flex-col justify-center lg:px-2 border-t xl:border-t-0 xl:border-l-[2px] border-gray-200 pt-10 xl:pt-0 xl:pl-12 gap-12">

          {/* MISSION */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col justify-start"
          >
            <div className="relative">
              <h3 className="relative text-2xl font-black text-[#0b1b24] z-10 tracking-[0.2em] uppercase inline-block font-serif mb-6">
                <span className="absolute left-[-10px] top-[50%] -translate-y-[50%] w-8 h-8 rounded-full bg-[#f97316] z-[-1] opacity-90 mix-blend-multiply"></span>
                MISSION
              </h3>
              <p className="text-gray-600 text-[15px] leading-relaxed font-medium">
                {aboutIntroData.mission}
              </p>
            </div>
          </motion.div>

          {/* VISION */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-col justify-start"
          >
            <div className="relative">
              <h3 className="relative text-2xl font-black text-[#0b1b24] z-10 tracking-[0.2em] uppercase inline-block font-serif mb-6">
                <span className="absolute left-[-10px] top-[50%] -translate-y-[50%] w-8 h-8 rounded-full bg-[#26c0ff] z-[-1] opacity-90 mix-blend-multiply"></span>
                VISION
              </h3>
              <p className="text-gray-600 leading-relaxed text-[15px] font-medium pr-4">
                {aboutIntroData.vision}
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </section >
  );
};

export default AboutIntro;
