import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Calendar, Users, X, Save, Type, IndianRupee, Activity, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

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
    setFormData({ name: '', date: '', enddate: '', total_fee: '', status: 'active', notes: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (batch) => {
    setSelectedBatch(batch);
    setFormData({ ...batch });
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await api.get('/batches');
      setBatches(res.data.data || res.data || []);
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
      fetchBatches();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save batch');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium text-gray-900">Are you sure you want to delete this batch?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/batches/${id}`);
                toast.success('Batch deleted successfully');
                fetchBatches();
              } catch (error) {
                toast.error('Failed to delete batch');
              }
            }} 
            className="px-3 py-1.5 text-xs font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const filteredBatches = batches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search batches..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400 shadow-sm"
          />
        </div>
        <button 
          onClick={() => { setSelectedBatch(null); setIsModalOpen(true); }}
          className="w-full sm:w-auto px-5 py-3 bg-[#f97316] hover:bg-orange-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#f97316]/20 shrink-0"
        >
          <Plus size={18} strokeWidth={2.5} />
          Add Batch
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-900">Batch Name</th>
                <th className="px-6 py-4 font-bold text-gray-900">Duration</th>
                <th className="px-6 py-4 font-bold text-gray-900">Total Fee</th>
                <th className="px-6 py-4 font-bold text-gray-900">Status</th>
                <th className="px-6 py-4 font-bold text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoadingData ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-48"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
                        <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    No batches found. Create your first batch!
                  </td>
                </tr>
              ) : (
                filteredBatches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-[#f97316]">
                          <Users size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{batch.name}</p>
                          <p className="text-xs text-gray-500">{batch.notes}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{batch.date} - {batch.enddate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ₹{batch.total_fee}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        batch.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {batch.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(batch)} className="p-2 text-gray-400 hover:text-[#26c0ff] bg-gray-50 hover:bg-[#26c0ff]/10 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(batch.id)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) } 
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No batches found. Try adjusting your search.
                  </td>
                </tr>
              
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            {/* Modal Content */}
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
                        required
                        placeholder="e.g. Morning Warriors"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, enddate: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, total_fee: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Activity size={12} className="text-[#f97316]" /> STATUS *
                      </label>
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400 appearance-none"
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
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                      ></textarea>
                    </div>

                  </div>

                  <div className="pt-6 mt-4 border-t border-gray-100 flex justify-end gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2.5 text-sm font-bold text-white bg-[#f97316] hover:bg-orange-600 rounded-xl flex items-center gap-2 shadow-md shadow-[#f97316]/20 transition-all"
                    >
                      <Save size={16} /> Save Batch
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Batches;
