import { InjectorContext, LoggerContextProvider } from '@sensenet/hooks-react'
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthServerType, defaultAuthConfig } from '../auth-config'
import {
  LocalizationProvider,
  PersonalSettingsContextProvider,
  RepositoryProvider,
  RepositorySwitchContext,
  ResponsiveContextProvider,
  ThemeProvider,
} from '../context'
import { ISAuthProvider, SNAuthProvider } from '../context/auth-provider'
import { LocalRepositoryProvider } from '../context/local-repository-provider'
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
import { discoverAuthentication, getLocalRepositories, localSelectedRepository } from '../services/local-authentication'
import {
  clearActiveRepositorySelection,
  hasSnAuthRepositoryTokens,
  normalizeRepositoryUrl,
  startSnAuthRepositoryLogin,
} from '../services/repository-session'
import { DialogProvider } from './dialogs/dialog-provider'
import { GridLoadingProvider } from './grid/Providers/GridLoadingProvider'
import { AuthenticationChoice } from './login/authentication-choice'
import { snInjector } from './sn-injector'
import ExpandedItemsProvider from './tree/Contexts/ExpandedItemsProvider'
import { TreeLoadingProvider } from './tree/Contexts/TreeLoadingProvider'

export type AppProvidersProps = { children: ReactNode }

export default function AppProviders({ children }: AppProvidersProps) {
  // Capture before any child mounts: a remembered Local provider may otherwise consume
  // the fragment before the parent's repository-selection effect gets to inspect it.
  const [resetLink, setResetLink] = useState(() => {
    const location = new URL(window.location.href)
    const token = new URLSearchParams(location.hash.slice(1)).get('localResetToken')
    const repoUrl = location.searchParams.get('repoUrl')
    if (token !== null) {
      location.hash = ''
      window.history.replaceState(window.history.state, '', location.href)
    }
    if (!token || !/^[A-Za-z0-9_-]{64}$/.test(token) || !repoUrl) return undefined
    try {
      const repositoryUrl = normalizeRepositoryUrl(repoUrl)
      return new URL(repositoryUrl).protocol === 'https:' ? { token, repositoryUrl } : undefined
    } catch {
      return undefined
    }
  })
  // Retain only the initial destination for startup routing, never a consumed token.
  const initialResetRepository = useRef(resetLink?.repositoryUrl).current
  const [authType, setAuthType] = useState<AuthServerType>(
    resetLink ? 'Local' : (window.localStorage.getItem('authType') as AuthServerType) ?? defaultAuthConfig.authType,
  )
  const [url, setUrl] = useState(resetLink?.repositoryUrl || '')
  const [choice, setChoice] = useState<string>()
  const externalChoices = useRef(new Set<string>())
  const discoveryVersion = useRef(0)

  const selectLocal = useCallback((repoUrl: string) => {
    discoveryVersion.current++
    sessionStorage.setItem(localSelectedRepository, repoUrl)
    window.localStorage.setItem('authType', 'Local')
    setUrl(repoUrl)
    setAuthType('Local')
    setChoice(undefined)
  }, [])

  const prepareAuthentication = useCallback(
    async (repoUrl: string) => {
      const normalized = normalizeRepositoryUrl(repoUrl)
      if (externalChoices.current.has(normalized)) return true
      const version = ++discoveryVersion.current
      const capabilities = await discoverAuthentication(normalized)
      if (version !== discoveryVersion.current) return false
      if (!capabilities || capabilities.mode === 'Disabled') return true
      if (capabilities.mode === 'InternalOnly') {
        selectLocal(normalized)
        return false
      }
      if (capabilities.local) {
        setChoice(normalized)
        return false
      }
      return true
    },
    [selectLocal],
  )

  const selectRepository = useCallback((providedUrl: string) => {
    const normalized = normalizeRepositoryUrl(providedUrl)
    discoveryVersion.current++
    externalChoices.current.delete(normalized)
    clearActiveRepositorySelection()
    startSnAuthRepositoryLogin(normalized)
    setChoice(undefined)
    setAuthType(defaultAuthConfig.authType === 'Local' ? 'SNAuth' : defaultAuthConfig.authType)
    setUrl(normalized)
  }, [])

  const changeAuthType = useCallback((providedUrl: string) => {
    const normalized = normalizeRepositoryUrl(providedUrl)
    setUrl(normalized)
    setAuthType((previous) => {
      const next = previous === 'IdentityServer' ? 'SNAuth' : 'IdentityServer'
      if (next === 'SNAuth') startSnAuthRepositoryLogin(normalized)
      window.localStorage.setItem('authType', next)
      return next
    })
  }, [])

  const switchRepository = useCallback(
    (providedUrl: string) => {
      const normalized = normalizeRepositoryUrl(providedUrl)
      if (authType === 'Local' && getLocalRepositories().includes(normalized)) {
        selectLocal(normalized)
        return
      }
      if (!hasSnAuthRepositoryTokens(normalized)) startSnAuthRepositoryLogin(normalized)
      window.localStorage.setItem('authType', 'SNAuth')
      setAuthType('SNAuth')
      setUrl(normalized)
    },
    [authType, selectLocal],
  )

  useEffect(() => {
    const location = new URL(window.location.href)
    const repoUrl =
      location.searchParams.get('repoUrl') || (/^\/login\/?$/.test(location.pathname) ? location.origin : '')
    if (repoUrl) {
      if (initialResetRepository) selectLocal(initialResetRepository)
      else selectRepository(repoUrl)
    }
  }, [selectRepository, selectLocal, initialResetRepository])

  snInjector
    .getInstance(CommandProviderManager)
    .RegisterProviders(
      CustomActionCommandProvider,
      HelpCommandProvider,
      NavigationCommandProvider,
      SearchCommandProvider,
    )

  const content = (
    <ResponsiveContextProvider>
      <ExpandedItemsProvider>
        <DialogProvider>{children}</DialogProvider>
      </ExpandedItemsProvider>
    </ResponsiveContextProvider>
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
                    <RepositorySwitchContext.Provider value={{ authType, switchRepository }}>
                      {choice ? (
                        <AuthenticationChoice
                          repositoryUrl={choice}
                          onInternal={() => selectLocal(choice)}
                          onExternal={() => {
                            externalChoices.current.add(choice)
                            startSnAuthRepositoryLogin(choice)
                            setUrl(choice)
                            setChoice(undefined)
                          }}
                          onCancel={() => {
                            discoveryVersion.current++
                            clearActiveRepositorySelection()
                            setChoice(undefined)
                            setUrl('')
                          }}
                        />
                      ) : authType === 'Local' ? (
                        <LocalRepositoryProvider
                          key={url || sessionStorage.getItem(localSelectedRepository)}
                          url={url}
                          initialResetToken={resetLink?.repositoryUrl === url ? resetLink.token : undefined}
                          onResetComplete={() => setResetLink(undefined)}
                          selectRepository={selectRepository}>
                          <ShareProvider>{content}</ShareProvider>
                        </LocalRepositoryProvider>
                      ) : authType === 'IdentityServer' ? (
                        <RepositoryProvider
                          url={url}
                          changeAuthType={changeAuthType}
                          prepareAuthentication={prepareAuthentication}>
                          <ShareProvider>
                            <ISAuthProvider>{content}</ISAuthProvider>
                          </ShareProvider>
                        </RepositoryProvider>
                      ) : (
                        <SnAuthRepositoryProvider
                          url={url}
                          changeAuthType={changeAuthType}
                          prepareAuthentication={prepareAuthentication}>
                          <ShareProvider>
                            <SNAuthProvider>{content}</SNAuthProvider>
                          </ShareProvider>
                        </SnAuthRepositoryProvider>
                      )}
                    </RepositorySwitchContext.Provider>
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
