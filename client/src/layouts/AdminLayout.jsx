import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ChevronUp, Clock3 } from "lucide-react";
import PasswordResetModal from "../components/PasswordResetModal";

const AdminLayout = () => {
  const [time, setTime] = useState(new Date());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 768);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
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
    <div className="flex min-h-screen bg-white text-gray-800">
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
            <div className="w-2 h-2 hidden md:flex rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-bold uppercase tracking-wider text-gray-700">
              Administrator
            </span>
          </div>

          {/* RIGHT SIDE: Dynamic Digital Clock */}
          <div className="flex items-center gap-2 py-1.5 px-3 rounded-xl">

            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className=" flex-1 sm:flex-none px-3 lg:px-5 py-1 lg:py-3 bg-primary2 hover:bg-orange-600 text-white text-[8px] md:text-sm font-bold rounded-md lg:rounded-xl flex items-center justify-center gap-1 transition-all shadow-md shadow-[#f97316]/20 shrink-0"
            >
             <span className="hidden md:flex">Reset</span>Password
            </button>

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
        
      </div>
      <PasswordResetModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => { "Password Reset Sucessfully"}}
      />
    </div>
  );
};

export default AdminLayout;