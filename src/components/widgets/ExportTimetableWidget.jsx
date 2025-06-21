import { useTranslation } from 'react-i18next'
import { useCallback, useState } from 'react'
import {
  Box,
  Typography,
  ButtonGroup,
  Button,
  Fade,
  Alert,
} from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useTimetable } from '../../context/TimetableContext'
import { printTimetable, icalUrlForTimetable, copyToClipboard } from '../../utils/exportUtils'

/**
 * Widget for exporting the timetable
 * Provides options to print the timetable or copy iCal link to clipboard
 */
export default function ExportTimetableWidget() {
    const { t, i18n } = useTranslation()
    const [showCopyConfirmation, setShowCopyConfirmation] = useState(false)
    const {
        timetable,
        selectedSemester,
        selectedStudyGroup,
        selectedRoom,
        selectedTimetable,
    } = useTimetable()

    /**
     * Print functionality
     */
    const onExportPrint = useCallback(() => {
        printTimetable()
    }, [])

    /**
     * iCal export functionality - copies link to clipboard
     */
    const onExportIcal = useCallback(async () => {
        if (!selectedTimetable || !selectedSemester ||
            (selectedTimetable === 'course' && !selectedStudyGroup) ||
            (selectedTimetable === 'room' && !selectedRoom)) {
            return
        }
        
        const icalUrl = icalUrlForTimetable(selectedTimetable, selectedSemester.id, selectedTimetable === 'course' ? selectedStudyGroup.id : selectedRoom.id, i18n.language)
        
        if (icalUrl) {
          const success = await copyToClipboard(icalUrl)
          if (success) {
            setShowCopyConfirmation(true)
            setTimeout(() => setShowCopyConfirmation(false), 3000)
          }
        }
    }, [selectedTimetable, selectedSemester, selectedStudyGroup, selectedRoom, i18n.language])
    
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {t('sidebar.export.title', 'Export')}
      </Typography>

      <ButtonGroup fullWidth variant="outlined">
        <Button
          onClick={onExportPrint}
          disabled={!timetable}
          startIcon={<PrintIcon fontSize="small" />}
        >
          {t('sidebar.export.print', 'Print')}
        </Button>
        <Button
          onClick={onExportIcal}
          disabled={!timetable}
          startIcon={<ContentCopyIcon fontSize="small" />}
        >
          {t('sidebar.export.ical', 'iCal')}
        </Button>
      </ButtonGroup>

      <Fade in={showCopyConfirmation}>
        <Alert
          severity="success"
          sx={{
            mt: 1,
            py: 0.5,
            fontSize: '0.875rem',
          }}
        >
          {t('sidebar.export.linkCopied', 'Link copied!')}
        </Alert>
      </Fade>
    </Box>
  )
}
