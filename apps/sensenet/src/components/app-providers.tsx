import { InjectorContext, LoggerContextProvider } from '@sensenet/hooks-react'
import React, { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { defaultAuthConfig } from '../auth-config'
import {
  LocalizationProvider,
  PersonalSettingsContextProvider,
  RepositoryProvider,
  ResponsiveContextProvider,
  ThemeProvider,
} from '../context'
import { ISAuthProvider, SNAuthProvider } from '../context/auth-provider'
import { ShareProvider } from '../context/ShareProvider'
import { SnAuthRepositoryProvider } from '../context/sn-auth-repository-provider'
import {
  CommandProviderManager,
  CustomActionCommandProvider,
  HelpCommandProvider,
  NavigationCommandProvider,
  SearchCommandProvider,
} from '../services'
import { DialogProvider } from './dialogs/dialog-provider'
import { snInjector } from './sn-injector'

export type AppProvidersProps = {
  children: ReactNode
}

export default function AppProviders({ children }: AppProvidersProps) {
  snInjector
    .getInstance(CommandProviderManager)
    .RegisterProviders(
      CustomActionCommandProvider,
      HelpCommandProvider,
      NavigationCommandProvider,
      SearchCommandProvider,
    )
  return (
    <InjectorContext.Provider value={snInjector}>
      <LoggerContextProvider>
        <PersonalSettingsContextProvider>
          <LocalizationProvider>
            <BrowserRouter>
              <ThemeProvider>
                {defaultAuthConfig.authType === 'IdentityServer' ? (
                  <RepositoryProvider>
                    <ShareProvider>
                      <ISAuthProvider>
                        <ResponsiveContextProvider>
                          <DialogProvider>{children}</DialogProvider>
                        </ResponsiveContextProvider>
                      </ISAuthProvider>
                    </ShareProvider>
                  </RepositoryProvider>
                ) : (
                  <SnAuthRepositoryProvider>
                    <ShareProvider>
                      <SNAuthProvider>
                        <ResponsiveContextProvider>
                          <DialogProvider>{children}</DialogProvider>
                        </ResponsiveContextProvider>
                      </SNAuthProvider>
                    </ShareProvider>
                  </SnAuthRepositoryProvider>
                )}
              </ThemeProvider>
            </BrowserRouter>
          </LocalizationProvider>
        </PersonalSettingsContextProvider>
      </LoggerContextProvider>
    </InjectorContext.Provider>
  )
}
