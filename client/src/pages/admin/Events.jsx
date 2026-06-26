import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar as CalendarIcon, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import EventModal from '../../components/admin/events/EventModal';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events');
      setEvents(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium text-gray-900">Are you sure you want to delete this event?</p>
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
                await api.delete(`/events/${id}`);
                toast.success('Event deleted successfully');
                fetchEvents();
              } catch (error) {
                toast.error('Failed to delete event');
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

  const openCreateModal = () => {
    setSelectedEvent(null);
    setSearch('');
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const filteredEvents = events.filter(e => 
    e.name?.toLowerCase().includes(search.toLowerCase()) || 
    e.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Event Management</h1>
          <p className="text-gray-500 mt-1">Create, edit, and manage upcoming and past events.</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
            />
          </div>
          <button 
            onClick={openCreateModal}
            className="shrink-0 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-orange-500/20"
          >
            <Plus size={18} /> <span className="hidden lg:inline">Create Event</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No events found</h3>
          <p className="text-gray-500 text-sm mb-6">Start adding events to keep your audience informed.</p>
          <button onClick={openCreateModal} className="text-orange-500 font-bold hover:text-orange-600 text-sm">
            + Create your first event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
              {/* Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {event.image ? (
                  <img src={`http://127.0.0.1:8000/storage/${event.image}`} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <CalendarIcon size={40} />
                  </div>
                )}
                {/* Status badge */}
                <div className="absolute top-3 right-3">
                  <span className={`backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-sm ${
                    event.timing === 'upcoming' ? 'bg-orange-500/90' : 
                    event.timing === 'today' ? 'bg-green-500/90' : 'bg-gray-800/90'
                  }`}>
                    {event.timing}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <CalendarIcon size={12} /> {event.date}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
                  {event.name}
                </h3>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                  {event.description || 'No description provided.'}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <button onClick={() => openEditModal(event)} className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(event.id)} className="flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        eventData={selectedEvent} 
        fetchEvents={() => {
          setSearch('');
          fetchEvents();
        }}
      />
    </div>
  );
};

export default Events;