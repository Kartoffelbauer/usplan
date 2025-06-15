import { createContext, useContext, useEffect, useState } from 'react'
import {
  getLocations,
  getSemesters,
  getStudyCourses,
  getStudyGroups,
  getRooms,
  getTimetableForCourses,
  getTimetableForRooms,
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
  const [selectedViewMode, setSelectedViewMode] = useState('course') // Course or room view

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
      .then(val => {
        setRooms(val)
        if (val.length > 0) {
          setSelectedRoom(val[0])
        }
      })
      .catch(setError)
      .finally(() => setLoadingRooms(false))
  }, [selectedLocation])

  // Load the timetable when semester and study group are selected
  useEffect(() => {
    if (!selectedSemester || !selectedViewMode
        || (selectedViewMode === 'course' && !selectedStudyGroup)
        || (selectedViewMode === 'room' && !selectedRoom)) {
      setTimetable(undefined)
      return
    }

    setLoadingTimetable(true)
    
    var promise = null
    if (selectedViewMode === 'course') {
      promise = getTimetableForCourses(selectedSemester.id, selectedStudyGroup.id)
    }
    else {
      promise = getTimetableForRooms(selectedSemester.id, selectedRoom.id)
    }

    promise.then(setTimetable).catch(setError).finally(() => setLoadingTimetable(false))
  }, [selectedSemester, selectedStudyGroup, selectedRoom, selectedViewMode])

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
        selectedViewMode,
        setSelectedLocation,
        setSelectedSemester,
        setSelectedStudyCourse,
        setSelectedStudyGroup,
        setSelectedRoom,
        setSelectedViewMode,
        loading: {
          locations: loadingLocations,
          semesters: loadingSemesters,
          studyCourses: loadingStudyCourses,
          studyGroups: loadingStudyGroups,
          rooms: loadingRooms,
          loadingTimetable: loadingTimetable,
        },
        error,
      }}
    >
      {children}
    </TimetableContext.Provider>
  )
}

export const useTimetable = () => useContext(TimetableContext)
