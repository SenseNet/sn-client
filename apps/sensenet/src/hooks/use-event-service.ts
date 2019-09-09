import { useInjector } from '@sensenet/hooks-react'
import { EventService } from '../services/EventService'

export const useEventService = () => useInjector().getInstance(EventService)
