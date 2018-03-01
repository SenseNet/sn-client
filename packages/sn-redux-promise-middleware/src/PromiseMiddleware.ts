import { isPromise } from './IsPromise'

// tslint:disable:completed-docs

export const suffixes = ['LOADING', 'SUCCESS', 'FAILURE']

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
export const promiseMiddleware = (repository) => {
    return (ref) => {
        const { dispatch } = ref

        return (next) => (action) => {
            let promise
            let data

            if (action.payload) {
                const PAYLOAD = action.payload

                if (isPromise(PAYLOAD)) {
                    promise = PAYLOAD
                } else if (isPromise(PAYLOAD.promise)) {
                    promise = PAYLOAD.promise
                    data = PAYLOAD.data
                } else if (
                    typeof PAYLOAD === 'function' ||
                    typeof PAYLOAD.promise === 'function'
                ) {
                    promise = PAYLOAD.promise ? PAYLOAD.promise(repository) : PAYLOAD(repository)
                    data = PAYLOAD.promise ? PAYLOAD.data : undefined

                    if (!isPromise(promise)) {

                        return next({
                            ...action,
                            payload: promise,
                        })
                    }
                } else {
                    return next(action)
                }

            } else {
                return next(action)
            }

            const TYPE = action.type
            const META = action.meta

            const [
                _LOADING,
                _SUCCESS,
                _FAUILURE,
            ] = suffixes

            const getAction = (newPayload, isRejected) => ({

                type: [
                    TYPE,
                    isRejected ? _FAUILURE : _SUCCESS,
                ].join('_'),

                ...((newPayload === null || typeof newPayload === 'undefined') ? {} : {
                    payload: newPayload,
                }),

                ...(META !== undefined ? { meta: META } : {}),

                ...(isRejected ? {
                    error: true,
                } : {}),
            })

            const handleReject = (reason) => {
                const rejectedAction = getAction(reason, true)
                dispatch(rejectedAction)

                throw reason
            }

            const handleFulfill = (value) => {
                const resolvedAction = getAction(value, false)
                dispatch(resolvedAction)

                return { value, action: resolvedAction }
            }

            next({
                type: [TYPE, _LOADING].join('_'),

                ...(data !== undefined ? { payload: data } : {}),

                ...(META !== undefined ? { meta: META } : {}),
            })

            return promise.then(handleFulfill, handleReject)
        }
    }
}
