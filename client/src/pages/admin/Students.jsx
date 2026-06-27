import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, User, Mail, IndianRupee, X, Save, Type, Lock, Activity, FileText, Eye, Award , RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    batch_id: '',
    belt: '',
    total_fee: '',
    status: 1,
    notes: ''
  });

  const openCreateModal = () => {
    setSelectedStudent(null);
    setSearch(''); // Clear search bar so it doesn't hold old values
    setFormData({ name: '', email: '', password: '', batch_id: '', belt: '', total_fee: '', status: 1, notes: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({ ...student, password: '', status: (student.status == '1' || student.status === true || student.status === 'true' || student.status === 'active') ? 1 : 0 });
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoadingData(true);
      const [studentsRes, batchesRes] = await Promise.all([
        api.get('/students?per_page=1000'),
        api.get('/batches?per_page=1000')
      ]);
      const rawStudents = studentsRes.data?.data || studentsRes.data;
      const rawBatches = batchesRes.data?.data || batchesRes.data;
      const fetchedStudents = Array.isArray(rawStudents) ? rawStudents : [];
      const fetchedBatches = Array.isArray(rawBatches) ? rawBatches : [];
      setStudents([...fetchedStudents].sort((a, b) => b.id - a.id));
      setBatches([...fetchedBatches].sort((a, b) => b.id - a.id));
    } catch (err) {
      toast.error('Failed to load data');
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
      setSearch(''); // Fix: Clear search bar after saving a student
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium text-gray-900">Are you sure you want to delete this student?</p>
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
                await api.delete(`/students/${id}`);
                toast.success('Student deleted successfully');
                fetchData();
              } catch (error) {
                toast.error('Failed to delete student. Backend may not support this yet.');
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

  const filteredStudents = students.filter(s => {
    const query = search.toLowerCase();
    const batchName = batches.find(b => b.id === s.batch_id)?.name?.toLowerCase() || '';
    
    return (
      s.name?.toLowerCase().includes(query) || 
      s.email?.toLowerCase().includes(query) ||
      String(s.id) === query || // Strict exact match for ID
      batchName.includes(query)
    );
  });

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
            placeholder="Search students by name, email, ID, or batch..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400 shadow-sm"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={fetchData} 
            className="p-3 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded-xl transition-colors hidden lg:flex items-center justify-center shrink-0"
            title="Refresh Students"
          >
            <RefreshCw size={20} />
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

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-900">Student Info</th>
                <th className="px-6 py-4 font-bold text-gray-900">Assigned Batch</th>
                <th className="px-6 py-4 font-bold text-gray-900">Total Fee</th>
                <th className="px-6 py-4 font-bold text-gray-900">Status</th>
                <th className="px-6 py-4 font-bold text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoadingData ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-md w-24"></div></td>
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
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    No students found. Add your first student!
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#f97316] font-bold shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400">#{student.id}</span>
                            <p className="font-bold text-gray-900" title={student.name}>
                              {student.name?.split(' ').length > 4 
                                ? student.name.split(' ').slice(0, 4).join(' ') + '...' 
                                : student.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <Mail size={12} />
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold">
                        {batches.find(b => b.id === student.batch_id)?.name || 'Unassigned'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-semibold text-gray-900">
                        <IndianRupee size={14} className="text-gray-400" />
                        {student.total_fee}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        String(student.status) === '1' || student.status === true || student.status === 'true' || student.status === 'active'
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {String(student.status) === '1' || student.status === true || student.status === 'true' || student.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            navigate(`/admin/students/${student.id}`);
                          }} 
                          className="p-2 text-gray-400 hover:text-orange-500 bg-gray-50 hover:bg-orange-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button onClick={() => openEditModal(student)} className="p-2 text-gray-400 hover:text-[#26c0ff] bg-gray-50 hover:bg-[#26c0ff]/10 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(student.id)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Lock size={12} className="text-[#f97316]" /> PASSWORD {selectedStudent && <span className="text-gray-400 normal-case tracking-normal">(Leave blank to keep)</span>}
                      </label>
                      <input 
                        type="password" 
                        required={!selectedStudent}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Activity size={12} className="text-[#f97316]" /> ASSIGN BATCH *
                      </label>
                      <select 
                        required
                        value={formData.batch_id}
                        onChange={(e) => setFormData({...formData, batch_id: e.target.value ? parseInt(e.target.value) : ''})}
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
                        onChange={(e) => setFormData({...formData, belt: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, total_fee: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Activity size={12} className="text-[#f97316]" /> STATUS *
                      </label>
                      <select 
                        disabled={!selectedStudent}
                        value={String(formData.status)}
                        onChange={(e) => setFormData({...formData, status: parseInt(e.target.value)})}
                        className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all font-medium placeholder:text-gray-400 appearance-none ${!selectedStudent ? 'opacity-60 cursor-not-allowed' : ''}`}
                        title={!selectedStudent ? "Status can be changed later after the student is added." : ""}
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
                      <Save size={16} /> Save Student
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

export default Students;
