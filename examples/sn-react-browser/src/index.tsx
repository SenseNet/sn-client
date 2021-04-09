import React from 'react'
import { render } from 'react-dom'
import { App } from './app'
import { AppProviders } from './components/app-providers'
import './style.css'

/**
 * Initialize React
 */
render(
  <AppProviders>
    <App />
  </AppProviders>,
  document.getElementById('root'),
)
