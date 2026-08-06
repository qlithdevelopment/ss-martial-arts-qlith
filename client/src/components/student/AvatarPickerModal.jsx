import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import avatar1 from '../../assets/avatars/avatar1.png';
import avatar2 from '../../assets/avatars/avatar2.png';
import avatar3 from '../../assets/avatars/avatar3.png';
import avatar4 from '../../assets/avatars/avatar4.png';
import avatar5 from '../../assets/avatars/avatar5.png';
import avatar6 from '../../assets/avatars/avatar6.png';
import avatar7 from '../../assets/avatars/avatar7.png';
import avatar8 from '../../assets/avatars/avatar8.png';
import avatar9 from '../../assets/avatars/avatar9.png';
import avatar10 from '../../assets/avatars/avatar10.png';
import avatar11 from '../../assets/avatars/avatar11.png';
import avatar12 from '../../assets/avatars/avatar12.png';


export const AVATAR_OPTIONS = [
  { name: 'karate1', url:avatar1},
  { name: 'karate2', url: avatar2 },
  { name: 'karate3', url: avatar3},
  { name: 'karate4', url: avatar4 },
  { name: 'karate5', url: avatar5 },
  { name: 'karate6', url: avatar6 },
  { name: 'karate7', url: avatar7 },
  { name: 'karate8', url: avatar8 },
  { name: 'karate9', url: avatar9 },
  { name: 'karate10', url: avatar10 },
  { name: 'karate11', url: avatar11 },
  { name: 'karate12', url: avatar12 },
];


export const getAvatarUrlByName = (name) => {
  const match = AVATAR_OPTIONS.find((avatar) => avatar.name === name);
  return match ? match.url : null;
};


const AvatarPickerModal = ({ isOpen, onClose, currentAvatar, onSelect }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-50 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-slate-100">Choose Avatar</h3>
                <p className="text-xs text-gray-400 font-medium">Pick an image for your profile</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Avatar grid */}
            <div className="px-6 py-5 grid grid-cols-4 gap-3 max-h-[360px] overflow-y-auto">
              {AVATAR_OPTIONS.map(({ name, url }) => {
                const isSelected = name === currentAvatar;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => onSelect(name)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                      isSelected
                        ? 'border-[#f97316] ring-2 ring-[#f97316]/30 scale-95'
                        : 'border-gray-100 dark:border-slate-800 hover:border-[#f97316]/50 hover:scale-105'
                    }`}
                  >
                    <img src={url} alt={name} className="w-full h-full object-cover bg-gray-50" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#f97316]/20 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-[#f97316] flex items-center justify-center shadow-md">
                          <Check size={14} className="text-white" strokeWidth={3} />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AvatarPickerModal;