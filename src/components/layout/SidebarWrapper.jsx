import React from 'react'
import { Box, Drawer, useTheme } from '@mui/material'
import { useCheckMobile } from '../../utils/themeUtils'

/**
 * Wrapper for sidebar layout
 * Handles consistent padding, spacing, and full-height flex layout
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render inside the sidebar
 * @param {boolean} props.sidebarOpen - Whether the sidebar is open
 * @param {Function} props.onToggleSidebar - Function to toggle sidebar visibility
 * @returns {JSX.Element} The rendered sidebar wrapper component
 */
export default function SidebarWrapper({ children, sidebarOpen, onToggleSidebar }) {
  const theme = useTheme()
  const isMobile = useCheckMobile()

  return (
    <>
      {/* Desktop Sidebar with Animation */}
      {!isMobile && (
        <Box
          className="no-print"
          sx={{
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
              width: 300,
              maxHeight: '100vh',
              height: '100%',
              overflowY: 'auto',
              marginLeft: sidebarOpen ? 0 : '-300px',
              gap: 2,
              p: 2,
              pt: 4,
              backgroundColor: theme.palette.background.secondary,
              transition: theme.transitions.create(['margin-left'], {
              easing: theme.transitions.easing.sharp,
              duration: sidebarOpen
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
              }),
          }}
        >
          {children}
        </Box>
      )}
      {isMobile && (
        <Drawer
          className="no-print"
          open={sidebarOpen}
          onClose={onToggleSidebar}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: 320,
              backgroundColor: theme.palette.background.secondary,
              border: 'none',
              gap: 2,
              p: 2,
              pt: 4,
            },
          }}
          transitionDuration={{
            enter: theme.transitions.duration.enteringScreen,
            exit: theme.transitions.duration.leavingScreen,
          }}
        >
          {children}
        </Drawer>
      )}
    </>
  )
}
