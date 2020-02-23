import React, { StrictMode } from 'react'
import { CssBaseline } from '@material-ui/core'
import { ErrorBoundary } from './error-boundary'
import AppProviders from './app-providers'
import { NotificationComponent } from './NotificationComponent'
import { Dialogs } from './dialogs'
import { MainRouter } from './MainRouter'
import { DesktopLayout } from './layout/DesktopLayout'
import { AuthCallback } from './login'

export function App() {
  return (
    <StrictMode>
      <ErrorBoundary>
        <AuthCallback>
          <AppProviders>
            <CssBaseline />
            <DesktopLayout>
              <MainRouter />
            </DesktopLayout>
            <NotificationComponent />
            <Dialogs />
          </AppProviders>
        </AuthCallback>
      </ErrorBoundary>
    </StrictMode>
  )
}
