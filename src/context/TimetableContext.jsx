import { createContext, useContext, useEffect, useState } from 'react'
import {
  getSemesters,
  getStudyCourses,
  getStudyGroups,
  getTimetable,
} from '../services/timetableService'

const TimetableContext = createContext()

export const TimetableProvider = ({ children }) => {
  const [semesters, setSemesters] = useState([])
  const [studyCourses, setStudyCourses] = useState([])
  const [studyGroups, setStudyGroups] = useState([])
  const [timetable, setTimetable] = useState(undefined)

  const [loadingSemesters, setLoadingSemesters] = useState(false)
  const [loadingStudyCourses, setLoadingStudyCourses] = useState(false)
  const [loadingStudyGroups, setLoadingStudyGroups] = useState(false)
  const [loadingTimetable, setLoadingTimetable] = useState(false)
  const [error, setError] = useState(null)

  const [selectedSemester, setSelectedSemester] = useState('')
  const [selectedStudyCourse, setSelectedStudyCourse] = useState('')
  const [selectedStudyGroup, setSelectedStudyGroup] = useState('')

  // Load semesters first
  useEffect(() => {
    setLoadingSemesters(true)
    getSemesters()
      .then(setSemesters)
      .catch(setError)
      .finally(() => setLoadingSemesters(false))
  }, [])

  // Load study courses when semester is selected
  useEffect(() => {
    if (!selectedSemester) return
    setLoadingStudyCourses(true)
    getStudyCourses(selectedSemester)
      .then(setStudyCourses)
      .catch(setError)
      .finally(() => setLoadingStudyCourses(false))
  }, [selectedSemester])

  // Load groups when both semester and study course are selected
  useEffect(() => {
    if (!selectedSemester || !selectedStudyCourse) return
    setLoadingStudyGroups(true)
    getStudyGroups(selectedSemester, selectedStudyCourse)
      .then(setStudyGroups)
      .catch(setError)
      .finally(() => setLoadingStudyGroups(false))
  }, [selectedSemester, selectedStudyCourse])

  // Finally load the timetable
  useEffect(() => {
    if (!selectedSemester || !selectedStudyCourse || !selectedStudyGroup) return
    setLoadingTimetable(true)
    getTimetable(selectedSemester, selectedStudyCourse, selectedStudyGroup)
      .then(setTimetable)
      .catch(setError)
      .finally(() => setLoadingTimetable(false))
  }, [selectedSemester, selectedStudyCourse, selectedStudyGroup])

  return (
    <TimetableContext.Provider
      value={{
        semesters,
        studyCourses,
        studyGroups,
        timetable,
        selectedSemester,
        selectedStudyCourse,
        selectedStudyGroup,
        setSelectedSemester,
        setSelectedStudyCourse,
        setSelectedStudyGroup,
        loading: {
            semesters: loadingSemesters,
            studyCourses: loadingStudyCourses,
            studyGroups: loadingStudyGroups,
            timetable: loadingTimetable,
        },
        error,
      }}
    >
      {children}
    </TimetableContext.Provider>
  )
}

export const useTimetable = () => useContext(TimetableContext)
