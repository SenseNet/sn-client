import { ILogger, LoggerCollection } from '@furystack/logging'
import React from 'react'
import { useInjector } from '../hooks'

export const LoggerContext = React.createContext<ILogger>(new LoggerCollection())

export const LoggerContextProvider: React.FunctionComponent = ({ children }) => {
  const injector = useInjector()
  return <LoggerContext.Provider value={injector.logger}>{children}</LoggerContext.Provider>
}
