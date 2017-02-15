"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const redux_1 = require("redux");
var Reducers;
(function (Reducers) {
    Reducers.byId = (state = {}, action) => {
        if (action.response && action.type !== 'USER_LOGIN_SUCCESS') {
            return Object.assign({}, state, action.response.entities.collection);
        }
        switch (action.type) {
            case 'DELETE_CONTENT_SUCCESS':
                let res = Object.assign({}, state);
                delete res[action.id];
                return res;
            default:
                return state;
        }
    };
    Reducers.ids = (state = [], action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_SUCCESS':
                return action.response.result;
            case 'CREATE_CONTENT_SUCCESS':
                return [...state, action.response.result];
            case 'DELETE_CONTENT_SUCCESS':
                return [...state.slice(0, action.index), ...state.slice(action.index + 1)];
            default:
                return state;
        }
    };
    Reducers.isFetching = (state = false, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_REQUEST':
                return true;
            case 'FETCH_CONTENT_SUCCESS':
            case 'FETCH_CONTENT_FAILURE':
                return false;
            default:
                return state;
        }
    };
    Reducers.errorMessage = (state = null, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_FAILURE':
            case 'CREATE_CONTENT_FAILURE':
            case 'UPDATE_CONTENT_FAILURE':
            case 'DELETE_CONTENT_FAILURE':
            case 'CHECKIN_CONTENT_FAILURE':
            case 'CHECKOUT_CONTENT_FAILURE':
            case 'PUBLISH_CONTENT_FAILURE':
            case 'APPROVE_CONTENT_FAILURE':
            case 'REJECT_CONTENT_FAILURE':
            case 'UNDOCHECKOUT_CONTENT_FAILURE':
            case 'FORCEUNDOCHECKOUT_CONTENT_FAILURE':
            case 'RESTOREVERSION_CONTENT_FAILURE':
                return action.message;
            case 'FETCH_CONTENT_REQUEST':
            case 'FETCH_CONTENT_SUCCESS':
            case 'CREATE_CONTENT_REQUEST':
            case 'CREATE_CONTENT_SUCCESS':
            case 'UPDATE_CONTENT_REQUEST':
            case 'UPDATE_CONTENT_SUCCESS':
            case 'DELETE_CONTENT_REQUEST':
            case 'DELETE_CONTENT_SUCCESS':
            case 'CHECKIN_CONTENT_REQUEST':
            case 'CHECKIN_CONTENT_SUCCESS':
            case 'CHECKOUT_CONTENT_REQUEST':
            case 'CHECKOUT_CONTENT_SUCCESS':
            case 'APPROVE_CONTENT_REQUEST':
            case 'APPROVE_CONTENT_SUCCESS':
            case 'PUBLISH_CONTENT_REQUEST':
            case 'PUBLISH_CONTENT_SUCCESS':
            case 'REJECT_CONTENT_REQUEST':
            case 'REJECT_CONTENT_SUCCESS':
            case 'UNDOCHECKOUT_CONTENT_REQUEST':
            case 'UNDOCHECKOUT_CONTENT_SUCCESS':
            case 'FORCEUNDOCHECKOUT_CONTENT_REQUEST':
            case 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS':
            case 'RESTOREVERSION_CONTENT_REQUEST':
            case 'RESTOREVERSION_CONTENT_SUCCESS':
                return null;
            default:
                return state;
        }
    };
    const userInitialState = {
        data: null,
        isLoading: false,
        isAuthenticated: false,
        errorMessage: ''
    };
    Reducers.user = (state = userInitialState, action) => {
        switch (action.type) {
            case 'USER_LOGIN_REQUEST':
            case 'USER_LOGOUT_REQUEST':
                return __assign({}, userInitialState, { isLoading: true, isAuthenticated: false });
            case 'USER_LOGIN_SUCCESS':
                return {
                    data: {
                        userName: action.response.LoginName,
                        fullName: action.response.FullName
                    },
                    isLoading: false,
                    isAuthenticated: true
                };
            case 'USER_LOGOUT_SUCCESS':
                return userInitialState;
            case 'USER_LOGIN_FAILURE':
                return __assign({}, userInitialState, { isLoading: false, errorMessage: action.message, isAuthenticated: false });
            case 'USER_LOGOUT_FAILURE':
                return __assign({}, userInitialState, { isLoading: false, errorMessage: action.message, isAuthenticated: true });
            default:
                return state;
        }
    };
    Reducers.collection = redux_1.combineReducers({
        byId: Reducers.byId,
        ids: Reducers.ids,
        isFetching: Reducers.isFetching,
        errorMessage: Reducers.errorMessage,
        user: Reducers.user
    });
    Reducers.snApp = redux_1.combineReducers({
        collection: Reducers.collection
    });
    Reducers.getContent = (state, Id) => state[Id];
    Reducers.getIds = (state) => state.ids;
    Reducers.getFetching = (state) => state.isFetching;
    Reducers.getError = (state) => {
        return state.errorMessage;
    };
    Reducers.getAuthenticationStatus = (state) => {
        const user = state.user;
        return user.isAuthenticated;
    };
    Reducers.getAuthenticationError = (state) => {
        const user = state.user;
        return user.errorMessage;
    };
})(Reducers = exports.Reducers || (exports.Reducers = {}));

//# sourceMappingURL=Reducers.js.map
