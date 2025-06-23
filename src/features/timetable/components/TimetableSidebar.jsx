import { Divider } from '@mui/material'
import Spacer from '../../../shared/components/ui/Spacer'
import SidebarWrapper from '../../../shared/components/layouts/SidebarWrapper';
import SemesterSelectWidget from '../../../shared/components/widgets/SemesterSelectWidget'
import ViewModeToggleWidget from './widgets/ViewModeToggleWidget'
import StudyCourseSelectWidget from '../../../shared/components/widgets/StudyCourseSelectWidget'
import StudyGroupSelectWidget from '../../../shared/components/widgets/StudyGroupSelectWidget'
import RoomFilterWidget from './widgets/RoomFilterWidget'
import ExportTimetableWidget from '../../../shared/components/widgets/ExportTimetableWidget'
import ColorSchemeLegendWidget from '../../../shared/components/widgets/ColorSchemeLegendWidget'
import { useTimetable } from '../../../shared/context/TimetableContext'

/**
 * Sidebar component that provides controls for displaying and exporting the timetable
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.sidebarOpen - Whether the sidebar is currently open
 * @param {Function} props.onToggleSidebar - Function to toggle the sidebar visibility
 * @returns {JSX.Element} The rendered sidebar component
 */
export default function TimetableSidebar({sidebarOpen, onToggleSidebar}) {
  const { selectedTimetable } = useTimetable()

  return (
    <SidebarWrapper sidebarOpen={sidebarOpen} onToggleSidebar={onToggleSidebar}>
      {/* Semester Selection */}
      <SemesterSelectWidget />

      {/* View Mode Selection */}
      <ViewModeToggleWidget />

      {/* Section Divider */}
      <Divider />

      {/* Study Course and Group Selection */}
      {selectedTimetable === 'course' ? (<><StudyCourseSelectWidget /><StudyGroupSelectWidget /></>) : <RoomFilterWidget /> }
      
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