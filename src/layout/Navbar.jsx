import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
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
import LanguageIcon from '@mui/icons-material/Language';

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
            width: {sx: 'auto', md: '300px'},
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
            Ultimate StarPlan
          </Typography>
        </Box>

        {/* 2. Checkboxes */}
        <Box sx={{ display: {xs: 'none', md: 'block'}, alignItems: 'center', gap: 1, px: 2, flexWrap: 'nowrap' }}>
          <FormGroup row sx={{ flexWrap: 'nowrap' }}>
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Date"
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Specials"
            />
          </FormGroup>
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
            {!isMobile && "Today"}
          </Button>
          <Button
            variant="outlined"
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
            variant="outlined"
            onClick={onNext}
            sx={{ borderRadius: '50px', minWidth: 40, px: 0 }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </Button>
        </Box>

        {/* 4. Language & Help */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 2 }}>
          <Button
            variant="outlined"
            startIcon={<LanguageIcon fontSize='small'/>}
            sx={{
              minWidth: 'auto',
              borderRadius: '50px',
            }}
          >
            EN
          </Button>
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
