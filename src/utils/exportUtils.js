/**
 * Utility functions for exporting and printing timetable data
 */

/**
 * Triggers the browser's print dialog for timetable printing
 */
export const printTimetable = () => {
  window.print()
}

/**
 * Exports timetable data as iCal format
 * @param {Object} timetable - The timetable data
 * @param {Object} selectedSemester - Selected semester object
 * @param {Object} selectedStudyCourse - Selected study course object
 * @param {Object} selectedStudyGroup - Selected study group object
 */
export const exportTimetableAsIcal = (timetable, selectedSemester, selectedStudyCourse, selectedStudyGroup) => {
  // TODO: Implement iCal export functionality
  console.log('Exporting as iCal:', {
    timetable,
    semester: selectedSemester,
    studyCourse: selectedStudyCourse,
    studyGroup: selectedStudyGroup
  })
}