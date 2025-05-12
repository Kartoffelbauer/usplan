import React, { useState } from 'react'
import {
  Box,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
} from '@mui/material'
import { addWeeks } from 'date-fns'
import Navbar from './Navbar'
import Timetable from '../components/Timetable/Timetable'
import RoomSearch from '../components/RoomSearch'
import TimetableConfigurator from '../components/TimetableConfigurator'

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

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState('week')
  const [tabIndex, setTabIndex] = useState(0)

  // calendar handlers
  const handleToday      = () => setSelectedDate(new Date())
  const handlePrev       = () => setSelectedDate((d) => addWeeks(d, -1))
  const handleNext       = () => setSelectedDate((d) => addWeeks(d,  1))
  const handleDateChange = (date) => setSelectedDate(date)
  const handleViewChange = (v)    => setView(v)

  const changeTab = (_, v) => setTabIndex(v)

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Navbar
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        onToday={handleToday}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <Tabs
        value={tabIndex}
        onChange={changeTab}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          justifyContent: 'flex-start',
          backgroundColor: theme.palette.grey[200],
          borderBottom: 'none',
        }}
      >
        <Tab label="Timetable" />
        <Tab label="Room Search" />
        <Tab label="Configure Timetable" />
      </Tabs>

      <Box display="flex" flexGrow={1} width="100%" overflow="hidden">
        <TabPanel value={tabIndex} index={0}>
          <Timetable
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            view={view}
            onView={handleViewChange}
          />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <RoomSearch />
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <TimetableConfigurator />
        </TabPanel>
      </Box>
    </Box>
  )
}
