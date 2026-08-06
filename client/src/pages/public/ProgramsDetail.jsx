import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft, ChevronDown } from 'lucide-react';
import { programsData } from '../../data/homeData';
import RegistrationModal from '../../components/public/shared/RegistrationModal';

const ProgramDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const program = programsData.find((p) => p.id === Number(id));

  if (!program) {
    return (
      <section className="w-full min-h-screen bg-[#f8f9fa] pt-32 pb-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-black uppercase tracking-tight text-[#1a1a1a] mb-6">
          Program not found
        </h2>
        <button
          onClick={() => navigate('/programs')}
          className="inline-flex items-center gap-2 bg-[#0b1b24] text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wide hover:bg-[#f97316] transition-colors duration-300"
        >
          <ArrowLeft size={16} />
          Back to programs
        </button>
      </section>
    );
  }

  const { tag, title, shortDescription, description, bullets, image, faqs } = program;

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const hasBullets = bullets?.filter(Boolean).length > 0;
  const hasFaqs = faqs?.filter((f) => f?.question).length > 0;

  return (
    <section className="w-full min-h-screen bg-[#f8f9fa] pt-24 pb-16 md:pt-28">
      <div className="global-container lg:!px-22 w-full flex flex-col items-center">

        {/* Back link */}
        <div className="w-full mb-6 md:mb-8">
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 text-[#0b1b24] font-bold text-sm uppercase tracking-wide hover:text-[#f97316] transition-colors duration-300"
          >
            <ArrowLeft size={16} />
            Back to programs
          </Link>
        </div>

        {/* Image (original size, title overlaid) + shortDescription/bullets side by side */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          className="w-full bg-white rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] p-6 sm:p-8 md:p-0"
        >
          <div className="grid lg:grid-cols-2 gap-8 md:gap-5 items-start">

            {/* Image with title overlay, natural size */}
            <div className="relative inline-block w-full md:w-auto max-w-full mx-auto md:mx-0">
              <img
                src={image}
                alt={title}
                className="w-full md:w-full max-w-full h-auto rounded-2xl object-cover block"
              />
              {tag && (
                <div className="absolute top-4 right-4 z-20">
                  <span className="bg-white/90 backdrop-blur-sm text-[#0b1b24] px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                    {tag}
                  </span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-2 md:mb-3">
                  <div className="h-1 w-8 bg-[#f97316]"></div>
                  <h3 className="text-[#f97316] font-bold tracking-[0.2em] uppercase text-xs">
                    program
                  </h3>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase leading-none tracking-tighter text-white">
                  {title}
                </h1>
              </div>
            </div>

            {/* Right column: shortDescription + bullets */}
            {(shortDescription || hasBullets) && (
              <div className='p-6 sm:p-8 md:p-0 md:px-6 md:pr-4 md:py-10'>
                {hasBullets && (
                  <>
                    <span className="text-black text-sm md:text-[15px] uppercase font-bold leading-tight mb-4 md:mb-6 block">
                      What's included
                    </span>
                    <div className="flex flex-col gap-4 md:gap-5">
                      {bullets.filter(Boolean).map((bullet, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="mt-0.5 w-5 h-5 rounded-full bg-[#26c0ff]/10 flex items-center justify-center flex-shrink-0">
                            <Check size={11} strokeWidth={3} className="text-[#0b1b24]" />
                          </div>
                          <span className="text-gray-600 text-sm font-medium leading-tight">
                            {bullet}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {shortDescription && (
                  <>
                    <span className="text-black text-sm md:text-[15px] uppercase font-bold leading-tight my-5 mt-8 md:my-8 block">
                      
                    </span>
                    <p className="text-gray-600 text-sm md:text-base max-h-60 font-medium leading-relaxed mb-5 md:mb-6">
                      {shortDescription}
                    </p>
                  </>
                )}
                {description && (
                  <>
                    <span className="text-black text-sm md:text-[15px] uppercase font-bold leading-tight mb-2 md:mb-3 block">
                      
                    </span>
                    <p className="text-gray-500 text-sm md:text-[13px] overflow-y-auto scrollbar-track-transparent text-wrap max-h-52  font-medium leading-relaxed">
                      {description}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
  
        {/* FAQs */}
        {hasFaqs && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 80, damping: 15 }}
            className="w-full bg-white rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] p-6 sm:p-8 md:p-12 mt-4 md:mt-12"
          >
            <span className="text-black text-sm md:text-[15px] uppercase font-bold leading-tight mb-4 md:mb-6 block">
              FAQs
            </span>
            <div className="flex flex-col gap-3">
              {faqs.filter((f) => f?.question).map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className="border border-gray-100 rounded-2xl overflow-hidden bg-[#f8f9fa]"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(i)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-[#0b1b24] text-sm font-bold leading-tight">
                        {faq.question}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0 text-[#f97316]"
                      >
                        <ChevronDown size={16} strokeWidth={3} />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-4 text-gray-500 text-sm font-medium leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      <div className="h-full pt-12 md:pt-12">
        <RegistrationModal
          details={program}
          type="program"
        />
      </div>
    </section>
  );
};

export default ProgramDetail;