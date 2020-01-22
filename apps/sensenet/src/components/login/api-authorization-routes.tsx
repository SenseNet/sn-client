import React from 'react'
import { Route } from 'react-router'
import { applicationPaths, loginActions, logoutActions } from '../../services/auth-service'
import { Login2 } from './login2'
import { Logout } from './logout'

export default function ApiAuthorizationRoutes() {
  return (
    <>
      <Route path={applicationPaths.login}>
        <Login2 action={loginActions.login} />
      </Route>
      <Route path={applicationPaths.loginFailed}>
        <Login2 action={loginActions.loginFailed} />
      </Route>
      <Route path={applicationPaths.loginCallback}>
        <Login2 action={loginActions.loginCallback} />
      </Route>
      <Route path={applicationPaths.profile}>
        <Login2 action={loginActions.profile} />
      </Route>
      <Route path={applicationPaths.register}>
        <Login2 action={loginActions.register} />
      </Route>
      <Route path={applicationPaths.logOut}>
        <Logout action={logoutActions.logout} />
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
