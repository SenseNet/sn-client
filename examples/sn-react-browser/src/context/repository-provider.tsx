import { useOidcAuthentication } from '@sensenet/authentication-oidc-react'
import { Repository } from '@sensenet/client-core/'
import { RepositoryContext } from '@sensenet/hooks-react'
import React, { ReactNode } from 'react'
import { LoginForm } from '../components/login-form'

/**
 * Container component that will provide a Repository object through a Context
 */
export const RepositoryProvider = ({ children }: { children: ReactNode }) => {
  const { oidcUser } = useOidcAuthentication()

  if (!oidcUser) {
    return <LoginForm />
  }

  return (
    <>
      <RepositoryContext.Provider
        value={
          new Repository({ repositoryUrl: 'https://netcore-service.test.sensenet.com/', token: oidcUser.access_token })
        }>
        {children}
      </RepositoryContext.Provider>
    </>
  )
}
