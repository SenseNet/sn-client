import { UserManager } from '@sensenet/authentication-oidc-react'

/** Relay the iframe response before repository discovery or session initialization. */
export const handleOidcSilentCallback = () => {
  if (window.location.pathname !== '/authentication/silent-callback' || window.parent === window) return false

  // The public callback only notifies its parent. The initiating UserManager
  // validates the frame, origin, state and authorization response there.
  const manager = new UserManager({
    response_type: 'code',
    automaticSilentRenew: false,
    monitorSession: false,
  })
  manager.signinSilentCallback(window.location.href).catch(() => {
    console.error('The silent sign-in response could not be delivered.')
  })
  return true
}
