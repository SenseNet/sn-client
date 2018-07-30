import { combineReducers, Reducer } from 'redux'

/**
 * Reducer to handle Actions on the isSaved property in the contentState object.
 * @param state Represents the current state.
 * @param  action Represents an action that is called.
 * @returns  state. Returns the next state based on the action.
 */
export const isSaved: Reducer<boolean | null> = (state = true, action) => {
    switch (action.type) {
        case 'CREATE_CONTENT':
        case 'CREATE_CONTENT_FAILURE':
        case 'UPDATE_CONTENT':
        case 'UPDATE_CONTENT_FAILURE':
        case 'LOAD_CONTENT':
        case 'LOAD_CONTENT_FAILURE':
            return false
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the isValid property in the contentState object.
 * @param state Represents the current state.
 * @param  action Represents an action that is called.
 * @returns  state. Returns the next state based on the action.
 */
export const isValid: Reducer<boolean> = (state = true) => {
    return state
}
/**
 * Reducer to handle Actions on the isDirty property in the contentState object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns  state. Returns the next state based on the action.
 */
export const isDirty: Reducer<boolean> = (state = false) => {
    return state
}
/**
 * Reducer to handle Actions on the isOperationInProgress property in the contentState object.
 * @param state Represents the current state.
 * @param  action Represents an action that is called.
 * @returns  state. Returns the next state based on the action.
 */
export const isOperationInProgress: Reducer<boolean> = (state = false, action) => {
    switch (action.type) {
        case 'CREATE_CONTENT_LOADING':
        case 'UPDATE_CONTENT_LOADING':
        case 'DELETE_CONTENT_LOADING':
            return true
        default:
            return state
    }
}
/**
 * Reducer combining isSaved, isValid, isDirty and isOperationInProgress into a single object, ```contentState```.
 */
export const contentState = combineReducers({
    isSaved,
    isValid,
    isDirty,
    isOperationInProgress,
})
