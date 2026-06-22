import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from '../assets/Logo_compress.png';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    { 
      path: "/admin/blogs", 
      label: "Blogs",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
        </svg>
      )
    },
    { 
      path: "/admin/events", 
      label: "Events",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
        </svg>
      )
    },
    { 
      path: "/admin/galleries", 
      label: "Galleries",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      )
    },
  ];

  const linkStyles = ({ isActive }) =>
    `flex items-center gap-4 py-3 px-4 rounded-xl font-medium transition-all ${
      isActive
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>

      {/* SIDEBAR MAIN NAV ASIDE CONTAINER */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-40 md:sticky md:top-0
          bg-white border-r border-gray-200 p-4 flex flex-col justify-between transition-all duration-300
          ${isCollapsed ? "-translate-x-full md:translate-x-0 md:w-20" : "translate-x-0 w-66"}
          h-screen pt-16 md:pt-4
        `}
      >
        <div>
          {/* BRAND LOGO CONSOLE ZONE */}
          <div className="flex items-center justify-between mb-6 px-2 h-12 border-b border-primary2/20 pb-4">
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5M4.5 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7-7 7-7m-14 14l-7-7 7-7" />
                </svg>
              )}
            </button>
          </div>

          {/* DYNAMIC NAVIGATION LINKS */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className={linkStyles}
                onClick={handleItemClick}
              >
                {item.icon}
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* LOGOUT CORE MANAGEMENT BLOCK */}
        <div>
          <button
            onClick={handleLogout}
            className={`
              w-full bg-primary2 hover:opacity-95 transition-all text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-xs
              ${isCollapsed ? "px-0" : "px-4"}
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            {!isCollapsed && <span>Sign Out</span>}
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
    </>
  );
};

export default Sidebar;