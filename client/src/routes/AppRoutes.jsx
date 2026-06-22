import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import StudentLayout from "../layouts/StudentLayout";

import Home from "../pages/public/Home";
import Trainers from "../pages/public/Trainers";
import About from "../pages/public/About";
import Programs from "../pages/public/Programs";
import Events from "../pages/public/Events";
import Services from "../pages/public/Services";
import Gallery from "../pages/public/Gallery";
import Testimonials from "../pages/public/Testimonials";
import FAQ from "../pages/public/FAQ";
import Login from "../pages/public/Login";
import Contact from "../pages/public/Contact";
import Blog from "../pages/public/Blog";

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";
import AdminBlogs from "../pages/admin/Blogs";
import AdminEvents from "../pages/admin/Events";
import AdminGalleries from "../pages/admin/Galleries";

// Student Pages
import StudentDashboard from "../pages/student/Dashboard";

import Unauthorized from "../pages/errors/Unauthorized";
import NotFound from "../pages/errors/NotFound";
import Loader from "../components/Loader";
import BlogDetail from "../pages/public/BlogDetail";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  // Helper component/function to handle logged-in users visiting /login
  const RedirectIfAuthenticated = () => {
    if (user) {
      if (user.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      }
      if (user.role === "student") {
        return <Navigate to="/student/dashboard" replace />;
      }
    }
    return <Login />;
  };

  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/events" element={<Events />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/services" element={<Services />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />

        {/* Always keep the route declared, but handle the redirection logically */}
        <Route path="/login" element={<RedirectIfAuthenticated />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route
        element={
          user?.role === "admin" ? (
            <AdminLayout>
              <Outlet />
            </AdminLayout>
          ) : user ? (
            <Navigate to="/unauthorized" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/blogs" element={<AdminBlogs />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/galleries" element={<AdminGalleries />} />
      </Route>

      {/* STUDENT */}
      <Route
        path="/student/dashboard"
        element={
          user?.role === "student" ? (
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          ) : user ? (
            <Navigate to="/unauthorized" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;