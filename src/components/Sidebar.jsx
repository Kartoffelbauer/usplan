import { Box, Typography, Divider } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useState } from 'react'

export default function Sidebar({ onDateSelect }) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <Box
      width={350}
      p={2}
      sx={{ borderRight: '1px solid #eee', height: '100%' }}
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Typography variant="h6" display="flex" alignItems="center" gap={1}>
        <CalendarMonthIcon /> Calendar
      </Typography>

      <Divider />

      {/* Month Grid */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          openTo="day"
          value={selectedDate}
          onChange={(newValue) => {
            setSelectedDate(newValue)
            onDateSelect(newValue) // 🔁 Notify parent layout
          }}
        />
      </LocalizationProvider>
    </Box>
  )
}