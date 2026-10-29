import { History, Location } from 'history'
import { User, UserManager } from 'oidc-client'
import { Dispatch } from 'react'
import { CustomEvents } from './components/authentication-provider'
import { authenticateUser, logoutUser } from './oidc-service'
import { isSupersededOidcOperation } from './user-manager-lifecycle'

export type AuthenticationErrorOperation = 'login' | 'logout' | 'refresh'

type Action =
  | { type: 'ON_ERROR'; message: string; operation?: AuthenticationErrorOperation }
  | { type: 'ON_LOADING' }
  | { type: 'ON_LOAD_USER'; user: User }
  | { type: 'ON_UNLOAD_USER' }

type State = {
  oidcUser?: User
  userManager: UserManager
  isLoading: boolean
  error?: string
  errorOperation?: AuthenticationErrorOperation
}

export const oidcReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'ON_ERROR':
      return { ...state, error: action.message, errorOperation: action.operation, isLoading: false }
    case 'ON_LOADING':
      return { ...state, error: undefined, errorOperation: undefined, isLoading: true }
    case 'ON_LOAD_USER':
      return { ...state, oidcUser: action.user, error: undefined, errorOperation: undefined, isLoading: false }
    case 'ON_UNLOAD_USER':
      return { ...state, oidcUser: undefined, error: undefined, errorOperation: undefined, isLoading: false }
    default:
      return state
  }
}

export const logout = (userManager: UserManager, dispatch: Dispatch<Action>) => async () => {
  try {
    await logoutUser(userManager)
  } catch (error) {
    if (!isSupersededOidcOperation(error)) onError(dispatch, error, 'logout')
  }
}

export const login =
  (userManager: UserManager, dispatch: Dispatch<Action>, location: Location, history: History) => async () => {
    dispatch({ type: 'ON_LOADING' })
    try {
      await authenticateUser(userManager, location, history)()
    } catch (error) {
      if (!isSupersededOidcOperation(error)) onError(dispatch, error, 'login')
      throw error
    }
  }

export const onError = (dispatch: Dispatch<Action>, error: Error, operation?: AuthenticationErrorOperation) => {
  dispatch({ type: 'ON_ERROR', message: error.message, ...(operation ? { operation } : {}) })
}

export const onUserLoaded = (dispatch: Dispatch<Action>, user: User) => {
  dispatch({ type: 'ON_LOAD_USER', user })
}

export const onUserUnloaded = (dispatch: Dispatch<Action>) => {
  dispatch({ type: 'ON_UNLOAD_USER' })
}

export const onAccessTokenExpired = async (dispatch: Dispatch<Action>, userManager: UserManager) => {
  dispatch({ type: 'ON_UNLOAD_USER' })
  await userManager.signinSilent()
}

type oidcEventsOptions = {
  customEvents?: CustomEvents
  dispatch: Dispatch<Action>
  userManager: UserManager
}

type OidcSubscription = oidcEventsOptions & { dispose: () => void }
const subscriptions = new WeakMap<UserManager, Set<OidcSubscription>>()

export const addOidcEvents = ({ dispatch, userManager, customEvents }: oidcEventsOptions) => {
  let disposed = false
  let revision = 0
  const userLoaded = (user: User) => {
    revision++
    customEvents?.onUserLoaded?.(user)
    onUserLoaded(dispatch, user)
  }
  const silentRenewError = (error: Error) => {
    if (isSupersededOidcOperation(error)) return
    customEvents?.onSilentRenewError?.(error)
    onError(dispatch, error, 'refresh')
  }
  const userUnloaded = () => {
    revision++
    customEvents?.onUserUnloaded?.()
    onUserUnloaded(dispatch)
  }
  const userSignedOut = () => {
    revision++
    customEvents?.onUserSignedOut?.()
    onUserUnloaded(dispatch)
  }
  const accessTokenExpired = () => {
    const startedAt = ++revision
    customEvents?.onAccessTokenExpired?.()
    onAccessTokenExpired(dispatch, userManager).catch((error) => {
      if (!disposed && revision === startedAt && !isSupersededOidcOperation(error)) onError(dispatch, error, 'refresh')
    })
  }

  userManager.events.addUserLoaded(userLoaded)
  userManager.events.addSilentRenewError(silentRenewError)
  userManager.events.addUserUnloaded(userUnloaded)
  userManager.events.addUserSignedOut(userSignedOut)
  userManager.events.addAccessTokenExpired(accessTokenExpired)

  if (customEvents?.onAccessTokenExpiring) {
    userManager.events.addAccessTokenExpiring(customEvents.onAccessTokenExpiring)
  }
  if (customEvents?.onUserSessionChanged) {
    userManager.events.addUserSessionChanged(customEvents.onUserSessionChanged)
  }

  let managerSubscriptions = subscriptions.get(userManager)
  if (!managerSubscriptions) {
    managerSubscriptions = new Set()
    subscriptions.set(userManager, managerSubscriptions)
  }
  const subscription: OidcSubscription = {
    dispatch,
    userManager,
    customEvents,
    dispose: () => {
      if (disposed) return
      disposed = true
      userManager.events.removeUserLoaded(userLoaded)
      userManager.events.removeSilentRenewError(silentRenewError)
      userManager.events.removeUserUnloaded(userUnloaded)
      userManager.events.removeUserSignedOut(userSignedOut)
      userManager.events.removeAccessTokenExpired(accessTokenExpired)
      if (customEvents?.onAccessTokenExpiring) {
        userManager.events.removeAccessTokenExpiring(customEvents.onAccessTokenExpiring)
      }
      if (customEvents?.onUserSessionChanged) {
        userManager.events.removeUserSessionChanged(customEvents.onUserSessionChanged)
      }
      managerSubscriptions!.delete(subscription)
      if (!managerSubscriptions!.size) subscriptions.delete(userManager)
    },
  }
  managerSubscriptions.add(subscription)
  return subscription.dispose
}

export const removeOidcEvents = ({ dispatch, userManager, customEvents }: oidcEventsOptions) => {
  for (const subscription of subscriptions.get(userManager) ?? []) {
    if (subscription.dispatch === dispatch && subscription.customEvents === customEvents) subscription.dispose()
  }
}
