// src/App.jsx
import { useMemo } from 'react'
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material'
import { getTheme } from './theme'
import { TimetableProvider } from './context/TimetableContext'
import MainLayout from './layout/MainLayout'

function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = useMemo(() => getTheme(prefersDark ? 'dark' : 'light'), [prefersDark])

  return (
    <TimetableProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MainLayout />
      </ThemeProvider>
    </TimetableProvider>
  )
}

export default App