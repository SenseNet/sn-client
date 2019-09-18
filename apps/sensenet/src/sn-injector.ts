import { Injector } from '@furystack/inject'
import { VerboseConsoleLogger } from '@furystack/logging'
import { EventLogger } from './services/EventLogger'

export const snInjector = new Injector()
snInjector.options.owner = 'SnApp'
snInjector.useLogging(VerboseConsoleLogger, EventLogger)
