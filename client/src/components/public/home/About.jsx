import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Silhouette from "../../../assets/new_silhouette.png";

const About = () => {
  return (
    <section id="about" className="relative w-full min-h-[100svh] flex items-center bg-[#f8f9fa] overflow-hidden py-12 md:py-16 lg:py-0">
      
      {/* MASSIVE BACKGROUND TEXT */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-black/[0.03] uppercase tracking-tighter pointer-events-none z-0 whitespace-nowrap select-none">
        ABOUT
      </div>
      <div className="global-container relative z-10 flex items-center">
        
        <div className="flex flex-col lg:flex-row-reverse w-full items-center justify-center lg:justify-between gap-16 lg:gap-8">
          
          {/* LEFT COLUMN: Typography & Content (Now visual right) */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center relative z-20 pl-0 lg:pl-12">
            
            {/* VERTICAL CONTENT STACK */}
            <div className="flex flex-col w-full mt-8 lg:mt-4">
              
              {/* TOP: ABOUT ACADEMY (STANDARDIZED) */}
              <div className="flex flex-col items-start mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-1 w-12 bg-[#f97316]"></div>
                  <h3 className="text-[#f97316] font-bold tracking-[0.2em] uppercase text-sm">Discover Our Roots</h3>
                </div>
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter text-[#0b1b24]"
                >
                  ABOUT  <span className="text-[#26c0ff]">ACADEMY</span>
                </motion.h2>
              </div>

              {/* MIDDLE: LOREM PARAGRAPHS */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, delay: 0.2 }}
                className="flex flex-col justify-start mb-10 border-l-[3px] border-[#26c0ff] pl-6"
              >
                <p className="text-gray-600 text-sm leading-relaxed mb-4 font-medium max-w-[90%]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos deleniti magnam perspiciatis dolorem error laboriosam necessitatibus, veniam debitis in! Ipsam animi officiis sapiente aspernatur hic repellat minus praesentium facilis.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed font-medium max-w-[90%]">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit optio architecto tempore unde obcaecati in sequi id voluptatibus est, possimus, iste eaque officiis!
                </p>
              </motion.div>

              {/* BOTTOM: MISSION & VISION (SIDE-BY-SIDE) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 w-full border-t-[2px] border-gray-200 pt-8"
              >
                
                {/* MISSION */}
                <div className="flex flex-col justify-start">
                  <div className="relative">
                    <h3 className="relative text-xl sm:text-2xl font-black text-[#0b1b24] z-10 tracking-[0.2em] uppercase inline-block font-serif mb-4">
                      <span className="absolute left-[-10px] top-[50%] -translate-y-[50%] w-8 h-8 rounded-full bg-[#f97316] z-[-1] opacity-90 mix-blend-multiply"></span>
                      MISSION
                    </h3>
                    <ul className="space-y-2 text-[12px] sm:text-[13px] text-gray-600 font-medium">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                        Build discipline, confidence, and resilience.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                        Focus on fitness and personal safety.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                        Empower youth and women.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                        Proudly support the Fit India movement.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* VISION */}
                <div className="flex flex-col justify-start">
                  <div className="relative">
                    <h3 className="relative text-xl sm:text-2xl font-black text-[#0b1b24] z-10 tracking-[0.2em] uppercase inline-block font-serif mb-4">
                      <span className="absolute left-[-10px] top-[50%] -translate-y-[50%] w-8 h-8 rounded-full bg-[#26c0ff] z-[-1] opacity-90 mix-blend-multiply"></span>
                      VISION
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-[12px] sm:text-[13px] font-medium pr-4">
                      To enhance this initiative, the Trust is launching an Integrated Martial Arts Training Program in Bhubaneswar as well as other states of India to empower the next generation.
                    </p>
                  </div>
                </div>

              </motion.div>

            </div>
          </div>

          {/* RIGHT COLUMN: Blue Circle with Silhouette */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-end items-center relative mt-16 lg:mt-0 z-10">
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.4, duration: 1.5 }}
              viewport={{ once: true }}
              className="w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[450px] lg:h-[450px] xl:w-[550px] xl:h-[550px] rounded-full bg-[#26c0ff] relative z-0 flex items-center justify-center mt-4 lg:mt-0"
            >
              {/* IMAGE CENTERED, BREAKING OUT BOTTOM */}
              <img 
                src={Silhouette} 
                alt="Shadow Martial Artist" 
                className="absolute top-[5%] left-[50%] -translate-x-[50%] h-[130%] sm:h-[140%] lg:h-[155%] w-auto max-w-none object-contain mix-blend-multiply drop-shadow-2xl pointer-events-none z-30" 
              />

              {/* GENTLY BLINKING WHITE EYES */}
              <motion.div 
                animate={{ opacity: [0.1, 0.8, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute z-40 flex gap-[12px] sm:gap-[16px] lg:gap-[20px] top-[24%] sm:top-[28%] lg:top-[30%] left-[50%] -translate-x-[50%]"
              >
                {/* Left Eye */}
                <div className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] lg:w-[5px] lg:h-[5px] bg-white rounded-full shadow-[0_0_12px_4px_rgba(255,255,255,0.8)]"></div>
                {/* Right Eye */}
                <div className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] lg:w-[5px] lg:h-[5px] bg-white rounded-full shadow-[0_0_12px_4px_rgba(255,255,255,0.8)]"></div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    
        </section>
  );
};

export default About;
