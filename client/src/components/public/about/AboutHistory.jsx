import React from 'react';
import { motion } from 'framer-motion';
import { historyData, achievementsData } from '../../../data/aboutData';

const AboutHistory = () => {
  return (
    <section className="w-full bg-[#f8f9fa] py-12 md:py-16 lg:py-24 px-4 md:px-8 border-t border-gray-200">
      <div className="global-container lg:!px-14">
        
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* LEFT: History Timeline */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-black text-[#26c0ff] uppercase tracking-tight mb-2">Our History</h2>
              <div className="w-12 h-1 bg-[#26c0ff] rounded-full"></div>
            </motion.div>

            <div className="relative border-l-2 border-[#26c0ff] ml-3 md:ml-4 space-y-8 pb-4">
              {historyData.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-8"
                >
                  <div className="absolute w-4 h-4 rounded-full bg-[#26c0ff] border-4 border-[#f8f9fa] left-[-9px] top-1"></div>
                  <h3 className="text-lg font-black text-[#26c0ff]">{item.year} - {item.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 font-medium leading-relaxed max-w-[400px]">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT: Achievements Grid */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-black text-[#26c0ff] uppercase tracking-tight mb-2">Achievements</h2>
              <div className="w-12 h-1 bg-[#26c0ff] rounded-full"></div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievementsData.map((achievement, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-3 hover:shadow-md transition-shadow"
                >
                  <div className="w-8 h-8 rounded-full bg-[#26c0ff]/20 flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-4 h-4 text-[#0b1b24]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-gray-800 leading-snug">{achievement}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Call to action decorative banner */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 bg-gradient-to-r from-[#26c0ff] to-[#1a3644] rounded-2xl p-6 text-white overflow-hidden relative"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <h4 className="text-xl font-black uppercase mb-1">Join the Legacy</h4>
              <p className="text-sm text-gray-300 font-medium">Be part of our next championship team.</p>
            </motion.div>
            
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutHistory;
