import { useTranslation } from 'react-i18next'
import React, { useCallback } from 'react'
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  ButtonGroup,
  Button,
  Autocomplete,
  TextField,
  useTheme,
} from '@mui/material'
import RoomIcon from '@mui/icons-material/Room'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import { useTimetable } from '../../context/TimetableContext'

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
  
  // ==================== STATE ====================
  
  // Local state for view mode toggle (course/room)
  const [viewMode, setViewMode] = React.useState('course')
  
  // Timetable context state and actions
  const {
    semesters,           // Available semesters list
    studyCourses,        // Available study courses for selected semester
    studyGroups,         // Available study groups for selected course
    selectedSemesterId,  // Currently selected semester ID
    setSelectedSemesterId,
    selectedStudyCourseId, // Currently selected study course ID
    setSelectedStudyCourseId,
    selectedStudyGroupId,  // Currently selected study group ID
    setSelectedStudyGroupId,
    loading,             // Loading states for async operations
    error,               // Error state
  } = useTimetable()

  // ==================== EVENT HANDLERS ====================

  /**
   * Handles semester selection change
   * Resets dependent selections (study course and group) when semester changes
   * @param {Event} event - The select change event
   */
  const handleSemesterChange = useCallback((event) => {
    const newSemesterId = event.target.value
    setSelectedSemesterId(newSemesterId)
    // Clear dependent selections when semester changes
    setSelectedStudyCourseId('')
    setSelectedStudyGroupId('')
  }, [setSelectedSemesterId, setSelectedStudyCourseId, setSelectedStudyGroupId])

  /**
   * Handles study course selection change
   * Resets study group selection when course changes
   * @param {Event} _ - The autocomplete event (unused)
   * @param {Object|null} newValue - The selected study course object or null
   */
  const handleStudyCourseChange = useCallback((_, newValue) => {
    setSelectedStudyCourseId(newValue ? newValue.id : undefined)
    // Clear study group when course changes
    setSelectedStudyGroupId(undefined)
  }, [setSelectedStudyCourseId, setSelectedStudyGroupId])

  /**
   * Handles study group selection change
   * @param {Event} _ - The autocomplete event (unused)
   * @param {Object|null} newValue - The selected study group object or null
   */
  const handleStudyGroupChange = useCallback((_, newValue) => {
    setSelectedStudyGroupId(newValue ? newValue.id : undefined)
  }, [setSelectedStudyGroupId])

  /**
   * Handles view mode toggle between course and room view
   * @param {Event} _ - The toggle event (unused)
   * @param {string} newViewMode - The new view mode ('course' or 'room')
   */
  const handleViewModeChange = useCallback((_, newViewMode) => {
    // Only update if a valid option is selected (prevent deselection)
    if (newViewMode !== null) {
      setViewMode(newViewMode)
    }
  }, [])

  /**
   * Handles PDF export functionality
   * Currently logs to console - implement actual PDF generation
   */
  const handleExportPDF = useCallback(() => {
    console.log('Exporting to PDF...')
    // TODO: Implement PDF export functionality
  }, [])

  /**
   * Handles print functionality
   * Opens the browser's print dialog
   */
  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  // ==================== RENDER HELPERS ====================

  /**
   * Renders a semester menu item with short name and full name
   * @param {Object} semester - The semester object
   * @returns {JSX.Element} The rendered menu item
   */
  const renderSemesterMenuItem = useCallback((semester) => (
    <MenuItem 
      key={semester.id} 
      value={semester.id} 
      style={{ whiteSpace: 'nowrap' }}
    >
      {/* Primary semester identifier */}
      <span>{semester.shortName}</span>
      {/* Secondary full name with muted styling */}
      <span
        style={{
          color: theme.palette.text.secondary,
          marginLeft: theme.spacing(1),
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        - {semester.name}
      </span>
    </MenuItem>
  ), [theme])

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
      width="100%"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        boxSizing: 'border-box',
      }}
    >
      {/* Semester Selection */}
      <FormControl 
        fullWidth 
        size="small" 
        disabled={loading.semesters || error}
      >
        <InputLabel id="semester-label">semester</InputLabel>
        <Select
          labelId="semester-label"
          value={semesters.find((sem) => sem.id === selectedSemesterId)?.id || ''}
          label={t('sidebar.semester')}
          onChange={handleSemesterChange}
        >
          {semesters.map(renderSemesterMenuItem)}
        </Select>
      </FormControl>

      {/* View Mode Selection */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          {t('sidebar.selection.title')}
        </Typography>
        <ToggleButtonGroup
          fullWidth
          size="small"
          exclusive
          value={viewMode}
          onChange={handleViewModeChange}
        >
          <ToggleButton value="course">
            <CalendarMonthIcon fontSize="small" sx={{mr: 1}} />
            {t('sidebar.selection.course')}
          </ToggleButton>
          <ToggleButton value="room">
            <RoomIcon fontSize="small" sx={{mr: 1}} />
            {t('sidebar.selection.room')}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>


      {/* Section Divider */}
      <Divider />

      {/* Study Course Selection */}
      <Autocomplete
        fullWidth
        size="small"
        disabled={!selectedSemesterId || loading.studyCourses || error}
        options={studyCourses}
        getOptionLabel={(option) => `${option.shortName} - ${option.name}`}
        value={studyCourses.find((prog) => prog.id === selectedStudyCourseId) || null}
        onChange={handleStudyCourseChange}
        renderOption={renderStudyCourseOption}
        renderInput={(params) => (
          <TextField {...params} label={t('sidebar.studyProgram')} variant="outlined" />
        )}
      />

      {/* Study Group Selection */}
      <Autocomplete
        fullWidth
        size="small"
        disabled={!selectedSemesterId || !selectedStudyCourseId || loading.studyGroups || error}
        options={studyGroups}
        getOptionLabel={(option) => option.shortName}
        value={studyGroups.find((group) => group.id === selectedStudyGroupId) || null}
        onChange={handleStudyGroupChange}
        renderInput={(params) => (
          <TextField {...params} label={t('sidebar.group')} variant="outlined" />
        )}
      />

      {/* Section Divider */}
      <Divider />

      {/* Export Options */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          {t('sidebar.export.title')}
        </Typography>
        <ButtonGroup fullWidth variant="outlined">
          <Button
            onClick={handleExportPDF}
            startIcon={<PictureAsPdfIcon fontSize="small" />}
          >
            {t('sidebar.export.pdf')}</Button>
          <Button
            onClick={handlePrint}
            startIcon={<PrintIcon fontSize="small" />}
          >
            {t('sidebar.export.print')}
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  )
}
