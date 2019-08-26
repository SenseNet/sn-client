import { useContext } from 'react'
import { SessionContext } from '../context'

export const useSession = () => useContext(SessionContext)
