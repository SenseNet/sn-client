import { useContext } from 'react'
import { InjectorContext } from '../context'

/**
 * Custom hook that returns an Injecor instance from the InjectorContext.
 */
export const useInjector = () => useContext(InjectorContext)
