import React from 'react'
import ReactDOM from 'react-dom'
import './style.css'
import { App } from './app'
import { AppProviders } from './components/app-providers'

/**
 * Initialize React
 */
ReactDOM.render(
  /** The RepositoryProvider will display a login form for non-authenticated users */
  <AppProviders>
    <App />
  </AppProviders>,
  document.getElementById('root'),
)
