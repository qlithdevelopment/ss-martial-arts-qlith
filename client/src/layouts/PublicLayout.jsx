import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import WelcomeScreen from "../components/WelcomeScreen";

const PublicLayout = () => {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const SHOW_AFTER_MINUTES = -1;

    if (SHOW_AFTER_MINUTES === 0) return;

    const startWelcome = () => {
      setShowWelcome(true);
      // Cleaned up timer to 2500ms so the screen opens swiftly 
      // without leaving users stranded on an empty black page.
      const timer = setTimeout(() => setShowWelcome(false), 2500);
      return () => clearTimeout(timer);
    };

    if (SHOW_AFTER_MINUTES === -1) {
      return startWelcome();
    }

    const lastShown = localStorage.getItem("welcome_last_shown");
    const now = Date.now();
    const SHOW_AFTER = SHOW_AFTER_MINUTES * 60 * 1000;

    if (!lastShown || now - Number(lastShown) > SHOW_AFTER) {
      localStorage.setItem("welcome_last_shown", String(now));
      return startWelcome();
    }
  }, []);

  return (
    <>
      {/* FIXED: AnimatePresence must live here, wrapping the conditional block */}
      <AnimatePresence>
        {showWelcome && <WelcomeScreen />}
      </AnimatePresence>

      <Navbar />
      <div className="min-h-screen bg-black">
        <Outlet />
      </div>
    </>
  );
};

export default PublicLayout;