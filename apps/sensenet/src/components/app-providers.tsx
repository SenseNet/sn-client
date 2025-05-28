import { PathHelper } from '@sensenet/client-utils'
import { InjectorContext, LoggerContextProvider } from '@sensenet/hooks-react'
import React, { ReactNode, Suspense, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthServerType, defaultAuthConfig } from '../auth-config'
import {
  LocalizationProvider,
  PersonalSettingsContextProvider,
  RepositoryProvider,
  ResponsiveContextProvider,
  ThemeProvider,
} from '../context'
import { ISAuthProvider, SNAuthProvider } from '../context/auth-provider'
import PathSaver from '../context/PathSaver'
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

import { GridLoadingProvider } from './grid/Providers/GridLoadingProvider'
import { snInjector } from './sn-injector'
import { TreeLoadingProvider } from './tree/Contexts/TreeLoadingProvider'

export type AppProvidersProps = {
  children: ReactNode
}

export default function AppProviders({ children }: AppProvidersProps) {
  const initAuthType: AuthServerType = (window.localStorage.getItem('authType') as AuthServerType) ?? 'IdentityServer'
  const [authType, setAuthType] = useState<'IdentityServer' | 'SNAuth'>(initAuthType)
  const [url, setUrl] = useState<string>('')

  const changeAuthType = (providedUrl: string) => {
    console.log('providedUrl:', providedUrl)
    setUrl(PathHelper.ensureDefaultSchema(providedUrl))
    if (authType === 'IdentityServer') {
      setAuthType('SNAuth')
      window.localStorage.setItem('authType', 'SNAuth')
    } else {
      setAuthType('IdentityServer')
      window.localStorage.setItem('authType', 'IdentityServer')
    }
  }

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
              <PathSaver />
              <GridLoadingProvider>
                <TreeLoadingProvider>
                  <ThemeProvider>
                    {authType === 'IdentityServer' ? (
                      <RepositoryProvider url={url} changeAuthType={changeAuthType}>
                        <ShareProvider>
                          <ISAuthProvider>
                            <ResponsiveContextProvider>
                              <DialogProvider>{children}</DialogProvider>
                            </ResponsiveContextProvider>
                          </ISAuthProvider>
                        </ShareProvider>
                      </RepositoryProvider>
                    ) : (
                      <SnAuthRepositoryProvider url={url} changeAuthType={changeAuthType}>
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
                </TreeLoadingProvider>
              </GridLoadingProvider>
            </BrowserRouter>
          </LocalizationProvider>
        </PersonalSettingsContextProvider>
      </LoggerContextProvider>
    </InjectorContext.Provider>
  )
}
