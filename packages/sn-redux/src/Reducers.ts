import { normalize } from 'normalizr';
import { combineReducers } from 'redux';
import { Authentication } from 'sn-client-js';

/**
 * Module for defining Redux reducers.
 *
 * _Actions describe the fact that something happened, but don't specify how the application's state changes in response. This is the job of a reducer._
 *
 * Following module contains the reducers of sn-redux, some 'reducer groups' and the root reducer which could be passed to the store creator function. Using a root reduces means
 * that you define which combination of reducers will be used and eventually defines which type of actions can be called on the store.
 */
export module Reducers {
    /**
       * Reducer to handle Actions on the country property in the session object.
       * @param {Object} [state=''] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const country = (state = '', action) => {
        return state
    }
    /**
       * Reducer to handle Actions on the language property in the session object.
       * @param {Object} [state='en-US'] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const language = (state = 'en-US', action) => {
        switch (action.type) {
            case 'USER_CHANGED':
                if (typeof action.user.Language !== 'undefined'
                    && action.user.Language.length > 0)
                    return action.user.Language[0]
                else
                    return state
            default:
                return state
        }
    }
    /**
       * Reducer to handle Actions on the loginState property in the session object.
       * @param {Object} [state=Authentication.LoginState.Pending] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const loginState = (state = Authentication.LoginState.Pending, action) => {
        switch (action.type) {
            case 'USER_LOGIN_SUCCESS':
                return Authentication.LoginState.Authenticated
            case 'USER_LOGOUT_SUCCESS':
                return Authentication.LoginState.Unauthenticated
            case 'USER_LOGIN_FAILURE':
                return Authentication.LoginState.Unauthenticated
            case 'USER_LOGOUT_FAILURE':
                return Authentication.LoginState.Unauthenticated
            default:
                return state
        }
    }
    /**
       * Reducer to handle Actions on the loginError property in the session object.
       * @param {Object} [state=''] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const loginError = (state = '', action) => {
        switch (action.type) {
            case 'USER_LOGIN_FAILURE':
                return action.message
            case 'USER_LOGOUT_FAILURE':
                return action.message
            default:
                return null
        }
    }
    /**
       * Reducer to handle Actions on the userName property in the user object.
       * @param {Object} [state='Visitor'] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const userName = (state = 'Visitor', action) => {
        switch (action.type) {
            case 'USER_CHANGED':
                return action.user.Name
            default:
                return state

        }
    }
    /**
       * Reducer to handle Actions on the fullName property in the user object.
       * @param {Object} [state='Visitor'] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const fullName = (state = 'Visitor', action) => {
        switch (action.type) {
            case 'USER_CHANGED':
                return action.user.DisplayName
            default:
                return state
        }
    }
    /**
       * Reducer to handle Actions on the userLanguage property in the user object.
       * @param {Object} [state='en-US'] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const userLanguage = (state = 'en-US', action) => {
        switch (action.type) {
            case 'USER_CHANGED':
                if (typeof action.user.Language !== 'undefined'
                    && action.user.Language.length > 0)
                    return action.user.Language[0]
                else
                    return state
            default:
                return state
        }
    }
    /**
       * Reducer to handle Actions on the userAvatarPath property in the user object.
       * @param {Object} [state=''] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const userAvatarPath = (state = '', action) => {
        switch (action.type) {
            case 'USER_CHANGED':
                return action.user.ImageData ? action.user.ImageData.__mediaresource.media_src : ''
            default:
                return state
        }
    }

    /**
   * Reducer combining userName, fullName and userLanguage into a single object, ```user```.
   */
    const user = combineReducers({
        userName,
        fullName,
        userLanguage,
        userAvatarPath
    })
    /**
       * Reducer to handle Actions on the repostory property in the user object.
       * @param {Object} [state=null] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const repository = (state = null, action) => {
        switch (action.type) {
            case 'LOAD_REPOSITORY':
                return action.repository
            default:
                return state
        }
    }
    /**
   * Reducer combining country, language, loginState, error and user into a single object, ```session```.
   */
    const session = combineReducers({
        country,
        language,
        loginState,
        error: loginError,
        user,
        repository
    })
    /**
       * Reducer to handle Actions on the ids array in the children object.
       * @param {Object} [state=[]] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const ids = (state = [], action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_SUCCESS':
                return action.response.result;
            case 'CREATE_CONTENT_SUCCESS':
                return [...state, action.response.result];
            case 'DELETE_CONTENT_SUCCESS':
                return [...state.slice(0, action.index), ...state.slice(action.index + 1)]
            default:
                return state;
        }
    }
    /**
       * Reducer to handle Actions on the entities object in the children object.
       * @param {Object} [state={}] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const entities = (state = {}, action) => {
        if (action.response && (action.type !== 'USER_LOGIN_SUCCESS' && action.type !== 'LOAD_CONTENT_SUCCESS')) {
            return (<any>Object).assign({}, state, action.response.entities.entities);
        }
        switch (action.type) {
            case 'DELETE_CONTENT_SUCCESS':
                let res = Object.assign({}, state);
                delete res[action.id];
                return res;
            default:
                return state;
        }
    }
    /**
       * Reducer to handle Actions on the isFetching property in the children object.
       * @param {Object} [state=false] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const isFetching = (state = false, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_REQUEST':
                return true;
            case 'FETCH_CONTENT_SUCCESS':
            case 'FETCH_CONTENT_FAILURE':
                return false;
            default:
                return state;
        }
    }
    /**
       * Reducer to handle Actions on the childrenerror property in the children object.
       * @param {Object} [state=null] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const childrenerror = (state = null, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_FAILURE':
                return action.message;
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
    }
    /**
       * Reducer to handle Actions on the chidlrenactions object in the children object.
       * @param {Object} [state={}] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const childrenactions = (state = {}, action) => {
        return state
    }
    /**
       * Reducer to handle Actions on the top property in the children object.
       * @param {Object} [state={}] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const top = (state = {}, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_REQUEST':
                if (action.options.top)
                    return action.options.top
                else
                    return state
            default:
                return state
        }
    }
    /**
       * Reducer to handle Actions on the skip property in the children object.
       * @param {Object} [state={}] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const skip = (state = {}, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_REQUEST':
                if (action.options.skip)
                    return action.options.skip
                else
                    return state
            default:
                return state
        }
    }
    /**
       * Reducer to handle Actions on the query property in the children object.
       * @param {Object} [state={}] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const query = (state = {}, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_REQUEST':
                if (action.options.query)
                    return action.options.query
                else
                    return state
            default:
                return state
        }
    }
    /**
       * Reducer to handle Actions on the order property in the children object.
       * @param {Object} [state={}] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const order = (state = {}, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_REQUEST':
                if (action.options.order)
                    return action.options.order
                else
                    return state
            default:
                return state
        }
    }
    /**
       * Reducer to handle Actions on the filter property in the children object.
       * @param {Object} [state={}] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const filter = (state = {}, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_REQUEST':
                if (action.options.filter)
                    return action.options.filter
                else
                    return state
            default:
                return state
        }
    }
    /**
       * Reducer to handle Actions on the select property in the children object.
       * @param {Object} [state={}] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const select = (state = {}, action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_REQUEST':
                if (action.options.select)
                    return action.options.select
                else
                    return state
            default:
                return state
        }
    }
    /**
   * Reducer combining ids, entities, isFetching, error, top, skip, query, order, filter and select into a single object, ```children```.
   */
    const children = combineReducers({
        ids,
        entities,
        isFetching,
        error: childrenerror,
        // actions: childrenactions,
        top,
        skip,
        query,
        order,
        filter,
        select
    })
    /**
       * Reducer to handle Actions on the isSaved property in the contentState object.
       * @param {Object} [state=true] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const isSaved = (state = true, action) => {
        switch (action.type) {
            case 'CREATE_CONTENT_REQUEST':
            case 'CREATE_CONTENT_FAILURE':
            case 'UPDATE_CONTENT_REQUEST':
            case 'UPDATE_CONTENT_FAILURE':
            case 'LOAD_CONTENT_REQUEST':
            case 'LOAD_CONTENT_FAILURE':
                return false;
            default:
                return true;
        }
    }
    /**
       * Reducer to handle Actions on the isValid property in the contentState object.
       * @param {Object} [state=true] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const isValid = (state = true, action) => {
        return state
    }
    /**
       * Reducer to handle Actions on the isDirty property in the contentState object.
       * @param {Object} [state=false] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const isDirty = (state = false, action) => {
        return state
    }
    /**
       * Reducer to handle Actions on the isOperationInProgress property in the contentState object.
       * @param {Object} [state=false] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const isOperationInProgress = (state = false, action) => {
        switch (action.type) {
            case 'CREATE_CONTENT_REQUEST':
            case 'UPDATE_CONTENT_REQUEST':
            case 'DELETE_CONTENT_REQUEST':
                return true
            default:
                return false
        }

    }
    /**
   * Reducer combining isSaved, isValid, isDirty and isOperationInProgress into a single object, ```contentState```.
   */
    const contentState = combineReducers({
        isSaved,
        isValid,
        isDirty,
        isOperationInProgress
    })
    /**
       * Reducer to handle Actions on the contenterror property in the currentcontent object.
       * @param {Object} [state=null] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const contenterror = (state: any = null, action) => {
        switch (action.type) {
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
            case 'FETCH_CONTENT_FAILURE':
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
    }
    /**
       * Reducer to handle Actions on the contentactions object in the currentcontent object.
       * @param {Object} [state={}] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const contentactions = (state = {}, action) => {
        switch (action.type) {
            case 'LOAD_CONTENT_ACTIONS_SUCCESS':
                return action.actions
            default:
                return state
        }
    }
    /**
       * Reducer to handle Actions on the fields object in the currentcontent object.
       * @param {Object} [state={}] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const fields = (state = {}, action) => {
        switch (action.type) {
            case 'LOAD_CONTENT_SUCCESS':
            case 'RELOAD_CONTENT_SUCCESS':
                return action.response.GetFields()
            default:
                return state
        }
    }
    /**
       * Reducer to handle Actions on the content object in the currentcontent object.
       * @param {Object} [state={}] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const content = (state = {}, action) => {
        switch (action.type) {
            case 'LOAD_CONTENT_SUCCESS':
            case 'RELOAD_CONTENT_SUCCESS':
                return action.response
            default:
                return state
        }
    }
    /**
   * Reducer combining contentState, error, actions, fields and content into a single object, ```currentcontent```.
   */
    const currentcontent = combineReducers({
        contentState,
        error: contenterror,
        actions: contentactions,
        fields,
        content
    })
    /**
       * Reducer to handle Actions on the selected array.
       * @param {Object} [state=[]] Represents the current state.
       * @param {Object} action Represents an action that is called.
       * @returns {Object} state. Returns the next state based on the action.
       */
    export const selected = (state = [], action) => {
        return state;
    }
    /**
   * Reducer combining session, children, currentcontent and selected into a single object, ```sensenet``` which will be the top-level one.
   */
    export const sensenet = combineReducers({
        session,
        children,
        currentcontent,
        selected
    })

    /**
   * Method to get a Content item from a state object by its Id.
   * @param {Object} state Current state object.
   * @param {number} Id Id of the Content.
   * @returns {Object} content. Returns the Content from a state object with the given Id.
   */
    export const getContent = (state: Object, Id: number) => state[Id];
    /**
     * Method to get the ```ids``` array from a state object.
     * @param {Object} state Current state object.
     * @returns {number[]} content. Returns the ```ids``` array from the given state.
     */
    export const getIds = (state: any) => state.ids;
    /**
     * Method to get if the fetching of data is in progress.
     * @param {Object} state Current state object.
     * @returns {boolean} Returns true or false whether data fetching is in progress or not.
     */
    export const getFetching = (state: any) => state.isFetching;
    /**
     * Method to get the error message.
     * @param {Object} state Current state object.
     * @returns {string} Returns the error message.
     */
    export const getError = (state: any) => {
        return state.errorMessage
    };

    export const getAuthenticationStatus = (state) => {
        return state.session.loginState as Authentication.LoginState;
    }

    export const getAuthenticationError = (state) => {
        return state.session.error;
    }

    export const getRepositoryUrl = (state) => {
        return state.session.repository.RepositoryUrl;
    }
}