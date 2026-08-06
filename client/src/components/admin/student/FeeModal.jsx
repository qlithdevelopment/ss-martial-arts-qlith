import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, IndianRupee, Save, Tag, FileText, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axios';

const FEE_TYPE_OPTIONS = ['monthly_payment', 'equipment', 'tournament', 'belt_test', 'other'];

const emptyForm = {
    fee_type: '',
    other_reason: '',
    amount: '',
    is_fully_paid: 'complete',
};

const FeeModal = ({ isOpen, onClose, studentId, editingFee = null, onSuccess }) => {
    const [formData, setFormData] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    function toCamelCase(str) {
        return str
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    useEffect(() => {
        if (!isOpen) return;

        if (editingFee) {
            const isPreset = FEE_TYPE_OPTIONS.slice(0, -1).includes(editingFee.fee_type);
            setFormData({
                fee_type: isPreset ? editingFee.fee_type : 'other',
                other_reason: isPreset ? '' : (editingFee.other_reason || ''),
                amount: editingFee.amount != null ? String(editingFee.amount) : '',
                is_fully_paid: (editingFee.is_fully_paid === 'complete' || editingFee.is_fully_paid === 'Complete')
                    ? 'complete'
                    : 'pending',
            });
        } else {
            setFormData(emptyForm);
        }
    }, [isOpen, editingFee]);

    const handleAmountChange = (value) => {
        if (value !== '' && !/^\d*\.?\d{0,2}$/.test(value)) return;
        setFormData((prev) => ({ ...prev, amount: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const amountValue = parseFloat(formData.amount);
        if (!amountValue || amountValue <= 0) {
            toast.error('Enter a valid fee amount');
            return;
        }
        if (formData.fee_type === 'other' && !formData.other_reason.trim()) {
            toast.error('Enter a reason for the "Other" fee type');
            return;
        }

        const payload = {
            payment_reason: formData.fee_type,
            payment_amount: amountValue,
            status: formData.is_fully_paid,
            other_reason: formData.other_reason,
        };

        try {
            setSaving(true);
            if (editingFee) {
                await api.put(`/student-payments/${editingFee.id}`, payload);
                toast.success('Fee record updated');
            } else {
                await api.post(`/students/${studentId}/payments`, payload);
                toast.success('Fee recorded successfully');
            }
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to save fee');
        } finally {
            setSaving(false);
        }
    };

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.97 }}
                        transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className="bg-white w-full max-w-md rounded-[1.5rem] shadow-2xl flex flex-col max-h-[90dvh] pointer-events-auto overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 shrink-0">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight">
                                        {editingFee ? 'Edit Fee Record' : 'Record Fee Payment'}
                                    </h3>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                                        {editingFee ? 'Update this fee entry' : 'Select a fee type and enter the amount'}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                                >
                                    <X size={20} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <IndianRupee size={12} className="text-[#f97316]" /> AMOUNT *
                                    </label>
                                    <div className="relative">
                                        <IndianRupee size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            required
                                            placeholder="0.00"
                                            value={formData.amount}
                                            onChange={(e) => handleAmountChange(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Tag size={12} className="text-[#f97316]" /> TYPE OF FEE
                                    </label>
                                    <select
                                        value={formData.fee_type}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, fee_type: e.target.value }))}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium appearance-none"
                                    >
                                        <option hidden value="" disabled>Select fee type</option>
                                        {FEE_TYPE_OPTIONS.map((option) => (
                                            <option key={option} value={option}>{toCamelCase(option)}</option>
                                        ))}
                                    </select>
                                </div>

                                <AnimatePresence initial={false}>
                                    {formData.fee_type === 'other' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                                    <FileText size={12} className="text-[#f97316]" /> REASON *
                                                </label>
                                                <textarea
                                                    required={formData.fee_type === 'other'}
                                                    placeholder="e.g. Tournament registration"
                                                    value={formData.other_reason}
                                                    onChange={(e) => setFormData((prev) => ({ ...prev, other_reason: e.target.value }))}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className={formData.is_fully_paid === 'complete' ? 'text-emerald-500' : 'text-gray-300'} />
                                        <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                                            Payment Status
                                        </span>
                                    </div>
                                    <select
                                        value={formData.is_fully_paid === 'complete' ? 'complete' : 'pending'}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, is_fully_paid: e.target.value }))
                                        }
                                        className={`text-xs font-bold uppercase tracking-widest rounded-full px-3 py-1.5 border-0 outline-none cursor-pointer transition-colors ${formData.is_fully_paid === 'complete'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-amber-200 text-gray-600'
                                            }`}
                                    >
                                        <option className='bg-amber-200' value="pending">Pending</option>
                                        <option className='bg-green-500' value="complete">Complete</option>
                                    </select>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={saving}
                                        className="px-5 py-2.5 text-sm shadow-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-5 py-2.5 text-sm font-bold text-white bg-[#f97316] hover:bg-orange-600 rounded-xl flex items-center gap-2 shadow-md shadow-[#f97316]/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} /> {editingFee ? 'Update Fee' : 'Save Fee'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
};

export default FeeModal;