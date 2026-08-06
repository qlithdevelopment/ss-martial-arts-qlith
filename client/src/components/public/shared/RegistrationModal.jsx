import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../../api/axios';
import silhouetteImg from '../../../assets/contact/samurai_shadow.png';

const RegistrationSection = ({ details, type }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    programs: details?.title || '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMobileChange = (e) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, mobile_number: onlyNums }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.mobile_number) {
      return toast.error("Please fill in all required fields.");
    }

    try {
      setIsSubmitting(true);
      toast.loading("Submitting registration...", { id: "registration" });

      await api.post('/contacts', formData);

      toast.success("Registration successful! We will reach out soon.", { id: "registration" });
      setSubmitted(true);
      setFormData({
        first_name: '',
        last_name: '',
        mobile_number: '',
        programs: details?.title || '',
        message: ''
      });

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit registration.", { id: "registration" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='global-container lg:!px-22'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-white w-full max-w-full mx-auto rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side: Details */}
        <div className="w-full md:w-1/2 bg-gray-50 p-8 overflow-y-auto border-r border-gray-100">
          <img
            src={silhouetteImg}
            alt="Silhouette"
            className="absolute top-0 w-[100%] left-0 md:w-[50%] opacity-20 pointer-events-none"
          />

          <span className="text-[#f97316] font-bold text-xs tracking-widest uppercase mb-2 block">
            {type === 'program' ? 'Program Details' : 'Course Details'}
          </span>
          <h2 className="text-3xl font-black text-[#26c0ff] uppercase leading-tight mb-4">
            {details?.title}
          </h2>
          <p className="text-gray-600 text-sm font-semibold leading-relaxed mb-6">
            {details?.shortDescription || `Master the discipline and power of ${details?.title} with our expert instructors. This comprehensive program is designed to transform your skills.`}
          </p>

          <div className="mb-6">
            <h4 className="font-bold text-primary2 mb-3 uppercase tracking-wide text-sm border-b pb-2">Benefits</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 font-semibold text-sm text-gray-700">
                <span className="text-[#26c0ff] ">✓</span > Expert instruction
              </li>
              <li className="flex items-center gap-2 font-semibold text-sm text-gray-700">
                <span className="text-[#26c0ff]  ">✓</span> Flexible scheduling
              </li>
              <li className="flex items-center gap-2 font-semibold text-sm text-gray-700">
                <span className="text-[#26c0ff]  ">✓</span> Proven training methodologies
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary2 mb-3 uppercase tracking-wide text-sm border-b pb-2">Curriculum</h4>
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
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <h3 className="text-2xl font-black text-[#26c0ff] mb-2 uppercase">Registration Successful!</h3>
              <p className="text-gray-600">We'll be in touch with you shortly.</p>
            </motion.div>
          ) : (
            <>
              <h3 className="text-2xl font-black text-[#26c0ff] uppercase mb-1">Register Now</h3>
              <p className="text-gray-500 text-xs mb-6">Fill out the form below to secure your spot.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#26c0ff] focus:ring-1 focus:ring-[#26c0ff] transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#26c0ff] focus:ring-1 focus:ring-[#26c0ff] transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile_number"
                    required
                    value={formData.mobile_number}
                    onChange={handleMobileChange}
                    pattern="[0-9]{10}"
                    title="Please enter exactly 10 digits"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#26c0ff] focus:ring-1 focus:ring-[#26c0ff] transition-all"
                    placeholder="98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Program of Interest</label>
                  <select
                    name="programs"
                    value={formData.programs}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#26c0ff] focus:ring-1 focus:ring-[#26c0ff] transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select a program</option>
                    <option value="Karate">Karate</option>
                    <option value="Taekwondo">Taekwondo</option>
                    <option value="Boxing">Boxing</option>
                    <option value="Kickboxing">Kickboxing</option>
                    <option value="MMA (Mixed Martial Arts)">MMA (Mixed Martial Arts)</option>
                    <option value="Self-Defense">Self-Defense</option>
                    <option value="Judo/Wushu">Judo/Wushu</option>
                    <option value="Shaolin Kung-fu">Shaolin Kung-fu</option>
                    <option value="Pencak silat">Pencak silat</option>
                    <option value="Gymnastics">Gymnastics</option>
                    <option value="Weapon's,Muay-thai">Weapon's,Muay-thai</option>
                  </select>
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
                  disabled={isSubmitting}
                  className="w-full bg-[#26c0ff] hover:bg-[#f97316] text-white font-bold uppercase tracking-widest py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationSection;
