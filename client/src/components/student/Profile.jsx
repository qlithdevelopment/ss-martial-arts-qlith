import { User, Mail, Phone, Calendar, Users, MapPin, Shield, BookOpen, Award, GraduationCap, Ruler, Weight } from "lucide-react";
import { Card, Chip, InfoRow, NoData, fmt } from "./Common";

export default function ProfileTab({ student }) {
    if (!student) {
        return (
            <Card className="p-8 text-center">
                <p className="text-sm text-slate-400">No profile information available.</p>
            </Card>
        );
    }

    const {
        name, father_name, mother_name, gender, date_of_birth, email, mobile_number,
        address, branch_id, belt, sensei, reg_no, joining_date, height, weight,
        status, created_at,
    } = student;

    const isActive = status === 1 || status === "1" || status === true;

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                            <User size={20} className="text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-base font-black text-slate-800 dark:text-slate-100">{name ?? <NoData />}</p>
                            <p className="text-xs text-slate-400 font-bold tracking-widest mt-0.5">Reg No:<span className="font-bold dark:text-indigo-400 uppercase text-black"> {reg_no ?? <NoData />}</span></p>
                        </div>
                    </div>
                    <Chip className={isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}>
                        <span className={`w-1.5 h-1.5 rounded-full inline-block ${isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                        {isActive ? "Active" : "Inactive"}
                    </Chip>
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                    <InfoRow icon={<Mail size={14} />} label="Email" value={email} valueClass="text-indigo-500 dark:text-indigo-400" />
                    <InfoRow icon={<Phone size={14} />} label="Mobile Number" value={mobile_number} />
                    <InfoRow icon={<Calendar size={14} />} label="Date of Birth" value={fmt(date_of_birth)} />
                    <InfoRow icon={<Users size={14} />} label="Gender" value={gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : null} />
                </div>
            </Card>

            <Card className="p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Family details</p>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                    <InfoRow icon={<Users size={14} />} label="Father's Name" value={father_name} />
                    <InfoRow icon={<Users size={14} />} label="Mother's Name" value={mother_name} />
                </div>
            </Card>

            <Card className="p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Address</p>
                <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800/50">
                    <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary dark:text-slate-400 flex-shrink-0 mt-0.5">
                        <MapPin size={14} />
                    </div>
                    <p className="text-xs font-semibold text-primary2 dark:text-slate-200 leading-relaxed">
                        {address ?? <NoData />}
                    </p>
                </div>
            </Card>

            <Card className="p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Academy details</p>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                    <InfoRow icon={<Shield size={14} />} label="Branch" value={branch_id} />
                    <InfoRow icon={<BookOpen size={14} />} label="Batch" value={student?.batch?.name} />
                    <InfoRow icon={<Award size={14} />} label="Belt" value={belt} />
                    <InfoRow icon={<GraduationCap size={14} />} label="Sensei" value={sensei} />
                    <InfoRow icon={<Calendar size={14} />} label="Joining Date" value={fmt(joining_date)} />
                    <InfoRow icon={<Calendar size={14} />} label="Created On" value={fmt(created_at)} />
                </div>
            </Card>

            <Card className="p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Physical details</p>
                <div className="grid grid-cols-2 gap-3">
                    <InfoRow icon={<Ruler size={14} />} label="Height (cm)" value={height} />
                    <InfoRow icon={<Weight size={14} />} label="Weight (kg)" value={weight} />
                </div>
            </Card>
        </div>
    );
}

