import { useTheme } from '@mui/material/styles'
import { Box } from '@mui/material'

export default function CalendarWrapper({ children }) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRadius: { xs: 0, md: 4 },
        p: 2,
        height: '100%',
        transition: 'all 0.3s ease-in-out',

        // Apply only to non-print media
        '@media not print': {
            // Change text color of calendar events
            '& .rbc-event-content, & .rbc-event-label': {
                color: theme.palette.text.primary,
            },

            // Change background color of today
            '& .rbc-today': {
                backgroundColor: theme.palette.action.selected,
            },

            // Change color of grid lines
            '& .rbc-timeslot-group, & .rbc-day-bg, & .rbc-time-content, & .rbc-time-header-content, & .rbc-time-view, & .rbc-event': {
                borderColor: theme.palette.divider,
            },

            // Change current time indicator color
            '& .rbc-current-time-indicator': {
                backgroundColor: theme.palette.primary.main,
            },
        },

        // Apply only to print media
        '@media print': {
            // Adapt events inside the calendar
            '& .rbc-event': {
                borderColor: theme.palette.grey[600],
            },
        },
        
        // Remove outer border
        '& .rbc-time-view': {
            borderTop: 'none',
            borderBottom: 'none',
            borderLeft: 'none',
        },

        // Remove borders inbetween hours
        '& .rbc-header, & .rbc-time-slot, & .rbc-events-container': {
            border: 'none',
        },

        // Adapt events inside the calendar
        '& .rbc-event': {
            outline: 'none',
            cursor: 'default',
        },
      }}
    >
      {children}
    </Box>
  )
}
