import React, { StrictMode } from 'react'
import { CssBaseline } from '@material-ui/core'
import { ErrorBoundary } from './error-boundary'
import AppProviders from './app-providers'
import { NotificationComponent } from './NotificationComponent'
import { Dialogs } from './dialogs'
import { MainRouter } from './MainRouter'

export function App() {
  return (
    <StrictMode>
      <ErrorBoundary>
        <AppProviders>
          <CssBaseline />
          <MainRouter />
          <NotificationComponent />
          <Dialogs />
        </AppProviders>
      </ErrorBoundary>
    </StrictMode>
  )
}
