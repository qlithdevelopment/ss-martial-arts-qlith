import React, { useState, useEffect } from "react";
import {
  IndianRupee,
  Tag,
  FileText,
  CheckCircle2,
  Clock,
  Receipt,
  Pencil,
  Trash,
  Check,
  X,
  Loader2,
} from "lucide-react";
import api from "../../api/axios";
import FeeModal from "../../components/admin/student/FeeModal";

const toCamelCase = (str) =>
  str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const PaymentRowSkeleton = () => (
  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-slate-700 shrink-0" />
      <div className="space-y-2">
        <div className="h-3 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-2.5 w-32 bg-gray-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
    <div className="space-y-2 text-right">
      <div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded ml-auto" />
      <div className="h-5 w-16 bg-gray-200 dark:bg-slate-700 rounded-full ml-auto" />
    </div>
  </div>
);

const PaymentDetails = ({ studentId, isAdmin = false }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/students/${studentId}/payments`);
      setPayments(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!studentId) return;
    fetchPayments();
  }, [studentId]);

  const handleEditClick = (paymentId) => {
    setEditingPaymentId(paymentId);
    setIsEditOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditOpen(false);
    setEditingPaymentId(null);
    fetchPayments();
  };

  const handleExecuteDelete = async (paymentId) => {
    try {
      setIsDeleting(true);
      await api.delete(`/student-payments/${paymentId}`);
      setConfirmingDeleteId(null);
      fetchPayments(); // Refresh list after deletion
    } catch (err) {
      console.error("Failed to delete payment:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Look up the full payment object by id, then map its fields into the
  // shape FeeModal expects (fee_type / amount / is_fully_paid).
  const editingPayment =
    payments.find((p) => p.id === editingPaymentId) || null;
  const editingFee = editingPayment
    ? {
        id: editingPayment.id,
        fee_type: editingPayment.payment_reason,
        other_reason: editingPayment.other_reason,
        amount: editingPayment.payment_amount,
        is_fully_paid: editingPayment.status,
      }
    : null;

  const totalFee = payments.reduce((acc, curr) => {
    return acc + (parseFloat(curr.payment_amount) || 0);
  }, 0);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <PaymentRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 rounded-xl text-sm text-red-600 dark:text-red-400 font-medium">
        {error}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl">
        <Receipt
          size={24}
          className="mx-auto text-gray-300 dark:text-slate-500 mb-2"
        />
        <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
          No payment records yet
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 mb-4 bg-orange-50/60 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 rounded-xl">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Total Fee Paid
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-500">
              {payments.length} {payments.length === 1 ? "record" : "records"}
            </p>
          </div>

          <div className="flex items-center gap-1 text-xl font-black text-gray-900 dark:text-white">
            <IndianRupee size={18} className="text-[#f97316]" />
            <span>
              {totalFee.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
        {payments.map((payment) => {
          const isComplete = payment.status === "complete";
          const reasonLabel =
            payment.payment_reason === "other"
              ? payment.other_reason
              : toCamelCase(payment.payment_reason);

          return (
            <div
              key={payment.id}
              className="flex items-center justify-between p-0 md:p-1 bg-white dark:bg-slate-900 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Tag size={16} className="text-[#f97316]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <FileText
                      size={12}
                      className="text-gray-400 dark:text-slate-500"
                    />
                    <span className="text-sm font-bold text-gray-900 dark:text-slate-100">
                      {reasonLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock
                      size={11}
                      className="text-gray-400 dark:text-slate-500"
                    />
                    <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                      {formatDate(payment.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 md:gap-3">
                <div className="text-right">
                  {isAdmin && (
                    <div className="flex items-center justify-end gap-1 text-sm font-black text-gray-900 dark:text-slate-100">
                      <IndianRupee size={13} />
                      {parseFloat(payment.payment_amount).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        },
                      )}
                    </div>
                  )}
                  <div
                    className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      isComplete
                        ? "bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400"
                        : "bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    <CheckCircle2
                      size={10}
                      className={
                        isComplete ? "text-green-500" : "text-amber-500"
                      }
                    />
                    {isComplete ? "Complete" : "Pending"}
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-1">
                    {confirmingDeleteId === payment.id ? (
                      /* Inline Confirm / Cancel buttons */
                      <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/30 p-1 rounded-lg border border-red-100 dark:border-red-900/50">
                        {/* Tick (Confirm) Button */}
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => handleExecuteDelete(payment.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 rounded transition-colors disabled:opacity-50"
                          title="Confirm Delete"
                        >
                          {isDeleting ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Check size={15} />
                          )}
                        </button>

                        {/* Cross (Cancel) Button */}
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => setConfirmingDeleteId(null)}
                          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 dark:hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
                          title="Cancel"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ) : (
                      /* Default Edit and Trash buttons */
                      <>
                        <button
                          type="button"
                          onClick={() => handleEditClick(payment.id)}
                          className="p-2 text-gray-400 dark:text-slate-500 hover:text-[#f97316] hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors shrink-0"
                          aria-label="Edit payment"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingDeleteId(payment.id)}
                          className="p-2 text-gray-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                          aria-label="Delete payment"
                        >
                          <Trash size={15} />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isAdmin && (
        <FeeModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setEditingPaymentId(null);
          }}
          studentId={studentId}
          editingFee={editingFee}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};

export default PaymentDetails;
