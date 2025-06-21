import { useCallback } from 'react'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTimetable } from '../../context/TimetableContext'

/**
 * SemesterSelectorWidget component that allows users to select a semester
 * from a dropdown list. It updates the selected semester and resets
 * related selections (study course and group) when a new semester is chosen.
 */
export default function SemesterSelectorWidget() {
  const theme = useTheme()
  const { t } = useTranslation()

  const {
    semesters,
    selectedSemester,
    setSelectedSemester,
    setSelectedStudyCourse,
    setSelectedStudyGroup,
    loading,
    error,
  } = useTimetable()

  const handleSemesterChange = useCallback((event) => {
    const semesterId = event.target.value
    const semesterObject = semesters.find(sem => sem.id === semesterId)
    setSelectedSemester(semesterObject || null)
    setSelectedStudyCourse(null)
    setSelectedStudyGroup(null)
  }, [semesters, setSelectedSemester, setSelectedStudyCourse, setSelectedStudyGroup])

  const renderSemesterMenuItem = useCallback((semester) => (
    <MenuItem
      key={semester.id}
      value={semester.id}
      style={{ whiteSpace: 'nowrap' }}
    >
      <span>{semester.shortName}</span>
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

  return (
    <FormControl fullWidth size="small" disabled={loading.semesters || error}>
      <InputLabel id="semester-label">{t('sidebar.semester', 'Semester')}</InputLabel>
      <Select
        labelId="semester-label"
        value={selectedSemester?.id || ''}
        label={t('sidebar.semester', 'Semester')}
        onChange={handleSemesterChange}
      >
        {semesters.map(renderSemesterMenuItem)}
      </Select>
    </FormControl>
  )
}