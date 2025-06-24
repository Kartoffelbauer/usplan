import { useEffect, useState } from 'react'
import {
  getLocations,
  getSemesters,
  getStudyCourses,
  getStudyGroups,
  getLectures,
  getRooms,
  getTimetableForCourses,
  getTimetableForRooms,
  getTimetableForLectures,
} from '../services/timetableService'

export const useTimetableData = () => {
  const [locations, setLocations] = useState([])
  const [semesters, setSemesters] = useState([])
  const [studyCourses, setStudyCourses] = useState([])
  const [studyGroups, setStudyGroups] = useState([])
  const [lectures, setLectures] = useState([])
  const [rooms, setRooms] = useState([])
  const [selectedLectures, setSelectedLectures] = useState([])
  const [timetable, setTimetable] = useState(undefined)

  const [loadingLocations, setLoadingLocations] = useState(false)
  const [loadingSemesters, setLoadingSemesters] = useState(false)
  const [loadingStudyCourses, setLoadingStudyCourses] = useState(false)
  const [loadingStudyGroups, setLoadingStudyGroups] = useState(false)
  const [loadingLectures, setLoadingLectures] = useState(false)
  const [loadingRooms, setLoadingRooms] = useState(false)
  const [loadingTimetable, setLoadingTimetable] = useState(false)

  const [error, setError] = useState(null)

  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedSemester, setSelectedSemester] = useState(null)
  const [selectedStudyCourse, setSelectedStudyCourse] = useState(null)
  const [selectedStudyGroup, setSelectedStudyGroup] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedTimetable, setSelectedTimetable] = useState('course')

  // Load initial data
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

  // Load study courses
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

  // Load study groups
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

  // Load lectures
  useEffect(() => {
    if (!selectedSemester || !selectedStudyGroup) {
      setLectures([])
      setSelectedLectures([])
      return
    }
    setLoadingLectures(true)
    getLectures(selectedSemester.id, selectedStudyGroup.id)
      .then(setLectures)
      .catch(setError)
      .finally(() => setLoadingLectures(false))
  }, [selectedSemester, selectedStudyGroup])

  // Load rooms
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

  // Load timetable
  useEffect(() => {
    if (
      !selectedSemester || !selectedTimetable ||
      (selectedTimetable === 'course' && !selectedStudyGroup) ||
      (selectedTimetable === 'room' && !selectedRoom) ||
      (selectedTimetable === 'config' && (!selectedLectures || selectedLectures.length === 0))
    ) {
      setTimetable(undefined)
      return
    }

    setLoadingTimetable(true)

    let fetchFn;
    if (selectedTimetable === 'course') {
      fetchFn = () => getTimetableForCourses(selectedSemester.id, selectedStudyGroup.id);
    } else if (selectedTimetable === 'room') {
      fetchFn = () => getTimetableForRooms(selectedSemester.id, selectedRoom.id);
    } else if (selectedTimetable === 'config') {
      fetchFn = () => getTimetableForLectures(selectedSemester.id, selectedLectures.flatMap(obj => obj.id));
    }

    fetchFn()
      .then(setTimetable)
      .catch(setError)
      .finally(() => setLoadingTimetable(false))
  }, [selectedSemester, selectedStudyGroup, selectedRoom, selectedLectures, selectedTimetable])

  return {
    locations,
    semesters,
    studyCourses,
    studyGroups,
    lectures,
    rooms,
    timetable,
    selectedLocation,
    selectedSemester,
    selectedStudyCourse,
    selectedStudyGroup,
    selectedRoom,
    selectedLectures,
    selectedTimetable,
    setSelectedLocation,
    setSelectedSemester,
    setSelectedStudyCourse,
    setSelectedStudyGroup,
    setSelectedRoom,
    setSelectedLectures,
    setSelectedTimetable,
    loading: {
      locations: loadingLocations,
      semesters: loadingSemesters,
      studyCourses: loadingStudyCourses,
      studyGroups: loadingStudyGroups,
      lectures: loadingLectures,
      rooms: loadingRooms,
      loadingTimetable: loadingTimetable,
    },
    error,
  }
}