import { useContext } from 'react'
import { AuthenticationContext } from './components/authentication-provider'

// eslint-disable-next-line require-jsdoc
export function useOidcAuthentication() {
  const context = useContext(AuthenticationContext)

  if (!context) {
    throw new Error('useOidcAuthentication must be used within a AuthenticationProvider')
  }
  const { isEnabled, login, logout, oidcUser, events, isLoading } = context
  return { isEnabled, login, logout, oidcUser, events, isLoading }
}
