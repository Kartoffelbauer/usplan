import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { Box, useTheme } from '@mui/material'
import CalendarWrapper from '../../layout/CalendarWrapper'

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
  const theme = useTheme()
  const formats = {
    timeGutterFormat: (date) => format(date, 'HH:mm'),
    eventTimeRangeFormat: ({ start, end }) => `${format(start, 'HH:mm')} – ${format(end, 'HH:mm')}`,
  }

  return (
    <Box flexGrow='1' overflow='hidden' padding={theme.spacing(2)}>
      <CalendarWrapper>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          min={new Date(2023, 0, 1, 8, 0)}  // 08:00
          max={new Date(2023, 0, 1, 18, 0)} // 18:00
          date={selectedDate}
          formats={formats}
          view={view}
          onNavigate={onDateChange}
          onView={onView}
          defaultView="week"
          views={['week']}
          toolbar={false}
          style={{ width: '100%', height: '100%' }}
        />
      </CalendarWrapper>
    </Box>
  )
}
