import { PromiseMiddlewareAction } from './Types'

/**
 * Type guard method to determine if the current action is a Promise Middleware Action
 * @param action The action to be checked
 */
export const isPromiseMiddlewareAction = <TApi, TReturns>(
  action: any,
): action is PromiseMiddlewareAction<TApi, TReturns> => {
  if (action.type && action.type.length && action.payload && typeof action.payload === 'function') {
    return true
  }
  return false
}
