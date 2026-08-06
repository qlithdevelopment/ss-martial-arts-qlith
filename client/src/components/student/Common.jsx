export const fmt = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : null;

export const fmtCurrency = (val) =>
  val != null ? `₹${Number(val).toLocaleString("en-IN")}` : null;

export const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '');

export function Chip({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide backdrop-blur-md border border-white/60 dark:border-slate-700 ${className}`}>
      {children}
    </span>
  );
}

export function NoData() {
  return <span className="text-slate-300 dark:text-slate-600 italic font-normal">No data</span>;
}

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white dark:bg-slate-900 backdrop-blur-2xl border border-white/70 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-none ${className}`}>
      {children}
    </div>
  );
}

export function InfoRow({ icon, label, value, valueClass = "" }) {
  return (
    <div className="flex items-start gap-3 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-xl p-3 border border-white/60 dark:border-slate-800/50">
      <div className="w-7 h-7 rounded-lg bg-white/80 dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary dark:text-slate-400 flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</p>
        <p className={`text-sm text-black dark:text-slate-200 truncate mt-0.5 ${valueClass}`}>
          {value ?? <NoData />}
        </p>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <Card className="p-6 sm:p-8 animate-pulse">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-28 h-28 rounded-2xl bg-primary/10 dark:bg-slate-800 flex-shrink-0" />
        <div className="flex flex-col md:items-start md:justify-start items-center justify-center w-full space-y-3">
          <div className="h-8 bg-primary/10 dark:bg-slate-800 rounded-lg w-48" />
          <div className="h-4 bg-slate-200/60 dark:bg-slate-700 rounded w-64" />
          <div className="flex gap-2 mt-2">
            <div className="h-7 w-24 bg-slate-200/60 dark:bg-slate-700 rounded-lg" />
            <div className="h-7 w-32 bg-slate-200/60 dark:bg-slate-700 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-white/60 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 bg-slate-200/50 dark:bg-slate-800 rounded-xl" />
        ))}
      </div>
    </Card>
  );
}