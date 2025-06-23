import { useCallback } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { useTimetable } from '../../context/TimetableContext'

/**
 * StudyCourseSelectWidget component for selecting a study course.
 *
 * @returns {JSX.Element} The rendered study course select widget
 */
export default function StudyCourseSelectWidget() {
  const theme = useTheme()
  const { t } = useTranslation()
  const {
    selectedSemester,
    studyCourses,
    selectedStudyCourse,
    loading,
    error,
    setSelectedStudyCourse,
    setSelectedStudyGroup,
  } = useTimetable()

  const handleStudyCourseChange = useCallback((_, newValue) => {
    setSelectedStudyCourse(newValue)
    setSelectedStudyGroup(null)
  }, [setSelectedStudyCourse, setSelectedStudyGroup])

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
          whiteSpace: 'nowrap',
        }}
      >
        <span>{option.shortName}</span>
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

  return (
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
  )
}