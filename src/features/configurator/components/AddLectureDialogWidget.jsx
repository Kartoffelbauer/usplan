import React, { useCallback } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Checkbox,
  Autocomplete,
  TextField,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTimetable } from '../../../shared/context/TimetableContext'

export default function AddLectureDialogWidget({ open, onClose, onAdd }) {
  const { t } = useTranslation()
  const {
    selectedSemester,
    studyCourses,
    studyGroups,
    selectedStudyCourse,
    selectedStudyGroup,
    setSelectedStudyCourse,
    setSelectedStudyGroup,
    timetable,
    loading,
    error,
  } = useTimetable()

  const handleStudyCourseChange = useCallback((_, newValue) => {
    setSelectedStudyCourse(newValue)
    setSelectedStudyGroup(null)
  }, [setSelectedStudyCourse, setSelectedStudyGroup])

  const handleStudyGroupChange = useCallback((_, newValue) => {
    setSelectedStudyGroup(newValue)
  }, [setSelectedStudyGroup])

  const renderStudyCourseOption = useCallback((props, option) => {
    const { key, ...rest } = props
    return (
      <li key={option.id} {...rest} style={{
        display: 'flex',
        alignItems: 'center',
        minWidth: 0,
        whiteSpace: 'nowrap',
      }}>
        <span>{option.shortName}</span>
        <span style={{
          color: '#888',
          marginLeft: 8,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          – {option.name}
        </span>
      </li>
    )
  }, [])

  const hasLectures = timetable?.happenings?.length > 0

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {t('sidebar.lectures.dialog.title', 'Add Lecture')}
      </DialogTitle>

      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxHeight: '70vh',
        }}
      >
        {/* Autocomplete Row */}
        <Box display="flex" gap={2} paddingTop={1}>
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
        </Box>

        {/* Scrollable Lecture List */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 1.5,
            minHeight: 100,
          }}
        >
          {hasLectures ? (
            timetable.happenings.map((event, index) => (
              <Box key={event.id}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={2}
                  py={1}
                >
                  {/* Lecture info */}
                  <Box flex={1}>
                    <Typography variant="caption" color="text.secondary">
                      {event.fullPlanningGroupNames || 'Semester ?'}
                    </Typography>
                    <Typography>{event.orglectureName}</Typography>
                  </Box>

                  {/* ID + Checkbox */}
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body2" color="text.secondary" whiteSpace="nowrap">
                      {event.physicalHappeningId}
                    </Typography>
                    <Checkbox checked size="small" color="secondary" />
                  </Box>
                </Box>
                {index !== timetable.happenings.length - 1 && <Divider />}
              </Box>
            ))
          ) : (
            <Box
              sx={{
                px: 2,
                py: 4,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              {t('sidebar.lectures.empty', 'No Lectures')}
            </Box>
          )}
        </Box>

        {/* Result Count */}
        <Typography variant="body2" color="text.secondary">
          {timetable?.happenings?.length || 0} {t('sidebar.lectures.dialog.results', 'Results')}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t('sidebar.lectures.dialog.cancel', 'Cancel')}
        </Button>
        <Button onClick={onAdd} color="primary">
          {t('sidebar.lectures.dialog.add', 'Add')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
