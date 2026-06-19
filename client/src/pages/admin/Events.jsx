import React, { useState, useEffect } from 'react'
import axios from '../../api/axios'
import toast from 'react-hot-toast'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import Button from '../../components/ui/Button'
import {
  X,
  Type,
  AlignLeft,
  Calendar,
  Clock,
  MapPin,
  Image as ImageIcon,
  Plus,
  ArrowLeft,
  Save,
  Upload,
  Trash2,
} from 'lucide-react'
import { useModal } from '../../context/ModalContext'
import { formatDisplayDate } from '../../components/common/Services'

import { getImageUrl } from '../../utils/imageUtils'
import EventCard from '../../components/admin/events/EventCard'
import EventModal from '../../components/admin/events/EventModal'

const AdminEvents = () => {
  const [events, setEvents] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [isViewing, setIsViewing] = useState(false)

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  })
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const { showConfirm, showSuccess, showError } = useModal()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
  })

  const [featuredImage, setFeaturedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchEvents = async (page = 1, append = false) => {
    if (page > 1) setIsLoadingMore(true)
    try {
      const response = await axios.get(`/events?page=${page}`)
      if (response.data && response.data.data) {
        if (append) {
          setEvents((prev) => [...prev, ...response.data.data])
        } else {
          setEvents(response.data.data)
        }
        if (response.data.pagination) setPagination(response.data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch events from backend:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const loadMore = () => {
    if (pagination.current_page < pagination.last_page) {
      fetchEvents(pagination.current_page + 1, true)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        toast.error('Only JPG, JPEG, and PNG formats are allowed.')
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB.')
        return
      }
      setFeaturedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setIsViewing(false)
    setFormData({
      name: event.name || '',
      description: event.description || '',
      date: event.date || '',
    })
    setFeaturedImage(null)
    setPreviewUrl(getImageUrl(event.image))
    setIsModalOpen(true)
  }

  const handleView = (event) => {
    setEditingEvent(event)
    setIsViewing(true)
    setFormData({
      name: event.name || '',
      description: event.description || '',
      date: event.date || '',
    })
    setFeaturedImage(null)
    setPreviewUrl(getImageUrl(event.image))
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setEditingEvent(null)
    setIsViewing(false)
    setFormData({ name: '', description: '', date: '' })
    setFeaturedImage(null)
    setPreviewUrl(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    showConfirm({
      title: 'Delete Event',
      message:
        'Are you sure you want to delete this event? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          await axios.delete(`/events/${id}`)
          setEvents(events.filter((e) => e.id !== id))
          showSuccess({
            title: 'Deleted!',
            message: 'Event deleted successfully.',
          })
        } catch (error) {
          console.error('Failed to delete event', error)
          showError({ title: 'Error', message: 'Failed to delete event.' })
        }
      },
    })
  }

  const formatDisplayTime = (timeString) => {
    if (!timeString) return ''
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      const [hours, minutes] = timeString.split(':')
      let h = parseInt(hours, 10)
      const ampm = h >= 12 ? 'PM' : 'AM'
      h = h % 12
      h = h ? h : 12
      return `${h}:${minutes} ${ampm}`
    }
    return timeString
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const dataToSend = new FormData()
      dataToSend.append('name', formData.name)
      if (formData.description)
        dataToSend.append('description', formData.description)
      dataToSend.append('date', formData.date)
      if (featuredImage) {
        dataToSend.append('image', featuredImage)
      }

      if (editingEvent) {
        const res = await axios.post(`/events/${editingEvent.id}`, dataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        setEvents(
          events.map((ev) => (ev.id === editingEvent.id ? res.data.data : ev)),
        )
        toast.success('Event updated successfully')
      } else {
        const res = await axios.post('/events', dataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        setEvents([res.data.data, ...events])
        toast.success('Event created successfully')
      }

      setIsModalOpen(false)
      setEditingEvent(null)
    } catch (error) {
      console.error('Error saving event:', error)
      toast.error(
        editingEvent ? 'Error updating event' : 'Error creating event',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto pb-10 pt-0 px-4 md:px-8 relative">
      {/* HEADING AND ADD BUTTON */}
      <div className="flex flex-row items-center justify-between mb-8 w-full">
        <AdminPageHeader
          subtitle="Event Management"
          titlePart1="ADMIN"
          titlePart2="EVENTS"
        />
        <Button
          onClick={handleAddNew}
          variant="primary"
          className="flex items-center gap-2 w-fit whitespace-nowrap"
        >
          <Plus size={18} strokeWidth={3} />
          <span className="hidden sm:inline">ADD NEW EVENT</span>
          <span className="sm:hidden">ADD</span>
        </Button>
      </div>

      {/* EVENT LIST CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* LOAD MORE BUTTON */}
      {pagination.current_page < pagination.last_page && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={loadMore}
            disabled={isLoadingMore}
            variant="secondary"
            className="text-gray-700 hover:text-black border-gray-300 shadow-md"
          >
            {isLoadingMore ? 'Loading...' : 'Load More Events'}
          </Button>
        </div>
      )}

      <EventModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        isViewing={isViewing}
        editingEvent={editingEvent}
        formData={formData}
        handleInputChange={handleInputChange}
        previewUrl={previewUrl}
        featuredImage={featuredImage}
        handleImageChange={handleImageChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export default AdminEvents
