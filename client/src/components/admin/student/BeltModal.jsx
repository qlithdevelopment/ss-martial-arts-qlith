import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axios';

const BELT_OPTIONS = [
  'White Belt',
  'Yellow Belt',
  'Orange Belt',
  'Green Belt',
  'Blue Belt',
  'Purple Belt',
  'Brown 1 Belt ',
  'Brown 2 Belt ',
  'Brown 3 Belt ',
  'Red 1 Belt',
  'Red 2 Belt',
  'Black Belt',
];

const todayISO = () => new Date().toISOString().split('T')[0];

const emptyForm = {
  kyu_no: '',
  belt_position: '',
  certification_no: '',
  date_of_issue: todayISO(),
};

const BeltModal = ({ isOpen, onClose, student, onSuccess }) => {
  const [beltForm, setBeltForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBeltForm(emptyForm);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!beltForm.kyu_no) return toast.error('Please enter a kyu number');
    if (!beltForm.belt_position) return toast.error('Please select a belt');
    if (!beltForm.certification_no) return toast.error('Please enter a certification number');
    if (!beltForm.date_of_issue) return toast.error('Please select a date of issue');
    if (!student) return;

    const userId = student.user_id || student.id;

    try {
      setIsSubmitting(true);
      toast.loading('Assigning belt...', { id: 'belt' });

      const payload = {
        kyu_no: beltForm.kyu_no,
        belt_position: beltForm.belt_position,
        certification_no: beltForm.certification_no,
        date_of_issue: beltForm.date_of_issue,
        user_id: userId,
      };

      await api.post('/belts', payload);

      toast.success('Belt assigned successfully!', { id: 'belt' });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to assign belt.', { id: 'belt' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-white rounded-3xl shadow-xl z-50 max-h-[90vh] flex flex-col overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h3 className="text-lg font-bold text-gray-900">Assign Belt</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 min-h-0">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Belt position</label>
                    <select
                      value={beltForm.belt_position}
                      onChange={(e) => setBeltForm({ ...beltForm, belt_position: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                      required
                    >
                      <option value="">Choose a belt...</option>
                      {BELT_OPTIONS.map((belt) => (
                        <option key={belt} value={belt}>{belt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Kyu no.</label>
                    <input
                      type="text"
                      value={beltForm.kyu_no}
                      onChange={(e) => setBeltForm({ ...beltForm, kyu_no: e.target.value })}
                      placeholder="e.g. 1st Kyu"
                      maxLength={100}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Certification no.</label>
                    <input
                      type="text"
                      value={beltForm.certification_no}
                      onChange={(e) => setBeltForm({ ...beltForm, certification_no: e.target.value })}
                      placeholder="Unique certificate number"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Date of issue</label>
                    <input
                      type="date"
                      value={beltForm.date_of_issue}
                      onChange={(e) => setBeltForm({ ...beltForm, date_of_issue: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#f97316] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Assign Belt
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BeltModal;