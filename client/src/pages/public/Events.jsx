import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Calendar, User, ChevronRight, X, Send } from 'lucide-react';
import eventSeminarImg from "../../assets/event_seminar.png";
import eventTournamentImg from "../../assets/event_tournament.png";

const eventsData = [
  {
    id: 'evt-1',
    title: 'National Winter Grading 2026',
    shortDesc: 'Annual belt promotion test for all intermediate to advanced students.',
    fullDesc: 'The National Winter Grading is the most important testing event of the year. Students from across the region will gather to demonstrate their proficiency in katas, sparring, and board breaking to earn their next rank. Family and friends are welcome to attend and support the candidates.',
    date: '15 Dec 2026',
    time: '09:00 AM - 05:00 PM',
    location: 'Main Dojo Arena, Combat City',
    image: eventSeminarImg,
    speaker: 'Master Himansu Das',
    schedule: [
      { time: '09:00 AM', activity: 'Registration & Warmup' },
      { time: '10:00 AM', activity: 'Kyu Grade Testing' },
      { time: '01:00 PM', activity: 'Dan Grade Testing' },
      { time: '04:30 PM', activity: 'Belt Award Ceremony' }
    ]
  },
  {
    id: 'evt-2',
    title: 'Striking Mastery Seminar',
    shortDesc: 'A deep dive into high-level kickboxing and Muay Thai combinations.',
    fullDesc: 'Join us for an intensive 4-hour seminar focused purely on the art of striking. We will cover advanced footwork, head movement, and power generation. This is ideal for active competitors looking to sharpen their stand-up game before the upcoming tournament season.',
    date: '22 Jan 2027',
    time: '10:00 AM - 02:00 PM',
    location: 'East Wing Training Hall',
    image: eventSeminarImg,
    speaker: 'Sarah Jenkins',
    schedule: [
      { time: '10:00 AM', activity: 'Footwork Drills' },
      { time: '11:30 AM', activity: 'Combination Mechanics' },
      { time: '12:45 PM', activity: 'Live Sparring Rounds' }
    ]
  },
  {
    id: 'evt-3',
    title: 'State Championship 2027',
    shortDesc: 'The largest regional martial arts competition of the year.',
    fullDesc: 'The State Championship brings together the best fighters from over 50 academies. Competitors will battle in Point Sparring, Continuous Sparring, Kata, and Weapons divisions. Registration is open to all ages and belt levels.',
    date: '10 Feb 2027',
    time: '08:00 AM - 08:00 PM',
    location: 'City Sports Complex',
    image: eventTournamentImg,
    speaker: 'Tournament Committee',
    schedule: [
      { time: '08:00 AM', activity: 'Weapons & Forms' },
      { time: '12:00 PM', activity: 'Youth Sparring' },
      { time: '04:00 PM', activity: 'Adult Black Belt Finals' }
    ]
  },
  {
    id: 'evt-4',
    title: 'Mindfulness & Recovery Workshop',
    shortDesc: 'Learn crucial recovery techniques and mental conditioning.',
    fullDesc: 'Physical training is only half the battle. In this workshop, Priya Sharma will guide you through advanced mobility routines, breathwork for adrenaline control, and meditation practices to enhance focus during high-pressure situations.',
    date: '05 Mar 2027',
    time: '09:00 AM - 12:00 PM',
    location: 'Zen Garden Studio',
    image: eventSeminarImg,
    speaker: 'Priya Sharma',
    schedule: [
      { time: '09:00 AM', activity: 'Breathwork & Flow' },
      { time: '10:30 AM', activity: 'Mobility & Stretching' },
      { time: '11:30 AM', activity: 'Guided Meditation' }
    ]
  },
  {
    id: 'evt-5',
    title: 'Submission Grappling Camp',
    shortDesc: 'An intensive weekend focusing on No-Gi BJJ and wrestling.',
    fullDesc: 'A specialized camp dedicated to the ground game. Learn takedowns, guard passes, and high-percentage submissions. This camp includes hours of live rolling and technique breakdowns from ADCC veterans.',
    date: '20 Mar 2027',
    time: '10:00 AM - 04:00 PM',
    location: 'Grappling Mats, Main Dojo',
    image: eventSeminarImg,
    speaker: 'Sarah Grappling',
    schedule: [
      { time: '10:00 AM', activity: 'Takedowns & Defense' },
      { time: '01:00 PM', activity: 'Guard Passing' },
      { time: '02:30 PM', activity: 'Submission Chains & Rolling' }
    ]
  },
  {
    id: 'evt-6',
    title: 'Instructor Certification Course',
    shortDesc: 'The first step to becoming a certified academy instructor.',
    fullDesc: 'This rigorous course is designed for Black Belts who wish to join the teaching staff. You will learn class management, pedagogical methods, safety protocols, and the exact curriculum standards of SS Martial Arts.',
    date: '15 Apr 2027',
    time: '08:00 AM - 06:00 PM',
    location: 'Main Dojo Arena',
    image: eventSeminarImg,
    speaker: 'Master Himansu Das',
    schedule: [
      { time: '08:00 AM', activity: 'Teaching Philosophy' },
      { time: '11:00 AM', activity: 'Curriculum Breakdown' },
      { time: '02:00 PM', activity: 'Practical Teaching Exam' }
    ]
  },
  {
    id: 'evt-7',
    title: 'Women’s Self-Defense Seminar',
    shortDesc: 'Free community seminar on practical self-defense.',
    fullDesc: 'A community-focused event offering essential self-defense tactics for women. We will cover situational awareness, de-escalation techniques, and fundamental strikes and escapes against common grabs and holds.',
    date: '02 May 2027',
    time: '10:00 AM - 01:00 PM',
    location: 'Community Center Hall',
    image: eventSeminarImg,
    speaker: 'Sarah Jenkins',
    schedule: [
      { time: '10:00 AM', activity: 'Situational Awareness' },
      { time: '11:00 AM', activity: 'Breakaways & Escapes' },
      { time: '12:00 PM', activity: 'Striking Fundamentals' }
    ]
  },
  {
    id: 'evt-8',
    title: 'Summer Youth Tournament',
    shortDesc: 'A fun, competitive event exclusively for our junior members.',
    fullDesc: 'Our annual Summer Youth Tournament is designed to introduce kids to competition in a safe, supportive environment. Every participant goes home with a medal and valuable experience on the mats.',
    date: '12 Jun 2027',
    time: '09:00 AM - 03:00 PM',
    location: 'City Sports Complex',
    image: eventTournamentImg,
    speaker: 'Tournament Committee',
    schedule: [
      { time: '09:00 AM', activity: 'Tiny Tigers Forms' },
      { time: '11:00 AM', activity: 'Junior Sparring' },
      { time: '02:00 PM', activity: 'Teen Sparring & Awards' }
    ]
  }
];

const Events = () => {
  const [selectedEventId, setSelectedEventId] = useState(null);

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
      <div className="global-container mb-16 relative z-10">
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
        {eventsData.map((event, idx) => (
          <motion.div 
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedEventId(event.id)}
            className="group relative bg-black rounded-[20px] overflow-hidden border border-white/5 h-[340px] lg:h-[400px] cursor-pointer shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)] w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-0 opacity-[0.2] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply z-10 pointer-events-none"></div>
            
            <img 
              src={event.image} 
              alt={event.title} 
              className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105 opacity-80"
            />

            <div className="absolute inset-0 p-5 z-30 flex flex-col justify-end pointer-events-none">
              
              <div className="flex justify-between items-end">
                {/* Bottom Left Text */}
                <div className="flex flex-col gap-1 pr-2">
                  <div className="inline-block px-2 py-0.5 bg-[#f97316] w-fit text-white font-black text-[9px] tracking-widest uppercase rounded shadow-lg mb-1">
                    {event.date}
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-tight mb-1 line-clamp-2">
                    {event.title}
                  </h2>
                  <div className="flex items-center gap-2 text-[#26c0ff] font-bold text-[10px] uppercase tracking-wider mb-0.5">
                    <Clock size={12} className="text-[#f97316]"/> {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-white/60 font-medium text-[10px] uppercase tracking-wider line-clamp-1">
                    <MapPin size={12} className="text-[#f97316]"/> {event.location}
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
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8 bg-[#26c0ff]/60 backdrop-blur-sm overflow-y-auto custom-scrollbar"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[850px] max-h-[90vh] bg-white rounded-[24px] overflow-hidden relative shadow-2xl border border-gray-200 my-auto flex flex-col"
            >
              
              <button 
                onClick={() => setSelectedEventId(null)} 
                className="absolute top-4 right-4 z-50 w-8 h-8 bg-white shadow-md hover:bg-[#f97316] text-[#0b1b24] hover:text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>

              {/* Modal Banner */}
              <div className="w-full h-[100px] md:h-[120px] shrink-0 relative">
                <div className="absolute inset-0 bg-[#26c0ff]/40 z-10 pointer-events-none"></div>
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title} 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 z-20 bg-gradient-to-t from-[#26c0ff] to-transparent">
                  <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
                    {selectedEvent.title}
                  </h2>
                </div>
              </div>

              {/* Modal Content Grid */}
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar">
                
                {/* Left: Event Details */}
                <div className="flex flex-col gap-4 md:gap-5">
                  
                  {/* Quick Info Bar */}
                  <div className="flex flex-wrap gap-3 bg-[#26c0ff] p-3 rounded-xl border border-[#26c0ff] text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-[#f97316]" />
                      <span className="text-[#0b1b24] font-bold">{selectedEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-[#f97316]" />
                      <span className="text-[#0b1b24] font-bold">{selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#f97316]" />
                      <span className="text-[#0b1b24] font-bold">{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-[#f97316]" />
                      <span className="text-[#0b1b24] font-bold">{selectedEvent.speaker}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[#26c0ff] text-base font-black uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">
                      About The Event
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-medium text-xs md:text-sm">
                      {selectedEvent.fullDesc}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[#26c0ff] text-base font-black uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">
                      Event Schedule
                    </h3>
                    <div className="flex flex-col gap-1.5">
                      {selectedEvent.schedule.map((slot, i) => (
                        <div key={i} className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                          <div className="bg-[#f97316]/10 text-[#f97316] font-bold text-[10px] md:text-xs px-2 py-1 rounded-md shrink-0 w-[80px] md:w-[90px] text-center border border-[#f97316]/20">
                            {slot.time}
                          </div>
                          <p className="text-[#0b1b24] font-bold text-xs md:text-sm">{slot.activity}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right: Registration Form */}
                <div className="bg-[#f9fafb] p-4 md:p-5 rounded-2xl border border-gray-200 shadow-sm h-fit">
                  <h3 className="text-xl font-black text-[#26c0ff] uppercase tracking-tighter mb-1">Register Now</h3>
                  <p className="text-gray-500 text-xs font-medium mb-4">Secure your spot for this event. Limited availability.</p>
                  
                  <form className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[#0b1b24]/50 text-[9px] font-bold uppercase tracking-widest">Full Name</label>
                      <input type="text" className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm text-[#0b1b24] placeholder-gray-400 focus:outline-none focus:border-[#f97316]/50 focus:ring-2 focus:ring-[#f97316]/20 transition-all shadow-sm" placeholder="John Doe" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[#0b1b24]/50 text-[9px] font-bold uppercase tracking-widest">Email Address</label>
                      <input type="email" className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm text-[#0b1b24] placeholder-gray-400 focus:outline-none focus:border-[#f97316]/50 focus:ring-2 focus:ring-[#f97316]/20 transition-all shadow-sm" placeholder="john@example.com" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[#0b1b24]/50 text-[9px] font-bold uppercase tracking-widest">Phone Number</label>
                      <input type="tel" className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm text-[#0b1b24] placeholder-gray-400 focus:outline-none focus:border-[#f97316]/50 focus:ring-2 focus:ring-[#f97316]/20 transition-all shadow-sm" placeholder="+1 (555) 000-0000" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[#0b1b24]/50 text-[9px] font-bold uppercase tracking-widest">Additional Message</label>
                      <textarea rows="2" className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm text-[#0b1b24] placeholder-gray-400 focus:outline-none focus:border-[#f97316]/50 focus:ring-2 focus:ring-[#f97316]/20 transition-all resize-none shadow-sm" placeholder="Any special requests?"></textarea>
                    </div>

                    <button type="button" className="mt-2 w-full bg-[#26c0ff] hover:bg-[#0a192f] text-white font-black uppercase tracking-widest py-3 text-sm rounded-lg transition-all shadow shadow-[#26c0ff]/30 flex items-center justify-center gap-2">
                      Confirm <Send size={14} className="text-[#f97316]" />
                    </button>
                  </form>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Events;
