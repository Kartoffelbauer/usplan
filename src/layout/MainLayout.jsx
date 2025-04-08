import { useState, useCallback } from 'react'
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material'
import Navbar from './Navbar'
import Sidebar from '../components/Sidebar'
import SidebarDrawer from './SidebarDrawer'

export default function MainLayout({ selectedDate, setSelectedDate, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date)
    if (isMobile) setDrawerOpen(false)
  }, [setSelectedDate, isMobile])

  const handleDrawerToggle = () => setDrawerOpen(prev => !prev)

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Navbar onMenuClick={handleDrawerToggle} />

      <Box display="flex" flexGrow={1} overflow="hidden" width="100%">
        {!isMobile && (
          <Box
            sx={{
              borderRight: '1px solid #eee',
              height: '100%',
            }}
          >
          <Sidebar onDateSelect={handleDateSelect} />
          </Box>
        )}

        <Drawer
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: 350 },
          }}
        >
          <SidebarDrawer onDateSelect={handleDateSelect} />
        </Drawer>

        <Box flexGrow={1} minWidth={0} display="flex" flexDirection="column">
          {children(selectedDate, setSelectedDate)}
        </Box>
      </Box>
    </Box>
  )
}