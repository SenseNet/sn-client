import { BrowserConsoleLogger, Injector } from '@sensenet/client-utils'
import { EventLogger } from '../services/EventLogger'

export const snInjector = new Injector()
snInjector.options.owner = 'SnApp'
snInjector.useLogging(BrowserConsoleLogger, EventLogger)
