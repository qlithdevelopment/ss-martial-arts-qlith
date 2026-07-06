import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { X, ArrowRight, Award, History, Users, ChevronRight, User as UserIcon } from 'lucide-react';
import api from '../../api/axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '');

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }
};

const TrainerCard = ({ instructor, setSelectedId, idx }) => {
  return (
    <motion.div
      layoutId={`card-${instructor.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      onClick={() => setSelectedId(instructor.id)}
      className="group relative  bg-black overflow-hidden border border-white/5 h-[340px] md:h-[400px] lg:h-[450px] shrink-0 w-[85vw] md:w-[355px] lg:w-[415px] cursor-pointer shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)] flex flex-col snap-center"
      style={{ borderRadius: "20px", WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.2] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply z-10 pointer-events-none"></div>

      <motion.img
        layoutId={`image-${instructor.id}`}
        src={instructor.image || 'https://via.placeholder.com/400x600?text=Trainer'}
        alt={instructor.name}
        className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105 opacity-80"
      />

      <div className="absolute inset-0 p-5 z-30 flex flex-col justify-end pointer-events-none">
        <div className="flex justify-between items-end w-full">
          {/* Bottom Left Text */}
          <div className="flex flex-col gap-1 pr-2 flex-1">
            <div className="inline-block px-2 py-0.5 bg-[#f97316] w-fit text-white font-black text-[9px] tracking-widest uppercase rounded shadow-lg mb-1">
              {instructor.rank}
            </div>
            <motion.h2 layoutId={`name-${instructor.id}`} className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-tight mb-1 line-clamp-2">
              {instructor.name}
            </motion.h2>
            <div className="flex items-center gap-2 text-[#26c0ff] font-bold text-[10px] uppercase tracking-wider mb-0.5">
              <Award size={12} className="text-[#f97316]" /> {instructor.belt}
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
        TRAINER
      </h2>

    </motion.div>
  );
};

const Trainers = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const targetRef = useRef(null);

  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
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
  const parentRef = useRef(null);
  const childRef = useRef(null);


  useEffect(() => {
    if (!parentRef.current || !childRef.current) return;

    const updateMaxScroll = () => {
      const pWidth = parentRef.current.clientWidth;
      const cWidth = childRef.current.scrollWidth; // scrollWidth is more reliable than offsetWidth for w-max flex rows
      setMaxScroll(Math.max(0, cWidth - pWidth));
    };

    updateMaxScroll(); // measure immediately

    const resizeObserver = new ResizeObserver(updateMaxScroll); // re-measure if card row width changes (images loading, fonts, etc.)
    resizeObserver.observe(parentRef.current);
    resizeObserver.observe(childRef.current);

    window.addEventListener('resize', updateMaxScroll);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateMaxScroll);
    };
  }, [instructors]); // 🔑 re-run once instructors load and cards actually render

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -maxScroll]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const index = Math.round(latest * (instructors.length - 1));
      setActiveIndex(index);
    });
    return () => unsubscribe();
  }, [scrollYProgress, instructors.length]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 50);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (selectedId) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedId]);

  const selectedInstructor = instructors.find(i => i.id === selectedId);

  return (
    <section
      ref={targetRef}
      style={{
        height: typeof window !== 'undefined' ? `calc(100vh + ${maxScroll}px)` : 'auto'
      }}
      className="w-full relative global-container  bg-[#f8f9fa] font-sans selection:bg-[#f97316] selection:text-white pb-20 lg:pb-0"
    >

      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col justify-center">

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/2 px-3  -translate-y-1/2 text-[20vw] font-black text-black/[0.03] uppercase tracking-tighter pointer-events-none z-0 whitespace-nowrap select-none">
            TRAINERS
          </div>
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#26c0ff]/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#f97316]/10 rounded-full blur-[100px]"></div>
          <div className="absolute inset-0 opacity-[0.3] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply"></div>
        </div>

        <div
          className="w-full flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-2 lg:gap-10 h-full relative z-10 pt-8 lg:pt-0"
          style={{ paddingLeft: 'max(1rem, calc(50vw - 700px))' }}
        >

          {/* LEFT PANEL: Sticky Text & Context */}
          <div className="w-full lg:w-[560px] shrink-0 flex flex-col justify-center h-auto lg:h-full pr-4 lg:pr-0">
            <div className="flex gap-6">

              {/* Timeline Indicator */}
              <div className="hidden md:flex flex-col items-center pt-2">
                {instructors.map((_, i) => (
                  <React.Fragment key={i}>
                    <div className="w-3 h-3 rounded-full bg-black/20 relative flex items-center justify-center">
                      {activeIndex === i && (
                        <motion.div
                          layoutId="activeTimelineDot"
                          className="w-3 h-3 rounded-full bg-[#f97316] absolute inset-0"
                          style={{ scale: 1.5 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </div>
                    {i !== instructors.length - 1 && <div className="w-[2px] h-10 bg-black/10 my-2"></div>}
                  </React.Fragment>
                ))}
              </div>

              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-1 w-12 bg-[#f97316] "></div>
                  <h3 className="text-[#f97316] font-bold tracking-[0.2em] uppercase text-sm">Meet The Team</h3>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter">
                  OUR  <span className="text-[#26c0ff]">TRAINERS</span>
                </h2>

                <p className="mt-2 lg:mt-6 text-black/60 text-base md:text-xl font-medium max-w-md">
                  Meet the masters behind the legacy. Our elite trainers bring decades of competition and real-world experience directly to the mats. Scroll to explore their specialized disciplines.
                </p>

                <div className="mt-6 lg:mt-10">
                  <button className="bg-black text-white px-6 md:px-8 py-3 md:py-4 font-bold tracking-widest uppercase text-xs md:text-sm hover:bg-[#f97316] transition-colors duration-300 rounded-md">
                    Join a Class
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Horizontal Slider */}

          <div ref={parentRef} className="w-full lg:flex-1 overflow-hidden relative flex items-center h-[600px] md:h-[720px] lg:h-full hide-scrollbar mt-2 lg:mt-0">

            <motion.div
              ref={childRef}
              style={{ x }}
              className="grid grid-flow-col grid-rows-1 gap-4 lg:gap-8 w-max pl-0 lg:pl-12 lg:pr-6 relative z-10"
            >
              {instructors.map((instructor, idx) => (
                <TrainerCard
                  key={instructor.id}
                  instructor={instructor}
                  setSelectedId={setSelectedId}
                  idx={idx}
                />
              ))}
            </motion.div>
          </div>

        </div>
      </div>

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
              layoutId={`card-${selectedInstructor.id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[1000px] h-full max-h-[90vh] bg-black overflow-hidden relative flex flex-col md:flex-row shadow-[0_0_50px_rgba(38,192,255,0.2)] border border-gray-800 m-auto shrink-0"
              style={{ borderRadius: "32px", WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
            >

              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-50 w-10 h-10 bg-white/10 border border-white/20 hover:bg-[#f97316] hover:border-[#f97316] text-white rounded-full flex items-center justify-center transition-all"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-1/2 h-[350px] md:h-full relative bg-gradient-to-t md:bg-gradient-to-r from-black/50 to-black/0 flex justify-center items-end border-b md:border-b-0 md:border-r border-white/10 pt-6 md:pt-10 shrink-0">
                <motion.img
                  layoutId={`image-${selectedInstructor.id}`}
                  src={selectedInstructor.image}
                  alt={selectedInstructor.name}
                  className={`h-full w-full object-cover object-bottom z-10 ${selectedInstructor.blendMode || ''}`}
                />

                <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[80px] md:text-[150px] font-black text-white/5 uppercase tracking-tighter leading-none pointer-events-none z-0 whitespace-nowrap -rotate-90 md:rotate-0">
                  {selectedInstructor.name.split(' ')[0]}
                </h2>
              </div>

              <div className="w-full md:w-1/2 h-full bg-black p-6 md:p-8 lg:p-10 relative flex flex-col justify-start shrink-0 overflow-y-auto hide-scrollbar">

                <div className="mt-6 md:mt-0">
                  <div className="inline-block px-3 py-1 bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] font-black text-[10px] tracking-widest uppercase mb-2 md:mb-3 rounded-full">
                    {selectedInstructor.rank}
                  </div>

                  <motion.h2 layoutId={`name-${selectedInstructor.id}`} className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-1">
                    {selectedInstructor.name}
                  </motion.h2>

                  <motion.p layoutId={`rank-${selectedInstructor.id}`} className="text-[#f97316] font-bold text-xs md:text-sm tracking-widest uppercase mb-4 md:mb-6">
                    {selectedInstructor.belt} - {selectedInstructor.experience}
                  </motion.p>
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
