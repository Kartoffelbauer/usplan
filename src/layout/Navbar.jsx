import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

export default function Navbar({ onMenuClick }) {
  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left: Menu button for mobile */}
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            onClick={onMenuClick}
          >
          <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Timetables HHN
          </Typography>
        </Box>

        {/* Right: User avatar or settings icon */}
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 14 }}>
          A
        </Avatar>
      </Toolbar>
    </AppBar>
  )
}