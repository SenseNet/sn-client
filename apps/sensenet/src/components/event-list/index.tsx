import { ILeveledLogEntry } from '@furystack/logging'
import Typography from '@material-ui/core/Typography'
import React, { useContext, useEffect, useState } from 'react'
import { InjectorContext, ThemeContext } from '../../context'
import { EventService } from '../../services/EventService'
import { Icon } from '../Icon'
import { Filter } from './filter'
import { FilterContextProvider } from './filter-context'
import { List } from './list'

export const EventList: React.FunctionComponent = () => {
  const theme = useContext(ThemeContext)
  const eventService = useContext(InjectorContext).getInstance(EventService)

  const [events, setEvents] = useState<Array<ILeveledLogEntry<any>>>(eventService.values.getValue())

  useEffect(() => {
    const observable = eventService.values.subscribe(values => setEvents(values))
    return () => observable.dispose()
  }, [])

  return (
    <FilterContextProvider>
      <div style={{ padding: '1em', height: '100%' }}>
        <div className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon
              item={{ Type: 'EventLog' }}
              style={{ fontSize: 32, marginRight: '.3em', color: theme.palette.text.primary }}
            />
            <Typography variant="h4">Event list</Typography>
          </div>
          <Filter style={{ justifySelf: 'flex-end' }} />
        </div>
        <List style={{ height: 'calc(100% - 48px)', overflow: 'auto' }} values={events} />
      </div>
    </FilterContextProvider>
  )
}

export default EventList
