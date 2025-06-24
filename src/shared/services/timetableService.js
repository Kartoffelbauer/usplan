import { REST_ENDPOINT } from '../../app/config.js'

export async function getLocations() {
  const res = await fetch(`${REST_ENDPOINT}/LocationService/getSelectableLocations`)

  if (!res.ok) throw new Error('Failed to load locations.')
  return res.json().catch(0)
}

export async function getSemesters() {
  const res = await fetch(`${REST_ENDPOINT}/PlanningUnitService/getSelectablePlanningUnits`)

  if (!res.ok) throw new Error('Failed to load semesters.')
  return res.json().catch(0)
}

export async function getStudyCourses(semesterId) {
  if (!semesterId) {
    throw new Error('Missing semester ID for courses query.')
  }

  const res = await fetch(`${REST_ENDPOINT}/OrgGroupService/getSelectableOrgGroups/${semesterId}`)
  if (!res.ok) throw new Error('Failed to load study courses.')

  return res.json()
}

export async function getStudyGroups(semesterId, studyCourseId) {
  if (!semesterId || !studyCourseId) {
    throw new Error('Missing semester or course ID for group query.')
  }

  const res = await fetch(`${REST_ENDPOINT}/PlanningGroupService/getPlanningGroupsForPlanningUnitAndOrgGroup/${semesterId}/${studyCourseId}`)
  if (!res.ok) throw new Error('Failed to load groups.')

  return res.json()
}

export async function getLectures(semesterId, studyGroupId) {
  if (!semesterId || !studyGroupId) {
    throw new Error('Missing semester or group ID for lectures query.')
  }

  const res = await fetch(`${REST_ENDPOINT}/PhysicalHappeningService/getSeletableOrgLectures/${semesterId}/${studyGroupId}`)
  if (!res.ok) throw new Error('Failed to load lectures.')

  return res.json()
}

export async function getRooms(locationId) {
  if (!locationId) {
    throw new Error('Missing location ID for room query.')
  }

  const res = await fetch(`${REST_ENDPOINT}/RoomService/getSelectableRooms/${locationId}/null`)
  if (!res.ok) throw new Error('Failed to load rooms.')

  return res.json()
}

export async function getTimetableForCourses(semesterId, studyGroupId) {
  if (!semesterId || !studyGroupId) {
    throw new Error('Missing semester or group ID for courses timetable query.')
  }

  const res = await fetch(`${REST_ENDPOINT}/TimetableService/getForPlanningUnitAndPlanningGroup/${semesterId}/${studyGroupId}/false/-1`)
  if (!res.ok) throw new Error('Failed to load timetable for courses.')

  return res.json()
}

export async function getTimetableForRooms(semesterId, roomId) {
  if (!semesterId || !roomId) {
    throw new Error('Missing semester or room ID for rooms timetable query.')
  }

  const res = await fetch(`${REST_ENDPOINT}/TimetableService/getForPlanningUnitAndRoom/${semesterId}/${roomId}/false/-1`)
  if (!res.ok) throw new Error('Failed to load timetable for rooms.')

  return res.json()
}

export async function getTimetableForLectures(semesterId, lectures) {
  if (!semesterId || !lectures || !Array.isArray(lectures) || lectures.length === 0) {
    throw new Error('Missing semester or lectures for lectures timetable query.')
  }

  console.log(`${REST_ENDPOINT}/TimetableService/getForPlanningUnitAndRoom/${semesterId}/${lectures.join(',')}/false/-1/false`)
  const res = await fetch(`${REST_ENDPOINT}/TimetableService/getForPlanningUnitAndLectures/${semesterId}/${lectures.join(',')}/false/-1/false`)
  if (!res.ok) throw new Error('Failed to load timetable for lectures.')

  return res.json()
}