import React from 'react'
import ReactDOM from 'react-dom'
import './style.css'
import { App } from './app'
import { RepositoryProvider } from './context/repository-provider'

/**
 * Initialize React
 */
ReactDOM.render(
  <RepositoryProvider
    /** You can insert your additional repository settings here */
    sessionLifetime="expiration">
    <App />
  </RepositoryProvider>,
  document.getElementById('root'),
)
