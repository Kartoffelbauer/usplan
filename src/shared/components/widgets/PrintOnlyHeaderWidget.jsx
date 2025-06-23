import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTimetable } from '../../context/TimetableContext'

/**
 * A print-only header displaying key timetable info.
 * Automatically switches between course and room mode using context.
 */
export default function PrintOnlyHeaderWidget() {
  const { t } = useTranslation()
  const {
    selectedSemester,
    selectedStudyCourse,
    selectedStudyGroup,
    selectedLocation,
    selectedRoom,
    selectedTimetable,
  } = useTimetable()

  return (
    <Box
      className="show-print"
      sx={{
        display: 'none',
        padding: 2,
        borderBottom: '1px solid black',
        marginBottom: 2,
        backgroundColor: 'white',
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, color: 'black' }}>
        <Typography variant="body1">
          <strong>{t('sidebar.semester', 'Semester')}:</strong>{' '}
          {selectedSemester?.name || 'N/A'}
        </Typography>

        {selectedTimetable === 'course' && (
          <>
            <Typography variant="body1">
              <strong>{t('sidebar.selection.course.studyCourse', 'Study Course')}:</strong>{' '}
              {selectedStudyCourse?.name || 'N/A'}
            </Typography>
            <Typography variant="body1">
              <strong>{t('sidebar.selection.course.studyGroup', 'Study Group')}:</strong>{' '}
              {selectedStudyGroup?.name || 'N/A'}
            </Typography>
          </>
        )}

        {selectedTimetable === 'room' && (
          <>
            <Typography variant="body1">
              <strong>{t('sidebar.selection.room.location', 'Room')}:</strong>{' '}
              {selectedLocation?.shortName || 'N/A'}
            </Typography>
            <Typography variant="body1">
              <strong>{t('sidebar.selection.room.title', 'Location')}:</strong>{' '}
              {selectedRoom?.shortName || 'N/A'}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  )
}