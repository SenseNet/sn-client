import { Injector } from '@furystack/inject/dist/Injector'
import { ConsoleLogger } from '@furystack/logging'

import React from 'react'
import { EventLogger } from '../services/EventLogger'
import '../utils/InjectorExtensions'

export const snInjector = new Injector()
snInjector.options.owner = 'SnApp'
snInjector.useLogging(ConsoleLogger, EventLogger)

export const InjectorContext = React.createContext(snInjector)
