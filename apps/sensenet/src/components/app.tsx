import { CssBaseline, StylesProvider } from '@material-ui/core'
import React from 'react'
import { clearActiveRepositorySelection } from '../services/repository-session'
import AppProviders from './app-providers'
import { Dialogs } from './dialogs'
import { ErrorBoundary } from './error-boundary'
import { DesktopLayout } from './layout/DesktopLayout'
import { MainRouter } from './MainRouter'
import { NotificationComponent } from './NotificationComponent'

const AppErrorFallback = () => {
  const switchRepository = () => {
    clearActiveRepositorySelection()
    window.location.assign('/')
  }

  return (
    <div style={{ boxSizing: 'border-box', minHeight: '100vh', padding: 32 }}>
      <h1>Something went wrong</h1>
      <p>The current repository could not be loaded. You can reload the page or choose another repository.</p>
      <button type="button" onClick={() => window.location.reload()} style={{ marginRight: 16 }}>
        Reload
      </button>
      <button type="button" onClick={switchRepository}>
        Switch repository
      </button>
    </div>
  )
}

export function App() {
  return (
    <ErrorBoundary FallbackComponent={AppErrorFallback}>
      <AppProviders>
        <CssBaseline />
        <StylesProvider injectFirst>
          <DesktopLayout>
            <MainRouter />
          </DesktopLayout>
          <NotificationComponent />
          <Dialogs />
        </StylesProvider>
      </AppProviders>
    </ErrorBoundary>
  )
}
