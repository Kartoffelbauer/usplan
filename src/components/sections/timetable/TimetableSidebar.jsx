import { Divider } from '@mui/material'
import Spacer from '../../ui/Spacer'
import SidebarWrapper from '../../layout/SidebarWrapper';
import SemesterSelectorWidget from '../../widgets/SemesterSelectorWidget'
import TimetableFilterWidget from '../../widgets/TimetableFilterWidget'
import ExportTimetableWidget from '../../widgets/ExportTimetableWidget'
import ColorSchemeLegendWidget from '../../widgets/ColorSchemeLegendWidget'

/**
 * Sidebar component that provides controls for displaying and exporting the timetable
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.sidebarOpen - Whether the sidebar is currently open
 * @param {Function} props.onToggleSidebar - Function to toggle the sidebar visibility
 * @returns {JSX.Element} The rendered sidebar component
 */
export default function TimetableSidebar({sidebarOpen, onToggleSidebar}) {
  return (
    <SidebarWrapper sidebarOpen={sidebarOpen} onToggleSidebar={onToggleSidebar}>
      {/* Semester Selection */}
      <SemesterSelectorWidget />

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
    </SidebarWrapper>
  )
}