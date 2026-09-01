import React, { useEffect } from 'react';
import AboutFAQ from '../../components/public/about/AboutFAQ';

const FAQPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#f9fafb] pt-24 pb-12 md:pt-24 md:pb-16 lg:pt-24 lg:pb-24 px-4 md:px-0 font-sans selection:bg-[#f97316] selection:text-white relative overflow-hidden">
      {/* MASSIVE BACKGROUND TEXT */}
      <div className="fixed top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[16vw] font-black text-black/[0.05] uppercase tracking-tighter pointer-events-none whitespace-nowrap select-none z-0">
        FAQ
      </div>

      {/* FAQ CONTENT */}
      <div className="global-container max-w-7xl mx-auto px-4 sm:px-6 lg:!px-22 relative z-10">
        <AboutFAQ limit={10} paginate={true} />
      </div>
    </div>
  );
};

export default FAQPage;
