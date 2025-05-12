import { CssBaseline, Box } from '@mui/material'
import MainLayout from './layout/MainLayout'
import { useState } from 'react'
import './index.css'

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <>
      <CssBaseline />
      <Box sx={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <MainLayout selectedDate={selectedDate} setSelectedDate={setSelectedDate}>
          {(date, setDate) => (
            <CalendarApp selectedDate={date} onDateChange={setDate} />
          )}
        </MainLayout>
      </Box>
    </>
  )
}

export default App