import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, HelpCircle, Search, RefreshCw, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import FaqModal from '../../components/admin/faqs/FaqModal';
import AdminTable from '../../components/admin/reusecomponents/AdminTable';
import ConfirmModal from '../../components/admin/reusecomponents/ConfirmationModal';
import PaginationComponent from "../../components/PaginationComponent";
import ViewFaqModal from '../../components/admin/faqs/ViewFaqModal';

const Faqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState({});
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchFaqs();
  }, [page, debouncedSearch]);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/faqs?page=${page}&search=${debouncedSearch}`);
      setFaqs(res.data.data || res.data || []);
      setPagination(res?.data?.pagination || {});
    } catch (error) {
      console.error(error);
      toast.error('Failed to load FAQs (Backend might not be ready yet)');
    } finally {
      setLoading(false);
    }
  };

  // Opens the confirm modal instead of deleting immediately
  const handleDelete = (id) => {
    setFaqToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Runs when user confirms inside the modal
  const handleDeleteConfirm = async () => {
    if (!faqToDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`/faqs/${faqToDelete}`);
      toast.success('FAQ deleted successfully');
      fetchFaqs();
      setIsDeleteModalOpen(false);
      setFaqToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete FAQ');
    } finally {
      setIsDeleting(false);
    }
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedFaq(null);
  }
  const openCreateModal = () => {
    setSelectedFaq(null);
    setSearch('');
    setIsModalOpen(true);
  };
  const openViewModal = (faq) => {
    setSelectedFaq(faq);
    setIsViewModalOpen(true);
  }

  const openEditModal = (faq) => {
    setSelectedFaq(faq);
    setIsModalOpen(true);
  };

  const filteredFaqs = faqs.filter(f =>
    f.question?.toLowerCase().includes(search.toLowerCase()) ||
    f.answer?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedFaqs = filteredFaqs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const COLUMNS = [

    {
      header: 'Question & Answer',
      skeleton: () => (
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-full" />
        </div>
      ),
      render: (_, row) => (
        <div className="py-1">
          <p className="font-bold text-gray-900 leading-tight mb-1">{row.question}</p>
          <p className="text-sm text-gray-500 truncate max-w-32 line-clamp-2">{row.answer}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'isPublish',
      skeleton: () => <div className="h-5 bg-gray-200 rounded-full w-20" />,
      render: (value) => (
        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${value === false
          ? 'bg-red-50 text-red-500'
          : 'bg-green-50 text-green-600'
          }`}>
          {value === false ? 'NotPublished' : 'Published'}
        </span>
      ),
    },
    {
      header: 'Order',
      accessor: 'order',
      skeleton: () => <div className="h-5 bg-gray-200 rounded w-6" />,
      render: (value) => (
        <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
          {value ?? '—'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      skeleton: () => (
        <div className="flex justify-end gap-2">
          <div className="w-16 h-8 rounded-lg bg-gray-200" />
          <div className="w-16 h-8 rounded-lg bg-gray-200" />
        </div>
      ),
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openViewModal(row)}
            className="px-3 py-1.5 text-xs font-bold text-[#f97316] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-100 flex items-center gap-1"
          >
            <Eye size={13} />
          </button>
          <button
            onClick={() => openEditModal(row)}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex w-full md:w-full items-center gap-4">
          
          <div className="relative w-full md:w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
            />
          </div>
          <button
            onClick={openCreateModal}
            disabled={loading}
            className="flex-1 sm:flex-none px-5 py-3 bg-[#f97316] hover:bg-orange-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#f97316]/20 shrink-0"
          >
            <Plus size={18} /> <span className="hidden lg:inline">Add FAQ</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={COLUMNS}
        data={paginatedFaqs}
        isLoading={loading}
        skeletonRows={4}
        emptyIcon={<HelpCircle className="text-gray-400" size={24} />}
        emptyTitle="No FAQs found"
        emptyMessage="Start adding common questions to help your students."
      />
      <div className="mt-8">
        {!loading && faqs.length > 0 && pagination?.total > 0 && (
          <PaginationComponent
            pagination={pagination}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>
      <FaqModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        faqsLength={pagination?.total ?? faqs.length}
        faqData={selectedFaq}
        fetchFaqs={() => {
          setSearch('');
          fetchFaqs();
        }}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete FAQ?"
        message="Are you sure you want to delete this FAQ? This action cannot be undone."
        type="delete"
        isLoading={isDeleting}
      />
      <ViewFaqModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        faq={selectedFaq}
        onDelete={(faq) => {
          closeViewModal();
          handleDelete(faq.id);
        }}
      />
    </div>
  );
};

export default Faqs;