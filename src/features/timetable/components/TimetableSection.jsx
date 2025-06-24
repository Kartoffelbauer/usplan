import { Box } from '@mui/material'
import TimetableLayout from '../../../shared/components/layouts/TimetableLayout'
import TimetableSidebar from './TimetableSidebar'

/**
 * TimetableSection component that manages the sidebar and calendar view
 * Handles timetable data transformation and responsive layout
 * 
 * @param {Object} props - Component props
 * @param {Date} props.selectedDate - Currently selected date
 * @param {Function} props.onDateChange - Date change handler
 * @param {boolean} props.sidebarOpen - Sidebar open state
 * @param {Function} props.onToggleSidebar - Sidebar toggle handler
 * @param {boolean} props.showDates - Whether to show dates in calendar
 * @param {boolean} props.showSpecials - Whether to show special events
 * @returns {JSX.Element} The rendered timetable section
 */
export default function TimetableSection({
  selectedDate,
  onDateChange,
  sidebarOpen,
  onToggleSidebar,
  showDates,
  showSpecials,
}) {
  return (
  <Box display="flex" flexGrow={1}>
      {/* Sidebar for navigation */}
      <TimetableSidebar sidebarOpen={sidebarOpen} onToggleSidebar={onToggleSidebar} />

      {/* Timetable View */}
      <TimetableLayout
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        sidebarOpen={sidebarOpen}
        showDates={showDates}
        showSpecials={showSpecials}
      />
    </Box>
  )
}