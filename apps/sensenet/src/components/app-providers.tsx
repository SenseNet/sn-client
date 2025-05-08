import { CssBaseline } from '@material-ui/core'
import { InjectorContext, LoggerContextProvider } from '@sensenet/hooks-react'
import React, { ReactNode, Suspense, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
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
import { useGlobalStyles } from '../globalStyles'
import {
  CommandProviderManager,
  CustomActionCommandProvider,
  getAuthConfig,
  HelpCommandProvider,
  NavigationCommandProvider,
  SearchCommandProvider,
} from '../services'
import { DialogProvider } from './dialogs/dialog-provider'
import { FullScreenLoader } from './full-screen-loader'
import LoginPage from './login/login-page'
import { NotificationComponent } from './NotificationComponent'
import { snInjector } from './sn-injector'

export type AppProvidersProps = {
  children: ReactNode
}

export default function AppProviders({ children }: AppProvidersProps) {
  const globalClasses = useGlobalStyles()
  const [url, setUrl] = useState<any>(undefined)

  const onLogin = async (loginUrl: string) => {
    const config = await getAuthConfig(loginUrl)
    const repoInfo = {
      url: loginUrl,
      config,
      authType: config.authServerSettings.type,
    }
    window.localStorage.setItem('repoInfo', JSON.stringify(repoInfo))
    setUrl(loginUrl)
  }

  const repoInfo = (() => {
    try {
      const item = window.localStorage.getItem('repoInfo')
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  })()

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
                {!repoInfo && (
                  <div className={globalClasses.full}>
                    <CssBaseline />
                    <Suspense fallback={<FullScreenLoader loaderText="Loading" />}>
                      <LoginPage isLoginInProgress={false} handleSubmit={onLogin} />
                      <NotificationComponent />
                    </Suspense>
                  </div>
                )}
                {repoInfo?.authType === 'IdentityServer' && (
                  <RepositoryProvider url={url}>
                    <ShareProvider>
                      <ISAuthProvider>
                        <ResponsiveContextProvider>
                          <DialogProvider>{children}</DialogProvider>
                        </ResponsiveContextProvider>
                      </ISAuthProvider>
                    </ShareProvider>
                  </RepositoryProvider>
                )}
                {repoInfo?.authType === 'SNAuth' && (
                  <SnAuthRepositoryProvider url={url}>
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
