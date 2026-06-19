import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { MapPin, Clock, Calendar, User, ChevronRight, X, Send, Image as ImageIcon } from 'lucide-react';

import axios from '../../api/axios';
import Button from '../../components/ui/Button';

import { getImageUrl } from '../../utils/imageUtils'
import PublicEventCard from '../../components/public/events/PublicEventCard'
import EventDetailModal from '../../components/public/events/EventDetailModal';

const Events = () => {
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [eventsData, setEventsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      await axios.post(`/events/register`, {
        event_id: selectedEventId,
        ...registerData
      });
      toast.success('Successfully registered for the event!');
      setIsRegisterOpen(false);
      setRegisterData({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to register. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // API Fetch logic
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/events');
        if (response.data && response.data.data) {
          setEventsData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch events from backend:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedEventId]);

  const selectedEvent = eventsData.find(e => e.id === selectedEventId);

  return (
    <div className="relative overflow-hidden w-full min-h-screen bg-[#f9fafb] pt-24 pb-12 md:pt-28 md:pb-16 lg:pt-32 lg:pb-24 px-4 md:px-8 font-sans selection:bg-[var(--color-primary2)] selection:text-white">
      
      {/* MASSIVE BACKGROUND TEXT */}
      <div className="fixed top-[35vh] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-black/[0.03] uppercase tracking-tighter pointer-events-none z-0 whitespace-nowrap select-none">
        EVENTS
      </div>

      {/* Header */}
      <div className="global-container mb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col items-start mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-1 w-12 bg-[var(--color-primary2)]"></div>
              <h3 className="text-[var(--color-primary2)] font-bold tracking-[0.2em] uppercase text-sm">Event Schedule</h3>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter text-black">
              FOLLOW  <span className="text-[var(--color-primary)]">EVENTS</span>
            </h2>
          </div>
        </motion.div>
      </div>

      {/* Events List */}
      <div className="global-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {eventsData.map((event, idx) => (
          <PublicEventCard
            key={event.id}
            event={event}
            idx={idx}
            onClick={setSelectedEventId}
          />
        ))}
      </div>

      <EventDetailModal
        selectedEventId={selectedEventId}
        selectedEvent={selectedEvent}
        setSelectedEventId={setSelectedEventId}
        isRegisterOpen={isRegisterOpen}
        setIsRegisterOpen={setIsRegisterOpen}
        handleRegisterSubmit={handleRegisterSubmit}
        registerData={registerData}
        setRegisterData={setRegisterData}
        isRegistering={isRegistering}
      />

    </div>
  );
};

export default Events;
