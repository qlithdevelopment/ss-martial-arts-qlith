import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  User, Phone, Mail, MapPin, Calendar, Shield, BookOpen,
  Award, CreditCard, LogOut, Sun, Moon,
  CheckCircle2, Clock, AlertCircle, Lock, TrendingUp,
  Download, Star, Dumbbell, Sparkles, Menu, X, GraduationCap,
} from "lucide-react";
import axiosInstance from "../../api/axios.js";

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

const TABS = [
  { key: "Batch", label: "Batch Info", icon: <BookOpen size={15} /> },
  { key: "Courses", label: "Courses", icon: <Dumbbell size={15} /> },
  { key: "Fees", label: "Fees", icon: <CreditCard size={15} /> },
  { key: "Belt", label: "Belt", icon: <Award size={15} /> },
  { key: "Certs", label: "Certificates", icon: <Star size={15} /> },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main batch card */}
      <div className="lg:col-span-7">
        <Card className="p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Dumbbell size={20} className="text-indigo-500" />
              </div>
              <div>
                {/* FROM API */}
                <p className="text-base font-black text-slate-800 dark:text-slate-100">{batch.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">Batch ID: #{batch.id}</p>
              </div>
            </div>
            <Chip className={isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}>
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${isActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              {/* FROM API */}
              {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
            </Chip>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoRow icon={<Calendar size={14} />} label="Start Date" value={startDate} />  {/* FROM API */}
            <InfoRow icon={<Calendar size={14} />} label="End Date" value={endDate} />  {/* FROM API */}
            <InfoRow icon={<CreditCard size={14} />} label="Batch Fee" value={fmtCurrency(batch.total_fee)} />  {/* FROM API */}
            {/* <InfoRow icon={<Clock size={14} />} label="Schedule" value={null} />  NO DATA from API — batch.notes has it as free text */}
            {/* <InfoRow icon={<User size={14} />} label="Instructor" value={null} />  NO DATA from API */}
            {/* <InfoRow icon={<BookOpen size={14} />} label="Course Type" value={null} />  NO DATA from API */}
          </div>

          {/* Notes — FROM API */}
          {batch.notes && (
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-100 dark:border-slate-800/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Notes</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{batch.notes}</p>
            </div>
          )}
        </Card>
      </div>

      {/* Side stats */}
      <div className="lg:col-span-5 space-y-4">
        <Card className="p-5">
          <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-4">Batch Duration</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 dark:text-slate-400">From</span>
              {/* FROM API */}
              <span className="font-bold text-slate-800 dark:text-slate-100">{startDate ?? <NoData />}</span>
            </div>
            <div className="h-px bg-slate-100 dark:bg-slate-800" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 dark:text-slate-400">To</span>
              {/* FROM API */}
              <span className="font-bold text-slate-800 dark:text-slate-100">{endDate ?? <NoData />}</span>
            </div>
            <div className="h-px bg-slate-100 dark:bg-slate-800" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 dark:text-slate-400">Total Students</span>
              {/* NO DATA from API */}
              <NoData />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-3">Attendance</p>
          {/* NO DATA from API */}
          <p className="text-xs text-slate-400 italic">No attendance data available.</p>
        </Card>
      </div>
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
  const totalPaid = fmtCurrency(ledger.total_paid);
  const pendingAmount = fmtCurrency(ledger.pending_amount);
  const paymentHistory = student?.payment_history ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Payment history */}
      <div className="lg:col-span-7 space-y-3">
        <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase px-1">Payment History</p>
        <Card className="overflow-hidden">
          {paymentHistory.length === 0 ? (
            /* FROM API — payment_history is [] */
            <div className="px-5 py-10 text-center">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                <CreditCard size={18} className="text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No payments recorded yet</p>
              <p className="text-xs text-slate-400 mt-1">Payments will appear here once processed.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {paymentHistory.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    </div>
                    <div className="min-w-0">
                      {/* map actual API fields from payment_history once populated */}
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                        {p.month ?? fmt(p.paid_at) ?? <NoData />}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{p.description ?? p.desc ?? <NoData />}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                      {fmtCurrency(p.amount) ?? <NoData />}
                    </p>
                    <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wide">Paid</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Ledger summary */}
      <div className="lg:col-span-5 space-y-4">
        <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase px-1">Ledger Summary</p>

        <Card className="divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
          {[
            { label: "Total Batch Fee", value: totalFee, icon: <CreditCard size={15} />, cls: "text-slate-700 dark:text-slate-200" },
            { label: "Total Paid", value: totalPaid, icon: <CheckCircle2 size={15} />, cls: "text-emerald-600 dark:text-emerald-400" },
            { label: "Pending Amount", value: pendingAmount, icon: <AlertCircle size={15} />, cls: "text-red-500" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                {row.icon}
                <span className="text-sm">{row.label}</span>
              </div>
              {/* FROM API — ledger_summary */}
              <p className={`text-sm font-black ${row.cls}`}>{row.value ?? <NoData />}</p>
            </div>
          ))}
        </Card>

        {/* Pending dues callout */}
        <div className="bg-red-500/8 dark:bg-red-500/10 border border-red-200 dark:border-red-900/40 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-red-400 font-bold uppercase tracking-widest">Total Pending</p>
            {/* FROM API */}
            <p className="text-2xl font-black text-red-500 mt-0.5">{pendingAmount ?? <NoData />}</p>
          </div>
          {ledger.pending_amount > 0 && (
            <button className="bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2">
              <CreditCard size={15} /> Pay Now
            </button>
          )}
        </div>

        {/* Due date — NO DATA from API */}
        <Card className="p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Next Due Date</p>
          <NoData />
        </Card>
      </div>
    </div>
  );
}

// ─── Tab: Belt Progress ───────────────────────────────────────────────────────
// No data from API — belt/rank info not in student response
function BeltTab() {
  const cleared = BELTS.filter((b) => b.status === "cleared").length;
  const total = BELTS.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <AlertCircle size={13} className="text-amber-500 flex-shrink-0" />
        <p className="text-[11px] text-amber-500 font-semibold">
          Belt progress is not yet available from the API — showing placeholder data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Card className="p-2 overflow-hidden">
            <div className="space-y-1">
              {BELTS.map((b, idx) => (
                <div key={b.name} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${b.status === "current" ? "bg-amber-50 dark:bg-amber-500/10" : b.status === "locked" ? "opacity-40" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
                  <div className={`w-8 h-8 rounded-lg ${b.color} shadow-inner flex-shrink-0 ${b.status === "current" ? `ring-2 ${b.ring} ring-offset-2 dark:ring-offset-slate-900` : ""}`} />
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 tabular-nums w-4">{String(idx + 1).padStart(2, "0")}</span>
                    <span className={`text-sm font-bold truncate ${b.status === "current" ? "text-amber-600 dark:text-amber-400" : "text-slate-700 dark:text-slate-300"}`}>{b.name} Belt</span>
                  </div>
                  <div className="flex-shrink-0">
                    {b.status === "cleared" && <CheckCircle2 size={16} className="text-emerald-500" />}
                    {b.status === "current" && <Chip className="bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">Current</Chip>}
                    {b.status === "locked" && <Lock size={14} className="text-slate-400" />}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5">
            <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-3">Overall Belt Progress</p>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-black text-slate-800 dark:text-slate-100">{cleared}</span>
              <span className="text-lg text-slate-400 mb-1">/ {total}</span>
            </div>
            <ProgressBar value={Math.round((cleared / total) * 100)} color="bg-gradient-to-r from-amber-500 to-amber-700" />
          </Card>
          <Card className="p-5">
            <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-2">Next Exam</p>
            {/* NO DATA from API */}
            <NoData />
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Certificates ────────────────────────────────────────────────────────
// No data from API — certificates not in student response
function CertsTab() {
  return (
    <Card className="p-8 text-center">
      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-3">
        <Award size={22} className="text-indigo-400" />
      </div>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No certificates available</p>
      <p className="text-xs text-slate-400 mt-1">Certificate data is not yet provided by the API.</p>
    </Card>
  );
}

const TAB_COMPONENTS = {
  Batch: BatchTab,
  Fees: FeesTab,
  Belt: BeltTab,
  Certs: CertsTab,
};
// ─── Tab: Courses ─────────────────────────────────────────────────────────────
const DUMMY_COURSES = [
  {
    id: 1,
    title: "Karate — Advanced",
    instructor: "Sensei Mohan Das",
    schedule: "Mon, Wed, Fri · 6:00 AM",
    progress: 72,
    status: "Ongoing",
    accent: "indigo",
    icon: <BookOpen size={18} />,
  },
 
];

const COURSE_ACCENT_MAP = {
  indigo: {
    bg: "bg-indigo-500/10 dark:bg-indigo-500/15",
    text: "text-indigo-600 dark:text-indigo-400",
    bar: "bg-indigo-500",
  },
  violet: {
    bg: "bg-violet-500/10 dark:bg-violet-500/15",
    text: "text-violet-600 dark:text-violet-400",
    bar: "bg-violet-500",
  },
  amber: {
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    text: "text-amber-600 dark:text-amber-400",
    bar: "bg-amber-500",
  },
};

function CoursesTab({ student }) {
  // When API is ready, swap DUMMY_COURSES with:
  // const courses = student?.courses ?? student?.enrollments ?? [];
  const courses = DUMMY_COURSES;

  return (
    <div className="space-y-3">
      {/* Remove this banner once real API data is wired in */}
      <div className="flex items-center gap-2 px-1">
        <AlertCircle size={13} className="text-amber-500 flex-shrink-0" />
        <p className="text-[11px] text-amber-500 font-semibold">
          Showing placeholder data — course endpoint not yet available.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {courses.map((c) => {
          const a = COURSE_ACCENT_MAP[c.accent];
          const isOnHold = c.status === "On Hold";

          return (
            <Card key={c.id} className="p-5 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.bg} ${a.text}`}>
                  {c.icon}
                </div>
                <Chip className={isOnHold
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                }>
                  {isOnHold ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                  {c.status}
                </Chip>
              </div>

              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
                {c.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {c.instructor}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
                <Clock size={10} className="flex-shrink-0" />
                {c.schedule}
              </p>

              <div className="flex items-center gap-3 mt-3">
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${a.bar}`}
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-400 tabular-nums min-w-[30px] text-right">
                  {c.progress}%
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

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
  const displayStatus = student?.status === 1 ? "Active" : student?.status === 0 ? "Inactive" : null;
  const displayJoined = fmt(student?.created_at);
  const displayId = student?.id ?? null;
  const displayNotes = student?.notes ?? null;

  // NOT IN API ❌ — these fields don't come from /students/{id}
  const displayPhone = null;   // no phone field in API response
  const displayAltPhone = null;   // no alt_phone field in API response
  const displayCity = null;   // no city/address field
  const displayDob = null;   // no dob field
  const displayGuardian = null;   // no guardian/parent field
  const displayAvatar = null;   // no photo/avatar field

  // FROM API ✅ — ledger_summary
  const ledger = student?.ledger_summary ?? {};
  const displayPaid = fmtCurrency(ledger.total_paid);
  const displayPending = fmtCurrency(ledger.pending_amount);
  const displayFee = fmtCurrency(ledger.total_fee);

  // NOT IN API ❌
  const displayBelt = null;   // no belt/rank field
  const displayCerts = null;   // no certificates field

  const TabComponent = TAB_COMPONENTS[activeTab];


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
              <p className="text-sm font-black tracking-tight text-slate-800 dark:text-slate-100 leading-none">Dojo Portal</p>
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
                    <Chip className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto sm:mx-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
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
                  <Chip className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1.5 text-xs">
                    <Award size={12} />
                    {/* NO DATA from API */}
                    Belt: <NoData />
                  </Chip>
                  <Chip className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 text-xs">
                    <BookOpen size={12} />
                    {/* batch from API */}
                    {batch?.name ?? "No batch"}
                  </Chip>
                  {DUMMY_COURSES.map((c) => (
                    <Chip
                      key={c.id}
                      className={`px-3 py-1.5 text-xs ${c.status === "On Hold"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        }`}
                    >
                      <GraduationCap size={12} />
                      {c.title}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* FROM API  */}
              <InfoRow icon={<Mail size={14} />} label="Email" value={displayEmail} valueClass="text-indigo-500 dark:text-indigo-400" />
              <InfoRow icon={<Calendar size={14} />} label="Joined" value={displayJoined} />
              {/* NOT IN API  */}
              <InfoRow icon={<Phone size={14} />} label="Phone" value={displayPhone} />
              <InfoRow icon={<MapPin size={14} />} label="City" value={displayCity} />
              <InfoRow icon={<Calendar size={14} />} label="DOB" value={displayDob} />
              <InfoRow icon={<User size={14} />} label="Guardian" value={displayGuardian} />
            </div>
          </Card>
        )}

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            {
              label: "Current Belt", value: displayBelt,     // NOT IN API ❌
              valueClass: "text-amber-700 dark:text-amber-500",
              icon: <Shield size={18} />, iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
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
          {activeTab === "Courses" && <CoursesTab student={student} />}
          {activeTab === "Fees" && <FeesTab student={student} />}
          {activeTab === "Belt" && <BeltTab />}
          {activeTab === "Certs" && <CertsTab />}
        </div>
      </main>
    </div>
  );
}