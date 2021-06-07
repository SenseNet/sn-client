import { codeLogin, CodeLoginResponse } from '@sensenet/authentication-oidc-react'
import { Repository } from '@sensenet/client-core'
import { RepositoryContext } from '@sensenet/hooks-react'
import { MuiThemeProvider } from '@material-ui/core'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { configuration, repositoryUrl } from '../configuration'
import { theme } from '../theme'
import { FullScreenLoader } from './full-screen-loader'

export function AppProviders({ children }: PropsWithChildren<{}>) {
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <RepositoryProvider>{children}</RepositoryProvider>
      </MuiThemeProvider>
    </BrowserRouter>
  )
}

export const RepositoryProvider = ({ children }: PropsWithChildren<{}>) => {
  const [authData, setAuthData] = useState<CodeLoginResponse>()

  useEffect(() => {
    ;(async () => {
      const response = await codeLogin(configuration)
      setAuthData(response)
    })()
  }, [])

  if (!authData) {
    return <FullScreenLoader />
  }

  return (
    <RepositoryContext.Provider value={new Repository({ repositoryUrl, token: authData.access_token })}>
      {children}
    </RepositoryContext.Provider>
  )
}
