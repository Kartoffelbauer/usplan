import { useEffect, useState } from 'react'
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material'
import { eachWeekOfInterval, addMinutes, parseISO } from 'date-fns';
import { useTimetable } from '../../context/TimetableContext'
import Sidebar from './Sidebar'
import CalendarWidget from './CalendarWidget'

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
  const { semesters, timetable, selectedSemester } = useTimetable()

  // Transform timetable into calendar events
  useEffect(() => {
    const currentSemester = semesters.find(semester => semester.id === selectedSemester)
    if (timetable === undefined || !currentSemester) return

    const semesterInertval = {
      start: new Date(currentSemester.beginOfLectureDate),
      end: new Date(currentSemester.endOfLectureDate),
    }
    const happenings = []

    timetable.happenings.forEach(item => {
      // Handle WEEK type
      if (item.type === 'WEEK') {
        // Get all weekdays for this semester
        eachWeekOfInterval(semesterInertval, { weekStartsOn: item.weekday + 1 })
        .forEach(weekday => {
          happenings.push({
            title: item.orglectureName,
            start: addMinutes(weekday, item.beginMinute),
            end: addMinutes(weekday, item.endMinute),
            location: item.roomNames,
          })
        })
      }
      // Handle SINGULAR type
      else {
        const date = (typeof item.singularDate === "string") ? parseISO(item.singularDate) : new Date(item.singularDate)

        happenings.push({
          title: item.orglectureName,
          start: addMinutes(date, item.beginMinute),
          end: addMinutes(date, item.endMinute),
          location: item.roomNames,
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