import { Box, Divider } from '@mui/material'
import Spacer from '../../ui/Spacer'
import SemesterSelectWidget from '../../widgets/SemesterSelectWidget';
import LectureSelectorWidget from '../../widgets/LectureSelectorWidget';
import ExportTimetableWidget from '../../widgets/ExportTimetableWidget';
import ColorSchemeLegendWidget from '../../widgets/ColorSchemeLegendWidget'

/**
 * Sidebar component that provides controls for timetable configuration
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

      { /* Lecture Selection */}
      <LectureSelectorWidget />

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