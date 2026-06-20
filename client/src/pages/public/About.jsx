import React, { useEffect } from 'react';
import AboutIntro from '../../components/public/about/AboutIntro';
import AboutInstructor from '../../components/public/about/AboutInstructor';
import AboutFeatures from '../../components/public/about/AboutFeatures';
import AboutHistory from '../../components/public/about/AboutHistory';
import AboutFAQ from '../../components/public/about/AboutFAQ';

const AboutPage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] flex flex-col">
      <AboutIntro />
      <AboutInstructor />
      <AboutFeatures />
      <AboutHistory />
      <AboutFAQ limit={5} />
    </div>
  );
};

export default AboutPage;