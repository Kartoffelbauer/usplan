import { createTheme } from '@mui/material/styles'

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          background: { secondary: '#eeeeee' },
        }
      : {
          background: { secondary: '#1b1b1b' },
        }),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 0.3s, color 0.3s',
        },
      },
    },
  },
})