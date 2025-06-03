import { useState, useCallback } from 'react'
import {
  Box,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
} from '@mui/material'
import { addDays, addWeeks } from 'date-fns'
import Navbar from './Navbar'
import TimetableSection from '../components/TimetableSection/TimetableSection'
import RoomSearchSection from '../components/RoomSearchSection'
import ConfiguratorSection from '../components/ConfiguratorSection'

function TabPanel({ children, value, index }) {
  return value === index ? (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {children}
    </Box>
  ) : null
}

export default function MainLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Global state
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [tabIndex, setTabIndex] = useState(0)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState('week')

  // Sidebar toggle (hamburger)
  const handleToggleSidebar = () => setSidebarOpen((o) => !o)

  // Tab selection
  const handleTabChange = (_, v) => setTabIndex(v)

  // Calendar navigation
  const handleToday      = () => setSelectedDate(new Date())
  const handlePrev       = () => setSelectedDate((d) => isMobile ? addDays(d, -1) : addWeeks(d, -1))
  const handleNext       = () => setSelectedDate((d) => isMobile ? addDays(d, 1) : addWeeks(d, 1))
  const handleDateChange = (date) => setSelectedDate(date)
  const handleViewChange = (v)    => setView(v)

  // Sidebar date pick callback (also closes on mobile)
  const handleSidebarDate = useCallback(
    (date) => {
      setSelectedDate(date)
      if (isMobile) setSidebarOpen(false)
    },
    [isMobile]
  )

  return (
    <Box display="flex" flexDirection="column" height="100vh" width="100vw" overflow="hidden">
      <Navbar
        onMenuClick={handleToggleSidebar}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        onToday={handleToday}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          justifyContent: 'flex-start',
          backgroundColor: theme.palette.background.secondary,
          borderBottom: 'none',
        }}
      >
        <Tab label="Timetable" />
        <Tab label="Room Search" />
        <Tab label="Configure Timetable" />
      </Tabs>

      <Box display="flex" flexGrow={1} width="100%" overflow="hidden">
        <TabPanel value={tabIndex} index={0}>
          <TimetableSection
            selectedDate={selectedDate}
            onDateChange={handleSidebarDate}
            view={view}
            onView={handleViewChange}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={handleToggleSidebar}
            onSidebarDateSelect={handleSidebarDate}
          />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <RoomSearchSection />
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <ConfiguratorSection />
        </TabPanel>
      </Box>
    </Box>
  )
}
