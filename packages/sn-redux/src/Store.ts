/**
 * Module for configuring a store.
 * @module  Store
 * @description Module to create and configure a sensenet redux store.
 *
 * It is actually a redux based data store, that lets you keep your application data in on place, allows you to access (get and update) the application state or subscribe to its listeners.
 *
 * Two middlewares are built-in:
 * * [sn-redux-promise-middleware](https://github.com/SenseNet/sn-redux-promise-middleware) is a redux-promise-middleware based middleware for Redux. It's needed to handle async actions to create side effects and more,
 * so that your app will be able to get or post data to sensenet Content Repository through OData with ajax requests.
 * * [redux-logger](https://github.com/evgenyrodionov/redux-logger) creates a detailed log on the dev toolbar console on all state changes.
 * You can add other middlewares too through the configureStore functions second param as an array of middlewares. But the built-in middlewares will be the part of the applied middleware group
 * in every way.
 *
 * ```
 * import * as React from "react";
 * import * as ReactDOM from "react-dom";
 * import Authentication from 'redux-authentication' //for including custom middleware
 * import { myRootReducer } from '../myApp/Reducers'
 *
 * const store = Store.createSensenetSto(myRootReducer, myRootEpic, [Authentication]);
 *
 * ReactDOM.render(
 * <Root store={store} />,
 * document.getElementById("root")
 * );
 * ```
 */
/**
 */
import { Repository } from '@sensenet/client-core'
import { promiseMiddleware } from '@sensenet/redux-promise-middleware'
import { AnyAction, applyMiddleware, compose, createStore, Middleware, Reducer, Store, StoreEnhancer } from 'redux'
import { createLogger } from 'redux-logger'
import * as Actions from './Actions'

/**
 * Method to create a Redux store that holds the application state.
 * @param {any} [rootReducer=Reducers.sensenet] Root reducer of your application.
 * @param {Repository.BaseRepository<any,any>} The sensenet Repository
 * @param {any} [rootEpic=Epics.rootEpic] Root epic of your application.
 * @param {Array<any>=} middlewares Array of middlewares.
 * @param {Object=} persistedState Persisted state.
 * @returns {Store} Returns a Redux store, an object that holds the application state.
 * ```
 * import * as React from "react";
 * import * as ReactDOM from "react-dom";
 * import Authentication from 'redux-authentication'
 * import { myRootReducer } from '../myApp/Reducers'
 * import { myRootEpic } from '../myApp/Epics'
 *
 * const repository = new Repository.SnRepository({
 *  RepositoryUrl: 'https://sn-services/'
 * });
 *
 * const options = {
 * repository,
 * rootReducer: myRootReducer,
 * middlewares: [Authentication]
 * } as Store.CreateStoreOptions
 *
 * const store = Store.createSensenetStore(options);
 *
 * ReactDOM.render(
 * <Root store={store} />,
 * document.getElementById("root")
 * );
 * ```
 */
/**
 * Defines config options for a sensenet Redux store.
 */
export interface CreateStoreOptions<T> {
    /**
     * The root reducer of the store
     */
    rootReducer: Reducer<T>,
    /**
     * Related repository object
     */
    repository: Repository,
    /**
     * Array of additional middlewares
     */
    middlewares?: Middleware[],
    /**
     * Initial state of the store
     */
    persistedState?: T,
    /**
     * Array of additional enhancers
     */
    enhancers?: Array<StoreEnhancer<any>>,
    /**
     * Switches redux logger on or off
     */
    logger?: boolean,
    /**
     * Switches redux developer tools on or off
     */
    devTools?: boolean,
}
/**
 * Method that configures a sensenet Redux store
 * @param options {CreateStoreOptions} An object to hold config options of the Store.
 * @returns store {Store} Returns a preconfigured Redux store.
 */
export const createSensenetStore: <T>(options: CreateStoreOptions<T>) => Store<T> = <T>(options: CreateStoreOptions<T>) => {
    let middlewareArray = []
    let enhancerArray: Array<StoreEnhancer<any>> = []
    if (typeof options.middlewares === 'undefined' || options.middlewares === null) {
        // middlewareArray.push(epicMiddleware)
    } else {
        middlewareArray = [...options.middlewares]
    }
    const loggerMiddleware = options.logger ? createLogger() : null
    const reduxPromiseMiddleware = promiseMiddleware(options.repository)
    loggerMiddleware ? middlewareArray.push(loggerMiddleware, reduxPromiseMiddleware) :
        middlewareArray.push(reduxPromiseMiddleware)

    if (typeof options.enhancers === 'undefined' || options.enhancers === null) {
        // middlewareArray.push(epicMiddleware)
    } else {
        enhancerArray = [...options.enhancers]
    }

    // tslint:disable-next-line:no-string-literal
    const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] && options.devTools ? window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] : compose

    const store = createStore<T, AnyAction, Partial<T>, Partial<T>>(
        options.rootReducer,
        options.persistedState || {},
        composeEnhancers(
            applyMiddleware(...middlewareArray),
            ...enhancerArray,
        ),
    )

    const repo: Repository = options.repository
    store.dispatch(Actions.loadRepository(repo.configuration))

    repo.authentication.state.subscribe((state) => {
        store.dispatch(Actions.loginStateChanged(state))
    })

    repo.authentication.currentUser.subscribe((user) => {
        store.dispatch(Actions.userChanged(user))
    }, true)
    return store
}
