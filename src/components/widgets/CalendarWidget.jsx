import { useCallback, useMemo } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, parse, startOfWeek, getDay, addMinutes, set } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import de from 'date-fns/locale/de'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTimetable } from '../../context/TimetableContext'
import { rgbaColorToTheme } from '../../utils/themeUtils'
import CalendarWrapper from '../layout/CalendarWrapper'

const localeMap = { en: enUS, de }

/**
 * Creates a date-fns localizer for react-big-calendar
 * 
 * @param {string} currentLocale - The current locale to use for localization
 * @returns {Object} The localizer object for react-big-calendar
 */
const createLocalizer = (currentLocale) => dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { [currentLocale]: localeMap[currentLocale] },
})

/**
 * CalendarWidget component that displays a calendar with events
 * Supports day and week views, localization, and custom event styling
 *
 * @param {Object} props - Component props
 * @param {Date} props.selectedDate - Currently selected date
 * @param {string} props.view - Current view ('day' or 'week')
 * @param {Function} props.onDateChange - Callback for date changes
 * @param {Array} props.events - Array of events to display
 * @param {boolean} [props.showDates=true] - Whether to show dates in the header
 * @returns {JSX.Element} The rendered calendar widget
 */
export default function CalendarWidget({
  selectedDate,
  view,
  onDateChange,
  events = [],
  showDates = true,
}) {
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

  const handleNavigate = useCallback((newDate) => onDateChange(newDate), [onDateChange])

  const getEventProps = useCallback((event) => ({
    style: {
      backgroundColor: rgbaColorToTheme(event.lightColor)
    },
  }))

  return (
    <CalendarWrapper>
      {view === 'day' && (
        <Box sx={{ paddingBottom: 1, display: 'flex', justifyContent: 'center' }}>
          <Typography variant='body1'>
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
        view={view}
        defaultView={view}
        views={['day', 'week']}
        onNavigate={handleNavigate}
        formats={calendarFormats}
        toolbar={false}
        style={{ width: '100%', height: '100%' }}
        eventPropGetter={getEventProps}
      />
    </CalendarWrapper>
  )
}
