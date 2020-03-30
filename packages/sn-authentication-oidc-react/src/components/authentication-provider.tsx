import { History } from 'history'
import { User, UserManagerEvents, UserManagerSettings } from 'oidc-client'
import React, { createContext, ElementType, ReactNode, useCallback, useEffect, useReducer } from 'react'
import { authenticationService } from '../authentication-service'
import { addOidcEvents, login, logout, oidcReducer, removeOidcEvents } from '../oidc-events'
import { CallbackContainer } from './callback'
import { OidcRoutes } from './oidc-routes'
import { SessionLostContainer, SessionLostProps } from './session-lost'

export type AuthenticationContextState = {
  isLoading: boolean
  authenticating?: ReactNode
  oidcUser?: User
  error?: string
  isEnabled?: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  events: UserManagerEvents
}

export const AuthenticationContext = createContext<AuthenticationContextState | undefined>(undefined)

export type AuthenticationProviderProps = {
  children: ReactNode
  history: History
  authenticating?: ReactNode
  notAuthenticated?: ReactNode
  notAuthorized?: ReactNode
  sessionLost?: ElementType<SessionLostProps>
  callbackComponentOverride?: ReactNode
  configuration: UserManagerSettings
}

const setDefaultState = (configuration: UserManagerSettings) => ({
  userManager: authenticationService(configuration),
  isLoading: false,
})

export const AuthenticationProvider = (props: AuthenticationProviderProps) => {
  const [oidcState, dispatch] = useReducer(oidcReducer, setDefaultState(props.configuration))

  useEffect(() => {
    dispatch({ type: 'ON_LOADING' })
    addOidcEvents(oidcState.userManager.events, dispatch, oidcState.userManager)
    oidcState.userManager.getUser().then(user => {
      if (!user) {
        return
      }
      dispatch({ type: 'ON_LOAD_USER', user })
    })
    return () => removeOidcEvents(oidcState.userManager.events, dispatch, oidcState.userManager)
  }, [oidcState.userManager])

  const { oidcUser, isLoading, error } = oidcState
  const {
    authenticating,
    notAuthenticated,
    notAuthorized,
    callbackComponentOverride,
    sessionLost,
    configuration,
    children,
    history,
  } = props

  return (
    <AuthenticationContext.Provider
      value={{
        isLoading,
        oidcUser,
        error,
        authenticating,
        login: useCallback(() => login(oidcState.userManager, dispatch, history.location, history)(), [
          history,
          oidcState.userManager,
        ]),
        logout: useCallback(() => logout(oidcState.userManager, dispatch)(), [oidcState.userManager]),
        events: oidcState.userManager.events,
      }}>
      <OidcRoutes
        notAuthenticated={notAuthenticated}
        notAuthorized={notAuthorized}
        callbackComponent={
          <CallbackContainer callbackComponentOverride={callbackComponentOverride} history={history} />
        }
        sessionLost={<SessionLostContainer SessionLostComponentOverride={sessionLost} history={history} />}
        configuration={configuration}>
        {children}
      </OidcRoutes>
    </AuthenticationContext.Provider>
  )
}
