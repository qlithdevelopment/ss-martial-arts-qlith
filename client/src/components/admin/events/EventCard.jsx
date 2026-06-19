import React from 'react'
import { Image as ImageIcon } from 'lucide-react'
import { formatDisplayDate } from '../../common/Services'
import { getImageUrl } from '../../../utils/imageUtils'

const EventCard = ({ event, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-shadow">
      <div className="h-40 md:h-48 overflow-hidden relative bg-gray-100 flex items-center justify-center">
        {getImageUrl(event.image) ? (
          <img
            src={getImageUrl(event.image)}
            alt={event.name}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <ImageIcon size={48} className="text-gray-300" />
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h4 className="font-black text-xl text-black uppercase tracking-tight mb-2 line-clamp-2">
          {event.name}
        </h4>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
          {event.description}
        </p>
        <div className="flex justify-between items-center mt-auto border-t border-gray-50 pt-4">
          <span className="bg-blue-50 text-[var(--color-primary)] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            {formatDisplayDate(event.date)}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onView(event)
              }}
              className="text-gray-500 font-bold text-xs uppercase hover:text-gray-700 transition-colors"
            >
              View
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(event)
              }}
              className="text-blue-500 font-bold text-xs uppercase hover:text-blue-700 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(event.id)
              }}
              className="text-red-500 font-bold text-xs uppercase hover:text-red-700 transition-colors"
            >
              Del
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCard
