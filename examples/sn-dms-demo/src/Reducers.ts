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
}