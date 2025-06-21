import { useCallback } from 'react'
import {
  Box,
  useTheme, 
  Divider,
  Autocomplete,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import RoomIcon from '@mui/icons-material/Room'
import { useTranslation } from 'react-i18next'
import { useTimetable } from '../../context/TimetableContext'

/**
 * Widget for filtering the timetable
 * Allows users to switch between course and room views
 * Provides selection for study courses, study groups, locations, and rooms
 */
export default function TimetableFilterWidget() {
  const theme = useTheme()
  const { t } = useTranslation()
  const {
    locations,
    studyCourses,
    studyGroups,
    rooms,
    selectedLocation,
    selectedSemester,
    selectedStudyCourse,
    selectedStudyGroup,
    selectedRoom,
    selectedTimetable,
    setSelectedLocation,
    setSelectedStudyCourse,
    setSelectedStudyGroup,
    setSelectedRoom,
    setSelectedTimetable,
    loading,
    error,
  } = useTimetable()

  // ==================== EVENT HANDLERS ====================

  /**
   * Handles timetable selection change
   * Updates the selected timetable view (course or room)
   * @param {Event} _ - The toggle button group event (unused)
   * @param {string} newValue - The new selected timetable value ('course' or 'room')
   */
  const handleSelectionChange = useCallback((_, newValue) => {
    if (newValue) {
      setSelectedTimetable(newValue)
    }
  }, [setSelectedTimetable])

  /**
   * Handles study course selection change
   * Resets study group selection when course changes
   * @param {Event} _ - The autocomplete event (unused)
   * @param {Object|null} newValue - The selected study course object or null
   */
  const handleStudyCourseChange = useCallback((_, newValue) => {
    setSelectedStudyCourse(newValue)
    setSelectedStudyGroup(null)
  }, [setSelectedStudyCourse, setSelectedStudyGroup])

  /**
   * Handles study group selection change
   * @param {Event} _ - The autocomplete event (unused)
   * @param {Object|null} newValue - The selected study group object or null
   */
  const handleStudyGroupChange = useCallback((_, newValue) => {
    setSelectedStudyGroup(newValue)
  }, [setSelectedStudyGroup])

  /**
   * Handles location selection change
   * Resets room selection when location changes
   * @param {Event} _ - The autocomplete event (unused)
   * @param {Object|null} newValue - The selected location object or null
   */
  const handleLocationChange = useCallback((_, newValue) => {
    setSelectedLocation(newValue)
    setSelectedRoom(null)
  }, [setSelectedLocation, setSelectedRoom])

  /**
   * Handles room selection change
   * @param {Event} _ - The autocomplete event (unused)
   * @param {Object|null} newValue - The selected room object or null
   */
  const handleRoomChange = useCallback((_, newValue) => {
    setSelectedRoom(newValue)
  }, [setSelectedRoom])

  // ==================== RENDER HELPERS ====================

  /**
   * Renders a study course option with short name and full name
   * @param {Object} props - The option props from Autocomplete
   * @param {Object} option - The study course object
   * @returns {JSX.Element} The rendered option
   */
  const renderStudyCourseOption = useCallback((props, option) => {
    const { key, ...rest } = props
    return (
      <li 
        key={option.id} 
        {...rest} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          minWidth: 0, 
          whiteSpace: 'nowrap' 
        }}
      >
        {/* Primary course identifier */}
        <span>{option.shortName}</span>
        {/* Secondary full name with muted styling */}
        <span
          style={{
            color: theme.palette.text.secondary,
            marginLeft: theme.spacing(1),
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          – {option.name}
        </span>
      </li>
    )
  }, [theme])

  // ==================== RENDER ====================

  return (
    <>
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

      {/* Section Divider */}
      <Divider />

      {/* Course View - Study Course and Study Group Selection */}
      {selectedTimetable === 'course' && (
        <>
          {/* Study Course Selection */}
          <Autocomplete
            fullWidth
            size="small"
            disabled={!selectedSemester || loading.studyCourses || error}
            options={studyCourses || []}
            getOptionLabel={(option) => `${option.shortName} - ${option.name}`}
            value={selectedStudyCourse}
            onChange={handleStudyCourseChange}
            renderOption={renderStudyCourseOption}
            renderInput={(params) => (
              <TextField {...params} label={t('sidebar.selection.course.studyCourse')} variant="outlined" />
            )}
          />

          {/* Study Group Selection */}
          <Autocomplete
            fullWidth
            size="small"
            disabled={!selectedSemester || !selectedStudyCourse || loading.studyGroups || error}
            options={studyGroups || []}
            getOptionLabel={(option) => option.shortName}
            value={selectedStudyGroup}
            onChange={handleStudyGroupChange}
            renderInput={(params) => (
              <TextField {...params} label={t('sidebar.selection.course.studyGroup')} variant="outlined" />
            )}
          />
        </>
      )}

      {/* Room View - Location and Room Selection */}
      {selectedTimetable === 'room' && (
        <>
          {/* Location Selection */}
          <Autocomplete
            fullWidth
            size="small"
            disabled={!selectedSemester || loading.locations || error}
            options={locations || []}
            getOptionLabel={(option) => option.shortName}
            value={selectedLocation}
            onChange={handleLocationChange}
            renderInput={(params) => (
              <TextField {...params} label={t('sidebar.selection.room.location')} variant="outlined" />
            )}
          />

          {/* Room Selection */}
          <Autocomplete
            fullWidth
            size="small"
            disabled={!selectedSemester || !selectedLocation || loading.rooms || error}
            options={rooms || []}
            getOptionLabel={(option) => option.shortName}
            value={selectedRoom}
            onChange={handleRoomChange}
            renderInput={(params) => (
              <TextField {...params} label={t('sidebar.selection.room.title')} variant="outlined" />
            )}
          />
        </>
      )}
    </>
  )
}