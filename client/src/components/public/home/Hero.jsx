import React, { useState } from "react";
import { motion } from "framer-motion";
import heroVideo from "../../../assets/ss.mp4";
import fallbackImage from "../../../assets/ChatGPT Image Jun 11, 2026, 02_08_50 PM.png";
import { Link } from "react-router-dom";

const Hero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section id="hero" className="relative w-full lg:py-0 min-h-screen overflow-hidden bg-bgColor pt-10">

      {/* FALLBACK IMAGE */}
      <img
        src={fallbackImage}
        alt="Hero Background"
        className={`
          absolute
          inset-0
          w-full
          h-full
          object-cover
          scale-[1.15] md:scale-[1.20]
          object-[70%_40%] md:object-[70%_40%] lg:object-[0%_40%] xl:object-[5%_40%]
          transition-opacity duration-[1000ms] delay-1000 ease-in-out
          ${videoLoaded ? "opacity-0" : "opacity-100"}
        `}
      />

      {/* VIDEO BG */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlayThrough={() => setVideoLoaded(true)}
        className={`
          absolute
          inset-0
          w-full
          h-full
          object-cover
          scale-[1.15] md:scale-[1.20]
          object-[70%_40%] md:object-[70%_40%] lg:object-[0%_40%] xl:object-[5%_40%]
          transition-opacity duration-[1000ms] ease-in-out
          ${videoLoaded ? "opacity-100" : "opacity-0"}
        `}
      >
        <source src={heroVideo} type="video/mp4" 
        />
      </video>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* LIGHT EFFECT */}
      <div
        className="
          absolute
          inset-0
          z-10

          bg-[radial-gradient(circle_at_top_left,rgba(38,192,255,0.15),transparent_40%)]
        "
      />

      {/* SECOND LIGHT */}
      <div
        className="
          absolute
          bottom-0
          right-0
          w-[500px]
          h-[500px]

          rounded-full

          bg-primary2/10

          blur-[120px]

          z-10
        "
      />

      {/* CONTENT */}
      <div
        className="
          relative
          z-20
          min-h-[100svh]
          global-container
          lg:!px-20
          flex
          items-end lg:items-center lg:pl-8
          pb-12 sm:pb-20 lg:pb-0
        "
      >
        <div className="max-w-4xl w-full mt-auto lg:mt-20 lg:mb-10 pt-24 lg:ml-2 lg:pt-0">
          {/* TAG */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="
              inline-flex
              items-center
              gap-3

              px-5
              py-2

              border
              border-primary/30

              bg-primary/10

              rounded-full

              mb-7
            "
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />

            <p
              className="
                text-primary

                uppercase

                tracking-[4px]

                text-xs
                sm:text-sm

                font-semibold
              "
            >
              Martial Arts Academy
            </p>
          </motion.div>

          {/* HEADING */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="
              text-text
              text-[32px]
              sm:text-5xl
              md:text-6xl
              lg:text-[80px]
              font-black
              uppercase
              leading-[1] lg:leading-[0.9]
              tracking-tight
              mb-4 lg:mb-6
              drop-shadow-[0_5px_20px_rgba(0,0,0,0.7)]
            "
            style={{
              textShadow: `
                0 2px 0 #111,
                0 4px 0 #0a0a0a,
                0 6px 20px rgba(38,192,255,0.35)
              `,
            }}
          >
            Train Like A
            <span className="block text-primary mt-2">
              True Warrior
            </span>
          </motion.h1>

          {/* DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="
              text-white
              text-xs
              sm:text-base
              md:text-lg
              leading-relaxed
              max-w-xl
              mb-6 lg:mb-10
            "
          >
            Build discipline, confidence, strength, and focus through elite
            martial arts training designed for champions and future leaders.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.6,
            }}
            className="
              flex
              flex-col
              sm:flex-row

              gap-3 lg:gap-5
            "
          >
            {/* BTN 1 */}
            <Link to="/contact">
              <button
                className="
                px-6 lg:px-8
                py-3 lg:py-4

                rounded-xl

                bg-primary

                text-black

                font-bold
                text-sm lg:text-base

                tracking-wide

                transition-all
                duration-300

                hover:scale-105

                hover:bg-white

                shadow-[0_0_25px_rgba(38,192,255,0.35)]
              "
              >
                Join Academy
              </button>
            </Link>
            {/* BTN 2 */}
             <Link to="/services">
            <button
              className="
                px-6 lg:px-8
                py-3 lg:py-4

                rounded-xl

                border
                border-primary2/40

                bg-black/30

                backdrop-blur-md

                text-text

                font-bold
                text-sm lg:text-base

                tracking-wide

                transition-all
                duration-300

                hover:border-primary2

                hover:bg-primary2/10
              "
            >
              Explore Training
            </button>
            </Link>
          </motion.div>

          {/* STATS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="
              hidden sm:flex flex-wrap gap-4 sm:gap-14 mt-6 lg:mt-16
              bg-transparent
              w-fit
            "
          >
            {/* ITEM */}
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-white">
                10+
              </h3>
              <p className="text-gray-300 font-bold uppercase tracking-widest text-xs mt-2">
                Years Experience
              </p>
            </div>

            {/* ITEM */}
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-[#26c0ff]">
                500+
              </h3>
              <p className="text-gray-300 font-bold uppercase tracking-widest text-xs mt-2">
                Active Students
              </p>
            </div>

            {/* ITEM */}
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-white">
                24/7
              </h3>
              <p className="text-gray-300 font-bold uppercase tracking-widest text-xs mt-2">
                Online Support
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* BOTTOM FADE */}
      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          h-40

          bg-gradient-to-t
          from-bgColor
          to-transparent

          z-20
        "
      />
    </section>
  );
};

export default Hero;