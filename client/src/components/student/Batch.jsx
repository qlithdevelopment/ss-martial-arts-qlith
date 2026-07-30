import { BookOpen, Calendar } from "lucide-react";
import { Card, Chip, InfoRow, fmt } from "./Common";

export default function BatchTab({ batch, loading, error }) {
    if (loading) {
        return (
            <Card className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
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