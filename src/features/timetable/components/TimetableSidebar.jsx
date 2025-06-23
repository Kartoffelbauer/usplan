import { Divider } from '@mui/material'
import Spacer from '../../../shared/components/ui/Spacer'
import SidebarWrapper from '../../../shared/components/layouts/SidebarWrapper';
import SemesterSelectorWidget from '../../../shared/components/widgets/SemesterSelectorWidget'
import TimetableFilterWidget from './TimetableFilterWidget'
import ExportTimetableWidget from '../../../shared/components/widgets/ExportTimetableWidget'
import ColorSchemeLegendWidget from '../../../shared/components/widgets/ColorSchemeLegendWidget'

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