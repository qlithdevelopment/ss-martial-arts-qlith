import React from 'react';
import { motion } from 'framer-motion';
import { featuresCenterImage, featuresLeft, featuresRight } from '../../../data/aboutData';

const FeatureItem = ({ item, isLeft }) => (
  <motion.div 
    initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className={`flex flex-col ${isLeft ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} mb-10`}
  >
    <div className={`flex items-center gap-3 mb-2 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
      <span className="text-xl md:text-2xl font-black text-[#0b1b24]">{item.number}.</span>
      <h4 className="text-sm md:text-base font-bold text-[var(--color-primary)] uppercase tracking-wide">{item.title}</h4>
    </div>
    <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed max-w-[280px]">
      {item.desc}
    </p>
  </motion.div>
);

const AboutFeatures = () => {
  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-24 px-4 md:px-8 overflow-hidden">
      <div className="global-container">
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-16 lg:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-medium text-gray-600"
          >
            Our <span className="font-black text-[#0b1b24]">Features</span>
          </motion.h2>
          <div className="w-16 h-1 bg-[var(--color-primary)] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* FEATURES GRID */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-0">
          
          {/* LEFT FEATURES */}
          <div className="w-full md:w-[30%] flex flex-col items-start md:items-end order-2 md:order-1 pt-8 md:pt-0">
            {featuresLeft.map((item, idx) => (
              <FeatureItem key={idx} item={item} isLeft={true} />
            ))}
          </div>

          {/* CENTER IMAGE */}
          <div className="w-full md:w-[40%] flex justify-center order-1 md:order-2 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[360px] lg:h-[360px] flex items-center justify-center mx-auto"
            >
              {/* Golden Circle Background */}
              <div className="absolute inset-4 sm:inset-6 lg:inset-8 bg-gradient-to-tr from-yellow-500 via-[#ffd700] to-amber-300 rounded-full shadow-[0_0_40px_rgba(255,215,0,0.4)]"></div>

              {/* Floating Transparent Image Container */}
              <div className="w-full h-full flex items-center justify-center relative z-10">
                <img 
                  src={featuresCenterImage} 
                  alt="Martial Arts Action" 
                  className="w-[130%] h-[130%] object-contain object-center mix-blend-multiply drop-shadow-2xl contrast-125 transition-transform duration-700 hover:scale-110 pointer-events-none"
                />
              </div>
            </motion.div>
          </div>

          {/* RIGHT FEATURES */}
          <div className="w-full md:w-[30%] flex flex-col items-start order-3 pt-8 md:pt-0">
            {featuresRight.map((item, idx) => (
              <FeatureItem key={idx} item={item} isLeft={false} />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutFeatures;
