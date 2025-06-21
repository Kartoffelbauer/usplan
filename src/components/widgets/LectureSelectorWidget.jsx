import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Divider,
  Stack,
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
  const isEmpty = lectures.length === 0

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight="bold">Lectures</Typography>
        <Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Delete />}
            onClick={onClear}
            disabled={isEmpty}
            color={isEmpty ? 'inherit' : 'error'}
            sx={{ mr: 1 }}
          >
            CLEAR
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Add />}
            onClick={onAdd}
          >
            ADD
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <Box mt={2}>
        {isEmpty ? (
          <Box
            sx={{
              border: '1px dashed grey',
              borderRadius: 1,
              py: 4,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            No Lectures
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
                    <Typography variant="caption" color="text.secondary">
                      Semester {lecture.semester}
                    </Typography>
                    <Typography>{lecture.name}</Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {lecture.id}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Paper>
  )
}