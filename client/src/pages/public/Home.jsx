import React from 'react';
import Hero from '../../components/public/home/Hero';
import About from '../../components/public/home/About';
import OurTrainers from '../../components/public/home/OurTrainers';
import Programs from '../../components/public/home/Programs';
import Events from '../../components/public/home/Events';
import Services from '../../components/public/home/Services';
import Gallery from '../../components/public/home/Gallery';
import Partners from '../../components/public/home/Partners';
import Testimonials from '../../components/public/home/Testimonials';
import AboutFAQ from '../../components/public/about/AboutFAQ';
import News from '../../components/public/home/News';
const Home = () => {
  return (
    <div className="w-full flex flex-col bg-bgColor">
      <Hero />
      <About />
      <OurTrainers />
      <Programs />
      <Events />
      {/* <Services /> */}
      <Gallery />
      <Partners />
      <News/>
      <Testimonials />
      <AboutFAQ limit={5} isHome={true} />
    </div>
  );
};

export default Home;
