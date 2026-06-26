import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  User, Phone, Mail, MapPin, Calendar, Shield, BookOpen,
  Award, CreditCard, LogOut, Sun, Moon,
  CheckCircle2, Clock, AlertCircle, Lock, TrendingUp,
  Download, Star, Dumbbell, Sparkles, Menu, X, GraduationCap, FileText,
} from "lucide-react";
import axiosInstance from "../../api/axios.js";
import toast from "react-hot-toast";

// ── API helpers ───────────────────────────────────────────────────────────────
export const getStudent = async (id) => {
  const res = await axiosInstance.get(`/students/${id}`);
  return res.data.data || res.data;
};

export const getMyBatch = async () => {
  const res = await axiosInstance.get("/student/my-batch");
  return res.data;
};

// ─── Static / not-yet-from-API data ──────────────────────────────────────────
const TABS = [
  { key: "Batch", label: "Batch", icon: <BookOpen size={15} /> },
  { key: "Fees", label: "Fees", icon: <CreditCard size={15} /> },
  { key: "Belt", label: "Belt", icon: <Award size={15} /> },
  { key: "Certs", label: "Certificates", icon: <FileText size={15} /> },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const getBeltColor = (belt) => {
  if (!belt) return { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", border: "border-slate-200 dark:border-slate-700" };
  const b = belt.toLowerCase();
  if (b.includes("white")) return { bg: "bg-slate-50 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-200", border: "border-slate-200 dark:border-slate-700" };
  if (b.includes("yellow")) return { bg: "bg-[#FEF3C7] dark:bg-[#451A03]/40", text: "text-[#B45309] dark:text-[#FDE68A]", border: "border-amber-200 dark:border-amber-900/50" };
  if (b.includes("orange")) return { bg: "bg-[#FFEDD5] dark:bg-[#7C2D12]/40", text: "text-[#C2410C] dark:text-[#FED7AA]", border: "border-orange-200 dark:border-orange-900/50" };
  if (b.includes("green")) return { bg: "bg-[#D1FAE5] dark:bg-[#064E3B]/40", text: "text-[#047857] dark:text-[#A7F3D0]", border: "border-emerald-200 dark:border-emerald-900/50" };
  if (b.includes("blue")) return { bg: "bg-[#DBEAFE] dark:bg-[#1E3A8A]/40", text: "text-[#1D4ED8] dark:text-[#BFDBFE]", border: "border-blue-200 dark:border-blue-900/50" };
  if (b.includes("purple")) return { bg: "bg-[#F3E8FF] dark:bg-[#581C87]/40", text: "text-[#7E22CE] dark:text-[#E9D5FF]", border: "border-purple-200 dark:border-purple-900/50" };
  if (b.includes("brown")) return { bg: "bg-[#F5E6D3] dark:bg-[#3E2723]/60", text: "text-[#5C4033] dark:text-[#D7CCC8]", border: "border-stone-200 dark:border-stone-800" };
  if (b.includes("red")) return { bg: "bg-[#FEE2E2] dark:bg-[#7F1D1D]/40", text: "text-[#B91C1C] dark:text-[#FECACA]", border: "border-rose-200 dark:border-rose-900/50" };
  if (b.includes("black")) return { bg: "bg-[#1E293B] dark:bg-[#020617]", text: "text-white dark:text-slate-200", border: "border-slate-700 dark:border-slate-800" };
  return { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", border: "border-slate-200 dark:border-slate-700" };
};

const fmt = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : null;

const fmtCurrency = (val) =>
  val != null ? `₹${Number(val).toLocaleString("en-IN")}` : null;

// ─── Sub-components ───────────────────────────────────────────────────────────
function Chip({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide ${className}`}>
      {children}
    </span>
  );
}

function NoData() {
  return <span className="text-slate-300 dark:text-slate-600 italic">No data</span>;
}

function ProgressBar({ value, color = "bg-indigo-500" }) {
  return (
    <div className="flex items-center gap-3 mt-3">
      <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ease-out ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[11px] font-bold text-slate-400 tabular-nums min-w-[30px] text-right">{value}%</span>
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value, valueClass = "" }) {
  return (
    <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800/50">
      <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</p>
        <p className={`text-xs font-semibold text-slate-700 dark:text-slate-200 truncate mt-0.5 ${valueClass}`}>
          {value ?? <NoData />}
        </p>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <Card className="p-6 sm:p-8 animate-pulse">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-28 h-28 rounded-2xl bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
        <div className="flex-1 w-full space-y-3">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-48" />
          <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-64" />
          <div className="flex gap-2 mt-2">
            <div className="h-7 w-24 bg-slate-100 dark:bg-slate-700 rounded-lg" />
            <div className="h-7 w-32 bg-slate-100 dark:bg-slate-700 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        ))}
      </div>
    </Card>
  );
}

// ─── Tab: Batch Info ──────────────────────────────────────────────────────────
// Filled from API: name, notes, date, enddate, status, total_fee
// No data from API: instructor, schedule, course type, enrolled students count
function BatchTab({ batch }) {
  if (!batch) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-slate-400">No batch information available.</p>
      </Card>
    );
  }

  const isActive = batch.status === "active";
  const startDate = fmt(batch.date);
  const endDate = fmt(batch.enddate);

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <BookOpen size={20} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-base font-black text-slate-800 dark:text-slate-100">{batch.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">Batch ID: #{batch.id}</p>
            </div>
          </div>
          <Chip className={isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${isActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            {batch.status ? batch.status.charAt(0).toUpperCase() + batch.status.slice(1) : "Unknown"}
          </Chip>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoRow icon={<Calendar size={14} />} label="Start Date" value={startDate} />
          <InfoRow icon={<Calendar size={14} />} label="End Date" value={endDate} />
        </div>

        {batch.notes && (
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-100 dark:border-slate-800/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Notes</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{batch.notes}</p>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── Tab: Fees ────────────────────────────────────────────────────────────────
// Filled from API: total_fee, total_paid, pending_amount (via ledger_summary)
// Filled from API: payment_history array (currently empty [] from API)
// No data from API: individual payment descriptions, due dates, fee breakdown
function FeesTab({ student }) {
  const ledger = student?.ledger_summary ?? {};
  const totalFee = fmtCurrency(ledger.total_fee);

  return (
    <div className="space-y-6">
      <Card className="p-6 border-l-4 border-l-emerald-500">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <CreditCard size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-0.5">Student Fee</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">Monthly Fee: {totalFee ?? <NoData />}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Tab: Belt ────────────────────────────────────────────────────────────────
function BeltTab({ student }) {
  const beltInfo = getBeltColor(student?.belt);

  return (
    <div className="space-y-6">
      <Card className={`p-6 border-l-4 ${beltInfo.border}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl ${beltInfo.bg} ${beltInfo.text} ${beltInfo.border} border flex items-center justify-center flex-shrink-0 shadow-sm`}>
            <Award size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-0.5">Belt Details</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{student?.belt || 'Unranked'}</p>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Assigned by Dojo Admin. This is your officially recognized rank within the martial arts academy.
          </p>
        </div>
      </Card>
    </div>
  );
}


// ─── Tab: Certificates ────────────────────────────────────────────────────────
function CertsTab() {
  const { user } = useAuth();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCertUrl, setSelectedCertUrl] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    const fetchCerts = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/users/${user.id}/certificates`);
        const data = res.data?.data || res.data || [];
        setCerts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load certificates.");
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, [user?.id]);

  if (loading) {
    return (
      <Card className="p-8 text-center flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-500 text-sm font-semibold">{error}</p>
      </Card>
    );
  }

  if (certs.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-3">
          <Award size={22} className="text-indigo-400" />
        </div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No certificates available</p>
        <p className="text-xs text-slate-400 mt-1">You haven't been awarded any certificates yet.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {certs.map(cert => {
        // Fix relative image paths to load from Laravel backend if needed
        let fileUrl = null;
        if (cert.certificated && cert.certificated.length > 0) {
            fileUrl = cert.certificated[0];
            if (typeof fileUrl === 'string' && !fileUrl.startsWith('http')) {
                // Ensure we hit the Laravel server
                fileUrl = `http://127.0.0.1:8000${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
            }
        } else if (cert.file_url) {
            fileUrl = cert.file_url;
        }
          
        return (
          <div key={cert.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm group">
            <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-800 relative flex justify-center items-center overflow-hidden">
              {fileUrl ? (
                fileUrl.toLowerCase().endsWith('.pdf') ? (
                  <div className="w-full h-full flex flex-col gap-2 items-center justify-center bg-slate-200 dark:bg-slate-700 group-hover:scale-105 transition-transform cursor-pointer" onClick={() => setSelectedCertUrl(fileUrl)}>
                    <Award size={24} className="text-red-500" />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">PDF</span>
                  </div>
                ) : (
                  <img src={fileUrl} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform cursor-pointer" onClick={() => setSelectedCertUrl(fileUrl)} />
                )
              ) : (
                <Award size={32} className="text-slate-300 dark:text-slate-700" />
              )}
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate pr-2" title={cert.title}>{cert.title}</p>
              {fileUrl && (
                <button onClick={() => setSelectedCertUrl(fileUrl)} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors shrink-0">
                  View
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Certificate Modal */}
      {selectedCertUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedCertUrl(null)}>
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="absolute top-4 right-4 z-10">
              <button onClick={() => setSelectedCertUrl(null)} className="p-2 bg-white/80 dark:bg-black/50 text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-black rounded-full transition-colors backdrop-blur-md">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto flex justify-center items-center bg-slate-100/50 dark:bg-slate-900/50 p-2 sm:p-6 min-h-[50vh]">
              {selectedCertUrl?.toLowerCase().endsWith('.pdf') ? (
                <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 shrink-0">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Download size={14} /> PDF Document
                    </span>
                    <a 
                      href={selectedCertUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
                    >
                      Open / Download PDF
                    </a>
                  </div>
                  <iframe src={selectedCertUrl} className="w-full flex-1 min-h-[70vh] bg-gray-100" title="Certificate PDF" />
                </div>
              ) : (
                <img src={selectedCertUrl} alt="Certificate Full View" className="max-w-full max-h-[80vh] object-contain shadow-sm rounded-lg" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const TAB_COMPONENTS = {
  Batch: BatchTab,
  Fees: FeesTab,
  Belt: BeltTab,
  Certs: CertsTab,
};



// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const { logout, user } = useAuth();

  const [activeTab, setActiveTab] = useState("Batch");
  const [showLogoutConfirm, setShowLogout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [student, setStudent] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState(null);

  const [batch, setBatch] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState(null);

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // ── fetch student ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return;
    const fetchStudent = async () => {
      try {
        setStudentLoading(true);
        setStudentError(null);
        const data = await getStudent(user.id);
        setStudent(data);
        // If batch is nested in student response, use it directly
        if (data?.batch) setBatch(data.batch);
      } catch (err) {
        setStudentError(err.response?.data?.message || "Failed to load your profile.");
      } finally {
        setStudentLoading(false);
      }
    };
    fetchStudent();
  }, [user?.id]);

  // ── fetch batch (only if not already in student response) ─────────────────
  useEffect(() => {
    if (batch) return; // already populated from student response
    const fetchMyBatch = async () => {
      try {
        setBatchLoading(true);
        const data = await getMyBatch();
        setBatch(data);
      } catch (err) {
        setBatchError(err.response?.data?.message || "Failed to load batch details.");
      } finally {
        setBatchLoading(false);
      }
    };
    fetchMyBatch();
  }, [batch]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleLogoutAction = async () => {
    try { await logout(); setShowLogout(false); }
    catch (err) { console.error("Logout error:", err); }
  };

  // ── Derived display values — all from API ──────────────────────────────────
  // FROM API ✅
  const displayName = student?.name ?? null;
  const displayEmail = student?.email ?? null;
  const displayStatus = student ? ((String(student.status) === '1' || student.status === true || String(student.status).toLowerCase() === 'active' || student.status === 'true') ? "Active" : "Inactive") : null;
  const displayJoined = fmt(student?.created_at);
  const displayId = student?.id ?? null;
  const displayNotes = student?.notes ?? null;

  // FROM API ✅
  const ledger = student?.ledger_summary ?? {};
  const displayPaid = fmtCurrency(ledger.total_paid);
  const displayPending = fmtCurrency(ledger.pending_amount);
  const displayFee = fmtCurrency(ledger.total_fee);
  const displayBelt = student?.belt || 'Unranked';

  const TabComponent = TAB_COMPONENTS[activeTab];

  // NOT IN API ❌ — these fields don't come from /students/{id}
  const displayPhone = null;   // no phone field in API response
  const displayAltPhone = null;   // no alt_phone field in API response
  const displayCity = null;   // no city/address field
  const displayDob = null;   // no dob field
  const displayGuardian = null;   // no guardian/parent field
  const displayAvatar = null;   // no photo/avatar field




  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">

      {/* ── Logout Modal ── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
              <LogOut size={26} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100">Sign out?</h3>
              <p className="text-sm text-slate-400 mt-1">You'll be redirected to the login page.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowLogout(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors">Cancel</button>
              <button onClick={handleLogoutAction} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors shadow-md">Sign Out</button>
            </div>
          </Card>
        </div>
      )}

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
              <Dumbbell size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-black tracking-tight text-slate-800 dark:text-slate-100 leading-none">{displayName || "Student Portal"}</p>
              <p className="text-[10px] text-slate-400 tracking-wide">Student Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsDark(!isDark)} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={() => setShowLogout(true)} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-bold transition-colors">
              <LogOut size={15} /> Sign Out
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
            <button onClick={() => { setShowLogout(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 font-bold text-sm">
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Profile Card ── */}
        {studentLoading ? <ProfileSkeleton /> : studentError ? (
          <Card className="p-6 flex items-center gap-3 border-red-100 dark:border-red-900/30">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-500">{studentError}</p>
          </Card>
        ) : (
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

              {/* Avatar — no photo in API, always shows initial */}
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-3xl font-black text-white">
                  {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  {/* FROM API */}
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                    {displayName ?? <NoData />}
                  </h1>
                  {displayStatus && (
                    <Chip className={`mx-auto sm:mx-0 ${
                      displayStatus === "Active" 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                        displayStatus === "Active" 
                          ? "bg-emerald-500 animate-pulse" 
                          : "bg-red-500"
                      }`} />
                      {displayStatus}
                    </Chip>
                  )}
                </div>

                {/* FROM API */}
                <p className="text-xs text-slate-400 mb-1 font-medium">
                  ID: {displayId ?? "—"} · Joined {displayJoined ?? "—"}
                </p>

                {/* Batch name — FROM API */}
                {batchLoading && <p className="text-xs text-slate-400 mb-2 animate-pulse">Loading batch…</p>}
                {batchError && <p className="text-xs text-red-400 mb-2">{batchError}</p>}
                {batch?.name && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    Batch: <span className="font-bold text-slate-700 dark:text-slate-200">{batch.name}</span>
                  </p>
                )}

                {/* Student notes — FROM API */}
                {/* {displayNotes && (
                  <p className="text-xs text-slate-400 italic mb-3">"{displayNotes}"</p>
                )} */}

                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <Chip className={`${getBeltColor(student?.belt).bg} ${getBeltColor(student?.belt).text} px-3 py-1.5 text-xs shadow-sm`}>
                    <Award size={12} />
                    {student?.belt || 'Unranked'}
                  </Chip>
                  <Chip className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 text-xs shadow-sm">
                    <BookOpen size={12} />
                    {batch?.name ?? "No batch"}
                  </Chip>
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 max-w-lg">
              <InfoRow icon={<Mail size={14} />} label="Email" value={displayEmail} valueClass="text-indigo-500 dark:text-indigo-400" />
              <InfoRow icon={<Calendar size={14} />} label="Joined" value={displayJoined} />
            </div>
          </Card>
        )}

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              label: "Total Batch Fee", value: displayFee,     // FROM API ✅
              valueClass: "text-slate-800 dark:text-slate-100",
              icon: <CreditCard size={18} />, iconClass: "bg-slate-100 dark:bg-slate-800 text-slate-500",
            },
            {
              label: "Total Paid", value: displayPaid,    // FROM API ✅
              valueClass: "text-emerald-500",
              icon: <CheckCircle2 size={18} />, iconClass: "bg-emerald-500/10 text-emerald-500",
            },
            {
              label: "Pending Dues", value: displayPending,  // FROM API ✅
              valueClass: "text-red-500",
              icon: <AlertCircle size={18} />, iconClass: "bg-red-500/10 text-red-500",
            },
          ].map((s) => (
            <Card key={s.label} className="p-5 hover:shadow-md transition-shadow">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.iconClass}`}>
                {s.icon}
              </div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-xl font-black ${s.valueClass}`}>{s.value ?? <NoData />}</p>
            </Card>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="space-y-5">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${activeTab === tab.key
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                  : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
              >
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>

          {/* Pass real data down into each tab */}
          {activeTab === "Batch" && <BatchTab batch={batch} />}
          {activeTab === "Fees" && <FeesTab student={student} />}
          {activeTab === "Belt" && <BeltTab student={student} />}
          {activeTab === "Certs" && <CertsTab />}
        </div>
      </main>
    </div>
  );
}