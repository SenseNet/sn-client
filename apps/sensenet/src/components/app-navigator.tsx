import React, { lazy, Suspense } from 'react'
import { Route, Switch } from 'react-router'
import { DesktopLayout } from './layout/DesktopLayout'
import { MainRouter } from './MainRouter'
import { FullScreenLoader } from './FullScreenLoader'

const LoginComponent = lazy(() => import(/* webpackChunkName: "Login" */ './login/Login'))

export function AppNavigator() {
  return (
    <Switch>
      <Route path="/login">
        <Suspense fallback={<FullScreenLoader />}>
          <LoginComponent />
        </Suspense>
      </Route>
      <DesktopLayout>
        <MainRouter />
      </DesktopLayout>
    </Switch>
  )
}
