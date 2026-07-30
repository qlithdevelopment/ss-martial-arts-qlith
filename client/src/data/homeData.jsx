import React from 'react';

// Programs Images
import membershipsImg from "../assets/memberships.png";
import personalTrainingImg from "../assets/personal_training.png";
import groupClassesImg from "../assets/group_classes.png";

// Trainer Images
import generatedTrainerImg from "../assets/master_kick_bgrm.png";
import generatedTrainer2Img from "../assets/generated_trainer2.png";
import generatedTrainer3Img from "../assets/yoga_master_bgrm.png";

// ==========================================
// PROGRAMS DATA
// ==========================================
export const programsData = [
  {
    id: 1,
    tag: "karate classes near me",
    title: "Karate",
    shortDescription: "Traditional striking and belt-ranked progression for all ages.",
    description: "sjfhhhhggooierijttututisjfhhhhggooierijttututisjfhhhhggooierijttututi",
    bullets: [
      "Structured Karate training for kids and adults",
      "focusing on discipline, technique, and belt",
      "progression — ideal for anyone searching for"
    ],
    faqs: [
      {
        question: "What age can my child start Karate?",
        answer: "Most academies welcome kids from age 4-5 onward, with classes grouped by age and skill level so training stays age-appropriate and safe."
      },
      {
        question: "How long does it take to earn a black belt?",
        answer: "With consistent training, most students reach black belt in about 3-5 years, depending on practice frequency and how quickly they master each belt's requirements."
      },
      {
        question: "Do I need any prior experience to join?",
        answer: "No prior experience is required — beginners start with fundamentals like stances, blocks, and basic strikes before progressing to more advanced techniques."
      }
    ],
    image: membershipsImg,
  },
  {
    id: 2,
    tag: "taekwondo classes near me",
    title: "Taekwondo",
    shortDescription: "High-kick, high-energy training built for speed and flexibility.",
    description: "sjfhhhhggooierijttututi",
    bullets: [
      "Dynamic, kick-focused Taekwondo classes that",
      "build flexibility, speed, and confidence — a top",
      "choice for taekwondo classes near me searches"
    ],
    faqs: [
      {
        question: "Is Taekwondo good for improving flexibility?",
        answer: "Yes, the emphasis on high kicks and dynamic footwork makes Taekwondo one of the best martial arts for building flexibility and leg strength over time."
      },
      {
        question: "What equipment do I need to get started?",
        answer: "A uniform (dobok) and basic sparring gear like shin guards, gloves, and a mouthguard are usually all you need — most academies can help you get set up."
      },
      {
        question: "Are there competitive opportunities available?",
        answer: "Yes, students who want to compete can take part in regional and national tournaments once they reach an appropriate skill and belt level."
      }
    ],
    image: personalTrainingImg,
  },
  {
    id: 3,
    tag: "",
    title: "Boxing",
    shortDescription: "Footwork, power, and conditioning in every round.",
    description: "sjfhhhhggooierijttututi",
    bullets: [
      "High-energy boxing training covering footwork",
      "striking technique, and conditioning for fitness",
      "competition alike"
    ],
    faqs: [
      {
        question: "Is boxing training suitable for pure fitness, not competition?",
        answer: "Absolutely — many students join purely for the cardio and conditioning benefits, with no requirement to ever step into a competitive ring."
      },
      {
        question: "Will I have to spar with other students?",
        answer: "Sparring is optional and only introduced once you've built solid technique and confidence; many students train for years without ever sparring."
      },
      {
        question: "How many times a week should I train for results?",
        answer: "Training 2-3 times a week is enough to see noticeable improvements in fitness, technique, and confidence within a few months."
      }
    ],
    image: groupClassesImg,
  },
  {
    id: 4,
    tag: "Group Sessions",
    title: "Kickboxing",
    shortDescription: "Full-body striking and cardio with real self-defense value.",
    description: "sjfhhhhggooierijttututi",
    bullets: [
      "A powerful blend of striking and cardio",
      "conditioning, perfect for those wanting a full-body",
      "workout with real self-defense value"
    ],
    faqs: [
      {
        question: "Is Kickboxing more about fitness or self-defense?",
        answer: "It's both — classes are structured to deliver a serious cardio workout while also teaching practical striking combinations you can use for self-defense."
      },
      {
        question: "Do group sessions suit beginners?",
        answer: "Yes, group sessions are paced to include all levels, with instructors offering modifications for beginners and progressions for more experienced students."
      },
      {
        question: "What should I wear to my first class?",
        answer: "Comfortable athletic wear and training shoes are fine to start — gloves and wraps can be added once you decide to continue."
      }
    ],
    image: groupClassesImg,
  },
  {
    id: 5,
    tag: "mma classes near me",
    title: "MMA (Mixed Martial Arts)",
    shortDescription: "Striking and grappling combined into one well-rounded system.",
    description: "sjfhhhhggooierijttututi",
    bullets: [
      "Comprehensive training that blends striking",
      "and grappling — for students who search for",
      "mma classes near me and want well-rounded combat skills"
    ],
    faqs: [
      {
        question: "Do I need to know striking and grappling before joining MMA?",
        answer: "No prior experience is needed — MMA classes are built to introduce both striking and grappling fundamentals from the ground up."
      },
      {
        question: "How is MMA different from training just Boxing or BJJ alone?",
        answer: "MMA combines multiple disciplines into one curriculum, so you learn how strikes, clinches, and ground grappling connect in a real fight scenario."
      },
      {
        question: "Is MMA safe for beginners?",
        answer: "Yes, contact is introduced gradually with proper coaching and protective gear, so beginners build skills safely before any live sparring or grappling."
      }
    ],
    image: groupClassesImg,
  },
  {
    id: 6,
    tag: "",
    title: "Self-Defense",
    shortDescription: "Practical, everyday safety skills for every age group.",
    description: "sjfhhhhggooierijttututi",
    bullets: [
      "Practical, real-world self-defense classes for all ages",
      "designed for everyday safety and personal confidence.",
      ""
    ],
    faqs: [
      {
        question: "Is this class suitable for someone with no martial arts background?",
        answer: "Yes, self-defense classes are specifically designed for beginners and focus on practical, easy-to-learn techniques rather than complex martial arts forms."
      },
      {
        question: "What situations does the training cover?",
        answer: "Classes typically cover awareness, de-escalation, escaping common grabs and holds, and basic strikes for close-range protection."
      },
      {
        question: "Can this class help build confidence, not just physical skills?",
        answer: "Yes, alongside physical technique, students build situational awareness and confidence that carries over into everyday life."
      }
    ],
    image: groupClassesImg,
  },
  {
    id: 7,
    tag: "judo classes near me",
    title: "Judo / Wushu",
    shortDescription: "Throws, forms, and full-body coordination in one program.",
    description: "sjfhhhhggooierijttututi",
    bullets: [
      "Throw-based Judo and striking-and-forms Wushu",
      "training for balance, control, and full-body",
      "coordination"
    ],
    faqs: [
      {
        question: "What's the difference between Judo and Wushu training?",
        answer: "Judo focuses on throws, grips, and ground control, while Wushu emphasizes striking forms and acrobatic movement — classes may cover one or both depending on the program."
      },
      {
        question: "Is Judo good for improving balance and coordination?",
        answer: "Yes, the throw-based nature of Judo trains balance, timing, and body awareness in a way few other martial arts can match."
      },
      {
        question: "Do I need to be flexible to start Wushu?",
        answer: "No, flexibility develops through consistent training — beginners start with basic stances and forms and build flexibility over time."
      }
    ],
    image: groupClassesImg,
  },
  {
    id: 8,
    tag: "shaolin kung-fu classes near me",
    title: "Shaolin Kung-fu",
    shortDescription: "Traditional forms and conditioning rooted in centuries-old technique.",
    description: "sjfhhhhggooierijttututi",
    bullets: [
      "Traditional Shaolin Kung-fu forms and conditioning",
      "for discipline, agility, and strength — rooted in",
      "centuries-old technique"
    ],
    faqs: [
      {
        question: "Is Shaolin Kung-fu suitable for adults starting later in life?",
        answer: "Yes, training is adapted to the student's fitness level, so adults of any age can start and progress safely at their own pace."
      },
      {
        question: "What does a typical class involve?",
        answer: "Classes typically include conditioning drills, traditional forms (taolu), stance training, and technique practice rooted in classical Shaolin methods."
      },
      {
        question: "How long before I learn a full form?",
        answer: "Beginners usually learn their first basic form within a few months, with more advanced forms introduced as strength and technique improve."
      }
    ],
    image: groupClassesImg,
  },
  {
    id: 9,
    tag: "pencak silat classes near me",
    title: "Pencak Silat",
    shortDescription: "Strikes, joint locks, and weapon awareness for practical defense.",
    description: "sjfhhhhggooierijttututi",
    bullets: [
      "Indonesian martial art blending strikes, joint",
      "locks, and weapon awareness for practical",
      "self-defense"
    ],
    faqs: [
      {
        question: "What makes Pencak Silat different from other martial arts?",
        answer: "Pencak Silat blends striking, joint locks, and weapon awareness into a single practical system, making it especially useful for real-world self-defense."
      },
      {
        question: "Will I train with weapons as a beginner?",
        answer: "Weapon awareness is introduced gradually — beginners first build a foundation in empty-hand technique before moving into traditional weapons training."
      },
      {
        question: "Is Pencak Silat physically demanding?",
        answer: "It builds strength and flexibility over time, but training is scaled to the student's fitness level, so beginners aren't overwhelmed early on."
      }
    ],
    image: groupClassesImg,
  },
  {
    id: 10,
    tag: "gymnastics classes near me",
    title: "Gymnastics (Only Flips)",
    shortDescription: "Flip-focused training for air awareness and explosive power.",
    description: "sjfhhhhggooierijttututi",
    bullets: [
      "Flip-focused gymnastics training to build",
      "body control, air awareness, and explosive",
      "power for tricking and martial arts alike"
    ],
    faqs: [
      {
        question: "Do I need prior gymnastics experience to join?",
        answer: "No, classes start with fundamentals like body control and basic tumbling before progressing to flips, so complete beginners are welcome."
      },
      {
        question: "How does this class benefit martial arts training?",
        answer: "Flip and tumbling training builds air awareness, explosive power, and body control that directly carry over into kicks, throws, and overall athleticism."
      },
      {
        question: "Is this class safe for kids?",
        answer: "Yes, training is progressive and supervised, with proper spotting and matting to ensure flips are learned safely at each skill stage."
      }
    ],
    image: groupClassesImg,
  },
  {
    id: 11,
    tag: "weapons training near me",
    title: "Weapons,Muay Thai",
    shortDescription: "Precision handling and forms beyond empty-hand technique.",
    description: "sjfhhhhggooierijttututi",
    bullets: [
      "Traditional weapons training covering handling,",
      "forms, and control — building precision and",
      "discipline beyond empty-hand techniques"
    ],
    faqs: [
      {
        question: "What weapons are typically covered in training?",
        answer: "Programs commonly include traditional weapons such as staffs, swords, and nunchaku, with specific weapons depending on the academy's curriculum."
      },
      {
        question: "Do I need an empty-hand martial arts background first?",
        answer: "It's helpful but not required — many academies introduce basic weapon handling alongside foundational stances for complete beginners."
      },
      {
        question: "Is weapons training safe for beginners?",
        answer: "Yes, training starts with controlled, low-risk drills to build proper handling and discipline before progressing to faster or more complex forms."
      }
    ],
    image: groupClassesImg,
  },
];


// ==========================================
// SERVICES DATA
// ==========================================
export const servicesCategories = ["ALL", "BODY CONDITIONING", "COMBAT SPORTS", "WEAPONS TRAINING"];

export const allServices = [
  {
    id: 1,
    category: "COMBAT SPORTS",
    title: "Mixed Martial Arts",
    subtitle: "Learn striking and grappling",
    image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80",
    badge: "COMBAT SPORTS"
  },
  {
    id: 2,
    category: "COMBAT SPORTS",
    title: "Muay Thai & Boxing",
    subtitle: "The art of eight limbs",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80",
    badge: "COMBAT SPORTS"
  },
  {
    id: 3,
    category: "BODY CONDITIONING",
    title: "Strength & Agility",
    subtitle: "Build explosive power",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    badge: "BODY CONDITIONING"
  },
  {
    id: 4,
    category: "WEAPONS TRAINING",
    title: "Traditional Kobudo",
    subtitle: "Master ancient weaponry",
    image: "https://images.unsplash.com/photo-1552872673-9b7b99711ebb?w=800&q=80",
    badge: "WEAPONS TRAINING"
  },
  {
    id: 5,
    category: "COMBAT SPORTS",
    title: "Brazilian Jiu-Jitsu",
    subtitle: "Ground fighting mastery",
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80",
    badge: "COMBAT SPORTS"
  }
];

// ==========================================
// EVENTS DATA
// ==========================================
export const featuredEvents = [
  {
    id: 1,
    date: "15 August • 09:00 AM",
    title: "National Martial Arts Championship"
  },
  {
    id: 2,
    date: "28 September • 10:00 AM",
    title: "Youth Sports Camp - 20yo"
  },
  {
    id: 3,
    date: "10 November • 04:00 PM",
    title: "Obstacle Course Race"
  },
  {
    id: 4,
    date: "05 December • 08:00 AM",
    title: "Sport x Game Day"
  }
];

export const eventsList = [
  {
    id: 1,
    title: "Women's Self Defense Seminar",
    desc: "Join our dedicated seminar focusing on practical defense techniques. Free entry and tailored for beginners.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  },
  {
    id: 2,
    title: "Belt Grading & Ceremony",
    desc: "Testing ceremony for all belts. Bring your family and celebrate your progression to the next level of mastery.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="8" r="5" />
        <path d="M3 21v-2a7 7 0 0 1 14 0v2" />
      </svg>
    )
  },
  {
    id: 3,
    title: "Sport x Game Day",
    desc: "Friendly matches, sparring, and refreshments. A great opportunity to network and meet other martial artists.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    )
  }
];

// ==========================================
// GALLERY DATA
// ==========================================
import gallery1 from "../assets/event_seminar.png";
import gallery2 from "../assets/event_tournament.png";
import gallery3 from "../assets/master_kick.png";
import gallery4 from "../assets/female_mma.png";
import gallery5 from "../assets/masters_group.png";

export const galleryImages = [
  { src: gallery1, spanClasses: "md:col-span-2 md:row-span-1" },
  { src: gallery2, spanClasses: "md:col-span-1 md:row-span-2" },
  { src: gallery3, spanClasses: "md:col-span-1 md:row-span-2" },
  { src: gallery4, spanClasses: "md:col-span-1 md:row-span-1" },
  { src: gallery5, spanClasses: "md:col-span-1 md:row-span-1" },
];

// ==========================================
// TESTIMONIALS DATA
// ==========================================
export const testimonialsData = [
  {
    id: 1,
    type: "quote-box",
    text: "\"The discipline I've learned here carries over into my professional life. It's more than just physical training.\"",
    name: "Michael Chen",
    role: "Executive",
    image: "https://randomuser.me/api/portraits/men/86.jpg",
  },
  {
    id: 2,
    type: "square-text",
    text: "\"An incredible environment for kids to learn respect, discipline, and physical fitness. My children look forward to every single class with excitement.\"",
    name: "Emily R.",
    role: "Parent",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 3,
    type: "bubble-down-avatars",
    title: "I was very impressed!",
    text: "The community and the instructors are absolutely world-class.",
    avatars: [
      "https://randomuser.me/api/portraits/men/32.jpg",
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://randomuser.me/api/portraits/women/65.jpg"
    ]
  },
  {
    id: 4,
    type: "tall-card",
    title: "I really appreciate it!",
    text: "Joining this academy completely transformed my approach to fitness and self-defense. Absolutely stellar experience.",
    image: "https://randomuser.me/api/portraits/women/90.jpg",
    stars: 5,
  },
  {
    id: 5,
    type: "large-image",
    text: "A year from now, will I feel like I've learned enough? Absolutely. The coaching is unmatched.",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 6,
    type: "bubble-down-small",
    text: "\"Believe in yourself and the incredible coaches here will take care of the rest!\"",
    image: "https://randomuser.me/api/portraits/women/24.jpg",
    stars: 4,
  },
  {
    id: 7,
    type: "wide-top",
    name: "Sarah Jenkins",
    text: "Empowered and confident. The best decision I've ever made for my personal fitness journey.",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    stars: 5,
  },
  {
    id: 8,
    type: "wide-middle",
    text: "\"From chaos to strategic consistency. A true martial arts school.\"",
    image: "https://randomuser.me/api/portraits/men/62.jpg",
  },
  {
    id: 9,
    type: "wide-bottom",
    text: "Every detail is meticulously planned. Never thought I'd find such a professional gym setup.",
    name: "David G.",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
  }
];

// ==========================================
// PARTNERS LOGOS
// ==========================================
import Logo from '../assets/Logo_compress.png';

export const row1Logos = [
  Logo,
  "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
  "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/e/ea/Puma_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/4/44/Under_armour_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/1/11/Reebok_2019_logo.svg",
];

export const row2Logos = [
  Logo,
  "https://upload.wikimedia.org/wikipedia/commons/b/b3/Gatorade_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/6/69/UFC_Logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
  "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/e/ea/Puma_logo.svg",
];
