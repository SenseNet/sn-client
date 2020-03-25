import { AuthenticationProvider } from '@sensenet/authentication-oidc-react'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, useHistory } from 'react-router-dom'
import { App } from './app'
import { configuration } from './configuration'
import { RepositoryProvider } from './context/repository-provider'
import './style.css'

const Appp = () => {
  const history = useHistory()
  return (
    <AuthenticationProvider configuration={configuration} isEnabled={true} history={history}>
      <RepositoryProvider>
        <App />
      </RepositoryProvider>
    </AuthenticationProvider>
  )
}
/**
 * Initialize React
 */
ReactDOM.render(
  <BrowserRouter>
    <Appp />
  </BrowserRouter>,
  document.getElementById('root'),
)
