import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Mail, Award, BookOpen, Calendar, IndianRupee, FileText, Plus, X, Upload, Edit, Trash2, RefreshCw, Download } from 'lucide-react';
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
  // Forms state
  const [beltForm, setBeltForm] = useState({ belt_name: '', awarded_date: new Date().toISOString().split('T')[0] });
  const [certForm, setCertForm] = useState({ title: '', file: null });
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

      // Update the student using the existing PUT endpoint
      const payload = {
        name: student.name,
        email: student.email,
        reg_no: student.reg_no,
        batch_id: student.batch_id || student.batch?.id,
        total_fee: student.total_fee || 0,
        notes: student.notes || '',
        status: String(student.status) === '1' || student.status === true || String(student.status).toLowerCase() === 'active' || student.status === 'true' ? 1 : 0,
        belt: beltForm.belt_name
      };

      await api.put(`/students/${id}`, payload);

      toast.success("Belt assigned successfully!", { id: "belt" });
      setIsBeltModalOpen(false);
      setBeltForm({ belt_name: '', awarded_date: new Date().toISOString().split('T')[0] });
      fetchStudent(); // Refresh student data
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to assign belt.", { id: "belt" });
    }
  };

  const handleAddCertificate = async (e) => {
    e.preventDefault();
    if (!certForm.title) return toast.error("Please enter a certificate title");

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
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center h-full flex flex-col justify-center items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mb-4" />
            <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
            <div className="h-3.5 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded-full w-28 animate-pulse" />
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
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center relative overflow-hidden h-full flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-[#f97316]/10 to-transparent"></div>

            <div className="w-24 h-24 bg-white border-4 border-white shadow-md rounded-full mx-auto relative z-10 flex items-center justify-center text-[#f97316] text-4xl font-black mb-4">
              {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-1">{student.name}</h2>
            <p className="text-sm text-gray-500 mb-1">{student.email}</p>
            <p className="text-sm text-gray-500 uppercase mb-2"><span className='font-medium'>REG NO: </span>{student.reg_no}</p>

            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${String(student.status) === '1' || student.status === true || student.status === 'true' || student.status === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
              }`}>
              {String(student.status) === '1' || student.status === true || student.status === 'true' || student.status === 'active' ? 'ACTIVE STUDENT' : 'INACTIVE'}
            </span>
          </div>
        </div>

        {/* Right Col: Details */}
        <div className="lg:col-span-2">

          {/* Info Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full flex flex-col justify-center">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4 shrink-0">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><BookOpen size={12} /> Batch</p>
                <p className="font-medium text-gray-900">{student.batch?.name || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><IndianRupee size={12} /> Total Fee</p>
                <p className="font-medium text-gray-900">₹{student.total_fee || '0.00'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar size={12} /> Joined Date</p>
                <p className="font-medium text-gray-900">{student.created_at ? formatDate(new Date(student.created_at).toLocaleDateString()) : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Award size={12} /> Current Belt</p>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border shadow-sm ${getBeltColor(student.belt).bg} ${getBeltColor(student.belt).text} ${getBeltColor(student.belt).border}`}>
                  <Award size={14} />
                  <span className="font-bold text-xs">{student.belt || 'Unranked'}</span>
                </div>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBeltModalOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-white rounded-3xl shadow-xl z-50 overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Assign New Belt</h3>
                <button onClick={() => setIsBeltModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddBelt} className="p-6">
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
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CERTIFICATE MODAL */}
      <AnimatePresence>
        {isCertModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCertModalOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-white rounded-3xl shadow-xl z-50 overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">{editingCertId ? "Edit Certificate" : "Add Certificate"}</h3>
                <button onClick={() => setIsCertModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddCertificate} className="p-6">
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
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Upload File (Optional)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      onChange={(e) => setCertForm({ ...certForm, file: e.target.files[0] })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 font-medium">
                      {certForm.file ? certForm.file.name : "Click to browse or drag file here"}
                    </span>
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-[#f97316] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors">
                  {editingCertId ? "Update Certificate" : "Save Certificate"}
                </button>
              </form>
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
