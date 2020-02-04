import React from 'react'
import { Route, Switch } from 'react-router'
import { OidcRoutes } from '@sensenet/hooks-react'
import { applicationPaths } from '../application-paths'
import { usePersonalSettings } from '../hooks'
import authService from '../services/auth-service'
import { LoginPage } from './login/login-page'
import { MainRouter } from './MainRouter'

export function AppNavigator() {
  const personalSettings = usePersonalSettings()

  return (
    <>
      {personalSettings.lastRepository ? (
        <OidcRoutes
          repoUrl={personalSettings.lastRepository}
          authService={authService}
          loginCallback={{ url: applicationPaths.loginCallback }}
          logoutCallback={{ url: applicationPaths.logOutCallback }}
        />
      ) : null}

      <Switch>
        <Route path={applicationPaths.login}>
          <LoginPage />
        </Route>
        <MainRouter />
      </Switch>
    </>
  )
}
