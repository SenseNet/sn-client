import React from 'react'
import { InjectorContext, LoggerContextProvider, SessionContextProvider } from '@sensenet/hooks-react'
import { BrowserRouter } from 'react-router-dom'
import {
  ContentRoutingContextProvider,
  LocalizationProvider,
  PersonalSettingsContextProvider,
  RepositoryContextProvider,
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
import '../utils/InjectorExtensions'
import { snInjector } from './sn-injector'
import { DialogProvider } from './dialogs/dialog-provider'

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
              <RepositoryContextProvider>
                <ContentRoutingContextProvider>
                  <SessionContextProvider>
                    <ThemeProvider>
                      <ResponsiveContextProvider>
                        <DialogProvider>{children}</DialogProvider>
                      </ResponsiveContextProvider>
                    </ThemeProvider>
                  </SessionContextProvider>
                </ContentRoutingContextProvider>
              </RepositoryContextProvider>
            </BrowserRouter>
          </LocalizationProvider>
        </PersonalSettingsContextProvider>
      </LoggerContextProvider>
    </InjectorContext.Provider>
  )
}
