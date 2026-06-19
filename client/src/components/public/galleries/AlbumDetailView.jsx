import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { getImageUrl } from '../../../utils/imageUtils'

const AlbumDetailView = ({
  selectedAlbum,
  setSelectedAlbum,
  parseImages,
  setLightboxImage,
}) => {
  return (
    <motion.div
      key="album-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col"
    >
      {/* Back Button */}
      <button
        onClick={() => setSelectedAlbum(null)}
        className="self-start flex items-center gap-2 text-gray-500 hover:text-[#0b1b24] transition-colors font-bold uppercase tracking-widest text-xs mb-8 bg-white px-5 py-3 rounded-full shadow-sm border border-gray-200"
      >
        <ArrowLeft size={16} /> Back to Albums
      </button>

      {/* Album Header Banner */}
      <motion.div
        layoutId={`album-container-${selectedAlbum.id}`}
        className="w-full h-[40vh] md:h-[50vh] rounded-[40px] overflow-hidden relative mb-12 shadow-2xl bg-gray-100 flex items-center justify-center"
      >
        {parseImages(selectedAlbum.images).length > 0 ? (
          <motion.img
            layoutId={`album-cover-${selectedAlbum.id}`}
            src={getImageUrl(parseImages(selectedAlbum.images)[0])}
            alt={selectedAlbum.name}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <ImageIcon size={64} className="text-gray-300" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 flex flex-col justify-end p-8 md:p-16">
          <div className="inline-block bg-[var(--color-primary2)] text-black text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full mb-4 w-fit shadow-lg">
            {selectedAlbum.description}
          </div>
          <motion.h1
            layoutId={`album-title-${selectedAlbum.id}`}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter max-w-4xl leading-none"
          >
            {selectedAlbum.name}
          </motion.h1>
        </div>
      </motion.div>

      {/* Photos Grid inside Album */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {parseImages(selectedAlbum.images).map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.03 }}
            onClick={() => setLightboxImage(getImageUrl(img))}
            className="relative group rounded-3xl overflow-hidden aspect-square cursor-zoom-in bg-gray-200 shadow-md border border-gray-100"
          >
            <img
              src={getImageUrl(img)}
              alt={`${selectedAlbum.name} ${idx + 1}`}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-50 group-hover:scale-100 duration-300">
                <ImageIcon size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default AlbumDetailView
