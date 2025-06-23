import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Stack,
  useTheme,
} from '@mui/material'
import { Delete, Add } from '@mui/icons-material'
import { useTimetable } from '../../../../shared/context/TimetableContext'
import AddLectureDialogWidget from './AddLectureDialogWidget';

/**
 * Widget to display and manage a list of selected lectures.
 */
export default function LectureSelectWidget() {
  const { t } = useTranslation()
  const theme = useTheme()
  const { selectedLectures, setSelectedLectures } = useTimetable()
  const isEmpty = selectedLectures.length === 0

  // State to manage the dialog open state
  const [dialogOpen, setDialogOpen] = useState(false)


  // Handlers for adding, clearing, and removing lectures
  const handleAddLecture = () => {
    setDialogOpen(true);
  }

  // Function to clear all lectures
  const handleClearLectures = () => {
    setSelectedLectures([]);
  }

  // Function to remove a single lecture by id
  const handleRemoveLecture = (id) => {
    setSelectedLectures((prevLectures) => prevLectures.filter((lecture) => lecture.id !== id));
  }

  return (
    <>
    { /* Main container for the widget */ }
      <Box
        sx={{
          width: '100%',
          border: 1,
          borderRadius: 1,
          borderColor: theme.palette.divider,
          p: 2
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1">{t('sidebar.lectures.title', 'Lectures')}</Typography>
          <Box>
            <IconButton
              size="small"
              onClick={handleClearLectures}
              disabled={isEmpty}
              color={isEmpty ? 'inherit' : 'error'}
              sx={{ mr: 1 }}
            >
              <Delete />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleAddLecture}
            >
              <Add />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box mt={2}>
          {isEmpty ? (
            <Box
              sx={{
                border: 1,
                borderRadius: 1,
                borderStyle: 'dashed',
                borderColor: theme.palette.divider,
                color: theme.palette.text.secondary,
                textAlign: 'center',
                py: 2,
              }}
            >
              {t('sidebar.lectures.empty', 'No Lectures')}
            </Box>
          ) : (
            <Stack divider={<Divider />} spacing={1}>
              {selectedLectures.map((lecture) => (
                <Box
                  key={lecture.id}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center">
                    <IconButton
                      onClick={() => handleRemoveLecture(lecture.id)}
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                    <Box ml={1}>
                      <Typography variant="caption" color={theme.palette.text.secondary}>
                        {lecture.semester}
                      </Typography>
                      <Typography variant='subtitle2'>{lecture.name}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="subtitle2" color={theme.palette.text.secondary}>
                    {lecture.id}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Box>

      {/* Add lectures with this dialog */}
      <AddLectureDialogWidget
        open={dialogOpen}
        setOpen={setDialogOpen}
      />
    </>
  )
}