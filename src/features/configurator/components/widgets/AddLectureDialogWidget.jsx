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
    selectedLectures,
    setSelectedLectures,
  } = useTimetable()

  const [localSelectedIds, setLocalSelectedIds] = useState([])

  useEffect(() => {
    if (open) {
      // Start with existing selected lecture IDs
      setLocalSelectedIds(selectedLectures)
    }
  }, [open, selectedLectures])

  const toggleLecture = useCallback((id) => {
    setLocalSelectedIds(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    )
  }, [])

  const handleAdd = () => {
    const allLectureIds = lectures.flatMap(obj => obj.a.id)
    const newlySelected = allLectureIds.filter(lecture => localSelectedIds.includes(lecture))

    const updated = [
      // Keep already selected lectures that were not deselected
      ...selectedLectures.filter(lecture => localSelectedIds.includes(lecture)),
      // Add newly selected lectures not already present
      ...newlySelected.filter(newLect => !selectedLectures.some(exLect => exLect === newLect))
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
        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          paddingTop={1}
        >
          <Box flex="1 1 200px">
            <StudyCourseSelectWidget />
          </Box>
          <Box flex="1 1 200px">
            <StudyGroupSelectWidget />
          </Box>
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
            minHeight: '75px',
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
                      {lecture.importId && (
                        <Typography variant="caption" color="text.secondary">
                          {lecture.importId}
                        </Typography>
                      )}
                      <Typography
                        sx={{
                          wordBreak: 'break-word',
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {lecture.name || 'Lecture ?'}
                      </Typography>
                    </Box>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleLecture(lecture.id)}
                      size="small"
                      color="secondary"
                    />
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