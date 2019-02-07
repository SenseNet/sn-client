import 'jest'
import { Action, applyMiddleware, createStore, Unsubscribe } from 'redux'
import { promiseMiddleware } from '../src/PromiseMiddleware'
import { PromiseMiddlewareAction } from '../src/Types'

/**
 * Test suite for promiseMiddleware
 */
export const promiseMiddlewareTest = describe('PromiseMiddleware', () => {
  it('Should be registered into a Store', () => {
    const store = createStore(({}) => ({}), {}, applyMiddleware(promiseMiddleware(undefined)))
    expect(store).toBeInstanceOf(Object)
  })

  it('Generic API Endpoint should be added and method should be called', (done: jest.DoneCallback) => {
    const customApi = { call: () => done() }
    const m = promiseMiddleware(customApi)
    const store = createStore(({}) => ({}), {}, applyMiddleware(m))
    store.dispatch({
      type: 'EXAMPLE_ACTION',
      payload: async api => {
        api.call()
      },
    } as PromiseMiddlewareAction<typeof customApi, any>)
  })

  it('Success action should be dispatched', (done: jest.DoneCallback) => {
    const customApi = { call: () => 1 }
    const m = promiseMiddleware(customApi)
    const store = createStore(
      (state: { actions: any[] } = { actions: [] }, action) => {
        return { actions: [...state.actions, action] }
      },
      { actions: [] },
      applyMiddleware(m),
    )
    store.dispatch({
      type: 'EXAMPLE_ACTION',
      payload: async api => {
        return api.call()
      },
    } as PromiseMiddlewareAction<typeof customApi, any>)

    let subscription!: Unsubscribe
    subscription = store.subscribe(() => {
      const actions: Action[] = store.getState().actions
      if (actions.find(a => a.type === 'EXAMPLE_ACTION_SUCCESS')) {
        subscription()
        done()
      }
    })
  })

  it('Error action should be dispatched', (done: jest.DoneCallback) => {
    const m = promiseMiddleware(undefined)
    const store = createStore(
      (state: { actions: any[] } = { actions: [] }, action) => {
        return { actions: [...state.actions, action] }
      },
      { actions: [] },
      applyMiddleware(m),
    )
    store.dispatch({
      type: 'EXAMPLE_ACTION',
      payload: async () => {
        throw Error()
      },
    } as PromiseMiddlewareAction<undefined, any>)

    let subscription!: Unsubscribe
    subscription = store.subscribe(() => {
      const actions: Action[] = store.getState().actions
      if (actions.find(a => a.type === 'EXAMPLE_ACTION_FAILURE')) {
        subscription()
        done()
      }
    })
  })
})

// export const promiseMiddlewareTest: Mocha.Suite = describe('PromiseMiddleware', () => {
//     let store: Store<{}>
//     let promiseAction: PromiseMiddlewareAction<any, any, any>
//     let loadingAction: Action
//     let successAction: PromiseMiddlewareSucceededAction<any>
//     let failureAction: PromiseMiddlewareFailedAction<any>

//     const promiseValue = 'foo'
//     const promiseReason = new Error('bar')
//     const lastMiddlewareData = { baz: true }
//     const optimisticUpdateData = { foo: true }
//     const metaData = { bar: true }

//     const service = {
//         call: (value: any) => new Promise((r) => setTimeout(() => r(value), 10)),
//         fail: (error: any[]) => new Promise((_r, reject) => setTimeout(() => reject(error), 10)),
//     }

//     const defaultPromiseAction: PromiseMiddlewareAction<any, any, any> = {
//         type: 'ACTION',
//         payload: () => new Promise((resolve) => resolve(promiseValue)),
//     }

//     const defaultloadingAction: Action = {
//         type: `${defaultPromiseAction.type}_LOADING`,
//     }

//     const defaultsuccessAction: PromiseMiddlewareSucceededAction<typeof promiseValue> = {
//         type: `${defaultPromiseAction.type}_SUCCESS`,
//         result: promiseValue,
//     }

//     const defaultfailureAction: PromiseMiddlewareFailedAction<typeof promiseReason> = {
//         type: `${defaultPromiseAction.type}_FAILURE`,
//         error: promiseReason,
//     }

//     const nextHandler = promiseMiddleware(service)

//     it('must return a function to handle next', () => {
//         expect(typeof (nextHandler)).to.be.equals('function')
//         expect(nextHandler.length).to.be.eq(1)
//     })

//     let firstMiddlewareThunkSpy: SinonSpy
//     let lastMiddlewareModifiesSpy: SinonSpy
//     const firstMiddlewareThunk = (ref, next) => {
//         firstMiddlewareThunkSpy = spy((action) => {
//             if (typeof action === 'function') {
//                 return action(ref.dispatch, ref.getState)
//             }

//             return next(action)
//         })

//         return firstMiddlewareThunkSpy
//     }

//     const lastMiddlewareModifies = (next) => {
//         lastMiddlewareModifiesSpy = spy((action) => {
//             next(action)

//             return {
//                 ...action,
//                 ...lastMiddlewareData,
//             }
//         })

//         return lastMiddlewareModifiesSpy
//     }

//     const makeMockStore = (srv: any) => applyMiddleware(
//         (ref) => (next) => firstMiddlewareThunk.call(firstMiddlewareThunk, ref, next),
//         promiseMiddleware(srv),
//         () => (next) => lastMiddlewareModifies.call(lastMiddlewareModifies, next),
//     )(createStore)(({ }) => ({}))

//     beforeEach(() => {
//         store = makeMockStore(service)
//     })

//     afterEach(() => {
//         firstMiddlewareThunkSpy.resetHistory()
//         lastMiddlewareModifiesSpy.resetHistory()
//     })

//     context('When action is not a promise:', () => {
//         const mockAction = { type: 'ACTION' }

//         it('invokes next with the action', () => {
//             store.dispatch(mockAction)
//             expect(lastMiddlewareModifiesSpy).to.have.been.calledWith(mockAction)
//         })

//         it('returns the return from next middleware', () => {
//             expect(store.dispatch(mockAction)).to.eql({
//                 ...mockAction,
//                 ...lastMiddlewareData,
//             })
//         })

//         it('does not dispatch any other actions', () => {
//             const mockStore = configureStore([promiseMiddleware(service)])
//             const s = mockStore({})
//             s.dispatch(mockAction)

//             expect([mockAction]).to.eql(s.getActions())
//         })
//     })
//     context('When action has promise payload:', () => {
//         beforeEach(() => {
//             promiseAction = defaultPromiseAction
//             loadingAction = defaultloadingAction
//             failureAction = defaultfailureAction
//             successAction = defaultsuccessAction
//         })

//         afterEach(() => {
//             promiseAction = defaultPromiseAction
//             loadingAction = defaultloadingAction
//             failureAction = defaultfailureAction
//             successAction = defaultsuccessAction
//         })

//         it('dispatches a loading action for implicit promise payload', () => {
//             store.dispatch(promiseAction)
//             expect(lastMiddlewareModifiesSpy).to.have.been.calledWith(loadingAction)
//         })

//         it('dispatches a loading action for explicit promise payload', () => {
//             store.dispatch({
//                 type: promiseAction.type,
//                 payload: {
//                     promise: promiseAction.payload,
//                 },
//             })
//             expect(lastMiddlewareModifiesSpy).to.have.been.calledWith(loadingAction)
//         })

//         it('loading action optionally contains optimistic update payload from data property', () => {
//             store.dispatch({
//                 type: promiseAction.type,
//                 payload: {
//                     promise: promiseAction.payload,
//                     data: optimisticUpdateData,
//                 },
//             })
//             expect(lastMiddlewareModifiesSpy).to.have.been.calledWith({
//                 ...loadingAction,
//                 payload: optimisticUpdateData,
//             })
//         })

//         it('loading action optionally contains falsy optimistic update payload', () => {
//             store.dispatch({
//                 type: promiseAction.type,
//                 payload: {
//                     promise: promiseAction.payload,
//                     data: 0,
//                 },
//             })
//             expect(lastMiddlewareModifiesSpy).to.have.been.calledWith({
//                 ...loadingAction,
//                 payload: 0,
//             })
//         })
//         it('loading action does contain meta property if included', () => {
//             store.dispatch(Object.assign({}, promiseAction, {
//                 meta: metaData,
//             }))
//             expect(lastMiddlewareModifiesSpy).to.have.been.calledWith(
//                 Object.assign({}, loadingAction, {
//                     meta: metaData,
//                 }),
//             )
//         })

//         it('loading action does contain falsy meta property if included', () => {
//             store.dispatch(Object.assign({}, promiseAction, {
//                 meta: 0,
//             }))
//             expect(lastMiddlewareModifiesSpy).to.have.been.calledWith(
//                 Object.assign({}, loadingAction, {
//                     meta: 0,
//                 }),
//             )
//         })

//         it('uses default separator with empty config (backward compatibility)', (done) => {
//             store = makeMockStore({})

//             successAction = {
//                 type: `${promiseAction.type}_SUCCESS`,
//                 result: promiseValue,
//             }

//             const actionDispatched = store.dispatch(promiseAction)

//             actionDispatched.payload(service).then(({ value, action }) => {
//                 expect(action).to.eql(successAction)
//                 expect(value).to.eql(promiseValue)
//                 done()
//             })
//         })
//     })
//     context('When resolve reason is null:', () => {
//         const nullResolveAction = {
//             type: defaultPromiseAction.type,
//             payload: () => Promise.resolve(null),
//         }

//         it('resolved action is dispatched', (done) => {
//             const actionDispatched = store.dispatch(nullResolveAction)

//             actionDispatched.payload().then(
//                 () => {
//                     expect(actionDispatched).to.eql({
//                         type: `${nullResolveAction.type}_SUCCESS`,
//                     })
//                     done()
//                 },
//                 () => {
//                     expect(true).to.equal(false)
//                 },
//             )
//         })

//         it('promise returns `null` value', (done) => {
//             const actionDispatched = store.dispatch(nullResolveAction)

//             actionDispatched.payload().then(
//                 (value) => {
//                     // tslint:disable-next-line:no-unused-expression
//                     expect(value).to.be.null
//                     done()
//                 },
//                 () => {
//                     expect(true).to.equal(false)
//                 },
//             )
//         })

//         it('resolved action `payload` property is undefined', (done) => {
//             const actionDispatched = store.dispatch(nullResolveAction)

//             actionDispatched.payload().then(
//                 (value) => {
//                     // tslint:disable-next-line:no-unused-expression
//                     expect(value).to.be.undefined
//                     done()
//                 },
//                 () => {
//                     expect(true).to.equal(false)
//                 },
//             )
//         })
//     })
//     context('When resolve reason is false:', () => {
//         const falseResolveAction: PromiseMiddlewareAction<any, boolean, any> = {
//             type: defaultPromiseAction.type,
//             payload: (api) => Promise.resolve(false),
//         }

//         it('resolved action is dispatched', (done) => {
//             const actionDispatched = store.dispatch(falseResolveAction)

//             actionDispatched.payload(null).then(
//                 (action) => {
//                     expect(action).to.eql({
//                         type: `${falseResolveAction.type}_SUCCESS`,
//                         payload: false,
//                     })
//                     done()
//                 },
//                 () => {
//                     expect(true).to.equal(false)
//                 },
//             )
//         })

//         it('promise returns `false` value', (done) => {
//             const actionDispatched = store.dispatch(falseResolveAction)

//             actionDispatched.payload(service).then(
//                 (value) => {
//                     // tslint:disable-next-line:no-unused-expression
//                     expect(value).to.be.false
//                     done()
//                 },
//                 () => {
//                     expect(true).to.equal(false)
//                 },
//             )
//         })

//         it('resolved action `payload` property is false', (done) => {
//             const actionDispatched = store.dispatch(falseResolveAction)
//             actionDispatched.payload(service).then(
//                 (action) => {
//                     // tslint:disable-next-line:no-unused-expression
//                     expect(action).to.be.false
//                     done()
//                 },
//                 () => {
//                     expect(true).to.equal(false)
//                 },
//             )
//         })
//     })
//     // context('When resolve reason is zero:', () => {
//     //     const zeroResolveAction = {
//     //         type: defaultPromiseAction.type,
//     //         payload: () => Promise.resolve(0),
//     //     }

//     //     it('resolved action is dispatched', (done) => {
//     //         const actionDispatched = store.dispatch(zeroResolveAction)

//     //         actionDispatched.payload().then(
//     //             ({ value, action }) => {
//     //                 expect(action).to.eql({
//     //                     type: `${zeroResolveAction.type}_SUCCESS`,
//     //                     payload: 0,
//     //                 })
//     //                 done()
//     //             },
//     //             () => {
//     //                 expect(true).to.equal(false)
//     //             },
//     //         )
//     //     })

//     //     it('promise returns `0` value', (done) => {
//     //         const actionDispatched = store.dispatch(zeroResolveAction)

//     //         actionDispatched.then(
//     //             ({ value, action }) => {
//     //                 expect(value).to.eq(0)
//     //                 done()
//     //             },
//     //             () => {
//     //                 expect(true).to.equal(false)
//     //             },
//     //         )
//     //     })

//     //     it('resolved action `payload` property is zero', (done) => {
//     //         const actionDispatched = store.dispatch(zeroResolveAction)

//     //         actionDispatched.then(
//     //             ({ value, action }) => {
//     //                 expect(action.payload).to.eq(0)
//     //                 done()
//     //             },
//     //             () => {
//     //                 expect(true).to.equal(false)
//     //             },
//     //         )
//     //     })
//     // })

//     // it('persists `meta` property from original action', async () => {
//     //     promiseAction = defaultPromiseAction
//     //     await store.dispatch({
//     //         type: promiseAction.type,
//     //         payload: promiseAction.payload,
//     //         meta: metaData,
//     //     })

//     //     expect(lastMiddlewareModifiesSpy).to.have.been.calledWith({
//     //         type: `${promiseAction.type}_SUCCESS`,
//     //         payload: promiseValue,
//     //         meta: metaData,
//     //     })
//     // })

//     // it('promise returns `value` and `action` as parameters', (done) => {
//     //     const actionDispatched = store.dispatch({
//     //         type: `${defaultPromiseAction.type}`,
//     //         payload: Promise.resolve(promiseValue),
//     //     })

//     //     actionDispatched.then(
//     //         ({ value, action }) => {
//     //             expect(value).to.eql(promiseValue)
//     //             expect(action).to.eql(defaultsuccessAction)
//     //             done()
//     //         },
//     //         () => {
//     //             expect(true).to.equal(false)
//     //         },
//     //     )
//     // })

//     // it('allows global customisation of success action `type`', (done) => {
//     //     store = makeMockStore(repository)

//     //     successAction = {
//     //         type: `${promiseAction.type}_SUCCESS`,
//     //         payload: promiseValue,
//     //     }

//     //     const actionDispatched = store.dispatch(promiseAction)

//     //     actionDispatched.then(({ value, action }) => {
//     //         expect(action).to.eql(successAction)
//     //         expect(value).to.eql(promiseValue)
//     //         done()
//     //     })
//     // })
//     // context('When using async functions:', () => {
//     //     it('supports async function as payload.promise', async () => {
//     //         const resolvedValue = 'FOO_DATA'

//     //         const { value, action } = await store.dispatch({
//     //             type: 'FOO',
//     //             payload: {
//     //                 async promise() {
//     //                     return resolvedValue
//     //                 },
//     //             },
//     //         })

//     //         const callArgs = lastMiddlewareModifiesSpy.getCalls().map((x) => x.args[0])

//     //         expect(lastMiddlewareModifiesSpy.callCount).to.eql(2)

//     //         expect(callArgs[0]).to.eql({
//     //             type: 'FOO_LOADING',
//     //         })

//     //         expect(callArgs[1]).to.eql({
//     //             type: 'FOO_SUCCESS',
//     //             payload: resolvedValue,
//     //         })
//     //     })

//     //     it('supports async function as payload', async () => {
//     //         const resolvedValue = 'FOO_DATA'

//     //         const { value, action } = await store.dispatch({
//     //             type: 'FOO',
//     //             async payload() {
//     //                 return resolvedValue
//     //             },
//     //         })

//     //         const callArgs = lastMiddlewareModifiesSpy.getCalls().map((x) => x.args[0])

//     //         expect(lastMiddlewareModifiesSpy.callCount).to.eql(2)

//     //         expect(callArgs[0]).to.eql({
//     //             type: 'FOO_LOADING',
//     //         })

//     //         expect(callArgs[1]).to.eql({
//     //             type: 'FOO_SUCCESS',
//     //             payload: resolvedValue,
//     //         })
//     //     })

//     //     it('supports optimistic updates', async () => {
//     //         const resolvedValue = 'FOO_DATA'
//     //         const data = {
//     //             foo: 1,
//     //             bar: 1,
//     //             baz: 3,
//     //         }

//     //         const { value, action } = await store.dispatch({
//     //             type: 'FOO',
//     //             payload: {
//     //                 data,
//     //                 async promise() {
//     //                     return resolvedValue
//     //                 },
//     //             },
//     //         })

//     //         const callArgs = lastMiddlewareModifiesSpy.getCalls().map((x) => x.args[0])

//     //         expect(lastMiddlewareModifiesSpy.callCount).to.eql(2)

//     //         expect(callArgs[0]).to.eql({
//     //             type: 'FOO_LOADING',
//     //             payload: data,
//     //         })

//     //         expect(callArgs[1]).to.eql({
//     //             type: 'FOO_SUCCESS',
//     //             payload: resolvedValue,
//     //         })
//     //     })

//     //     it('supports rejected async functions', async () => {
//     //         const error = new Error(Math.random().toString())

//     //         try {
//     //             await store.dispatch({
//     //                 type: 'FOO',
//     //                 async payload() {
//     //                     throw error
//     //                 },
//     //             })

//     //             throw new Error('Should not get here.')
//     //         } catch (err) {
//     //             const callArgs = lastMiddlewareModifiesSpy.getCalls().map((x) => x.args[0])

//     //             expect(lastMiddlewareModifiesSpy.callCount).to.eql(2)

//     //             expect(callArgs[0]).to.eql({
//     //                 type: 'FOO_LOADING',
//     //             })

//     //             expect(callArgs[1]).to.eql({
//     //                 type: 'FOO_FAILURE',
//     //                 error: true,
//     //                 payload: error,
//     //             })
//     //         }
//     //     })

//     //     it('handles synchronous functions', () => {
//     //         const resolvedValue = 'FOO_DATA'
//     //         const metaValue = {
//     //             foo: 'foo',
//     //         }

//     //         store.dispatch({
//     //             type: 'FOO',
//     //             meta: metaValue,
//     //             payload() {
//     //                 return resolvedValue
//     //             },
//     //         })

//     //         const callArgs = lastMiddlewareModifiesSpy.getCalls().map((x) => x.args[0])

//     //         expect(lastMiddlewareModifiesSpy.callCount).to.eql(1)
//     //         expect(callArgs[0]).to.eql({
//     //             type: 'FOO',
//     //             meta: metaValue,
//     //             payload: resolvedValue,
//     //         })
//     //     })
//     // })
//     // context('When promise is rejected:', () => {
//     //     beforeEach(() => {
//     //         promiseAction = {
//     //             type: defaultPromiseAction.type,
//     //             payload: new Promise(() => {
//     //                 throw promiseReason
//     //             }),
//     //         }

//     //         failureAction = defaultfailureAction
//     //     })

//     //     it('errors can be caught with `catch`', () => {
//     //         const actionDispatched = store.dispatch(promiseAction)

//     //         return actionDispatched
//     //             .then(() => expect(true).to.equal(false))
//     //             .catch((error) => {
//     //                 expect(error).to.be.instanceOf(Error)
//     //             })
//     //     })

//     //     it('errors can be caught with `then`', () => {
//     //         const actionDispatched = store.dispatch(promiseAction)

//     //         return actionDispatched.then(
//     //             () => expect(true).to.equal(false),
//     //             (error) => {
//     //                 expect(error).to.be.instanceOf(Error)
//     //                 expect(error.message).to.equal(promiseReason.message)
//     //             },
//     //         )
//     //     })

//     //     it('rejected action `error` property is true', () => {
//     //         const mockStore = configureStore([
//     //             promiseMiddleware(repository),
//     //         ])

//     //         const s = mockStore({})

//     //         return s.dispatch(promiseAction).catch(() => {
//     //             const rejectedAction = s.getActions()[1]
//     //             // tslint:disable-next-line:no-unused-expression
//     //             expect(rejectedAction.error).to.be.true
//     //         })
//     //     })

//     //     it('rejected action `payload` property is original rejected instance of Error', () => {
//     //         const baseErrorMessage = 'error'
//     //         const baseError = new Error(baseErrorMessage)

//     //         const s = configureStore([
//     //             promiseMiddleware(repository),
//     //         ])({})

//     //         return s.dispatch({
//     //             type: defaultPromiseAction.type,
//     //             payload: Promise.reject(baseError),
//     //         }).payload.catch(() => {
//     //             const rejectedAction = s.getActions()[1]
//     //             expect(rejectedAction.payload).to.be.equal(baseError)
//     //             expect(rejectedAction.payload.message).to.be.equal(baseErrorMessage)
//     //         })
//     //     })

//     //     it('promise returns original rejected instance of Error', () => {
//     //         const baseErrorMessage = 'error'
//     //         const baseError = new Error(baseErrorMessage)

//     //         const actionDispatched = store.dispatch({
//     //             type: defaultPromiseAction.type,
//     //             payload: Promise.reject(baseError),
//     //         })

//     //         return actionDispatched.payload.catch((error) => {
//     //             expect(error).to.be.equal(baseError)
//     //             expect(error.message).to.be.equal(baseErrorMessage)
//     //         })
//     //     })
//     // })
// })
