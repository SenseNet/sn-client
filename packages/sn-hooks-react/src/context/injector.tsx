import { Injector } from '@furystack/inject/dist/Injector'
import React from 'react'

/**
 * Context that returns an Injector instance
 */
export const InjectorContext = React.createContext(new Injector())
