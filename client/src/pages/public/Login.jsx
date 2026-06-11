import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../assets/Logo_compress.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [loading, setLoading] = useState(false);

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
      const message = error?.response?.data?.message || error?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col md:flex-row font-sans">
      
      {/* LEFT SIDE: Simple & Aesthetic Brand Area */}
      <div className="w-full md:w-[45%] lg:w-[40%] min-h-[40vh] md:min-h-screen bg-[#0b1b24] p-8 md:p-12 lg:p-20 flex flex-col justify-between relative overflow-hidden">
        
        {/* Subtle Background Elements */}
        <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full bg-[#26c0ff] opacity-10 blur-[50px] md:blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#f97316] opacity-10 blur-[50px] md:blur-[100px]"></div>

        {/* Logo Area */}
        <div className="relative z-10 flex items-center gap-3">
          <Link to="/">
            <img src={Logo} alt="SS Martial Arts Logo" className="w-16 md:w-20 h-auto drop-shadow-lg" />
          </Link>
          <div className="flex flex-col">
            <span className="text-white font-black tracking-widest text-lg leading-tight">SS MARTIAL</span>
            <span className="text-[#26c0ff] font-bold tracking-[0.3em] text-xs">ARTS</span>
          </div>
        </div>

        {/* Inspirational Text */}
        <div className="relative z-10 mt-12 md:mt-0">
          <div className="w-12 h-1 bg-[#26c0ff] mb-6"></div>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tight uppercase">
            Master your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#26c0ff] to-[#f97316]">Mind & Body.</span>
          </h2>
          <p className="text-gray-400 font-medium mt-6 text-sm md:text-base max-w-sm leading-relaxed">
            Welcome back. Enter your credentials to access your dashboard, track your progress, and continue your martial arts journey with us.
          </p>
        </div>
        
        {/* Bottom copyright / aesthetic footer */}
        <div className="relative z-10 hidden md:block mt-12">
          <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">
            &copy; {new Date().getFullYear()} SS Martial Arts
          </p>
        </div>

      </div>

      {/* RIGHT SIDE: Clean Login Form */}
      <div className="w-full md:w-[55%] lg:w-[60%] min-h-[60vh] md:min-h-screen flex flex-col justify-center items-center px-6 py-12 md:px-12 lg:px-24 bg-white relative">
        
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-10 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-black text-[#26c0ff] mb-3 tracking-tight uppercase">
              Sign in
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Don't have an account? <Link to="/contact" className="text-[#26c0ff] font-bold hover:underline">Sign up</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#000000] text-[10px] font-bold uppercase tracking-widest pl-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#26c0ff]/5 border-2 border-[#26c0ff]/20 rounded-xl px-4 py-3.5 text-[#000000] font-medium text-sm placeholder-gray-300 focus:outline-none focus:bg-white focus:border-[#26c0ff] transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[#000000] text-[10px] font-bold uppercase tracking-widest pl-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#26c0ff]/5 border-2 border-[#26c0ff]/20 rounded-xl px-4 py-3.5 text-[#000000] font-medium text-sm placeholder-gray-300 focus:outline-none focus:bg-white focus:border-[#26c0ff] transition-all"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-[#26c0ff] hover:bg-[#0b1b24] transition-colors duration-300 text-white py-4 rounded-xl text-sm font-black uppercase tracking-[0.1em] disabled:opacity-70 shadow-lg"
            >
              {loading ? "Verifying..." : "Sign in to account"}
            </button>
            
          </form>
        </div>

      </div>

    </div>
  );
};

export default Login;