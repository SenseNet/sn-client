import * as DMSActions from '../Actions'

describe('UserRegistration', () => {
    it('should create an action to request user registration', () => {
        const expectedAction = {
            type: 'USER_REGISTRATION_REQUEST',
            email: 'alba@sensenet.com',
            password: 'alba',
        }
        expect(DMSActions.userRegistration('alba@sensenet.com', 'alba')).toEqual(expectedAction)
    })
})

describe('VerifyCaptchaSuccess', () => {
    it('should create an action to captcha verifing success', () => {
        const expectedAction = {
            type: 'VERIFY_CAPTCHA_SUCCESS',
        }
        expect(DMSActions.verifyCaptchaSuccess()).toEqual(expectedAction)
    })
})

describe('ClearRegistration', () => {
    it('should create an action to clear registration', () => {
        const expectedAction = {
            type: 'CLEAR_USER_REGISTRATION',
        }
        expect(DMSActions.clearRegistration()).toEqual(expectedAction)
    })
})

describe('SetCurrentId', () => {
    it('should create an action to set the current id', () => {
        const expectedAction = {
            type: 'SET_CURRENT_ID',
            id: 1,
        }
        expect(DMSActions.setCurrentId(1)).toEqual(expectedAction)
    })
})

describe('SetEditedContentId', () => {
    it('should create an action to set the currently edited contents id', () => {
        const expectedAction = {
            type: 'SET_EDITED_ID',
            id: 1,
        }
        expect(DMSActions.setEditedContentId(1)).toEqual(expectedAction)
    })
})

describe('OpenActionMenu', () => {
    it('should create an action to handle actionmenu open', () => {
        const expectedAction = {
            type: 'OPEN_ACTIONMENU',
            actions: ['Move', 'Copy'],
            id: 1,
            title: 'sample doc',
            position: {
                top: 2,
                left: 2,
            },
        }
        expect(DMSActions.openActionMenu(['Move', 'Copy'], 1, 'sample doc', { top: 2, left: 2 })).toEqual(expectedAction)
    })
})

describe('CloseActionMenu', () => {
    it('should create an action to handle actionmenu close', () => {
        const expectedAction = {
            type: 'CLOSE_ACTIONMENU',
        }
        expect(DMSActions.closeActionMenu()).toEqual(expectedAction)
    })
})

describe('SelectionModeOn', () => {
    it('should create an action to handle selection mode', () => {
        const expectedAction = {
            type: 'SELECTION_MODE_ON',
        }
        expect(DMSActions.selectionModeOn()).toEqual(expectedAction)
    })
})

describe('SelectionModeOff', () => {
    it('should create an action to handle selection mode', () => {
        const expectedAction = {
            type: 'SELECTION_MODE_OFF',
        }
        expect(DMSActions.selectionModeOff()).toEqual(expectedAction)
    })
})
