import { AuthenticationProvider } from '@sensenet/authentication-oidc-react'
import React, { PropsWithChildren } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, RouteProps, useHistory } from 'react-router-dom'
import { UserState } from 'redux-oidc'
import { rootStateType } from '../store/rootReducer'
import { configuration } from '../userManager'
import { RepositoryProvider } from './RepositoryProvider'

export const AuthorizedRoute = ({ children, ...rest }: PropsWithChildren<RouteProps>) => {
  const stateAuth = useSelector<rootStateType, UserState>((state) => state.auth)
  const { user } = stateAuth
  const history = useHistory()

  if (stateAuth.isLoadingUser) {
    return <div>Loading...</div>
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          <AuthenticationProvider configuration={configuration} history={history}>
            <RepositoryProvider>{children}</RepositoryProvider>
          </AuthenticationProvider>
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}
