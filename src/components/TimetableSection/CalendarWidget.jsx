import { useCallback, useMemo } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, parse, startOfWeek, getDay, addMinutes, set } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import de from 'date-fns/locale/de'
import { Box, useTheme, useMediaQuery, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTimetable } from '../../context/TimetableContext'
import CalendarWrapper from '../../layout/CalendarWrapper'

const localeMap = { en: enUS, de }

const createLocalizer = (currentLocale) => dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { [currentLocale]: localeMap[currentLocale] },
})

export function rgbaColorToTheme(lightColor, theme, darkenFactor = 0.5) {
  if (theme.palette.mode !== 'dark') return lightColor

  const match = lightColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (!match) return lightColor

  const [r, g, b] = match.slice(1, 4).map((val) => Math.max(0, parseInt(val, 10) * (1 - darkenFactor)))
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1

  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`
}

export default function CalendarWidget({
  selectedDate,
  onDateChange,
  view,
  onView,
  events = [],
  showDates = true,
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { timetable } = useTimetable()
  const { i18n } = useTranslation()

  const currentLanguage = useMemo(() => {
    const lang = i18n.language.split('-')[0]
    return localeMap[lang] ? lang : 'en'
  }, [i18n.language])

  const localizer = useMemo(() => createLocalizer(currentLanguage), [currentLanguage])

  const calendarFormats = useMemo(() => ({
    dayFormat: showDates ? (currentLanguage === 'de' ? 'EEE dd' : 'dd EEE') : 'EEEE'
  }), [currentLanguage, showDates])

  const getTime = useCallback((minutes, fallback) =>
    addMinutes(set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), minutes || fallback), [])

  const minTime = useMemo(() => getTime(timetable?.beginTimeMinutes, 480), [timetable?.beginTimeMinutes, getTime])
  const maxTime = useMemo(() => getTime(timetable?.endTimeMinutes, 1080), [timetable?.endTimeMinutes, getTime])

  const currentView = isMobile ? 'day' : view
  const availableViews = isMobile ? ['day'] : ['week']
  const defaultView = isMobile ? 'day' : 'week'

  const handleNavigate = useCallback((newDate) => onDateChange(newDate), [onDateChange])
  const handleViewChange = useCallback((newView) => onView(newView), [onView])

  const getEventProps = useCallback((event) => ({
    style: {
      backgroundColor: rgbaColorToTheme(event.lightColor, theme) || theme.palette.primary.main,
    },
  }), [theme])

  return (
    <Box
      flexGrow={1}
      overflow="hidden"
      sx={{ display: 'flex', flexDirection: 'column', height: '100%', padding: isMobile ? 0 : 2 }}
    >
      <CalendarWrapper>
        {currentView === 'day' && (
          <Box sx={{ paddingBottom: 1, display: 'flex', justifyContent: 'center' }}>
            <Typography component="div" sx={{ fontWeight: 'normal', fontSize: '1rem' }}>
              {format(selectedDate, calendarFormats.dayFormat, { locale: localeMap[currentLanguage] })}
            </Typography>
          </Box>
        )}
        <Calendar
          key={`calendar-${currentLanguage}-${showDates}`}
          localizer={localizer}
          culture={currentLanguage}
          events={events}
          startAccessor="start"
          endAccessor="end"
          min={minTime}
          max={maxTime}
          date={selectedDate}
          view={currentView}
          defaultView={defaultView}
          views={availableViews}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          formats={calendarFormats}
          toolbar={false}
          style={{ width: '100%', height: '100%' }}
          eventPropGetter={getEventProps}
        />
      </CalendarWrapper>
    </Box>
  )
}
