import { useCallback } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTimetable } from '../../../../shared/context/TimetableContext'

/**
 * Room filter widget for selecting locations and rooms.
 * 
 * @returns {JSX.Element} The rendered room filter widget
 */
export default function RoomFilterWidget() {
  const { t } = useTranslation()
  const {
    selectedSemester,
    locations,
    rooms,
    selectedLocation,
    selectedRoom,
    loading,
    error,
    setSelectedLocation,
    setSelectedRoom,
  } = useTimetable()

  const handleLocationChange = useCallback((_, newValue) => {
    setSelectedLocation(newValue)
    setSelectedRoom(null)
  }, [setSelectedLocation, setSelectedRoom])

  const handleRoomChange = useCallback((_, newValue) => {
    setSelectedRoom(newValue)
  }, [setSelectedRoom])

  return (
    <>
      <Autocomplete
        fullWidth
        size="small"
        disabled={!selectedSemester || loading.locations || error}
        options={locations || []}
        getOptionLabel={(option) => option.shortName}
        value={selectedLocation}
        onChange={handleLocationChange}
        renderInput={(params) => (
          <TextField {...params} label={t('sidebar.selection.room.location')} variant="outlined" />
        )}
      />
      <Autocomplete
        fullWidth
        size="small"
        disabled={!selectedSemester || !selectedLocation || loading.rooms || error}
        options={rooms || []}
        getOptionLabel={(option) => option.shortName}
        value={selectedRoom}
        onChange={handleRoomChange}
        renderInput={(params) => (
          <TextField {...params} label={t('sidebar.selection.room.title')} variant="outlined" />
        )}
      />
    </>
  )
}