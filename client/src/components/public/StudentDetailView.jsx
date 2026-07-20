import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Award, Users, DollarSign, Calendar, Shield, FileText, Eye, X } from 'lucide-react';
import api from '../../api/axios';
import { getBeltColor } from '../CommonFormats';



const StudentDetailView = ({ student, onBack }) => {
  const [certificates, setCertificates] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!student?.id) return;

    const fetchCertificates = async () => {
      setFetching(true);
      setCertificates([]);
      try {
        const response = await api.get(`/users/${student.id}/certificates`);
        const data = response.data?.data || response.data;
        setCertificates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch certificate:", err);
        setCertificates([]);
      } finally {
        setFetching(false);
      }
    };

    fetchCertificates();
  }, [student?.id]);

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
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              REG NO: {student.reg_no}
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

        {/* <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
          <DollarSign size={16} className="text-gray-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Fee</p>
            <p className="text-sm font-semibold text-gray-900">₹{student.total_fee}</p>
          </div>
        </div> */}

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

      {/* Certificate Section */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Certificate</h3>

        {fetching ? (
          <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
        ) : certificates.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
            <FileText size={18} className="text-gray-300 shrink-0" />
            <p className="text-sm text-gray-400 font-medium">No certificates issued yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {certificates.map((cert) => {
              const certUrl =
                Array.isArray(cert.certificated) && cert.certificated.length > 0
                  ? `${ import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "")}${cert.certificated[0]}`
                  : null;

              return (
                <div
                  key={cert.id}
                  className="flex items-center justify-between gap-3 p-4 rounded-xl border border-emerald-100 bg-emerald-50/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate capitalize">
                        {cert.title || 'Certificate'}
                      </p>
                      <p className="text-[11px] text-gray-500 font-medium">
                        Issued{' '}
                        {cert.created_at
                          ? new Date(cert.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {certUrl && (
                    <button
                      onClick={() => setPreviewUrl(certUrl)}
                      className="flex items-center gap-2 text-xs font-bold text-white bg-[#0b1b24] hover:bg-emerald-600 px-4 py-2 rounded-lg transition-colors shrink-0"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Certificate Preview Modal — rendered once, outside the list */}
      {previewUrl && (
        <div
          className="fixed w-full h-full inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="relative bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-3 right-3 text-[#0b1b24] hover:text-emerald-600"
            >
              <X size={20} />
            </button>

            {previewUrl.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={previewUrl}
                title="Certificate"
                className="w-full h-[80vh] rounded-lg"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Certificate"
                className="w-full h-auto rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StudentDetailView;