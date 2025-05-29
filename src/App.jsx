import { TimetableProvider } from './context/TimetableContext'
import { CssBaseline } from '@mui/material'
import MainLayout from './layout/MainLayout'
import './index.css'

function App() {
  return (
    <TimetableProvider>
      <CssBaseline />
      <MainLayout />
    </TimetableProvider>
  )
}

export default App