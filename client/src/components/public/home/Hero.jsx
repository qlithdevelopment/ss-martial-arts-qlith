import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-bgColor pt-10">
      {/* VIDEO BG */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
        "
      >
        <source
          src="https://www.pexels.com/download/video/4440998/"
          type="video/mp4"
        />
      </video>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/75 z-10" />

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

          min-h-screen

          max-w-7xl
          mx-auto

          px-5
          sm:px-8
          lg:px-10

          flex
          items-center
        "
      >
        <div className="max-w-4xl">
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
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="
              text-text

              text-5xl
              sm:text-6xl
              md:text-7xl
              lg:text-[110px]

              font-black

              uppercase

              leading-[0.9]

              tracking-tight

              mb-8

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
            <span
              className="
                block

                text-primary

                mt-3
              "
            >
              True Warrior
            </span>
          </motion.h1>

          {/* DESCRIPTION */}
          <motion.p
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
              delay: 0.4,
            }}
            className="
              text-secondary

              text-base
              sm:text-lg
              md:text-xl

              leading-relaxed

              max-w-2xl

              mb-10
            "
          >
            Build discipline, confidence,
            strength, and focus through
            elite martial arts training
            designed for champions and
            future leaders.
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

              gap-5
            "
          >
            {/* BTN 1 */}
            <button
              className="
                px-8
                py-4

                rounded-xl

                bg-primary

                text-black

                font-bold

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

            {/* BTN 2 */}
            <button
              className="
                px-8
                py-4

                rounded-xl

                border
                border-primary2/40

                bg-black/30

                backdrop-blur-md

                text-text

                font-bold

                tracking-wide

                transition-all
                duration-300

                hover:border-primary2

                hover:bg-primary2/10
              "
            >
              Watch Training
            </button>
          </motion.div>

          {/* STATS */}
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
              delay: 0.8,
            }}
            className="
              flex
              flex-wrap

              gap-8
              sm:gap-14

              mt-16
            "
          >
            {/* ITEM */}
            <div>
              <h3
                className="
                  text-4xl
                  md:text-5xl

                  font-black

                  text-primary
                "
              >
                10+
              </h3>

              <p className="text-secondary mt-2">
                Years Experience
              </p>
            </div>

            {/* ITEM */}
            <div>
              <h3
                className="
                  text-4xl
                  md:text-5xl

                  font-black

                  text-primary2
                "
              >
                500+
              </h3>

              <p className="text-secondary mt-2">
                Active Students
              </p>
            </div>

            {/* ITEM */}
            <div>
              <h3
                className="
                  text-4xl
                  md:text-5xl

                  font-black

                  text-primary
                "
              >
                24/7
              </h3>

              <p className="text-secondary mt-2">
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