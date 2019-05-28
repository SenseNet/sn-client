import { useContext } from 'react'
import { InjectorContext } from '../context'
import { EventService } from '../services/EventService'

export const useEventService = () => useContext(InjectorContext).getInstance(EventService)
