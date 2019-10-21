import { Injector } from '@sensenet/client-utils'
import React from 'react'

/**
 * Context that returns an Injector instance
 */
export const InjectorContext = React.createContext(new Injector())
