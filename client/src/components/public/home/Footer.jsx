import { Link } from "react-router-dom";
import Logo from "../../../assets/Full_Logo.png";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="w-full bg-black h-auto flex flex-col justify-between pt-8 pb-4 border-t border-white/10 relative z-50 overflow-hidden">
      {/* MASSIVE BACKGROUND TEXT */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.03] uppercase tracking-tighter pointer-events-none z-0 whitespace-nowrap select-none">
        CONTACT
      </div>
      <div className="global-container flex-1 flex flex-col justify-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 md:gap-12 mb-4"
        >
          
          {/* BRANDING */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-4 mb-2 md:mb-4">
              <img src={Logo} alt="Logo" className="w-24 md:w-40 object-contain" />
            </Link>
            <p className="text-secondary text-[10px] md:text-sm leading-relaxed mb-2 md:mb-4">
              Forging champions through elite martial arts training, discipline, and unbreakable focus.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="col-span-1">
            <h4 className="text-white font-bold tracking-widest uppercase mb-2 md:mb-4 text-[10px] md:text-base">Quick Links</h4>
            <ul className="flex flex-col gap-1.5 md:gap-3">
              {['Home', 'About', 'Services'].map((link) => (
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
          <div className="col-span-1">
            <h4 className="text-white font-bold tracking-widest uppercase mb-2 md:mb-4 text-[10px] md:text-base">Programs</h4>
            <ul className="flex flex-col gap-1.5 md:gap-3">
              {['Adult Martial Arts', 'Youth Classes', 'Private Coaching'].map((link) => (
                <li key={link}>
                  <Link 
                    to="/services" 
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
            <ul className="flex flex-col gap-1.5 md:gap-4 text-[10px] md:text-sm text-secondary">
              <li className="flex items-start gap-2 md:gap-3">
                <span className="text-primary mt-0.5 md:mt-1">📍</span>
                <span>123 Warrior Way, Combat City, ST 90210</span>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <span className="text-primary">📞</span>
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <span className="text-primary">✉️</span>
                <span>info@ssmartialarts.com</span>
              </li>
            </ul>
          </div>

        </motion.div>

        {/* BOTTOM COPYRIGHT */}
        <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
          <p className="text-secondary text-[9px] md:text-xs">
            &copy; {new Date().getFullYear()} SS Martial Arts Schools. All rights reserved.
          </p>
          <div className="flex gap-3 md:gap-4">
            <a href="#" className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary transition-colors">
              <span className="text-[9px] md:text-xs">IG</span>
            </a>
            <a href="#" className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary transition-colors">
              <span className="text-[9px] md:text-xs">FB</span>
            </a>
            <a href="#" className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary transition-colors">
              <span className="text-[9px] md:text-xs">X</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
