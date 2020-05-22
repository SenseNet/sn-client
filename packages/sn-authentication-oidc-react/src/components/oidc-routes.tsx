import React, { memo, ReactNode, useEffect, useState } from 'react'
import { UserManagerSettings } from 'oidc-client'
import { getPath } from '../route-utils'
import { NotAuthenticated } from './not-authenticated'
import { NotAuthorized } from './not-authorized'
import { SilentCallback } from './silent-callback'

export type OidcRoutesProps = {
  notAuthenticated?: ReactNode
  notAuthorized?: ReactNode
  callbackComponent: ReactNode
  sessionLost?: ReactNode
  configuration: UserManagerSettings
  children: ReactNode
}

const OidcRoutesComponent = ({
  notAuthenticated = <NotAuthenticated />,
  notAuthorized = <NotAuthorized />,
  callbackComponent,
  sessionLost,
  configuration,
  children,
}: OidcRoutesProps) => {
  const [path, setPath] = useState(window.location.pathname)

  const setNewPath = () => setPath(window.location.pathname)
  useEffect(() => {
    setNewPath()
    window.addEventListener('popstate', setNewPath, false)
    return () => window.removeEventListener('popstate', setNewPath, false)
  })

  const silentCallbackPath = getPath(configuration.silent_redirect_uri)
  const callbackPath = getPath(configuration.redirect_uri)

  switch (path) {
    case callbackPath:
      return <>{callbackComponent}</>
    case silentCallbackPath:
      return <SilentCallback />
    case '/authentication/not-authenticated':
      return <>{notAuthenticated}</>
    case '/authentication/not-authorized':
      return <>{notAuthorized}</>
    case '/authentication/session-lost':
      return <>{sessionLost}</>
    default:
      return <>{children}</>
  }
}

export const OidcRoutes = memo(OidcRoutesComponent)
