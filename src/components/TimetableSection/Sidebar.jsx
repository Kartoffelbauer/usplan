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
import { useTimetable } from '../../context/TimetableContext'

export default function Sidebar() {
  const [viewMode, setViewMode] = React.useState('course')
  const {
    semesters,
    studyCourses,
    studyGroups,
    selectedSemester,
    setSelectedSemester,
    selectedStudyCourse,
    setSelectedStudyCourse,
    selectedStudyGroup,
    setSelectedStudyGroup,
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
          value={selectedSemester}
          label="Semester"
          onChange={(e) => {
            setSelectedSemester(e.target.value)
            setSelectedStudyCourse('')
            setSelectedStudyGroup('')
          }}
        >
          {semesters.map((sem) => (
            <MenuItem key={sem.id} value={sem.id}>
              {sem.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Study Program Select */}
      <FormControl
        fullWidth
        size="small"
        disabled={!selectedSemester || loading.studyCourses || error}
      >
        <InputLabel id="study-label">Study Program</InputLabel>
        <Select
          labelId="study-label"
          value={selectedStudyCourse}
          label="Study Program"
          onChange={(e) => {
            setSelectedStudyCourse(e.target.value)
            setSelectedStudyGroup('')
          }}
        >
          {studyCourses.map((prog) => (
            <MenuItem key={prog.id} value={prog.id}>
              {prog.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Group Select */}
      <FormControl
        fullWidth
        size="small"
        disabled={!selectedSemester || !selectedStudyCourse || loading.studyGroups || error}
      >
        <InputLabel id="group-label">Group</InputLabel>
        <Select
          labelId="group-label"
          value={selectedStudyGroup}
          label="Group"
          onChange={(e) => setSelectedStudyGroup(e.target.value)}
        >
          {studyGroups.map((group) => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
