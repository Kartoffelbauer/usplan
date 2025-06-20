import { useState } from 'react'
import { Divider } from '@mui/material'
import Spacer from '../../ui/Spacer'
import SidebarWrapper from '../../layout/SidebarWrapper';
import SemesterSelectorWidget from '../../widgets/SemesterSelectorWidget';
import LectureSelectorWidget from '../../widgets/LectureSelectorWidget';
import ExportTimetableWidget from '../../widgets/ExportTimetableWidget';
import ColorSchemeLegendWidget from '../../widgets/ColorSchemeLegendWidget'
import AddLectureDialogWidget from '../../widgets/AddLectureDialogWidget';

/**
 * Sidebar component that provides controls for timetable configuration
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.sidebarOpen - Whether the sidebar is open
 * @param {Function} props.onToggleSidebar - Function to toggle sidebar visibility
 * @returns {JSX.Element} The rendered sidebar with configuration options
 */
export default function ConfiguratorSidebar({sidebarOpen, onToggleSidebar}) {
  const lectures = [ {id: 243242, semester: 'SEB1', name: 'Grundlagen Verteilter Systeme'}, {id: 234243, semester: 'SEB2', name: 'Interaktive Programme'}] // Replace with actual lectures data from context or props
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAddLecture = () => {
    setDialogOpen(true);
    // Logic to add a lecture
  }
  const handleClearLectures = () => {
    // Logic to clear all lectures
  }
  const handleRemoveLecture = (id) => {
    // Logic to remove a single lecture by id
  }

  const handleAddLectures = (selectedLectures) => {
    // Logic to add multiple lectures from the dialog
    console.log('Selected Lectures:', selectedLectures);
    setDialogOpen(false);
  }

  return (
    <SidebarWrapper sidebarOpen={sidebarOpen} onToggleSidebar={onToggleSidebar}>
      {/* Semester Selection */}
      <SemesterSelectorWidget />

      { /* Lecture Selection */}
      <LectureSelectorWidget
        lectures={lectures}
        onAdd={handleAddLecture}
        onClear={handleClearLectures}
        onRemove={handleRemoveLecture}
      />

      {/* Section Divider */}
      <Divider />

      {/* Export Options */}
      <ExportTimetableWidget />

      { /* Spacer for layout consistency */ }
      <Spacer />

      { /* Color Scheme Legend */ }
      <ColorSchemeLegendWidget />

      {/* Add lectures with this dialog */}
      <AddLectureDialogWidget
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAddLectures}
      />
    </SidebarWrapper>
  )
}