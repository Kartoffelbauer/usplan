import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import {
  Box,
  Divider,
  Autocomplete,
  TextField,
  useTheme,
} from '@mui/material'
import { useTimetable } from '../../../context/TimetableContext'
import SemesterSelectWidget from '../../widgets/SemesterSelectWidget'
import ViewModeToggleWidget from '../../widgets/ViewModeToggleWidget'
import ExportOptionsWidget from '../../widgets/ExportOptionsWidget'
import ColorSchemeLegendWidget from '../../widgets/ColorSchemeLegendWidget'

/**
 * Sidebar component that provides timetable configuration controls
 * Handles semester, study course, and study group selection
 * Includes export functionality and view mode toggle
 * 
 * @returns {JSX.Element} The rendered sidebar component
 */
export default function Sidebar() {
  // Theme hook for consistent styling
  const theme = useTheme()
  const { t } = useTranslation()
  
  // Timetable context state and actions
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
    loading,
    error,
  } = useTimetable()

  // ==================== EVENT HANDLERS ====================

  /**
   * Handles study course selection change
   * Resets study group selection when course changes
   * @param {Event} _ - The autocomplete event (unused)
   * @param {Object|null} newValue - The selected study course object or null
   */
  const handleStudyCourseChange = useCallback((_, newValue) => {
    setSelectedStudyCourse(newValue)
    // Clear study group when course changes
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
    // Clear room when location changes
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

      {/* View Mode Selection */}
      <ViewModeToggleWidget />

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