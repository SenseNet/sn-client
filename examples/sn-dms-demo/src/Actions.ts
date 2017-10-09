export module DMSActions {
    export const UserRegistration = (email: string, password: string) => ({
        type: 'USER_REGISTRATION_REQUEST',
        email,
        password
    })
    export const UserRegistrationSuccess = () => ({
        type: 'USER_REGISTRATION_SUCCESS'
    })
    export const UserRegistrationFailure = (error: any) => ({
        type: 'USER_REGISTRATION_FAILURE',
        message: error.message
    })
    export const VerifyCaptchaSuccess = () => ({
        type: 'VERIFY_CAPTCHA_SUCCESS'
    })
    export const ClearRegistration = () => ({
        type: 'CLEAR_USER_REGISTRATION'
    })
    export const SetCurrentId = (id) => ({
        type: 'SET_CURRENT_ID',
        id
    })
    export const SetEditedContentId = (id) => ({
        type: 'SET_EDITED_ID',
        id
    })
    export const OpenActionMenu = (actions, id, position) => ({
        type: 'OPEN_ACTIONMENU',
        actions,
        id,
        position
    })
    export const CloseActionMenu = () => ({
        type: 'CLOSE_ACTIONMENU'
    })
}