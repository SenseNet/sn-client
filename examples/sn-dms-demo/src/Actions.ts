
enum MessageMode { error = 'error', warning = 'warning', info = 'info' }

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
    export const OpenActionMenu = (actions, id, title, position, customItems?) => ({
        type: 'OPEN_ACTIONMENU',
        actions: customItems && customItems.length > 0 ? customItems : actions,
        id,
        title,
        position
    })
    export const CloseActionMenu = () => ({
        type: 'CLOSE_ACTIONMENU'
    })
    export const SelectionModeOn = () => ({
        type: 'SELECTION_MODE_ON'
    })
    export const SelectionModeOff = () => ({
        type: 'SELECTION_MODE_OFF'
    })
    export const setEditedFirst = (edited) => ({
        type: 'SET_EDITED_FIRST',
        edited
    })
    export const OpenMessageBar = (mode: MessageMode, content, vertical?, horizontal?) => ({
        type: 'OPEN_MESSAGE_BAR',
        mode,
        content,
        vertical: vertical || 'bottom',
        horizontal: horizontal || 'left'
    })
    export const CloseMessageBar = () => ({
        type: 'CLOSE_MESSAGE_BAR'
    })
}