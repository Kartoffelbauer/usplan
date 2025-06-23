import { useCallback } from 'react'
import { Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import RoomIcon from '@mui/icons-material/Room'
import { useTranslation } from 'react-i18next'
import { useTimetable } from '../../../../shared/context/TimetableContext'

/**
 * ViewModeToggleWidget component for selecting the timetable view mode.
 *
 * @returns {JSX.Element} The rendered view mode toggle widget
 */
export default function ViewModeToggleWidget() {
  const { t } = useTranslation()
  const { selectedTimetable, setSelectedTimetable } = useTimetable()

  const handleSelectionChange = useCallback((_, newValue) => {
    if (newValue) setSelectedTimetable(newValue)
  }, [setSelectedTimetable])

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {t('sidebar.selection.title', 'View Mode')}
      </Typography>
      <ToggleButtonGroup
        fullWidth
        size="small"
        exclusive
        value={selectedTimetable}
        onChange={handleSelectionChange}
      >
        <ToggleButton value="course">
          <CalendarMonthIcon fontSize="small" sx={{ mr: 1 }} />
          {t('sidebar.selection.course.title', 'Courses')}
        </ToggleButton>
        <ToggleButton value="room">
          <RoomIcon fontSize="small" sx={{ mr: 1 }} />
          {t('sidebar.selection.room.title', 'Rooms')}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}