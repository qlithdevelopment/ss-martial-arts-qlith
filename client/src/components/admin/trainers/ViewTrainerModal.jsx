import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit2, Zap, Award, Briefcase, Quote, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../api/axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");
 
const parseList = (val) => {
  if (!val) return [];
  return Array.isArray(val) ? val : JSON.parse(val || "[]");
};

const ViewTrainerModal = ({ isOpen, onClose, trainerId, onEdit }) => {
  const [trainer, setTrainer] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && trainerId) {
      fetchTrainer();
    }
    if (!isOpen) {
      setTrainer([]);
    }
  }, [isOpen, trainerId]);

  const fetchTrainer = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/trainers/${trainerId}`);
      setTrainer(res?.data?.data || res?.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load trainer details");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-xl z-50 overflow-hidden"
          >
            {loading || !trainer ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-orange-100 flex items-center justify-center text-[#f97316] font-bold overflow-hidden">
                      {trainer.image_path ? (
                        <img
                          src={`${BASE_URL}${trainer.image_path}`}
                          alt={trainer.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/default-trainer.png";
                          }}
                        />
                      ) : (
                        <UserIcon size={18} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight truncate">
                        {trainer.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium truncate">
                        {trainer.designation || "Instructor"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="shrink-0 text-gray-400 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 p-2 rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[65vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50">
                      <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Zap size={12} /> Expertise
                      </p>
                      <p className="text-sm font-semibold text-indigo-900">
                        {parseList(trainer.expertise).length > 0
                          ? parseList(trainer.expertise).join(", ")
                          : "Not specified"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Award size={12} /> Achievements
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {parseList(trainer.achievements).length > 0
                          ? parseList(trainer.achievements).join(", ")
                          : "None listed"}
                      </p>
                    </div>
                  </div>

                  {trainer.motivation_line && (
                    <div className="mb-6">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Quote size={12} /> Motivation Line
                      </p>
                      <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-4">
                        <p className="text-sm text-orange-800 italic leading-relaxed">
                          "{trainer.motivation_line}"
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Briefcase size={12} /> Biography
                    </p>
                    <div className="bg-gray-50 p-4 scrollbar-thin rounded-2xl border border-gray-100 max-h-40 overflow-y-auto">
                      <p className="text-sm   text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {trainer.biography || "No biography provided."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm shadow-sm"
                  >
                    Close
                  </button>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(trainer)}
                      className="px-5 py-2.5 bg-[#f97316] text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm flex items-center gap-2"
                    >
                      <Edit2 size={16} /> Edit Trainer
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ViewTrainerModal;