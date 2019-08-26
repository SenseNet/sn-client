import { useContext, useState } from 'react'
import { LoggerContext } from '../context/LoggerContext'

export const useLogger = (scope: string) => {
  const [logger] = useState(useContext(LoggerContext).withScope(scope))
  return logger
}
