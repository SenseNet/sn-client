import { useContext } from 'react'
import { AuthenticationContext } from './components/authentication-provider'

export const useSnAuth = () => {
  const context = useContext(AuthenticationContext)

  if (!context) {
    throw new Error('useSnAuth must be used within a AuthenticationProvider')
  }

  return context
}
