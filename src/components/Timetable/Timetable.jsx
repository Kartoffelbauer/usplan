import React, { useEffect, useState, useCallback } from 'react'
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material'
import Sidebar from './Sidebar'
import SidebarDrawer from '../../layout/SidebarDrawer'
import CalendarWidget from './CalendarWidget'
import { useTimetableData } from '../../hooks/useTimetableData'

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
    if (timetable === undefined) return

    const transformed = timetable.happenings.map((item) => {
      if (item.singularDate && item.singularDate instanceof String) {
        const [year, month, day] = item.singularDate.split('-').map(Number)
        const start = new Date(year, month - 1, day, 0, item.beginMinute)
        const end = new Date(year, month - 1, day, 0, item.endMinute)
        console.log("title", item.orglectureName)
        return {
          title: item.orglectureName,
          start,
          end,
          location: item.roomNames,
        }
      }
    })

    setEvents(transformed)
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
