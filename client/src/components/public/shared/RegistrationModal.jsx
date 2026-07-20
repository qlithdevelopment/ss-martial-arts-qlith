import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const RegistrationModal = ({ isOpen, onClose, details, type }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 overflow-y-auto pt-20 pb-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-[100] max-h-[90vh]"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full z-[100] transition-colors"
          >
            ✕
          </button>

          {/* Left Side: Details */}
          <div className="w-full md:w-1/2 bg-gray-50 p-8 overflow-y-auto border-r border-gray-100">
            <span className="text-[#f97316] font-bold text-xs tracking-widest uppercase mb-2 block">
              {type === 'program' ? 'Program Details' : 'Course Details'}
            </span>
            <h2 className="text-3xl font-black text-[#26c0ff] uppercase leading-tight mb-4">
              {details?.title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {details?.description || `Master the discipline and power of ${details?.title} with our expert instructors. This comprehensive program is designed to transform your skills.`}
            </p>

            <div className="mb-6">
              <h4 className="font-bold text-[#26c0ff] mb-3 uppercase tracking-wide text-sm border-b pb-2">Benefits</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-[#26c0ff]">✓</span> Expert instruction
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-[#26c0ff]">✓</span> Flexible scheduling
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-[#26c0ff]">✓</span> Proven training methodologies
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#26c0ff] mb-3 uppercase tracking-wide text-sm border-b pb-2">Curriculum</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                The curriculum covers foundational techniques, advanced combinations, sparring strategies, and physical conditioning tailored to your skill level.
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center overflow-y-auto">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3 className="text-2xl font-black text-[#26c0ff] mb-2 uppercase">Registration Successful!</h3>
                <p className="text-gray-600">We'll be in touch with you shortly.</p>
              </motion.div>
            ) : (
              <>
                <h3 className="text-2xl font-black text-[#26c0ff] uppercase mb-1">Register Now</h3>
                <p className="text-gray-500 text-xs mb-6">Fill out the form below to secure your spot.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#26c0ff] focus:ring-1 focus:ring-[#26c0ff] transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#26c0ff] focus:ring-1 focus:ring-[#26c0ff] transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Phone</label>
                      <input 
                        type="tel" 
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#26c0ff] focus:ring-1 focus:ring-[#26c0ff] transition-all"
                        placeholder="(555) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Message (Optional)</label>
                    <textarea 
                      name="message"
                      rows="3"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#26c0ff] focus:ring-1 focus:ring-[#26c0ff] transition-all resize-none"
                      placeholder="Any previous experience or questions?"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#26c0ff] hover:bg-[#f97316] text-white font-bold uppercase tracking-widest py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mt-2"
                  >
                    Submit Registration
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    </>
  );
};

export default RegistrationModal;
