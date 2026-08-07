import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../../assets/logo/Full_Logo.png";
import loginbg from "../../assets/loginbg1.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const silhouetteImg = loginbg;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let loadingToast;
    try {
      setLoading(true);
      loadingToast = toast.loading("Logging in...");

      const user = await login(formData);

      toast.dismiss(loadingToast);
      toast.success("Login successful");

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error) {
      toast.dismiss(loadingToast);

      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen relative flex flex-col md:flex-row font-sans overflow-x-hidden text-white">
      {/* BACKGROUND IMAGE / SILHOUETTE LAYER */}
      <div className="absolute inset-0 z-0">
        <img
          src={silhouetteImg}
          alt="Background"
          className="w-full h-full object-cover object-center contrast-125"
        />
      </div>

      {/* LEFT SIDE: Subtle Visual Area (Desktop Only) */}
      <div className="hidden md:flex md:w-1/2 min-h-screen relative z-10 border-r border-white/10" />

      {/* RIGHT SIDE: Dark Glassmorphic Form Container */}
      <div className="w-full md:w-1/2 min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 py-8 md:px-12 lg:px-24 bg-black/40 backdrop-blur-md relative z-10">
        <div className="w-full max-w-sm sm:max-w-md my-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-10 text-center">
            <Link to="/">
              <img src={Logo} alt="Logo" className="h-20 sm:h-28 md:h-32 m-auto object-contain" />
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal text-white mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-normal">
              Please enter your credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
            {/* E-mail / Registration Input */}
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label className="text-white text-xs sm:text-sm font-medium">Registration Number</label>
              <input
                name="email"
                required
                placeholder="Enter your registration number"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-600 focus:border-white py-2 text-white text-sm placeholder-gray-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5 sm:gap-2 relative">
              <label className="text-white text-xs sm:text-sm font-medium">Password</label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-600 focus:border-white py-2 pr-10 text-white text-sm placeholder-gray-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 sm:mt-4 bg-primary2 hover:bg-primary2/80 border border-white/20 text-white py-3 sm:py-3.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;