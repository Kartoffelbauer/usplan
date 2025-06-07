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
  CircularProgress,
} from '@mui/material'
import RoomIcon from '@mui/icons-material/Room'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import PrintIcon from '@mui/icons-material/Print'
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
  
  // Add loading state for PDF generation
  const [generatingPDF, setGeneratingPDF] = React.useState(false)
  
  // Timetable context state and actions
  const {
    semesters,           // Available semesters list
    studyCourses,        // Available study courses for selected semester
    studyGroups,         // Available study groups for selected course
    timetable,           // Current timetable data
    selectedSemester,    // Currently selected semester object
    setSelectedSemester,
    selectedStudyCourse, // Currently selected study course object
    setSelectedStudyCourse,
    selectedStudyGroup,  // Currently selected study group object
    setSelectedStudyGroup,
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
    const semesterId = event.target.value
    const semesterObject = semesters.find(sem => sem.id === semesterId)
    setSelectedSemester(semesterObject || null)
    // Clear dependent selections when semester changes
    setSelectedStudyCourse(null)
    setSelectedStudyGroup(null)
  }, [semesters, setSelectedSemester, setSelectedStudyCourse, setSelectedStudyGroup])

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
   * Dummy implementation for PDF export functionality
   */
  const onExportPDF = useCallback(async () => {
    try {
      setGeneratingPDF(true)
      console.log('PDF export triggered with the following details:')
      console.log('Semester:', selectedSemester?.name || 'N/A')
      console.log('Study Course:', selectedStudyCourse?.name || 'N/A')
      console.log('Study Group:', selectedStudyGroup?.shortName || 'N/A')
    } catch (error) {
      console.error('Failed to export PDF:', error)
    } finally {
      setGeneratingPDF(false)
    }
  }, [selectedSemester, selectedStudyCourse, selectedStudyGroup])

  /**
   * Print functionality
   */
  const onPrint = useCallback(() => {
    window.print()
  }, [selectedSemester, selectedStudyCourse, selectedStudyGroup])

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
        <InputLabel id="semester-label">{t('sidebar.semester')}</InputLabel>
        <Select
          labelId="semester-label"
          value={selectedSemester?.id || ''}
          label="Semester"
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
        disabled={!selectedSemester || loading.studyCourses || error}
        options={studyCourses}
        getOptionLabel={(option) => `${option.shortName} - ${option.name}`}
        value={selectedStudyCourse}
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
        disabled={!selectedSemester || !selectedStudyCourse || loading.studyGroups || error}
        options={studyGroups}
        getOptionLabel={(option) => option.shortName}
        value={selectedStudyGroup}
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
            onClick={onPrint}
            disabled={!timetable}
            startIcon={<PrintIcon fontSize="small" />}
          >
            {t('sidebar.export.print')}
          </Button>
          <Button
            onClick={onExportPDF}
            disabled={!timetable || generatingPDF}
            startIcon={
              generatingPDF ? 
                <CircularProgress size={16} /> : 
                <PictureAsPdfIcon fontSize="small" />
            }
          >
            {generatingPDF ? t('sidebar.export.pdf.generating') : t('sidebar.export.pdf.title')}
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  )
}