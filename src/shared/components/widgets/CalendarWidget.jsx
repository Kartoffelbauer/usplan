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
import CalendarWrapper from '../layouts/CalendarWrapper'

const localeMap = { en: enUS, de }

const createLocalizer = (currentLocale) =>
  dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales: { [currentLocale]: localeMap[currentLocale] },
  })

/**
 * Custom event content renderer for the calendar
 */
function renderEventContent({ event }) {
  const lecture = event.lecture || ''
  const rooms = Array.isArray(event.rooms) ? event.rooms.join(', ') : event.rooms
  const lecturers = Array.isArray(event.lecturers) ? event.lecturers.join(', ') : event.lecturers
  const studyGroups = Array.isArray(event.studyGroups) ? event.studyGroups.join(', ') : event.studyGroups

  const tooltip = [lecture, rooms, lecturers, studyGroups]
    .filter(Boolean)
    .join('\n')

  const ellipsisStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  return (
    <Box title={tooltip} height={'100%'}>
      <Typography variant="body2" fontWeight="bold" sx={ellipsisStyle}>
        {lecture}
      </Typography>
      {rooms && (
        <Typography variant="body2" sx={ellipsisStyle}>
          {rooms}
        </Typography>
      )}
      {lecturers && (
        <Typography variant="caption" color="text.secondary" display="block" sx={ellipsisStyle}>
          {lecturers}
        </Typography>
      )}
      {studyGroups && (
        <Typography variant="caption" color="text.secondary" display="block" sx={ellipsisStyle}>
          {studyGroups}
        </Typography>
      )}
    </Box>
  )
}

/**
 * CalendarWidget component that displays a calendar with events
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
  }), [])

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
        components={{
          event: renderEventContent
        }}
      />
    </CalendarWrapper>
  )
}
