import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Calendar, User, ChevronRight, X, Send } from 'lucide-react';
import eventSeminarImg from "../../assets/event_seminar.png";
import eventTournamentImg from "../../assets/event_tournament.png";

import api from '../../api/axios';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/storage/')) return `http://127.0.0.1:8000${path}`;
  return `http://127.0.0.1:8000/storage/${path}`;
};

const Events = () => {
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [modalMode, setModalMode] = useState('details');
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEventsData(res.data.data);
      } catch (error) {
        console.error('Failed to load events', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (selectedEventId) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedEventId]);

  const selectedEvent = eventsData.find(e => e.id === selectedEventId);

  return (
    <div className="relative overflow-hidden w-full min-h-screen bg-[#f9fafb] pt-24 pb-12 md:pt-28 md:pb-16 lg:pt-32 lg:pb-24 px-4 md:px-8 font-sans selection:bg-[#f97316] selection:text-white">
      
      {/* MASSIVE BACKGROUND TEXT */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-black/[0.03] uppercase tracking-tighter pointer-events-none z-0 whitespace-nowrap select-none">
        EVENTS
      </div>

      {/* Header */}
      <div className="global-container lg:!px-[95px] mb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col items-start mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-1 w-12 bg-[#f97316]"></div>
              <h3 className="text-[#f97316] font-bold tracking-[0.2em] uppercase text-sm">Event Schedule</h3>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter text-black">
              FOLLOW  <span className="text-[#26c0ff]">EVENTS</span>
            </h2>
          </div>
        </motion.div>
      </div>

      {/* Events List */}
      <div className="global-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        ) : eventsData.map((event, idx) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => { setSelectedEventId(event.id); setModalMode('details'); }}
              className="group relative bg-black rounded-[20px] overflow-hidden border border-white/5 h-[340px] lg:h-[400px] cursor-pointer shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)] w-full flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-0 opacity-[0.2] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply z-10 pointer-events-none"></div>
              
              <img 
                src={getImageUrl(event.image)} 
                alt={event.name} 
                className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105 opacity-80"
              />

              <div className="absolute inset-0 p-5 z-30 flex flex-col justify-end pointer-events-none">
                <div className="flex justify-between items-end w-full">
                  {/* Bottom Left Text */}
                  <div className="flex flex-col gap-1 pr-2 flex-1">
                    <div className="inline-block px-2 py-0.5 bg-[#f97316] w-fit text-white font-black text-[9px] tracking-widest uppercase rounded shadow-lg mb-1">
                      {event.date}
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-tight mb-1 line-clamp-2">
                      {event.name}
                    </h2>
                    <div className="flex items-center gap-2 text-[#26c0ff] font-bold text-[10px] uppercase tracking-wider mb-0.5">
                      <Clock size={12} className="text-[#f97316]"/> {event.timing}
                    </div>
                  </div>
                  
                  {/* Bottom Right Arrow Box */}
                  <div className="shrink-0 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center rounded-xl group-hover:bg-[#f97316] group-hover:border-[#f97316] transition-colors pointer-events-auto mb-1">
                    <ChevronRight className="text-white transform group-hover:-rotate-45 transition-transform" size={16} />
                  </div>
                </div>
              </div>

            {/* Giant Background Text */}
            <h2 className="absolute -right-4 top-1/4 text-[80px] font-black text-white/[0.03] uppercase tracking-tighter leading-none pointer-events-none z-0 rotate-90 origin-bottom-right">
              EVENT
            </h2>

          </motion.div>
        ))}
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedEventId && selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEventId(null)}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto custom-scrollbar"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full ${modalMode === 'register' ? 'max-w-[400px]' : 'max-w-[600px]'} max-h-[90vh] bg-white rounded-[24px] overflow-hidden relative shadow-2xl border border-gray-200 my-auto flex flex-col`}
            >
              
              <button 
                onClick={() => setSelectedEventId(null)} 
                className="absolute top-4 right-4 z-50 w-8 h-8 bg-white/80 backdrop-blur-sm shadow-md hover:bg-[#f97316] text-[#0b1b24] hover:text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>

              {/* Modal Banner */}
              <div className={`w-full ${modalMode === 'register' ? 'h-[80px]' : 'h-[100px] md:h-[120px]'} shrink-0 relative`}>
                <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none"></div>
                <img 
                  src={getImageUrl(selectedEvent.image)} 
                  alt={selectedEvent.name} 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-0 left-0 w-full p-4 md:p-5 z-20 bg-gradient-to-t from-black to-transparent">
                  <h2 className={`${modalMode === 'register' ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl'} font-black text-white uppercase tracking-tighter line-clamp-1`}>
                    {selectedEvent.name}
                  </h2>
                </div>
              </div>

              {/* Modal Content */}
              {modalMode === 'details' ? (
                <div className="p-4 md:p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                  
                  {/* Event Details */}
                  <div className="flex flex-col gap-5">
                    
                    {/* Quick Info Bar */}
                    <div className="flex flex-wrap gap-3 bg-[#0b1b24] p-3 rounded-xl border border-gray-200 shadow-sm text-xs justify-center md:justify-start">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#f97316]" />
                        <span className="text-white font-medium tracking-wide">{selectedEvent.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-[#f97316]" />
                        <span className="text-white font-medium tracking-wide">{selectedEvent.timing}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[#26c0ff] text-base font-black uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">
                        About The Event
                      </h3>
                      <p className="text-gray-600 leading-relaxed font-medium text-xs md:text-sm whitespace-pre-wrap">
                        {selectedEvent.description || 'No description provided.'}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 border-t border-gray-100 pt-5">
                      <button 
                        onClick={() => setModalMode('register')}
                        className="w-full bg-[#f97316] hover:bg-orange-600 text-white font-black uppercase tracking-widest py-3.5 md:py-4 text-sm rounded-xl transition-all shadow-lg shadow-[#f97316]/30 hover:shadow-[#f97316]/50 hover:-translate-y-1 flex items-center justify-center gap-2"
                      >
                        Register For This Event <ChevronRight size={16} />
                      </button>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="p-5 md:p-6 bg-[#f9fafb] flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                  <div>
                    <h3 className="text-xl font-black text-[#26c0ff] uppercase tracking-tighter mb-1">Register Now</h3>
                    <p className="text-gray-500 text-xs font-medium">Secure your spot. Limited availability.</p>
                  </div>
                  
                  <form className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[#0b1b24]/50 text-[9px] font-bold uppercase tracking-widest">Full Name</label>
                      <input type="text" className="w-full bg-white border border-gray-200 rounded-lg p-2 md:p-2.5 text-sm text-[#0b1b24] placeholder-gray-400 focus:outline-none focus:border-[#f97316]/50 focus:ring-2 focus:ring-[#f97316]/20 transition-all shadow-sm" placeholder="John Doe" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[#0b1b24]/50 text-[9px] font-bold uppercase tracking-widest">Email Address</label>
                      <input type="email" className="w-full bg-white border border-gray-200 rounded-lg p-2 md:p-2.5 text-sm text-[#0b1b24] placeholder-gray-400 focus:outline-none focus:border-[#f97316]/50 focus:ring-2 focus:ring-[#f97316]/20 transition-all shadow-sm" placeholder="john@example.com" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[#0b1b24]/50 text-[9px] font-bold uppercase tracking-widest">Phone Number</label>
                      <input type="tel" className="w-full bg-white border border-gray-200 rounded-lg p-2 md:p-2.5 text-sm text-[#0b1b24] placeholder-gray-400 focus:outline-none focus:border-[#f97316]/50 focus:ring-2 focus:ring-[#f97316]/20 transition-all shadow-sm" placeholder="+1 (555) 000-0000" />
                    </div>

                    <button type="button" className="mt-4 w-full bg-[#26c0ff] hover:bg-[#0a192f] text-white font-black uppercase tracking-widest py-3 md:py-3.5 text-sm rounded-lg transition-all shadow shadow-[#26c0ff]/30 flex items-center justify-center gap-2">
                      Confirm Registration <Send size={14} className="text-[#f97316]" />
                    </button>
                  </form>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Events;
