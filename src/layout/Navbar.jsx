import { useTranslation } from 'react-i18next'
import { useMemo, useCallback } from 'react'
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  useTheme,
  IconButton,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import MenuIcon from '@mui/icons-material/Menu'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LanguageIcon from '@mui/icons-material/Language'
import { addDays, subDays, isBefore, isAfter } from 'date-fns'
import { useTimetable } from '../context/TimetableContext'

export default function Navbar({
  onMenuClick,
  selectedDate,
  onDateChange,
  showDates,
  isMobile,
}) {
  const theme = useTheme()
  const { i18n, t } = useTranslation()
  const { semesters, selectedSemesterId } = useTimetable()

  // ==================== COMPUTED VALUES ====================

  /**
   * Semester interval computed from current semester
   * Fallback to DatePicker defaults if no semester is found
   */
  const semesterInterval = useMemo(() => {
    const currentSemester = semesters.find(semester => semester.id === selectedSemesterId)

    if (currentSemester) {
      return {
        begin: new Date(currentSemester.planningUnitBeginDate),
        end: new Date(currentSemester.planningUnitEndDate),
      }
    }

    // Fallback to DatePicker defaults if no semester found
    return {
      begin: new Date('1900-01-01'),
      end: new Date('2099-12-31'),
    }
  }, [semesters, selectedSemesterId])

  /**
   * Navigation state based on semester boundaries
   */
  const navigationState = useMemo(() => {
    const step = isMobile ? 1 : 7 // 1 day on mobile, 7 days (1 week) on desktop
    const nextDate = addDays(selectedDate, step)
    const prevDate = subDays(selectedDate, step)

    return {
      canGoNext: !isAfter(nextDate, semesterInterval.end),
      canGoPrev: !isBefore(prevDate, semesterInterval.begin),
      isDisabled: !showDates,
    }
  }, [selectedDate, semesterInterval, isMobile, showDates])

  // ==================== EVENT HANDLERS ====================

  /**
   * Navigate to today
   */
  const handleToday = useCallback(() => {
    if (showDates) {
      onDateChange(new Date())
    }
  }, [showDates, onDateChange])

  /**
   * Navigate to previous period
   */
  const handlePrev = useCallback(() => {
    if (showDates && navigationState.canGoPrev) {
      const step = isMobile ? 1 : 7
      onDateChange(subDays(selectedDate, step))
    }
  }, [showDates, navigationState.canGoPrev, selectedDate, isMobile, onDateChange])

  /**
   * Navigate to next period
   */
  const handleNext = useCallback(() => {
    if (showDates && navigationState.canGoNext) {
      const step = isMobile ? 1 : 7
      onDateChange(addDays(selectedDate, step))
    }
  }, [showDates, navigationState.canGoNext, selectedDate, isMobile, onDateChange])

  /**
   * Handle date picker change
   */
  const handleDatePickerChange = useCallback((date) => {
    if (showDates && date) {
      onDateChange(date)
    }
  }, [showDates, onDateChange])

  /**
   * Toggle language
   */
  const handleLanguageToggle = useCallback(() => {
    const newLanguage = i18n.language === 'en' ? 'de' : 'en'
    i18n.changeLanguage(newLanguage)
  }, [i18n])

  // ==================== RENDER ====================

  const currentLanguageCode = i18n.language === 'de' ? 'DE' : 'EN'

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.secondary,
        color: theme.palette.text.primary,
      }}
    >
      <Toolbar disableGutters sx={{ display: 'flex', width: '100%' }}>
        {/* Left: Hamburger + Title */}
        <Box
          sx={{
            width: { xs: 'auto', md: '300px' },
            display: 'flex',
            alignItems: 'center',
            px: 2,
            gap: 1,
          }}
        >
          <IconButton onClick={onMenuClick} size="small">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ display: { xs: 'none', md: 'block' } }}>
            {t('nav.appTitle')}
          </Typography>
        </Box>

        {/* Center: Calendar Controls */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            px: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleToday}
            startIcon={<CalendarTodayIcon fontSize="small" />}
            disabled={navigationState.isDisabled}
            sx={{ minWidth: 'auto', borderRadius: '50px' }}
          >
            {!isMobile && t('nav.today')}
          </Button>

          <Button
            variant="text"
            onClick={handlePrev}
            disabled={navigationState.isDisabled || !navigationState.canGoPrev}
            sx={{ borderRadius: '50px', minWidth: 40, px: 0 }}
          >
            <ArrowBackIosIcon fontSize="small" />
          </Button>

          <DatePicker
            value={selectedDate}
            onChange={handleDatePickerChange}
            disabled={navigationState.isDisabled}
            minDate={semesterInterval.begin}
            maxDate={semesterInterval.end}
            slotProps={{ textField: { variant: 'outlined', size: 'small' } }}
          />

          <Button
            variant="text"
            onClick={handleNext}
            disabled={navigationState.isDisabled || !navigationState.canGoNext}
            sx={{ borderRadius: '50px', minWidth: 40, px: 0 }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </Button>
        </Box>

        {/* Right: Language & Help */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 2 }}>
          <Button
            variant="outlined"
            startIcon={<LanguageIcon fontSize="small" />}
            onClick={handleLanguageToggle}
            sx={{ minWidth: 'auto', borderRadius: '50px' }}
          >
            {!isMobile && currentLanguageCode}
          </Button>

          <Button
            component="a"
            href="https://www.progotec.de/site/splandok"
            target="_blank"
            variant="outlined"
            sx={{ minWidth: 'auto', borderRadius: '50px' }}
          >
            ?
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
