import React, { PropsWithChildren } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { UserState } from 'redux-oidc'
import { rootStateType } from '../store/rootReducer'
import { RepositoryProvider } from './RepositoryProvider'

export const AuthorizedRoute = ({ children, ...rest }: PropsWithChildren<RouteProps>) => {
  const stateAuth = useSelector<rootStateType, UserState>((state) => state.auth)
  const { user } = stateAuth

  if (stateAuth.isLoadingUser) {
    return <div>Loading...</div>
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          <RepositoryProvider>{children}</RepositoryProvider>
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
