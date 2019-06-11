import { Middleware } from 'redux'
import { isPromiseMiddlewareAction } from './IsPromiseMiddlewareAction'
import { PromiseMiddlewareFailedAction, PromiseMiddlewareSucceededAction } from './Types'

export const suffixes = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

/**
 * Redux middleware to handle async actions in @sensenet/redux
 * @param repository {Repository} resporitory of the application.
 * Usage example:
 *
 * ```
 * import { Repository } from '@sensenet/client-core'
 * import { promiseMiddleware } from '@sensenet/redux-promise-middleware'
 *
 * const repository = new Repository({ repositoryUrl: 'https://mySensenetSite.com' }, async () => ({ ok: true } as any))
 * const store = createStore(
 *  rootReducer,
 *  persistedState,
 *  applyMiddleware([promiseMiddleware(repository)]),
 * )
 */
export const promiseMiddleware: <TService>(service: TService) => Middleware = service => {
  return ref => {
    const { dispatch } = ref

    return next => action => {
      const actionType = action.type
      if (isPromiseMiddlewareAction(action)) {
        ;(async () => {
          const { payload, ...originalAction } = action
          try {
            const result = await action.payload(service)
            return dispatch<PromiseMiddlewareSucceededAction<typeof result> & typeof originalAction>({
              ...originalAction,
              type: `${actionType}_${suffixes.success}`,
              result,
            })
          } catch (error) {
            return dispatch<PromiseMiddlewareFailedAction<typeof error> & typeof originalAction>({
              ...originalAction,
              type: `${actionType}_${suffixes.failure}`,
              error,
            })
          }
        })()
        return next({
          ...(action as object),
          type: `${actionType}_${suffixes.loading}`,
        } as typeof action)
      }
      return next(action)
    }
  }
}
