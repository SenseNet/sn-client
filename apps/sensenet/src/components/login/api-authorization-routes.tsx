import React from 'react'
import { Route } from 'react-router'
import { applicationPaths, logoutActions } from '../../services/auth-service'
import { LoginCallback } from './login-callback'
import { Logout } from './logout'

export default function ApiAuthorizationRoutes() {
  return (
    <>
      <Route path={applicationPaths.loginCallback}>
        <LoginCallback />
      </Route>
      <Route path={applicationPaths.logOutCallback}>
        <Logout action={logoutActions.logoutCallback} />
      </Route>
      <Route path={applicationPaths.loggedOut}>
        <Logout action={logoutActions.loggedOut} />
      </Route>
    </>
  )
}
