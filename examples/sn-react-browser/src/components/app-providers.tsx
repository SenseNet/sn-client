import { AuthenticationProvider, useOidcAuthentication } from '@sensenet/authentication-oidc-react'
import { Repository } from '@sensenet/client-core'
import { RepositoryContext } from '@sensenet/hooks-react'
import React, { PropsWithChildren } from 'react'
import { BrowserRouter, useHistory } from 'react-router-dom'
import { configuration, repositoryUrl } from '../configuration'
import { LoginForm } from './login-form'

export function AppProviders({ children }: PropsWithChildren<{}>) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RepositoryProvider>{children}</RepositoryProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const history = useHistory()

  return (
    <AuthenticationProvider configuration={configuration} isEnabled={true} history={history}>
      {children}
    </AuthenticationProvider>
  )
}

export const RepositoryProvider = ({ children }: PropsWithChildren<{}>) => {
  const { oidcUser } = useOidcAuthentication()

  if (!oidcUser) {
    return <LoginForm />
  }

  return (
    <RepositoryContext.Provider value={new Repository({ repositoryUrl, token: oidcUser.access_token })}>
      {children}
    </RepositoryContext.Provider>
  )
}
