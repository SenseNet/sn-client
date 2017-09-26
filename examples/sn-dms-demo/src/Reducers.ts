import { combineReducers } from 'redux';
import { resources } from './assets/resources'
export module DMSReducers {
    const email = (state = '', action) => {
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
    const registrationError = (state = '', action) => {
        switch (action.type) {
            case 'USER_REGISTRATION_FAILURE':
                return resources.USER_IS_ALREADY_REGISTERED
            default:
                return null
        }
    }
    const isRegistering = (state = false, action) => {
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

    const registrationDone = (state = false, action) => {
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

    const captcha = (state = false, action) => {
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
            default:
                return state
        }
    }

    export const open = (state = false, action) => {
        switch (action.type) {
            case 'TRIGGER_ACTIONMENU':
                return action.open || !state
            default:
                return state
        }
    }

    export const element = (state = null, action) => {
        switch (action.type) {
            case 'TRIGGER_ACTIONMENU':
                return action.element
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

    export const actionmenu = combineReducers({
        actions,
        open,
        element
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

    export const getActionMenuAnchor = (state) => {
        return state.element
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
}