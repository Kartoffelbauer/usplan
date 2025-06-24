import { useCallback, useEffect, useState } from 'react'
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
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTimetable } from '../../../../shared/context/TimetableContext'
import StudyCourseSelectWidget from '../../../../shared/components/widgets/StudyCourseSelectWidget'
import StudyGroupSelectWidget from '../../../../shared/components/widgets/StudyGroupSelectWidget'

/**
 * Dialog for selecting and adding lectures.
 * Selections only apply when "Apply" is pressed.
 * Previously selected lectures remain unless manually deselected.
 */
export default function AddLectureDialogWidget({ open, setOpen }) {
  const { t } = useTranslation()
  const {
    lectures,
    selectedStudyGroup,
    selectedLectures,
    setSelectedLectures,
  } = useTimetable()

  const [localSelectedIds, setLocalSelectedIds] = useState([])

  useEffect(() => {
    if (open) {
      // Start with existing selected lecture IDs
      setLocalSelectedIds(selectedLectures.map(l => l.id))
    }
  }, [open, selectedLectures])

  const toggleLecture = useCallback((id) => {
    setLocalSelectedIds(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    )
  }, [])

  const handleAdd = () => {
    const allLectures = lectures.flatMap(obj => obj.a)

    const newlySelected = allLectures
      .filter(lecture => localSelectedIds.includes(lecture.id))
      .map(lecture => ({
        id: lecture.id,
        name: lecture.name,
        semester: selectedStudyGroup?.shortName || '',
      }))

    const updated = [
      // Keep already selected lectures that were not deselected
      ...selectedLectures.filter(l => localSelectedIds.includes(l.id)),
      // Add newly selected lectures not already present
      ...newlySelected.filter(newL => !selectedLectures.some(existing => existing.id === newL.id))
    ]

    setSelectedLectures(updated)
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const hasLectures = lectures.length > 0

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
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
        {/* Study Course + Group Selection */}
        <Box display="flex" gap={2} paddingTop={1}>
          <StudyCourseSelectWidget />
          <StudyGroupSelectWidget />
        </Box>

        {/* Scrollable Lecture List */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            px: 1.5,
          }}
        >
          {hasLectures ? (
            lectures.flatMap(obj => obj.a).map((lecture, index, arr) => {
              const isSelected = localSelectedIds.includes(lecture.id)

              return (
                <Box key={lecture.id}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={2}
                    py={1}
                  >
                    <Box flex={1}>
                      <Typography variant="caption" color="text.secondary">
                        {selectedStudyGroup?.shortName || 'Semester ?'}
                      </Typography>
                      <Typography>{lecture.name || 'Lecture ?'}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        whiteSpace="nowrap"
                      >
                        {lecture.id}
                      </Typography>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleLecture(lecture.id)}
                        size="small"
                        color="secondary"
                      />
                    </Box>
                  </Box>
                  {index !== arr.length - 1 && <Divider />}
                </Box>
              )
            })
          ) : (
            <Box
              sx={{
                px: 2,
                py: 4,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              <Typography variant="boyd1" gutterBottom>
                {t('sidebar.lectures.empty', 'No Lectures')}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Result Count */}
        <Typography variant="body2" color="text.secondary">
          {lectures?.length || 0} {t('sidebar.lectures.dialog.results', 'Results')}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel} color="inherit">
          {t('sidebar.lectures.dialog.cancel', 'Cancel')}
        </Button>
        <Button onClick={handleAdd} color="primary">
          {t('sidebar.lectures.dialog.apply', 'Apply')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}