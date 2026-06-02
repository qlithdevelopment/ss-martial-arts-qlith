import { useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // VALIDATION
  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error("Email is required");

      return false;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required");

      return false;
    }

    if (formData.password.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );

      return false;
    }

    return true;
  };

  // LOGIN SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    let loadingToast;

    try {
      setLoading(true);

      // LOADING TOAST
      loadingToast = toast.loading(
        "Logging in..."
      );

      // LOGIN API
      const user = await login(formData);

      console.log("Logged User:", user);

      // REMOVE LOADING
      toast.dismiss(loadingToast);

      // SUCCESS TOAST
      toast.success("Login successful");

      // ROLE BASED REDIRECT
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error) {
      console.log(error);

      // REMOVE LOADING
      toast.dismiss(loadingToast);

      // BACKEND ERROR MESSAGE
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-8 text-center">
          Login
        </h1>

        {/* EMAIL */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-black"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-black"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-gray-800 transition-all text-white py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading
            ? "Please wait..."
            : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;