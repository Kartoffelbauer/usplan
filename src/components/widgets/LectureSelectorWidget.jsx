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

/**
 * Widget to display and manage a list of selected lectures.
 *
 * @param {Object[]} lectures - Array of lecture objects with `id`, `name`, and `semester`
 * @param {Function} onAdd - Callback when the "Add" button is clicked
 * @param {Function} onClear - Callback to remove all lectures
 * @param {Function} onRemove - Callback when a single lecture is removed (gets `id`)
 */
export default function LectureSelectorWidget({ lectures, onAdd, onClear, onRemove }) {
  const { t } = useTranslation()
  const theme = useTheme()
  const isEmpty = lectures.length === 0

  return (
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
            onClick={onClear}
            disabled={isEmpty}
            color={isEmpty ? 'inherit' : 'error'}
            sx={{ mr: 1 }}
          >
            <Delete />
          </IconButton>
          <IconButton
            size="small"
            onClick={onAdd}
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
            {lectures.map((lecture) => (
              <Box
                key={lecture.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center">
                  <IconButton
                    onClick={() => onRemove(lecture.id)}
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
  )
}