import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Award, Users, DollarSign, Calendar, Shield } from 'lucide-react';

const getBeltColor = (belt) => {
  if (!belt) return { bg: "bg-slate-100", border: "border-slate-200", text: "text-slate-600" };
  const b = belt.toLowerCase();
  if (b.includes("white")) return { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700" };
  if (b.includes("yellow")) return { bg: "bg-[#FEF3C7]", border: "border-amber-200", text: "text-[#B45309]" };
  if (b.includes("orange")) return { bg: "bg-[#FFEDD5]", border: "border-orange-200", text: "text-[#C2410C]" };
  if (b.includes("green")) return { bg: "bg-[#D1FAE5]", border: "border-emerald-200", text: "text-[#047857]" };
  if (b.includes("blue")) return { bg: "bg-[#DBEAFE]", border: "border-blue-200", text: "text-[#1D4ED8]" };
  if (b.includes("purple")) return { bg: "bg-[#F3E8FF]", border: "border-purple-200", text: "text-[#7E22CE]" };
  if (b.includes("brown")) return { bg: "bg-[#F5E6D3]", border: "border-stone-200", text: "text-[#5C4033]" };
  if (b.includes("red")) return { bg: "bg-[#FEE2E2]", border: "border-rose-200", text: "text-[#B91C1C]" };
  if (b.includes("black")) return { bg: "bg-[#1E293B]", border: "border-slate-700", text: "text-white" };
  return { bg: "bg-slate-100", border: "border-slate-200", text: "text-slate-600" };
};

const StudentDetailView = ({ student, onBack }) => {
  if (!student) return null;

  const isActive =
    String(student.status) === '1' || student.status === true || String(student.status).toLowerCase() === 'active';

  const beltColor = getBeltColor(student.belt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 max-w-2xl"
    >
      {/* Back Control */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to results
      </button>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full border border-blue-100 bg-blue-50 text-blue-500 font-black text-xl flex items-center justify-center shrink-0">
          {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-black text-gray-900 tracking-tight truncate">
            {student.name}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${isActive ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-[10px] font-bold ${isActive ? 'text-green-700' : 'text-red-700'} uppercase tracking-wider`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              ID: {student.id}
            </span>
          </div>
        </div>
      </div>

      {/* Details List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
          <Mail size={16} className="text-gray-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{student.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
          <Shield size={16} className="text-gray-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</p>
            <p className="text-sm font-semibold text-gray-900 capitalize">{student.role}</p>
          </div>
        </div>

        <div className={`flex items-center gap-3 p-3 rounded-xl border ${beltColor.border} ${beltColor.bg}`}>
          <Award size={16} className={`shrink-0 ${beltColor.text}`} />
          <div className="min-w-0">
            <p className={`text-[10px] font-bold uppercase tracking-widest opacity-70 ${beltColor.text}`}>Belt Rank</p>
            <p className={`text-sm font-semibold ${beltColor.text}`}>{student.belt || 'Unranked'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl border border-orange-100 bg-orange-50/50">
          <Users size={16} className="text-orange-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Batch</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{student.batch_name || 'None'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
          <DollarSign size={16} className="text-gray-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Fee</p>
            <p className="text-sm font-semibold text-gray-900">₹{student.total_fee}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
          <Calendar size={16} className="text-gray-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined</p>
            <p className="text-sm font-semibold text-gray-900">
              {student.created_at
                ? new Date(student.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDetailView;