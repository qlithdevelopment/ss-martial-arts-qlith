import React, { useState, useEffect } from 'react';
import { Trash2, MessageSquare, Search, Phone, BookOpen, RefreshCw, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import ConfirmModal from '../../components/admin/reusecomponents/ConfirmationModal';
import AdminTable from '../../components/admin/reusecomponents/AdminTable';
import ViewContactModal from '../../components/admin/contacts/ViewContactModal';
import PaginationComponent from '../../components/PaginationComponent.jsx';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');    
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchContacts();
  }, [page, debouncedSearch]);


  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/contacts?page=${page}&search=${debouncedSearch}`);
      setContacts(res.data?.data || res.data || []);
      setPagination(res.data?.pagination);
      const data = res.data?.data || res.data || [];
      const paginationData = res.data?.pagination;

      setContacts(data);
      setPagination(paginationData);
      if (data.length === 0 && page !== 1) {
        setPage(1);
        return;
      }
    } catch {
      toast.error('Failed to load contacts');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const closeViewModal = () => {    
    setSelectedContact(null);
  };

  const handleDelete = (id) => {
    setContactToDelete(id);   
    setIsDeleteModalOpen(true);

  };
  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`/contacts/${contactToDelete}`);
      toast.success('Contact deleted successfully');
      fetchContacts();
      setIsDeleteModalOpen(false);
      setContactToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete contact');
    } finally {
      setIsDeleting(false);
    }
  };



  const COLUMNS = [
    {
      header: 'Sender Info',
      skeleton: () => (
        <div className="flex-col items-center gap-5">         
          <div className="h-4 bg-gray-200 my-1 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-30"></div>
        </div>
      ),
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="min-w-0 max-w-48 flex-1">
            <p className="font-bold max-w-28 truncate text-gray-900">
              {(row.first_name || '')+' '+(row.last_name || '')}
            </p>
            <p className="font-normal max-w-30 text-gray-400 truncate">
              {(row.message || '') }
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact Number',
      accessor: 'mobile_number',
      skeleton: () => <div className="h-6 bg-gray-200 rounded-md w-24"></div>,
      render: (value) => (
        <div className="flex items-center gap-1.5 font-semibold text-gray-700">          
          <a href={`tel:${value}`} className="hover:text-orange-500 transition-colors">
            {value || 'N/A'}
          </a>
        </div>
      ),
    },
    {
      header: 'Interested Program',
      accessor: 'programs',
      skeleton: () => <div className="h-6 bg-gray-200 rounded-md w-32"></div>,
      render: (value) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-semibold">          
          {value || 'General Inquiry'}
        </span>
      ),
    },
    {
      header: 'Date Received',
      accessor: 'created_at',
      skeleton: () => <div className="h-5 bg-gray-200 rounded w-20"></div>,
      render: (value) => (
        <span className="text-gray-500 text-sm">
          {new Date(value || Date.now()).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      skeleton: () => (
        <div className="flex justify-end gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
          <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
        </div>
      ),
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setSelectedContact(row)}
            className="px-3 py-1.5 text-xs font-bold text-[#f97316] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-100 flex items-center gap-1"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 flex items-center gap-1"
          >
            <Trash2 size={14} />
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
          <button
            onClick={fetchContacts}
            className="p-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-colors"
            title="Refresh Contacts"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="relative w-full md:w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={COLUMNS}
        data={contacts}
        isLoading={loading}
        skeletonRows={3}
        emptyIcon={<MessageSquare className="text-gray-400" size={24} />}
        emptyTitle="No contacts found"
        emptyMessage="When users contact you from the website, they will appear here."
      />
      <div className="mt-8">
        {!loading && contacts.length > 0 && pagination?.total > 0 && (
          <PaginationComponent
            pagination={pagination}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Contact?"
        message="Are you sure you want to delete this Contact? This action cannot be undone."
        type="delete"
        isLoading={isDeleting}
      />
      <ViewContactModal
        isOpen={!!selectedContact}
        onClose={closeViewModal}
        contact={selectedContact}
        onDelete={(contact) =>{
          closeViewModal();
          handleDelete(contact.id);
        }}
      />      
    </div>
  );
};

export default Contacts;
