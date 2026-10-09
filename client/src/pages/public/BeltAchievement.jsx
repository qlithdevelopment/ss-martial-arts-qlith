import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ChevronDown } from "lucide-react";
import api from "../../api/axios";
import SectionHeader from "../../components/SectionHeader";

const BELTS = [
  { name: "white", label: "White", hex: "#fffffc", textDark: true },
  { name: "yellow", label: "Yellow", hex: "#eab308", textDark: true },
  { name: "orange", label: "Orange", hex: "#ea580c", textDark: false },
  { name: "green", label: "Green", hex: "#15803d", textDark: false },
  { name: "blue", label: "Blue", hex: "#1d4ed8", textDark: false },
  { name: "purple", label: "Purple", hex: "#7c3aed", textDark: false },
  { name: "red 1", label: "Red 1", hex: "#dc2626", textDark: false },
  { name: "red 2", label: "Red 2", hex: "#dc2626", textDark: false },
  { name: "brown 1", label: "Brown 1", hex: "#4a2e2a", textDark: false },
  { name: "brown 2", label: "Brown 2", hex: "#4a2e2a", textDark: false },
  { name: "brown 3", label: "Brown 3", hex: "#4a2e2a", textDark: false },
  { name: "black", label: "Black", hex: "#0a0a0a", textDark: false },
];

const normalizeBeltName = (beltPosition = "") => {
  return beltPosition
    .toLowerCase()
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");
};

const Hii = () => {
  const [belts, setBelts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openBelt, setOpenBelt] = useState(null);

  const fetchBelts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/belts");

      const data = response?.data?.data || [];

      setBelts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch belts:", error);
      setBelts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBelts();
  }, []);

  const getStudentsForBelt = (beltName) => {
    const normalizedBelt = normalizeBeltName(beltName);

    return belts.filter((record) => {
      const position = normalizeBeltName(record?.belt_position);

      if (!position) return false;

      return position === normalizedBelt || position.includes(normalizedBelt);
    });
  };

  const toggleBelt = (beltName) => {
    setOpenBelt((previous) => (previous === beltName ? null : beltName));
  };

  return (
    <div className="w-full min-h-screen bg-[#f9fafb] pt-24 pb-12 md:pt-24 md:pb-16 lg:pt-24 lg:pb-24 px-4 md:px-0 font-sans relative overflow-hidden">
      {/* Background Text */}
      <div className="fixed top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[16vw] font-black text-black/[0.04] uppercase tracking-tighter pointer-events-none whitespace-nowrap select-none">
        Belts
      </div>

      <div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-0">
              <SectionHeader
                label="Achievement"
                title="BELT"
                titleColor="text-black"
                highlight="Achievement"
              />
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div className="space-y-1">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-28 rounded-[28px] bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {BELTS.map((belt, index) => {
              const isOpen = openBelt === belt.name;

              const students = getStudentsForBelt(belt.name);

              return (
                <motion.div
                  key={belt.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.45,
                  }}
                  className="bg-white rounded-sm overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-500"
                >
                  {/* ================= BELT HEADER ================= */}

                  <button
                    type="button"
                    onClick={() => toggleBelt(belt.name)}
                    className="w-full text-left"
                  >
                    <div className="p-1 flex items-center gap-3">
                      {/* Belt */}
                      <div className="flex-1 min-w-0">
                        <div
                          className="relative h-9 md:h-11 rounded-lg overflow-hidden"
                          style={{
                            background: `linear-gradient(
                              180deg,
                              ${belt.hex} 0%,
                              ${belt.hex} 55%,
                              rgba(0,0,0,0.14) 180%
                            )`,
                            border:
                              belt.name === "white"
                                ? "1px solid #d9d9d6"
                                : "none",
                          }}
                        >
                          {/* Sheen */}
                          <div
                            className="absolute inset-0 pointer-events-none"
                            // style={{
                            //   background:
                            //     "linear-gradient(115deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 22%, rgba(255,255,255,0) 45%, rgba(0,0,0,0.06) 100%)",
                            // }}
                          />

                          {/* Left loop */}
                          <div
                            className="absolute top-0 bottom-0 left-[20%] w-[6px] rounded-md"
                            style={{
                              background:
                                "linear-gradient(90deg, rgba(255,255,255,0.55), rgba(255,255,255,0.15))",
                            }}
                          />

                          {/* Right loop */}
                          <div
                            className="absolute top-0 bottom-0 right-[20%] w-[6px] rounded-md"
                            style={{
                              background:
                                "linear-gradient(90deg, rgba(255,255,255,0.55), rgba(255,255,255,0.15))",
                            }}
                          />

                          <div
                            className="absolute inset-0 flex items-center justify-center uppercase font-black tracking-[0.15em] text-[10px] md:text-xs"
                            style={{
                              color: belt.textDark ? "#1a1a1a" : "#ffffff",
                              textShadow: belt.textDark
                                ? "none"
                                : "0 1px 2px rgba(0,0,0,0.25)",
                            }}
                          >
                            {belt.label}
                          </div>
                        </div>
                      </div>

                      {/* Student Count */}
                      <div className="sm:flex flex-col items-end shrink-0">
                        <span className="text-xl font-black text-gray-800">
                          {students.length}
                        </span>
                      </div>

                      {/* Arrow */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                          isOpen ? " rotate-180" : ""
                        }`}
                      >
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </button>

                  {/* ================= ACCORDION ================= */}

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          height: {
                            duration: 0.55,
                            ease: [0.4, 0, 0.2, 1],
                          },
                          opacity: {
                            duration: 0.3,
                          },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50 via-white to-orange-50/40 p-2 md:p-4">
                          {students.length === 0 ? (
                            /* No Students */
                            <div className="min-h-[300px] flex flex-col items-center justify-center text-center">
                              <div className="w-20 h-20 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-5">
                                <Award size={30} className="text-gray-300" />
                              </div>

                              <h3 className="text-xl font-black uppercase tracking-tight text-gray-800">
                                No Students
                              </h3>

                              <p className="text-gray-400 text-sm mt-2">
                                No student has achieved the {belt.label} belt
                                yet.
                              </p>
                            </div>
                          ) : (
                            /* Students */
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                              {students.map((record, studentIndex) => {
                                const student = record.user;

                                return (
                                  <motion.div
                                    key={record.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      delay: studentIndex * 0.05,
                                    }}
                                    className="min-w-0"
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="min-w-0">
                                        <p className="text-sm sm:text-[13px] font-black text-gray-900 truncate">
                                          {student?.name || "Student"}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hii;
