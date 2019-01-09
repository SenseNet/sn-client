import { Repository } from '@sensenet/client-core'
import { combineReducers, Middleware, Reducer, StoreEnhancer } from 'redux'
import { createSensenetStore } from '../src/Store'

describe('Store', () => {
  const repository = new Repository({}, async () => ({ ok: true } as any))
  const middlewareArray: Middleware[] = []
  const enhancers: StoreEnhancer[] = []

  const testReducer: Reducer<{ testValue: number }> = (state = { testValue: 1 }) => {
    return state
  }

  const rootReducer = combineReducers<{ testReducer: { testValue: number } }>({
    testReducer,
  })

  it('should return a redux store', () => {
    expect(createSensenetStore({ repository, rootReducer })).toBeInstanceOf(Object)
  })
  it('should return a redux store', () => {
    expect(
      createSensenetStore({
        repository,
        rootReducer,
        middlewares: undefined,
        persistedState: { testReducer: { testValue: 3 } },
      }),
    ).toBeInstanceOf(Object)
  })
  it('should return a redux store', () => {
    expect(createSensenetStore({ repository, rootReducer, middlewares: undefined })).toBeInstanceOf(Object)
  })
  it('should return a redux store', () => {
    expect(createSensenetStore({ repository, rootReducer, middlewares: middlewareArray })).toBeInstanceOf(Object)
  })

  it('should return a redux store', () => {
    expect(createSensenetStore({ repository, rootReducer, middlewares: middlewareArray, logger: true })).toBeInstanceOf(
      Object,
    )
  })

  it('should return a redux store', () => {
    expect(
      createSensenetStore({ repository, rootReducer, middlewares: middlewareArray, devTools: true }),
    ).toBeInstanceOf(Object)
  })

  it('should return a redux store', () => {
    expect(createSensenetStore({ repository, rootReducer, middlewares: middlewareArray, enhancers })).toBeInstanceOf(
      Object,
    )
  })

  it('should return a redux store', () => {
    expect(createSensenetStore({ repository, rootReducer, middlewares: middlewareArray })).toBeInstanceOf(Object)
  })

  it('should return a redux store', () => {
    expect(
      createSensenetStore({ repository, rootReducer, middlewares: middlewareArray, devTools: true }),
    ).toBeInstanceOf(Object)
  })

  it('default state should be applied', () => {
    const tempStore = createSensenetStore({ repository, rootReducer, middlewares: middlewareArray })
    const state = tempStore.getState()
    expect(state.testReducer.testValue).toBe(1)
  })

  it('persisted state should be applied', () => {
    const tempStore = createSensenetStore({
      repository,
      rootReducer,
      middlewares: middlewareArray,
      persistedState: { testReducer: { testValue: 3 } },
    })
    const state = tempStore.getState()
    expect(state.testReducer.testValue).toBe(3)
  })
})
