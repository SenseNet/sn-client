import { Injector } from '@sensenet/client-utils'
import { createContext } from 'react'

/**
 * Context that returns an Injector instance
 */
export const InjectorContext = createContext(new Injector())
InjectorContext.displayName = 'InjectorContext'
