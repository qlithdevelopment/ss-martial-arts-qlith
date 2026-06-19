import React from 'react'
import { X, Type, AlignLeft, CopyPlus, Trash2 } from 'lucide-react'
import Button from '../../ui/Button'
import { getImageUrl } from '../../../utils/imageUtils'

const AlbumModal = ({
  isOpen,
  setIsOpen,
  isViewing,
  editingAlbum,
  formData,
  handleInputChange,
  oldImages,
  setOldImages,
  galleryPreviews,
  setGalleryPreviews,
  galleryImages,
  setGalleryImages,
  handleImageChange,
  handleSubmit,
  isSubmitting,
  isImageManagerOpen,
  setIsImageManagerOpen,
}) => {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl flex flex-col max-h-[85dvh] overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center p-6 sm:p-8 border-b border-gray-50 shrink-0">
            <h3 className="text-2xl font-black text-[var(--color-primary)] tracking-tight">
              {isViewing
                ? 'View Album'
                : editingAlbum
                  ? 'Edit Album'
                  : 'Create New Album'}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-black transition-colors"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
          </div>

          <form
            id="album-form"
            onSubmit={handleSubmit}
            className="p-4 sm:p-8 overflow-y-auto flex-1"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Type size={12} /> ALBUM NAME
                </label>
                <input
                  required={!isViewing}
                  disabled={isViewing}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 focus:outline-none focus:border-blue-400 focus:bg-blue-50 transition-colors bg-gray-50 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-black disabled:cursor-not-allowed"
                  placeholder="e.g. Winter Grading 2026"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <AlignLeft size={12} /> DESCRIPTION
                </label>
                <input
                  disabled={isViewing}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 focus:outline-none focus:border-blue-400 focus:bg-blue-50 transition-colors bg-gray-50 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-black disabled:cursor-not-allowed"
                  placeholder="e.g. Dan Promotions"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <CopyPlus size={12} /> GALLERY PHOTOS
                </label>
                <div className="flex items-center gap-3 mt-1">
                  <div
                    className="flex -space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setIsImageManagerOpen(true)}
                  >
                    {[
                      ...oldImages.map((img) => getImageUrl(img)),
                      ...galleryPreviews,
                    ]
                      .slice(0, 5)
                      .map((url, idx) => (
                        <div
                          key={idx}
                          className="h-8 w-8 rounded-full overflow-hidden border-2 border-white bg-gray-100 border-dashed border-gray-300"
                        >
                          <img
                            src={url}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    {oldImages.length + galleryPreviews.length > 5 && (
                      <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                        +
                        {oldImages.length + galleryPreviews.length - 5}
                      </div>
                    )}
                  </div>
                  {!isViewing && (
                    <div className="flex flex-col">
                      <label className="bg-[#eef2f6] hover:bg-gray-200 text-[#1e293b] font-bold px-4 py-2 rounded-full text-[10px] tracking-wider cursor-pointer transition-colors whitespace-nowrap w-fit">
                        {oldImages.length > 0
                          ? 'ADD MORE PHOTOS'
                          : 'CHOOSE FILES'}
                        <input
                          required={!editingAlbum && oldImages.length === 0}
                          type="file"
                          multiple
                          accept=".jpg,.jpeg,.png"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[9px] text-gray-400 mt-1 uppercase tracking-widest">
                        Max 2MB per image. Format: JPG, PNG
                      </span>
                    </div>
                  )}
                  <span className="text-xs text-[#8ba2ba] truncate max-w-[80px]">
                    {galleryImages.length > 0
                      ? `+${galleryImages.length} files`
                      : !isViewing && oldImages.length > 0
                        ? `${oldImages.length} files`
                        : !isViewing && 'No files'}
                  </span>
                </div>
              </div>
            </div>
          </form>

          <div
            className={`grid ${isViewing ? 'grid-cols-1' : 'grid-cols-2'} gap-3 p-4 sm:p-8 border-t border-gray-50 shrink-0 bg-white`}
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
                form="album-form"
                disabled={isSubmitting}
                variant="dark"
                className="w-full"
              >
                {isSubmitting
                  ? 'Saving...'
                  : editingAlbum
                    ? 'Save Changes'
                    : 'Create Album'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* IMAGE MANAGER OVERLAY */}
      {isImageManagerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h3 className="text-xl font-black text-gray-800 tracking-tight">
                Image Manager
              </h3>
              <button
                type="button"
                onClick={() => setIsImageManagerOpen(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {oldImages.map((img, idx) => (
                  <div
                    key={`old-${idx}`}
                    className="relative aspect-square rounded-xl overflow-hidden group shadow-sm border border-gray-200"
                  >
                    <img
                      src={getImageUrl(img)}
                      className="w-full h-full object-cover"
                    />
                    {!isViewing && (
                      <button
                        type="button"
                        onClick={() =>
                          setOldImages((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }
                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {galleryPreviews.map((url, idx) => (
                  <div
                    key={`new-${idx}`}
                    className="relative aspect-square rounded-xl overflow-hidden group shadow-sm border border-blue-200"
                  >
                    <img src={url} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      NEW
                    </div>
                    {!isViewing && (
                      <button
                        type="button"
                        onClick={() => {
                          setGalleryImages((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                          setGalleryPreviews((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {oldImages.length === 0 && galleryPreviews.length === 0 && (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No images available.
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 shrink-0 bg-white flex justify-end">
              <Button
                type="button"
                onClick={() => setIsImageManagerOpen(false)}
                variant="primary"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AlbumModal
