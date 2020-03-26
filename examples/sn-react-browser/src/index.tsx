import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './app'
import { AppProviders } from './components/app-providers'
import './style.css'

/**
 * Initialize React
 */
ReactDOM.render(
  <AppProviders>
    <App />
  </AppProviders>,
  document.getElementById('root'),
)
