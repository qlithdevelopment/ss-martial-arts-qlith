import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";

const AdminLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:sticky lg:top-0 h-screen lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden shrink-0 flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-40">
          <h2 className="font-black text-xl tracking-tight text-[var(--color-primary)]">ADMIN PANEL</h2>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 bg-gray-50 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;