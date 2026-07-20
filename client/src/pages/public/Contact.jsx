import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import silhouetteImg from '../../assets/samurai_shadow.png';
import SectionHeader from '../../components/SectionHeader';

const Contact = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    programs: 'Adult Martial Arts',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.mobile_number || !formData.message) {
      return toast.error("Please fill in all required fields.");
    }

    try {
      setIsSubmitting(true);
      toast.loading("Sending message...", { id: "contact" });

      await api.post('/contacts', formData);

      toast.success("Message sent successfully! We will reach out soon.", { id: "contact" });
      setFormData({
        first_name: '',
        last_name: '',
        mobile_number: '',
        programs: 'Adult Martial Arts',
        message: ''
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to send message.", { id: "contact" });
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative overflow-hidden w-full min-h-screen bg-black pt-24 pb-12 md:pt-28 md:pb-16 lg:pt-32 lg:pb-24 px-4 md:px-8 font-sans selection:bg-[#26c0ff] selection:text-white">

      {/* MASSIVE BACKGROUND TEXT */}
      <div className="fixed top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.09] uppercase tracking-tighter pointer-events-none  whitespace-nowrap select-none">
        CONTACT
      </div>

      {/* Header */}
      <div className="global-container lg:!px-14 mb-10 md:mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SectionHeader
            label="Reach Out"
            title="LET'S"
            highlight="WORK"            
          />          
          <p className="text-gray-300 max-w-2xl text-lg font-medium">
            Ready to begin your journey? Whether you have questions about our programs, want to schedule a trial, or are interested in private coaching, we are here to help.
          </p>
        </motion.div>
      </div>

      <div className="global-container lg:!px-14 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

        {/* Left Side: Contact Info & Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Email Card */}
            <div className="bg-[#f9fafb] p-5 rounded-2xl border border-gray-200 shadow-xl flex flex-col items-start gap-3 hover:border-[#26c0ff] transition-colors group">
              <div className="w-10 h-10 rounded-full bg-[#26c0ff]/10 flex items-center justify-center text-[#26c0ff] group-hover:bg-[#26c0ff] group-hover:text-white transition-colors">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="text-[#26c0ff] font-black uppercase tracking-wider mb-1 text-sm">Email Us</h3>
                <p className="text-black font-bold text-sm">ssmartialartsschool@gmail.com</p>
                <p className="text-gray-500 text-xs mt-1">We reply within 24 hours.</p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-[#f9fafb] p-5 rounded-2xl border border-gray-200 shadow-xl flex flex-col items-start gap-3 hover:border-[#26c0ff] transition-colors group">
              <div className="w-10 h-10 rounded-full bg-[#26c0ff]/10 flex items-center justify-center text-[#26c0ff] group-hover:bg-[#26c0ff] group-hover:text-white transition-colors">
                <Phone size={20} />
              </div>
              <div>
                <h3 className="text-[#26c0ff] font-black uppercase tracking-wider mb-1 text-sm">Call Us</h3>
                <p className="text-black font-bold text-sm">+91 9090224658</p>
                <p className="text-gray-500 text-xs mt-1">Mon - Sat, 8am to 8pm</p>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-[#f9fafb] p-5 rounded-2xl border border-gray-200 shadow-xl flex flex-col items-start gap-3 hover:border-[#26c0ff] transition-colors sm:col-span-2 group">
              <div className="w-10 h-10 rounded-full bg-[#26c0ff]/10 flex items-center justify-center text-[#26c0ff] group-hover:bg-[#26c0ff] group-hover:text-white transition-colors">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="text-[#26c0ff] font-black uppercase tracking-wider mb-1 text-sm">Academy Location</h3>
                <p className="text-black font-medium text-sm leading-relaxed">
                  near Ekramra College, Sundarpada,
                  <br />
                  Bhubaneswar, Odisha 751002
                </p>
              </div>
            </div>

          </div>

          {/* Let's Work Together Banner */}
          <div className="bg-[#26c0ff] border border-[#26c0ff] rounded-2xl p-6 flex items-center justify-between shadow-lg">
            <div>
              <h4 className="text-black font-black text-xl uppercase tracking-tight mb-1">Start Training Today</h4>
              <p className="text-black/80 font-bold text-xs">Join the elite rank of our academy.</p>
            </div>
            <div className="w-14 h-14 bg-[#f9fafb] rounded-xl p-1 shrink-0 shadow-sm flex items-center justify-center border border-white/10">
              <span className="text-[9px] font-bold text-[#26c0ff] text-center uppercase tracking-widest leading-none">Scan<br />To<br />Join</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-gradient-to-br from-[#f8fcfd] to-[#dcf2ff] p-5 md:p-6 rounded-3xl lg:-mr-1.5 border border-[#26c0ff]/20 shadow-2xl relative overflow-hidden h-full">

            <div className="absolute top-0 right-0 w-64 h-64 bg-[#26c0ff] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 pointer-events-none"></div>

            {/* Subtle Samurai Watermark */}
            <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-end overflow-hidden opacity-20">
              <img
                src={silhouetteImg}
                alt="Samurai Background"
                className="w-auto h-[120%] object-contain object-right-bottom translate-x-[20%] translate-y-[10%]"
              />
            </div>

            <h3 className="text-xl md:text-2xl font-black text-[#26c0ff] uppercase tracking-tighter mb-5 relative z-10">Send a Message</h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#26c0ff] text-[10px] font-bold uppercase tracking-widest">First Name</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-black placeholder-gray-400 focus:outline-none focus:border-[#26c0ff] focus:ring-1 focus:ring-[#26c0ff] transition-all text-sm"
                    placeholder="Rahul"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#26c0ff] text-[10px] font-bold uppercase tracking-widest">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-black placeholder-gray-400 focus:outline-none focus:border-[#26c0ff] focus:ring-1 focus:ring-[#26c0ff] transition-all text-sm"
                    placeholder="Sharma"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#26c0ff] text-[10px] font-bold uppercase tracking-widest">Mobile Number</label>
                <input
                  type="tel"
                  value={formData.mobile_number}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                    setFormData({ ...formData, mobile_number: onlyNums });
                  }}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-black placeholder-gray-400 focus:outline-none focus:border-[#26c0ff] focus:ring-1 focus:ring-[#26c0ff] transition-all text-sm"
                  placeholder="+91 98765 43210"
                  pattern="[0-9]{10}"
                  title="Please enter exactly 10 digits"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#26c0ff] text-[10px] font-bold uppercase tracking-widest">Program of Interest</label>
                <select
                  value={formData.programs}
                  onChange={(e) => setFormData({ ...formData, programs: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-black focus:outline-none focus:border-[#26c0ff] focus:ring-1 focus:ring-[#26c0ff] transition-all appearance-none cursor-pointer text-sm"
                >
                  <option className="text-black">Adult Martial Arts</option>
                  <option className="text-black">Youth Classes</option>
                  <option className="text-black">Private Coaching</option>
                  <option className="text-black">General Inquiry</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#26c0ff] text-[10px] font-bold uppercase tracking-widest">Message</label>
                <textarea
                  rows="3"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-black placeholder-gray-400 focus:outline-none focus:border-[#26c0ff] focus:ring-1 focus:ring-[#26c0ff] transition-colors resize-none custom-scrollbar shadow-inner text-sm"
                  placeholder="How can we help you?"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full bg-black hover:bg-[#26c0ff] text-white font-black uppercase tracking-widest py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"} <Send size={16} />
              </button>
            </form>

          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Contact;
