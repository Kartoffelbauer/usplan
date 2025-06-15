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
import { addDays, subDays, isBefore, isAfter, startOfWeek, endOfWeek } from 'date-fns'
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
  const { selectedSemester } = useTimetable()

  // ==================== COMPUTED VALUES ====================

  /**
   * Date picker interval based on selected semester
   * Fallback to DatePicker defaults if no semester is found
   */
  const datePickerInterval = useMemo(() => {
    return {
      begin: (!selectedSemester || !showDates) ? startOfWeek(new Date()) : selectedSemester.planningUnitBeginDate,
      end: (!selectedSemester || !showDates) ? endOfWeek(new Date()) : selectedSemester.planningUnitEndDate,
    }
  }, [selectedSemester, isMobile, showDates])

  /**
   * Navigation state based on semester boundaries
   */
  const navigationState = useMemo(() => {
    const step = isMobile ? 1 : 7 // 1 day on mobile, 7 days (1 week) on desktop
    const nextDate = addDays(selectedDate, step)
    const prevDate = subDays(selectedDate, step)

    return {
      step,
      canGoNext: !isAfter(nextDate, datePickerInterval.end),
      canGoPrev: !isBefore(prevDate, datePickerInterval.begin),
    }
  }, [selectedDate, datePickerInterval, isMobile])

  // ==================== EVENT HANDLERS ====================

  /**
   * Navigate to today
   */
  const handleToday = useCallback(() => {
    if (navigationState.canGoNext || navigationState.canGoPrev) {
      onDateChange(new Date())
    }
  }, [navigationState, onDateChange])

  /**
   * Navigate to previous period
   */
  const handlePrev = useCallback(() => {
    if (navigationState.canGoPrev) {
      onDateChange(subDays(selectedDate, navigationState.step))
    }
  }, [navigationState, selectedDate, isMobile, onDateChange])

  /**
   * Navigate to next period
   */
  const handleNext = useCallback(() => {
    if (navigationState.canGoNext) {
      onDateChange(addDays(selectedDate, navigationState.step))
    }
  }, [navigationState, selectedDate, isMobile, onDateChange])

  /**
   * Handle date picker change
   */
  const handleDatePickerChange = useCallback((date) => {
    if (date) {
      onDateChange(date)
    }
  }, [onDateChange])

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
            disabled={!navigationState.canGoNext && !navigationState.canGoPrev}
            sx={{ minWidth: 'auto', borderRadius: '50px' }}
          >
            {!isMobile && t('nav.today')}
          </Button>

          <Button
            variant="text"
            onClick={handlePrev}
            disabled={!navigationState.canGoPrev}
            sx={{ borderRadius: '50px', minWidth: 40, px: 0 }}
          >
            <ArrowBackIosIcon fontSize="small" />
          </Button>

          <DatePicker
            value={selectedDate}
            onChange={handleDatePickerChange}
            disabled={!navigationState.canGoNext && !navigationState.canGoPrev}
            minDate={datePickerInterval.begin}
            maxDate={datePickerInterval.end}
            slotProps={{ textField: { variant: 'outlined', size: 'small' } }}
          />

          <Button
            variant="text"
            onClick={handleNext}
            disabled={!navigationState.canGoNext}
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
