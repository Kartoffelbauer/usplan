
import { useEffect, useState } from 'react'
import {
  getSemesters,
  getStudyPrograms,
  getGroups,
  getTimetable,
} from '../services/timetableService'

export function useTimetableData(selectedSemester, selectedProgram, selectedGroup) {
  const [semesters, setSemesters] = useState([])
  const [programs, setPrograms] = useState([])
  const [groups, setGroups] = useState([])
  const [timetable, setTimetable] = useState(undefined)

  const [loadingSemesters, setLoadingSemesters] = useState(false)
  const [loadingPrograms, setLoadingPrograms] = useState(false)
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [loadingTimetable, setLoadingTimetable] = useState(false)
  const [error, setError] = useState(null)

  // Load semesters on mount
  useEffect(() => {
    setLoadingSemesters(true)
    getSemesters()
      .then(setSemesters)
      .catch(setError)
      .finally(() => setLoadingSemesters(false))
  }, [])

  // Load programs when semester is selected
  useEffect(() => {
    if (!selectedSemester) return
    setLoadingPrograms(true)
    getStudyPrograms(selectedSemester)
      .then(setPrograms)
      .catch(setError)
      .finally(() => setLoadingPrograms(false))
  }, [selectedSemester])

  // Load groups when both semester and program are selected
  useEffect(() => {
    if (!selectedSemester || !selectedProgram) return
    setLoadingGroups(true)
    getGroups(selectedSemester, selectedProgram)
      .then(setGroups)
      .catch(setError)
      .finally(() => setLoadingGroups(false))
  }, [selectedSemester, selectedProgram])

  // Load timetable
  useEffect(() => {
    if (!selectedSemester || !selectedProgram || !selectedGroup) return
    setLoadingTimetable(true)
    getTimetable(selectedSemester, selectedProgram, selectedGroup)
      .then(setTimetable)
      .catch(setError)
      .finally(() => setLoadingTimetable(false))
  }, [selectedSemester, selectedProgram, selectedGroup])

  return {
    semesters,
    programs,
    groups,
    timetable,
    loading: {
      semesters: loadingSemesters,
      programs: loadingPrograms,
      groups: loadingGroups,
      timetable: loadingTimetable,
    },
    error,
  }
}