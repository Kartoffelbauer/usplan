import { useEffect, useState, useCallback } from 'react'
import { Box } from '@mui/material'
import { addMinutes, parseISO } from 'date-fns'
import { useCheckMobile } from '../../utils/themeUtils'
import { useTimetable } from '../../context/TimetableContext'
import { getCurrentWeekday, eachNthWeekOfInterval, mapToCurrentWeek } from '../../utils/dateFnsUtils'
import PrintOnlyHeaderWidget from '../widgets/PrintOnlyHeaderWidget'
import CalendarWidget from '../widgets/CalendarWidget'

/**
 * TimetableLayout component that manages the sidebar and calendar view
 * Handles timetable data transformation and responsive layout
 * 
 * @param {Object} props - Component props
 * @param {Date} props.selectedDate - Currently selected date
 * @param {Function} props.onDateChange - Date change handler
 * @param {boolean} props.sidebarOpen - Sidebar open state
 * @param {boolean} props.showDates - Whether to show dates in calendar
 * @param {boolean} props.showSpecials - Whether to show special events
 * @returns {JSX.Element} The rendered timetable section
 */
export default function TimetableLayout({
  selectedDate,
  onDateChange,
  sidebarOpen,
  showDates,
  showSpecials,
}) {
  const isMobile = useCheckMobile()
  const {
    selectedSemester,
    timetable,
  } = useTimetable()

  // State to hold transformed calendar events
  const [events, setEvents] = useState([])

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
    start,
    end,
    lecture: event.orglectureName,
    rooms: event.roomNames,
    lecturers: event.lecturerNames,
    studyGroups: event.planningGroupNames,
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
    const events = []

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
        events.push(eventObj)
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
          events.push(eventObj)
        })
      }
    })

    setEvents(events)
  }, [timetable, selectedSemester, showDates, showSpecials, getWeekInterval, createEvent])

  return (
    <Box
      className="show-print"
      sx={{
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        height: '100%',
        p: isMobile ? 0 : 2,
        pl: 0
      }}
    >
      {/* Print-only Header */}
      <PrintOnlyHeaderWidget />

      { /* The Calendar Widget itself */ }
      <CalendarWidget
        selectedDate={selectedDate}
        view={isMobile ? 'day' : 'week'}
        onDateChange={handleCalendarDateChange}
        events={events}
        showDates={showDates}
      />
    </Box>
  )
}