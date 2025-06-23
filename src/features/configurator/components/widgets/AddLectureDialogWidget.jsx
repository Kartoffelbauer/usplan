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

export default function AddLectureDialogWidget({ open, onClose, onAdd }) {
  const { t } = useTranslation()
  const { timetable } = useTimetable()

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