import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api/axios";
import Button from "../../ui/Button";
import { Link, useNavigate } from "react-router-dom";
import PaginationComponent from "../../PaginationComponent";
import silhouetteImg from "../../../assets/contact/samurai_shadow.png";

const FAQItem = ({ faq, isOpen, onClick }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#e2e8f0] transition-all duration-300 hover:border-[#cbd5e1] shadow-sm hover:shadow-md">
      <button
        onClick={onClick}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="text-sm md:text-base font-bold text-[#15232d] pr-4">
          {faq.question}
        </span>
        <div
          className={`shrink-0 w-7 h-7 rounded-full bg-[#15232d] flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
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
            <div className="px-6 pb-5 text-[#64748b] text-sm font-medium leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AboutFAQ = ({ limit = 10, paginate = false, isHome = false }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: limit,
    total: 0,
  });

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);

        const res = await api.get(isHome ? "/faqs/home" : "/faqs", {
          params: {
            page: currentPage,
            per_page: limit,
            isPublished: 1,
          },
        });

        setFaqs(res?.data?.data || []);

        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      } catch (error) {
        console.error("Failed to load FAQs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, [currentPage]);

  const displayedFaqs = limit ? faqs.slice(0, limit) : faqs;

  return (
    <section className="relative w-full bg-[#f8f9fa] py-12 md:py-16 lg:py-24 px-4 md:px-8 overflow-hidden">
      <img
        src={silhouetteImg}
        alt=""
        className="absolute inset-0 w-full h-full object-contain opacity-[0.09] pointer-events-none"
      />
      <div className="global-container lg:!px-14">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* LEFT: Title & Info */}
          <div className="w-full lg:w-[40%] flex flex-col items-start pt-4 lg:sticky lg:top-28 h-fit">
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-[#15232d] leading-[1.1] mb-6 tracking-tight"
              >
                Frequently Asked <br />
                <span className="text-primary">Questions</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, delay: 0.2 }}
                className="text-[#64748b] text-sm md:text-base font-medium leading-relaxed max-w-[350px]"
              >
                Make smarter decisions and train effectively with all the
                answers you need before stepping onto the mat.
              </motion.p>
              {limit < 10 && (
                <Button
                  variant="primary"
                  className="mt-6 hover:!bg-secondary hover:!text-white"
                  onClick={() => navigate("/faq")}
                >
                  View All FAQs
                </Button>
              )}
            </div>
          </div>

          {/* RIGHT: Accordion */}
          <div className="w-full lg:w-[60%] flex flex-col gap-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-[#e2e8f0] p-5 animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-3/4 bg-[#e2e8f0] rounded"></div>
                    <div className="w-6 h-6 rounded-full bg-[#e2e8f0]"></div>
                  </div>
                </div>
              ))
            ) : displayedFaqs.length === 0 ? (
              <div className="text-[#64748b] text-sm">
                No FAQs available at the moment.
              </div>
            ) : (
              displayedFaqs?.map((faq, idx) => (
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
        <div>
          {paginate && pagination.last_page > 1 && (
            <PaginationComponent
              pagination={pagination}
              theme="light"
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutFAQ;
