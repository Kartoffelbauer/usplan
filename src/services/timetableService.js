export async function getLocations() {
  const res = await fetch('http://localhost:8010/proxy/splan/rest/LocationService/getSelectableLocations')

  if (!res.ok) throw new Error('Failed to load locations.')
  return res.json().catch(0)
}

export async function getSemesters() {
  const res = await fetch('http://localhost:8010/proxy/splan/rest/PlanningUnitService/getSelectablePlanningUnits')

  if (!res.ok) throw new Error('Failed to load semesters.')
  return res.json().catch(0)
}

export async function getStudyCourses(semesterId) {
  if (!semesterId) {
    throw new Error('Missing semester ID for programs query.')
  }

  const res = await fetch(`http://localhost:8010/proxy/splan/rest/OrgGroupService/getSelectableOrgGroups/${semesterId}`)
  if (!res.ok) throw new Error('Failed to load study programs.')

  return res.json()
}

export async function getStudyGroups(semesterId, studyCourseId) {
  if (!semesterId || !studyCourseId) {
    throw new Error('Missing semester or program ID for group query')
  }

  const res = await fetch(`http://localhost:8010/proxy/splan/rest/PlanningGroupService/getPlanningGroupsForPlanningUnitAndOrgGroup/${semesterId}/${studyCourseId}`)
  if (!res.ok) throw new Error('Failed to load groups.')

  return res.json()
}

export async function getTimetable(semesterId, studyCourseId, studyGroupId) {
if (!semesterId || !studyCourseId || !studyGroupId) {
    throw new Error('Missing semester or program ID for timetable query')
  }

  const res = await fetch(`http://localhost:8010/proxy/splan/rest/TimetableService/getForPlanningUnitAndPlanningGroup/${semesterId}/${studyGroupId}/false/${studyCourseId}`)
  if (!res.ok) throw new Error('Failed to load timetable.')

  return res.json()
}
