import { InjectorContext, LoggerContextProvider } from '@sensenet/hooks-react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import {
  LocalizationProvider,
  PersonalSettingsContextProvider,
  RepositoryProvider,
  ResponsiveContextProvider,
  ThemeProvider,
} from '../context'
import {
  CheatCommandProvider,
  CommandProviderManager,
  CustomActionCommandProvider,
  HelpCommandProvider,
  HistoryCommandProvider,
  InFolderSearchCommandProvider,
  NavigationCommandProvider,
  QueryCommandProvider,
} from '../services'
import '../utils/errorToJson'
import { DialogProvider } from './dialogs/dialog-provider'
import { snInjector } from './sn-injector'
import theme from './theme'

export type AppProvidersProps = {
  children: React.ReactNode
}

export default function AppProviders({ children }: AppProvidersProps) {
  snInjector
    .getInstance(CommandProviderManager)
    .RegisterProviders(
      CheatCommandProvider,
      CustomActionCommandProvider,
      HelpCommandProvider,
      HistoryCommandProvider,
      InFolderSearchCommandProvider,
      NavigationCommandProvider,
      QueryCommandProvider,
    )
  return (
    <InjectorContext.Provider value={snInjector}>
      <LoggerContextProvider>
        <PersonalSettingsContextProvider>
          <LocalizationProvider>
            <BrowserRouter>
              <ThemeProvider theme={theme}>
                <RepositoryProvider>
                  <ResponsiveContextProvider>
                    <DialogProvider>{children}</DialogProvider>
                  </ResponsiveContextProvider>
                </RepositoryProvider>
              </ThemeProvider>
            </BrowserRouter>
          </LocalizationProvider>
        </PersonalSettingsContextProvider>
      </LoggerContextProvider>
    </InjectorContext.Provider>
  )
}
