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

  const [selectedSemesterId, setSelectedSemesterId] = useState(undefined)
  const [selectedStudyCourseId, setSelectedStudyCourseId] = useState(undefined)
  const [selectedStudyGroupId, setSelectedStudyGroupId] = useState(undefined)

  // Load semesters first
  useEffect(() => {
    setLoadingSemesters(true)
    getSemesters()
      .then(val => {
        setSemesters(val)
        if (val.length > 0) {
          setSelectedSemesterId(val[0].id)
        }
      })
      .catch(setError)
      .finally(() => setLoadingSemesters(false))
  }, [])

  // Load study courses when semester is selected
  useEffect(() => {
    if (!selectedSemesterId) {
      setStudyCourses([])
      return
    }

    setLoadingStudyCourses(true)
    getStudyCourses(selectedSemesterId)
      .then(setStudyCourses)
      .catch(setError)
      .finally(() => setLoadingStudyCourses(false))
  }, [selectedSemesterId])

  // Load groups when both semester and study course are selected
  useEffect(() => {
    if (!selectedSemesterId || !selectedStudyCourseId) {
      setStudyGroups([])
      return
    }

    setLoadingStudyGroups(true)
    getStudyGroups(selectedSemesterId, selectedStudyCourseId)
      .then(val => {
        setStudyGroups(val)
        if (val.length > 0) {
          setSelectedStudyGroupId(val[0].id)
        }
      })
      .catch(setError)
      .finally(() => setLoadingStudyGroups(false))
  }, [selectedSemesterId, selectedStudyCourseId])

  // Finally load the timetable
  useEffect(() => {
    if (!selectedSemesterId || !selectedStudyCourseId || !selectedStudyGroupId) {
      setTimetable(undefined)
      return
    }

    setLoadingTimetable(true)
    getTimetable(selectedSemesterId, selectedStudyCourseId, selectedStudyGroupId)
      .then(setTimetable)
      .catch(setError)
      .finally(() => setLoadingTimetable(false))
  }, [selectedSemesterId, selectedStudyCourseId, selectedStudyGroupId])

  return (
    <TimetableContext.Provider
      value={{
        semesters,
        studyCourses,
        studyGroups,
        timetable,
        selectedSemesterId,
        selectedStudyCourseId,
        selectedStudyGroupId,
        setSelectedSemesterId,
        setSelectedStudyCourseId,
        setSelectedStudyGroupId,
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
