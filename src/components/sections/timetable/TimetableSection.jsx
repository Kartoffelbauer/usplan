import { useTranslation } from 'react-i18next'
import { useEffect, useState, useCallback } from 'react'
import { 
  Box, 
  useTheme, 
  Dialog,
  DialogTitle,
  DialogContent,
  Typography
} from '@mui/material'
import { addMinutes, parseISO } from 'date-fns'
import ErrorIcon from '@mui/icons-material/Error'
import { useCheckMobile } from '../../../utils/themeUtils'
import { useTimetable } from '../../../context/TimetableContext'
import { getCurrentWeekday, eachNthWeekOfInterval, mapToCurrentWeek } from '../../../utils/dateFnsUtils'
import Sidebar from './Sidebar'
import CalendarWidget from '../../widgets/CalendarWidget'

/**
 * TimetableSection component that manages the sidebar and calendar view
 * Handles timetable data transformation and responsive layout
 * 
 * @param {Object} props - Component props
 * @param {Date} props.selectedDate - Currently selected date
 * @param {Function} props.onDateChange - Date change handler
 * @param {boolean} props.sidebarOpen - Sidebar open state
 * @param {Function} props.onToggleSidebar - Sidebar toggle handler
 * @param {boolean} props.showDates - Whether to show dates in calendar
 * @param {boolean} props.showSpecials - Whether to show special events
 * @returns {JSX.Element} The rendered timetable section
 */
export default function TimetableSection({
  selectedDate,
  onDateChange,
  sidebarOpen,
  onToggleSidebar,
  showDates,
  showSpecials,
}) {
  const { t } = useTranslation()
  const isMobile = useCheckMobile()
  const theme = useTheme()
  const {
    selectedLocation,
    selectedSemester,
    selectedStudyCourse,
    selectedStudyGroup,
    selectedRoom,
    selectedTimetable,
    timetable,
    error
  } = useTimetable()

  // State to hold transformed calendar events
  const [events, setEvents] = useState([])

  // Event handlers
  const handleSidebarClose = useCallback(() => {
    onToggleSidebar()
    console.log('Sidebar closed')
  }, [onToggleSidebar])

  const handleCalendarDateChange = useCallback((date) => {
    onDateChange(date)
  }, [onDateChange])

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
  const createEvent = useCallback((event, start, end) => ({
    title: event.orglectureName,
    start,
    end,
    location: event.roomNames,
    lightColor: `rgba(${event.red}, ${event.green}, ${event.blue}, ${event.alpha})`,
  }), [])

  // Transform timetable into calendar events
  useEffect(() => {
    if (!timetable || !selectedSemester) {
      setEvents([])
      return
    }

    const semesterInterval = {
      start: new Date(selectedSemester.beginOfLectureDate),
      end: new Date(selectedSemester.endOfLectureDate),
    }
    const happenings = []

    timetable.happenings.forEach(event => {
      // Skip exams if not showing specials
      if ((!showSpecials && event.exam) || event.holiday) return

      // Handle DAY type events
      if (event.type === 'DAY') {
        const originalDate = (typeof event.singularDate === "string") 
          ? parseISO(event.singularDate) 
          : new Date(event.singularDate)
        const displayDate = showDates ? originalDate : mapToCurrentWeek(originalDate)
        
        const eventObj = createEvent(
          event,
          addMinutes(displayDate, event.beginMinute),
          addMinutes(displayDate, event.endMinute)
        )
        happenings.push(eventObj)
      }
      // Handle WEEK type events
      else {
        const nthWeek = getWeekInterval(event.type)
        const dates = showDates
          ? eachNthWeekOfInterval(semesterInterval, nthWeek, { weekStartsOn: event.weekday + 1 })
          : [getCurrentWeekday(nthWeek)]

        // For each weekday, create an event
        dates.forEach(weekday => {
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
  }, [timetable, selectedSemester, showDates, showSpecials, getWeekInterval, createEvent])

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
        {/* Sidebar for navigation */}
        <Sidebar sidebarOpen={sidebarOpen} onToggleSidebar={handleSidebarClose} />

        {/* Calendar View with Smooth Margin Transition */}
        <Box
          className="print-only"
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
          {/* Print-only Header */}
          <Box
            sx={{
              display: 'none',
              '@media print': { display: 'block' },
              padding: 2,
              borderBottom: '1px solid black',
              marginBottom: 2,
              backgroundColor: 'white',
            }}
          >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, color: 'black' }}>
            <Typography variant="body1">
              <strong>{t('sidebar.semester', 'Semester')}:</strong> {selectedSemester?.name || 'N/A'}
            </Typography>
            {/* Course View */}
            {selectedTimetable === 'course' && (
              <>
                <Typography variant="body1">
                  <strong>{t('sidebar.selection.course.studyCourse', 'Study Course')}:</strong> {selectedStudyCourse?.name || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>{t('sidebar.selection.course.studyGroup', 'Study Group')}:</strong> {selectedStudyGroup?.name || 'N/A'}
                </Typography>
              </>
            )}
            {/* Room View */}
            {selectedTimetable === 'room' && (
              <>
                <Typography variant="body1">
                  <strong>{t('sidebar.selection.room.location', 'Room')}:</strong> {selectedLocation?.shortName || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>{t('sidebar.selection.room.title', 'Location')}:</strong> {selectedRoom?.shortName || 'N/A'}
                </Typography>
              </>
            )}
          </Box>
        </Box>
        <Box
          sx={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              p: isMobile ? 0 : 2,
              pl: sidebarOpen || isMobile ? 0 : 2,
              borderRadius: { xs: 0, md: 4 },
            }}
          >
          <CalendarWidget
            selectedDate={selectedDate}
            view={isMobile ? 'day' : 'week'}
            onDateChange={handleCalendarDateChange}
            events={events}
            showDates={showDates}
          />
        </Box>
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