import React from 'react'
import { CssBaseline } from '@material-ui/core'
import AppProviders from './app-providers'
import { Dialogs } from './dialogs'
import { MainRouter } from './MainRouter'
import { DesktopLayout } from './layout/DesktopLayout'
import { ErrorBoundary } from './error-boundary'
import { NotificationComponent } from './NotificationComponent'

export function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <CssBaseline />
        <DesktopLayout>
          <MainRouter />
        </DesktopLayout>
        <NotificationComponent />
        <Dialogs />
      </AppProviders>
    </ErrorBoundary>
  )
}
