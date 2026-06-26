import React, { useState, useEffect } from 'react';
import { Trash2, MessageSquare, Search, Mail, Phone, Calendar, CheckCircle, BookOpen, RefreshCw, X, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewContact, setViewContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/contacts');
      // If backend returns data directly or inside a data object
      const fetchedContacts = res.data?.data || res.data || [];
      
      setContacts(fetchedContacts);
    } catch (error) {
      toast.error('Failed to load contacts');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium text-gray-900">Are you sure you want to delete this contact lead?</p>
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/contacts/${id}`);
                toast.success('Contact deleted successfully');
                fetchContacts();
              } catch (error) {
                toast.error('Failed to delete contact');
              }
            }} 
            className="px-3 py-1.5 text-xs font-bold text-white bg-red-500 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const filteredContacts = contacts.filter(c => 
    c.first_name?.toLowerCase().includes(search.toLowerCase()) || 
    c.last_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile_number?.toLowerCase().includes(search.toLowerCase()) ||
    c.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Contacts</h1>
          <p className="text-gray-500 mt-1">Manage inquiries and contacts from the website.</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-4">
          <button 
            onClick={fetchContacts} 
            className="p-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-colors"
            title="Refresh Contacts"
          >
            <RefreshCw size={20} />
          </button>
          <div className="relative w-full md:w-64">
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

      {/* Content Area */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-900">Sender Info</th>
                <th className="px-6 py-4 font-bold text-gray-900">Contact Number</th>
                <th className="px-6 py-4 font-bold text-gray-900">Interested Program</th>
                <th className="px-6 py-4 font-bold text-gray-900">Date Received</th>
                <th className="px-6 py-4 font-bold text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-md w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-md w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
                        <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="text-gray-400" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No contacts found</h3>
                    <p className="text-gray-500 text-sm mb-6">When users contact you from the website, they will appear here.</p>
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#f97316] font-bold shrink-0">
                          {(contact.first_name || 'U').charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{(contact.first_name || '') + ' ' + (contact.last_name || '')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                        <Phone size={14} className="text-gray-400" />
                        <a href={`tel:${contact.mobile_number}`} className="hover:text-orange-500 transition-colors">{contact.mobile_number || 'N/A'}</a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-semibold">
                        <BookOpen size={12} />
                        {contact.programs || 'General Inquiry'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(contact.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setViewContact(contact)}
                          className="px-3 py-1.5 text-xs font-bold text-[#f97316] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-100 flex items-center gap-1"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button 
                          onClick={() => handleDelete(contact.id)} 
                          className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 flex items-center gap-1"
                        >
                          <Trash2 size={14} /> Delete
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

      {/* VIEW CONTACT MODAL */}
      <AnimatePresence>
        {viewContact && (
          <>
            <motion.div 
              initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} 
              onClick={() => setViewContact(null)} 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" 
            />
            <motion.div 
              initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} 
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-xl z-50 overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#f97316] font-bold">
                    {(viewContact.first_name || 'U').charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{(viewContact.first_name || '') + ' ' + (viewContact.last_name || '')}</h3>
                    <p className="text-xs text-gray-500 font-medium">Message received on {new Date(viewContact.created_at || Date.now()).toLocaleString()}</p>
                  </div>
                </div>
                <button onClick={() => setViewContact(null)} className="text-gray-400 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 p-2 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Phone size={12} /> Contact Number</p>
                    <p className="text-sm font-semibold text-gray-900">{viewContact.mobile_number || 'Not provided'}</p>
                  </div>
                  <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50">
                    <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1"><BookOpen size={12} /> Interested Program</p>
                    <p className="text-sm font-semibold text-indigo-900">{viewContact.programs || 'General Inquiry'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1"><MessageSquare size={12} /> Full Message</p>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 max-h-64 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {viewContact.message || 'No message provided by the user.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                <button 
                  onClick={() => setViewContact(null)}
                  className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm shadow-sm"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    handleDelete(viewContact.id);
                    setViewContact(null);
                  }}
                  className="px-5 py-2.5 bg-red-50 text-red-600 border border-red-100 font-bold rounded-xl hover:bg-red-100 transition-colors text-sm flex items-center gap-2"
                >
                  <Trash2 size={16} /> Delete Contact
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contacts;
