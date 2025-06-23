import { useCallback } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTimetable } from '../../context/TimetableContext'

/**
 * StudyGroupSelectWidget component for selecting a study group.
 *
 * @returns {JSX.Element} The rendered study group select widget
 */
export default function StudyGroupSelectWidget() {
  const { t } = useTranslation()
  const {
    selectedSemester,
    studyGroups,
    selectedStudyCourse,
    selectedStudyGroup,
    loading,
    error,
    setSelectedStudyGroup,
  } = useTimetable()

  const handleStudyGroupChange = useCallback((_, newValue) => {
    setSelectedStudyGroup(newValue)
  }, [setSelectedStudyGroup])

  return (
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
  )
}