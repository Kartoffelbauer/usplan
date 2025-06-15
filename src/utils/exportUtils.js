/**
 * Utility functions for exporting and printing timetable data
 */

/**
 * Triggers the browser's print dialog for timetable printing
 */
export const printTimetable = () => {
  window.print()
}

/**
 * Generates the iCal export URL
 * @param {string} viewMode - The view mode ('course' or 'room')
 * @param {string|number} semesterId - The semester ID (puid parameter)
 * @param {string|number} entityId - The study group ID or room ID (pgid parameter)
 * @param {string} language - The language code (lan parameter), defaults to 'de'
 * @returns {string|null} The iCal URL or null if parameters are missing
 */
export const icalUrlForTimetable = (viewMode, semesterId, entityId, language = 'de') => {
  if (!semesterId || !entityId || !viewMode) {
    console.warn('exportTimetableAsIcal: Missing semesterId, entityId, or viewMode')
    return null
  }

  const baseUrl = 'https://splan.hs-heilbronn.de/splan/ical'
  const params = new URLSearchParams({
    lan: language,
    puid: semesterId,
    type: viewMode === 'course' ? 'pg' : 'room',
    [viewMode === 'course' ? 'pgid' : 'roomid']: entityId
  })

  const fullUrl = `${baseUrl}?${params.toString()}`
  
  return fullUrl
}

/**
 * Copies text to clipboard using the modern Clipboard API
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} Promise that resolves to true if successful, false otherwise
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // Modern Clipboard API
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand('copy')
      textArea.remove()
      return result
    }
  } catch (error) {
    console.error('Failed to copy text to clipboard:', error)
    return false
  }
}