import { ConstantContent, LoginState, RepositoryConfigurationWithDefaults } from '@sensenet/client-core'
import { User } from '@sensenet/default-content-types'
import { combineReducers, Reducer } from 'redux'
import { loadRepository, userChanged } from '../Actions'

/**
 * Reducer to handle Actions on the country property in the session object.
 * @param [state=''] Represents the current state.
 * @param action Represents an action that is called.
 * @returns  state. Returns the next state based on the action.
 */
export const country: Reducer<string> = (state = '') => {
  return state
}
/**
 * Reducer to handle Actions on the language property in the session object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns  state. Returns the next state based on the action.
 */
export const language: Reducer<string> = (state = 'en-US', action) => {
  switch (action.type) {
    case 'USER_CHANGED':
      if (typeof action.user.Language !== 'undefined' && action.user.Language.length > 0) {
        return action.user.Language[0]
      } else {
        return state
      }
    default:
      return state
  }
}
/**
 * Reducer to handle Actions on the loginState property in the session object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns  state. Returns the next state based on the action.
 */
export const loginState: Reducer<LoginState> = (state = LoginState.Pending, action) => {
  switch (action.type) {
    case 'USER_LOGIN_STATE_CHANGED':
      return action.loginState
    default:
      return state
  }
}
/**
 * Reducer to handle Actions on the loginError property in the session object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns  state. Returns the next state based on the action.
 */
export const loginError: Reducer<string | null> = (state = null, action) => {
  switch (action.type) {
    case 'USER_LOGIN_SUCCESS':
      return !action.result ? 'Wrong username or password!' : null
    case 'USER_LOGIN_FAILURE':
      return action.error.message
    case 'USER_LOGOUT_FAILURE':
      return action.error.message
    default:
      return state
  }
}
/**
 * Reducer to handle Actions on the userName property in the user object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns  state. Returns the next state based on the action.
 */
export const userName: Reducer<string, ReturnType<typeof userChanged>> = (
  state = ConstantContent.VISITOR_USER.Name,
  action,
) => {
  switch (action.type) {
    case 'USER_CHANGED':
      return action.user.Name
    default:
      return state
  }
}
/**
 * Reducer to handle Actions on the fullName property in the user object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns  state. Returns the next state based on the action.
 */
export const fullName: Reducer<string, ReturnType<typeof userChanged>> = (
  state = ConstantContent.VISITOR_USER.DisplayName,
  action,
) => {
  switch (action.type) {
    case 'USER_CHANGED':
      return action.user.DisplayName as string
    default:
      return state
  }
}
/**
 * Reducer to handle Actions on the userLanguage property in the user object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns  state. Returns the next state based on the action.
 */
export const userLanguage: Reducer<string, ReturnType<typeof userChanged>> = (state = 'en-US', action) => {
  switch (action.type) {
    case 'USER_CHANGED':
      if (typeof action.user.Language !== 'undefined' && action.user.Language.length > 0) {
        return action.user.Language[0]
      } else {
        return state
      }
    default:
      return state
  }
}
/**
 * Reducer to handle Actions on the userAvatarPath property in the user object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns  state. Returns the next state based on the action.
 */
export const userAvatarPath: Reducer<string, ReturnType<typeof userChanged>> = (state = '', action) => {
  switch (action.type) {
    case 'USER_CHANGED':
      return action.user && action.user.Avatar && (action.user.Avatar as any).Url ? (action.user.Avatar as any).Url : ''
    default:
      return state
  }
}

/**
 * Reducer to handle Actions on the id property in the user object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns state. Returns the next state based on the action.
 */
export const userContent: Reducer<User, ReturnType<typeof userChanged>> = (
  state = ConstantContent.VISITOR_USER,
  action,
) => {
  switch (action.type) {
    case 'USER_CHANGED':
      return action.user
    default:
      return state
  }
}
/**
 * Reducer combining userName, fullName, userLanguage, userAvatarPath into a single object, ```user```.
 */
const user = combineReducers<{
  userName: ReturnType<typeof userName>
  fullName: ReturnType<typeof fullName>
  userLanguage: ReturnType<typeof userLanguage>
  userAvatarPath: ReturnType<typeof userAvatarPath>
  content: ReturnType<typeof userContent>
}>({
  userName,
  fullName,
  userLanguage,
  userAvatarPath,
  content: userContent,
})
/**
 * Reducer to handle Actions on the repostory property in the user object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns  state. Returns the next state based on the action.
 */
export const repository: Reducer<RepositoryConfigurationWithDefaults | null, ReturnType<typeof loadRepository>> = (
  state = null,
  action: any,
) => {
  switch (action.type) {
    case 'LOAD_REPOSITORY':
      return action.repository
    default:
      return state
  }
}
/**
 * Reducer combining country, language, loginState, error, user and repository into a single object, ```session```.
 */
export const session = combineReducers<{
  country: ReturnType<typeof country>
  language: ReturnType<typeof language>
  loginState: ReturnType<typeof loginState>
  error: ReturnType<typeof loginError>
  user: ReturnType<typeof user>
  repository: ReturnType<typeof repository>
}>({
  country,
  language,
  loginState,
  error: loginError,
  user,
  repository,
})
