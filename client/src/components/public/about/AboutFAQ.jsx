import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../api/axios';

const FAQItem = ({ faq, isOpen, onClick }) => {
  return (
    <div className="bg-[#15232d] rounded-xl overflow-hidden border border-gray-800 transition-colors hover:border-gray-700">
      <button 
        onClick={onClick}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="text-sm md:text-base font-bold text-white pr-4">{faq.question}</span>
        <div className={`shrink-0 w-6 h-6 rounded-full bg-[#2a3a46] flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-5 text-gray-400 text-sm font-medium leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AboutFAQ = ({ limit }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get('/faqs');
        const data = res.data?.data || res.data || [];
        const publishedFaqs = data.filter(faq => faq.isPublish === 1 || faq.isPublish === true || faq.isPublish === "1");
        setFaqs(publishedFaqs);
      } catch (error) {
        console.error("Failed to load FAQs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const displayedFaqs = limit ? faqs.slice(0, limit) : faqs;

  return (
    <section className="w-full bg-[#081218] py-12 md:py-16 lg:py-24 px-4 md:px-8">
      <div className="global-container lg:!px-[90px]">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* LEFT: Title & Info */}
          <div className="w-full lg:w-[40%] flex flex-col items-start pt-4 lg:sticky lg:top-28 h-fit">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#15232d] px-3 py-1 rounded-md mb-6"
            >
              <span className="text-[11px] font-black tracking-widest text-gray-300 uppercase">FAQs</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight"
            >
              Frequently asked <br />
              <span className="text-[#ffffff]">questions</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, delay: 0.2 }}
              className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-[350px]"
            >
              Make smarter decisions and train effectively with all the answers you need before stepping onto the mat.
            </motion.p>
          </div>

          {/* RIGHT: Accordion */}
          <div className="w-full lg:w-[60%] flex flex-col gap-3">
            {loading ? (
              <div className="text-gray-400 text-sm animate-pulse">Loading FAQs...</div>
            ) : displayedFaqs.length === 0 ? (
              <div className="text-gray-500 text-sm">No FAQs available at the moment.</div>
            ) : (
              displayedFaqs.map((faq, idx) => (
                <motion.div
                  key={faq.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <FAQItem 
                    faq={faq} 
                    isOpen={openIndex === idx} 
                    onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                  />
                </motion.div>
              ))
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutFAQ;
