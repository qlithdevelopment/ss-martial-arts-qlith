import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { X, ArrowRight, Award, History, Users } from 'lucide-react';
import generatedTrainerImg from "../../assets/master_kick_bgrm.png";
import generatedTrainer2Img from "../../assets/generated_trainer2.png";
import generatedTrainer3Img from "../../assets/yoga_master_bgrm.png";
import masterKickImg from "../../assets/master_kick_bgrm.png";
import femaleMmaImg from "../../assets/female_mma_bgrm.png";
import yogaMasterImg from "../../assets/yoga_master_bgrm.png";
import mastersGroupImg from "../../assets/masters_group_bgrm.png";

const instructors = [
  {
    id: 'master-himansu',
    name: "Master Himansu",
    rank: "Chief Instructor",
    belt: "8th Dan Black Belt",
    experience: "25+ Years Experience",
    disciplines: ["Karate", "Self Defense", "Competition Training"],
    achievements: ["National Champion", "International Referee", "Trained 500+ Students"],
    bio: "Master Himansu Das is the visionary founder and driving force behind the academy. With over two decades of elite martial arts expertise, he has dedicated his life to transforming students into disciplined, resilient individuals. His rigorous training methodologies are rooted in traditional values but adapted for modern sports science.",
    philosophy: "Discipline is the bridge between goals and accomplishment. We don't just build fighters; we build leaders for tomorrow.",
    image: generatedTrainerImg,
    blendMode: "", 
    gridClass: "col-span-1 lg:col-span-2 row-span-2 min-h-[500px] lg:min-h-[600px]",
    imageLayout: "bottom-0 right-0 w-[70%] md:w-[60%] lg:w-[55%] h-[90%] md:h-[100%] lg:h-[105%] object-contain object-right-bottom md:object-bottom lg:object-right-bottom"
  },
  {
    id: 'sarah-striking',
    name: "Sarah Jenkins",
    rank: "Senior Coach",
    belt: "Black Belt BJJ",
    experience: "15+ Years Experience",
    disciplines: ["MMA", "BJJ", "Striking"],
    achievements: ["State Champion", "Submission Specialist", "Elite MMA Fighter"],
    bio: "Sarah is a fierce competitor and dedicated mentor focusing on ground game, submission techniques, and high-intensity striking. A veteran of numerous national tournaments, she brings raw combat experience directly to the training mats.",
    philosophy: "The ground is my ocean, and I am the shark. Leave no limb un-locked.",
    image: generatedTrainer2Img,
    blendMode: "",
    gridClass: "col-span-1 min-h-[450px] lg:min-h-[500px]",
    imageLayout: "bottom-0 right-0 w-[70%] md:w-[60%] lg:w-[55%] h-[90%] md:h-[100%] lg:h-[105%] object-contain object-right-bottom md:object-bottom lg:object-right-bottom"
  },
  {
    id: 'priya-wellness',
    name: "Priya Sharma",
    rank: "Yoga & Wellness Expert",
    belt: "Certified Yogi",
    experience: "10+ Years Experience",
    disciplines: ["Vinyasa", "Mobility", "Breathwork"],
    achievements: ["Mobility Coach", "Mindfulness Guide", "Corporate Wellness"],
    bio: "Priya brings inner peace to physical warfare. As a master of breath, flexibility, and mental fortitude, she helps fighters recover faster, prevent injuries, and maintain a laser-focused mindset during high-pressure competitions.",
    philosophy: "Strength without flexibility is fragile. The battle is won in the mind before the mat.",
    image: generatedTrainer3Img,
    blendMode: "",
    gridClass: "col-span-1 min-h-[450px] lg:min-h-[500px]",
    imageLayout: "bottom-0 right-0 w-[70%] md:w-[60%] lg:w-[55%] h-[90%] md:h-[100%] lg:h-[105%] object-contain object-right-bottom md:object-bottom lg:object-right-bottom"
  },
  {
    id: 'himansu-action',
    name: "Himansu Action",
    rank: "Competition Coach",
    belt: "8th Dan Black Belt",
    experience: "International Level",
    disciplines: ["Kumite", "Kata", "Weapons"],
    achievements: ["Gold Medalist Coach", "Weapons Master", "Olympic Form Trainer"],
    bio: "When preparing athletes for the world stage, Master Himansu shifts focus to extreme competitive edge. This program hones reaction times, precise point-scoring techniques, and international tournament preparation strategies.",
    philosophy: "Victory is reserved for those who are willing to pay its price in sweat.",
    image: masterKickImg,
    blendMode: "",
    gridClass: "col-span-1 min-h-[450px] lg:min-h-[500px]",
    imageLayout: "bottom-0 right-0 w-[70%] md:w-[60%] lg:w-[55%] h-[90%] md:h-[100%] lg:h-[105%] object-contain object-right-bottom md:object-bottom lg:object-right-bottom"
  },
  {
    id: 'sarah-grappling',
    name: "Sarah Grappling",
    rank: "Grappling Head",
    belt: "Black Belt BJJ",
    experience: "ADCC Veteran",
    disciplines: ["No-Gi BJJ", "Wrestling", "Judo"],
    achievements: ["ADCC Competitor", "Multiple Time Champ", "Submission Grappling Expert"],
    bio: "Advanced submission grappling focusing on competitive dominance. Sarah's specialized classes break down the mechanics of leverage, pressure, and positional control required to dismantle larger opponents.",
    philosophy: "Technique conquers brute strength. Fluidity conquers rigidity.",
    image: femaleMmaImg,
    blendMode: "",
    gridClass: "col-span-1 min-h-[450px] lg:min-h-[500px]",
    imageLayout: "bottom-0 right-0 w-[70%] md:w-[60%] lg:w-[55%] h-[90%] md:h-[100%] lg:h-[105%] object-contain object-right-bottom md:object-bottom lg:object-right-bottom"
  },
  {
    id: 'priya-seminar',
    name: "Priya Seminars",
    rank: "Mental Coach",
    belt: "Wellness Director",
    experience: "High-Performance Coach",
    disciplines: ["Meditation", "Recovery", "Focus"],
    achievements: ["Guest Speaker", "Sports Psychologist", "Elite Team Consultant"],
    bio: "Guiding the mental preparation of elite athletes, Priya conducts seminars on sports psychology, adrenaline control, and flow-state activation. Her methods are utilized by our top-tier competitors.",
    philosophy: "Conquer yourself, and you conquer the world.",
    image: yogaMasterImg,
    blendMode: "",
    gridClass: "col-span-1 min-h-[450px] lg:min-h-[500px]",
    imageLayout: "bottom-0 right-0 w-[70%] md:w-[60%] lg:w-[55%] h-[90%] md:h-[100%] lg:h-[105%] object-contain object-right-bottom md:object-bottom lg:object-right-bottom"
  },
  {
    id: 'himansu-legacy',
    name: "The Legacy",
    rank: "Academy Founder",
    belt: "Since 1999",
    experience: "Generations Built",
    disciplines: ["Full Spectrum Arts", "Instructor Certification"],
    achievements: ["10,000+ Alumni", "Community Leaders", "Lifetime Achievement"],
    bio: "The academy is more than a gym; it is a legacy. Master Himansu oversees the rigorous certification of new instructors, ensuring the standard of excellence is passed down perfectly to the next generation.",
    philosophy: "True mastery is not in hoarding knowledge, but in creating new masters.",
    image: mastersGroupImg,
    blendMode: "",
    gridClass: "col-span-1 lg:col-span-3 min-h-[450px] lg:min-h-[500px]",
    imageLayout: "bottom-0 right-0 w-[70%] md:w-[60%] lg:w-[55%] h-[90%] md:h-[100%] lg:h-[105%] object-contain object-right-bottom md:object-bottom lg:object-right-bottom"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }
};

const TrainerCard = ({ instructor, setSelectedId }) => {
  return (
    <motion.div 
      layoutId={`card-${instructor.id}`}
      onClick={() => setSelectedId(instructor.id)}
      className="group relative bg-black rounded-[24px] overflow-hidden border border-white/10 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(38,192,255,0.4)] hover:border-[var(--color-primary)]/60 cursor-pointer h-[280px] md:h-[350px] lg:h-[450px] shrink-0 w-[85vw] md:w-[320px] lg:w-[360px] transition-transform duration-300 snap-center"
      style={{ borderRadius: "24px", WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
    >
      <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none z-0"></div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

      <motion.img 
        layoutId={`image-${instructor.id}`}
        src={instructor.image} 
        alt={instructor.name} 
        className={`absolute bottom-0 right-0 z-20 transition-transform duration-700 group-hover:scale-105 h-[95%] w-auto object-contain object-right-bottom ${instructor.blendMode || ''}`}
      />

      <div className="absolute top-0 left-0 w-[60%] md:w-[55%] lg:w-[60%] h-full p-6 md:p-8 z-30 flex flex-col justify-between pointer-events-none">
        
        <div>
          <motion.h2 layoutId={`name-${instructor.id}`} className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase mb-1 leading-none">
            {instructor.name}
          </motion.h2>
          <motion.p layoutId={`rank-${instructor.id}`} className="text-[var(--color-primary2)] font-bold text-[10px] md:text-xs tracking-widest uppercase mb-4 leading-tight">
            {instructor.belt}
          </motion.p>
          
          <div className="space-y-4 max-w-sm mt-4">
            <div>
              <p className="text-white/40 text-[10px] tracking-widest uppercase mb-2">Expertise</p>
              <ul className="text-white/80 text-xs md:text-sm font-medium space-y-1.5">
                {instructor.disciplines.slice(0, 3).map((d, i) => <li key={i}>• {d}</li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 flex items-center gap-3 group-hover:gap-5 transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary2)]/10 border border-[var(--color-primary2)]/30 flex items-center justify-center text-[var(--color-primary2)] shrink-0">
            <ArrowRight size={16} />
          </div>
          <span className="text-[var(--color-primary2)] text-[10px] font-bold tracking-widest uppercase">View Profile</span>
        </div>
      </div>
    </motion.div>
  );
};

const Trainers = () => {
  const [selectedId, setSelectedId] = useState(null);
  const targetRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const parentRef = useRef(null);
  const childRef = useRef(null);
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    const updateMaxScroll = () => {
      if (parentRef.current && childRef.current) {
        const pWidth = parentRef.current.clientWidth;
        const cWidth = childRef.current.offsetWidth;
        setMaxScroll(Math.max(0, cWidth - pWidth));
      }
    };
    
    setTimeout(updateMaxScroll, 100);
    window.addEventListener('resize', updateMaxScroll);
    return () => window.removeEventListener('resize', updateMaxScroll);
  }, []);

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
  }, [scrollYProgress]);

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
      className="w-full relative bg-[#f8f9fa] font-sans selection:bg-[var(--color-primary2)] selection:text-white pb-20 lg:pb-0"
    >
      
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col justify-center">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-black/[0.03] uppercase tracking-tighter pointer-events-none z-0 whitespace-nowrap select-none">
          TRAINERS
        </div>
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[var(--color-primary)]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[var(--color-primary2)]/10 rounded-full blur-[100px]"></div>
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
                        className="w-3 h-3 rounded-full bg-[var(--color-primary2)] absolute inset-0"
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
                <div className="h-1 w-12 bg-[var(--color-primary2)]"></div>
                <h3 className="text-[var(--color-primary2)] font-bold tracking-[0.2em] uppercase text-sm">Meet The Team</h3>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none tracking-tighter">
                OUR  <span className="text-[var(--color-primary)]">TRAINERS</span>
              </h2>
              
              <p className="mt-2 lg:mt-6 text-black/60 text-base md:text-xl font-medium max-w-md">
                Meet the masters behind the legacy. Our elite trainers bring decades of competition and real-world experience directly to the mats. Scroll to explore their specialized disciplines.
              </p>

              <div className="mt-6 lg:mt-10">
                <button className="bg-black text-white px-6 md:px-8 py-3 md:py-4 font-bold tracking-widest uppercase text-xs md:text-sm hover:bg-[var(--color-primary2)] transition-colors duration-300 rounded-md">
                  Join a Class
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Horizontal Slider */}
        <div ref={parentRef} className="w-full lg:flex-1 overflow-hidden relative flex items-center h-[280px] md:h-[350px] lg:h-full hide-scrollbar mt-2 lg:mt-0">
          
          <motion.div 
            ref={childRef}
            style={{ x }}
            className="flex gap-4 lg:gap-8 w-max pl-0 lg:pl-12 relative z-10"
          >
            {instructors.map((instructor) => (
              <TrainerCard 
                key={instructor.id} 
                instructor={instructor} 
                setSelectedId={setSelectedId} 
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
            className="fixed inset-0 z-[999] overflow-y-auto p-4 py-8 md:p-10 bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center custom-scrollbar"
          >
            <motion.div 
              layoutId={`card-${selectedInstructor.id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[1200px] h-auto bg-black rounded-[32px] overflow-hidden relative flex flex-col md:flex-row shadow-[0_0_50px_rgba(38,192,255,0.2)] border border-gray-800 m-auto shrink-0"
              style={{ borderRadius: "32px" }}
            >
              
              <button 
                onClick={() => setSelectedId(null)} 
                className="absolute top-4 right-4 md:top-6 md:right-6 z-50 w-10 h-10 bg-white/10 border border-white/20 hover:bg-[var(--color-primary2)] hover:border-[var(--color-primary2)] text-white rounded-full flex items-center justify-center transition-all"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-1/2 h-[350px] md:h-auto md:min-h-[500px] relative bg-gradient-to-t md:bg-gradient-to-r from-black/50 to-black/0 flex justify-center items-end border-b md:border-b-0 md:border-r border-white/10 pt-6 md:pt-10 shrink-0">
                <motion.img 
                  layoutId={`image-${selectedInstructor.id}`}
                  src={selectedInstructor.image} 
                  alt={selectedInstructor.name} 
                  className={`h-full w-auto object-contain object-bottom z-10 ${selectedInstructor.blendMode || ''}`}
                />
                
                <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[80px] md:text-[150px] font-black text-white/5 uppercase tracking-tighter leading-none pointer-events-none z-0 whitespace-nowrap -rotate-90 md:rotate-0">
                  {selectedInstructor.name.split(' ')[0]}
                </h2>
              </div>

              <div className="w-full md:w-1/2 h-auto bg-black p-6 md:p-8 lg:p-10 relative flex flex-col justify-center shrink-0">
                
                <div>
                  <div className="inline-block px-3 py-1 bg-[var(--color-primary2)]/10 border border-[var(--color-primary2)]/30 text-[var(--color-primary2)] font-black text-[10px] tracking-widest uppercase mb-2 md:mb-3 rounded-full">
                    {selectedInstructor.rank}
                  </div>
                  
                  <motion.h2 layoutId={`name-${selectedInstructor.id}`} className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-1">
                    {selectedInstructor.name}
                  </motion.h2>
                  
                  <motion.p layoutId={`rank-${selectedInstructor.id}`} className="text-[var(--color-primary2)] font-bold text-xs md:text-sm tracking-widest uppercase mb-4 md:mb-6">
                    {selectedInstructor.belt} - {selectedInstructor.experience}
                  </motion.p>
                </div>

                <div className="mb-4 md:mb-6">
                  <h3 className="text-[var(--color-primary)] text-sm md:text-base font-black uppercase tracking-wider border-b border-[var(--color-primary)]/30 pb-2 mb-2 md:mb-3 flex items-center gap-3">
                    <History size={16} className="text-[var(--color-primary2)]" /> Biography
                  </h3>
                  <p className="text-white/70 leading-relaxed font-medium text-[11px] md:text-xs lg:text-sm">
                    {selectedInstructor.bio}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                  <div>
                    <h3 className="text-[var(--color-primary)] text-sm md:text-base font-black uppercase tracking-wider border-b border-[var(--color-primary)]/30 pb-2 mb-2 md:mb-3 flex items-center gap-3">
                      <Users size={16} className="text-[var(--color-primary2)]" /> Expertise
                    </h3>
                    <ul className="space-y-1.5 md:space-y-2">
                      {selectedInstructor.disciplines.map((d, i) => (
                        <li key={i} className="flex items-center gap-3 text-white/80 font-medium text-[11px] md:text-xs">
                          <div className="w-1.5 h-1.5 bg-[var(--color-primary2)] rounded-full shrink-0"></div> {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[var(--color-primary)] text-sm md:text-base font-black uppercase tracking-wider border-b border-[var(--color-primary)]/30 pb-2 mb-2 md:mb-3 flex items-center gap-3">
                      <Award size={16} className="text-[var(--color-primary2)]" /> Achievements
                    </h3>
                    <ul className="space-y-1.5 md:space-y-2">
                      {selectedInstructor.achievements.map((a, i) => (
                        <li key={i} className="flex items-center gap-3 text-white/80 font-medium text-[11px] md:text-xs">
                          <div className="w-1.5 h-1.5 bg-[var(--color-primary2)] rounded-full shrink-0"></div> {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl md:rounded-2xl border border-white/10 mb-4 md:mb-6 relative overflow-hidden">
                  <div className="text-[var(--color-primary2)] text-4xl absolute top-0 left-2 opacity-20 font-serif leading-none">"</div>
                  <p className="text-white/90 italic font-medium text-center text-[11px] md:text-xs relative z-10 pt-1">
                    {selectedInstructor.philosophy}
                  </p>
                </div>

                <button className="w-full py-3 bg-[var(--color-primary2)] hover:bg-[#b5952f] text-white font-black uppercase tracking-widest text-xs md:text-sm rounded-xl transition-colors shadow-[0_10px_20px_rgba(212,175,55,0.3)] mt-auto shrink-0">
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
