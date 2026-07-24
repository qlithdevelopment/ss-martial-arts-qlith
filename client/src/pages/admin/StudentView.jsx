import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Users, Mail, Award, BookOpen, Calendar, IndianRupee, FileText, Plus, X, Upload, Edit, Trash2, RefreshCw, Download, Ruler, Weight, MapPin, Phone, Building2, UserCog, ScanLine, IdCard, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { getBeltColor } from '../../components/CommonFormats';
import ConfirmModal from '../../components/admin/reusecomponents/ConfirmationModal';
import { formatDate } from '../../components/CommonFormats';

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

const StudentView = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isBeltModalOpen, setIsBeltModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [previewCert, setPreviewCert] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [certerror, setCerterror] = useState(false)

  // Forms state
  const [beltForm, setBeltForm] = useState({ belt_name: '', awarded_date: new Date().toISOString().split('T')[0] });
  const [certForm, setCertForm] = useState({
    title: '',
    tournament_played: '',
    medals: '',
    venue: '',
    date: '',
    certificate_number: '',
    file: null,
  });
  const [editingCertId, setEditingCertId] = useState(null);

  useEffect(() => {
    fetchStudent();
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
    } catch (error) {
      console.error("Failed to fetch student", error);
      toast.error("Failed to load student details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBelt = async (e) => {
    e.preventDefault();
    if (!beltForm.belt_name) return toast.error("Please select a belt");

    try {
      toast.loading("Assigning belt...", { id: "belt" });

      const isCurrentlyActive = String(student.status) === '1' || student.status === true || String(student.status).toLowerCase() === 'active' || student.status === 'true';

      // Send the full student record back so update() doesn't null out any fields —
      // only `belt` (and `belt_awarded_date`, if the column exists) actually change.
      const payload = {
        reg_no: student.reg_no,
        name: student.name,
        father_name: student.father_name || '',
        mother_name: student.mother_name || '',
        gender: student.gender || '',
        date_of_birth: student.date_of_birth || '',
        height: student.height || '',
        weight: student.weight || '',
        address: student.address || '',
        mobile_number: student.mobile_number || '',
        joining_date: student.joining_date || '',
        email: student.email,
        batch_id: student.batch_id || student.batch?.id,
        branch_id: student.branch_id || '',
        sensei: student.sensei || '',
        total_fee: student.total_fee || 0,
        notes: student.notes || '',
        id_proof_name: student.id_proof_name || '',
        id_proof_number: student.id_proof_number || '',
        status: isCurrentlyActive ? 1 : 0,
        belt: beltForm.belt_name,
        belt_awarded_date: beltForm.awarded_date,
      };

      await api.put(`/students/${id}`, payload);

      // Update belt (and its color) immediately, without waiting for the refetch
      setStudent((prev) => ({ ...prev, belt: beltForm.belt_name, belt_awarded_date: beltForm.awarded_date }));

      toast.success("Belt assigned successfully!", { id: "belt" });
      setIsBeltModalOpen(false);
      setBeltForm({ belt_name: '', awarded_date: new Date().toISOString().split('T')[0] });
      fetchStudent(); // Sync with server in the background
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to assign belt.", { id: "belt" });
    }
  };

  const handleAddCertificate = async (e) => {
    e.preventDefault();
    if (!certForm.title) return toast.error("Please enter a certificate title");
    if (!certForm.file) {
      setCerterror(true)
      return toast.error("Please upload a certificate");
    }
    try {
      toast.loading(editingCertId ? "Updating certificate..." : "Uploading certificate...", { id: "cert" });
      const formData = new FormData();
      formData.append('user_id', id);
      formData.append('title', certForm.title);
      if (certForm.file) formData.append('certificated[]', certForm.file);

      if (editingCertId) {
        await api.post(`/certificates/${editingCertId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post(`/certificates`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      toast.success(editingCertId ? "Certificate updated!" : "Certificate added successfully!", { id: "cert" });
      setIsCertModalOpen(false);
      setCertForm({ title: '', file: null });
      setEditingCertId(null);
      fetchStudent(); // Refresh student data
    } catch (error) {
      console.error(error);
      toast.error("Failed to process certificate.", { id: "cert" });
    }
  };

  const handleEditCert = (cert) => {
    setEditingCertId(cert.id);
    setCertForm({ title: cert.title, file: null });
    setIsCertModalOpen(true);
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

  const StudentViewSkeleton = () => (
    <div className="w-full animate-fadeIn">
      {/* Header Skeleton */}
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
        <div className="flex items-center gap-4">
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-28 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Top Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-6">
        {/* Profile Summary Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col overflow-hidden">
            <div className="p-6 text-center flex flex-col items-center shrink-0">
              <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mb-4" />
              <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
              <div className="h-3.5 bg-gray-200 rounded w-40 mb-3 animate-pulse" />
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 bg-gray-200 rounded-full w-20 animate-pulse" />
                <div className="h-5 bg-gray-200 rounded-full w-16 animate-pulse" />
              </div>
            </div>
            <div className="border-t border-gray-50 px-6 py-5 flex flex-col gap-4 flex-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-200 animate-pulse shrink-0" />
                  <div className="flex-1">
                    <div className="h-2.5 bg-gray-200 rounded w-16 mb-1.5 animate-pulse" />
                    <div className="h-3.5 bg-gray-200 rounded w-24 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full flex flex-col justify-center">
            <div className="h-5 bg-gray-200 rounded w-48 mb-6 pb-4 border-b border-gray-50 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Skeleton */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div className="h-5 bg-gray-200 rounded w-36 mb-4 pb-4 border-b border-gray-50 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
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

        <div className="flex gap-2">
          <button
            onClick={() => setIsBeltModalOpen(true)}
            className="px-3 py-1.5 bg-orange-50 text-[#f97316] border border-orange-200 font-bold rounded-lg flex items-center gap-1.5 hover:bg-orange-100 transition-colors text-xs shadow-sm"
          >
            <Award size={14} />
            Assign Belt
          </button>
          <button
            onClick={() => {
              setEditingCertId(null);
              setCertForm({ title: '', file: null });
              setIsCertModalOpen(true);
            }}
            className="px-3 py-1.5 bg-[#f97316] text-white font-bold rounded-lg flex items-center gap-1.5 hover:bg-orange-600 transition-colors text-xs shadow-md shadow-[#f97316]/20"
          >
            <FileText size={14} />
            Add Certificate
          </button>
        </div>
      </div>

      {/* Top Row: Avatar and Personal Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-6">

        {/* Left Col: Profile Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden h-full flex flex-col">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-[#f97316]/10 to-transparent"></div>

            <div className="p-6 text-center relative z-10 shrink-0">
              <div className="w-24 h-24 bg-white border-4 border-white shadow-md rounded-full mx-auto flex items-center justify-center text-[#f97316] text-4xl font-black mb-4">
                {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-1">{student.name}</h2>
              <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5 mb-3">
                <Mail size={13} className="text-gray-400 shrink-0" />
                <span className="truncate">{student.email}</span>
              </p>

              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 uppercase tracking-wide">
                  <IdCard size={12} /> {student.reg_no}
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  {isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
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
                  <span className={`inline-flex items-center mt-0.5 px-2 py-0.5 rounded-md text-xs font-bold border ${getBeltColor(student.belt).bg} ${getBeltColor(student.belt).text} ${getBeltColor(student.belt).border}`}>
                    {student.belt || 'Unranked'}
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
                    {student.created_at ? formatDate(new Date(student.created_at).toLocaleDateString()) : 'N/A'}
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
            </div>

            {student.notes && (
              <div className="mt-6 pt-6 border-t border-gray-50 shrink-0">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">{student.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Certificates Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h4 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-4 shrink-0">Certificates</h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {student.certificates && student.certificates.length > 0 ? student.certificates.map(cert => {
            let fileUrl = null;
            if (cert.certificated && cert.certificated.length > 0) {
              fileUrl = cert.certificated[0];
              if (!fileUrl.startsWith('http')) {
                // Ensure we hit the Laravel server, not the Vite server
                fileUrl = `${BASE_URL}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
              }
            } else if (cert.file_url) {
              fileUrl = cert.file_url;
            }

            return (
              <div
                key={cert.id || Math.random()}
                onClick={() => setPreviewCert({ ...cert, file_url: fileUrl })}
                className="cursor-pointer border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group bg-white"
              >
                <div className="bg-gray-50 aspect-[4/3] flex items-center justify-center relative overflow-hidden">
                  {fileUrl ? (
                    fileUrl.toLowerCase().endsWith('.pdf') ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 group-hover:scale-105 transition-transform">
                        <FileText className="text-red-500 mb-1" size={24} />
                        <span className="text-[10px] font-bold text-gray-500">PDF</span>
                      </div>
                    ) : (
                      <img src={fileUrl} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    )
                  ) : (
                    <FileText className="text-gray-300" size={32} />
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
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-[11px] font-bold"
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(cert.id); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-[11px] font-bold"
                    >
                      <Trash2 size={12} /> Delete
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

      {/* PREVIEW CERTIFICATE MODAL */}
      <AnimatePresence>
        {previewCert && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewCert(null)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                <h3 className="text-lg font-bold text-gray-900">{previewCert.title}</h3>
                <button onClick={() => setPreviewCert(null)} className="text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 overflow-auto flex-1 flex items-center justify-center bg-gray-50">
                {previewCert.file_url ? (
                  previewCert.file_url.toLowerCase().endsWith('.pdf') ? (
                    <div className="w-full h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                      <div className="bg-gray-50 p-3 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 shrink-0">
                        <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                          <Download size={14} /> PDF Document
                        </span>
                        <a
                          href={previewCert.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-sm"
                        >
                          Open / Download PDF
                        </a>
                      </div>
                      <iframe src={previewCert.file_url} className="w-full flex-1 min-h-[60vh] bg-gray-100" title="Certificate PDF" />
                    </div>
                  ) : (
                    <img src={previewCert.file_url} alt={previewCert.title} className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-sm border border-gray-200" />
                  )
                ) : (
                  <div className="text-center text-gray-400 py-20">
                    <FileText size={64} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-bold">No image available</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* BELT MODAL */}
      <AnimatePresence>
        {isBeltModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCertModalOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-white rounded-3xl shadow-xl z-50 max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                <h3 className="text-lg font-bold text-gray-900">{editingCertId ? "Edit Certificate" : "Add Certificate"}</h3>
                <button onClick={() => setIsCertModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <div className="overflow-y-auto flex-1 min-h-0">
                <form onSubmit={handleAddCertificate} className="p-6">
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Belt</label>
                    <select
                      value={beltForm.belt_name}
                      onChange={(e) => setBeltForm({ belt_name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                      required
                    >
                      <option value="">Choose a belt...</option>
                      <option value="White Belt">White Belt</option>
                      <option value="Yellow Belt">Yellow Belt</option>
                      <option value="Orange Belt">Orange Belt</option>
                      <option value="Green Belt">Green Belt</option>
                      <option value="Blue Belt">Blue Belt</option>
                      <option value="Purple Belt">Purple Belt</option>
                      <option value="Brown Belt">Brown Belt</option>
                      <option value="Red Belt">Red Belt</option>
                      <option value="Black Belt">Black Belt</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Awarded Date</label>
                    <input
                      type="date"
                      value={beltForm.awarded_date}
                      onChange={(e) => setBeltForm({ ...beltForm, awarded_date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full py-3 bg-[#f97316] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors">
                    Assign Belt
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CERTIFICATE MODAL */}
      <AnimatePresence>
        {isCertModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCertModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
            >
              <div className="bg-white w-full max-w-md rounded-[1.5rem] shadow-2xl flex flex-col max-h-[85dvh] pointer-events-auto overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-50 shrink-0 bg-white">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">
                    {editingCertId ? "Edit Certificate" : "Add Certificate"}
                  </h3>
                  <button
                    onClick={() => setIsCertModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <X size={20} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Form Body */}
                <form id="cert-form" onSubmit={handleAddCertificate} className="p-4 sm:p-5 scrollbar-thin overflow-y-auto flex-1 custom-scrollbar">

                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Certificate Title</label>
                    <input
                      type="text"
                      value={certForm.title}
                      onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                      placeholder="e.g. 1st Place Sparring"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tournament Played</label>
                    <input
                      type="text"
                      value={certForm.tournament_played}
                      onChange={(e) => setCertForm({ ...certForm, tournament_played: e.target.value })}
                      placeholder="e.g. State Level Karate Championship"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Medals</label>
                    <input
                      type="text"
                      value={certForm.medals}
                      onChange={(e) => setCertForm({ ...certForm, medals: e.target.value })}
                      placeholder="e.g. Gold"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Venue</label>
                    <input
                      type="text"
                      value={certForm.venue}
                      onChange={(e) => setCertForm({ ...certForm, venue: e.target.value })}
                      placeholder="e.g. Bhubaneswar Indoor Stadium"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={certForm.date}
                      onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Certificate Number</label>
                    <input
                      type="text"
                      value={certForm.certificate_number}
                      onChange={(e) => setCertForm({ ...certForm, certificate_number: e.target.value })}
                      placeholder="e.g. CERT-2026-0142"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Upload File</label>
                    <div className={`border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative`}>
                      <input
                        type="file"
                        accept=".jpg, .jpeg, .png, image/jpeg, image/png"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          const MAX_FILE_SIZE_MB = 2;
                          if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                            toast.error(`Image must be smaller than ${MAX_FILE_SIZE_MB}MB.`);
                            e.target.value = ''; // reset so the same oversized file can be re-selected after fixing
                            return;
                          }

                          setCertForm({ ...certForm, file });
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 font-medium">
                        {certForm.file ? certForm.file.name : "Click to browse or drag file here JPG, JPEG or PNG · Max 2MB"}
                      </span>
                    </div>
                  </div>
                </form>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-4 sm:p-5 border-t border-gray-50 shrink-0 bg-white">
                  <button
                    type="button"
                    onClick={() => setIsCertModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-bold shadow-sm text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="cert-form"
                    className="px-5 py-2.5 text-sm font-bold text-white bg-[#f97316] hover:bg-orange-600 rounded-xl transition-all shadow-md shadow-orange-500/20"
                  >
                    {editingCertId ? "Update Certificate" : "Save Certificate"}
                  </button>
                </div>

              </div>
            </motion.div>
          </>
        )}

      </AnimatePresence>
      < ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Certificate?"
        message="Are you sure you want to delete this Certificate? This action cannot be undone."
        type="delete"
        isLoading={isDeleting}
      />

    </div>
  );
};

export default StudentView;