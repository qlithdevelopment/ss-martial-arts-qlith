import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pencil, PlusCircle } from 'lucide-react';
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

const BeltModal = ({
  isOpen,
  onClose,
  student,
  onSuccess,
  isEdit = false,
  initialBeltPosition = null,
  belts = [],
}) => {
  const [beltForm, setBeltForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Id of the belt record currently being edited (set once a belt is picked in edit mode)
  const [editingBeltId, setEditingBeltId] = useState(null);

  const userId = student?.user_id || student?.id;

  useEffect(() => {
    if (isOpen) {
      setBeltForm(emptyForm);
      setEditingBeltId(null);
    }
  }, [isOpen, isEdit]);

  // Map of belt_position (trimmed) -> full existing belt record
  const assignedBeltsMap = useMemo(() => {
    const map = new Map();

    belts.forEach((belt) => {
      if (!belt || typeof belt !== "object") return;

      const position = belt.belt_position?.trim();

      if (position) {
        map.set(position, belt);
      }
    });

    return map;
  }, [belts]);

   const beltOptions = useMemo(() => {
    if (isEdit && initialBeltPosition) {
      const trimmed = initialBeltPosition.trim();
      return assignedBeltsMap.has(trimmed)
        ? BELT_OPTIONS.filter((belt) => belt.trim() === trimmed)
        : [];
    }

    return BELT_OPTIONS.filter((belt) => {
      const alreadyAssigned = assignedBeltsMap.has(belt.trim());
      return isEdit ? alreadyAssigned : !alreadyAssigned;
    });
  }, [assignedBeltsMap, isEdit, initialBeltPosition]);

  const handleBeltPositionChange = (value) => {
    if (isEdit) {
      const existing = assignedBeltsMap.get(value.trim());
      setEditingBeltId(existing?.id ?? null);
      setBeltForm({
        kyu_no: existing?.kyu_no || '',
        belt_position: value,
        certification_no: existing?.certification_no || '',
        date_of_issue: existing?.date_of_issue
          ? existing.date_of_issue.split('T')[0]
          : todayISO(),
      });
    } else {
      setBeltForm((prev) => ({ ...prev, belt_position: value }));
    }
  };

  // Auto-preselect + prefill when opened from a specific callout's Edit button.
  // Waits for assignedBeltsMap to be populated (belts fetch to finish) before applying.
  useEffect(() => {
    if (!isOpen || !isEdit || !initialBeltPosition) return;
    if (assignedBeltsMap.size === 0) return;
    if (!assignedBeltsMap.has(initialBeltPosition.trim())) return;

    handleBeltPositionChange(initialBeltPosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEdit, initialBeltPosition, assignedBeltsMap]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!beltForm.kyu_no) return toast.error('Please enter a kyu number');
    if (!beltForm.belt_position) return toast.error('Please select a belt');
    if (!beltForm.date_of_issue) return toast.error('Please select a date of issue');
    if (!student) return;
    if (isEdit && !editingBeltId) return toast.error('Please select a belt to edit');

    try {
      setIsSubmitting(true);
      toast.loading(isEdit ? 'Updating belt...' : 'Assigning belt...', { id: 'belt' });

      const payload = {
        kyu_no: beltForm.kyu_no,
        belt_position: beltForm.belt_position,
        certification_no: beltForm.certification_no,
        date_of_issue: beltForm.date_of_issue,
        user_id: userId,
      };

      if (isEdit) {
        await api.put(`/belts/${editingBeltId}`, payload);
      } else {
        await api.post('/belts', payload);
      }

      toast.success(isEdit ? 'Belt updated successfully!' : 'Belt assigned successfully!', { id: 'belt' });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error || (isEdit ? 'Failed to update belt.' : 'Failed to assign belt.'),
        { id: 'belt' }
      );
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-lg bg-white rounded-3xl shadow-xl z-50 max-h-[90vh] flex flex-col overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {isEdit ? <Pencil size={18} className="text-[#f97316]" /> : <PlusCircle size={18} className="text-[#f97316]" />}
                {isEdit ? 'Edit Belt' : 'Assign Belt'}
              </h3>
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
                      onChange={(e) => handleBeltPositionChange(e.target.value)}
                      className="w-full px-4 py-3 max-w-full truncate bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none"
                      required
                    >
                      <option value="" hidden>
                        {isEdit
                          ? "Choose a belt to edit..."
                          : "Choose a belt..."}
                      </option>

                      {beltOptions.map((belt) => (
                        <option key={belt} value={belt}>
                          {belt}
                        </option>
                      ))}
                    </select>

                    {beltOptions.length === 0 && (
                      <p className="text-xs text-gray-400 mt-1.5">
                        {isEdit
                          ? "No belts have been assigned yet."
                          : "All belts have already been assigned."}
                      </p>
                    )}
                    {beltOptions.length === 0 && (
                      <p className="text-xs text-gray-400 mt-1.5">
                        {isEdit
                          ? "No belts have been assigned yet."
                          : "All belts have already been assigned."}
                      </p>
                    )}
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
                  disabled={isSubmitting || beltOptions.length === 0}
                  className="w-full py-3 bg-[#f97316] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isEdit ? 'Update Belt' : 'Assign Belt'}
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