import { useTranslation } from 'react-i18next'
import { useState, useCallback, useEffect } from 'react'
import { useCheckMobile } from '../utils/themeUtils'
import {
  Box,
  useTheme,
  Tabs,
  Tab,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import Navbar from './Navbar'
import TimetableSection from '../components/sections/timetable/TimetableSection'
import ConfiguratorSection from '../components/sections/configurator/ConfiguratorSection'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined'
import EditCalendarIcon from '@mui/icons-material/EditCalendar'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

/**
 * TabPanel component that conditionally renders its children based on the active tab
 */
function TabPanel({ children, value, index }) {
  return value === index ? (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {children}
    </Box>
  ) : null
}

/**
 * MainLayout component that provides the overall application structure
 */
export default function MainLayout() {
  const { t } = useTranslation()
  const isMobile = useCheckMobile()
  const theme = useTheme()

  // ==================== GLOBAL STATE ====================
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedOptions, setSelectedOptions] = useState(['date', 'specials'])
  const [dropdownAnchor, setDropdownAnchor] = useState(null)

  // ==================== COMPUTED VALUES ====================

  const showDates = selectedOptions.includes('date')

  // ==================== EFFECTS ====================

  /**
   * Reset calendar to today when Date checkbox is unchecked
   */
  useEffect(() => {
    if (!showDates) {
      setSelectedDate(new Date())
    }
  }, [showDates])

  // ==================== EVENT HANDLERS ====================

  const handleToggleSidebar = () => setSidebarOpen((prevOpen) => !prevOpen)
  const handleTabChange = (_, newTabIndex) => setActiveTabIndex(newTabIndex)

  /**
   * Handles date selection from various components
   */
  const handleDateChange = useCallback((date) => {
    setSelectedDate(date)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  /**
   * Handles checkbox changes
   */
  const handleCheckboxChange = useCallback((option, checked) => {
    setSelectedOptions(prev => 
      checked 
        ? [...prev, option]
        : prev.filter(item => item !== option)
    )
  }, [])

  const handleDropdownOpen = (event) => setDropdownAnchor(event.currentTarget)
  const handleDropdownClose = () => setDropdownAnchor(null)

  // ==================== RENDER ====================

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      height="100vh" 
      width="100vw" 
      overflow="hidden"
    >
      {/* Top Navigation - Navbar handles its own navigation logic */}
      <Navbar
        onMenuClick={handleToggleSidebar}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        showDates={showDates}
      />

      {/* Tab Navigation with Checkboxes */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: theme.palette.background.secondary 
        }}
      >
        <Tabs
          value={activeTabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            flexGrow: 1,
            minHeight: 'auto',
            '& .MuiTab-root': {
              minHeight: 'auto',
              paddingY: 1,
              textTransform: 'none',
            },
          }}
        >
          <Tab 
            label={t('nav.tabs.timetable', 'Timetable')}
            icon={
              activeTabIndex === 0 
                ? <CalendarMonthIcon fontSize="small" />
                : <CalendarMonthOutlinedIcon fontSize="small" />
            }
            iconPosition="start"
          />
          <Tab 
            label={isMobile ? t('nav.tabs.configure.short', 'Configure') : t('nav.tabs.configure.full', 'Configure Timetable')}
            icon={
              activeTabIndex === 1 
                ? <EditCalendarIcon fontSize="small" />
                : <EditCalendarOutlinedIcon fontSize="small" />
            }
            iconPosition="start"
          />
        </Tabs>

        {/* Desktop Checkboxes */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, px: 2, flexShrink: 0 }}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox 
                  size="small" 
                  checked={selectedOptions.includes('date')}
                  onChange={(e) => handleCheckboxChange('date', e.target.checked)}
                />
              }
              label={t('nav.view.date', 'Date')}
              sx={{ mr: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox 
                  size="small" 
                  checked={selectedOptions.includes('specials')}
                  onChange={(e) => handleCheckboxChange('specials', e.target.checked)}
                />
              }
              label={t('nav.view.specials', 'Specials')}
            />
          </FormGroup>
        </Box>

        {/* Mobile Dropdown */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, px: isMobile ? 1 : 2, flexShrink: 0 }}>
          <IconButton
            onClick={handleDropdownOpen}
            size="medium"
          >
            <ExpandMoreIcon fontSize="medium" />
          </IconButton>
          
          <Menu
            anchorEl={dropdownAnchor}
            open={Boolean(dropdownAnchor)}
            onClose={handleDropdownClose}
          >
            <MenuItem onClick={(e) => e.stopPropagation()}>
              <FormControlLabel
                control={
                  <Checkbox 
                    size="small" 
                    checked={selectedOptions.includes('date')}
                    onChange={(e) => handleCheckboxChange('date', e.target.checked)}
                  />
                }
                label={t('nav.view.date', 'Date')}
                sx={{ width: '100%', margin: 0 }}
              />
            </MenuItem>
            <MenuItem onClick={(e) => e.stopPropagation()}>
              <FormControlLabel
                control={
                  <Checkbox 
                    size="small" 
                    checked={selectedOptions.includes('specials')}
                    onChange={(e) => handleCheckboxChange('specials', e.target.checked)}
                  />
                }
                label={t('nav.view.specials', 'Specials')}
                sx={{ width: '100%', margin: 0 }}
              />
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Main Content */}
      <Box display="flex" flexGrow={1} width="100%" overflow="hidden">
        <TabPanel value={activeTabIndex} index={0}>
          <TimetableSection
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={handleToggleSidebar}
            showDates={showDates}
            showSpecials={selectedOptions.includes('specials')}
          />
        </TabPanel>

        <TabPanel value={activeTabIndex} index={1}>
          <ConfiguratorSection
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={handleToggleSidebar}
            showDates={showDates}
            showSpecials={selectedOptions.includes('specials')}
          />
        </TabPanel>
      </Box>
    </Box>
  )
}
