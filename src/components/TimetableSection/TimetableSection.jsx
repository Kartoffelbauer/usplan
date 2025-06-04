import { useTranslation } from 'react-i18next'
import { useEffect, useState, useCallback } from 'react'
import { 
  Box, 
  Drawer, 
  useMediaQuery, 
  useTheme, 
  Dialog,
  DialogTitle,
  DialogContent,
  Typography
} from '@mui/material'
import { eachWeekOfInterval, addMinutes, parseISO } from 'date-fns'
import ErrorIcon from '@mui/icons-material/Error'
import { useTimetable } from '../../context/TimetableContext'
import Sidebar from './Sidebar'
import CalendarWidget from './CalendarWidget'

/**
 * Helper function to get every nth week of an interval
 * @param {Object} interval - Date interval with start and end
 * @param {number} n - Every nth week
 * @param {Object} options - Additional options for eachWeekOfInterval
 * @param {number} offset - Week offset
 * @returns {Date[]} Array of dates representing every nth week
 */
function eachNthWeekOfInterval(interval, n, options = {}, offset = 0) {
  return eachWeekOfInterval(interval, options).filter((_, idx) => (idx - offset) % n === 0)
}

/**
 * TimetableSection component that manages the sidebar and calendar view
 * Handles timetable data transformation and responsive layout
 * 
 * @param {Object} props - Component props
 * @param {Date} props.selectedDate - Currently selected date
 * @param {Function} props.onDateChange - Date change handler
 * @param {string} props.view - Current calendar view
 * @param {Function} props.onView - View change handler
 * @param {boolean} props.sidebarOpen - Sidebar open state
 * @param {Function} props.onToggleSidebar - Sidebar toggle handler
 * @returns {JSX.Element} The rendered timetable section
 */
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
  const { t } = useTranslation()

  // State
  const [events, setEvents] = useState([])
  const { semesters, timetable, selectedSemesterId, error, clearError } = useTimetable()

  // Event handlers
  const handleSidebarClose = useCallback(() => {
    onToggleSidebar()
  }, [onToggleSidebar])

  const handleCalendarDateChange = useCallback((date) => {
    onDateChange(date)
  }, [onDateChange])

  const handleCalendarViewChange = useCallback((newView) => {
    onView(newView)
  }, [onView])

  // Helper function to determine week interval
  const getWeekInterval = useCallback((eventType) => {
    switch (eventType) {
      case 'TWO_WEEKS':
        return 2
      case 'THREE_WEEKS':
        return 3
      case 'FOUR_WEEKS':
        return 4
      default:
        return 1
    }
  }, [])

  // Helper function to create event object
  const createEvent = useCallback((happening, start, end) => ({
    title: happening.orglectureName,
    start,
    end,
    location: happening.roomNames,
    lightColor: `rgba(${happening.red}, ${happening.green}, ${happening.blue}, ${happening.alpha})`,
  }), [])

  // Transform timetable into calendar events
  useEffect(() => {
    const currentSemester = semesters.find(semester => semester.id === selectedSemesterId)
    if (!timetable || !currentSemester) {
      setEvents([])
      return
    }

    const semesterInterval = {
      start: new Date(currentSemester.beginOfLectureDate),
      end: new Date(currentSemester.endOfLectureDate),
    }
    const happenings = []

    console.log(timetable)

    timetable.happenings.forEach(event => {
      // Handle DAY type events
      if (event.type === 'DAY') {
        const date = (typeof event.singularDate === "string") 
          ? parseISO(event.singularDate) 
          : new Date(event.singularDate)
        
        const eventObj = createEvent(
          event,
          addMinutes(date, event.beginMinute),
          addMinutes(date, event.endMinute)
        )
        happenings.push(eventObj)
      }
      // Handle WEEK type events
      else {
        const nthWeek = getWeekInterval(event.type)
       
        // For each weekday, create an event
        eachNthWeekOfInterval(semesterInterval, nthWeek, { weekStartsOn: event.weekday + 1 })
          .forEach(weekday => {
            const eventObj = createEvent(
              event,
              addMinutes(weekday, event.beginMinute),
              addMinutes(weekday, event.endMinute)
            )
            happenings.push(eventObj)
          })
      }
    })

    setEvents(happenings)
  }, [timetable, semesters, selectedSemesterId, createEvent, getWeekInterval])

  return (
    <>
      <Box 
        display="flex" 
        flexGrow={1} 
        overflow="hidden" 
        width="100%" 
        height="100%"
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
            onClose={handleSidebarClose}
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
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: theme.transitions.create(['margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
          }}
        >
          <CalendarWidget
            selectedDate={selectedDate}
            onDateChange={handleCalendarDateChange}
            view={view}
            onView={handleCalendarViewChange}
            events={events}
          />
        </Box>
      </Box>

      {/* Simple Error Dialog */}
      <Dialog open={!!error} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ErrorIcon color="error" />
          {t('restError.title')}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {error && error?.message } {t('restError.action')}
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  )
}