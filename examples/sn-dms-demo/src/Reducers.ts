import { combineReducers } from 'redux';
import { resources } from './assets/resources'
export module DMSReducers {
    export const email = (state = '', action) => {
        switch (action.type) {
            case 'USER_REGISTRATION_REQUEST':
                return action.email
            case 'USER_REGISTRATION_SUCCESS':
            case 'USER_REGISTRATION_FAILURE':
                return state
            default:
                return state
        }
    }
    export const registrationError = (state = null, action) => {
        switch (action.type) {
            case 'USER_REGISTRATION_FAILURE':
                return resources.USER_IS_ALREADY_REGISTERED
            default:
                return state
        }
    }
    export const isRegistering = (state = false, action) => {
        switch (action.type) {
            case 'USER_REGISTRATION_REQUEST':
                return true
            case 'USER_REGISTRATION_SUCCESS':
            case 'USER_REGISTRATION_FAILURE':
                return false
            default:
                return state
        }
    }

    export const registrationDone = (state = false, action) => {
        switch (action.type) {
            case 'USER_REGISTRATION_SUCCESS':
                return true
            case 'USER_REGISTRATION_REQUEST':
            case 'USER_REGISTRATION_FAILURE':
            case 'CLEAR_USER_REGISTRATION':
                return false
            default:
                return state
        }
    }

    export const captcha = (state = false, action) => {
        switch (action.type) {
            case 'VERIFY_CAPTCHA_SUCCESS':
                return true
            default:
                return state
        }
    }

    export const register = combineReducers({
        email,
        registrationError,
        isRegistering,
        registrationDone,
        captcha
    })

    export const actions = (state = [], action) => {
        switch (action.type) {
            case 'REQUEST_CONTENT_ACTIONS_SUCCESS':
                return action.response
            case 'OPEN_ACTIONMENU':
                return action.actions
            default:
                return state
        }
    }

    export const open = (state = false, action) => {
        switch (action.type) {
            case 'OPEN_ACTIONMENU':
                return true
            case 'CLOSE_ACTIONMENU':
                return false
            default:
                return state
        }
    }

    export const id = (state = null, action) => {
        switch (action.type) {
            case 'OPEN_ACTIONMENU':
                return action.id
            default:
                return state
        }
    }

    export const title = (state = '', action) => {
        switch (action.type) {
            case 'OPEN_ACTIONMENU':
                return action.title
            default:
                return state
        }
    }

    export const position = (state = null, action) => {
        switch (action.type) {
            case 'OPEN_ACTIONMENU':
                return action.position
            default:
                return state
        }
    }

    export const rootId = (state = null, action) => {
        switch (action.type) {
            case 'LOAD_CONTENT_SUCCESS':
                if (!state && action.response.Path.indexOf('Default_Site') === -1)
                    return action.response.Id
                else
                    return state
            default:
                return state
        }
    }

    export const currentId = (state = null, action) => {
        switch (action.type) {
            case 'SET_CURRENT_ID':
                return action.id
            default:
                return state
        }
    }

    export const editedItemId = (state = null, action) => {
        switch (action.type) {
            case 'SET_EDITED_ID':
                return action.id
            case 'UPDATE_CONTENT_SUCCESS':
                return null
            default:
                return state
        }
    }

    export const breadcrumb = (state = [], action) => {
        switch (action.type) {
            case 'LOAD_CONTENT_SUCCESS':
                if (action.response.Path.indexOf('Default_Site') === -1 && state.filter(e => e.id === action.response.Id).length === 0) {
                    const element = {
                        name: action.response.DisplayName,
                        id: action.response.Id,
                        path: action.response.Path
                    }
                    return [...state, element];
                }
                else if (state.filter(e => e.id === action.response.Id).length !== 0) {
                    const index = state.findIndex(e => e.id === action.response.Id)
                    return [...state.slice(0, index - 1)]
                }
                else
                    return state
            default:
                return state
        }
    }

    export const isLoading = (state = false, action) => {
        switch (action.type) {
            case 'LOAD_CONTENT_SUCCESS':
                return false
            case 'LOAD_CONTENT_REQUEST':
                return true
            default:
                return state
        }
    }

    export const isSelectionModeOn = (state = false, action) => {
        switch (action.type) {
            case 'SELECTION_MODE_ON':
                return true
            case 'SELECTION_MODE_OFF':
            case 'CLEAR_SELECTION':
                return false
            default:
                return state
        }
    }

    export const actionmenu = combineReducers({
        actions,
        open,
        position,
        id,
        title
    })

    export const dms = combineReducers({
        actionmenu,
        breadcrumb,
        editedItemId,
        currentId,
        rootId,
        register,
        isLoading,
        isSelectionModeOn
    })

    export const getRegistrationError = (state) => {
        return state.registrationError;
    }
    export const registrationInProgress = (state) => {
        return state.isRegistering
    }

    export const registrationIsDone = (state) => {
        return state.registrationDone
    }

    export const getRegisteredEmail = (state) => {
        return state.email
    }

    export const captchaIsVerified = (state) => {
        return state.captcha
    }
    export const getAuthenticatedUser = (state) => {
        return state.session.user
    }

    export const getChildrenItems = (state) => {
        return state.children.entities
    }

    export const getCurrentContentPath = (state) => {
        return state.Path
    }

    export const actionmenuIsOpen = (state) => {
        return state.open
    }

    export const getActionMenuPosition = (state) => {
        return state.position
    }

    export const getParentId = (state) => {
        return state.currentcontent.content.ParentId
    }
    export const getRootId = (state) => {
        return state.rootId
    }
    export const getBreadCrumbArray = (state) => {
        return state.breadcrumb
    }
    export const getCurrentId = (state) => {
        return state.currentId
    }
    export const getActionsOfAContent = (state) => {
        return state.Actions
    }
    export const getActions = (state) => {
        return state.actions
    }
    export const getEditedItemId = (state) => {
        return state.editedItemId
    }
    export const getItemOnActionMenuIsOpen = (state) => {
        return state.id
    }
    export const getLoading = (state) => {
        return state.isLoading
    }
    export const getItemTitleOnActionMenuIsOpen = (state) => {
        return state.title
    }
    export const getIsSelectionModeOn = (state) => {
        return state.isSelectionModeOn
    }
    export const getAddNewActions = (state) => {
        return state.addnew
    }
}