import { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ChevronUp, Clock3, RefreshCw } from "lucide-react";
import PasswordResetModal from "../components/PasswordResetModal";
import api from "../api/axios";
import MaintenanceAlertBanner from "../components/admin/MaintenanceAlertBanner";

const AdminLayout = () => {
  const [time, setTime] = useState(new Date());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 768);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const STORAGE_LIMIT_MB = 500;

  const [storageUsage, setStorageUsage] = useState({
    total_size_mb: 0,
  });

  const [storageLoading, setStorageLoading] = useState(true);

  const fetchStorageUsage = useCallback(async () => {
    setStorageLoading(true);

    const startTime = Date.now();

    try {
      const response = await api.get("/storage-usage");

      if (response.data.status) {
        setStorageUsage({
          total_size_mb: Number(response.data.data.total_size_mb || 0),
        });
      }
    } catch (error) {
      console.error("Failed to fetch storage usage:", error);
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 800 - elapsedTime);

      setTimeout(() => {
        setStorageLoading(false);
      }, remainingTime);
    }
  }, []);

  useEffect(() => {
    fetchStorageUsage();
  }, [fetchStorageUsage]);

  const storageUsedMB = storageUsage.total_size_mb;
  const storagePercentage = Math.min(
    (storageUsedMB / STORAGE_LIMIT_MB) * 100,
    100,
  );

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
      
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

      {/* VIEWPORT ACTION FRAME */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* STREAMLINED FIXED HEADER */}
        <header
          className="fixed top-0 right-0 left-0 md:left-auto md:w-[calc(100%-16.5rem)] data-[collapsed=true]:md:w-[calc(100%-5rem)] h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-30 transition-all duration-300"
          data-collapsed={isSidebarCollapsed}
        >
               
          
         
          {/* LEFT SIDE: Identity Badge */}
          <div className="flex items-center gap-3 pl-12 md:pl-0">
            <div className="flex items-center gap-2">
             
              <div className="w-2 h-2 hidden md:flex rounded-full bg-primary animate-pulse" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-700">
                Administrator
              </span>
          </div> 

            {/* Storage Usage */}
            <div className="hidden sm:flex items-center gap-2 border-l border-gray-200 pl-3">
              <div className="flex flex-col gap-1 min-w-[110px]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] sm:text-xs font-semibold text-gray-500">
                    {storageLoading
                      ? "Storage..."
                      // : `${storageUsedMB.toFixed(2)} / ${STORAGE_LIMIT_MB} MB`}
                      : ``}
                  </span>

                  {!storageLoading && (
                    <span
                      className={`text-[10px] sm:text-xs font-bold ${
                        storagePercentage >= 90
                          ? "text-red-600"
                          : "text-primary"
                      }`}
                    >
                      {storagePercentage.toFixed(1)}%
                    </span>
                  )}
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      storagePercentage >= 90 ? "bg-red-500" : "bg-primary"
                    }`}
                    style={{ width: `${storagePercentage}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={fetchStorageUsage}
                disabled={storageLoading}
                title="Refresh storage usage"
                aria-label="Refresh storage usage"
                className="p-1 rounded-md text-orange-500 hover:text-orange-600 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={storageLoading ? "animate-spin" : ""}
                />
              </button>
            </div>
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

        <main className="flex-1 p-4 mt-14 overflow-y-auto">
          <MaintenanceAlertBanner/>
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