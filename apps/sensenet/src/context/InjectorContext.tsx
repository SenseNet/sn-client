import { Injector } from '@furystack/inject/dist/Injector'
import '@furystack/logging'
import { ConsoleLogger } from '@furystack/logging'
import React from 'react'
import '../utils/InjectorExtensions'

export const snInjector = new Injector()
snInjector.options.owner = 'SnApp'
snInjector.useLogging(ConsoleLogger)

export const InjectorContext = React.createContext(snInjector)
