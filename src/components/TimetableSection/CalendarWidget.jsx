import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, parse, startOfWeek, getDay, addMinutes, set } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { Box, useTheme, useMediaQuery } from '@mui/material'
import { useTimetable } from '../../context/TimetableContext'
import CalendarWrapper from '../../layout/CalendarWrapper'

const locales = { 'en-US': enUS }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

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
    return lightColor // return original color for light mode
  }

  const match = lightColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (!match) return lightColor // fallback if parsing fails

  const r = Math.max(0, parseInt(match[1], 10) * (1 - darkenFactor))
  const g = Math.max(0, parseInt(match[2], 10) * (1 - darkenFactor))
  const b = Math.max(0, parseInt(match[3], 10) * (1 - darkenFactor))
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1

  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`
}

/**
 * CalendarWidget component that renders a React Big Calendar with Material UI theming.
 * Automatically switches to day view on mobile devices and applies theme-aware event colors.
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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const formats = {
    timeGutterFormat: (date) => format(date, 'HH:mm'),
    eventTimeRangeFormat: ({ start, end }) => `${format(start, 'HH:mm')} – ${format(end, 'HH:mm')}`,
  }
  const { timetable } = useTimetable()

  return (
    <Box flexGrow='1' overflow='hidden' padding={!isMobile && theme.spacing(2)} paddingTop={0}>
      <CalendarWrapper>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          min={addMinutes(set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), timetable?.beginTimeMinutes || 480)}
          max={addMinutes(set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), timetable?.endTimeMinutes || 1080)}
          date={selectedDate}
          formats={formats}
          view={isMobile ? "day" : view}
          onNavigate={onDateChange}
          onView={onView}
          defaultView={isMobile ? "day" : "week"}
          views={isMobile ? ['day'] : ['week']}
          toolbar={false}
          style={{ width: '100%', height: '100%' }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: rgbaColorToTheme(event.lightColor, theme) || theme.palette.primary.main,
            }
          })}
        />
      </CalendarWrapper>
    </Box>
  )
}
