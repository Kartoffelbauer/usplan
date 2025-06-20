import {
  Box,
  Divider,
} from '@mui/material'
import SemesterSelectWidget from '../../widgets/SemesterSelectWidget';
import ExportOptionsWidget from '../../widgets/ExportOptionsWidget';
import ColorSchemeLegendWidget from '../../widgets/ColorSchemeLegendWidget'

/**
 * Sidebar component that provides timetable configuration controls
 * Handles semester, study course, and study group selection
 * Includes export functionality and view mode toggle
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

      {/* Section Divider */}
      <Divider />

      {/* Export Options */}
      <ExportOptionsWidget />

      { /* Section Divider */}
      <Box sx={{ flexGrow: 1 }} />

      { /* Color Scheme Legend */ }
      <ColorSchemeLegendWidget />
    </Box>
  )
}