import { useState, useEffect } from "react";
import {
  User, Phone, Mail, MapPin, Calendar, Shield, BookOpen,
  Award, CreditCard, ChevronRight, LogOut, Sun, Moon,
  CheckCircle2, Clock, AlertCircle, Lock, TrendingUp,
  Download, Star, Dumbbell, Sparkles, Menu, X, BellRing,
} from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const student = {
  name: "Arjun Rathore",
  id: "STU-2024-0847",
  joined: "Jan 2023",
  status: "Active",
  phone: "+91 98765 43210",
  altPhone: "+91 91234 56789",
  email: "arjun.r@gmail.com",
  city: "Cuttack, Odisha",
  dob: "14 Mar 2004",
  guardian: "Ramesh Rathore",
  belt: "Brown",
  totalPaid: "₹18,500",
  pending: "₹3,200",
  certCount: 4,
  avatar: "https://i.pinimg.com/736x/91/30/c3/9130c37e707c22ff64fcf6546d61f482.jpg",
};

const BELTS = [
  { name: "White", color: "bg-gray-200 dark:bg-gray-600", ring: "ring-gray-300", status: "cleared" },
  { name: "Yellow", color: "bg-yellow-400", ring: "ring-yellow-400", status: "cleared" },
  { name: "Orange", color: "bg-orange-500", ring: "ring-orange-500", status: "cleared" },
  { name: "Green", color: "bg-green-600", ring: "ring-green-600", status: "cleared" },
  { name: "Blue", color: "bg-blue-600", ring: "ring-blue-600", status: "cleared" },
  { name: "Purple", color: "bg-purple-600", ring: "ring-purple-600", status: "cleared" },
  { name: "Brown", color: "bg-amber-700", ring: "ring-amber-600", status: "current" },
  { name: "Red", color: "bg-red-600", ring: "ring-red-500", status: "locked" },
  { name: "Black", color: "bg-gray-900", ring: "ring-gray-700", status: "locked" },
];

const COURSES = [
  {
    id: 1, icon: <Dumbbell size={18} />,
    title: "Karate — Advanced", instructor: "Sensei Mohan Das",
    schedule: "Mon, Wed, Fri · 6:00 AM", progress: 72, status: "Ongoing",
    accent: "indigo",
  },
  {
    id: 2, icon: <Shield size={18} />,
    title: "Self-Defence Basics", instructor: "Instructor Priya Singh",
    schedule: "Tue, Thu · 5:30 PM", progress: 45, status: "Ongoing",
    accent: "violet",
  },
  {
    id: 3, icon: <Sparkles size={18} />,
    title: "Meditation & Flexibility", instructor: "Instructor Raji Nair",
    schedule: "Sat · 7:00 AM", progress: 30, status: "On Hold",
    accent: "amber",
  },
];

const FEES_PAID = [
  { month: "May 2025", desc: "Karate Advanced", amount: "₹2,500" },
  { month: "Apr 2025", desc: "Karate Advanced + Self-defence", amount: "₹4,000" },
  { month: "Mar 2025", desc: "Karate Advanced + Self-defence", amount: "₹4,000" },
  { month: "Feb 2025", desc: "Brown Belt grading exam", amount: "₹800" },
];

const FEES_PENDING = [
  { month: "Jun 2025", desc: "Karate Advanced", amount: "₹2,500", type: "Overdue", variant: "red" },
  { month: "Jun 2025", desc: "Meditation course registration", amount: "₹700", type: "Due Soon", variant: "amber" },
];

const CERTS = [
  { title: "Karate Yellow Belt", issued: "Mar 2023" },
  { title: "Karate Green Belt", issued: "Sep 2023" },
  { title: "Karate Blue Belt", issued: "Mar 2024" },
  { title: "Karate Brown Belt", issued: "Feb 2025" },
];

const TABS = [
  { key: "Courses", label: "Courses", icon: <BookOpen size={15} /> },
  { key: "Fees", label: "Fees", icon: <CreditCard size={15} /> },
  { key: "Belt Progress", label: "Belt Progress", icon: <Award size={15} /> },
  { key: "Certificates", label: "Certificates", icon: <Star size={15} /> },
];

// ─── Accent helpers ───────────────────────────────────────────────────────────
const accentMap = {
  indigo: {
    bg: "bg-indigo-500/10 dark:bg-indigo-500/15",
    text: "text-indigo-600 dark:text-indigo-400",
    bar: "bg-indigo-500",
    border: "border-indigo-200 dark:border-indigo-800",
  },
  violet: {
    bg: "bg-violet-500/10 dark:bg-violet-500/15",
    text: "text-violet-600 dark:text-violet-400",
    bar: "bg-violet-500",
    border: "border-violet-200 dark:border-violet-800",
  },
  amber: {
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    text: "text-amber-600 dark:text-amber-400",
    bar: "bg-amber-500",
    border: "border-amber-200 dark:border-amber-800",
  },
  red: {
    bg: "bg-red-500/10",
    text: "text-red-500",
    badge: "bg-red-500/10 text-red-500",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function Avatar({ initials }) {
  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black select-none shadow-lg">
        {initials}
      </div>
      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
    </div>
  );
}

function Chip({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide ${className}`}>
      {children}
    </span>
  );
}

function ProgressBar({ value, color = "bg-indigo-500" }) {
  return (
    <div className="flex items-center gap-3 mt-3">
      <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${value}%` }}
        />
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

// ─── Tab Panels ──────────────────────────────────────────────────────────────
function CoursesTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {COURSES.map((c) => {
        const a = accentMap[c.accent];
        const isOnHold = c.status === "On Hold";
        return (
          <Card key={c.id} className="p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.bg} ${a.text}`}>
                {c.icon}
              </div>
              <Chip className={isOnHold ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}>
                {isOnHold ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                {c.status}
              </Chip>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">{c.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{c.instructor}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
              <Clock size={10} className="flex-shrink-0" />
              {c.schedule}
            </p>
            <ProgressBar value={c.progress} color={a.bar} />
          </Card>
        );
      })}
    </div>
  );
}

function FeesTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Paid History */}
      <div className="lg:col-span-7 space-y-3">
        <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase px-1">Payment History</p>
        <Card className="divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
          {FEES_PAID.map((f, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{f.month}</p>
                  <p className="text-xs text-slate-400 truncate">{f.desc}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-sm font-black text-slate-800 dark:text-slate-100">{f.amount}</p>
                <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wide">Paid</p>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Pending */}
      <div className="lg:col-span-5 space-y-3">
        <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase px-1">Pending Dues</p>
        <Card className="divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden border-red-100 dark:border-red-900/30">
          {FEES_PENDING.map((f, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${f.variant === "red" ? "bg-red-500/10" : "bg-amber-500/10"}`}>
                  <AlertCircle size={16} className={f.variant === "red" ? "text-red-500" : "text-amber-500"} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{f.desc}</p>
                  <Chip className={`mt-1 ${f.variant === "red" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}>
                    {f.type}
                  </Chip>
                </div>
              </div>
              <p className={`text-base font-black flex-shrink-0 ml-4 ${f.variant === "red" ? "text-red-500" : "text-amber-500"}`}>{f.amount}</p>
            </div>
          ))}
        </Card>

        <div className="bg-red-500/8 dark:bg-red-500/10 border border-red-200 dark:border-red-900/40 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-red-400 font-bold uppercase tracking-widest">Total Pending</p>
            <p className="text-2xl font-black text-red-500 mt-0.5">₹3,200</p>
          </div>
          <button className="bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2">
            <CreditCard size={15} />
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}

function BeltTab() {
  const cleared = BELTS.filter((b) => b.status === "cleared").length;
  const total = BELTS.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7">
        <Card className="p-2 overflow-hidden">
          <div className="space-y-1">
            {BELTS.map((b, idx) => (
              <div
                key={b.name}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${b.status === "current"
                    ? "bg-amber-50 dark:bg-amber-500/10"
                    : b.status === "locked"
                      ? "opacity-40"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
              >
                {/* Belt swatch */}
                <div className="relative flex-shrink-0">
                  <div className={`w-8 h-8 rounded-lg ${b.color} shadow-inner ${b.status === "current" ? `ring-2 ${b.ring} ring-offset-2 dark:ring-offset-slate-900` : ""}`} />
                </div>

                {/* Step number + name */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 tabular-nums w-4">{String(idx + 1).padStart(2, "0")}</span>
                  <span className={`text-sm font-bold truncate ${b.status === "current" ? "text-amber-600 dark:text-amber-400" : "text-slate-700 dark:text-slate-300"
                    }`}>{b.name} Belt</span>
                </div>

                {/* Status */}
                <div className="flex-shrink-0">
                  {b.status === "cleared" && (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  )}
                  {b.status === "current" && (
                    <Chip className="bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">Current</Chip>
                  )}
                  {b.status === "locked" && (
                    <Lock size={14} className="text-slate-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Side info */}
      <div className="lg:col-span-5 space-y-4">
        {/* Progress summary */}
        <Card className="p-5">
          <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-3">Overall Belt Progress</p>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-4xl font-black text-slate-800 dark:text-slate-100">{cleared}</span>
            <span className="text-lg text-slate-400 mb-1">/ {total}</span>
          </div>
          <ProgressBar value={Math.round((cleared / total) * 100)} color="bg-gradient-to-r from-amber-500 to-amber-700" />
        </Card>

        {/* Next exam */}
        <Card className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">Next Exam</p>
              <p className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1">Red Belt Grading</p>
            </div>
            <Chip className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">Aug 2025</Chip>
          </div>
          <p className="text-xs text-slate-400 mb-1">Readiness Score</p>
          <ProgressBar value={60} color="bg-red-500" />
          <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1">
            <TrendingUp size={11} />
            Keep up your current pace — you're on track.
          </p>
        </Card>
      </div>
    </div>
  );
}

function CertsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {CERTS.map((c, i) => (
        <Card key={i} className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
            <Award size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{c.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">Issued {c.issued}</p>
            <Chip className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-1.5">
              <CheckCircle2 size={10} />
              Verified
            </Chip>
          </div>
          <button
            className="w-9 h-9 flex-shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500 dark:hover:bg-indigo-500 hover:text-white text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all group-hover:shadow-md"
            title="Download"
          >
            <Download size={15} />
          </button>
        </Card>
      ))}
    </div>
  );
}

const TAB_COMPONENTS = {
  Courses: CoursesTab,
  Fees: FeesTab,
  "Belt Progress": BeltTab,
  Certificates: CertsTab,
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("Courses");
  const [showLogoutConfirm, setShowLogout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const TabComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">

      {/* ── Logout Confirm ── */}
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
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors shadow-md"
              >
                Sign Out
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
              <Dumbbell size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-black tracking-tight text-slate-800 dark:text-slate-100 leading-none">Dojo Portal</p>
              <p className="text-[10px] text-slate-400 tracking-wide">Student Management System</p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDark(!isDark)}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setShowLogout(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-bold transition-colors"
            >
              <LogOut size={15} />
              Sign Out
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
            <button
              onClick={() => { setShowLogout(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 font-bold text-sm"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        )}
      </header>

      {/* ── Page Body ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Profile Card */}
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* <Avatar initials={student.avatar} /> */}
            <img src={student.avatar} alt="Student Avatar" className="w-30 h-30 rounded-2xl object-cover shadow-lg" />
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">{student.name}</h1>
                <Chip className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto sm:mx-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  Active
                </Chip>
              </div>
              <p className="text-xs text-slate-400 mb-4 font-medium">
                {student.id} · Member since {student.joined}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <Chip className="bg-amber-700 text-amber-50 font-bold px-3 py-1.5 text-xs">
                  <Award size={12} /> Brown Belt
                </Chip>
                <Chip className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold px-3 py-1.5 text-xs">
                  <BookOpen size={12} /> 3 Active Courses
                </Chip>
              </div>
            </div>
          </div>

          {/* Contact Grid */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: <Phone size={14} />, label: "Phone", value: student.phone },
              { icon: <Mail size={14} />, label: "Email", value: student.email, valueClass: "text-indigo-500 dark:text-indigo-400" },
              { icon: <MapPin size={14} />, label: "City", value: student.city },
              { icon: <Calendar size={14} />, label: "DOB", value: student.dob },
              { icon: <User size={14} />, label: "Guardian", value: student.guardian },
              { icon: <Phone size={14} />, label: "Alt Phone", value: student.altPhone },
            ].map((row) => (
              <div key={row.label} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800/50">
                <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5">
                  {row.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{row.label}</p>
                  <p className={`text-xs font-semibold text-slate-700 dark:text-slate-200 truncate mt-0.5 ${row.valueClass || ""}`}>
                    {row.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Fees Paid", value: student.totalPaid,
              valueClass: "text-emerald-500", icon: <CheckCircle2 size={18} />,
              iconClass: "bg-emerald-500/10 text-emerald-500",
            },
            {
              label: "Pending Dues", value: student.pending,
              valueClass: "text-red-500", icon: <AlertCircle size={18} />,
              iconClass: "bg-red-500/10 text-red-500",
            },
            {
              label: "Certificates", value: `${student.certCount} Earned`,
              valueClass: "text-indigo-500 dark:text-indigo-400", icon: <Award size={18} />,
              iconClass: "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400",
            },
            {
              label: "Current Rank", value: "Brown Belt",
              valueClass: "text-amber-700 dark:text-amber-500", icon: <Shield size={18} />,
              iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
            },
          ].map((s) => (
            <Card key={s.label} className="p-5 hover:shadow-md transition-shadow">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.iconClass}`}>
                {s.icon}
              </div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-xl font-black ${s.valueClass}`}>{s.value}</p>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="space-y-5">
          {/* Tab bar */}
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
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <TabComponent />
        </div>
      </main>
    </div>
  );
}