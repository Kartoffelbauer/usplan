import { useEffect, useState } from 'react'
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material'
import { eachWeekOfInterval, addMinutes, parseISO } from 'date-fns';
import { useTimetable } from '../../context/TimetableContext'
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
          lightColor: `rgba(${event.red}, ${event.green}, ${event.blue}, ${event.alpha})`,
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
              lightColor: `rgba(${event.red}, ${event.green}, ${event.blue}, ${event.alpha})`,
            })
          })
      }
    })

    setEvents(happenings)
  }, [timetable])

  return (
    <Box 
      display="flex" 
      flexGrow={1} 
      overflow="hidden" 
      width="100%" 
      height="100%" // Add this
      backgroundColor={theme.palette.background.secondary}
    >
      {/* Desktop Sidebar with Animation */}
      {!isMobile && (
        <Box
          sx={{
            width: sidebarOpen ? 300 : 0,
            flexShrink: 0,
            overflow: 'hidden',
            backgroundColor: theme.palette.background.secondary,
            transition: theme.transitions.create(['width'], {
              easing: theme.transitions.easing.sharp,
              duration: sidebarOpen 
                ? theme.transitions.duration.enteringScreen 
                : theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Box
            sx={{
              width: 300,
              height: '100%',
              p: 2,
              pt: 4,
              pr: 0,
              transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
              transition: theme.transitions.create(['transform'], {
                easing: theme.transitions.easing.sharp,
                duration: sidebarOpen 
                  ? theme.transitions.duration.enteringScreen 
                  : theme.transitions.duration.leavingScreen,
              }),
            }}
          >
            <Sidebar />
          </Box>
        </Box>
      )}

      {/* Mobile Sidebar Drawer with Built-in Animation */}
      {isMobile && (
        <Drawer
          open={sidebarOpen}
          onClose={onToggleSidebar}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: 320,
              backgroundColor: theme.palette.background.secondary,
              border: 'none',
              p: 2,
              pt: 4,
            },
          }}
          transitionDuration={{
            enter: theme.transitions.duration.enteringScreen,
            exit: theme.transitions.duration.leavingScreen,
          }}
        >
          <Sidebar />
        </Drawer>
      )}

      {/* Calendar View with Smooth Margin Transition */}
      <Box
        sx={{
          flexGrow: 1,
          height: '100%', // Add this
          display: 'flex', // Add this
          flexDirection: 'column', // Add this
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <CalendarWidget
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          view={view}
          onView={onView}
          events={events}
        />
      </Box>
    </Box>
  )
}