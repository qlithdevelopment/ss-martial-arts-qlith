import React, { useEffect } from 'react';
import AboutFAQ from '../../components/public/about/AboutFAQ';

const FAQPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#081218] pt-20">
      <AboutFAQ />
    </div>
  );
};

export default FAQPage;
