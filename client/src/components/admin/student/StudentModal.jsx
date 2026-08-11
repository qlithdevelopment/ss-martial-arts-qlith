import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Type,
  Lock,
  Activity,
  FileText,
  Eye,
  EyeOff,
  User,
  Users,
  Calendar,
  Ruler,
  Weight,
  MapPin,
  Phone,
  Building2,
  UserCog,
  ScanLine,
  Mail,
  IdCard,
  IndianRupee,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../../api/axios";

const emptyFormData = {
  name: "",
  father_name: "",
  mother_name: "",
  gender: "",
  date_of_birth: "",
  height: "",
  weight: "",
  address: "",
  mobile_number: "",
  joining_date: "",
  email: "",
  reg_no: "",
  password: "",
  batch_id: "",
  branch_id: "",
  sensei: "",
  belt: "",
  total_fee: "",
  status: 1,
  notes: "",
  id_proof_name: "",
  id_proof_number: "",
};

/**
 * Self-contained modal for both registering a new student and editing an
 * existing one. Pass `student` (a student record) to open in edit mode;
 * omit it (or pass null) to open in create mode.
 */
const StudentModal = ({ isOpen, onClose, student = null, onSuccess }) => {
  const isEdit = Boolean(student);

  const [batches, setBatches] = useState([]);
  const [formData, setFormData] = useState(emptyFormData);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Reset / prefill form whenever the modal opens
  useEffect(() => {
    if (!isOpen) return;

    fetchBatches();
    setShowPassword(false);
    setPasswordTouched(false);

    if (student) {
      setFormData({
        ...emptyFormData,
        ...student,
        password: "",
        status:
          student.status == "1" ||
          student.status === true ||
          student.status === "true" ||
          student.status === "active"
            ? 1
            : 0,
      });
    } else {
      setFormData(emptyFormData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, student]);

  // Auto-generate password from DOB + mobile number, create mode only
  useEffect(() => {
    if (isEdit) return;
    if (passwordTouched) return;

    const digitsOnly = (formData.mobile_number || "").replace(/\D/g, "");
    const last4 = digitsOnly.slice(-4);
    const [, month, day] = (formData.date_of_birth || "").split("-");
    const birthDayMonth = day && month ? `${day}${month}` : "";

    if (last4.length === 4 && birthDayMonth) {
      const generated = `${birthDayMonth}${last4}`;
      setFormData((prev) =>
        prev.password === generated ? prev : { ...prev, password: generated }
      );
    }
  }, [formData.mobile_number, formData.date_of_birth, isEdit, passwordTouched]);

  const fetchBatches = async () => {
    try {
      const res = await api.get(`/batches`);
      setBatches(res?.data?.data || res.data || []);
    } catch (err) {
      toast.error("Failed to load batches");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/students/${student.id}`, formData);
        toast.success("Student updated successfully");
      } else {
        await api.post("/students/register", formData);
        toast.success("Student registered successfully");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save student");
    } finally {
      setLoading(false);
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div
              className="bg-white w-full max-w-3xl rounded-[1.5rem] shadow-2xl flex flex-col max-h-[90dvh] pointer-events-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 shrink-0">
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">
                    {isEdit ? "Edit Student" : "Add New Student"}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {isEdit
                      ? "Update student records and assignments"
                      : "Enroll a new student"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              <form
                onSubmit={handleSave}
                className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* ===== PERSONAL DETAILS ===== */}
                  <div className="md:col-span-2">
                    <p className="text-[11px] font-black text-[#f97316] uppercase tracking-widest mb-1">
                      Personal Details
                    </p>
                  </div>

                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Type size={12} className="text-[#f97316]" /> FULL NAME *
                    </label>
                    <input
                      type="text"
                      name="student_full_name_entry"
                      autoComplete="off"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <User size={12} className="text-[#f97316]" /> FATHER'S
                      NAME
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Robert Doe"
                      value={formData.father_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          father_name: e.target.value,
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Users size={12} className="text-[#f97316]" /> MOTHER'S
                      NAME
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jane Doe"
                      value={formData.mother_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mother_name: e.target.value,
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Activity size={12} className="text-[#f97316]" /> GENDER
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium appearance-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar size={12} className="text-[#f97316]" /> DATE OF
                      BIRTH
                    </label>
                    <input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          date_of_birth: e.target.value,
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Ruler size={12} className="text-[#f97316]" /> HEIGHT
                      (cm)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="e.g. 165"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({ ...formData, height: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Weight size={12} className="text-[#f97316]" /> WEIGHT
                      (kg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="e.g. 60"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Phone size={12} className="text-[#f97316]" /> MOBILE
                      NUMBER *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.mobile_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mobile_number: e.target.value,
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                    />
                  </div>

                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <MapPin size={12} className="text-[#f97316]" /> ADDRESS
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Full residential address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                    ></textarea>
                  </div>

                  {/* ===== IDENTITY PROOF ===== */}
                  <div className="md:col-span-2 pt-2">
                    <p className="text-[11px] font-black text-[#f97316] uppercase tracking-widest mb-1">
                      Identity Proof
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <ScanLine size={12} className="text-[#f97316]" /> ID
                      PROOF NAME
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Aadhar Card"
                      value={formData.id_proof_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          id_proof_name: e.target.value,
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <IdCard size={12} className="text-[#f97316]" /> ID PROOF
                      NUMBER
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. XXXX-XXXX-XXXX"
                      value={formData.id_proof_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          id_proof_number: e.target.value,
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                    />
                  </div>

                  {/* ===== ACCOUNT & ACADEMY DETAILS ===== */}
                  <div className="md:col-span-2 pt-2">
                    <p className="text-[11px] font-black text-[#f97316] uppercase tracking-widest mb-1">
                      Account & Academy Details
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Mail size={12} className="text-[#f97316]" /> EMAIL
                      ADDRESS
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <IdCard size={12} className="text-[#f97316]" />{" "}
                      REGISTRATION NO *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ABC234"
                      value={formData.reg_no}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reg_no: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full bg-gray-50 uppercase border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Lock size={12} className="text-[#f97316]" /> PASSWORD{" "}
                      {isEdit && (
                        <span className="text-gray-400 normal-case tracking-normal">
                          (Leave blank to keep)
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        readOnly={!isEdit}
                        required={!isEdit}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => {
                          setPasswordTouched(true);
                          setFormData({
                            ...formData,
                            password: e.target.value,
                          });
                        }}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-11 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#f97316] transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {!isEdit && !passwordTouched && formData.password && (
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Auto-generated from DOB (DDMM) + last 4 digits of
                        mobile number.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar size={12} className="text-[#f97316]" />{" "}
                      JOINING DATE
                    </label>
                    <input
                      type="date"
                      value={formData.joining_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          joining_date: e.target.value,
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Activity size={12} className="text-[#f97316]" /> ASSIGN
                      BATCH *
                    </label>
                    <select
                      required
                      value={formData.batch_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          batch_id: e.target.value
                            ? parseInt(e.target.value)
                            : "",
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400 appearance-none"
                    >
                      <option value="">Select a Batch</option>
                      {batches.map((batch) => (
                        <option key={batch.id} value={batch.id}>
                          {batch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Building2 size={12} className="text-[#f97316]" />{" "}
                      ADMISSION DOJO (BRANCH)
                    </label>
                    <input
                      type="text"
                      value={formData.branch_id || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branch_id: e.target.value,
                        })
                      }
                      placeholder="Enter branch name"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <UserCog size={12} className="text-[#f97316]" /> SENSEI
                      (COACH)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Siddharth Kumar Sahoo"
                      value={formData.sensei}
                      onChange={(e) =>
                        setFormData({ ...formData, sensei: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <IndianRupee size={12} className="text-[#f97316]" />{" "}
                      TOTAL FEE *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      placeholder="e.g. 500.00"
                      value={formData.total_fee}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          total_fee: e.target.value,
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Activity size={12} className="text-[#f97316]" /> STATUS
                      *
                    </label>
                    <select
                      value={String(formData.status)}
                      disabled={!isEdit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: parseInt(e.target.value),
                        })
                      }
                      className={`${!isEdit ? "cursor-not-allowed" : "cursor-pointer"} w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400 appearance-none`}
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <FileText size={12} className="text-[#f97316]" /> NOTES
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Any additional information..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-5 py-2.5 text-sm shadow-sm font-bold cursor-pointer text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 cursor-pointer text-sm font-bold text-white bg-[#f97316] hover:bg-orange-600 rounded-xl flex items-center gap-2 shadow-md shadow-[#f97316]/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} /> Save Student
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
};

export default StudentModal;