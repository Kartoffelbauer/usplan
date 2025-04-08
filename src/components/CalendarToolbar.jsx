import { Box, Button, ButtonGroup, Typography } from '@mui/material'

export default function CalendarToolbar({ label, onNavigate, onView, view }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
      
      {/* Navigation Buttons */}
      <ButtonGroup variant="outlined">
        <Button onClick={() => onNavigate('TODAY')}>Today</Button>
        <Button onClick={() => onNavigate('PREV')}>‹</Button>
        <Button onClick={() => onNavigate('NEXT')}>›</Button>
      </ButtonGroup>

      {/* Label */}
      <Typography variant="h6" sx={{ mx: 2 }}>
        {label}
      </Typography>

      {/* View Buttons */}
      <ButtonGroup variant="outlined">
        {['week'].map((v) => (
          <Button
            key={v}
            onClick={() => onView(v)}
            variant={view === v ? 'contained' : 'outlined'}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  )
}