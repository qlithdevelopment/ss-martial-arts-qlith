import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Mail, IndianRupee, IdCard, X, Save, Type, Lock, Activity, FileText, Eye, EyeOff, Award, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import PaginationComponent from '../../components/PaginationComponent';
import ConfirmModal from '../../components/admin/reusecomponents/ConfirmationModal';
import AdminTable from '../../components/admin/reusecomponents/AdminTable';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] =useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingBatches, setIsLoadingBatches] = useState(true);
  const navigate = useNavigate();

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reg_no: '',
    password: '',
    batch_id: '',
    belt: '',
    total_fee: '',
    status: 1,
    notes: ''
  });

  const openCreateModal = () => {
    setSelectedStudent(null);
    setSearch('');
    fetchBatches();
    setFormData({ name: '', reg_no: '', email: '', password: '', batch_id: '', belt: '', total_fee: '', status: 1, notes: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    fetchBatches();
    setFormData({ ...student, password: '', status: (student.status == '1' || student.status === true || student.status === 'true' || student.status === 'active') ? 1 : 0 });
    setIsModalOpen(true);
  };

  // Debounce search input -> debouncedSearch, 300ms after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1); // reset to page 1 whenever the search term changes
  }, [debouncedSearch])

  // Fetch students whenever the page changes
  useEffect(() => {
    fetchStudents();
  }, [page, debouncedSearch]);

  const fetchBatches = async () => {
    try {
      setIsLoadingData(true);
      const res = await api.get(`/batches`);
      setBatches(res?.data?.data || res.data || []);      
    } catch (err) {
      toast.error('Failed to load batches');
    } finally {
      setIsLoadingData(false);
    }
  };


  const fetchStudents = async () => {
    try {
      setIsLoadingData(true);
      const res = await api.get(`/students?page=${page}&search=${debouncedSearch}`);
      const rawStudents = res.data?.data || res.data;
      setPagination(res.data?.pagination || {});
      setStudents([...(Array.isArray(rawStudents) ? rawStudents : [])].sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load students');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedStudent) {
        await api.put(`/students/${selectedStudent.id}`, formData);
        toast.success('Student updated successfully');
      } else {
        await api.post('/students/register', formData);
        toast.success('Student registered successfully');
      }
      setIsModalOpen(false);
      setSearch('');
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save student');
    } finally {
      setLoading(false);
    }
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
      setStudents(prev => prev.filter(s => s.id !== studentToDelete));
      toast.success('Student deleted successfully');
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete student');
    } finally {
      setIsDeleting(false);
    }
  };

  const COLUMNS = [
    {
      header: 'Student Info',
      skeleton: () => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      ),
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#f97316] font-bold shrink-0">
            {row.name?.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400">#{row.id}</span>
              <p className="font-bold text-gray-900" title={row.name}>
                {row.name?.split(' ').length > 4
                  ? row.name.split(' ').slice(0, 4).join(' ') + '...'
                  : row.name}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <Mail size={12} />
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Batch',
      accessor: 'batch_id',
      skeleton: () => <div className="h-6 bg-gray-200 rounded-md w-24"></div>,
      render: (_, row) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold">
          {row.batch_name || 'Unassigned'}
        </span>
      ),
    },
    {
      header: 'Total Fee',
      accessor: 'total_fee',
      skeleton: () => <div className="h-5 bg-gray-200 rounded w-16"></div>,
      render: (value) => (
        <div className="flex items-center gap-1 font-semibold text-gray-900">
          <IndianRupee size={14} className="text-gray-400" />
          {value}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      skeleton: () => <div className="h-6 bg-gray-200 rounded-full w-20"></div>,
      render: (value) => {
        const isActive = String(value) === '1' || value === true || value === 'true' || value === 'active';
        return (
          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isActive ? 'ACTIVE' : 'INACTIVE'}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      className: 'text-right',
      skeleton: () => (
        <div className="flex justify-end gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
          <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
          <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
        </div>
      ),
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => navigate(`/admin/students/${row.id}`)}
            className="px-3 py-1.5 text-xs font-bold text-[#f97316] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-100 flex items-center gap-1"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => openEditModal(row)}
            className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 flex items-center gap-1"
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
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            name="student_search_query"
            autoComplete="off"
            placeholder="Search students by name, email, belt, or batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400 shadow-sm"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={fetchStudents}
            className="p-3 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded-xl transition-colors hidden lg:flex items-center justify-center shrink-0"
            title="Refresh Students"
          >
            <RefreshCw size={20} className={isLoadingData ? 'animate-spin' : ''} />
          </button>
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
        {!loading && students.length > 0 && pagination?.total > 0 && (
        <PaginationComponent
          pagination={pagination}
          onPageChange={(newPage) => setPage(newPage)}
        />
        )}
      </div>
      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
            >
              <div
                className="bg-white w-full max-w-2xl rounded-[1.5rem] shadow-2xl flex flex-col max-h-[85dvh] pointer-events-auto overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 shrink-0">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">
                      {selectedStudent ? 'Edit Student' : 'Add New Student'}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {selectedStudent ? 'Update student records and assignments' : 'Enroll a new student'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <X size={20} strokeWidth={2.5} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Mail size={12} className="text-[#f97316]" /> EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <IdCard size={12} className="text-[#f97316]" /> registration no
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ABC234"
                        value={formData.reg_no}
                        onChange={(e) => setFormData({ ...formData, reg_no: e.target.value.toUpperCase() })}
                        className="w-full bg-gray-50 uppercase border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Lock size={12} className="text-[#f97316]" /> PASSWORD {selectedStudent && <span className="text-gray-400 normal-case tracking-normal">(Leave blank to keep)</span>}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required={!selectedStudent}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Activity size={12} className="text-[#f97316]" /> ASSIGN BATCH *
                      </label>
                      <select
                        required
                        value={formData.batch_id}
                        onChange={(e) => setFormData({ ...formData, batch_id: e.target.value ? parseInt(e.target.value) : '' })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400 appearance-none"
                      >
                        <option value="">Select a Batch</option>
                        {batches.map(batch => (
                          <option key={batch.id} value={batch.id}>{batch.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Award size={12} className="text-[#f97316]" /> CURRENT BELT
                      </label>
                      <select
                        value={formData.belt || ''}
                        onChange={(e) => setFormData({ ...formData, belt: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium appearance-none"
                      >
                        <option value="">Select a Belt</option>
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

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <IndianRupee size={12} className="text-[#f97316]" /> TOTAL FEE *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        placeholder="e.g. 500.00"
                        value={formData.total_fee}
                        onChange={(e) => setFormData({ ...formData, total_fee: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Activity size={12} className="text-[#f97316]" /> STATUS *
                      </label>
                      <select
                        value={String(formData.status)}
                        disabled={!selectedStudent}
                        onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                        className={`${!selectedStudent ? 'cursor-not-allowed' : 'cursor-pointer'} w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400 appearance-none`}
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
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                      ></textarea>
                    </div>

                  </div>

                  <div className="pt-6 mt-4 border-t border-gray-100 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      disabled={loading}
                      className="px-5 py-2.5 text-sm font-bold cursor-pointer text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student?"
        message="Are you sure you want to delete this student? This action cannot be undone."
        type="delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Students;