import { Action } from 'redux'

/**
 * Interface that defines an action that will be parsed by the Promise Middleware
 */
export interface PromiseMiddlewareAction<TService, TReturns> extends Action {
    payload: (api: TService) => Promise<TReturns>
}

/**
 * Interface that defines a succeeded Promise middleware action
 */
export interface PromiseMiddlewareSucceededAction<TReturns> extends Action {
    result: TReturns
}

/**
 * Interface that declares a failed Promise middleware action
 */
export interface PromiseMiddlewareFailedAction<TError> extends Action {
    error: TError
}
