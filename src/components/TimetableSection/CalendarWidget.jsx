import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, parse, startOfWeek, getDay, addMinutes, set } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { Box, useTheme, useMediaQuery } from '@mui/material'
import CalendarWrapper from '../../layout/CalendarWrapper'
import { useTimetable } from '../../context/TimetableContext'

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const formats = {
    timeGutterFormat: (date) => format(date, 'HH:mm'),
    eventTimeRangeFormat: ({ start, end }) => `${format(start, 'HH:mm')} – ${format(end, 'HH:mm')}`,
  }
  const { timetable } = useTimetable()

  return (
    <Box flexGrow='1' overflow='hidden' padding={theme.spacing(2)}>
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
              backgroundColor: event.color || theme.palette.primary.main,
            }
          })}
        />
      </CalendarWrapper>
    </Box>
  )
}
