import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

const EMPTY_FORM = {
  title: '',
  tournament_played: '',
  medals: '',
  venue: '',
  date: '',
  certificate_number: '',
  file: null,
};

const getFileNameFromUrl = (url) => {
  if (!url) return null;
  return url.split('/').pop();
};
// Resolve a stored path/URL from editingCert into an absolute, viewable URL
const resolveExistingFileUrl = (editingCert) => {
  if (!editingCert) return null;

  const raw = Array.isArray(editingCert.certificated)
    ? editingCert.certificated[0]
    : editingCert.file_url;

  if (!raw) return null;

  return raw.startsWith('http') ? raw : `${BASE_URL}${raw.startsWith('/') ? '' : '/'}${raw}`;
};

const isPdfUrl = (url) => !!url && url.toLowerCase().endsWith('.pdf');

const CertificateModal = ({ isOpen, onClose, studentId, editingCert = null, onSuccess }) => {
  const [certForm, setCertForm] = useState(EMPTY_FORM);
  const [existingFileName, setExistingFileName] = useState(null);
  const [existingFileUrl, setExistingFileUrl] = useState(null);
  const [newFilePreviewUrl, setNewFilePreviewUrl] = useState(null);
  const [certerror, setCerterror] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingCert) {
        setCertForm({
          title: editingCert.title || '',
          tournament_played: editingCert.tournament_played || '',
          medals: editingCert.medals || '',
          venue: editingCert.venue || '',
          date: editingCert.date || '',
          certificate_number: editingCert.certificate_number || '',
          file: null,
        });
        setExistingFileName(getFileNameFromUrl(editingCert.certificated?.[0]));
        setExistingFileUrl(resolveExistingFileUrl(editingCert));
      } else {
        setCertForm(EMPTY_FORM);
        setExistingFileName(null);
        setExistingFileUrl(null);
      }
      setCerterror(false);
    }
  }, [isOpen, editingCert]);

  // Build/revoke a local preview URL whenever a new file is picked
  useEffect(() => {
    if (!certForm.file) {
      setNewFilePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(certForm.file);
    setNewFilePreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [certForm.file]);

  const handleClose = () => {
    setCerterror(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!certForm.title) return toast.error('Please enter a certificate title');
    // if (!editingCert && !certForm.file) {
    //   setCerterror(true);
    //   return toast.error('Please upload a certificate');
    // }

    try {
      setIsSubmitting(true);
      toast.loading(editingCert ? 'Updating certificate...' : 'Uploading certificate...', { id: 'cert' });

      const formData = new FormData();
      formData.append('user_id', studentId);
      formData.append('title', certForm.title);
      formData.append('tournament_played', certForm.tournament_played);
      formData.append('medals', certForm.medals);
      formData.append('venue', certForm.venue);
      formData.append('date', certForm.date);
      formData.append('certificate_number', certForm.certificate_number);
      if (certForm.file) formData.append('certificated[]', certForm.file);

      if (editingCert) {
        await api.post(`/certificates/${editingCert.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post(`/certificates`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      toast.success(editingCert ? 'Certificate updated!' : 'Certificate added successfully!', { id: 'cert' });
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to process certificate.', { id: 'cert' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only preview a NEWLY selected file while uploading — not the existing certificate.
  const previewUrl = newFilePreviewUrl;
  const previewIsPdf = certForm.file ? certForm.file.type === 'application/pdf' : false;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div className="bg-white w-full max-w-3xl rounded-[1.5rem] px-5  shadow-2xl flex flex-col max-h-[85dvh] pointer-events-auto overflow-hidden">

              {/* Header */}
              <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-50 shrink-0 bg-white">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                  {editingCert ? 'Edit Achievement' : 'Add Achievement'}
                </h3>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Form Body */}

              <form id="cert-form" onSubmit={handleSubmit} className="p-4 sm:p-5 scrollbar-thin overflow-y-auto flex-1 custom-scrollbar">

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="mb-0">
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
                  <div>
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

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Medals</label>
                    <input
                      type="text"
                      value={certForm.medals}
                      onChange={(e) => setCertForm({ ...certForm, medals: e.target.value })}
                      placeholder="e.g. Gold"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Venue</label>
                    <input
                      type="text"
                      value={certForm.venue}
                      onChange={(e) => setCertForm({ ...certForm, venue: e.target.value })}
                      placeholder="e.g. Bhubaneswar Indoor Stadium"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={certForm.date}
                      onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Certificate Number</label>
                    <input
                      type="text"
                      value={certForm.certificate_number}
                      onChange={(e) => setCertForm({ ...certForm, certificate_number: e.target.value })}
                      placeholder="e.g. CERT-2026-0142"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                    />
                  </div>
                </div>

                {/* Preview — sits above the dropzone, separate from it, fixed height 22 (5.5rem/88px) */}
                <div className="flex flex-row gap-2">
                  {previewUrl && (
                    <div className="mt-4 order-1 flex items-center gap-3 p-2.5 rounded-xl ">
                      {previewIsPdf ? (
                        <div className="h-[5.5rem] w-[5.5rem] shrink-0 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                          <FileText size={28} className="text-red-500" />
                        </div>
                      ) : (
                        <img
                          src={previewUrl}
                          alt="Certificate preview"
                          className="h-[5.5rem] w-auto max-w-[5.5rem] rounded-lg object-contain bg-white border border-gray-200"
                        />
                      )}

                    </div>
                  )}

                  <div className=" order-2 w-full mb-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Upload File</label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative ${certerror ? 'border-red-500' : 'border-gray-200'
                        }`}
                    >
                      <input
                        type="file"
                        accept=".jpg, .jpeg, .png, image/jpeg, image/png"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          // if (!file) return;

                          const MAX_FILE_SIZE_MB = 2;
                          if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                            toast.error(`Image must be smaller than ${MAX_FILE_SIZE_MB}MB.`);
                            e.target.value = '';
                            return;
                          }

                          setCerterror(false);
                          setExistingFileName(null);
                          setCertForm({ ...certForm, file });
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 font-medium">
                        {certForm.file ? (
                          certForm.file.name
                        ) : existingFileName ? (
                          <>Click to replace current file: <span className="text-gray-700">{existingFileName}</span></>
                        ) : (
                          'Click to browse or drag file here JPG, JPEG or PNG · Max 2MB'
                        )}
                      </span>
                    </div>

                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-4 sm:p-5 border-t border-gray-50 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 text-sm font-bold shadow-sm text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="cert-form"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-[#f97316] hover:bg-orange-600 rounded-xl transition-all shadow-md shadow-orange-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {editingCert ? 'Update Certificate' : 'Save Certificate'}
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CertificateModal;
