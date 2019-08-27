import { useContext } from 'react'
import { SessionContext } from '../context'

/**
 * Returns the session data from the SessionContext
 */
export const useSession = () => useContext(SessionContext)
