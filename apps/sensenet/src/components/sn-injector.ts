import { BrowserConsoleLogger, Injector, NotificationLogger } from '@sensenet/client-utils'
import { EventLogger } from '../services/EventLogger'

export const snInjector = new Injector()
snInjector.options.owner = 'SnApp'
snInjector.useLogging(BrowserConsoleLogger, EventLogger, NotificationLogger)
