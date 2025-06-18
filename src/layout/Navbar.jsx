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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { addDays, subDays, isBefore, isAfter, startOfWeek, endOfWeek } from 'date-fns'
import { appName } from '../config'
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
      begin: (!selectedSemester || !showDates) ? startOfWeek(new Date(), { weekStartsOn: 1 }) : selectedSemester.planningUnitBeginDate,
      end: (!selectedSemester || !showDates) ? endOfWeek(new Date(), { weekStartsOn: 1 }) : selectedSemester.planningUnitEndDate,
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
      <Toolbar disableGutters sx={{ display: 'flex', width: '100%', minHeight: { xs: '46px', md: '64px' } }}>
        {/* Left: Hamburger + Title */}
        <Box
          sx={{
            width: { xs: 'auto', md: '300px' },
            display: 'flex',
            alignItems: 'center',
            pl: isMobile ? 1 : 2,
            gap: 1,
          }}
        >
          <IconButton onClick={onMenuClick} size="small">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ display: { xs: 'none', md: 'block' } }}>
            { appName }
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
            disabled={!navigationState.canGoNext && !navigationState.canGoPrev}
            sx={{ minWidth: 'auto', borderRadius: '50px', mr: 1 }}
          >
            { t('nav.today') }
          </Button>

          <IconButton onClick={handlePrev} disabled={!navigationState.canGoPrev}>
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>

          <DatePicker
            value={selectedDate}
            onChange={handleDatePickerChange}
            disabled={!navigationState.canGoNext && !navigationState.canGoPrev}
            minDate={datePickerInterval.begin}
            maxDate={datePickerInterval.end}
            slotProps={{
              textField: {
                variant: 'outlined',
                size: 'small',
                sx: {
                  width: isMobile ? '40px' : 'auto',
                  height: isMobile ? '40px' : 'auto',
                  '& .MuiInputAdornment-root': {
                    margin: 0,
                    transform: isMobile ? 'translate(-50%, 0)' : undefined,
                  },
                },
                inputProps: {
                  inputMode: 'none',
                },
              },
            }}
          />
          <IconButton onClick={handleNext} disabled={!navigationState.canGoNext}>
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Right: Language & Help */}
        <Box sx={{ display: 'flex', alignItems: 'center', pr: isMobile ? 1 : 2 }}>
          <Button
            variant="text"
            onClick={handleLanguageToggle}
            sx={{ minWidth: 'auto', borderRadius: '50px'}}
          >
            { currentLanguageCode }
          </Button>

          <IconButton
            onClick={handlePrev}
            component="a"
            href="https://www.progotec.de/site/splandok"
            target="_blank"
            disabled={!navigationState.canGoPrev}
          >
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
