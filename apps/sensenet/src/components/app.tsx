import { CssBaseline } from '@material-ui/core'
import React from 'react'
import { AppNavigator } from './app-navigator'
import AppProviders from './app-providers'
import { Dialogs } from './dialogs'
import { ErrorBoundary } from './error-boundary'
import { NotificationComponent } from './NotificationComponent'

export function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <CssBaseline />
        <AppNavigator />
        <NotificationComponent />
        <Dialogs />
      </AppProviders>
    </ErrorBoundary>
  )
}
