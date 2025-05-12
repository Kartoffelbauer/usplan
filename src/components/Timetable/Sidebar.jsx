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
} from '@mui/material'

export default function Sidebar({ onDateSelect }) {
  const [semester, setSemester] = useState('SS2025')
  const [studyProgram, setStudyProgram] = useState('Informatics')
  const [viewMode, setViewMode] = useState('course')

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
      <FormControl fullWidth size="small">
        <InputLabel id="semester-label">Semester</InputLabel>
        <Select
          labelId="semester-label"
          value={semester}
          label="Semester"
          onChange={(e) => setSemester(e.target.value)}
        >
          <MenuItem value="SS2025">SS 2025</MenuItem>
          <MenuItem value="WS2024">WS 2024/25</MenuItem>
          <MenuItem value="SS2024">SS 2024</MenuItem>
        </Select>
      </FormControl>

      {/* Study Program */}
      <FormControl fullWidth size="small">
        <InputLabel id="study-label">Study Program</InputLabel>
        <Select
          labelId="study-label"
          value={studyProgram}
          label="Study Program"
          onChange={(e) => setStudyProgram(e.target.value)}
        >
          <MenuItem value="Informatics">Informatics</MenuItem>
          <MenuItem value="Business IT">Business IT</MenuItem>
          <MenuItem value="Mechanical Engineering">Mechanical Engineering</MenuItem>
        </Select>
      </FormControl>

      {/* Selection */}
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
