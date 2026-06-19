import React from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, ChevronRight } from 'lucide-react'
import { getImageUrl } from '../../../utils/imageUtils'

const PublicAlbumCard = ({ album, idx, onClick, parseImages }) => {
  return (
    <motion.div
      layoutId={`album-container-${album.id}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: idx * 0.03, duration: 0.2 }}
      onClick={() => onClick(album)}
      className={`relative rounded-[32px] overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-shadow bg-gray-100 flex items-center justify-center ${album.spanClass}`}
    >
      {parseImages(album.images).length > 0 ? (
        <motion.img
          layoutId={`album-cover-${album.id}`}
          src={getImageUrl(parseImages(album.images)[0])}
          alt={album.name}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <ImageIcon size={64} className="text-gray-300" />
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[var(--color-primary)]/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-[var(--color-primary2)] text-black text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
            <ImageIcon size={12} /> {parseImages(album.images).length} Photos
          </span>
          <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-white/20">
            {album.description}
          </span>
        </div>

        <motion.h2
          layoutId={`album-title-${album.id}`}
          className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight mb-6 max-w-[90%]"
        >
          {album.name}
        </motion.h2>

        <button className="self-start px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold text-xs uppercase tracking-widest rounded-full flex items-center gap-2 group-hover:bg-[var(--color-primary2)] group-hover:border-[var(--color-primary2)] group-hover:text-black transition-all duration-300">
          View Album <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  )
}

export default PublicAlbumCard
