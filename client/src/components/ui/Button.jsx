import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = '', variant = 'primary', ...props }) => {
  const baseClasses = "px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 text-sm md:text-base lg:text-lg rounded-xl font-bold tracking-wide transition-all duration-300";
  
  const variants = {
    primary: "bg-[var(--color-primary)] text-white hover:bg-white hover:text-[var(--color-primary)] shadow-lg",
    secondary: "border border-white/20 bg-white/5 backdrop-blur-lg text-white hover:bg-white hover:text-black",
    dark: "bg-[#0b1b24] text-white hover:bg-[var(--color-primary)]",
    accent: "bg-[var(--color-primary2)] text-white hover:bg-[#0a192f] shadow-lg shadow-[var(--color-primary2)]/20"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
