import React, { useState, useEffect } from 'react';
import { Trash2, Users, Search, Phone, Calendar, RefreshCw, Eye, X, Mail, IndianRupee, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import ConfirmModal from '../../components/admin/reusecomponents/ConfirmationModal.jsx';
import AdminTable from '../../components/admin/reusecomponents/AdminTable.jsx';
import PaginationComponent from '../../components/PaginationComponent.jsx';

// Flip this to false once your backend endpoint is ready.
// No other logic needs to change — fetchRegistrations already
// has the real API call written and ready to go.
const USE_DUMMY_DATA = true;

// ---- Dummy dataset (remove once USE_DUMMY_DATA = false) ----
// Now tagged with event_id so we can simulate filtering by a specific event.
const DUMMY_REGISTRATIONS = Array.from({ length: 40 }, (_, i) => {
  const events = [
    { id: 1, name: 'State Karate Championship' },
    { id: 2, name: 'Summer Self-Defense Camp' },
    { id: 3, name: 'Inter-Academy Sparring Meet' },
    { id: 4, name: 'Kids Taekwondo Fest' },
    { id: 5, name: 'Black Belt Grading Day' },
  ];
  const statuses = ['confirmed', 'pending', 'cancelled'];
  const id = i + 1;
  const event = events[id % events.length];
  return {
    id,
    name: `Participant ${id}`,
    email: `participant${id}@example.com`,
    mobile_number: `98765${(10000 + id).toString().slice(-5)}`,
    event_id: event.id,
    event_name: event.name,
    participants_count: (id % 3) + 1,
    amount_paid: (id % 4) * 500 + 500,
    status: statuses[id % statuses.length],
    registered_at: new Date(Date.now() - id * 86400000).toISOString(),
  };
});
// --------------------------------------------------------------

const UserRegisteredEvents = ({ isOpen, onClose, eventId }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset local state whenever the modal opens for a (possibly new) event
  useEffect(() => {
    if (isOpen && eventId) {
      setSearch('');
      setDebouncedSearch('');
      setPage(1);
      setSelectedRegistration(null);
      fetchRegistrations(1, '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, eventId]);

  // Refetch on page/search change while open
  useEffect(() => {
    if (isOpen && eventId) {
      fetchRegistrations(page, debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch]);

  const fetchRegistrations = async (fetchPage = page, fetchSearch = debouncedSearch) => {
    if (!eventId) return;
    try {
      setLoading(true);

      if (!USE_DUMMY_DATA) {
        // ---- Real API call: fetches registrations scoped to this event ----
        const res = await api.get(`/events/${eventId}/registrations?page=${fetchPage}&search=${fetchSearch}`);
        const data = res.data?.data || res.data || [];
        const paginationData = res.data?.pagination || {};
        setRegistrations(data);
        setPagination(paginationData);
        return;
      }

      // ---- Dummy data path: simulates server-side search + pagination, scoped to eventId ----
      await new Promise((resolve) => setTimeout(resolve, 400)); // simulate network delay

      const perPage = 10;
      const query = fetchSearch.toLowerCase();

      const filtered = DUMMY_REGISTRATIONS.filter((r) => {
        if (r.event_id !== Number(eventId)) return false;
        if (!query) return true;
        return (
          r.name.toLowerCase().includes(query) ||
          r.email.toLowerCase().includes(query) ||
          r.mobile_number.includes(query)
        );
      });

      const lastPage = Math.max(1, Math.ceil(filtered.length / perPage));
      const safePage = Math.min(fetchPage, lastPage);
      const start = (safePage - 1) * perPage;
      const pageData = filtered.slice(start, start + perPage);

      setRegistrations(pageData);
      setPagination({
        current_page: safePage,
        last_page: lastPage,
        per_page: perPage,
        total: filtered.length,
      });

      if (safePage !== fetchPage) setPage(safePage);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load registrations');
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const closeViewModal = () => setSelectedRegistration(null);

  const handleDelete = (id) => {
    setRegistrationToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!registrationToDelete) return;
    try {
      setIsDeleting(true);

      if (!USE_DUMMY_DATA) {
        await api.delete(`/event-registrations/${registrationToDelete}`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }

      toast.success('Registration deleted successfully');
      setIsDeleteModalOpen(false);
      setRegistrationToDelete(null);
      fetchRegistrations(page, debouncedSearch);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete registration');
    } finally {
      setIsDeleting(false);
    }
  };

  const statusStyles = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const COLUMNS = [
    {
      header: 'Participant Info',
      skeleton: () => (
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-28"></div>
          <div className="h-3 bg-gray-200 rounded w-36"></div>
        </div>
      ),
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
            {row.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 truncate max-w-40" title={row.name}>{row.name}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <Mail size={12} />
              <span className="truncate max-w-40">{row.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact',
      accessor: 'mobile_number',
      skeleton: () => <div className="h-6 bg-gray-200 rounded-md w-24"></div>,
      render: (value) => (
        <a href={`tel:${value}`} className="flex items-center gap-1.5 font-semibold text-gray-700 hover:text-orange-500 transition-colors">
          <Phone size={14} className="text-gray-400" />
          {value || 'N/A'}
        </a>
      ),
    },
    {
      header: 'Participants',
      accessor: 'participants_count',
      skeleton: () => <div className="h-5 bg-gray-200 rounded w-10"></div>,
      render: (value) => (
        <div className="flex items-center gap-1 font-semibold text-gray-900">
          <Users size={14} className="text-gray-400" />
          {value}
        </div>
      ),
    },
    {
      header: 'Amount Paid',
      accessor: 'amount_paid',
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
      render: (value) => (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full capitalize ${statusStyles[value] || 'bg-gray-100 text-gray-700'}`}>
          {value}
        </span>
      ),
    },
    {
      header: 'Registered On',
      accessor: 'registered_at',
      skeleton: () => <div className="h-5 bg-gray-200 rounded w-20"></div>,
      render: (value) => (
        <span className="text-gray-500 text-sm">
          {new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
            onClick={() => setSelectedRegistration(row)}
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

  if (!isOpen) return null;

  return (
    <>
      {/* Outer modal shell */}
      <AnimatePresence>
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
          transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
        >
          <div
            className="bg-white w-full max-w-4xl rounded-[1.5rem] shadow-2xl flex flex-col max-h-[90dvh] pointer-events-auto overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Registered Participants</h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">All registrations for this event</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto flex-1">
              {/* Header row: refresh + search */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex w-full md:w-auto items-center gap-4">
                  <button
                    onClick={() => fetchRegistrations(page, debouncedSearch)}
                    className="p-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-colors"
                    title="Refresh Registrations"
                  >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                  </button>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search registrations..."
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
                data={registrations}
                isLoading={loading}
                skeletonRows={3}
                emptyIcon={<Ticket className="text-gray-400" size={24} />}
                emptyTitle="No registrations found"
                emptyMessage="No one has registered for this event yet."
              />
              <div className="mt-8">
                {!loading && registrations.length > 0 && pagination?.total > 0 && (
                  <PaginationComponent
                    pagination={pagination}
                    onPageChange={(newPage) => setPage(newPage)}
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Registration?"
        message="Are you sure you want to delete this registration? This action cannot be undone."
        type="delete"
        isLoading={isDeleting}
      />

      {/* View Modal (nested inside the outer modal) */}
      <AnimatePresence>
        {selectedRegistration && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeViewModal}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
              className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
            >
              <div
                className="bg-white w-full max-w-lg rounded-[1.5rem] shadow-2xl flex flex-col max-h-[85dvh] pointer-events-auto overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 shrink-0">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Registration Details</h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Full event registration record</p>
                  </div>
                  <button
                    onClick={closeViewModal}
                    className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <X size={20} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">
                      {selectedRegistration.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{selectedRegistration.name}</p>
                      <span className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-bold rounded-full capitalize ${statusStyles[selectedRegistration.status] || 'bg-gray-100 text-gray-700'}`}>
                        {selectedRegistration.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <DetailField icon={Mail} label="Email" value={selectedRegistration.email} />
                    <DetailField icon={Phone} label="Phone" value={selectedRegistration.mobile_number} />
                    <DetailField icon={Ticket} label="Event" value={selectedRegistration.event_name} />
                    <DetailField icon={Users} label="Participants" value={selectedRegistration.participants_count} />
                    <DetailField icon={IndianRupee} label="Amount Paid" value={`₹${selectedRegistration.amount_paid}`} />
                    <DetailField
                      icon={Calendar}
                      label="Registered On"
                      value={new Date(selectedRegistration.registered_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    />
                  </div>
                </div>

                <div className="p-5 sm:p-6 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                  <button
                    onClick={closeViewModal}
                    className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const id = selectedRegistration.id;
                      closeViewModal();
                      handleDelete(id);
                    }}
                    className="px-5 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl flex items-center gap-2 transition-all"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Small helper for the view modal's label/value pairs
const DetailField = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
      <Icon size={12} className="text-[#f97316]" /> {label}
    </span>
    <span className="text-sm font-semibold text-gray-900">{value || 'N/A'}</span>
  </div>
);

export default UserRegisteredEvents;