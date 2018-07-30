import { Repository } from '@sensenet/client-core'
import * as Chai from 'chai'
import { combineReducers, Middleware, Reducer, StoreEnhancer } from 'redux'
import { createSensenetStore } from '../src/Store'
const expect = Chai.expect

declare var global: any

global.window = {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: () => {
        // aaa
    },
}

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
        expect(createSensenetStore({ repository, rootReducer })).to.be.instanceof(Object)
    })
    it('should return a redux store', () => {
        expect(createSensenetStore({ repository, rootReducer, middlewares: undefined, persistedState: { testReducer: { testValue: 3 } } })).to.be.instanceof(Object)
    })
    it('should return a redux store', () => {
        expect(createSensenetStore({ repository, rootReducer, middlewares: undefined })).to.be.instanceof(Object)
    })
    it('should return a redux store', () => {
        expect(createSensenetStore({ repository, rootReducer, middlewares: middlewareArray })).to.be.instanceof(Object)
    })

    it('should return a redux store', () => {
        expect(createSensenetStore({ repository, rootReducer, middlewares: middlewareArray, logger: true })).to.be.instanceof(Object)
    })

    it('should return a redux store', () => {
        expect(createSensenetStore({ repository, rootReducer, middlewares: middlewareArray, devTools: true })).to.be.instanceof(Object)
    })

    it('should return a redux store', () => {
        expect(createSensenetStore({ repository, rootReducer, middlewares: middlewareArray, enhancers })).to.be.instanceof(Object)
    })

    it('should return a redux store', () => {
        global.window = {}
        expect(createSensenetStore({ repository, rootReducer, middlewares: middlewareArray })).to.be.instanceof(Object)
    })

    it('should return a redux store', () => {
        global.window = {}
        expect(createSensenetStore({ repository, rootReducer, middlewares: middlewareArray, devTools: true })).to.be.instanceof(Object)
    })

    it('default state should be applied', () => {
        const tempStore = createSensenetStore({ repository, rootReducer, middlewares: middlewareArray })
        const state = tempStore.getState()
        expect(state.testReducer.testValue).to.be.eq(1)
    })

    it('persisted state should be applied', () => {
        const tempStore = createSensenetStore({ repository, rootReducer, middlewares: middlewareArray, persistedState: { testReducer: { testValue: 3 } } })
        const state = tempStore.getState()
        expect(state.testReducer.testValue).to.be.eq(3)
    })
})
