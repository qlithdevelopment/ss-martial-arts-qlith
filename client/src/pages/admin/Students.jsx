import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Mail,
  IndianRupee,
  Eye,
  Filter,
  ChevronDown,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import PaginationComponent from "../../components/PaginationComponent";
import ConfirmModal from "../../components/admin/reusecomponents/ConfirmationModal";
import AdminTable from "../../components/admin/reusecomponents/AdminTable";
import { getAvatarUrlByName } from "../../components/student/AvatarPickerModal";
import FeeModal from "../../components/admin/student/FeeModal";
import StudentModal from "../../components/admin/student/StudentModal";

const PAYMENT_STATUS_OPTIONS = [
  { value: "", label: "All Payment Statuses" },
  { value: "paid", label: "Fully Paid" },
  { value: "pending", label: "Payment Pending" },
];

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [id, setId] = useState(null);
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  // ── Filters (batch + payment status) ─────────────────────────────────────
  const [batches, setBatches] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [batchFilter, setBatchFilter] = useState(""); // batch id, "" = all
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(""); // "" | "paid" | "pending"
  const filterRef = useRef(null);

  const activeFilterCount = useMemo(
    () => (batchFilter ? 1 : 0) + (paymentStatusFilter ? 1 : 0),
    [batchFilter, paymentStatusFilter]
  );

  const openCreateModal = () => {
    setSelectedStudent(null);
    setSearch("");
    setIsStudentModalOpen(true);
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setIsStudentModalOpen(true);
  };

  // Debounce search input -> debouncedSearch, 300ms after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1); // reset to page 1 whenever the search term or filters change
  }, [debouncedSearch, batchFilter, paymentStatusFilter]);

  // Fetch students whenever the page, search, or filters change
  useEffect(() => {
    fetchStudents();
  }, [page, debouncedSearch, batchFilter, paymentStatusFilter]);

  // Batches for the filter dropdown
  useEffect(() => {
    fetchBatches();
  }, []);

  // Close the filter dropdown when clicking outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await api.get(`/batches`);
      setBatches(res?.data?.data || res.data || []);
    } catch (err) {
      toast.error("Failed to load batches");
    }
  };

  const fetchStudents = async () => {
    try {
      setIsLoadingData(true);
      const params = new URLSearchParams({
        page: String(page),
        search: debouncedSearch || "",
      });
      if (batchFilter) params.set("batch_id", batchFilter);
      if (paymentStatusFilter) params.set("payment_status", paymentStatusFilter);

      const res = await api.get(`/students?${params.toString()}`);
      const rawStudents = res.data?.data || res.data;
      setPagination(res.data?.pagination || {});
      setStudents(
        [...(Array.isArray(rawStudents) ? rawStudents : [])].sort(
          (a, b) => b.id - a.id
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to load students");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleClearFilters = () => {
    setBatchFilter("");
    setPaymentStatusFilter("");
  };

  const handleDelete = (id) => {
    setStudentToDelete(id);
    setIsDeleteModalOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`/students/${studentToDelete}`);
      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete));
      toast.success("Student deleted successfully");
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete student");
    } finally {
      setIsDeleting(false);
    }
  };
  const handelfeeOpen = (id) => {
    setId(id);
    setEditingFee(null);
    setIsFeeModalOpen(true);
  };
  const handelfeeClose = () => {
    setIsFeeModalOpen(false);
    setId(null);
  };

  const COLUMNS = [
    {
      header: "Student Info",
      className: "max-w-[220px]",
      skeleton: () => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      ),
      render: (_, row) => {
        const avatarImageUrl = row.avatar
          ? getAvatarUrlByName(row.avatar)
          : null;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#f97316] font-bold shrink-0 overflow-hidden">
              {avatarImageUrl ? (
                <img
                  src={avatarImageUrl}
                  alt={row.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                row.name?.charAt(0)
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p
                  className="font-bold text-gray-900 truncate max-w-[160px]"
                  title={row.name}
                >
                  {row.name}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 min-w-0">
                <Mail size={12} className="shrink-0" />
                <span className="truncate max-w-[160px]" title={row.email}>
                  {row.email}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Assigned Batch",
      accessor: "batch_id",
      className: "max-w-[140px]",
      skeleton: () => <div className="h-6 bg-gray-200 rounded-md w-24"></div>,
      render: (_, row) => (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold max-w-full truncate"
          title={row.batch_name || "Unassigned"}
        >
          {row.batch_name || "Unassigned"}
        </span>
      ),
    },
    {
      header: "Mobile Number",
      accessor: "mobile_number",
      className: "max-w-[140px] truncate",
      skeleton: () => <div className="h-6 bg-gray-200 rounded-md w-24"></div>,
    },
    {
      header: "Registration No",
      accessor: "reg_no",
      className: "max-w-[140px] truncate",
      skeleton: () => <div className="h-6 bg-gray-200 rounded-md w-24"></div>,
    },

    {
      header: "Total Fee",
      accessor: "total_fee",
      className: "max-w-[120px]",
      skeleton: () => <div className="h-5 bg-gray-200 rounded w-16"></div>,
      render: (value) => (
        <div className="flex items-center gap-1 font-semibold text-gray-900 truncate">
          <IndianRupee size={14} className="text-gray-400 shrink-0" />
          <span className="truncate" title={String(value ?? "")}>{value}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      skeleton: () => <div className="h-6 bg-gray-200 rounded-full w-20"></div>,
      render: (value) => {
        const isActive =
          String(value) === "1" ||
          value === true ||
          value === "true" ||
          value === "active";
        return (
          <span
            className={`px-2.5 py-1 text-xs font-bold rounded-full ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {isActive ? "ACTIVE" : "INACTIVE"}
          </span>
        );
      },
    },
    {
      header: "Actions",
      className: "text-right",
      skeleton: () => (
        <div className="flex justify-end gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
          <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
          <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
          <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
        </div>
      ),
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handelfeeOpen(row.id)}
            className="px-2 py-1.5 text-xs font-bold text-green-500 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-orange-100 flex items-center gap-1"
            title="View Details"
          >
            <IndianRupee size={16} />
          </button>
          <button
            onClick={() => navigate(`/admin/students/${row.id}`)}
            className="px-2 py-1.5 text-xs font-bold text-[#f97316] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-100 flex items-center gap-1"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => openEditModal(row)}
            className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-2 py-1.5 rounded-lg"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="px-2 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 flex items-center gap-1"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      {/* Action Bar */}
      <div className="flex md:absolute right-5 md:w-[35vw]  lg:w-[60vw] top-18  flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            name="student_search_query"
            autoComplete="off"
            placeholder="Search students by name, email, or batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400 shadow-sm"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Filter button + dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className={`h-full px-4 py-3 border rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm shrink-0 ${
                activeFilterCount > 0
                  ? "bg-orange-50 border-orange-200 text-[#f97316]"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Filter size={16} />
              <span className="hidden lg:inline">Filter</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#f97316] text-white text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown
                size={14}
                className={`transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 sm:left-0 top-full mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-gray-900">Filters</p>
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                      Batch
                    </label>
                    <select
                      value={batchFilter}
                      onChange={(e) => setBatchFilter(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium appearance-none"
                    >
                      <option value="">All Batches</option>
                      {batches.map((batch) => (
                        <option key={batch.id} value={batch.id}>
                          {batch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                      Payment Status
                    </label>
                    <select
                      value={paymentStatusFilter}
                      onChange={(e) => setPaymentStatusFilter(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium appearance-none"
                    >
                      {PAYMENT_STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    disabled={activeFilterCount === 0}
                    className="text-xs font-bold text-gray-500 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Clear filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="px-4 py-2 bg-[#f97316] hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={openCreateModal}
            className="flex-1 sm:flex-none px-5 py-3 bg-[#f97316] hover:bg-orange-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#f97316]/20 shrink-0"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="hidden lg:inline">Add Student</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={COLUMNS}
        data={students}
        isLoading={isLoadingData}
        skeletonRows={3}
        emptyTitle="No students found"
        emptyMessage="Add your first student!"
      />
      <div className="mt-8">
        {!isLoadingData && students.length > 0 && pagination?.total > 0 && (
          <PaginationComponent
            pagination={pagination}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>

      {/* Register / Edit Student Modal */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        student={selectedStudent}
        onSuccess={fetchStudents}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student?"
        message="Are you sure you want to delete this student? This action cannot be undone."
        type="delete"
        isLoading={isDeleting}
      />
      <FeeModal
        isOpen={isFeeModalOpen}
        onClose={handelfeeClose}
        studentId={id}
        editingFee={editingFee}
        onSuccess={fetchStudents}
      />
    </div>
  );
};

export default Students;