import { useContext, useState } from 'react'
import { LoggerContext } from '../context/logger'

/**
 * Returns a scoped Logger instance from the LoggerContext.
 * @param scope The logger's Scope name
 */
export const useLogger = (scope: string) => {
  const [logger] = useState(useContext(LoggerContext).withScope(scope))
  return logger
}
