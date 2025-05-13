import React from 'react'
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material'
import Sidebar from './Sidebar'
import SidebarDrawer from '../../layout/SidebarDrawer'
import CalendarWidget from './CalendarWidget'

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
          <Sidebar onDateSelect={onSidebarDateSelect} />
        </Box>
      )}

      {/* Mobile Drawer Sidebar */}
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

      {/* Calendar Widget always visible */}
      <CalendarWidget
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        view={view}
        onView={onView}
      />
    </Box>
  )
}
