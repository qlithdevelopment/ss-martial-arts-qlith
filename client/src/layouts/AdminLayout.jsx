import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ChevronUp, Clock3 } from "lucide-react";

const AdminLayout = () => {
  const [time, setTime] = useState(new Date());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 768);
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarCollapsed(true);
    }
  }, []);

  // Synchronize live clock ticker
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Track window scroll to show/hide the back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* RESPONSIVE SIDEBAR NAVIGATION */}
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

      {/* VIEWPORT ACTION FRAME */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* STREAMLINED FIXED HEADER */}
        <header
          className="fixed top-0 right-0 left-0 md:left-auto md:w-[calc(100%-16.5rem)] data-[collapsed=true]:md:w-[calc(100%-5rem)] h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-30 transition-all duration-300"
          data-collapsed={isSidebarCollapsed}
        >
          {/* LEFT SIDE: Identity Badge */}
          <div className="flex items-center gap-2 pl-12 md:pl-0">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-bold uppercase tracking-wider text-gray-700">
              Administrator
            </span>
          </div>

          {/* RIGHT SIDE: Dynamic Digital Clock */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 py-1.5 px-3 rounded-xl">
           
            <Clock3
              className="w-4 h-4 text-secondary"
              strokeWidth={1.5}
            />
            <span className="text-sm font-mono font-bold text-gray-600">
              {time.toLocaleTimeString()}
            </span>
          </div>
        </header>

        {/* INJECTED ADMIN MANAGEMENT PANELS */}
        <main className="flex-1 p-4 mt-14 overflow-y-auto">
          <Outlet />
        </main>

        {/* SCROLL TO TOP BUTTON */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-[#f97316] text-white p-3.5 rounded-full shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:bg-orange-600 hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center animate-fadeIn"
            title="Scroll to Top"
          >
            <ChevronUp
              className="w-5 h-5"
              strokeWidth={3}
            />
            
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;