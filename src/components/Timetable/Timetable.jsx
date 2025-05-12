import React, { useState, useCallback } from 'react'
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material'
import Sidebar from './Sidebar'
import SidebarDrawer from '../../layout/SidebarDrawer'
import CalendarWidget from './CalendarWidget'
import sampleEvents from '../../data/sampleEvents'

export default function Timetable({
  selectedDate,
  onDateChange,
  view,
  onView,
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDrawer = () => setDrawerOpen((o) => !o)
  const handleDateSelect = useCallback(
    (date) => {
      onDateChange(date)
      if (isMobile) setDrawerOpen(false)
    },
    [onDateChange, isMobile]
  )

  return (
    <Box display="flex" flexGrow={1} overflow="hidden" width="100%">
      {!isMobile && (
        <Box
          sx={{
            width: 300,
            flexShrink: 0,
            backgroundColor: theme.palette.grey[200],
          }}
        >
          <Sidebar onDateSelect={handleDateSelect} />
        </Box>
      )}

      {isMobile && (
        <Drawer
          open={drawerOpen}
          onClose={toggleDrawer}
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
          <SidebarDrawer onDateSelect={handleDateSelect} />
        </Drawer>
      )}

      <CalendarWidget
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        view={view}
        onView={onView}
        events={sampleEvents}
      />
    </Box>
  )
}
