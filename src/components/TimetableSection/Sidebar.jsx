import React from 'react'
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  ButtonGroup,
  Button,
} from '@mui/material'
import { Autocomplete, useTheme } from '@mui/material'
import TextField from '@mui/material/TextField'
import { useTimetable } from '../../context/TimetableContext'

export default function Sidebar() {
  const theme = useTheme()
  const [viewMode, setViewMode] = React.useState('course')
  const {
    semesters,
    studyCourses,
    studyGroups,
    selectedSemesterId,
    setSelectedSemesterId,
    selectedStudyCourseId,
    setSelectedStudyCourseId,
    selectedStudyGroupId,
    setSelectedStudyGroupId,
    loading,
    error,
  } = useTimetable()
  

  const handleExportPDF = () => {
    console.log('Exporting to PDF...')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Box
      width="100%"
      p={2}
      pt={4}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        boxSizing: 'border-box',
      }}
    >
      {/* Semester Select */}
      <FormControl fullWidth size="small" disabled={loading.semesters || error}>
        <InputLabel id="semester-label">Semester</InputLabel>
        <Select
          labelId="semester-label"
          value={semesters.find((sem) => sem.id === selectedSemesterId)?.id || ''}
          label="Semester"
          onChange={(e) => {
            setSelectedSemesterId(e.target.value)
            setSelectedStudyCourseId('')
            setSelectedStudyGroupId('')
          }}
        >
          {semesters.map((sem) => (
            <MenuItem key={sem.id} value={sem.id} style={{ whiteSpace: 'nowrap' }}>
              <span>{sem.shortName}</span>
              <span
                style={{
                  color: theme.palette.text.secondary,
                  marginLeft: theme.spacing(1),
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                - {sem.name}
              </span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Study Program Autocomplete */}
      <Autocomplete
        fullWidth
        size="small"
        disabled={!selectedSemesterId || loading.studyCourses || error}
        options={studyCourses}
        getOptionLabel={(option) => `${option.shortName} - ${option.name}`}
        value={studyCourses.find((prog) => prog.id === selectedStudyCourseId) || null}
        onChange={(_, newValue) => {
          setSelectedStudyCourseId(newValue ? newValue.id : undefined)
          setSelectedStudyGroupId(undefined)
        }}
        renderOption={(props, option) => {
          const { key, ...rest } = props
          return (
            <li key={option.id} {...rest} style={{ display: 'flex', alignItems: 'center', minWidth: 0, whiteSpace: 'nowrap' }}>
              <span>
                {option.shortName}
              </span>
              <span
                style={{
                  color: theme.palette.text.secondary,
                  marginLeft: theme.spacing(1),
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                – {option.name}
              </span>
            </li>
          )
        }}
        renderInput={(params) => (
          <TextField {...params} label="Study Program" variant="outlined" />
        )}
      />

      {/* Group Autocomplete */}
      <Autocomplete
        fullWidth
        size="small"
        disabled={!selectedSemesterId || !selectedStudyCourseId || loading.studyGroups || error}
        options={studyGroups}
        getOptionLabel={(option) => option.shortName }
        value={studyGroups.find((group) => group.id === selectedStudyGroupId) || null}
        onChange={(_, newValue) => {
          setSelectedStudyGroupId(newValue ? newValue.id : undefined)
        }}
        renderInput={(params) => (
          <TextField {...params} label="Group" variant="outlined" />
        )}
      />

      {/* Selection Toggle */}
      <Box>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Selection
        </Typography>
        <ToggleButtonGroup
          fullWidth
          size="small"
          exclusive
          value={viewMode}
          onChange={(e, v) => v !== null && setViewMode(v)}
        >
          <ToggleButton value="course">Course</ToggleButton>
          <ToggleButton value="room">Room</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Divider />

      {/* Export */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Export
        </Typography>
        <ButtonGroup fullWidth variant="outlined">
          <Button onClick={handleExportPDF}>PDF</Button>
          <Button onClick={handlePrint}>Print</Button>
        </ButtonGroup>
      </Box>
    </Box>
  )
}
