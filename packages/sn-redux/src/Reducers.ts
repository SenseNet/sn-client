/**
 * @module  Reducers
 * @description Module that contains the reducers.
 */
/**
 */

import { ConstantContent, IContent, IODataCollectionResponse, IODataParams, LoginState } from '@sensenet/client-core'
import { IODataBatchResponse } from '@sensenet/client-core/dist/Models/IODataBatchResponse'
import { RepositoryConfiguration } from '@sensenet/client-core/dist/Repository/RepositoryConfiguration'
import { GenericContent, IActionModel, Schema } from '@sensenet/default-content-types'
import { combineReducers, Reducer } from 'redux'

/**
 * Reducer to handle Actions on the country property in the session object.
 * @param {object} [state=''] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const country: Reducer<string> = (state = '', action) => {
    return state
}
/**
 * Reducer to handle Actions on the language property in the session object.
 * @param {string} [state='en-US'] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const language: Reducer<string> = (state = 'en-US', action) => {
    switch (action.type) {
        case 'USER_CHANGED':
            if (typeof action.user.Language !== 'undefined'
                && action.user.Language.length > 0) {
                return action.user.Language[0]
            } else {
                return state
            }
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the loginState property in the session object.
 * @param {LoginState} [state=LoginState.Pending] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const loginState: Reducer<LoginState> = (state = LoginState.Pending, action) => {
    switch (action.type) {
        case 'USER_LOGIN_STATE_CHANGED':
            return action.loginState
    }
    return state
}
/**
 * Reducer to handle Actions on the loginError property in the session object.
 * @param {string} [state=''] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const loginError: Reducer<string> = (state = '', action) => {
    switch (action.type) {
        case 'USER_LOGIN_SUCCESS':
            return !action.payload ?
                'Wrong username or password!' :
                null
        case 'USER_LOGIN_FAILURE':
            return action.payload.message
        case 'USER_LOGOUT_FAILURE':
            return action.payload.message
        default:
            return null
    }
}
/**
 * Reducer to handle Actions on the userName property in the user object.
 * @param {User} [state=ConstantContent.VISITOR_USER] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const userName: Reducer<string> = (state = ConstantContent.VISITOR_USER.Name, action) => {
    switch (action.type) {
        case 'USER_CHANGED':
            return action.user.Name
        default:
            return state

    }
}
/**
 * Reducer to handle Actions on the fullName property in the user object.
 * @param {User} [state=ConstantContent.VISITOR_USER] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const fullName: Reducer<string> = (state = ConstantContent.VISITOR_USER.DisplayName, action) => {
    switch (action.type) {
        case 'USER_CHANGED':
            return action.user.DisplayName
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the userLanguage property in the user object.
 * @param {string} [state='en-US'] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const userLanguage: Reducer<string> = (state = 'en-US', action) => {
    switch (action.type) {
        case 'USER_CHANGED':
            if (typeof action.user.Language !== 'undefined'
                && action.user.Language.length > 0) {
                return action.user.Language[0]
            } else {
                return state
            }
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the userAvatarPath property in the user object.
 * @param {string} [state=''] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const userAvatarPath: Reducer<string> = (state = '', action) => {
    switch (action.type) {
        case 'USER_CHANGED':
            return action.user.Avatar ? action.user.Avatar._deferred : ''
        default:
            return state
    }
}
/**
 * Reducer combining userName, fullName, userLanguage, userAvatarPath into a single object, ```user```.
 */
const user = combineReducers({
    userName,
    fullName,
    userLanguage,
    userAvatarPath,
})
/**
 * Reducer to handle Actions on the repostory property in the user object.
 * @param {object} [state=null] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const repository: Reducer<RepositoryConfiguration> = (state = null, action: any) => {
    switch (action.type) {
        case 'LOAD_REPOSITORY':
            return action.repository
        default:
            return state
    }
}
/**
 * Reducer combining country, language, loginState, error, user and repository into a single object, ```session```.
 */
const session = combineReducers({
    country,
    language,
    loginState,
    error: loginError,
    user,
    repository,
})
/**
 * Reducer to handle Actions on the ids array in the currentitems object.
 * @param {number[]} [state=[]] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const ids: Reducer<number[]> = (state = [], action) => {
    switch (action.type) {
        case 'FETCH_CONTENT_SUCCESS':
            return action.payload.result
        case 'CREATE_CONTENT_SUCCESS':
            return [...state, action.payload.Id]
        case 'UPLOAD_CONTENT_SUCCESS':
            if (state.indexOf(action.payload.Id) === -1) {
                return [...state, action.payload.Id]
            } else {
                return state
            }
        case 'DELETE_CONTENT_SUCCESS':
            return [...state.slice(0, action.index), ...state.slice(action.index + 1)]
        case 'DELETE_BATCH_SUCCESS':
        case 'MOVE_BATCH_SUCCESS':
            if (action.payload.d.results.length > 0) {
                const newIds = []
                const deletedIds = action.payload.d.results.map((result) => result.Id)
                for (const id of state) {
                    if (deletedIds.indexOf(id) === -1) {
                        newIds.push(id)
                    }
                }
                return newIds
            }
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the entities object in the currentitems object.
 * @param {object} [state={}] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const entities: Reducer<IODataCollectionResponse<GenericContent> | undefined> = (state = undefined, action) => {
    if (action.payload && (
        action.type !== 'USER_LOGIN_FAILURE' &&
        action.type !== 'USER_LOGIN_BUFFER' &&
        action.type !== 'LOAD_CONTENT_SUCCESS' &&
        action.type !== 'REQUEST_CONTENT_ACTIONS_SUCCESS' &&
        action.type !== 'UPDATE_CONTENT_SUCCESS' &&
        action.type !== 'UPLOAD_CONTENT_SUCCESS' &&
        action.type !== 'DELETE_BATCH_SUCCESS' &&
        action.type !== 'COPY_CONTENT_SUCCESS' &&
        action.type !== 'COPY_BATCH_SUCCESS' &&
        action.type !== 'MOVE_CONTENT_SUCCESS' &&
        action.type !== 'MOVE_BATCH_SUCCESS')) {
        if (action.payload.entities !== undefined && action.payload.entities.entities !== undefined) {
            return (Object as any).assign({}, state, action.payload.entities.entities)
        }
    }
    switch (action.type) {
        case 'DELETE_CONTENT_SUCCESS':
        case 'DELETE_BATCH_SUCCESS':
        case 'MOVE_BATCH_SUCCESS':
            const deletedIds = action.payload.d.results.map((item) => {
                return item.Id
            })
            return {
                ...state,
                d: {
                    ...state.d,
                    ...{
                        __count: state.d.__count - action.payload.d.results.length,
                        results: state.d.results.filter((item) => deletedIds.indexOf(item.Id) === -1),
                    },
                },
            }
        case 'UPDATE_CONTENT_SUCCESS':
            return {
                ...state,
                d: {
                    ...state.d,
                    ...{
                        results: state.d.results.map((c) => {
                            if (c.Id === action.payload.Id) {
                                return action.payload
                            }
                            return c
                        }),
                    },
                },
            }
        case 'CREATE_CONTENT_SUCCESS':
        case 'UPLOAD_CONTENT_SUCCESS':
            return {
                ...state,
                d: {
                    ...state.d,
                    ...{
                        __count: state.d.results.find((item) => item.Id === action.payload.Id) !== undefined ? state.d.__count : state.d.__count + 1,
                        results: state.d.results.find((item) => item.Id === action.payload.Id) !== undefined ? state.d.results.map((c) => {
                            if (c.Id === action.payload.Id) {
                                return action.payload
                            }
                            return c
                        }) : [action.payload, ...state.d.results],
                    },
                },
            }
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the isFetching property in the currentitems object.
 * @param {boolean} [state=false] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const isFetching: Reducer<boolean> = (state = false, action) => {
    switch (action.type) {
        case 'FETCH_CONTENT_LOADING':
            return true
        case 'FETCH_CONTENT':
        case 'FETCH_CONTENT_SUCCESS':
        case 'FETCH_CONTENT_FAILURE':
            return false
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the childrenerror property in the currentitems object.
 * @param {object} [state=null] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const childrenerror: Reducer<object> = (state = null, action) => {
    switch (action.type) {
        case 'FETCH_CONTENT_FAILURE':
            return action.payload.message
        case 'FETCH_CONTENT_SUCCESS':
        case 'CREATE_CONTENT_SUCCESS':
        case 'UPDATE_CONTENT_SUCCESS':
        case 'DELETE_CONTENT_SUCCESS':
        case 'CHECKIN_CONTENT_SUCCESS':
        case 'CHECKOUT_CONTENT_SUCCESS':
        case 'APPROVE_CONTENT_SUCCESS':
        case 'PUBLISH_CONTENT_SUCCESS':
        case 'REJECT_CONTENT_SUCCESS':
        case 'UNDOCHECKOUT_CONTENT_SUCCESS':
        case 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS':
        case 'RESTOREVERSION_CONTENT_SUCCESS':
            return null
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the chidlrenactions object in the currentitems object.
 * @param {any[]} [state=[]] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const childrenactions: Reducer<IActionModel[]> = (state = [], action) => {
    switch (action.type) {
        case 'REQUEST_CONTENT_ACTIONS_SUCCESS':
            return action.payload
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the isOpened property in the currentitems object.
 * @param {object} [state={}] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const isOpened: Reducer<boolean> = (state = null, action) => {
    switch (action.type) {
        case 'REQUEST_CONTENT_ACTIONS_SUCCESS':
            return action.id
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the odata options property in the currentitems object.
 * @param {object} [state={}] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const options: Reducer<IODataParams<GenericContent>> = (state = {}, action) => {
    switch (action.type) {
        case 'SET_ODATAOPTIONS':
            return action.options
        default:
            return state
    }
}
/**
 * Reducer combining ids, entities, isFetching, actions, error, top, skip, query, order, filter, select and isOpened into a single object, ```currentitems```.
 */
const currentitems = combineReducers({
    ids,
    entities,
    isFetching,
    actions: childrenactions,
    error: childrenerror,
    isOpened,
    options,
})
/**
 * Reducer to handle Actions on the isSaved property in the contentState object.
 * @param {boolean} [state=true] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const isSaved: Reducer<boolean> = (state = true, action) => {
    switch (action.type) {
        case 'CREATE_CONTENT':
        case 'CREATE_CONTENT_FAILURE':
        case 'UPDATE_CONTENT':
        case 'UPDATE_CONTENT_FAILURE':
        case 'LOAD_CONTENT':
        case 'LOAD_CONTENT_FAILURE':
            return false
        default:
            return true
    }
}
/**
 * Reducer to handle Actions on the isValid property in the contentState object.
 * @param {boolean} [state=true] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const isValid: Reducer<boolean> = (state = true, action) => {
    return state
}
/**
 * Reducer to handle Actions on the isDirty property in the contentState object.
 * @param {boolean} [state=false] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const isDirty: Reducer<boolean> = (state = false, action) => {
    return state
}
/**
 * Reducer to handle Actions on the isOperationInProgress property in the contentState object.
 * @param {boolean} [state=false] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const isOperationInProgress: Reducer<boolean> = (state = false, action) => {
    switch (action.type) {
        case 'CREATE_CONTENT_LOADING':
        case 'UPDATE_CONTENT_LOADING':
        case 'DELETE_CONTENT_LOADING':
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
    isOperationInProgress,
})
/**
 * Reducer to handle Actions on the contenterror property in the currentcontent object.
 * @param {object} [state=null] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const contenterror: Reducer<object> = (state = null, action) => {
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
            return action.payload.message
        case 'FETCH_CONTENT':
        case 'FETCH_CONTENT_FAILURE':
        case 'CREATE_CONTENT':
        case 'CREATE_CONTENT_SUCCESS':
        case 'UPDATE_CONTENT':
        case 'UPDATE_CONTENT_SUCCESS':
        case 'DELETE_CONTENT':
        case 'DELETE_CONTENT_SUCCESS':
        case 'CHECKIN_CONTENT':
        case 'CHECKIN_CONTENT_SUCCESS':
        case 'CHECKOUT_CONTENT':
        case 'CHECKOUT_CONTENT_SUCCESS':
        case 'APPROVE_CONTENT':
        case 'APPROVE_CONTENT_SUCCESS':
        case 'PUBLISH_CONTENT':
        case 'PUBLISH_CONTENT_SUCCESS':
        case 'REJECT_CONTENT':
        case 'REJECT_CONTENT_SUCCESS':
        case 'UNDOCHECKOUT_CONTENT':
        case 'UNDOCHECKOUT_CONTENT_SUCCESS':
        case 'FORCEUNDOCHECKOUT_CONTENT':
        case 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS':
        case 'RESTOREVERSION_CONTENT':
        case 'RESTOREVERSION_CONTENT_SUCCESS':
            return null
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the contentactions object in the currentcontent object.
 * @param {object} [state={}] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const contentactions: Reducer<IActionModel[]> = (state = [], action) => {
    switch (action.type) {
        case 'LOAD_CONTENT_ACTIONS_SUCCESS':
            return action.payload.d.Actions
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the fields object in the currentcontent object.
 * @param {object} [state={}] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const fields: Reducer<object> = (state = {}, action) => {
    switch (action.type) {
        case 'LOAD_CONTENT_SUCCESS':
            return {}
        case 'CHANGE_FIELD_VALUE':
            const f = state
            f[action.name] = action.value
            return f
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the content object in the currentcontent object.
 * @param {object} [state={}] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const content: Reducer<IContent | undefined> = (state = undefined, action) => {
    switch (action.type) {
        case 'LOAD_CONTENT_SUCCESS':
            return action.payload.d
        default:
            return state
    }
}
/**
 * Reducer to contain schema of the current content
 * @param {object} [state={}] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const schema: Reducer<Schema> = (state = undefined, action) => {
    switch (action.type) {
        case 'GET_SCHEMA':
            return action.payload
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
    content,
    schema,
})
/**
 * Reducer to handle Actions on the selected array.
 * @param {number[]} [state=[]] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const selectedIds: Reducer<number[]> = (state = [], action) => {
    switch (action.type) {
        case 'SELECT_CONTENT':
            return [...state, action.content.Id]
        case 'DESELECT_CONTENT':
            const index = state.indexOf(action.content.Id)
            return [...state.slice(0, index), ...state.slice(index + 1)]
        case 'CLEAR_SELECTION':
            return []
        default:
            return state
    }
}
/**
 * Reducer to handle selected content items.
 * @param {object} [state={}] Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const selectedContentItems: Reducer<object> = (state = {}, action) => {
    switch (action.type) {
        case 'DESELECT_CONTENT':
            const res = Object.assign({}, state)
            delete res[action.content.Id]
            return res
        case 'SELECT_CONTENT':
            const obj = {}
            obj[action.content.Id] = action.content
            return (Object as any).assign({}, state, obj)
        case 'CLEAR_SELECTION':
            return {}
        default:
            return state
    }
}
/**
 * Reducer combining ids and entities into a single object, ```selected```.
 */
const selected = combineReducers({
    ids: selectedIds,
    entities: selectedContentItems,
})
/**
 * Reducer to handle Actions on the OdataBatchResponse object.
 * @param {object} state Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const odataBatchResponse: Reducer<IODataBatchResponse<GenericContent> | undefined> = (state = undefined, action) => {
    switch (action.type) {
        case 'DELETE_BATCH_SUCCESS':
        case 'COPY_BATCH_SUCCESS':
        case 'MOVE_BATCH_SUCCESS':
            return action.payload
        default:
            return {}
    }
}
/**
 * Reducer to handle Actions on the batchResponseError object.
 * @param {string} state Represents the current state.
 * @param {object} action Represents an action that is called.
 * @returns {object} state. Returns the next state based on the action.
 */
export const batchResponseError: Reducer<string> = (state = '', action) => {
    switch (action.type) {
        case 'DELETE_BATCH_FAILURE':
        case 'COPY_BATCH_FAILURE':
        case 'MOVE_BATCH_FAILURE':
            return action.payload.message
        default:
            return ''
    }
}
/**
 * Reducer combining response and error into a single object, ```batchResponses```.
 */
const batchResponses = combineReducers({
    response: odataBatchResponse,
    error: batchResponseError,
})

/**
 * Reducer combining session, currentitems, currentcontent and selected into a single object, ```sensenet``` which will be the top-level one.
 */
export const sensenet = combineReducers({
    session,
    currentcontent,
    currentitems,
    selected,
    batchResponses,
})
/**
 * Method to get a Content item from a state object by its Id.
 * @param {object} state Current state object.
 * @param {number} Id Id of the Content.
 * @returns {object} content. Returns the Content from a state object with the given Id.
 */
export const getContent = (state: object, id: number) => state[id]
/**
 * Method to get the ```ids``` array from a state object.
 * @param {object} state Current state object.
 * @returns {number[]} content. Returns the ```ids``` array from the given state.
 */
export const getIds = (state: any) => state.ids
/**
 * Method to get if the fetching of data is in progress.
 * @param {object} state Current state object.
 * @returns {boolean} Returns true or false whether data fetching is in progress or not.
 */
export const getFetching = (state: any) => state.isFetching
/**
 * Method to get the error message.
 * @param {object} state Current state object.
 * @returns {string} Returns the error message.
 */
export const getError = (state: any) => {
    return state.error
}
/**
 * Method to get the authentication status.
 * @param {object} state Current state object.
 * @returns {LoginState} Returns the authentication state.
 */
export const getAuthenticationStatus = (state) => {
    return state.session.loginState as LoginState
}
/**
 * Method to get the authentication error.
 * @param {object} state Current state object.
 * @returns {string} Returns the error message.
 */
export const getAuthenticationError = (state) => {
    return state.session.error
}
/**
 * Method to get the repository url.
 * @param {object} state Current state object.
 * @returns {string} Returns the url of the repository.
 */
export const getRepositoryUrl = (state) => {
    return state.session.repository.repositoryUrl
}
/**
 * Method to get the ids of the selected content items.
 * @param {object} state Current state object.
 * @returns {number[]} Returns an array with the ids.
 */
export const getSelectedContentIds = (state) => {
    return state.selected.ids
}
/**
 * Method to get the selected content items.
 * @param {object} state Current state object.
 * @returns {object} Returns an Oject with the selected content items.
 */
export const getSelectedContentItems = (state) => {
    return state.selected.entities
}
/**
 * Method to get the id of the opened content item.
 * @param {object} state Current state object.
 * @returns {number} Returns the id of the opened content item.
 */
export const getOpenedContent = (state) => {
    return state.isOpened
}
/**
 * Method to get the list of actions of the currentitems items.
 * @param {object} state Current state object.
 * @returns {any[]} Returns the list of actions.
 */
export const getChildrenActions = (state) => {
    return state.actions
}
/**
 * Method to get the current content object.
 * @param {object} state Current state object.
 * @returns {IContent} Returns the content object.
 */
export const getCurrentContent = (state) => {
    return state.currentcontent.content
}
/**
 * Method to get the currentitems items.
 * @param {object} state Current state object.
 * @returns {object} Returns the content items as an object.
 */
export const getChildren = (state) => {
    return state.entities
}
/**
 * Method to get the list of current content's chanegd fields and their values.
 * @param {object} state Current state object.
 * @returns {object} Returns the list of the fields.
 */
export const getFields = (state) => {
    return state.currentcontent.fields
}
/**
 * Method to get the schema of current content.
 * @param {object} state Current state object.
 * @returns {object} Returns the schema object.
 */
export const getSchema = (state) => {
    return state.currentcontent.schema
}
