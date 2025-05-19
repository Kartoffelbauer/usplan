import { CssBaseline, Box } from '@mui/material'
import MainLayout from './layout/MainLayout'
import './index.css'

function App() {
  return (
    <>
      <CssBaseline />
      <Box sx={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <MainLayout />
      </Box>
    </>
  )
}

export default App