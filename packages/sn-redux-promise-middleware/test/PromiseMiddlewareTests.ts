import 'jest'
import { Action, applyMiddleware, createStore, Unsubscribe } from 'redux'
import { promiseMiddleware } from '../src/PromiseMiddleware'
import { PromiseMiddlewareAction } from '../src/Types'

/**
 * Test suite for promiseMiddleware
 */
export const promiseMiddlewareTest = describe('PromiseMiddleware', () => {
  it('Should be registered into a Store', () => {
    const store = createStore((a = {}) => a, {}, applyMiddleware(promiseMiddleware({})))
    expect(store).toBeInstanceOf(Object)
  })

  it('Generic API Endpoint should be added and method should be called', done => {
    const customApi = { call: () => done() }
    const m = promiseMiddleware(customApi)
    const store = createStore((a = {}) => a, {}, applyMiddleware(m))
    store.dispatch({
      type: 'EXAMPLE_ACTION',
      payload: async api => {
        api.call()
      },
    } as PromiseMiddlewareAction<typeof customApi, any>)
  })

  it('Success action should be dispatched', done => {
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

  it('Error action should be dispatched', done => {
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
