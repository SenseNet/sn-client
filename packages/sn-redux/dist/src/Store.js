"use strict";
const redux_1 = require('redux');
const createLogger = require('redux-logger');
const redux_observable_1 = require('redux-observable');
const Epics_1 = require('./Epics');
const Reducers_1 = require('./Reducers');
var Store;
(function (Store) {
    Store.configureStore = (rootReducer = Reducers_1.Reducers.snApp, rootEpic, middlewares, persistedState) => {
        let epicMiddleware;
        if (typeof rootEpic === 'undefined' || rootEpic === null) {
            epicMiddleware = redux_observable_1.createEpicMiddleware(Epics_1.Epics.rootEpic);
        }
        else {
            epicMiddleware = redux_observable_1.createEpicMiddleware(rootEpic);
        }
        let middlewareArray = [];
        if (typeof middlewares === 'undefined' || middlewares === null) {
            middlewareArray.push(epicMiddleware);
        }
        else {
            middlewareArray = [...middlewares, epicMiddleware];
        }
        const loggerMiddleware = createLogger();
        middlewareArray.push(loggerMiddleware);
        if (typeof persistedState !== 'undefined') {
            return redux_1.createStore(rootReducer, persistedState, redux_1.applyMiddleware(...middlewareArray));
        }
        else {
            return redux_1.createStore(rootReducer, redux_1.applyMiddleware(...middlewareArray));
        }
    };
})(Store = exports.Store || (exports.Store = {}));

//# sourceMappingURL=Store.js.map
