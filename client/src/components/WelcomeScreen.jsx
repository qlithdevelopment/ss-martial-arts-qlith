import { motion } from "framer-motion";
import CartoonAnimation from "./CartoonAnimation";
import Logo from "../assets/Logo_low.png"

const easing = [0.87, 0, 0.13, 1];

const NINJA_W = 180 * 1.15;  // ~207px
const NINJA_H = 248.5 * 1.15; // ~286px

const WelcomeScreen = () => {
  return (
    // FIXED: Root wrapper acts as a pure layout grid and won't block clicks when doors split
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      {/* ─── LEFT PANEL ─── */}
      <motion.div
        initial={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 1.4, ease: easing, delay: 0.9 }}
        style={{
          position: "absolute", top: 0, left: 0,
          width: "50%", height: "100%",
          background: "#000", overflow: "hidden",
          pointerEvents: "auto"
        }}
      >
        {/* Blue glow on right edge */}
        <motion.div
          initial={{ opacity: 0 }}
          exit={{ opacity: [0, 1, 1, 0], transition: { duration: 1.4, delay: 0.9, times: [0, 0.1, 0.7, 1] } }}
          style={{
            position: "absolute", top: 0, right: 0,
            width: "120px", height: "100%",
            background: "linear-gradient(to left, rgba(56,182,255,0.55) 0%, rgba(56,182,255,0.15) 50%, transparent 100%)",
            filter: "blur(8px)",
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          exit={{ opacity: [0, 1, 1, 0], transition: { duration: 1.4, delay: 0.9, times: [0, 0.08, 0.65, 1] } }}
          style={{
            position: "absolute", top: 0, right: 0,
            width: "2px", height: "100%",
            background: "linear-gradient(to bottom, transparent 0%, #38b6ff 20%, #a8e6ff 50%, #38b6ff 80%, transparent 100%)",
            boxShadow: "0 0 18px 6px rgba(56,182,255,0.8), 0 0 40px 12px rgba(56,182,255,0.4)",
          }}
        />

        {/* LEFT NINJA */}
        <motion.div
          initial={{ opacity: 0, right: -NINJA_W / 2 }}
          exit={{
            opacity: [0, 1, 1, 1],
            right: [`${-NINJA_W / 2}px`, `${-NINJA_W / 2}px`, "100%"],
            transition: {
              duration: 2.1,
              delay: 0.35,
              ease: easing,
              opacity: { times: [0, 0.05, 0.3, 1], duration: 2.1, delay: 0.35 },
              right: { times: [0, 0.01, 1], duration: 2.1, delay: 0.35 },
            },
          }}
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: `${NINJA_W}px`,
            height: `${NINJA_H}px`,
            pointerEvents: "none",
          }}
        >
          <CartoonAnimation direction="left" />
        </motion.div>
      </motion.div>

      {/* ─── RIGHT PANEL ─── */}
      <motion.div
        initial={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 1.4, ease: easing, delay: 0.9 }}
        style={{
          position: "absolute", top: 0, right: 0,
          width: "50%", height: "100%",
          background: "#000", overflow: "hidden",
          pointerEvents: "auto"
        }}
      >
        {/* Blue glow on left edge */}
        <motion.div
          initial={{ opacity: 0 }}
          exit={{ opacity: [0, 1, 1, 0], transition: { duration: 1.4, delay: 0.9, times: [0, 0.1, 0.7, 1] } }}
          style={{
            position: "absolute", top: 0, left: 0,
            width: "120px", height: "100%",
            background: "linear-gradient(to right, rgba(56,182,255,0.55) 0%, rgba(56,182,255,0.15) 50%, transparent 100%)",
            filter: "blur(8px)",
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          exit={{ opacity: [0, 1, 1, 0], transition: { duration: 1.4, delay: 0.9, times: [0, 0.08, 0.65, 1] } }}
          style={{
            position: "absolute", top: 0, left: 0,
            width: "2px", height: "100%",
            background: "linear-gradient(to bottom, transparent 0%, #38b6ff 20%, #a8e6ff 50%, #38b6ff 80%, transparent 100%)",
            boxShadow: "0 0 18px 6px rgba(56,182,255,0.8), 0 0 40px 12px rgba(56,182,255,0.4)",
          }}
        />

        {/* RIGHT NINJA */}
        <motion.div
          initial={{ opacity: 0, left: -NINJA_W / 2 }}
          exit={{
            opacity: [0, 1, 1, 1],
            left: [`${-NINJA_W / 2}px`, `${-NINJA_W / 2}px`, "100%"],
            transition: {
              duration: 2.1,
              delay: 0.35,
              ease: easing,
              opacity: { times: [0, 0.05, 0.3, 1], duration: 2.1, delay: 0.35 },
              left: { times: [0, 0.01, 1], duration: 2.1, delay: 0.35 },
            },
          }}
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: `${NINJA_W}px`,
            height: `${NINJA_H}px`,
            pointerEvents: "none",
          }}
        >
          <CartoonAnimation direction="right" />
        </motion.div>
      </motion.div>

      {/* ─── CENTER CONTENT ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{
          opacity: 0,
          scale: 0.94,
          filter: "blur(6px)",
          transition: { duration: 0.35, ease: "easeIn" },
        }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="absolute inset-0 flex flex-col items-center justify-center z-10 select-none pointer-events-none"
      >
        <motion.img
          src={Logo}
          alt="Logo"
          className="w-60 h-60 object-contain mb-2"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="bg-white mb-5"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 60, opacity: 0.3 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          style={{ height: "1px" }}
        />
        <motion.p
          className="text-gray-400 text-sm tracking-[6px] uppercase"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
        >
          Welcome to SS Martial Arts Schools
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;