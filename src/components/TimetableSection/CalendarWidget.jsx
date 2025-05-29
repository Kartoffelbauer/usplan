import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { Box } from '@mui/material'

const locales = { 'en-US': enUS }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

export default function CalendarWidget({
  selectedDate,
  onDateChange,
  view,
  onView,
  events = [],
}) {
  return (
    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={selectedDate}
        view={view}
        onNavigate={onDateChange}
        onView={onView}
        defaultView="week"
        views={['week']}
        toolbar={false}
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  )
}
