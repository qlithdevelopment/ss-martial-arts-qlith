import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import StudentLayout from "../layouts/StudentLayout";

import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Login from "../pages/public/Login";

import AdminDashboard from "../pages/admin/Dashboard";

import StudentDashboard from "../pages/student/Dashboard";

import Unauthorized from "../pages/errors/Unauthorized";

import NotFound from "../pages/errors/NotFound";

import Loader from "../components/Loader";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        {!user && (
          <Route
            path="/login"
            element={<Login />}
          />
        )}
      </Route>

      {/* ADMIN */}
      <Route
        path="/admin/dashboard"
        element={
          user?.role === "admin" ? (
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          ) : user ? (
            <Navigate to="/unauthorized" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* STUDENT */}
      <Route
        path="/student/dashboard"
        element={
          user?.role === "student" ? (
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          ) : user ? (
            <Navigate to="/unauthorized" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;