import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Plus, Image, Users, Mail, Award, StickyNote, BookOpen, Calendar, IndianRupee, FileText, X, Edit, Trash2, Ruler, Weight, MapPin, Phone, Building2, UserCog, ScanLine, IdCard, Activity, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { getBeltColor } from '../../components/CommonFormats';
import ConfirmModal from '../../components/admin/reusecomponents/ConfirmationModal';
import BeltModal from '../../components/admin/student/BeltModal';
import CertificateModal from '../../components/admin/student/CertificateModal';
import { formatDate } from '../../components/CommonFormats';
import ViewAchievementModal from '../../components/ViewAchievementModal';
import Belts from '../../components/Belts';
import { getAvatarUrlByName } from '../../components/student/AvatarPickerModal';
import PaymentDetails from '../../components/student/PaymentDetails';
import FeeModal from '../../components/admin/student/FeeModal';

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

const StudentView = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Now stores ALL belt records for this student, not just the latest
  const [belts, setBelts] = useState([]);
  const [beltLoading, setBeltLoading] = useState(true);

  // Modals state
  const [isBeltModalOpen, setIsBeltModalOpen] = useState(false);
  const [isBeltEditMode, setIsBeltEditMode] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null); // null = add mode, cert object = edit mode
  const [viewingCert, setViewingCert] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [feeid, setfeeId] = useState(null);
  const [beltToEditPosition, setBeltToEditPosition] = useState(null);

  // Belt delete state
  const [isDeleteBeltModalOpen, setIsDeleteBeltModalOpen] = useState(false);
  const [beltToDelete, setBeltToDelete] = useState(null);
  const [isDeletingBelt, setIsDeletingBelt] = useState(false);

  // ── payment status toggle state ─────────────────────────────────────────────
  const [isFullPayment, setIsFullPayment] = useState(false);
  const [paymentStatusSaving, setPaymentStatusSaving] = useState(false);

  useEffect(() => {
    fetchStudent();
    fetchBelt();
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const [studentRes, certsRes] = await Promise.all([
        api.get(`/students/${id}`),
        api.get(`/users/${id}/certificates`).catch(() => ({ data: { data: [] } }))
      ]);
      const studentData = studentRes.data?.data || studentRes.data;
      const certsData = certsRes.data?.data || certsRes.data || [];
      setStudent({
        ...studentData,
        certificates: certsData
      });
      setIsFullPayment(
        studentData?.is_full_payment === true ||
        studentData?.is_full_payment === 1 ||
        studentData?.is_full_payment === '1'
      );
    } catch (error) {
      console.error("Failed to fetch student", error);
      toast.error("Failed to load student details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBelt = async () => {
    try {
      setBeltLoading(true);
      const res = await api.get(`/belts/user/${id}`);
      const data = res.data?.data || res.data;
      // Normalize to an array regardless of whether the API returns one or many
      const records = Array.isArray(data) ? data : data ? [data] : [];
      setBelts(records);
    } catch (error) {
      console.error("Failed to fetch belt", error);
      setBelts([]);
    } finally {
      setBeltLoading(false);
    }
  };

  // ── payment status toggle — independent PATCH call, fires immediately on click ──
  const handleTogglePaymentStatus = async () => {
    if (!student) return;
    const newValue = !isFullPayment;
    const previous = isFullPayment;
    setIsFullPayment(newValue); // optimistic update

    try {
      setPaymentStatusSaving(true);
      await api.patch(`/users/${student.id}/payment-status`, {
        is_full_payment: newValue,
      });
      toast.success(newValue ? 'Marked as fully paid' : 'Marked as not fully paid');
    } catch (error) {
      setIsFullPayment(previous); // roll back on failure
      toast.error(error.response?.data?.message || 'Failed to update payment status');
    } finally {
      setPaymentStatusSaving(false);
    }
  };

  const handleEditCert = (cert) => {
    setEditingCert(cert);
    setIsCertModalOpen(true);
  };

  const handleViewCert = (cert) => {
    const fileUrls = Array.isArray(cert.certificated)
      ? cert.certificated.map(f =>
        f.startsWith('http') ? f : `${BASE_URL}${f.startsWith('/') ? '' : '/'}${f}`
      )
      : cert.file_url
        ? [cert.file_url]
        : [];

    setViewingCert({ ...cert, certificated: fileUrls });
    setIsViewModalOpen(true);
  };

  const handleDelete = async (certId) => {
    setCertToDelete(certId);
    setIsDeleteModalOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (!certToDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`/certificates/${certToDelete}`);
      toast.success('Certificate deleted successfully');
      fetchStudent()
      setIsDeleteModalOpen(false);
      setCertToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete certificate');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteBelt = (beltId) => {
    setBeltToDelete(beltId);
    setIsDeleteBeltModalOpen(true);
  };

  const handleDeleteBeltConfirm = async () => {
    if (!beltToDelete) return;
    try {
      setIsDeletingBelt(true);
      await api.delete(`/belts/${beltToDelete}`);
      toast.success('Belt record deleted successfully');
      fetchBelt();
      setIsDeleteBeltModalOpen(false);
      setBeltToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete belt record');
    } finally {
      setIsDeletingBelt(false);
    }
  };
  const handelfeeOpen = (id) => {
    setfeeId(id);
    setEditingFee(null);
    setIsFeeModalOpen(true);
  }
  const handelfeeClose = () => {
    setIsFeeModalOpen(false);
    setfeeId(null);
  }


  const StudentViewSkeleton = () => (
    <div className="w-full animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 animate-pulse" />
          <div>
            <div className="h-6 bg-gray-200 rounded w-40 mb-2 animate-pulse" />
            <div className="h-3.5 bg-gray-200 rounded w-56 animate-pulse" />
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <div className="h-11 w-28 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Top Row: Profile Summary + Personal Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-6">

        {/* Profile Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col overflow-hidden">
            <div className="p-6 pb-0 text-center shrink-0">
              <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mx-auto mb-4" />
              <div className="h-5 bg-gray-200 rounded w-32 mx-auto mb-2 animate-pulse" />
              <div className="h-3.5 bg-gray-200 rounded w-44 mx-auto mb-3 animate-pulse" />
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 bg-gray-200 rounded-full w-20 animate-pulse" />
                <div className="h-5 bg-gray-200 rounded-full w-16 animate-pulse" />
              </div>

              {/* Payment toggle */}
              <div className="border-t border-gray-50 mt-4 pt-3 pb-4">
                <div className="h-2.5 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
                <div className="h-11 bg-gray-100 rounded-xl w-full animate-pulse" />
              </div>
            </div>

            {/* Quick Facts x5 */}
            <div className="border-t border-gray-50 px-6 py-5 flex flex-col gap-4 flex-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-200 animate-pulse shrink-0" />
                  <div className="flex-1">
                    <div className="h-2.5 bg-gray-200 rounded w-20 mb-1.5 animate-pulse" />
                    <div className="h-3.5 bg-gray-200 rounded w-28 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full flex flex-col justify-center">
            <div className="h-5 bg-gray-200 rounded w-48 mb-6 pb-4 border-b border-gray-50 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                </div>
              ))}
              <div className="md:col-span-2">
                <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Belt Certification — full width */}
      <div className="bg-white/70 backdrop-blur-xl overflow-x-auto rounded-3xl p-6 border border-white/60 shadow-sm mb-6">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/50">
          <div className="w-8 h-8 rounded-xl bg-gray-200 animate-pulse shrink-0" />
          <div className="h-5 bg-gray-200 rounded w-40 animate-pulse" />
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg w-full animate-pulse" />
          ))}
        </div>
      </div>

      {/* Achievements — full width */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6">
        <div className="h-5 bg-gray-200 rounded w-40 mb-4 pb-4 border-b border-gray-50 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
              <div className="bg-gray-200 aspect-[4/3] animate-pulse" />
              <div className="p-3 border-t border-gray-50 flex flex-col gap-3">
                <div className="h-3.5 bg-gray-200 rounded w-3/4 mx-auto animate-pulse" />
                <div className="flex gap-2 w-full">
                  <div className="h-7 flex-1 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-7 flex-1 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Details — full width */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-3 md:p-6 border border-white/60 shadow-sm my-6">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gray-200 animate-pulse shrink-0" />
            <div className="h-5 bg-gray-200 rounded w-36 animate-pulse" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-xl w-full animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );


  if (loading) {
    return <StudentViewSkeleton />
  }

  if (!student) {
    return (
      <div className="text-center mt-20 text-gray-500">
        <p>Student not found.</p>
        <Link to="/admin/students" className="text-[#f97316] hover:underline mt-2 inline-block">Go back</Link>
      </div>
    );
  }

  // Small reusable field renderer for the Personal Information grid
  const InfoField = ({ icon: Icon, label, value }) => (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
        <Icon size={12} /> {label}
      </p>
      <p className="font-medium text-gray-900">{value || 'N/A'}</p>
    </div>
  );

  const genderLabel = student.gender
    ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1)
    : null;

  const isActive = String(student.status) === '1' || student.status === true || student.status === 'true' || student.status === 'active';

  // Latest belt for the top "Quick Facts" chip
  const latestBelt = belts[0] || null;
  const displayBelt = latestBelt?.belt_position || student.belt;
  const beltColors = getBeltColor(displayBelt);

  // resolve the stored avatar NAME into a renderable image URL
  const avatarImageUrl = student.avatar ? getAvatarUrlByName(student.avatar) : null;

  return (
    <div className="w-full animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/students" className="p-2 bg-white border border-gray-200 text-gray-600 rounded-full hover:bg-gray-50 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Student Profile</h1>
            <p className="text-sm text-gray-500 font-medium">Manage student details, belts, and certificates</p>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <button
            onClick={() => handelfeeOpen(student.id)}
            className="flex-1 sm:flex-none px-5 py-3 bg-primary hover:bg-primary/60 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#f97316]/20 shrink-0"
          >
            <Plus size={18} />{" "}
            <span className="hidden lg:inline">Add Fee</span>
          </button>
          <button
            onClick={() => { setIsBeltEditMode(false); setIsBeltModalOpen(true); }}
            className="px-3 py-1.5  bg-orange-50 text-[#f97316] border border-orange-200 font-bold rounded-lg flex items-center gap-1.5 hover:bg-orange-100 transition-colors text-xs shadow-sm"
          >
            <Award size={14} />
            Assign Belt
          </button>
          <button
            onClick={() => {
              setEditingCert(null);
              setIsCertModalOpen(true);
            }}
            className="px-3 py-1.5 bg-[#f97316] text-white font-bold rounded-lg flex items-center gap-1.5 hover:bg-orange-600 transition-colors text-xs shadow-md shadow-[#f97316]/20"
          >
            <FileText size={14} />
            Add Achievements
          </button>
        </div>
      </div>

      {/* Top Row: Avatar and Personal Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-6">

        {/* Left Col: Profile Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden h-full flex flex-col">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-[#f97316]/10 to-transparent"></div>

            <div className="p-6 pb-0 text-center relative z-10 shrink-0">
              <div className="w-24 h-24 bg-white shadow-md rounded-full mx-auto flex items-center justify-center text-[#f97316] text-4xl font-black mb-4 overflow-hidden">
                {avatarImageUrl ? (
                  <img src={avatarImageUrl} alt={`${student.name}'s avatar`} className="w-full h-full object-cover" />
                ) : (
                  student.name ? student.name.charAt(0).toUpperCase() : 'S'
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-1">{student.name}</h2>
              <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5 mb-3">
                <Mail size={13} className="text-gray-400 shrink-0" />
                <span className="truncate">{student.email}</span>
              </p>

              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 max-w-30 truncate py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 uppercase tracking-wide">
                  <IdCard size={12} /> {student.reg_no}
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  {isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              {/* Full Payment Status Toggle — fires its own PATCH call */}
              <div className="border-t border-gray-50 px-6 pt-3 shrink-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Full Payment Status</p>
                <button
                  type="button"
                  onClick={handleTogglePaymentStatus}
                  disabled={paymentStatusSaving}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${isFullPayment
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}
                >
                  <span className="text-sm font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={14} className={isFullPayment ? 'text-green-500' : 'text-amber-400'} />
                    {isFullPayment ? 'Fully Paid' : 'Payment Pending'}
                  </span>
                  <span
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isFullPayment ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isFullPayment ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                    />
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="border-t border-gray-50 px-6 py-5 flex flex-col gap-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#f97316] flex items-center justify-center shrink-0">
                  <Award size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Belt</p>
                  <span className={`inline-flex items-center mt-0.5 px-2 py-0.5 rounded-md text-xs font-bold border ${beltColors.bg} ${beltColors.text} ${beltColors.border}`}>
                    {displayBelt || 'Unranked'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <BookOpen size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Batch</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{student.batch?.name || student.batch_name || 'Unassigned'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Building2 size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Branch / Dojo</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{student.branch_id || student.branch_name || 'Unassigned'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Phone size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mobile Number</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{student.mobile_number || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Calendar size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Joined On</p>
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {student.created_at ? formatDate(student.created_at) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Details */}
        <div className="lg:col-span-2">

          {/* Info Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full flex flex-col justify-center">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4 shrink-0">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField icon={User} label="Father's Name" value={student.father_name} />
              <InfoField icon={Users} label="Mother's Name" value={student.mother_name} />
              <InfoField icon={Activity} label="Gender" value={genderLabel} />
              <InfoField
                icon={Calendar}
                label="Date of Birth"
                value={student.date_of_birth ? formatDate(new Date(student.date_of_birth).toLocaleDateString()) : null}
              />
              <InfoField icon={Ruler} label="Height" value={student.height ? `${student.height} cm` : null} />
              <InfoField icon={Weight} label="Weight" value={student.weight ? `${student.weight} kg` : null} />
              <InfoField
                icon={Calendar}
                label="Joining Date"
                value={student.joining_date ? formatDate(new Date(student.joining_date).toLocaleDateString()) : null}
              />
              <InfoField icon={UserCog} label="Sensei (Coach)" value={student.sensei} />
              <InfoField icon={IndianRupee} label="Total Fee" value={student.total_fee ? `₹${student.total_fee}` : '₹0.00'} />
              <InfoField icon={ScanLine} label="ID Proof Name" value={student.id_proof_name} />
              <InfoField icon={IdCard} label="ID Proof Number" value={student.id_proof_number} />
              <div className="md:col-span-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin size={12} /> Address</p>
                <p className="font-medium text-gray-900">{student.address || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><StickyNote size={12} /> Notes</p>
                <p className="font-medium rounded-2xl py-1.5 truncate line-clamp-2 text-wrap text-gray-900">{student.notes || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Belt Progression — full width, glass-card style to match student dashboard */}
      <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl overflow-x-auto rounded-3xl p-6 border border-white/60 dark:border-slate-800 shadow-sm mb-6">

        <div className="flex items-center justify-between border-b border-white/50 dark:border-slate-800 pb-4 mb-4">
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#f97316]/10 text-[#f97316] flex items-center justify-center">
              <Award size={16} />
            </span>
            Belt Certification
          </h4>

          <button
            onClick={() => { setIsBeltEditMode(true); setIsBeltModalOpen(true); }}
            className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 font-bold rounded-lg flex items-center gap-1.5 hover:bg-blue-100 transition-colors text-xs shadow-sm"
          >
            <Edit size={14} />
            Edit Belt
          </button>
        </div>

        {belts && (
          <div className="grid grid-cols-2 lg:py-4 lg:px-3 w-full lg:grid-cols-1 overflow-x-auto lg:gap-6 items-start">
            <Belts
              belts={belts}
              onDeleteBelt={handleDeleteBelt}
              onEditBelt={(details) => {
                setBeltToEditPosition(details.belt_position);
                setIsBeltEditMode(true);
                setIsBeltModalOpen(true);
              }}
            />
          </div>
        )}
      </div>

      {/* Achievements — full width */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h4 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-4 shrink-0">Achievements</h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

          {student.certificates && student.certificates.length > 0 ? student.certificates.map(cert => {
            const fileUrls = Array.isArray(cert.certificated)
              ? cert.certificated.map(f =>
                f.startsWith('http') ? f : `${BASE_URL}${f.startsWith('/') ? '' : '/'}${f}`
              )
              : cert.file_url
                ? [cert.file_url]
                : [];

            const thumbUrl = fileUrls[0] || null;

            return (
              <div
                key={cert.id || Math.random()}
                onClick={() => handleViewCert(cert)}
                className="cursor-pointer border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group bg-white"
              >
                <div className="bg-gray-50 aspect-[4/3] flex items-center justify-center relative overflow-hidden">
                  {thumbUrl ? (
                    thumbUrl.toLowerCase().endsWith('.pdf') ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 group-hover:scale-105 transition-transform">
                        <FileText className="text-red-500 mb-1" size={24} />
                        <span className="text-[10px] font-bold text-gray-500">PDF</span>
                      </div>
                    ) : (
                      <img src={thumbUrl} alt={cert.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform" />
                    )
                  ) : (
                    <Image className='text-gray-400' size={78} />
                   
                  )}
                  {fileUrls.length > 1 && (
                    <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                      +{fileUrls.length - 1}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold px-3 py-1 bg-black/50 rounded-full backdrop-blur-sm">View</span>
                  </div>
                </div>
                <div className="p-3 border-t border-gray-50 flex flex-col gap-3">
                  <p className="text-xs font-bold text-gray-900 truncate text-center" title={cert.title}>{cert.title}</p>
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditCert(cert); }}
                      className="flex-1 flex items-center w-8 h-8 justify-center gap-1.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-[11px] font-bold"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(cert.id); }}
                      className="flex-1 flex items-center w-8 h-8 justify-center gap-1.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-[11px] font-bold"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )
          }) : (
            <div className="col-span-full py-8 text-center text-gray-400 font-medium">
              No certificates uploaded for this student yet.
            </div>
          )}

        </div>
      </div>
      <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-3 md:p-6 border border-white/60 dark:border-slate-800 shadow-sm my-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-white/50 dark:border-slate-800 flex items-center pb-4 gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#f97316]/10 text-[#f97316] flex items-center justify-center">
              <IndianRupee size={16} />
            </span>
            Payment Details
          </h4>

          <span className=' px-2 text-nowrap lg:px-6 uppercase font-bold' >Total fee : <span>{student.total_fee}</span></span>
        </div>
        <PaymentDetails isAdmin={true} studentId={student.id} />

      </div>

      {/* VIEW ACHIEVEMENT MODAL */}
      <ViewAchievementModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        certificate={viewingCert}
      />

      {/* BELT MODAL */}
      <BeltModal
        isOpen={isBeltModalOpen}
        onClose={() => { setIsBeltModalOpen(false); setBeltToEditPosition(null); }}
        student={student}
        isEdit={isBeltEditMode}
        initialBeltPosition={beltToEditPosition}
        onSuccess={() => { fetchBelt(); }}
      />

      {/* CERTIFICATE MODAL */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        studentId={id}
        editingCert={editingCert}
        onSuccess={fetchStudent}
      />

      {/* DELETE CERTIFICATE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Certificate?"
        message="Are you sure you want to delete this Certificate? This action cannot be undone."
        type="delete"
        isLoading={isDeleting}
      />

      {/* DELETE BELT CONFIRM MODAL */}
      <ConfirmModal
        isOpen={isDeleteBeltModalOpen}
        onClose={() => setIsDeleteBeltModalOpen(false)}
        onConfirm={handleDeleteBeltConfirm}
        title="Delete Belt Record?"
        message="Are you sure you want to delete this belt certification? This action cannot be undone."
        type="delete"
        isLoading={isDeletingBelt}
      />
      <FeeModal
        isOpen={isFeeModalOpen}
        onClose={handelfeeClose}
        studentId={feeid}
        editingFee={editingFee}
        onSuccess={fetchStudent}
      />

    </div>
  );
};

export default StudentView;