import { applyMiddleware, createStore } from 'redux'
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

  it('Generic API Endpoint should be added and method should be called', (done) => {
    const customApi = { call: () => done() }
    const m = promiseMiddleware(customApi)
    const store = createStore((a = {}) => a, {}, applyMiddleware(m))
    store.dispatch({
      type: 'EXAMPLE_ACTION',
      payload: async (api) => {
        api.call()
      },
    } as PromiseMiddlewareAction<typeof customApi, any>)
  })

  it('Generic API Endpoint should be overridable', (done) => {
    const customApi = { call: () => done() }
    const customApiOverride = { callOverride: () => done() }
    const m = promiseMiddleware(customApi)
    const store = createStore((a = {}) => a, {}, applyMiddleware(m))
    m.reset(customApiOverride)
    store.dispatch({
      type: 'EXAMPLE_ACTION',
      payload: async (api) => {
        api.callOverride()
      },
    } as PromiseMiddlewareAction<typeof customApiOverride, any>)
  })

  it('Success action should be dispatched', (done) => {
    const customApi = { call: () => 1 }
    const m = promiseMiddleware(customApi)
    const store = createStore(
      (state: { actions: any[] } = { actions: [] }, action) => {
        return { actions: [...state.actions, action] }
      },
      { actions: [] as any },
      applyMiddleware(m),
    )
    store.dispatch({
      type: 'EXAMPLE_ACTION',
      payload: async (api) => {
        return api.call()
      },
    } as PromiseMiddlewareAction<typeof customApi, any>)

    const subscription = store.subscribe(() => {
      const { actions } = store.getState()
      if (actions.find((a) => a.type === 'EXAMPLE_ACTION_SUCCESS')) {
        subscription()
        done()
      }
    })
  })

  it('Error action should be dispatched', (done) => {
    const m = promiseMiddleware(undefined)
    const store = createStore(
      (state: { actions: any[] } = { actions: [] }, action) => {
        return { actions: [...state.actions, action] }
      },
      { actions: [] as any },
      applyMiddleware(m),
    )
    store.dispatch({
      type: 'EXAMPLE_ACTION',
      payload: async () => {
        throw Error()
      },
    } as PromiseMiddlewareAction<undefined, any>)

    const subscription = store.subscribe(() => {
      const { actions } = store.getState()
      if (actions.find((a) => a.type === 'EXAMPLE_ACTION_FAILURE')) {
        subscription()
        done()
      }
    })
  })
})
