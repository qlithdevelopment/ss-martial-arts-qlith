import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, History, Users, Phone } from 'lucide-react';
import api from '../../api/axios';
import SectionHeader from "../../components/SectionHeader";

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '');

// Bento pattern — mirrors the sizing rhythm used in Affiliation / GalleryPage
const spanClasses = [
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
];

const Trainers = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const res = await api.get('/trainers');
        const data = res.data?.data || res.data || [];

        const mappedTrainers = data.map(t => {
          let parsedAchievements = [];
          let parsedExpertise = [];

          try {
            parsedAchievements = typeof t.achievements === 'string' ? JSON.parse(t.achievements) : (Array.isArray(t.achievements) ? t.achievements : [t.achievements]);
          } catch (e) { parsedAchievements = [t.achievements]; }

          try {
            parsedExpertise = typeof t.expertise === 'string' ? JSON.parse(t.expertise) : (Array.isArray(t.expertise) ? t.expertise : [t.expertise]);
          } catch (e) { parsedExpertise = [t.expertise]; }

          return {
            id: t.id.toString(),
            name: t.name,
            rank: t.designation || 'Instructor',
            belt: parsedExpertise[0] || 'Expert',
            experience: parsedAchievements[0] || 'Experienced',
            disciplines: parsedExpertise,
            achievements: parsedAchievements,
            bio: t.biography || '',
            philosophy: t.motivation_line || '',
            phone: t.phone || null,
            image: t.image_path ? `${BASE_URL}${t.image_path}` : null,
          };
        });

        setInstructors(mappedTrainers);
      } catch (error) {
        console.error("Failed to load trainers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  useEffect(() => {
    if (selectedId) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedId]);

  const selectedInstructor = instructors.find(i => i.id === selectedId);

  return (
    <section className="w-full min-h-screen bg-white px-4 md:px-8 py-16 md:py-24 relative overflow-hidden">

      <div className="global-container lg:!px-14 relative z-10">
        <div className="fixed top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[16vw] font-black text-black/[0.05] uppercase tracking-tighter pointer-events-none whitespace-nowrap select-none">
          TRAINERS
        </div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SectionHeader
            label="Meet The Team"
            title="OUR"
            titleColor="text-black"
            highlight="TRAINERS"
          />
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[320px] md:auto-rows-[350px] gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className={`relative rounded-[24px] overflow-hidden bg-gray-900 border border-gray-800 animate-pulse ${spanClasses[idx % spanClasses.length]}`}
              />
            ))
          ) : instructors.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <Users className="text-gray-600 mb-4" size={40} />
              <p className="text-gray-400 font-medium">No trainers to show right now.</p>
            </div>
          ) : (
            instructors.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => setSelectedId(item.id)}
                className={`relative rounded-[24px] cursor-pointer overflow-hidden bg-gray-300 shadow-2xl group hover:shadow-[0_10px_40px_rgba(38,192,255,0.2)] transition-shadow duration-300 ${spanClasses[idx % spanClasses.length]}`}
              >
                <div className="relative rounded-[24px] overflow-hidden bg-white flex flex-col h-full">
                  {/* TOP: Photo section */}
                  <div className="relative w-full h-[70%] md:h-[75%] bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <Users className="text-gray-300" size={48} />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#f97316] text-white font-black text-[10px] tracking-widest uppercase rounded shadow-lg">
                      {item.rank}
                    </div>
                  </div>

                  {/* BOTTOM: Content section */}
                  <div className="flex-1 p-5 md:p-6 md:py-3 flex flex-col justify-start bg-white">
                    <h4 className="text-base md:text-lg font-black text-black uppercase tracking-tight leading-tight line-clamp-2 mb-1">
                      {item.name}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-2">
                      <Award size={12} className="shrink-0 text-[#f97316]" />
                      <span className="truncate">{item.belt}</span>
                    </div>

                    {item.phone && (
                      <a
                        href={`tel:${item.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-[#f97316] transition-colors w-fit"
                      >
                        <Phone size={12} className="shrink-0" />
                        <span className="truncate">{item.phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedId && selectedInstructor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
            className="fixed inset-0 z-[999] overflow-hidden p-4 md:p-10 bg-black/80 backdrop-blur-md flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[1000px] h-full max-h-[100vh] bg-black overflow-y-auto relative flex flex-col md:flex-row shadow-[0_0_50px_rgba(38,192,255,0.2)] border border-gray-800 m-auto shrink-0"
              style={{ borderRadius: "32px", WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
            >
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-50 w-10 h-10 bg-white/10 border border-white/20 hover:bg-[#f97316] hover:border-[#f97316] text-white rounded-full flex items-center justify-center transition-all"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-1/2 h-[300px] md:h-full bg-gradient-to-t md:bg-black relative from-black/50 to-black/0 flex justify-center items-end border-b md:border-b-0 md:border-r border-white/10 pt-6 md:pt-0 shrink-0">
                <img
                  src={selectedInstructor.image}
                  alt={selectedInstructor.name}
                  className="h-full w-full object-contain z-10"
                />
                <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[80px] md:text-[150px] font-black text-white/5 uppercase tracking-tighter leading-none pointer-events-none z-0 whitespace-nowrap -rotate-90 md:rotate-0">
                  {selectedInstructor.name.split(' ')[0]}
                </h2>
              </div>

              <div className="w-full md:w-1/2 h-full  bg-black p-6 md:p-8 lg:p-10 relative flex flex-col justify-start shrink-0 overflow-y-auto">
                <div className="mt-0 md:mt-0">
                  <div className="inline-block px-3 py-1 bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] font-black text-[10px] tracking-widest uppercase mb-2 md:mb-3 rounded-full">
                    {selectedInstructor.rank}
                  </div>

                  <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-1">
                    {selectedInstructor.name}
                  </h2>

                  <p className="text-[#f97316] font-bold text-xs md:text-sm tracking-widest uppercase mb-4 md:mb-6">
                    {selectedInstructor.belt} - {selectedInstructor.experience}
                  </p>
                </div>

                <div className="mb-4 md:mb-6">
                  <h3 className="text-[#26c0ff] text-sm md:text-base font-black uppercase tracking-wider border-b border-[#26c0ff]/30 pb-2 mb-2 md:mb-3 flex items-center gap-3">
                    <History size={16} className="text-[#f97316]" /> Biography
                  </h3>
                  <p className="text-white/70 leading-relaxed font-medium text-[11px] md:text-xs lg:text-sm">
                    {selectedInstructor.bio}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                  <div>
                    <h3 className="text-[#26c0ff] text-sm md:text-base font-black uppercase tracking-wider border-b border-[#26c0ff]/30 pb-2 mb-2 md:mb-3 flex items-center gap-3">
                      <Users size={16} className="text-[#f97316]" /> Expertise
                    </h3>
                    <ul className="space-y-1.5 md:space-y-2">
                      {selectedInstructor.disciplines.map((d, i) => (
                        <li key={i} className="flex items-center gap-3 text-white/80 font-medium text-[11px] md:text-xs">
                          <div className="w-1.5 h-1.5 bg-[#f97316] rounded-full shrink-0"></div> {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[#26c0ff] text-sm md:text-base font-black uppercase tracking-wider border-b border-[#26c0ff]/30 pb-2 mb-2 md:mb-3 flex items-center gap-3">
                      <Award size={16} className="text-[#f97316]" /> Achievements
                    </h3>
                    <ul className="space-y-1.5 md:space-y-2">
                      {selectedInstructor.achievements.map((a, i) => (
                        <li key={i} className="flex items-center gap-3 text-white/80 font-medium text-[11px] md:text-xs">
                          <div className="w-1.5 h-1.5 bg-[#f97316] rounded-full shrink-0"></div> {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl md:rounded-2xl border border-white/10 mb-4 md:mb-6 relative overflow-hidden">
                  <div className="text-[#f97316] text-4xl absolute top-0 left-2 opacity-20 font-serif leading-none">"</div>
                  <p className="text-white/90 italic font-medium text-center text-[11px] md:text-xs relative z-10 pt-1">
                    {selectedInstructor.philosophy}
                  </p>
                </div>

                <button className="w-full py-3 bg-[#f97316] hover:bg-[#b5952f] text-white font-black uppercase tracking-widest text-xs md:text-sm rounded-xl transition-colors shadow-[0_10px_20px_rgba(212,175,55,0.3)] mt-auto shrink-0">
                  Join A Class With {selectedInstructor.name.split(' ')[0]}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Trainers;