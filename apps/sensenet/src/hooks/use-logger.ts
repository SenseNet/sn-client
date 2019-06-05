import { useContext } from 'react'
import { LoggerContext } from '../context/LoggerContext'

export const useLogger = (scope: string) => useContext(LoggerContext).withScope(scope)
