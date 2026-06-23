import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, HelpCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import FaqModal from '../../components/admin/faqs/FaqModal';

const Faqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/faqs');
      // If backend returns data directly or inside a data object
      setFaqs(res.data.data || res.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load FAQs (Backend might not be ready yet)');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await api.delete(`/faqs/${id}`);
      toast.success('FAQ deleted successfully');
      fetchFaqs();
    } catch (error) {
      toast.error('Failed to delete FAQ');
    }
  };

  const openCreateModal = () => {
    setSelectedFaq(null);
    setIsModalOpen(true);
  };

  const openEditModal = (faq) => {
    setSelectedFaq(faq);
    setIsModalOpen(true);
  };

  const filteredFaqs = faqs.filter(f => 
    f.question?.toLowerCase().includes(search.toLowerCase()) || 
    f.answer?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">FAQ Management</h1>
          <p className="text-gray-500 mt-1">Manage frequently asked questions to help your members.</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search FAQs..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
            />
          </div>
          <button 
            onClick={openCreateModal}
            className="shrink-0 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-orange-500/20"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Add FAQ</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No FAQs found</h3>
          <p className="text-gray-500 text-sm mb-6">Start adding common questions to help your students.</p>
          <button onClick={openCreateModal} className="text-orange-500 font-bold hover:text-orange-600 text-sm">
            + Add your first FAQ
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 group">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1 ${faq.is_published === false ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                    {faq.is_published === false ? 'HIDDEN' : 'PUBLISHED'}
                  </span>
                  {faq.order !== undefined && (
                    <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-50 px-2 py-0.5 rounded">
                      Order: {faq.order}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm text-gray-500">
                  {faq.answer}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex md:flex-col items-center justify-end gap-2 md:w-32 shrink-0 md:border-l border-gray-100 md:pl-4 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0">
                <button onClick={() => openEditModal(faq)} className="w-full flex items-center justify-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg">
                  <Edit2 size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(faq.id)} className="w-full flex items-center justify-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FaqModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        faqData={selectedFaq}
        fetchFaqs={fetchFaqs}
      />
    </div>
  );
};

export default Faqs;
