import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Calendar, Users, X, Save, Type, IndianRupee, Activity, FileText, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AdminTable from '../../components/admin/reusecomponents/AdminTable.jsx';
import ConfirmModal from '../../components/admin/reusecomponents/ConfirmationModal.jsx';
import PaginationComponent from '../../components/PaginationComponent.jsx';
import { formatDate } from '../../components/CommonFormats.js';

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    enddate: '',
    total_fee: '',
    status: 'active',
    notes: ''
  });

  const openCreateModal = () => {
    setSelectedBatch(null);
    setSearch('');
    setFormData({ name: '', date: '', enddate: '', total_fee: '', status: 'active', notes: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (batch) => {
    setSelectedBatch(batch);
    setFormData({ ...batch });
    setIsModalOpen(true);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchBatches();
  }, [page, debouncedSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchBatches = async () => {
    try {
      setIsLoadingData(true);
      const res = await api.get(`/batches?page=${page}&search=${debouncedSearch}`);
      setBatches(res?.data?.data || res.data || []);
      setPagination(res?.data?.pagination)
    } catch (err) {
      toast.error('Failed to load batches');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedBatch) {
        await api.put(`/batches/${selectedBatch.id}`, formData);
        toast.success('Batch updated successfully');
      } else {
        await api.post('/batches', formData);
        toast.success('Batch created successfully');
      }
      setIsModalOpen(false);
      setSearch('');
      fetchBatches();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save batch');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setBatchToDelete(id);
    setIsDeleteModalOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (!batchToDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`/batches/${batchToDelete}`);
      toast.success('Batch deleted successfully');
      fetchBatches();
      setIsDeleteModalOpen(false);
      setBatchToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete batch');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredBatches = batches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedBatches = filteredBatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ── AdminTable column definitions ──────────────────────────────────────────

  const columns = [
    {
      header: 'Batch Name',
      render: (_, row) => (
        <div className="flex items-center gap-3">          
          <div>
            <p className="font-bold text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">{row.notes}</p>
          </div>
        </div>
      ),
      skeleton: () => (
        <div className="flex items-center gap-3">          
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-200 rounded w-48" />
          </div>
        </div>
      ),
    },
    {
      header: 'Duration',
      render: (_, row) => (
        <div className="flex items-center gap-2 text-gray-600">          
          <span>{formatDate(row.date)} – {formatDate(row.enddate)}</span>
        </div>
      ),
    },
    {
      header: 'Total Fee',
      accessor: 'total_fee',
      render: (value) => (
        <span className="font-semibold text-gray-900">₹{value}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${value === 'active'
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
          }`}>
          {value.toUpperCase()}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
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
      skeleton: () => (
        <div className="flex justify-end gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-200" />
          <div className="w-8 h-8 rounded-lg bg-gray-200" />
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
            name="batch_search_query"
            autoComplete="off"
            placeholder="Search batches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400 shadow-sm"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          
          <button
            onClick={openCreateModal}
            className="flex-1 sm:flex-none px-5 py-3 bg-[#f97316] hover:bg-orange-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#f97316]/20 shrink-0"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="hidden lg:inline">Add Batch</span>
          </button>
        </div>
      </div>

      {/* AdminTable */}
      <AdminTable
        columns={columns}
        data={batches}
        isLoading={isLoadingData}
        skeletonRows={3}
        emptyIcon={<Users size={28} className="text-gray-400" />}
        emptyTitle="No batches found"
        emptyMessage="Create your first batch to get started."

      />
      <div className="mt-8">
        {!loading && batches.length > 0 && pagination?.total > 0 && (
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
                      {selectedBatch ? 'Edit Batch' : 'Add New Batch'}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {selectedBatch ? 'Update existing batch schedule' : 'Create a new training batch'}
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
                        <Type size={12} className="text-[#f97316]" /> BATCH NAME *
                      </label>
                      <input
                        type="text"
                        name="batch_name_entry"
                        autoComplete="off"
                        required
                        placeholder="e.g. Morning Warrior Batch"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar size={12} className="text-[#f97316]" /> START DATE *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar size={12} className="text-[#f97316]" /> END DATE *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.enddate}
                        onChange={(e) => setFormData({ ...formData, enddate: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                      />
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
                        value={formData.status}
                        disabled={!selectedBatch}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium appearance-none"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <FileText size={12} className="text-[#f97316]" /> NOTES
                      </label>
                      <textarea
                        rows="3"
                        placeholder="Any additional information about this batch..."
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
                      className="px-5 py-2.5 text-sm font-bold cursor-pointer shadow-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                          <Save size={16} /> Save Batch
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
        title="Delete Batch?"
        message="Are you sure you want to delete this batch? This action cannot be undone."
        type="delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Batches;
