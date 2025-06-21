import { Box, Divider } from '@mui/material'
import Spacer from '../../ui/Spacer'
import SemesterSelectWidget from '../../widgets/SemesterSelectWidget'
import TimetableFilterWidget from '../../widgets/TimetableFilterWidget'
import ExportTimetableWidget from '../../widgets/ExportTimetableWidget'
import ColorSchemeLegendWidget from '../../widgets/ColorSchemeLegendWidget'

/**
 * Sidebar component that provides controls for displaying and exporting the timetable
 * 
 * @returns {JSX.Element} The rendered sidebar component
 */
export default function Sidebar() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        boxSizing: 'border-box',
        p: 2,
        pt: 4,
      }}
    >
      {/* Semester Selection */}
      <SemesterSelectWidget />

      {/* Filter Options */}
      <TimetableFilterWidget />

      {/* Section Divider */}
      <Divider />

      {/* Export Options */}
      <ExportTimetableWidget />

      { /* Spacer for layout consistency */ }
      <Spacer />

      { /* Color Scheme Legend */ }
      <ColorSchemeLegendWidget />
    </Box>
  )
}