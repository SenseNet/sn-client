import { ConstantContent, LoginState, Repository } from '@sensenet/client-core'
import { Group, User } from '@sensenet/default-content-types'
import { AnyAction, Reducer } from 'redux'
import { IInjectableActionCallbackParams } from 'redux-di-middleware'
import { rootStateType } from '.'
import { createAction, isFromAction } from './ActionHelpers'

export interface SessionReducerType {
  loginState: LoginState
  currentUser: User
  hasError: boolean
  groups: Group[]
}

export const loginToRepository = createAction((username: string, password: string, repository: string) => ({
  // tslint:disable-next-line: no-unnecessary-type-annotation
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    const repo = options.getInjectable(Repository)
    repo.configuration.repositoryUrl = repository
    try {
      const success = await repo.authentication.login(username, password)
      options.dispatch(setLoginError(!success))
    } catch (error) {
      options.dispatch(setLoginError(true))
    }
  },
  type: 'LOGIN_TO_REPOSITORY',
}))

export const logoutFromRepository = createAction(() => ({
  // tslint:disable-next-line: no-unnecessary-type-annotation
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    const repo = options.getInjectable(Repository)
    await repo.authentication.logout()
  },
  type: 'LOGOUT_FROM_REPOSITORY',
}))

export const setCurrentUser = createAction((user: User) => ({
  user,
  type: 'setCurrentUser',
}))

export const setGroups = createAction((groups: Group[]) => ({
  groups,
  type: 'setGroups',
}))

export const setLoginState = createAction((state: LoginState) => ({
  state,
  type: 'setLoginState',
}))

export const setLoginError = createAction((hasError: boolean) => ({
  hasError,
  type: 'setLoginError',
}))

export const session: Reducer<SessionReducerType, AnyAction> = (
  state = {
    loginState: LoginState.Unknown,
    currentUser: ConstantContent.VISITOR_USER,
    groups: [],
    hasError: false,
  },
  action: AnyAction,
) => {
  if (isFromAction(action, setCurrentUser)) {
    return {
      ...state,
      currentUser: action.user,
    }
  } else if (isFromAction(action, setLoginState)) {
    return {
      ...state,
      loginState: action.state,
    }
  } else if (isFromAction(action, setGroups)) {
    return {
      ...state,
      groups: action.groups,
    }
  } else if (isFromAction(action, setLoginError)) {
    return {
      ...state,
      hasError: action.hasError,
    }
  }

  return state
}
