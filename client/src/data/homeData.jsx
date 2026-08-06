import React from 'react';

import karateimg from "../assets/programs/Karate.png"
import taekwondoimg from "../assets/programs/Taekwondo.png"
import boxingimg from "../assets/programs/Boxing.png"
import kikboxingimg from "../assets/programs/Kickboxing.png"
import mmaimg from "../assets/programs/mma.jpg"
import self_defenseimg from "../assets/programs/Self-Defense.png"
import judoimg from "../assets/programs/Judo_Wushu.png"
import shaolin_kungfuimg from "../assets/programs/ShaolinKung-fu.png"
import pencak_silatimg from "../assets/programs/pencak_silat.jpg"
import gymnasticsimg from "../assets/programs/Gymnastics.png"
import weapons_muay_thaiimg from "../assets/programs/WeaponsMuayThai.png"

// ==========================================
// PROGRAMS DATA
// ==========================================
export const programsData = [
  {
    id: 1,
    tag: "karate classes near me",
    title: "Karate",
    shortDescription: "Traditional Karate classes near me for kids and adults — build discipline, technique, and confidence through structured belt-ranked training.",
    description: "Our Karate program blends traditional striking technique with a proven belt-ranked progression system, making it one of the top karate classes near me for families and adults alike. Students develop sharp technique, discipline, and self-confidence through structured drills, kata, and sparring in a safe, supportive dojo environment. Whether you're a complete beginner or returning to the mats, our certified instructors tailor every class to your skill level. Enroll today and start your journey toward a black belt.",
    bullets: [
      "Beginner-friendly Karate training for kids and adults",
      "Belt-ranked progression system with certified instructors",
      "Builds discipline, focus, and self-defense confidence"
    ],
    faqs: [
      {
        question: "Is karate good for self-defense?",
        answer: "Yes. Karate builds strong striking fundamentals — punches, kicks, and blocks — along with the timing and reflexes needed to react under pressure, which is why many schools frame it as a practical self-defense system rather than only a sport."
      },
      {
        question: "What age can a child start karate?",
        answer: "Most academies accept children from around 4–6 years old, with classes structured by age group so younger kids focus on coordination, discipline, and basic movement before progressing to technical striking."
      },
      {
        question: "Do I need to be fit before joining karate classes?",
        answer: "No. Karate is designed to build fitness rather than require it — beginners train at their own pace, and strength, flexibility, and stamina develop naturally over weeks of regular practice."
      }
    ],
    image: karateimg,
  },
  {
    id: 2,
    tag: "taekwondo classes near me",
    title: "Taekwondo",
    shortDescription: "High-energy Taekwondo classes near me focused on powerful kicks, speed, and flexibility for all ages and skill levels.",
    description: "Searching for taekwondo classes near me? Our program delivers dynamic, kick-focused training designed to build explosive speed, flexibility, and full-body coordination. Students progress through a structured curriculum covering forms (poomsae), sparring, and board-breaking, all while developing the discipline and confidence Taekwondo is known for. Classes are suited to beginners and competitive athletes alike, with pathways to regional and national tournaments for those who want to test their skills. Join a welcoming dojang and start kicking toward your goals today.",
    bullets: [
      "Kick-focused Taekwondo training for speed and flexibility",
      "Structured forms, sparring, and board-breaking curriculum",
      "Competitive tournament pathway for advancing students"
    ],
    faqs: [
      {
        question: "What is taekwondo good for?",
        answer: "Taekwondo builds fitness, flexibility, discipline, and self-defense skills, and is especially known for its fast, high kicks alongside hand strikes and blocks."
      },
      {
        question: "Is taekwondo suitable for adults with no experience?",
        answer: "Yes. Adults of any age can start taekwondo — training scales to fitness level, and many adults join specifically to improve fitness, learn self-defense, or build confidence."
      },
      {
        question: "How often should a beginner attend taekwondo classes?",
        answer: "Two to three sessions a week is generally recommended for steady progress, giving the body enough recovery time between classes while keeping skills fresh."
      }
    ],
    image: taekwondoimg,
  },
  {
    id: 3,
    tag: "boxing classes near me",
    title: "Boxing",
    shortDescription: "High-intensity boxing classes near me covering footwork, striking technique, and conditioning for fitness or competition.",
    description: "Our boxing program is built for anyone searching for boxing classes near me who wants real results — whether that's weight loss, stress relief, or competitive skill. Training covers fundamental footwork, punch technique, defensive movement, and pad work, all wrapped into high-intensity conditioning that torches calories while sharpening reflexes. Sparring is optional and only introduced once technique and confidence are solid, so total beginners are always welcome. Coaches design each session to push you at your own pace, whether your goal is fitness or the ring.",
    bullets: [
      "Fundamental boxing footwork, punches, and defense",
      "High-intensity conditioning for fat loss and fitness",
      "Optional sparring path for competitive boxers"
    ],
    faqs: [
      {
        question: "Do I need boxing experience to join a beginner class?",
        answer: "No experience is required — beginner boxing classes are built around teaching stance, footwork, and basic punches from scratch, with coaches adjusting pace for newcomers."
      },
      {
        question: "Will I have to spar on my first day of boxing?",
        answer: "No. Sparring is reserved for more experienced students; first-time boxers focus on technique, bag work, and conditioning drills instead."
      },
      {
        question: "Is boxing a good workout for weight loss and fitness?",
        answer: "Yes. Boxing combines aerobic and anaerobic training that works the core, legs, and arms, making it an effective full-body workout even without ever competing."
      }
    ],
    image: boxingimg,
  },
  {
    id: 4,
    tag: "kickboxing classes near me",
    title: "Kickboxing",
    shortDescription: "Full-body Kickboxing classes near me combining striking and cardio conditioning for fitness and practical self-defense.",
    description: "Looking for kickboxing classes near me that deliver both a serious workout and real self-defense skill? Our program blends punches, kicks, and combination striking with high-energy cardio conditioning to torch calories while sharpening reflexes and coordination. Group sessions are paced for every level, with instructors offering modifications for beginners and progressions for advanced students. You'll build strength, stamina, and confidence in every class, all while learning practical striking combinations you can rely on. No experience needed — just bring comfortable athletic wear and a willingness to work hard.",
    bullets: [
      "Punch-and-kick combinations for full-body conditioning",
      "Group classes paced for beginners through advanced levels",
      "Practical self-defense striking skills in every session"
    ],
    faqs: [
      {
        question: "Do I need to be in shape to start kickboxing?",
        answer: "No — this is one of the most common misconceptions. Kickboxing classes are designed to build fitness progressively, so beginners of any fitness level can start and improve over time."
      },
      {
        question: "What is a typical kickboxing class like?",
        answer: "Classes usually combine a warm-up, technique drills for punches and kicks, pad or bag work, and conditioning exercises, with most beginner classes being non-contact or lightly controlled."
      },
      {
        question: "How many calories does a kickboxing class burn?",
        answer: "A single high-intensity kickboxing session can burn roughly 700–1,000 calories, depending on intensity and the individual, making it a popular choice for fitness-focused students."
      }
    ],
    image: kikboxingimg,
  },
  {
    id: 5,
    tag: "mma classes near me",
    title: "MMA (Mixed Martial Arts)",
    shortDescription: "Well-rounded MMA classes near me blending striking and grappling for complete beginners and experienced fighters alike.",
    description: "Our MMA program is one of the most complete mma classes near me offers — combining striking, clinch work, and ground grappling into a single, structured curriculum. Students build a well-rounded skill set by training boxing and kickboxing fundamentals alongside wrestling and jiu-jitsu-based grappling, learning how each discipline connects in a real fight scenario. Contact is introduced gradually with proper coaching and protective gear, so beginners develop technique safely before any live sparring. Whether your goal is fitness, self-defense, or competition, our coaches build a training plan around you.",
    bullets: [
      "Combined striking and grappling curriculum for all levels",
      "Gradual, safety-first introduction to live contact training",
      "Builds well-rounded, real-world fighting fundamentals"
    ],
    faqs: [
      {
        question: "What disciplines does MMA training combine?",
        answer: "MMA blends striking arts like boxing, kickboxing, and Muay Thai with grappling arts like wrestling and Brazilian Jiu-Jitsu, giving students a well-rounded skill set for both standing and ground situations."
      },
      {
        question: "Is MMA safe for beginners?",
        answer: "Yes, when taught properly — beginner MMA classes emphasize technique, safety protocols, and controlled drilling rather than full-contact sparring, which is introduced gradually as skill develops."
      },
      {
        question: "Will I have to spar as a beginner in MMA?",
        answer: "Not right away. New students typically spend their first weeks or months on technique and controlled drilling before any sparring is introduced, and even then it's supervised and paced to skill level."
      }
    ],
    image: mmaimg,
  },
  {
    id: 6,
    tag: "self-defense classes near me",
    title: "Self-Defense",
    shortDescription: "Practical self-defense classes near me teaching real-world safety skills and confidence for every age group.",
    description: "Our self-defense classes are designed for anyone searching for self-defense classes near me who wants practical, easy-to-learn protection skills — no martial arts background required. Training covers situational awareness, verbal de-escalation, escaping common grabs and holds, and simple, effective strikes for close-range safety. Sessions are welcoming to all ages and fitness levels, with instructors focused on building real confidence alongside physical technique. You'll leave every class better prepared to recognize risk and respond calmly under pressure. Start building everyday safety skills that last a lifetime.",
    bullets: [
      "Real-world techniques for escapes, grabs, and holds",
      "Situational awareness and de-escalation training",
      "Beginner-friendly classes for all ages and fitness levels"
    ],
    faqs: [
      {
        question: "Do I need to be fit or experienced to take a self-defense class?",
        answer: "No. Self-defense training is designed to meet students where they are — no prior fitness or martial arts background is needed to start learning practical protection skills."
      },
      {
        question: "Is self-defense training different from learning a traditional martial art?",
        answer: "Yes. While martial arts take years to master, dedicated self-defense classes focus on a smaller set of practical techniques — awareness, escapes, and simple strikes — meant to be usable relatively quickly in real situations."
      },
      {
        question: "What will I actually learn in a self-defense class?",
        answer: "Typical classes cover situational awareness, verbal de-escalation, basic strikes and escapes from common grabs or holds, and simple strategies for creating distance and getting to safety."
      }
    ],
    image: self_defenseimg,
  },
  {
    id: 7,
    tag: "judo classes near me",
    title: "Judo / Wushu",
    shortDescription: "Judo classes near me combining throw-based grappling and Wushu forms for balance, control, and full-body coordination.",
    description: "Our combined Judo and Wushu program is a standout choice among judo classes near me for students who want variety alongside serious skill development. Judo training focuses on throws, grips, and ground control, sharpening balance, timing, and body awareness in ways few other martial arts can match. Wushu complements this with striking forms and acrobatic movement, building flexibility and full-body coordination over time. Classes are structured for beginners of any fitness level, with stances and fundamentals taught before progressing to more advanced technique. Discover the discipline and control that make this dual program so effective.",
    bullets: [
      "Throw-based Judo training for balance and control",
      "Wushu forms and acrobatic movement for coordination",
      "Beginner-friendly progression at any fitness level"
    ],
    faqs: [
      {
        question: "Is judo effective for self-defense?",
        answer: "Yes. Judo focuses on using an opponent's weight, balance, and momentum against them through throws, pins, and control holds, making it a highly practical defensive style, especially against grabs and close-range attacks."
      },
      {
        question: "Is wushu good for fitness and flexibility?",
        answer: "Yes. Wushu training combines flexibility drills, acrobatic movement, strength conditioning, and form practice, making it excellent for building both athleticism and body control."
      },
      {
        question: "Do I need a martial arts background to start wushu?",
        answer: "No. Wushu schools accept complete beginners of any age and background, with initial classes focused on stances, basic kicks, and coordination."
      }
    ],
    image: judoimg,
  },
  {
    id: 8,
    tag: "shaolin kung-fu classes near me",
    title: "Shaolin Kung-fu",
    shortDescription: "Traditional Shaolin Kung-fu classes near me teaching centuries-old forms, conditioning, and discipline for all ages.",
    description: "For students seeking authentic shaolin kung-fu classes near me, our program delivers traditional forms (taolu), stance training, and rigorous conditioning rooted in centuries-old Shaolin technique. Every class builds discipline, agility, and strength through a curriculum adapted to each student's fitness level, so adults starting later in life train safely and progress at their own pace. Beginners typically learn their first basic form within a few months, with more advanced sequences introduced as strength and technique improve. Step onto the mats and connect with one of the world's oldest and most respected martial arts traditions.",
    bullets: [
      "Traditional Shaolin forms (taolu) and stance training",
      "Conditioning drills for discipline, agility, and strength",
      "Training adapted for all ages and fitness levels"
    ],
    faqs: [
      {
        question: "What is Shaolin Kung Fu known for?",
        answer: "Shaolin Kung Fu is one of the oldest recognized Chinese martial arts, rooted in Buddhist tradition, and is known for building physical strength, flexibility, mental discipline, and inner focus alongside its striking and stance work."
      },
      {
        question: "Do I need to be in shape to start Shaolin Kung Fu?",
        answer: "No. Beginners are taught foundational stances and movements first, with conditioning building naturally as training becomes part of a regular routine."
      },
      {
        question: "How long does it take to see results from Shaolin Kung Fu training?",
        answer: "Many schools report noticeable changes around the three-month mark, with more significant strength, flexibility, and skill improvements building by six months of consistent practice."
      }
    ],
    image: shaolin_kungfuimg,
  },
  {
    id: 9,
    tag: "pencak silat classes near me",
    title: "Pencak Silat",
    shortDescription: "Authentic Pencak Silat classes near me combining strikes, joint locks, and weapon awareness for practical self-defense.",
    description: "Our Pencak Silat program is a unique find among pencak silat classes near me, teaching this traditional Indonesian martial art's blend of strikes, joint locks, and weapon awareness for genuinely practical self-defense. Students first build a strong foundation in empty-hand technique, learning how strikes and locks flow together in real-world scenarios, before weapon awareness is introduced gradually. Training builds strength and flexibility over time, but every session is scaled to the student's fitness level so beginners are never overwhelmed. Discover a martial art that prizes practicality and efficiency above all else.",
    bullets: [
      "Strikes, joint locks, and weapon awareness training",
      "Empty-hand foundation before traditional weapons work",
      "Scaled to fitness level for safe, steady progression"
    ],
    faqs: [
      {
        question: "What is Pencak Silat?",
        answer: "Pencak Silat is a traditional martial art from the Indonesian and Malay archipelago that combines striking, grappling, throws, and weapon work into a complete self-defense and cultural discipline."
      },
      {
        question: "Does Pencak Silat include weapons training?",
        answer: "Yes. Many Pencak Silat styles incorporate traditional weapons alongside empty-hand techniques, reflecting its roots as a complete regional fighting system."
      },
      {
        question: "Is Pencak Silat suitable for beginners with no martial arts background?",
        answer: "Yes. Like most traditional martial arts, Pencak Silat starts new students on fundamentals — stances, basic strikes, and footwork — before progressing to more advanced combinations."
      }
    ],
    image: pencak_silatimg,
  },
  {
    id: 10,
    tag: "gymnastics classes near me",
    title: "Gymnastics (Only Flips)",
    shortDescription: "Flip-focused gymnastics classes near me building air awareness, body control, and explosive power for tricking and martial arts.",
    description: "If you're searching for gymnastics classes near me focused specifically on flips and tumbling, this program is built for exactly that. Students develop body control, air awareness, and explosive power through progressive tumbling drills, building toward standing and running flips in a safe, supervised environment. No prior gymnastics experience is required — training starts with fundamentals like body positioning and basic tumbling before advancing to aerial skills. Proper spotting and matting ensure flips are learned safely at every stage, making this a great fit for kids and teens alike. The skills built here carry directly into kicks, throws, and overall athleticism across other martial arts.",
    bullets: [
      "Progressive tumbling drills leading to flips and aerials",
      "Builds body control, air awareness, and explosive power",
      "Safe, supervised training with proper spotting and matting"
    ],
    faqs: [
      {
        question: "What age can a child start tumbling or flip training?",
        answer: "Many programs accept children as young as 4, starting with basic rolls, handstands, and cartwheels before progressing toward flips as strength and coordination develop."
      },
      {
        question: "Do you need to already be flexible or athletic to start tumbling?",
        answer: "No. Beginners start with fundamental movements like forward and backward rolls and bridges, and flexibility, strength, and coordination build up through consistent practice."
      },
      {
        question: "Is tumbling training safe for beginners?",
        answer: "Yes, when taught progressively with spotting and proper technique — coaches guide students through a structured skill sequence so flips are only attempted once the required strength and control are in place."
      }
    ],
    image: gymnasticsimg,
  },
  {
    id: 11,
    tag: "weapons training near me",
    title: "Weapons, Muay Thai",
    shortDescription: "Weapons training and Muay Thai classes near me covering precision handling, striking, and discipline beyond empty-hand technique.",
    description: "Combine two powerful disciplines in one program — traditional weapons training and Muay Thai striking — designed for students searching for weapons training near me who want to go beyond empty-hand technique. Weapons instruction covers handling, forms, and control using traditional tools like staffs, swords, and nunchaku, building precision and discipline through controlled, low-risk drills. Muay Thai striking adds powerful punches, kicks, elbows, and knees for a complete stand-up fighting skill set and serious conditioning benefit. No empty-hand martial arts background is required to start — beginners are introduced to basic handling and stances alongside foundational striking. Build discipline, power, and control in every session.",
    bullets: [
      "Traditional weapons handling: staffs, swords, and nunchaku",
      "Muay Thai striking with punches, kicks, elbows, and knees",
      "Controlled, low-risk drills built for beginners"
    ],
    faqs: [
      {
        question: "What weapons are commonly taught in martial arts weapons training?",
        answer: "Common training weapons include the bo staff, nunchaku, sai, and sword, with the specific weapons taught depending on the martial arts style and school tradition."
      },
      {
        question: "Do I need martial arts experience before starting weapons training?",
        answer: "Generally yes — most schools introduce weapons training after a student has built a foundation in empty-hand technique, since weapon work reinforces the same balance, timing, and control skills."
      },
      {
        question: "Do I need to be in shape to start Muay Thai?",
        answer: "No. Muay Thai classes are built to develop fitness through training — beginners are eased in with basic stance, footwork, and pad work, and conditioning builds naturally over the first few weeks."
      }
    ],
    image: weapons_muay_thaiimg,
  },
];