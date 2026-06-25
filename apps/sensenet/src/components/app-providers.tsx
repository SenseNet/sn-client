import { InjectorContext, LoggerContextProvider } from '@sensenet/hooks-react'
import React, { ReactNode, Suspense, useCallback, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthServerType, defaultAuthConfig } from '../auth-config'
import {
  authConfigKey as authConfigKeyIS,
  LocalizationProvider,
  PersonalSettingsContextProvider,
  RepositoryProvider,
  ResponsiveContextProvider,
  ThemeProvider,
} from '../context'
import { ISAuthProvider, SNAuthProvider } from '../context/auth-provider'
import PathSaver from '../context/PathSaver'
import { ShareProvider } from '../context/ShareProvider'
import { authConfigKey as authConfigKeySN, SnAuthRepositoryProvider } from '../context/sn-auth-repository-provider'
import {
  CommandProviderManager,
  CustomActionCommandProvider,
  HelpCommandProvider,
  NavigationCommandProvider,
  SearchCommandProvider,
} from '../services'
import {
  clearActiveRepositorySelection,
  normalizeRepositoryUrl,
  startSnAuthRepositoryLogin,
} from '../services/repository-session'
import { DialogProvider } from './dialogs/dialog-provider'

import { GridLoadingProvider } from './grid/Providers/GridLoadingProvider'
import { snInjector } from './sn-injector'
import ExpandedItemsProvider from './tree/Contexts/ExpandedItemsProvider'
import { TreeLoadingProvider } from './tree/Contexts/TreeLoadingProvider'

export type AppProvidersProps = {
  children: ReactNode
}

export default function AppProviders({ children }: AppProvidersProps) {
  const initAuthType: AuthServerType =
    (window.localStorage.getItem('authType') as AuthServerType) ?? defaultAuthConfig.authType
  const [authType, setAuthType] = useState<'IdentityServer' | 'SNAuth'>(initAuthType)
  const [url, setUrl] = useState<string>('')

  const selectRepository = useCallback((providedUrl: string) => {
    const normalizedUrl = normalizeRepositoryUrl(providedUrl)

    clearActiveRepositorySelection()
    startSnAuthRepositoryLogin(normalizedUrl)
    setUrl(normalizedUrl)
  }, [])

  const changeAuthType = useCallback((providedUrl: string) => {
    const normalizedUrl = normalizeRepositoryUrl(providedUrl)

    setUrl(normalizedUrl)
    setAuthType((prev) => {
      const newAuthType = prev === 'IdentityServer' ? 'SNAuth' : 'IdentityServer'
      if (newAuthType === 'SNAuth') {
        startSnAuthRepositoryLogin(normalizedUrl)
      }
      window.localStorage.setItem('authType', newAuthType)
      return newAuthType
    })
  }, [])

  useEffect(() => {
    const repoUrl = new URL(window.location.href).searchParams.get('repoUrl')
    if (repoUrl) {
      selectRepository(repoUrl)
      return
    }

    const IsAuthKey = localStorage.getItem(authConfigKeyIS)
    const SnAuthKey = localStorage.getItem(authConfigKeySN)
    if (IsAuthKey || SnAuthKey) return
  }, [selectRepository])

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
                              <ExpandedItemsProvider>
                                <DialogProvider>{children}</DialogProvider>
                              </ExpandedItemsProvider>
                            </ResponsiveContextProvider>
                          </ISAuthProvider>
                        </ShareProvider>
                      </RepositoryProvider>
                    ) : (
                      <SnAuthRepositoryProvider url={url} changeAuthType={changeAuthType}>
                        <ShareProvider>
                          <SNAuthProvider>
                            <ResponsiveContextProvider>
                              <ExpandedItemsProvider>
                                <DialogProvider>{children}</DialogProvider>
                              </ExpandedItemsProvider>
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
