import React, { StrictMode } from 'react'
import { CssBaseline } from '@material-ui/core'
import { ErrorBoundary } from './error-boundary'
import AppProviders from './app-providers'
import { NotificationComponent } from './NotificationComponent'
import { Dialogs } from './dialogs'
import { AppNavigator } from './app-navigator'

export function App() {
  return (
    <StrictMode>
      <ErrorBoundary>
        <AppProviders>
          <CssBaseline />
          <AppNavigator />
          <NotificationComponent />
          <Dialogs />
        </AppProviders>
      </ErrorBoundary>
    </StrictMode>
  )
}
