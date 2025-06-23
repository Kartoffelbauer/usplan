import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'
import { useTimetable } from '../../context/TimetableContext'

/**
 * Displays a global error dialog based on the timetable context
 */
export default function ErrorDialogWidget() {
  const { t } = useTranslation()
  const { error } = useTimetable()

  return (
    <Dialog open={error} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ErrorIcon color="error" />
        {t('restError.title', 'An error occurred')}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {error?.message} {t('restError.action', 'Please try again later.')}
        </Typography>
      </DialogContent>
    </Dialog>
  )
}