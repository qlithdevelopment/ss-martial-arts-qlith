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
import Trainers from "../pages/public/Trainers";
import About from "../pages/public/About";
import Programs from "../pages/public/Programs";
import Events from "../pages/public/Events";
import Services from "../pages/public/Services";
import Gallery from "../pages/public/Gallery";
import Testimonials from "../pages/public/Testimonials";
import Blog from "../pages/public/Blog";
import BlogDetail from "../pages/public/BlogDetail";
import ServiceDetail from "../pages/public/ServiceDetail";
import FAQ from "../pages/public/FAQ";
import Login from "../pages/public/Login";
import Contact from "../pages/public/Contact";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminGalleries from "../pages/admin/Galleries";
import AdminEvents from "../pages/admin/Events";

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
        <Route path="/trainers" element={<Trainers />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/events" element={<Events />} />
        <Route path="/services" element={<Services />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/login"
          element={
            !user ? (
              <Login />
            ) : user.role === "admin" ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <Navigate to="/student/dashboard" />
            )
          }
        />
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
      <Route
        path="/admin/galleries"
        element={
          user?.role === "admin" ? (
            <AdminLayout>
              <AdminGalleries />
            </AdminLayout>
          ) : user ? (
            <Navigate to="/unauthorized" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin/events"
        element={
          user?.role === "admin" ? (
            <AdminLayout>
              <AdminEvents />
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