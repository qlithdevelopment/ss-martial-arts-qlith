import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();

    navigate("/login");
  };

  return (
    <div className="w-64 min-h-screen bg-black text-white flex flex-col justify-between p-5">
      {/* TOP */}
      <div>
        <h1 className="text-3xl font-bold mb-10">
          Admin Panel
        </h1>

        {/* MENU */}
        <div className="flex flex-col gap-4">
          <Link
            to="/admin/dashboard"
            className="hover:text-gray-300 transition-all"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {/* BOTTOM */}
      <div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 transition-all text-white py-3 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;