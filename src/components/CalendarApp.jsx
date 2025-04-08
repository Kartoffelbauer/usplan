import { useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { Box } from '@mui/material'
import CalendarToolbar from './CalendarToolbar'
import sampleEvents from '../data/sampleEvents'

const locales = { 'en-US': enUS }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

export default function CalendarApp({ selectedDate, onDateChange }) {
  const [events] = useState(sampleEvents)
  const [view, setView] = useState('week')

  const handleNavigate = (newDate) => {
    onDateChange?.(newDate)
  }

  const handleViewChange = (newView) => {
    setView(newView)
  }

  return (
    <Box p={2} width="100%" height="100%" sx={{ boxSizing: 'border-box', overflow: 'hidden' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={selectedDate}
        view={view}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        defaultView="week"
        views={['week']}
        style={{ width: '100%', height: '100%' }}
        components={{ toolbar: CalendarToolbar }}
      />
    </Box>
  )
}