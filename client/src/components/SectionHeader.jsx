import React from 'react';
import { motion } from 'framer-motion';


const SectionHeader = ({
  bgText,  
  label,
  title,
  highlight,
  accentColor = '#f97316',
  highlightColor = '#26c0ff',
  titleColor = 'text-white',          
  doubleBar = true,             
  animate = false,
  className = '',
}) => {
 

  const content = (
    <div className={`flex flex-col justify-start mb-8 md:mb-16`}>
      {label && (
        <div className="flex items-center gap-4 mb-4">
          <div className="h-1 w-12" style={{ backgroundColor: accentColor }}></div>
          <h3
            className="font-bold tracking-[0.2em] uppercase text-sm"
            style={{ color: accentColor }}
          >
            {label}
          </h3>
          {doubleBar && (
            <div className="h-1 w-12" style={{ backgroundColor: accentColor }}></div>
          )}
        </div>
      )}

      <h2
        className={`text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter text-left ${titleColor}`}
      >
        {title}{' '}
        {highlight && (
          <span style={{ color: highlightColor }}>{highlight}</span>
        )}
      </h2>
    </div>
  );

  return (
    <>
      {/* MASSIVE BACKGROUND TEXT */}
      {bgText && (
          <div  
          className={`fixed top-[40%] z-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-black/[0.05] uppercase tracking-tighter pointer-events-none  whitespace-nowrap select-none`}> 
                
          {bgText}
        </div>
      )}

      {animate ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`relative z-10 ${className}`}
        >
          {content}
        </motion.div>
      ) : (
        <div className={`relative z-10 ${className}`}>{content}</div>
      )}
    </>
  );
};

export default SectionHeader;