import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { allServices } from '../../data/homeData';
import RegistrationModal from '../../components/public/shared/RegistrationModal';
import silhouetteImg from '../../assets/samurai_shadow.png';

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#f8f9fa] pt-24 pb-12 md:pt-28 md:pb-16 lg:pt-32 lg:pb-24 px-4 md:px-8 font-sans overflow-hidden">
      
      {/* Background Silhouette */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src={silhouetteImg} 
          alt="Samurai Shadow" 
          className="absolute -right-[10%] md:right-[5%] -bottom-[10vh] md:-bottom-[15vh] w-auto h-[70vh] md:h-[110vh] object-contain object-bottom opacity-[0.25] scale-125 md:scale-100" 
        />
      </div>

      {/* MASSIVE BACKGROUND TEXT */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-black/[0.03] uppercase tracking-tighter pointer-events-none z-0 whitespace-nowrap select-none">
        SERVICES
      </div>

      <div className="relative z-10">
      
      {/* Header */}
      <div className="global-container mb-16 text-center flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-1 w-12 bg-[var(--color-primary2)]"></div>
              <h3 className="text-[var(--color-primary2)] font-bold tracking-[0.2em] uppercase text-sm">What We Offer</h3>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter text-black">
              OUR  <span className="text-[var(--color-primary)]">SERVICES</span>
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
            Explore our comprehensive range of martial arts and fitness programs. Designed for all ages and skill levels to build discipline, strength, and confidence.
          </p>
        </motion.div>
      </div>

      {/* Services List (Vertical Layout) */}
      <div className="global-container flex flex-col gap-12 md:gap-16 lg:gap-24 mb-16 lg:mb-24">
        {allServices.map((service, index) => (
          <motion.div 
            key={service.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}
          >
            {/* Image Side */}
            <div className="w-full md:w-1/2 relative group">
              <div className="absolute inset-0 bg-[var(--color-primary)] translate-x-4 translate-y-4 rounded-3xl opacity-20 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500"></div>
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 bg-[var(--color-primary2)] text-white text-xs font-black px-4 py-2 uppercase tracking-widest rounded shadow-lg">
                  {service.badge}
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--color-primary)] uppercase tracking-tight mb-3">
                {service.title}
              </h2>
              <p className="text-[var(--color-primary2)] text-sm md:text-base font-bold uppercase tracking-[0.2em] mb-6">
                {service.subtitle}
              </p>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 font-medium">
                Master the discipline and power of {service.title} with our expert instructors. 
                Our curriculum covers all fundamental aspects, advanced techniques, and sparring sessions 
                to ensure a complete mastery of the art. Whether you are a beginner or looking to refine 
                your skills, this service is tailored to help you reach your peak potential.
              </p>
              
              <ul className="space-y-3 mb-10 text-gray-700 font-semibold">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span> Beginner to Advanced Levels
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span> Professional Coaching
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span> Comprehensive Curriculum
                </li>
              </ul>

              <Link 
                to={`/services/${service.slug}`} 
                className="w-fit bg-[var(--color-primary)] hover:bg-[#0b1b24] text-white px-10 py-4 text-sm font-black uppercase tracking-[0.2em] transition-colors duration-300 rounded-xl shadow-xl hover:shadow-none inline-block text-center"
              >
                Explore Services
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <RegistrationModal 
        isOpen={!!selectedService} 
        onClose={() => setSelectedService(null)} 
        details={selectedService} 
        type="service" 
      />

      </div>
    </div>
  );
};

export default ServicesPage;
