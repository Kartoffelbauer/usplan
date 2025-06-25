import { createTheme } from '@mui/material/styles'

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            background: {
              default: '#ffffff',
              paper: '#f5f5f5',
              secondary: '#eeeeee',
            },
          }
        : {
            background: {
              default: '#121212',
              paper: '#1e1e1e',
              secondary: '#1b1b1b',
            },
          }),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s, color 0.3s',
            backgroundColor: mode === 'dark' ? '#121212' : '#ffffff',
            color: mode === 'dark' ? '#ffffff' : '#000000',
          },
        },
      },
    },
  })
