import React, { useEffect, useState } from 'react'
import { useRepository } from '../hooks'
import { ContentContextProvider } from '../services/ContentContextProvider'

export const ContentRoutingContext = React.createContext(null as any)
export const ContentRoutingContextProvider: React.FunctionComponent = props => {
  const repo = useRepository()
  const [ctxProvider, setCtxProvider] = useState(new ContentContextProvider(repo))

  useEffect(() => {
    setCtxProvider(new ContentContextProvider(repo))
  }, [repo])

  return <ContentRoutingContext.Provider value={ctxProvider}>{props.children}</ContentRoutingContext.Provider>
}
