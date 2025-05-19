import React, { useState } from 'react'
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
  CircularProgress,
} from '@mui/material'
import { useTimetableData } from '../../hooks/useTimetableData'

export default function Sidebar({ onDateSelect }) {
  const [selectedSemester, setSelectedSemester] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [viewMode, setViewMode] = useState('course')

  const {
    semesters,
    programs,
    groups,
    loading,
    error,
  } = useTimetableData(selectedSemester, selectedProgram, selectedGroup)

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
            setSelectedProgram('')
            setSelectedGroup('')
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
        disabled={!selectedSemester || loading.programs || error}
      >
        <InputLabel id="study-label">Study Program</InputLabel>
        <Select
          labelId="study-label"
          value={selectedProgram}
          label="Study Program"
          onChange={(e) => {
            setSelectedProgram(e.target.value)
            setSelectedGroup('')
          }}
        >
          {programs.map((prog) => (
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
        disabled={!selectedSemester || !selectedProgram || loading.groups || error}
      >
        <InputLabel id="group-label">Group</InputLabel>
        <Select
          labelId="group-label"
          value={selectedGroup}
          label="Group"
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          {groups.map((group) => (
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

      {/* Loading and Error State */}
      {(loading.semesters || loading.programs || loading.groups) && (
        <Box display="flex" justifyContent="center">
          <CircularProgress size={20} sx={{ mt: 2 }} />
        </Box>
      )}
      {error && <Typography color="error">Failed to load data</Typography>}
    </Box>
  )
}
