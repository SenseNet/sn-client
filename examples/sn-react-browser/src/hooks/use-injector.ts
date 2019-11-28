import { useContext } from 'react'
import { InjectorContext } from '../context/injector-context-provider'

export const useInjector = () => useContext(InjectorContext)
