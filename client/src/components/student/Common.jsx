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
    <Card className="p-6 sm:p-8 flex flex-col md:flex-row md:items-start gap-6 animate-pulse">
      <div className="flex flex-col sm:flex-row items-center sm:items-start w-full md:flex-1 gap-6">
        <div className="w-28 h-28 rounded-2xl bg-slate-200 dark:bg-slate-700 flex-shrink-0" />

        <div className="flex-1 text-center sm:text-left min-w-0 w-full">

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 justify-center sm:justify-start">
            <div className="h-7 w-40 bg-slate-200 dark:bg-slate-700 rounded-md" />
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto sm:mx-0" />
          </div>
          <div className="h-3 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-2 mx-auto sm:mx-0" />

          <div className="h-3 w-56 bg-slate-200 dark:bg-slate-700 rounded mb-3 mx-auto sm:mx-0" />


          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <div className="h-7 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="h-7 w-28 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>
        </div>
      </div>

      <div className="w-full md:w-auto flex flex-col gap-4 justify-center md:justify-end md:items-start">

        <div className="h-11 w-full sm:w-40 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        <div className="h-8 w-44 bg-slate-200 dark:bg-slate-700 rounded-lg" />
      </div>
    </Card>
  );
}