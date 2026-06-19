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

export const formatDisplayDate = (dateString) => {
  if (!dateString) return ''
  if (dateString.includes('-')) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
  return dateString
}
