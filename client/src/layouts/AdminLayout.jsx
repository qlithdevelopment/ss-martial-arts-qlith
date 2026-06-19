import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => {
  const [time, setTime] = useState(new Date());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Synchronize live clock ticker
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-secondary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-mono font-bold text-gray-600">
              {time.toLocaleTimeString()}
            </span>
          </div>
        </header>

        {/* INJECTED ADMIN MANAGEMENT PANELS */}
        <main className="flex-1 p-6 mt-16 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;