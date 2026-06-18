import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { allServices } from '../../data/homeData';

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = allServices.find(s => s.slug === slug);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Registration submitted successfully!');
    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsModalOpen(false);
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center pt-20">
        <h1 className="text-4xl text-[#0b1b24] font-black uppercase">Service Not Found</h1>
        <Link to="/#services" className="mt-6 text-[#26c0ff] hover:text-[#0b1b24] font-bold transition-colors">Return to Services</Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] text-[#0b1b24] font-sans">
      
      {/* HERO SECTION */}
      <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src={service.image} 
          alt={service.title} 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-16 md:pb-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#f97316] text-white text-[10px] md:text-xs font-bold px-3 py-1 uppercase tracking-widest rounded shadow-md">
                  {service.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tighter mb-4 drop-shadow-lg uppercase">
                {service.title}
              </h1>
              <p className="text-lg md:text-xl text-[#26c0ff] font-bold uppercase tracking-[0.2em] max-w-2xl drop-shadow-md">
                {service.subtitle}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="w-full py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* Left Content */}
            <div className="w-full lg:w-2/3">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-3xl font-black text-[#0b1b24] mb-6 tracking-tight uppercase">Program Overview</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Master the discipline and power of {service.title} with our expert instructors. This comprehensive program is designed to transform your skills, offering a deep dive into the foundational aspects, advanced techniques, and sparring strategies required to achieve mastery. Whether you are a beginner or looking to refine your skills, this service is tailored to help you reach your peak potential.
                </p>

                <div className="h-px bg-gray-200 w-full mb-10"></div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <h3 className="text-xl font-bold text-[#26c0ff] mb-4 uppercase tracking-wider">Benefits</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-[#f97316] shrink-0"></div>
                        <span className="text-gray-600 font-medium">Expert instruction from certified masters</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-[#f97316] shrink-0"></div>
                        <span className="text-gray-600 font-medium">Flexible scheduling options</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-[#f97316] shrink-0"></div>
                        <span className="text-gray-600 font-medium">Proven training methodologies</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-[#f97316] shrink-0"></div>
                        <span className="text-gray-600 font-medium">State-of-the-art training facilities</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#26c0ff] mb-4 uppercase tracking-wider">Curriculum</h3>
                    <p className="text-gray-600 leading-relaxed mb-4 font-medium">
                      The curriculum covers foundational techniques, advanced combinations, sparring strategies, and physical conditioning tailored to your skill level.
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-[#26c0ff] shrink-0"></div>
                        <span className="text-gray-600 font-medium">Beginner to Advanced Levels</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-[#26c0ff] shrink-0"></div>
                        <span className="text-gray-600 font-medium">Professional Coaching</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-[#26c0ff] shrink-0"></div>
                        <span className="text-gray-600 font-medium">Comprehensive Curriculum</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Sidebar - Quick Info */}
            <div className="w-full lg:w-1/3">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
              >
                <h3 className="text-xl font-black text-[#0b1b24] mb-6 uppercase tracking-tight">Quick Info</h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Skill Level</p>
                    <p className="font-semibold text-gray-800">All Levels Welcome</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Duration</p>
                    <p className="font-semibold text-gray-800">60 - 90 Minutes / Session</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Equipment</p>
                    <p className="font-semibold text-gray-800">Provided / Bring your own</p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="block w-full text-center bg-[#0b1b24] hover:bg-[#26c0ff] text-white py-4 font-bold uppercase tracking-widest text-xs rounded-xl transition-colors duration-300 shadow-lg"
                  >
                    Join Program
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* REGISTER NOW MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 pt-20 pb-10">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-8 overflow-y-auto max-h-[90vh] z-10"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full z-50 transition-colors"
              >
                ✕
              </button>

              {/* Decorative Top Line */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#26c0ff] via-[#f97316] to-[#26c0ff]"></div>

              <div className="text-center mb-6 mt-2">
                <h2 className="text-3xl md:text-4xl font-black text-[#26c0ff] uppercase tracking-tighter mb-3">
                  Register Now
                </h2>
                <p className="text-gray-500 font-medium">
                  Fill out the form below to secure your spot for the {service.title} program.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#26c0ff] focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#26c0ff] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone</label>
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="(555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#26c0ff] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Message (Optional)</label>
                  <textarea 
                    name="message"
                    rows="2"
                    placeholder="Any previous experience or questions?"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#26c0ff] focus:border-transparent transition-all resize-none"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="w-full bg-[#26c0ff] hover:bg-[#0b1b24] text-white font-black text-sm uppercase tracking-widest py-4 rounded-xl transition-colors shadow-lg hover:shadow-none"
                  >
                    Submit Registration
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ServiceDetail;
