import { restEndpoint } from '../config.js'

export async function getLocations() {
  const res = await fetch(`${restEndpoint}/splan/rest/LocationService/getSelectableLocations`)

  if (!res.ok) throw new Error('Failed to load locations.')
  return res.json().catch(0)
}

export async function getSemesters() {
  const res = await fetch(`${restEndpoint}/splan/rest/PlanningUnitService/getSelectablePlanningUnits`)

  if (!res.ok) throw new Error('Failed to load semesters.')
  return res.json().catch(0)
}

export async function getStudyCourses(semesterId) {
  if (!semesterId) {
    throw new Error('Missing semester ID for courses query.')
  }

  const res = await fetch(`${restEndpoint}/splan/rest/OrgGroupService/getSelectableOrgGroups/${semesterId}`)
  if (!res.ok) throw new Error('Failed to load study courses.')

  return res.json()
}

export async function getStudyGroups(semesterId, studyCourseId) {
  if (!semesterId || !studyCourseId) {
    throw new Error('Missing semester or course ID for group query.')
  }

  const res = await fetch(`${restEndpoint}/splan/rest/PlanningGroupService/getPlanningGroupsForPlanningUnitAndOrgGroup/${semesterId}/${studyCourseId}`)
  if (!res.ok) throw new Error('Failed to load groups.')

  return res.json()
}

export async function getRooms(locationId) {
  if (!locationId) {
    throw new Error('Missing location ID for room query.')
  }

  const res = await fetch(`${restEndpoint}/splan/rest/RoomService/getSelectableRooms/${locationId}/null`)
  if (!res.ok) throw new Error('Failed to load rooms.')

  return res.json()
}

export async function getTimetableForCourses(semesterId, studyGroupId) {
  if (!semesterId || !studyGroupId) {
    throw new Error('Missing semester or group ID for courses timetable query.')
  }

  const res = await fetch(`${restEndpoint}/splan/rest/TimetableService/getForPlanningUnitAndPlanningGroup/${semesterId}/${studyGroupId}/false/-1`)
  if (!res.ok) throw new Error('Failed to load timetable for courses.')

  return res.json()
}

export async function getTimetableForRooms(semesterId, roomId) {
  if (!semesterId || !roomId) {
    throw new Error('Missing semester or room ID for rooms timetable query.')
  }

  const res = await fetch(`${restEndpoint}/splan/rest/TimetableService/getForPlanningUnitAndRoom/${semesterId}/${roomId}/false/-1`)
  if (!res.ok) throw new Error('Failed to load timetable for rooms.')

  return res.json()
}
