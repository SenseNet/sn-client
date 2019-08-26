import { useContext } from 'react'
import { InjectorContext } from '../context'

export const useInjector = () => useContext(InjectorContext)
