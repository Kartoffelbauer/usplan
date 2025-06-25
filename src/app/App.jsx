import { useMemo } from 'react'
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material'
import { getTheme } from './theme/theme'
import { TimetableProvider } from '../shared/context/TimetableContext'
import MainLayout from './layouts/MainLayout'

function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)', { noSsr: true })
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