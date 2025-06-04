import { useTranslation } from 'react-i18next'
import { useState, useCallback } from 'react'
import {
  Box,
  useMediaQuery,
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
import { addDays, addWeeks } from 'date-fns'
import Navbar from './Navbar'
import TimetableSection from '../components/TimetableSection/TimetableSection'
import ConfiguratorSection from '../components/ConfiguratorSection'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import EditCalendarIcon from '@mui/icons-material/EditCalendar'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

/**
 * TabPanel component that conditionally renders its children based on the active tab
 * Only renders content when the tab is active to optimize performance
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render when tab is active
 * @param {number} props.value - Currently active tab index
 * @param {number} props.index - This panel's tab index
 * @returns {JSX.Element|null} The rendered tab panel or null if not active
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
 * Manages global state for navigation, tabs, and calendar functionality
 * Handles responsive behavior for mobile and desktop views
 * 
 * @returns {JSX.Element} The main application layout
 */
export default function MainLayout() {
  // Theme and responsive detection hooks
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { t } = useTranslation()

  // ==================== GLOBAL STATE ====================
  
  const [sidebarOpen, setSidebarOpen] = useState(true)         // Controls sidebar visibility
  const [tabIndex, setTabIndex] = useState(0)                 // Active tab index (0=Timetable, 1=Configure)
  const [selectedDate, setSelectedDate] = useState(new Date()) // Currently selected calendar date
  const [view, setView] = useState('week')                     // Calendar view mode (day/week)
  const [selectedOptions, setSelectedOptions] = useState([])   // Selected checkbox options
  const [anchorEl, setAnchorEl] = useState(null)              // Menu anchor element for mobile dropdown

  // ==================== EVENT HANDLERS ====================

  /**
   * Toggles the sidebar open/closed state
   * Called by the hamburger menu button in the navbar
   */
  const handleToggleSidebar = () => setSidebarOpen((prevOpen) => !prevOpen)

  /**
   * Handles tab selection changes
   * @param {Event} _ - The event object (unused)
   * @param {number} newTabIndex - The newly selected tab index
   */
  const handleTabChange = (_, newTabIndex) => setTabIndex(newTabIndex)

  /**
   * Resets the selected date to today
   * Called by the "Today" button in the navbar
   */
  const handleToday = () => setSelectedDate(new Date())

  /**
   * Navigates to the previous time period
   * Moves back by 1 day on mobile, 1 week on desktop
   */
  const handlePrev = () => setSelectedDate((currentDate) => 
    isMobile ? addDays(currentDate, -1) : addWeeks(currentDate, -1)
  )

  /**
   * Navigates to the next time period
   * Moves forward by 1 day on mobile, 1 week on desktop
   */
  const handleNext = () => setSelectedDate((currentDate) => 
    isMobile ? addDays(currentDate, 1) : addWeeks(currentDate, 1)
  )

  /**
   * Updates the selected date
   * Used by various date selection components
   * @param {Date} date - The new selected date
   */
  const handleDateChange = (date) => setSelectedDate(date)

  /**
   * Updates the calendar view mode
   * @param {string} newView - The new view mode ('day', 'week', etc.)
   */
  const handleViewChange = (newView) => setView(newView)

  /**
   * Handles date selection from the sidebar
   * Updates the selected date and automatically closes sidebar on mobile for better UX
   * Uses useCallback to prevent unnecessary re-renders
   * @param {Date} date - The selected date from sidebar
   */
  const handleSidebarDate = useCallback(
    (date) => {
      setSelectedDate(date)
      // Auto-close sidebar on mobile to show calendar content
      if (isMobile) setSidebarOpen(false)
    },
    [isMobile]
  )

  /**
   * Handles individual checkbox changes for both desktop and mobile
   * @param {string} option - The checkbox option ('date' or 'specials')
   * @param {boolean} checked - Whether the checkbox is checked
   */
  const handleCheckboxChange = useCallback((option, checked) => {
    setSelectedOptions(prev => 
      checked 
        ? [...prev, option]
        : prev.filter(item => item !== option)
    )
  }, [])

  /**
   * Opens the mobile dropdown menu
   * @param {Event} event - The click event
   */
  const handleDropdownOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  /**
   * Closes the mobile dropdown menu
   */
  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  // ==================== RENDER ====================

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      height="100vh" 
      width="100vw" 
      overflow="hidden"
    >
      {/* Top Navigation Bar */}
      <Navbar
        onMenuClick={handleToggleSidebar}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        onToday={handleToday}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      {/* Tab Navigation with Checkboxes/Dropdown */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: theme.palette.background.secondary 
        }}
      >
        {/* Tabs */}
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            flexGrow: 1, // Take up remaining space
            minHeight: 'auto', // Remove default minimum height for thinner tabs
            '& .MuiTabs-root': {
              minHeight: 'auto',
            },
            '& .MuiTab-root': {
              minHeight: 'auto', // Remove default minimum height
              paddingY: 1, // Reduce vertical padding for more compact appearance
              textTransform: 'none', // Prevent automatic uppercase transformation
            },
            '& .MuiTab-iconWrapper': {
              marginBottom: 0, // Remove default icon margin for better alignment
            },
          }}
        >
          {/* Timetable Tab */}
          <Tab 
            label={t('nav.tabs.timetable')}
            icon={<CalendarMonthIcon fontSize='small' />}
            iconPosition="start"
          />
          
          {/* Configuration Tab */}
          <Tab 
            label={isMobile ? t('nav.tabs.configure.short') : t('nav.tabs.configure.full')}
            icon={<EditCalendarIcon fontSize='small' />}
            iconPosition="start"
          />
        </Tabs>

        {/* Desktop Checkboxes - Right aligned */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          px: 2,
          flexShrink: 0 // Prevent shrinking
        }}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox 
                  size="small" 
                  checked={selectedOptions.includes('date')}
                  onChange={(e) => handleCheckboxChange('date', e.target.checked)}
                />
              }
              label={t('nav.view.date')}
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
              label={t('nav.view.specials')}
            />
          </FormGroup>
        </Box>

        {/* Mobile Dropdown Button */}
        <Box sx={{ 
          display: { xs: 'flex', md: 'none' }, 
          px: 2,
          flexShrink: 0
        }}>
          <IconButton
            onClick={handleDropdownOpen}
            size="small"
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleDropdownClose}
            PaperProps={{
              sx: {
                minWidth: 150,
              },
            }}
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
                label="Date"
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
                label="Specials"
                sx={{ width: '100%', margin: 0 }}
              />
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box 
        display="flex" 
        flexGrow={1} 
        width="100%" 
        overflow="hidden"
      >
        {/* Timetable Tab Panel - Contains the main calendar and sidebar */}
        <TabPanel value={tabIndex} index={0}>
          <TimetableSection
            selectedDate={selectedDate}
            onDateChange={handleSidebarDate}
            view={view}
            onView={handleViewChange}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={handleToggleSidebar}
            onSidebarDateSelect={handleSidebarDate}
          />
        </TabPanel>

        {/* Configuration Tab Panel - Contains timetable setup tools */}
        <TabPanel value={tabIndex} index={1}>
          <ConfiguratorSection />
        </TabPanel>
      </Box>
    </Box>
  )
}
