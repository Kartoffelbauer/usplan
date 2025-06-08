import { createContext, useContext, useEffect, useState } from 'react'
import {
  getLocations,
  getSemesters,
  getStudyCourses,
  getStudyGroups,
  getRooms,
  getTimetable,
} from '../services/timetableService'

const TimetableContext = createContext()

export const TimetableProvider = ({ children }) => {
  const [locations, setLocations] = useState([])
  const [semesters, setSemesters] = useState([])
  const [studyCourses, setStudyCourses] = useState([])
  const [studyGroups, setStudyGroups] = useState([])
  const [rooms, setRooms] = useState([])
  const [timetable, setTimetable] = useState(undefined)

  const [loadingLocations, setLoadingLocations] = useState(false)
  const [loadingSemesters, setLoadingSemesters] = useState(false)
  const [loadingStudyCourses, setLoadingStudyCourses] = useState(false)
  const [loadingStudyGroups, setLoadingStudyGroups] = useState(false)
  const [loadingRooms, setLoadingRooms] = useState(false)
  const [loadingTimetable, setLoadingTimetable] = useState(false)
  const [error, setError] = useState(null)

  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedSemester, setSelectedSemester] = useState(null)
  const [selectedStudyCourse, setSelectedStudyCourse] = useState(null)
  const [selectedStudyGroup, setSelectedStudyGroup] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)

  // Load locations and semesters first
  useEffect(() => {
      setLoadingLocations(true)
      getLocations()
        .then(setLocations)
        .catch(setError)
        .finally(() => setLoadingLocations(false))

    setLoadingSemesters(true)
    getSemesters()
      .then(val => {
        setSemesters(val)
        if (val.length > 0) {
          setSelectedSemester(val[0])
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

  // Load study groups when both semester and study course are selected
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

  // Load rooms when location is selected
  useEffect(() => {
    if (!selectedLocation) {
      setRooms([])
      setSelectedRoom(null)
      return
    }

    setLoadingRooms(true)
    getRooms(selectedLocation.id)
      .then(setRooms)
      .catch(setError)
      .finally(() => setLoadingRooms(false))
  }, [selectedLocation])

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
        rooms,
        timetable,
        selectedLocation,
        selectedSemester,
        selectedStudyCourse,
        selectedStudyGroup,
        selectedRoom,
        setSelectedLocation,
        setSelectedSemester,
        setSelectedStudyCourse,
        setSelectedStudyGroup,
        setSelectedRoom,
        loading: {
          locations: loadingLocations,
          semesters: loadingSemesters,
          studyCourses: loadingStudyCourses,
          studyGroups: loadingStudyGroups,
          rooms: loadingRooms,
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
