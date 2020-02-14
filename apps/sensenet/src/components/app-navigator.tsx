import React from 'react'
import { Route, Switch } from 'react-router'
import { applicationPaths } from '../application-paths'
import { LoginPage } from './login/login-page'
import { MainRouter } from './MainRouter'

export function AppNavigator() {
  return (
    <>
      <Switch>
        <Route path={applicationPaths.login}>
          <LoginPage />
        </Route>
        <MainRouter />
      </Switch>
    </>
  )
}
