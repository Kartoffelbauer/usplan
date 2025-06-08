import { createContext, useContext, useEffect, useState } from 'react'
import {
  getLocations,
  getSemesters,
  getStudyCourses,
  getStudyGroups,
  getTimetable,
} from '../services/timetableService'

const TimetableContext = createContext()

export const TimetableProvider = ({ children }) => {
  const [locations, setLocations] = useState([])
  const [semesters, setSemesters] = useState([])
  const [studyCourses, setStudyCourses] = useState([])
  const [studyGroups, setStudyGroups] = useState([])
  const [timetable, setTimetable] = useState(undefined)

  const [loadingLocations, setLoadingLocations] = useState(false)
  const [loadingSemesters, setLoadingSemesters] = useState(false)
  const [loadingStudyCourses, setLoadingStudyCourses] = useState(false)
  const [loadingStudyGroups, setLoadingStudyGroups] = useState(false)
  const [loadingTimetable, setLoadingTimetable] = useState(false)
  const [error, setError] = useState(null)

  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedSemester, setSelectedSemester] = useState(null)
  const [selectedStudyCourse, setSelectedStudyCourse] = useState(null)
  const [selectedStudyGroup, setSelectedStudyGroup] = useState(null)

  // Load semesters first
  useEffect(() => {
      setLoadingLocations(true)
      getLocations()
        .then(val => {
          setLocations(val)
          if (val.length > 0) {
            setSelectedLocation(val[0])
          }
          console.log('Locations loaded:', val)
        })
        .catch(setError)
        .finally(() => setLoadingLocations(false))

    setLoadingSemesters(true)
    getSemesters()
      .then(val => {
        setSemesters(val)
        if (val.length > 0) {
          setSelectedSemester(val[0])
          console.log('Semesters loaded:', val)
        }
      })
      .catch(setError)
      .finally(() => setLoadingSemesters(false))
  }, [])

  // Load study courses when semester is selected
  useEffect(() => {
    if (!selectedSemester) {
      setStudyCourses([])
      setSelectedStudyCourse(null)
      return
    }

    setLoadingStudyCourses(true)
    getStudyCourses(selectedSemester.id)
      .then(setStudyCourses)
      .catch(setError)
      .finally(() => setLoadingStudyCourses(false))
  }, [selectedSemester])

  // Load groups when both semester and study course are selected
  useEffect(() => {
    if (!selectedSemester || !selectedStudyCourse) {
      setStudyGroups([])
      setSelectedStudyGroup(null)
      return
    }

    setLoadingStudyGroups(true)
    getStudyGroups(selectedSemester.id, selectedStudyCourse.id)
      .then(val => {
        setStudyGroups(val)
        if (val.length > 0) {
          setSelectedStudyGroup(val[0])
        }
      })
      .catch(setError)
      .finally(() => setLoadingStudyGroups(false))
  }, [selectedSemester, selectedStudyCourse])

  // Finally load the timetable
  useEffect(() => {
    if (!selectedSemester || !selectedStudyCourse || !selectedStudyGroup) {
      setTimetable(undefined)
      return
    }

    setLoadingTimetable(true)
    getTimetable(selectedSemester.id, selectedStudyCourse.id, selectedStudyGroup.id)
      .then(setTimetable)
      .catch(setError)
      .finally(() => setLoadingTimetable(false))
  }, [selectedSemester, selectedStudyCourse, selectedStudyGroup])

  return (
    <TimetableContext.Provider
      value={{
        locations,
        semesters,
        studyCourses,
        studyGroups,
        timetable,
        selectedLocation,
        selectedSemester,
        selectedStudyCourse,
        selectedStudyGroup,
        setSelectedSemester,
        setSelectedStudyCourse,
        setSelectedStudyGroup,
        loading: {
          locations: loadingLocations,
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
