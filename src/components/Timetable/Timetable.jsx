import React, { useEffect, useState, useCallback } from 'react'
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material'
import Sidebar from './Sidebar'
import SidebarDrawer from '../../layout/SidebarDrawer'
import CalendarWidget from './CalendarWidget'
import { useTimetableData } from '../../hooks/useTimetableData'
import { eachWeekOfInterval, addMinutes, parseISO, add, parse } from 'date-fns';

export default function Timetable({
  selectedDate,
  onDateChange,
  view,
  onView,
  sidebarOpen,
  onToggleSidebar,
  onSidebarDateSelect,
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Shared selection state
  const [selectedSemester, setSelectedSemester] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [events, setEvents] = useState([])

  // Fetch data based on selection
  const {
    semesters,
    programs,
    groups,
    timetable,
    loading,
    error,
  } = useTimetableData(selectedSemester, selectedProgram, selectedGroup)

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
    <Box display="flex" flexGrow={1} overflow="hidden" width="100%">
      {/* Desktop Sidebar */}
      {!isMobile && sidebarOpen && (
        <Box
          sx={{
            width: 300,
            flexShrink: 0,
            backgroundColor: theme.palette.grey[200],
          }}
        >
          <Sidebar
            semesters={semesters}
            programs={programs}
            groups={groups}
            selectedSemester={selectedSemester}
            selectedProgram={selectedProgram}
            selectedGroup={selectedGroup}
            setSelectedSemester={setSelectedSemester}
            setSelectedProgram={setSelectedProgram}
            setSelectedGroup={setSelectedGroup}
            loading={loading}
            error={error}
            onDateSelect={onSidebarDateSelect}
          />
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
              backgroundColor: theme.palette.grey[200],
              border: 'none',
            },
          }}
        >
          <SidebarDrawer onDateSelect={onSidebarDateSelect} />
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