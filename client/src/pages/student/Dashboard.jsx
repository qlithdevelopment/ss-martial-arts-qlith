import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import {
  User, LogOut, Sun, Moon, AlertCircle, Award, BookOpen,
  Menu, X, FileText,
} from "lucide-react";
import axiosInstance from "../../api/axios.js";
import { getBeltColor } from "../../components/CommonFormats.js";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo_low.png";

import { Card, Chip, NoData, ProfileSkeleton, fmt } from "../../components/student/common";
import ProfileTab from "../../components/student/Profile.jsx";
import BatchTab from "../../components/student/Batch.jsx";
import BeltTab from "../../components/student/Belt.jsx";
import CertsTab from "../../components/student/Achievement.jsx";

export const getStudent = async (id) => {
  const res = await axiosInstance.get(`/students/${id}`);
  return res.data.data || res.data;
};

export const getMyBatch = async () => {
  const res = await axiosInstance.get("/student/my-batch");
  return res.data;
};

const TABS = [
  { key: "Profile", label: "Profile", icon: <User size={15} /> },
  { key: "Batch", label: "Batch", icon: <BookOpen size={15} /> },
  { key: "Belt", label: "Belt", icon: <Award size={15} /> },
  { key: "Certs", label: "Achievements", icon: <FileText size={15} /> },
];
const VALID_TABS = TABS.map((t) => t.key);

export default function StudentDashboard() {
  const { logout, user } = useAuth();

  // ── active tab synced with ?tab= in the URL ─────────────────────────────────
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = VALID_TABS.includes(searchParams.get("tab"))
    ? searchParams.get("tab")
    : "Profile";
  const [activeTab, setActiveTabState] = useState(initialTab);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    setSearchParams({ tab }, { replace: true });
  };

  const [showLogoutConfirm, setShowLogout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [student, setStudent] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState(null);

  const [batch, setBatch] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState(null);
  const batchFetchAttempted = useRef(false);

  const [beltRecords, setBeltRecords] = useState([]);
  const [beltsLoading, setBeltsLoading] = useState(false);
  const [beltsError, setBeltsError] = useState(null);
  const beltsFetched = useRef(false);

  const [certs, setCerts] = useState([]);
  const [certsLoading, setCertsLoading] = useState(false);
  const [certsError, setCertsError] = useState(null);
  const certsFetched = useRef(false);

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // ── fetch student (once per user) ───────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    const fetchStudent = async () => {
      try {
        setStudentLoading(true);
        setStudentError(null);
        const data = await getStudent(user.id);
        if (cancelled) return;
        setStudent(data);
        if (data?.batch) setBatch(data.batch);
        if(data?.belts) setBeltRecords(data.belts)
      } catch (err) {
        if (!cancelled) setStudentError(err.response?.data?.message || "Failed to load your profile.");
      } finally {
        if (!cancelled) setStudentLoading(false);
      }
    };
    fetchStudent();

    return () => { cancelled = true; };
  }, [user?.id]);

  // ── fetch batch fallback (only once, only if student response had none) ────
  useEffect(() => {
    if (batch || batchFetchAttempted.current || studentLoading) return;
    batchFetchAttempted.current = true;

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
  }, [batch, studentLoading]);
  

  // ── lazy certificate fetch — runs once, only when Certs tab is active ──────
  const fetchCerts = useCallback(async () => {
    if (certsFetched.current) return;
    if (!user?.id) return;
    certsFetched.current = true;

    try {
      setCertsLoading(true);
      setCertsError(null);
      const res = await axiosInstance.get(`/users/${user.id}/certificates`);
      const data = res.data?.data || res.data || [];
      setCerts(Array.isArray(data) ? data : []);
    } catch (err) {
      setCertsError("Failed to load certificates.");
      certsFetched.current = false;
    } finally {
      setCertsLoading(false);
    }
  }, [user?.id]);

  // Trigger the lazy fetch exactly when its tab becomes active — this is also
  // what makes a refresh on ?tab=Certs load only that tab's data right away
  useEffect(() => {    
    if (activeTab === "Certs") fetchCerts();
  }, [activeTab , fetchCerts]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleLogoutAction = async () => {
    try { await logout(); setShowLogout(false); }
    catch (err) { console.error("Logout error:", err); }
  };

  // ── Derived display values ──────────────────────────────────────────────────
  const displayName = student?.name ?? null;
  const displayEmail = student?.email ?? null;
  const displayStatus = student ? ((String(student.status) === '1' || student.status === true || String(student.status).toLowerCase() === 'active' || student.status === 'true') ? "Active" : "Inactive") : null;
  const displayJoined = fmt(student?.created_at);
  const displayId = student?.id ?? null;

  return (
    <div className="relative min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200 overflow-hidden">

      {/* ambient glass blobs — light mode only */}
      <div className="pointer-events-none fixed inset-0 -z-10 dark:hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-primary2/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-primary/15 blur-3xl" />
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <Card className="max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto">
              <LogOut size={26} className="text-rose-500" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100">Sign out?</h3>
              <p className="text-sm text-slate-400 mt-1">You'll be redirected to the login page.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowLogout(false)} className="flex-1 py-2.5 rounded-xl bg-white/60 backdrop-blur-md border border-white/70 dark:bg-slate-800 hover:bg-white/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors">Cancel</button>
              <button onClick={handleLogoutAction} className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold transition-colors shadow-md shadow-rose-200">Sign Out</button>
            </div>
          </Card>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-white/40 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/50 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to='/'>
              <div className="w-8 h-8 bg-black backdrop-blur-md border-primary2 border-2 p-[2px] rounded-xl flex items-center justify-center shadow-sm">
                <img src={logo} alt="no image" className="w-full h-full object-contain" />
              </div>
            </Link>
            <div className="hidden sm:block">
              <p className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100 leading-none">
                <span className="text-primary">SS Martial</span> <span className="text-primary2">Arts School</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsDark(!isDark)} className="w-9 h-9 rounded-xl bg-white/50 backdrop-blur-md border border-white/60 dark:bg-slate-800 hover:bg-white/70 dark:hover:bg-slate-700 flex items-center justify-center text-primary dark:text-slate-400 transition-colors">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={() => setShowLogout(true)} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 backdrop-blur-md border border-rose-200/50 hover:bg-rose-500/20 text-rose-600 text-sm font-bold transition-colors">
              <LogOut size={15} /> Sign Out
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden w-9 h-9 rounded-xl bg-white/50 backdrop-blur-md border border-white/60 dark:bg-slate-800 flex items-center justify-center text-primary dark:text-slate-400">
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-white/50 dark:border-slate-800 bg-white/60 backdrop-blur-xl dark:bg-slate-900 px-4 py-3">
            <button onClick={() => { setShowLogout(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-600 font-bold text-sm">
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative">

        {studentLoading ? <ProfileSkeleton /> : studentError ? (
          <Card className="p-6 flex items-center gap-3 border-rose-200/60">
            <AlertCircle size={20} className="text-rose-500 flex-shrink-0" />
            <p className="text-sm text-rose-500">{studentError}</p>
          </Card>
        ) : (
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-28 h-28 rounded-2xl bg-primary/15 backdrop-blur-md border border-primary/30 flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-3xl font-black text-primary">
                  {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                    {displayName ?? <NoData />}
                  </h1>
                  {displayStatus && (
                    <Chip className={`mx-auto sm:mx-0 ${displayStatus === "Active"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-500/10 text-rose-600 dark:text-red-400"
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full inline-block ${displayStatus === "Active"
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-rose-500"
                        }`} />
                      {displayStatus}
                    </Chip>
                  )}
                </div>

                <p className="text-xs text-slate-400 mb-1 font-medium">
                  ID: {displayId ?? "—"} · Joined {displayJoined ?? "—"}
                </p>
                <p className="text-xs text-slate-400 mb-1 font-medium">
                  Email ID: {displayEmail ?? "—"}
                </p>

                {batchLoading && <p className="text-xs text-slate-400 mb-2 animate-pulse">Loading batch…</p>}
                {batchError && <p className="text-xs text-rose-400 mb-2">{batchError}</p>}

                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <Chip className={`${getBeltColor(student?.belt).bg} ${getBeltColor(student?.belt).text} px-3 py-1.5 text-xs shadow-sm`}>
                    <Award size={12} />
                    {student?.belt || 'Unranked'}
                  </Chip>
                  <Chip className="bg-primary2/10 text-primary2 px-3 py-1.5 text-xs shadow-sm">
                    <BookOpen size={12} />
                    {student?.batch?.name ?? "No batch"}
                  </Chip>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-5">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 backdrop-blur-md border ${activeTab === tab.key
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/30"
                  : "bg-white/40 text-slate-500 border-white/60 hover:border-primary/40 hover:text-primary dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:border-slate-700"
                  }`}
              >
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>
          {activeTab === "Profile" && <ProfileTab student={student} />}
          {activeTab === "Batch" && <BatchTab batch={batch} loading={batchLoading} error={batchError} />}
          {activeTab === "Belt" && <BeltTab beltRecords={beltRecords} loading={beltsLoading} error={beltsError} />}
           {activeTab === "Certs" && <CertsTab certs={certs} loading={certsLoading} error={certsError} />}
         </div>
       </main>
     </div>
   );
 }