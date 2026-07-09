import React, { useEffect } from 'react';
import AboutFAQ from '../../components/public/about/AboutFAQ';

const FAQPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#081218] pt-20">
      {/* MASSIVE BACKGROUND TEXT */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.02] uppercase tracking-tighter whitespace-nowrap select-none">
          FAQ
        </div>
      </div>
      <div className="relative z-10">
        <AboutFAQ limit={10} paginate={true} />
      </div>
    </div>
  );
};

export default FAQPage;
