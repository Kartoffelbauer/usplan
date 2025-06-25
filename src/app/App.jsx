// src/App.jsx
import { useEffect, useMemo, useState } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { getTheme } from './theme/theme'
import { TimetableProvider } from '../shared/context/TimetableContext'
import MainLayout from './layouts/MainLayout'

function App() {
  const [mode, setMode] = useState('light')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      setMode(mediaQuery.matches ? 'dark' : 'light')
    }

    handleChange() // set initially
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const theme = useMemo(() => getTheme(mode), [mode])

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