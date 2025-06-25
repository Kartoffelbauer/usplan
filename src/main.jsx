import './app/styles/index.css'
import './shared/styles/exportStyles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './shared/i18n'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import App from './app/App'

// Defer rendering until full page load (safe for FOUC-sensitive apps)
function ReadyWrapper({ children }) {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    if (document.readyState === 'complete') {
      setReady(true)
    } else {
      const onLoad = () => setReady(true)
      window.addEventListener('load', onLoad)
      return () => window.removeEventListener('load', onLoad)
    }
  }, [])

  return ready ? children : null
}

// Render root
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ReadyWrapper>
        <App />
      </ReadyWrapper>
    </LocalizationProvider>
  </React.StrictMode>
)
