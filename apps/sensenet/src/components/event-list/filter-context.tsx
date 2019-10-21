import { LogLevel } from '@sensenet/client-utils'
import React, { Dispatch, SetStateAction, useState } from 'react'

export interface EventListFilter {
  term?: string
  scope?: string
  logLevel?: LogLevel
}

export const EventListFilterContext = React.createContext<{
  filter: EventListFilter
  setFilter: Dispatch<SetStateAction<EventListFilter>>
}>({ filter: {}, setFilter: () => ({} as any) })

export const FilterContextProvider: React.FunctionComponent = props => {
  const [filter, setFilter] = useState<EventListFilter>({})

  return (
    <EventListFilterContext.Provider value={{ filter, setFilter }}>{props.children}</EventListFilterContext.Provider>
  )
}
