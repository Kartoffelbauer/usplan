import { useEffect, useState } from 'react'
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material'
import { eachWeekOfInterval, addMinutes, parseISO } from 'date-fns';
import { TimetableProvider, useTimetable } from '../../context/TimetableContext'
import Sidebar from './Sidebar'
import CalendarWidget from './CalendarWidget'

function eachNthWeekOfInterval(interval, n, options = {}, offset = 0) {
  return eachWeekOfInterval(interval, options).filter((_, idx) => (idx - offset) % n === 0)
}

export default function TimetableSection({
  selectedDate,
  onDateChange,
  view,
  onView,
  sidebarOpen,
  onToggleSidebar,
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Shared state
  const [events, setEvents] = useState([])
  const { semesters, timetable, selectedSemesterId } = useTimetable()

  // Transform timetable into calendar events
  useEffect(() => {
    const currentSemester = semesters.find(semester => semester.id === selectedSemesterId)
    if (!timetable || !currentSemester) {
      setEvents([])
      return
    }

    const semesterInertval = {
      start: new Date(currentSemester.beginOfLectureDate),
      end: new Date(currentSemester.endOfLectureDate),
    }
    const happenings = []

    console.log(timetable)

    timetable.happenings.forEach(event => {
      // Handle DAY type
      if (event.type === 'DAY') {
        const date = (typeof event.singularDate === "string") ? parseISO(event.singularDate) : new Date(event.singularDate)
        happenings.push({
          title: event.orglectureName,
          start: addMinutes(date, event.beginMinute),
          end: addMinutes(date, event.endMinute),
          location: event.roomNames,
          color: `rgba(${event.red}, ${event.green}, ${event.blue}, ${event.alpha})`,
        })
      }
      // Handle WEEK type
      else {
        // Handle different WEEK types
        var nthWeek = 1
        switch (event.type) {
          case 'TWO_WEEKS':
              nthWeek = 2
            break;

          case 'THREE_WEEKS':
              nthWeek = 3
            break;

          case 'FOUR_WEEKS':
              nthWeek = 4
            break;

          default:
              nthWeek = 1
        }
       
        // For each weekday, create an event
        eachNthWeekOfInterval(semesterInertval, nthWeek, { weekStartsOn: event.weekday + 1 })
          .forEach(weekday => {
            happenings.push({
              title: event.orglectureName,
              start: addMinutes(weekday, event.beginMinute),
              end: addMinutes(weekday, event.endMinute),
              location: event.roomNames,
              color: `rgba(${event.red}, ${event.green}, ${event.blue}, ${event.alpha})`,
            })
          })
      }
    })

    setEvents(happenings)
  }, [timetable])

  return (
    <Box display="flex" flexGrow={1} overflow="hidden" width="100%" backgroundColor={theme.palette.background.secondary}>
      {/* Desktop Sidebar */}
      {!isMobile && sidebarOpen && (
        <Box
          sx={{
            width: 300,
            flexShrink: 0,
            backgroundColor: theme.palette.background.secondary,
          }}
        >
          <Sidebar />
        </Box>
      )}

      {/* Mobile Sidebar Drawer */}
      {isMobile && (
        <Drawer
          open={sidebarOpen}
          onClose={onToggleSidebar}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: 300,
              backgroundColor: theme.palette.background.secondary,
              border: 'none',
            },
          }}
        >
          <Sidebar />
        </Drawer>
      )}

      {/* Calendar View */}
      <CalendarWidget
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        view={view}
        onView={onView}
        events={events}
      />
    </Box>
  )
}