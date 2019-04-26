import { ILogger, LoggerCollection } from '@furystack/logging'
import React, { useContext } from 'react'
import { InjectorContext } from './InjectorContext'

export const LoggerContext = React.createContext<ILogger>(new LoggerCollection())

export const LoggerContextProvider: React.FunctionComponent = ({ children }) => {
  const injector = useContext(InjectorContext)
  return <LoggerContext.Provider value={injector.logger}>{children}</LoggerContext.Provider>
}
