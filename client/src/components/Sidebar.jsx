import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from '../assets/logo/Logo_compress.png';
import { toast } from "react-hot-toast";
import { ArrowLeft, MessageSquareQuote, FileText, LogOut, Handshake, ChevronDown, ChevronsRight, ChevronsLeft, Menu, X, House, Newspaper, CalendarDays, Image, Users, CircleHelp, GraduationCap, Mail,Phone } from "lucide-react";
import ConfirmModal from "../components/admin/reusecomponents/ConfirmationModal";
const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isStudentsOpen, setIsStudentsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  // Runs when the user confirms inside the modal
  const handleLogoutConfirm = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      setIsLogoutModalOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  
  // Automatically close sidebar panel when navigating on mobile viewports
  const handleItemClick = () => {
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  };

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: (
        <House className="w-5 h-5 shrink-0" strokeWidth={1.5} />
        
      )
    },
    {
      path: "/admin/blogs",
      label: "Blogs",
      icon: (
        <Newspaper
          className="w-5 h-5 shrink-0"
          strokeWidth={1.5}
        />
        
      )
    },
    {
      path: "/admin/events",
      label: "Events",
      icon: (
        <CalendarDays
          className="w-5 h-5 shrink-0"
          strokeWidth={1.5}
        />
        
      )
    },
    {
      path: "/admin/galleries",
      label: "Galleries",
      icon: (
        <Image
          className="w-5 h-5 shrink-0"
          strokeWidth={1.5}
        />
       
      )
    },
    {
      path: "/admin/trainers",
      label: "Trainers",
      icon: (
        <Users
          className="w-5 h-5 shrink-0"
          strokeWidth={1.5}
        />
        
      )
    },
    {
      path: "/admin/faqs",
      label: "FAQs",
      icon: (
        <CircleHelp
          className="w-5 h-5 shrink-0"
          strokeWidth={1.5}
        />
        
      )
    },    
    {
      path: "/admin/students",
      label: "Students",
      icon: (
        <GraduationCap
          className="w-5 h-5 shrink-0"
          strokeWidth={1.5}
        />

        
      )
    },
    {
      path: "/admin/contacts",
      label: "Contacts",
      icon: (
        <Phone
          className="w-5 h-5 shrink-0"
          strokeWidth={1.5}
        />
       
      )
    },
    {
      path: "/admin/affiliations",
      label: "Affiliations",
      icon: (
        <Handshake
          className="w-5 h-5 shrink-0"
          strokeWidth={1.5}
        />
       
      )
    },
    {
      path: "/admin/testimonials",
      label: "Testimonials",
      icon: (
        <MessageSquareQuote
          className="w-5 h-5 shrink-0"
          strokeWidth={1.5}
        />
       
      )
    },
    {
      path: "/admin/news",
      label: "News",
      icon: (
        <FileText
          className="w-5 h-5 shrink-0"
          strokeWidth={1.5}
        />
       
      )
    },
  ];

  const linkStyles = ({ isActive }) =>
    `flex items-center gap-4 py-3 px-3.5 rounded-xl font-medium transition-all ${isActive
      ? "bg-primary text-white shadow-md shadow-primary/20"
      : "text-gray-600 hover:bg-gray-50 hover:text-primary"
    }`;

  return (
    <>
      {/* MOBILE TRIGGER ACTION HEAD BUTTON */}
      <div className="md:hidden fixed top-0 left-0 h-16 flex items-center px-4 z-40">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:text-primary transition-colors shadow-xs"
        >
          {isCollapsed ? (

            <Menu className="w-6 h-6" strokeWidth={1.5} />

          ) : (
            <X className="w-6 h-6 " strokeWidth={1.5} />

          )}
        </button>
      </div>

      {/* SIDEBAR MAIN NAV ASIDE CONTAINER */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-40 md:sticky md:top-0
          bg-white border-r border-gray-200 p-4 flex flex-col justify-between transition-all duration-300
          ${isCollapsed ? "-translate-x-full md:translate-x-0 md:w-20" : "translate-x-0 w-66"}
          h-screen pt-0 md:pt-0
        `}
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* BRAND LOGO CONSOLE ZONE */}
          <div className="flex items-center justify-between mt-4 mb-6 px-2 h-12 border-b border-primary2/20 pb-4">
            <Link to="/" className="flex items-center gap-3 overflow-hidden group">
              {/* Dynamic Compressed Image Wrap Box */}
              <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white shadow-sm shrink-0 p-1.5 overflow-hidden border border-gray-100 group-hover:border-[#f97316] transition-colors">
                <img src={Logo} alt="SSMA Logo" className="w-full h-full object-contain" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col tracking-tight animate-fadeIn whitespace-nowrap group-hover:text-[#f97316] transition-colors">
                  <span className="text-sm font-extrabold text-gray-800 leading-tight group-hover:text-[#f97316] transition-colors">SS Martial Arts</span>
                  <span className="text-[10px] font-semibold uppercase text-secondary tracking-widest">School</span>
                </div>
              )}
            </Link>

            {/* Desktop-only internal dynamic compression chevron arrow button toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#f97316] hover:bg-orange-50 hover:border-orange-200 transition-all shadow-sm hover:shadow ml-auto"
            >
              {isCollapsed ? (
                <ChevronsRight className="w-5 h-4" strokeWidth={2} />
              ) : (
                <ChevronsLeft className="w-5 h-4" strokeWidth={2} />
              )}
            </button>
          </div>

          {/* DYNAMIC NAVIGATION LINKS */}
          <nav className="flex-1 overflow-y-auto scrollbar-track-transparent custom-scrollbar pr-0 pb-4 flex flex-col gap-1.5">
            {menuItems.map((item) => (
              item.children ? (
                <div key={item.label} className="flex flex-col">
                  <div
                    onClick={() => {
                      setIsStudentsOpen(!isStudentsOpen);
                      if (isCollapsed) setIsCollapsed(false);
                    }}
                    className={`flex items-center justify-between gap-4 py-3 px-4 rounded-xl font-medium transition-all cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-primary ${isStudentsOpen && !isCollapsed ? 'bg-orange-50/50 text-[#f97316]' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      {item.icon}
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!isCollapsed && (

                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isStudentsOpen ? "rotate-180 text-[#f97316]" : ""
                          }`}
                        strokeWidth={2}
                      />
                    )}
                  </div>

                  {isStudentsOpen && !isCollapsed && (
                    <div className="flex flex-col gap-1 mt-1 ml-6 border-l-2 border-orange-100 pl-2">
                      {item.children.map(child => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) => `flex items-center gap-4 py-2 px-3 rounded-lg font-medium transition-all text-sm ${isActive ? "bg-[#f97316] text-white shadow shadow-orange-500/20" : "text-gray-500 hover:bg-orange-50 hover:text-[#f97316]"}`}
                          onClick={handleItemClick}
                        >
                          <span className="truncate">{child.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={linkStyles}
                  onClick={handleItemClick}
                >
                  {item.icon}
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              )
            ))}
          </nav>
        </div>

        {/* LOGOUT CORE MANAGEMENT BLOCK */}
        <div className="shrink-0 pt-4 mt-auto">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-4 py-3 cursor-pointer px-4 rounded-xl font-bold transition-all bg-orange-500 text-white hover:bg-orange-600 shadow-sm
              ${isCollapsed ? "justify-center px-0" : ""}
            `}
          >

            <LogOut className="w-5 h-5 shrink-0" strokeWidth={1.5} />
            {!isCollapsed && <span className="truncate">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE DIMMER DROP BACKDROP OVERLAY SCREEN */}
      {!isCollapsed && (
        <div
          onClick={() => setIsCollapsed(true)}
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-xs z-30 md:hidden"
        />
      )}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Sign Out?"
        message="Are you sure you want to end your session?"
        type="logout"
        isLoading={isLoggingOut}
      />
    </>
  );
};

export default Sidebar;