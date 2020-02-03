import React from 'react'
import { Route, Switch } from 'react-router'
import { applicationPaths } from '../services/auth-service'
import { FullScreenLoader } from './FullScreenLoader'
import { LoginCallback } from './login/login-callback'
import { LoginPage } from './login/login-page'
import { LogoutCallback } from './login/logout-callback'
import { MainRouter } from './MainRouter'

export function AppNavigator() {
  return (
    <>
      <Switch>
        <Route path={applicationPaths.login}>
          <LoginPage />
        </Route>
        <Route path={applicationPaths.loginCallback}>
          <LoginCallback>
            <FullScreenLoader />
            <p>Processing login</p>
          </LoginCallback>
        </Route>
        <Route path={applicationPaths.logOutCallback}>
          <LogoutCallback>
            <p>Processing logout</p>
          </LogoutCallback>
        </Route>
        <MainRouter />
      </Switch>
    </>
  )
}
