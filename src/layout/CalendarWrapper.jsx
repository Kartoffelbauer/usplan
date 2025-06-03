import { useTheme } from '@mui/material/styles'
import { Box } from '@mui/material'

export default function CalendarWrapper({ children }) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRadius: 4,
        p: 2,
        height: '100%',
        transition: 'all 0.3s ease-in-out',

        // Change text color of calendar events
        '& .rbc-event-content, & .rbc-event-label': {
          color: theme.palette.text.primary,
        },

        // Change background color of the current day
       '& .rbc-today': {
          backgroundColor: theme.palette.action.selected,
        },
        // Remove outer border
        '& .rbc-time-view': {
            borderColor: theme.palette.divider,
            borderTop: 'none !important',
            borderBottom: 'none !important',
            borderLeft: 'none !important',
        },

        // Change color of grid lines
        '& .rbc-timeslot-group, & .rbc-day-bg, & .rbc-time-content, & .rbc-time-header-content': {
            borderColor: theme.palette.divider,
        },

        // Remove borders inbetween hours
        '& .rbc-header, & .rbc-time-slot, & .rbc-events-container': {
            border: 'none !important',
        },

        // Change current time indicator color
        '& .rbc-current-time-indicator': {
            backgroundColor: theme.palette.primary.main,
        },

        // Adapt events inside the calendar
        '& .rbc-event': {
            borderColor: theme.palette.divider,
            outline: 'none !important',
            cursor: 'default !important',
        },
      }}
    >
      {children}
    </Box>
  )
}
