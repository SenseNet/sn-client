import React, { lazy, Suspense } from 'react'
import { Route, Switch } from 'react-router'
import { DesktopLayout } from './layout/DesktopLayout'
import { MainRouter } from './MainRouter'
import { FullScreenLoader } from './full-screen-loader'

const LoginPage = lazy(() => import(/* webpackChunkName: "Login" */ './login/login-page'))

export function AppNavigator() {
  return (
    <Switch>
      <Route path="/login">
        <Suspense fallback={<FullScreenLoader loaderText="" />}>
          <LoginPage />
        </Suspense>
      </Route>
      <DesktopLayout>
        <MainRouter />
      </DesktopLayout>
    </Switch>
  )
}
