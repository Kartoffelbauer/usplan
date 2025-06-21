import { Divider } from '@mui/material'
import Spacer from '../../ui/Spacer'
import SidebarWrapper from '../../layout/SidebarWrapper';
import SemesterSelectorWidget from '../../widgets/SemesterSelectorWidget';
import LectureSelectorWidget from '../../widgets/LectureSelectorWidget';
import ExportTimetableWidget from '../../widgets/ExportTimetableWidget';
import ColorSchemeLegendWidget from '../../widgets/ColorSchemeLegendWidget'

/**
 * Sidebar component that provides controls for timetable configuration
 * 
 * @param {boolean} sidebarOpen - Sidebar open state
 * @param {Function} onToggleSidebar - Sidebar toggle handler
 * @returns {JSX.Element} The rendered sidebar component
 */
export default function Sidebar(sidebarOpen, onToggleSidebar,) {
  return (
    <SidebarWrapper sidebarOpen={sidebarOpen} onToggleSidebar={onToggleSidebar}>
      {/* Semester Selection */}
      <SemesterSelectorWidget />

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
    </SidebarWrapper>
  )
}