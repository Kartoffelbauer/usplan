import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material'

export default function DisclaimerDialog() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Show only once per page load
    setOpen(true)
  }, [])

  const handleClose = () => setOpen(false)

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('dialog.disclaimer.title', 'Attention')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('dialog.disclaimer.description', 'This app in its current state is just a prototype. Bugs, missing features, or unexpected behavior are to be expected!')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" autoFocus>
          {t('dialog.disclaimer.action', 'Got it!')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}