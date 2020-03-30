import { History, Location } from 'history'
import { User, UserManager, UserManagerEvents } from 'oidc-client'
import { Dispatch } from 'react'
import { authenticateUser, logoutUser } from './oidc-service'

type Action =
  | { type: 'ON_ERROR'; message: string }
  | { type: 'ON_LOADING' }
  | { type: 'ON_LOAD_USER'; user: User }
  | { type: 'ON_UNLOAD_USER' }

type State = {
  oidcUser?: User
  userManager: UserManager
  isLoading: boolean
  error?: string
}

// eslint-disable-next-line require-jsdoc
export function oidcReducer(state: State, action: Action) {
  switch (action.type) {
    case 'ON_ERROR':
      return { ...state, error: action.message, isLoading: false }
    case 'ON_LOADING':
      return { ...state, isLoading: true }
    case 'ON_LOAD_USER':
      return { ...state, oidcUser: action.user, isLoading: false }
    case 'ON_UNLOAD_USER':
      return { ...state, oidcUser: undefined, isLoading: false }
    default:
      return state
  }
}

export const onError = (dispatch: Dispatch<Action>) => (error: Error) => {
  dispatch({ type: 'ON_ERROR', message: error.message })
}

export const logout = (userManager: UserManager, dispatch: Dispatch<Action>) => async () => {
  try {
    await logoutUser(userManager)
  } catch (error) {
    onError(dispatch)(error)
  }
}

export const login = (
  userManager: UserManager,
  dispatch: Dispatch<Action>,
  location: Location,
  history: History,
) => async () => {
  dispatch({ type: 'ON_LOADING' })
  await authenticateUser(userManager, location, history)()
}

export const onUserLoaded = (dispatch: Dispatch<Action>) => (user: User) => {
  dispatch({ type: 'ON_LOAD_USER', user })
}

export const onUserUnloaded = (dispatch: Dispatch<Action>) => () => {
  dispatch({ type: 'ON_UNLOAD_USER' })
}

export const onAccessTokenExpired = (dispatch: Dispatch<Action>, userManager: UserManager) => async () => {
  dispatch({ type: 'ON_UNLOAD_USER' })
  await userManager.signinSilent()
}

export const addOidcEvents = (events: UserManagerEvents, dispatch: Dispatch<Action>, userManager: UserManager) => {
  events.addUserLoaded(onUserLoaded(dispatch))
  events.addSilentRenewError(onError(dispatch))
  events.addUserUnloaded(onUserUnloaded(dispatch))
  events.addUserSignedOut(onUserUnloaded(dispatch))
  events.addAccessTokenExpired(onAccessTokenExpired(dispatch, userManager))
}

export const removeOidcEvents = (events: UserManagerEvents, dispatch: Dispatch<Action>, userManager: UserManager) => {
  events.removeUserLoaded(onUserLoaded(dispatch))
  events.removeSilentRenewError(onError(dispatch))
  events.removeUserUnloaded(onUserUnloaded(dispatch))
  events.removeUserSignedOut(onUserUnloaded(dispatch))
  events.removeAccessTokenExpired(onAccessTokenExpired(dispatch, userManager))
}
