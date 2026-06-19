import React from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, ChevronRight } from 'lucide-react'
import { getImageUrl } from '../../../utils/imageUtils'

const PublicEventCard = ({ event, idx, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: idx * 0.05 }}
      onClick={() => onClick(event.id)}
      className="group relative bg-black rounded-[20px] overflow-hidden border border-white/5 h-[340px] lg:h-[400px] cursor-pointer shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)] w-full"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.2] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply z-10 pointer-events-none"></div>

      <div className="absolute inset-0 w-full h-full">
        {getImageUrl(event.image) ? (
          <img
            src={getImageUrl(event.image)}
            alt={event.name}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <ImageIcon size={48} className="text-gray-600" />
          </div>
        )}
      </div>

      <div className="absolute inset-0 p-5 z-30 flex flex-col justify-end pointer-events-none">
        <div className="flex justify-between items-end">
          {/* Bottom Left Text */}
          <div className="flex flex-col gap-1 pr-2">
            <div className="inline-block px-2 py-0.5 bg-[var(--color-primary2)] w-fit text-white font-black text-[9px] tracking-widest uppercase rounded shadow-lg mb-1">
              {event.date}
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-tight mb-1 line-clamp-2">
              {event.name}
            </h2>
          </div>

          {/* Bottom Right View Button */}
          <div className="shrink-0 px-4 py-2 bg-[var(--color-primary)] text-[#0b1b24] font-black text-[10px] md:text-xs tracking-widest uppercase rounded-lg shadow-lg group-hover:bg-white transition-colors pointer-events-auto mb-1 flex items-center gap-1.5">
            View{' '}
            <ChevronRight
              size={14}
              className="transform group-hover:translate-x-1 transition-transform"
            />
          </div>
        </div>
      </div>

      {/* Giant Background Text */}
      <h2 className="absolute -right-4 top-1/4 text-[80px] font-black text-white/[0.03] uppercase tracking-tighter leading-none pointer-events-none z-0 rotate-90 origin-bottom-right">
        EVENT
      </h2>
    </motion.div>
  )
}

export default PublicEventCard
