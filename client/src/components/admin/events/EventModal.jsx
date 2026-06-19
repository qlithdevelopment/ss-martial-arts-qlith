import React from 'react'
import { X, Type, AlignLeft, Calendar, Image as ImageIcon } from 'lucide-react'
import Button from '../../ui/Button'

const EventModal = ({
  isOpen,
  setIsOpen,
  isViewing,
  editingEvent,
  formData,
  handleInputChange,
  previewUrl,
  featuredImage,
  handleImageChange,
  handleSubmit,
  isSubmitting,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl flex flex-col max-h-[85dvh] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 sm:p-8 border-b border-gray-50 shrink-0">
          <h3 className="text-2xl font-black text-[var(--color-primary)] tracking-tight">
            {isViewing
              ? 'View Event'
              : editingEvent
                ? 'Edit Event'
                : 'Add Event'}
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-black transition-colors"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        <form
          id="event-form"
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 overflow-y-auto flex-1"
        >
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <Type size={12} /> EVENT NAME
              </label>
              <input
                required={!isViewing}
                disabled={isViewing}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 focus:outline-none focus:border-blue-400 focus:bg-blue-50 transition-colors bg-gray-50 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-black disabled:cursor-not-allowed"
                placeholder="Event Name"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              <AlignLeft size={12} /> DESCRIPTION
            </label>
            <textarea
              disabled={isViewing}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 focus:outline-none focus:border-blue-400 focus:bg-blue-50 transition-colors bg-gray-50 resize-y min-h-[100px] disabled:bg-gray-100 disabled:border-gray-300 disabled:text-black disabled:cursor-not-allowed"
              placeholder="Detailed information about the event..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar size={12} /> DATE
              </label>
              <input
                required={!isViewing}
                disabled={isViewing}
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 focus:outline-none focus:border-blue-400 focus:bg-blue-50 transition-colors bg-gray-50 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-black disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <ImageIcon size={12} /> IMAGE
              </label>
              <div className="flex items-center gap-3 mt-1">
                <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-50 flex-shrink-0 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={14} className="text-gray-400" />
                  )}
                </div>
                {!isViewing && (
                  <div className="flex flex-col">
                    <label className="bg-[#eef2f6] hover:bg-gray-200 text-[#1e293b] font-bold px-4 py-2 rounded-full text-[10px] tracking-wider cursor-pointer transition-colors whitespace-nowrap w-fit">
                      CHOOSE FILE
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[9px] text-gray-400 mt-1 uppercase tracking-widest">
                      Max: 2MB. Format: JPG, PNG
                    </span>
                  </div>
                )}
                <span className="text-xs text-[#8ba2ba] truncate max-w-[100px]">
                  {featuredImage
                    ? featuredImage.name
                    : !isViewing && 'No file'}
                </span>
              </div>
            </div>
          </div>
        </form>

        <div
          className={`grid ${isViewing ? 'grid-cols-1' : 'grid-cols-2'} gap-3 p-4 sm:p-6 border-t border-gray-50 shrink-0 bg-white`}
        >
          <Button
            type="button"
            onClick={() => setIsOpen(false)}
            variant="secondary"
            className="w-full text-black bg-gray-100 hover:bg-gray-200 border-none"
          >
            {isViewing ? 'Close' : 'Cancel'}
          </Button>
          {!isViewing && (
            <Button
              type="submit"
              form="event-form"
              disabled={isSubmitting}
              variant="dark"
              className="w-full"
            >
              {isSubmitting
                ? 'Saving...'
                : editingEvent
                  ? 'Save Changes'
                  : 'Create Event'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventModal
