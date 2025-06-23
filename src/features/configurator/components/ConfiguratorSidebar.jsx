import { Divider } from '@mui/material'
import Spacer from '../../../shared/components/ui/Spacer'
import SidebarWrapper from '../../../shared/components/layouts/SidebarWrapper';
import SemesterSelectWidget from '../../../shared/components/widgets/SemesterSelectWidget';
import LectureSelectWidget from './widgets/LectureSelectWidget';
import ExportTimetableWidget from '../../../shared/components/widgets/ExportTimetableWidget';
import ColorSchemeLegendWidget from '../../../shared/components/widgets/ColorSchemeLegendWidget'

/**
 * Sidebar component that provides controls for timetable configuration
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.sidebarOpen - Whether the sidebar is open
 * @param {Function} props.onToggleSidebar - Function to toggle sidebar visibility
 * @returns {JSX.Element} The rendered sidebar with configuration options
 */
export default function ConfiguratorSidebar({sidebarOpen, onToggleSidebar}) {
  return (
    <SidebarWrapper sidebarOpen={sidebarOpen} onToggleSidebar={onToggleSidebar}>
      {/* Semester Selection */}
      <SemesterSelectWidget />

      { /* Lecture Selection */}
      <LectureSelectWidget />

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