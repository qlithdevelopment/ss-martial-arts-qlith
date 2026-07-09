import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Award, CheckCircle, Calendar, Users, ArrowLeft, Eye } from 'lucide-react';
import api from '../../api/axios';
import bgimage from '../../assets/martial_arts_bg.png';
import StudentDetailView from '../../components/public/StudentDetailView'

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

const FindStudent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Debounce raw input -> debouncedQuery
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setSelectedStudent(null);
  }, [debouncedQuery]);

  // Fetch students from backend whenever debouncedQuery changes
  useEffect(() => {
    if (!debouncedQuery) {
      setStudents([]);
      return;
    }

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/students?search=${encodeURIComponent(debouncedQuery)}`);
        const rawStudents = response?.data?.data || response.data;
        setStudents(Array.isArray(rawStudents) ? rawStudents : []);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [debouncedQuery]);
  {/* Student Card Skeleton */ }
  const StudentCardSkeleton = () => (
    <div className="bg-gradient-to-br from-orange-50/80 to-white rounded-2xl overflow-hidden shadow-sm border border-orange-100/50 flex flex-col p-6 relative">
      {/* Top Section with Avatar and Info */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse shrink-0" />
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse" />
          </div>
          <div className="h-3 w-14 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Tags Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
        <div className="flex-1 h-14 bg-gray-100 rounded-xl animate-pulse" />
        <div className="flex-1 h-14 bg-gray-100 rounded-xl animate-pulse" />
      </div>

      {/* Bottom Info Row */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );


  return (
    <div className="min-h-screen lg:h-screen w-full bg-slate-50 text-gray-900 relative lg:overflow-hidden flex flex-col lg:flex-row">

      {/* Back Button */}
      <Link to="/" className="absolute top-6 lg:left-16  left-6 z-50 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 text-gray-700 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      {/* Background Orbs for Texture */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] opacity-40 pointer-events-none overflow-hidden flex justify-center z-0">
        <div className="absolute top-[-100px] left-10 w-96 h-96 bg-primary/20 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute top-[-50px] right-10 w-96 h-96 bg-primary2/20 rounded-full blur-[100px] mix-blend-multiply" />
      </div>

      {/* LEFT COLUMN - Heading & Info */}
      <div className="w-full lg:w-5/12 flex-none lg:h-full flex flex-col items-start p-8 lg:p-16 pt-24 lg:pt-16 relative z-10 bg-white/40 backdrop-blur-sm overflow-hidden">
        <div className="text-left max-w-lg w-full z-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-7xl font-black mb-5 tracking-tight uppercase leading-[1.1]"
          >
            <span className="text-black">FIND</span><br className="hidden lg:block" /> <span className="text-[#26c0ff]">STUDENT</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-sm max-w-sm mb-10 leading-relaxed"
          >
            Verify student enrollment, current belt rank, and batch information by searching their Name or ID.
          </motion.p>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-start gap-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <CheckCircle size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Verify Enrollment</h4>
                <p className="text-gray-600 text-xs mt-1 font-medium">Check if the student is enrolled in the academy.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                <Award size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Verify Belt Rank</h4>
                <p className="text-gray-600 text-xs mt-1 font-medium">View current belt rank and achievements.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                <Users size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Verify Batch</h4>
                <p className="text-gray-600 text-xs mt-1 font-medium">Check active batch and training schedule.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Martial Arts Background Image */}
        <div className="absolute bottom-0 left-0 w-full h-[50vh] lg:h-[60%] z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/90 z-10"></div>
          <img
            src={bgimage}
            alt="Martial Arts Background"
            className="w-full h-full object-cover object-bottom opacity-90 mix-blend-multiply"
          />
        </div>
      </div>

      {/* RIGHT COLUMN - Search & Results */}
      <div className="w-full lg:w-7/12 flex flex-col lg:h-full relative z-10 pt-4 lg:pt-16 bg-slate-50">

        {/* Search Bar */}
        <div className="flex-none px-6 lg:px-12 pb-6 w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative w-full"
          >
            <div className="relative w-full bg-white shadow-lg shadow-gray-200/40 rounded-full border border-gray-100 p-2 flex items-center">
              <div className="pl-4 pr-3 text-gray-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                className="w-full py-2 bg-transparent border-none text-[10.5px] truncate md:text-sm focus:outline-none font-medium placeholder:text-gray-400"
                placeholder="Search by Name, Email, Belt, or Batch"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-[#f97316] hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold transition-all shadow-md shadow-orange-500/20 shrink-0">
                Search
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scrollable Results Area */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-12 pb-20 w-full max-w-4xl hide-scrollbar">
          <div className="min-h-full">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <StudentCardSkeleton key={idx} />
                ))}
              </div>
            ) : selectedStudent ? (
              <AnimatePresence mode="wait">
                <StudentDetailView
                  key={selectedStudent.id}
                  student={selectedStudent}
                  onBack={() => setSelectedStudent(null)}
                />
              </AnimatePresence>
            ) : debouncedQuery === '' ? null : students.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 mt-10 p-8 rounded-2xl border border-gray-100 bg-gray-50/50"
              >
                <p className="text-lg font-medium text-gray-700">No students found matching "{debouncedQuery}"</p>
                <p className="text-sm mt-2 text-gray-400">Please check the spelling or ID and try again.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {students.map((student, index) => {
                    const previewBelt = student.belt || 'Unranked';
                    const isActive = String(student.status) === '1' || student.status === true || String(student.status).toLowerCase() === 'active' || student.status === 'true';

                    return (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gradient-to-br from-orange-50/80 to-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-orange-100/50 flex flex-col p-6 relative"
                      >
                        {/* Top Section with Avatar and Info */}
                        <div className="flex items-center gap-4 mb-5">
                          <div className="w-10 h-10 rounded-full border border-blue-100 bg-blue-50 text-blue-500 font-black text-lg flex items-center justify-center shrink-0">
                            {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <h3 className="text-lg font-black text-gray-900 tracking-tight leading-tight truncate">
                                {student.name}
                              </h3>
                              <div className="flex items-center gap-1.5 bg-gray-50/80 px-2 py-0.5 rounded-full shrink-0 border border-gray-100">
                                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className={`text-[9px] font-bold ${isActive ? 'text-green-700' : 'text-red-700'} uppercase tracking-wider`}>
                                  {isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                              ID: {student.id}
                            </p>
                          </div>
                        </div>

                        {/* Tags Row */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
                          <div className={`flex-1 px-3 py-2 rounded-xl flex items-center gap-2 border ${getBeltColor(previewBelt).bg} ${getBeltColor(previewBelt).text} ${getBeltColor(previewBelt).border} shadow-sm`}>
                            <Award size={16} className="shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate">{previewBelt}</p>
                              <p className="text-[9px] font-semibold opacity-70 uppercase tracking-wider mt-0.5">Rank</p>
                            </div>
                          </div>

                          <div className="flex-1 px-3 py-2 rounded-xl flex items-center gap-2 border border-orange-100 bg-orange-50/50">
                            <Calendar size={16} className="text-orange-500 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate">
                                {student.batch_name || 'None'}
                              </p>
                              <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mt-0.5">
                                Batch
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Info Row */}
                        <div className="mt-auto mb-2 pt-4 border-t border-gray-100 flex flex-wrap gap-8">
                          <div>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Joined</p>
                            <p className="text-xs font-semibold text-gray-900">
                              {student.created_at ? new Date(student.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); 
                              setSelectedStudent(student);
                            }}
                            className="w-full cursor-pointer flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#0b1b24] hover:bg-[var(--color-primary)] px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                          >
                            <Eye size={14} />
                            View Details
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindStudent;