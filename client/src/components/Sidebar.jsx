import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import fullLogo from "../assets/Full_Logo.png";

const Sidebar = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="w-72 min-h-screen bg-[#0a0f13] text-white flex flex-col justify-between p-6 border-r border-gray-800/50">
      {/* TOP */}
      <div>
        <div className="mb-12 -mt-2 px-2 flex justify-center items-center">
          <Link to="/" className="w-full max-w-[180px] hover:scale-105 transition-transform cursor-pointer">
            <img src={fullLogo} alt="Logo" className="w-full h-auto object-contain drop-shadow-xl" />
          </Link>
        </div>

        {/* MENU */}
        <div className="flex flex-col gap-3">
          <Link
            to="/admin/dashboard"
            onClick={onNavigate}
            className={`transition-all font-bold px-6 py-3.5 rounded-2xl ${path === '/admin/dashboard' ? 'bg-[var(--color-primary2)] text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/galleries"
            onClick={onNavigate}
            className={`transition-all font-bold px-6 py-3.5 rounded-2xl ${path === '/admin/galleries' ? 'bg-[var(--color-primary2)] text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            Galleries
          </Link>
          <Link
            to="/admin/events"
            onClick={onNavigate}
            className={`transition-all font-bold px-6 py-3.5 rounded-2xl ${path === '/admin/events' ? 'bg-[var(--color-primary2)] text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            Events
          </Link>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="w-full bg-[var(--color-primary2)] hover:opacity-80 transition-all text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-orange-500/20"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;