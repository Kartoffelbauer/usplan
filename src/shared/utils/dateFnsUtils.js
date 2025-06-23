import { startOfWeek, addDays, getDay, eachWeekOfInterval } from 'date-fns'

/**
 * Get specific weekday in current week
 * @param {number} weekdayIndex - Weekday index (0=Monday, 1=Tuesday, ..., 6=Sunday)
 * @returns {Date} The date for that weekday in the current week
 */
export const getCurrentWeekday = (weekdayIndex) => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday = 0
  return addDays(weekStart, weekdayIndex)
}

/**
 * Helper function to get every nth week of an interval
 * @param {Object|null} interval - Date interval with start and end
 * @param {number} n - Every nth week (default: 1)
 * @param {Object} options - Additional options for eachWeekOfInterval
 * @param {number} offset - Week offset (default: 0)
 * @returns {Date[]} Array of dates representing every nth week
 */
export const eachNthWeekOfInterval = (interval, n = 1, options = {}, offset = 0) => {
  return eachWeekOfInterval(interval, options).filter((_, idx) => (idx - offset) % n === 0)
}

/**
 * Maps any date to the equivalent day in the current week
 * @param {Date} date - The original date
 * @param {Date} referenceWeek - The week to map to (default: current week)
 * @returns {Date} The equivalent day in the reference week
 */
export const mapToCurrentWeek = (date, referenceWeek = new Date()) => {
  const weekStart = startOfWeek(referenceWeek, { weekStartsOn: 1 }) // Monday = 0
  const dayOfWeek = getDay(date)
  
  // Handle Sunday (0) -> map to index 6, others map to dayOfWeek - 1
  const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  
  return addDays(weekStart, dayIndex)
}

/**
 * Get the date for a specific weekday in the current week
 * @param {number} weekdayIndex - Weekday index (0=Monday, 1=Tuesday, ..., 6=Sunday)
 * @returns {Date} The date for that weekday in the current week
 */
export const getDateForWeekdayInCurrentWeek = (weekdayIndex) => {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  return addDays(currentWeekStart, weekdayIndex)
}

/**
 * Check if a date falls within a specific week
 * @param {Date} date - Date to check
 * @param {Date} weekStart - Start of the week to check against
 * @returns {boolean} True if date is within the week
 */
export const isDateInWeek = (date, weekStart) => {
  const weekEnd = addDays(weekStart, 6)
  return date >= weekStart && date <= weekEnd
}