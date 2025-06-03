import { useCallback, useMemo } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, parse, startOfWeek, getDay, addMinutes, set } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { Box, useTheme, useMediaQuery } from '@mui/material'
import { useTimetable } from '../../context/TimetableContext'
import CalendarWrapper from '../../layout/CalendarWrapper'

// ==================== CONFIGURATION ====================

/**
 * Date-fns locale configuration for calendar localization
 */
const locales = { 'en-US': enUS }

/**
 * React Big Calendar localizer using date-fns
 * Configured to start weeks on Monday (weekStartsOn: 1)
 */
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

// ==================== UTILITY FUNCTIONS ====================

/**
 * Converts an rgba() color string to a darker version for dark mode.
 * Only converts if the current theme is in dark mode.
 * @param {string} lightColor - The light rgba color string to be processed
 * @param {object} theme - The Material UI theme object
 * @param {number} darkenFactor - How much to darken (0-1, where 0.3 = 30% darker)
 * @returns {string} - The processed rgba color string.
 */
export function rgbaColorToTheme(lightColor, theme, darkenFactor = 0.5) {
  // Only convert if we're in dark mode
  if (theme.palette.mode !== 'dark') {
    return lightColor // Return original color for light mode
  }

  // Parse the rgba color string using regex
  const match = lightColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (!match) return lightColor // Fallback if parsing fails

  // Extract and darken RGB values
  const r = Math.max(0, parseInt(match[1], 10) * (1 - darkenFactor))
  const g = Math.max(0, parseInt(match[2], 10) * (1 - darkenFactor))
  const b = Math.max(0, parseInt(match[3], 10) * (1 - darkenFactor))
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1

  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`
}

/**
 * CalendarWidget component that renders a React Big Calendar with Material UI theming.
 * Automatically switches to day view on mobile devices and applies theme-aware event colors.
 * Integrates with timetable context for schedule time boundaries.
 * 
 * @param {Object} props - Component props
 * @param {Date} props.selectedDate - The currently selected/displayed date
 * @param {Function} props.onDateChange - Callback function when the date is changed
 * @param {string} props.view - The current calendar view ('day', 'week', etc.)
 * @param {Function} props.onView - Callback function when the view is changed
 * @param {Array} props.events - Array of calendar events to display
 * @returns {JSX.Element} The rendered calendar widget component
 */
export default function CalendarWidget({
  selectedDate,
  onDateChange,
  view,
  onView,
  events = [],
}) {
  // ==================== HOOKS ====================
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { timetable } = useTimetable()

  // ==================== MEMOIZED VALUES ====================

  /**
   * Calendar time format configuration
   * Memoized to prevent recreation on every render
   */
  const calendarFormats = useMemo(() => ({
    timeGutterFormat: (date) => format(date, 'HH:mm'),
    eventTimeRangeFormat: ({ start, end }) => `${format(start, 'HH:mm')} – ${format(end, 'HH:mm')}`,
  }), [])

  /**
   * Calendar minimum time boundary
   * Uses timetable beginTimeMinutes or defaults to 8:00 AM (480 minutes)
   */
  const minTime = useMemo(() => 
    addMinutes(
      set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), 
      timetable?.beginTimeMinutes || 480
    ), 
    [timetable?.beginTimeMinutes]
  )

  /**
   * Calendar maximum time boundary
   * Uses timetable endTimeMinutes or defaults to 6:00 PM (1080 minutes)
   */
  const maxTime = useMemo(() => 
    addMinutes(
      set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), 
      timetable?.endTimeMinutes || 1080
    ), 
    [timetable?.endTimeMinutes]
  )

  /**
   * Responsive calendar view configuration
   * Forces day view on mobile, uses prop view on desktop
   */
  const currentView = useMemo(() => 
    isMobile ? "day" : view, 
    [isMobile, view]
  )

  /**
   * Available calendar views based on device type
   * Mobile: day view only, Desktop: week view only
   */
  const availableViews = useMemo(() => 
    isMobile ? ['day'] : ['week'], 
    [isMobile]
  )

  /**
   * Default calendar view based on device type
   */
  const defaultView = useMemo(() => 
    isMobile ? "day" : "week", 
    [isMobile]
  )

  // ==================== EVENT HANDLERS ====================

  /**
   * Handles calendar navigation (date changes)
   * @param {Date} newDate - The new selected date
   */
  const handleNavigate = useCallback((newDate) => {
    onDateChange(newDate)
  }, [onDateChange])

  /**
   * Handles calendar view changes (day/week/month)
   * @param {string} newView - The new view mode
   */
  const handleViewChange = useCallback((newView) => {
    onView(newView)
  }, [onView])

  /**
   * Generates styling props for calendar events
   * Applies theme-aware background colors to events
   * @param {Object} event - The calendar event object
   * @returns {Object} Style configuration for the event
   */
  const getEventProps = useCallback((event) => ({
    style: {
      backgroundColor: rgbaColorToTheme(event.lightColor, theme) || theme.palette.primary.main,
    }
  }), [theme])

  // ==================== RENDER ====================

  return (
    <Box 
      flexGrow={1} 
      overflow="hidden" 
      padding={!isMobile && theme.spacing(2)} 
      paddingTop={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <CalendarWrapper>
        <Calendar
          // Core calendar configuration
          localizer={localizer}
          events={events}
          
          // Event data accessors
          startAccessor="start"
          endAccessor="end"
          
          // Time boundaries from timetable context
          min={minTime}
          max={maxTime}
          
          // Date and view state
          date={selectedDate}
          view={currentView}
          defaultView={defaultView}
          views={availableViews}
          
          // Event handlers
          onNavigate={handleNavigate}
          onView={handleViewChange}
          
          // Formatting and display options
          formats={calendarFormats}
          toolbar={false} // Hide default toolbar (using custom navbar)
          
          // Styling
          style={{ width: '100%', height: '100%' }}
          eventPropGetter={getEventProps}
        />
      </CalendarWrapper>
    </Box>
  )
}
