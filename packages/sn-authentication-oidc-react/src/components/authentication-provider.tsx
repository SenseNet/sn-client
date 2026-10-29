import { History } from 'history'
import { User, UserManager, UserManagerSettings } from 'oidc-client'
import React, { createContext, ElementType, ReactNode, useCallback, useEffect, useReducer } from 'react'
import { authenticationService } from '../authentication-service'
import { addOidcEvents, AuthenticationErrorOperation, logout, login as oidcLogin, oidcReducer } from '../oidc-events'
import { coordinateUserManager } from '../user-manager-lifecycle'
import { CallbackContainer } from './callback'
import { OidcRoutes } from './oidc-routes'
import { SessionLostContainer, SessionLostProps } from './session-lost'

export interface AuthenticationContextState {
  isLoading: boolean
  authenticating?: ReactNode
  oidcUser?: User
  error?: string
  errorOperation?: AuthenticationErrorOperation
  login: () => Promise<void>
  logout: () => Promise<void>
}

export const AuthenticationContext = createContext<AuthenticationContextState | undefined>(undefined)

export interface CustomEvents {
  /** Subscribe to events raised when user session has been established (or re-established) */
  onUserLoaded?: (user: User) => void
  /** Subscribe to events raised when a user session has been terminated */
  onUserUnloaded?: () => void
  /** Subscribe to events raised when the automatic silent renew has failed */
  onSilentRenewError?: (error: Error) => void
  /** Subscribe to events raised when the user's sign-in status at the OP has changed */
  onUserSignedOut?: () => void
  /** When `monitorSession` subscribe to events raised when the user session changed */
  onUserSessionChanged?: () => void
  /** Subscribe to events raised prior to the access token expiring */
  onAccessTokenExpiring?: () => void
  /** Subscribe to events raised after the access token has expired */
  onAccessTokenExpired?: () => void
}

export interface AuthenticationProviderProps {
  children: ReactNode
  history: History
  authenticating?: () => ReactNode
  notAuthenticated?: ({ login }: { login: () => Promise<void> }) => ReactNode
  notAuthorized?: () => ReactNode
  sessionLost?: ElementType<SessionLostProps>
  callbackComponentOverride?: () => ReactNode
  configuration: UserManagerSettings
  customEvents?: CustomEvents
}

const setDefaultState = (configuration: UserManagerSettings) => {
  const userManager = authenticationService(configuration)
  return {
    userManager: userManager instanceof UserManager ? coordinateUserManager(userManager, configuration) : userManager,
    isLoading: false,
  }
}

export const AuthenticationProvider = (props: AuthenticationProviderProps) => {
  const [oidcState, dispatch] = useReducer(oidcReducer, setDefaultState(props.configuration))

  useEffect(() => {
    let active = true
    let eventRevision = 0
    dispatch({ type: 'ON_LOADING' })
    const dispose = addOidcEvents({
      customEvents: props.customEvents,
      dispatch: (action) => {
        if (!active) return
        eventRevision++
        dispatch(action)
      },
      userManager: oidcState.userManager,
    })
    oidcState.userManager
      .getUser()
      .then((user) => {
        if (!active || eventRevision) return
        dispatch(user ? { type: 'ON_LOAD_USER', user } : { type: 'ON_UNLOAD_USER' })
      })
      .catch((error) => {
        if (active && !eventRevision) dispatch({ type: 'ON_ERROR', message: error.message, operation: 'login' })
      })
    return () => {
      active = false
      dispose()
    }
  }, [oidcState.userManager, props.customEvents])

  const { oidcUser, isLoading, error, errorOperation } = oidcState
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

  const login = useCallback(
    async () => await oidcLogin(oidcState.userManager, dispatch, history.location, history)(),
    [history, oidcState.userManager],
  )

  return (
    <AuthenticationContext.Provider
      value={{
        isLoading,
        oidcUser,
        error,
        errorOperation,
        authenticating: authenticating?.(),
        login,
        logout: useCallback(() => logout(oidcState.userManager, dispatch)(), [oidcState.userManager]),
      }}>
      <OidcRoutes
        notAuthenticated={notAuthenticated?.({ login })}
        notAuthorized={notAuthorized?.()}
        callbackComponent={
          <CallbackContainer callbackComponentOverride={callbackComponentOverride?.()} history={history} />
        }
        sessionLost={<SessionLostContainer SessionLostComponentOverride={sessionLost} history={history} />}
        configuration={configuration}>
        {children}
      </OidcRoutes>
    </AuthenticationContext.Provider>
  )
}
