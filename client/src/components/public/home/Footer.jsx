import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../../assets/Full_Logo.png";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Home } from "lucide-react";


// Simple SVG Icons for Socials
const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.73 11.73"></path>
    <path d="M4 20l6.76-6.76"></path>
    <path d="M20 20L8.27 8.27"></path>
    <path d="M20 4l-6.76 6.76"></path>
  </svg>
);
const quicklinks=[
 'About','Gallery','Blog','Afiliation','Contact','Events','Faq'
  
]

const Footer = () => {
  return (
    <footer className="w-full bg-black h-auto lg:pt-12 flex flex-col justify-between pt-8 pb-4 border-t border-white/10 relative z-50 overflow-hidden">      
      <div className="global-container lg:!px-22 flex-1 flex flex-col justify-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 md:gap-12 mb-4"
        >
          
          {/* BRANDING */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-4  mb-2 md:mb-4">
              <img src={Logo} alt="Logo" className="w-24 md:-mt-8 md:w-40 object-contain" />
            </Link>
            <p className="text-secondary text-[10px] md:text-sm leading-relaxed mb-2 md:mb-4">
              Forging champions through elite martial arts training, discipline, and unbreakable focus.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="col-span-1">
            <h4 className="text-white font-bold tracking-widest uppercase mb-2 md:mb-4 text-[10px] md:text-base">Quick Links</h4>
            <ul className="flex flex-col gap-1 md:gap-1">
              {quicklinks.map((link) => (
                <li key={link}>
                  <Link 
                    to={link === 'Home' ? '/' : `/${link.toLowerCase()}`} 
                    className="text-secondary hover:text-primary transition-colors duration-300 text-[10px] md:text-sm font-medium"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* PROGRAMS */}
          <div className="col-span-1 ml-10 md:ml-0">
            <h4 className="text-white font-bold tracking-widest uppercase mb-2 md:mb-4 text-[10px] md:text-base">Programs</h4>
            <ul className="flex flex-col gap-1.5 md:gap-3">
              {['Karate', 'Taekwondo', 'Boxing','Kickboxing','MMA (Mixed Martial Arts)','Self-Defense'].map((link) => (
                <li key={link}>
                  <Link 
                    to="/allprograms" 
                    className="text-secondary hover:text-primary transition-colors duration-300 text-[10px] md:text-sm font-medium"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-white font-bold tracking-widest uppercase mb-2 md:mb-4 text-[10px] md:text-base">Contact</h4>
            <ul className="flex flex-col gap-2 md:gap-4 text-[10px] md:text-sm text-secondary">
              <li className="flex items-start gap-2 md:gap-3">
                <MapPin className="text-primary mt-0.5 md:mt-1 w-4 h-4 md:w-5 md:h-5 shrink-0" />
                <span>Near Ekramra College, Sundarpada, Bhubaneswar, Odisha 751002</span>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <Phone className="text-primary w-4 h-4 md:w-5 md:h-5 shrink-0" />
                <span>+91 9090224658</span>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <Mail className="text-primary w-4 h-4 md:w-5 md:h-5 shrink-0" />
                <span>ssmartialartsschool@gmail.com</span>
              </li>
            </ul>
          </div>

        </motion.div>

        {/* BOTTOM COPYRIGHT */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary text-[9px] md:text-xs flex-1 lg:text-center text-start">
            &copy; {new Date().getFullYear()} SS Martial Arts Schools. All rights reserved. <span className="mx-1 md:mx-2 text-white/20">|</span> Developed by <a href="https://www.qlith.com/" target="_blank" rel="noreferrer" className="text-white hover:text-primary transition-colors duration-300 font-medium">Qlith</a>
          </p>

          <div className="flex gap-3 md:gap-4 flex-1 justify-center md:justify-end">
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 md:w-10 md:h-10 border border-[#333] rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#E1306C] hover:border-[#E1306C] transition-all duration-300 hover:scale-110 shadow-lg group"
            >
              <InstagramIcon className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-300 group-hover:scale-110" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 md:w-10 md:h-10 border border-[#333] rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] transition-all duration-300 hover:scale-110 shadow-lg group"
            >
              <FacebookIcon className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-300 group-hover:scale-110" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 md:w-10 md:h-10 border border-[#333] rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-white hover:border-white transition-all duration-300 hover:scale-110 shadow-lg group"
            >
              <TwitterIcon className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-300 group-hover:scale-110" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
