import { createContext, useContext } from 'react'
import { useTimetableData } from '../hooks/useTimetableData'

const TimetableContext = createContext()

export const TimetableProvider = ({ children }) => {
  const timetableState = useTimetableData()

  return (
    <TimetableContext.Provider value={timetableState}>
      {children}
    </TimetableContext.Provider>
  )
}

export const useTimetable = () => useContext(TimetableContext)