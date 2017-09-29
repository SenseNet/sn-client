export module DMSActions {
    export const UserRegistration = (email: string, password: string) => ({
        type: 'USER_REGISTRATION_REQUEST',
        email,
        password
    })
    export const UserRegistrationSuccess = (response: any) => ({
        type: 'USER_REGISTRATION_SUCCESS'
    })
    export const UserRegistrationFailure = (error: any) => ({
        type: 'USER_REGISTRATION_FAILURE',
        message: error.message
    })
    export const VerifyCaptchaSuccess = (response: any) => ({
        type: 'VERIFY_CAPTCHA_SUCCESS'
    })
    export const ClearRegistration = () => ({
        type: 'CLEAR_USER_REGISTRATION'
    })
    export const SetCurrentId = (id) => ({
        type: 'SET_CURRENT_ID',
        id
    })
    export const OpenActionMenu = (actions, position) => ({
        type: 'OPEN_ACTIONMENU',
        actions,
        position
    })
    export const CloseActionMenu = () => ({
        type: 'CLOSE_ACTIONMENU'
    })
}