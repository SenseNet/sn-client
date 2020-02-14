import { InjectorContext, LoggerContextProvider } from '@sensenet/hooks-react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import {
  LocalizationProvider,
  PersonalSettingsContextProvider,
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
  RepoStateProvider,
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
              <RepoStateProvider>
                <ResponsiveContextProvider>
                  <ThemeProvider theme={theme}>
                    <DialogProvider>{children}</DialogProvider>
                  </ThemeProvider>
                </ResponsiveContextProvider>
              </RepoStateProvider>
            </BrowserRouter>
          </LocalizationProvider>
        </PersonalSettingsContextProvider>
      </LoggerContextProvider>
    </InjectorContext.Provider>
  )
}
