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
    tag: "Access All Areas",
    title: "MEMBERSHIPS",
    bullets: [
      "Flexible monthly plans",
      "Unlimited facility access",
      "Open mat sessions included"
    ],
    image: membershipsImg, 
  },
  {
    id: 2,
    tag: "1-on-1 Coaching",
    title: "PERSONAL TRAINING",
    bullets: [
      "Elite instructor guidance",
      "Custom training regimen",
      "Accelerated goal tracking"
    ],
    image: personalTrainingImg,
  },
  {
    id: 3,
    tag: "Group Sessions",
    title: "CLASSES",
    bullets: [
      "Striking & Grappling",
      "High-intensity fitness",
      "All skill levels welcome"
    ],
    image: groupClassesImg,
  }
];

// ==========================================
// TRAINERS DATA
// ==========================================
export const trainersData = [
  {
    id: 1,
    subtitle: "CHIEF INSTRUCTOR / PRESIDENT",
    title: "HIMANSU",
    description: "A visionary leader with decades of combat experience, shaping the next generation of martial artists.",
    teach: "Karate, Kickboxing, Muay Thai",
    experience: "7th Dan Black Belt WUMF National Coach. Trained numerous national and international medallists.",
    image: generatedTrainerImg, 
  },
  {
    id: 2,
    subtitle: "SENIOR COACH",
    title: "SARAH",
    description: "Fierce competitor and dedicated mentor focusing on ground game and submission techniques.",
    teach: "MMA & BJJ",
    experience: "Black belt in BJJ, professional MMA fighter with over 15 years of coaching experience.",
    image: generatedTrainer2Img,
  },
  {
    id: 3,
    subtitle: "YOGA EXPERT",
    title: "PRIYA",
    description: "Combining ancient discipline with modern fitness to build unbreakable core strength and flexibility.",
    teach: "Yoga, Fitness & Defense",
    experience: "Specializes in flexibility, core strength, and women's self-defense programs with 10 years experience.",
    image: generatedTrainer3Img,
  }
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
