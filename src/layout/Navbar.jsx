import { useTranslation } from 'react-i18next'
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LanguageIcon from '@mui/icons-material/Language'

export default function Navbar({
  onMenuClick,
  selectedDate,
  onDateChange,
  onToday,
  onPrev,
  onNext,
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { i18n, t } = useTranslation()

  /**
   * Toggles between English and German
   */
  const handleLanguageToggle = () => {
    const newLanguage = i18n.language === 'en' ? 'de' : 'en'
    i18n.changeLanguage(newLanguage)
  }

  // Get current language display
  const currentLanguageCode = i18n.language === 'de' ? 'DE' : 'EN'

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: (theme) => theme.palette.background.secondary,
        color: (theme) => theme.palette.text.primary,
      }}
    >
      <Toolbar disableGutters sx={{ display: 'flex', width: '100%' }}>
        {/* 1. Hamburger + title (fixed width) */}
        <Box
          sx={{
            width: {xs: 'auto', md: '300px'},
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

        {/* 3. Calendar controls (centered) */}
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
            onClick={onToday}
            startIcon={<CalendarTodayIcon fontSize='small' />}
            sx={{
              minWidth: 'auto',
              borderRadius: '50px',
            }}
          >
            {!isMobile && t('nav.today')}
          </Button>
          <Button
            variant="text"
            onClick={onPrev}
            sx={{ borderRadius: '50px', minWidth: 40, px: 0 }}
          >
            <ArrowBackIosIcon fontSize="small" />
          </Button>
          <DatePicker
            value={selectedDate}
            onChange={onDateChange}
            slotProps={{ textField: { variant: 'outlined', size: 'small' } }}
          />
          <Button
            variant="text"
            onClick={onNext}
            sx={{ borderRadius: '50px', minWidth: 40, px: 0 }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </Button>
        </Box>

        {/* 4. Language & Help */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 2 }}>
          {/* Language Toggle Button */}
          <Button
            variant="outlined"
            startIcon={<LanguageIcon fontSize='small'/>}
            onClick={handleLanguageToggle}
            sx={{
              minWidth: 'auto',
              borderRadius: '50px',
            }}
          >
            {!isMobile && currentLanguageCode}
          </Button>

          {/* Help Button */}
          <Button
            component="a"
            href="https://www.progotec.de/site/splandok"
            target="_blank"
            variant="outlined"
            sx={{
              minWidth: 'auto',
              borderRadius: '50px'
            }}
          >
            ?
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
