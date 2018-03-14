import { resources } from '../assets/resources'
import * as DMSReducers from '../Reducers'

describe('email reducer', () => {
    it('should return the initial state', () => {
        expect(DMSReducers.email(undefined, {})).toEqual('')
    })
    it('should return the registered email', () => {
        expect(DMSReducers.email(undefined, { type: 'USER_REGISTRATION_REQUEST', email: 'alba@sensenet.com' })).toEqual('alba@sensenet.com')
    })
    it('should return an empty string', () => {
        expect(DMSReducers.email(undefined, { type: 'USER_REGISTRATION_SUCCESS' })).toEqual('')
    })
    it('should return an empty string', () => {
        expect(DMSReducers.email(undefined, { type: 'USER_REGISTRATION_FAILURE' })).toEqual('')
    })
})

describe('registrationError reducer', () => {
    it('should return the initial state', () => {
        expect(DMSReducers.registrationError(undefined, {})).toEqual(null)
    })
    it('should return an error message', () => {
        expect(DMSReducers.registrationError(undefined, { type: 'USER_REGISTRATION_FAILURE' })).toEqual(resources.USER_IS_ALREADY_REGISTERED)
    })
})

describe('isRegistering reducer', () => {
    it('should return the initial state', () => {
        expect(DMSReducers.isRegistering(undefined, {})).toEqual(false)
    })
    it('should return true after a registration request', () => {
        expect(DMSReducers.isRegistering(undefined, { type: 'USER_REGISTRATION_REQUEST', email: 'alba@sensenet.com' })).toEqual(true)
    })
    it('should return false after registration success', () => {
        expect(DMSReducers.isRegistering(undefined, { type: 'USER_REGISTRATION_SUCCESS' })).toEqual(false)
    })
    it('should return false after registration failure', () => {
        expect(DMSReducers.isRegistering(undefined, { type: 'USER_REGISTRATION_FAILURE' })).toEqual(false)
    })
})

describe('registrationDone reducer', () => {
    it('should return the initial state', () => {
        expect(DMSReducers.registrationDone(undefined, {})).toEqual(false)
    })
    it('should return true after registration success', () => {
        expect(DMSReducers.registrationDone(undefined, { type: 'USER_REGISTRATION_SUCCESS' })).toEqual(true)
    })
    it('should return false after a registration request', () => {
        expect(DMSReducers.registrationDone(undefined, { type: 'USER_REGISTRATION_REQUEST', email: 'alba@sensenet.com' })).toEqual(false)
    })
    it('should return false after registration failure', () => {
        expect(DMSReducers.registrationDone(undefined, { type: 'USER_REGISTRATION_FAILURE' })).toEqual(false)
    })
    it('should return false after clearing a registration', () => {
        expect(DMSReducers.registrationDone(undefined, { type: 'CLEAR_USER_REGISTRATION' })).toEqual(false)
    })
})

describe('captcha reducer', () => {
    it('should return the initial state', () => {
        expect(DMSReducers.captcha(undefined, {})).toEqual(false)
    })
    it('should return true after verifying captcha', () => {
        expect(DMSReducers.captcha(undefined, { type: 'VERIFY_CAPTCHA_SUCCESS' })).toEqual(true)
    })
})

describe('actions reducer', () => {
    it('should return the initial state', () => {
        expect(DMSReducers.actions(undefined, {})).toEqual([])
    })
    it('should return the actionlist from the response', () => {
        const actions = [
            'Move',
            'Copy',
        ]
        expect(DMSReducers.actions(undefined, { type: 'REQUEST_CONTENT_ACTIONS_SUCCESS', response: actions })).toEqual(['Move', 'Copy'])
    })
    it('should return the actionlist from the response', () => {
        const actions = [
            'Move',
            'Copy',
        ]
        expect(DMSReducers.actions(undefined, { type: 'OPEN_ACTIONMENU', actions })).toEqual(['Move', 'Copy'])
    })
})

describe('open reducer', () => {
    it('should return the initial state', () => {
        expect(DMSReducers.open(undefined, {})).toEqual(false)
    })
    it('should return true', () => {
        expect(DMSReducers.open(undefined, { type: 'OPEN_ACTIONMENU' })).toEqual(true)
    })
    it('should return false', () => {
        expect(DMSReducers.open(undefined, { type: 'CLOSE_ACTIONMENU' })).toEqual(false)
    })
})

describe('id reducer', () => {
    it('should return the initial state', () => {
        expect(DMSReducers.id(undefined, {})).toEqual(null)
    })
    it('should return the opened content items id', () => {
        expect(DMSReducers.id(undefined, { type: 'OPEN_ACTIONMENU', id: 1 })).toEqual(1)
    })
})

describe('title reducer', () => {
    it('should return the initial state', () => {
        expect(DMSReducers.title(undefined, {})).toEqual('')
    })
    it('should return the opened content items id', () => {
        expect(DMSReducers.title(undefined, { type: 'OPEN_ACTIONMENU', title: 'sample' })).toEqual('sample')
    })
})

describe('position reducer', () => {
    it('should return the initial state', () => {
        expect(DMSReducers.position(undefined, {})).toEqual(null)
    })
    it('should return the opened content items position', () => {
        expect(DMSReducers.position(undefined, { type: 'OPEN_ACTIONMENU', position: { top: 1, left: 1 } })).toEqual({ top: 1, left: 1 })
    })
})

describe('rootId reducer', () => {
    it('should return the initial state', () => {
        expect(DMSReducers.rootId(undefined, {})).toEqual(null)
    })
    it('should return the root id', () => {
        expect(DMSReducers.rootId(undefined, { type: 'LOAD_CONTENT_SUCCESS', response: { Id: 1, Path: '/login' } })).toEqual(1)
    })
    it('should return null', () => {
        expect(DMSReducers.rootId(undefined, { type: 'LOAD_CONTENT_SUCCESS', response: { Id: 1, Path: '/Default_Site' } })).toEqual(null)
    })
})

describe('currentId reducer', () => {
    it('should return the initial state', () => {
        expect(DMSReducers.currentId(undefined, {})).toEqual(null)
    })
    it('should return the current id', () => {
        expect(DMSReducers.currentId(undefined, { type: 'SET_CURRENT_ID', id: 1 })).toEqual(1)
    })
})

describe('editedItemId reducer', () => {
    it('should return the initial state', () => {
        expect(DMSReducers.editedItemId(undefined, {})).toEqual(null)
    })
    it('should return the currently edited content items id', () => {
        expect(DMSReducers.editedItemId(undefined, { type: 'SET_EDITED_ID', id: 1 })).toEqual(1)
    })
    it('should return null', () => {
        expect(DMSReducers.editedItemId(undefined, { type: 'UPDATE_CONTENT_SUCCESS' })).toEqual(null)
    })
})

describe('isLoading reducer', () => {
    it('should return the initial state', () => {
        expect(DMSReducers.isLoading(undefined, {})).toEqual(false)
    })
    it('should return the current state of loading', () => {
        expect(DMSReducers.isLoading(undefined, { type: 'LOAD_CONTENT_REQUEST' })).toEqual(true)
    })
})

describe('isSelectionModeOn reducer', () => {
    it('should return the initial state', () => {
        expect(DMSReducers.isSelectionModeOn(undefined, {})).toEqual(false)
    })
    it('should return the current state of selection mode', () => {
        expect(DMSReducers.isSelectionModeOn(undefined, { type: 'SELECTION_MODE_ON' })).toEqual(true)
    })
})

describe('breadcrumb reducer', () => {
    it('should return the initial state', () => {
        expect(DMSReducers.breadcrumb(undefined, {})).toEqual([])
    })
    it('should return null when default_site is a part of the response path', () => {
        expect(DMSReducers.breadcrumb(undefined, { type: 'LOAD_CONTENT_SUCCESS', response: { Path: '/Default_Site' } })).toEqual([])
    })
    it('should return [aaa]', () => {
        expect(DMSReducers.breadcrumb(undefined, { type: 'LOAD_CONTENT_SUCCESS', response: { DisplayName: 'aaa', Id: 1, Path: '/aaa' } })).toEqual([{ name: 'aaa', id: 1, path: '/aaa' }])
    })
    it('should return [aaa, bbb]', () => {
        expect(DMSReducers.breadcrumb(
            [{ name: 'aaa', id: 1, path: '/aaa' }, { name: 'bbb', id: 2, path: '/bbb' }], { type: 'LOAD_CONTENT_SUCCESS', response: { DisplayName: 'aaa', Id: 1, Path: '/aaa' } })).toEqual([{ name: 'aaa', id: 1, path: '/aaa' }])
    })
})

describe('getRegistrationError', () => {
    const state = {
        registrationError: 'error happened',
    }
    it('should return the error message', () => {
        expect(DMSReducers.getRegistrationError(state)).toEqual('error happened')
    })
})

describe('registrationInProgress', () => {
    const state = {
        isRegistering: true,
    }
    it('should return the whether the registration is progress or not', () => {
        expect(DMSReducers.registrationInProgress(state)).toEqual(true)
    })
})

describe('registrationIsDone', () => {
    const state = {
        registrationDone: true,
    }
    it('should return the whether the registration is done or not', () => {
        expect(DMSReducers.registrationIsDone(state)).toEqual(true)
    })
})

describe('isLoading', () => {
    const state = {
        isLoading: true,
    }
    it('should return the whether the loading is in progress or not', () => {
        expect(DMSReducers.getLoading(state)).toEqual(true)
    })
})

describe('getRegisteredEmail', () => {
    const state = {
        email: 'alba@sensenet.com',
    }
    it('should return the registered email address', () => {
        expect(DMSReducers.getRegisteredEmail(state)).toEqual('alba@sensenet.com')
    })
})

describe('captchaIsVerified', () => {
    const state = {
        captcha: true,
    }
    it('should return true if the captcha is verified', () => {
        expect(DMSReducers.captchaIsVerified(state)).toEqual(true)
    })
})

describe('getAuthenticatedUser', () => {
    const state = {
        session: {
            user: {
                name: 'alba',
                id: 1,
            },
        },
    }
    it('should return the authenticated user', () => {
        expect(DMSReducers.getAuthenticatedUser(state)).toEqual({
            name: 'alba',
            id: 1,
        })
    })
})

describe('getChildrenItems', () => {
    const state = {
        children: {
            entities: {
                2103: {
                    name: 'aaa',
                    id: 2,
                },
                2222: {
                    name: 'bbb',
                    id: 1,
                },
            },
        },
    }
    it('should return the children items', () => {
        expect(DMSReducers.getChildrenItems(state)).toEqual({
            2103: {
                name: 'aaa',
                id: 2,
            },
            2222: {
                name: 'bbb',
                id: 1,
            },
        })
    })
})

describe('getCurrentContentPath', () => {
    const state = {
        Path: '/aaa',
    }
    it('should return the path of the current content', () => {
        expect(DMSReducers.getCurrentContentPath(state)).toEqual('/aaa')
    })
})

describe('actionmenuIsOpen', () => {
    const state = {
        open: true,
    }
    it('should return true if the actionmenu is open', () => {
        expect(DMSReducers.actionmenuIsOpen(state)).toEqual(true)
    })
})

describe('getActionMenuPosition', () => {
    const state = {
        position: {
            top: 1,
            left: 1,
        },
    }
    it('should return position of the actionmenu', () => {
        expect(DMSReducers.getActionMenuPosition(state)).toEqual({
            top: 1,
            left: 1,
        })
    })
})

describe('getParentId', () => {
    const state = {
        currentcontent: {
            content: {
                ParentId: 123,
            },
        },
    }
    it('should return the id of the parent of the current content', () => {
        expect(DMSReducers.getParentId(state)).toEqual(123)
    })
})

describe('getRootId', () => {
    const state = {
        rootId: 123,
    }
    it('should return the root id', () => {
        expect(DMSReducers.getRootId(state)).toEqual(123)
    })
})

describe('getBreadCrumbArray', () => {
    const state = {
        breadcrumb: ['aaa', 'bbb'],
    }
    it('should return the breadcrumb items', () => {
        expect(DMSReducers.getBreadCrumbArray(state)).toEqual(['aaa', 'bbb'])
    })
})

describe('getCurrentId', () => {
    const state = {
        currentId: 123,
    }
    it('should return the current id', () => {
        expect(DMSReducers.getCurrentId(state)).toEqual(123)
    })
})

describe('getActionsOfAContent', () => {
    const state = {
        Actions: ['aaa', 'bbb'],
    }
    it('should return the actions', () => {
        expect(DMSReducers.getActionsOfAContent(state)).toEqual(['aaa', 'bbb'])
    })
})

describe('getActions', () => {
    const state = {
        actions: ['aaa', 'bbb'],
    }
    it('should return the actions', () => {
        expect(DMSReducers.getActions(state)).toEqual(['aaa', 'bbb'])
    })
})

describe('getEditedItemId', () => {
    const state = {
        editedItemId: 123,
    }
    it('should return the currently edited id', () => {
        expect(DMSReducers.getEditedItemId(state)).toEqual(123)
    })
})

describe('getItemOnActionMenuIsOpen', () => {
    const state = {
        id: 123,
    }
    it('should return the id of the item on which the actionmenu was opened', () => {
        expect(DMSReducers.getItemOnActionMenuIsOpen(state)).toEqual(123)
    })
})
describe('getItemOnActionMenuIsOpen', () => {
    const state = {
        title: 'sample',
    }
    it('should return the title of the item on which the actionmenu was opened', () => {
        expect(DMSReducers.getItemTitleOnActionMenuIsOpen(state)).toEqual('sample')
    })
})

describe('getIsSelectionModeOn', () => {
    const state = {
        isSelectionModeOn: true,
    }
    it('should return whether the selection mode is on or off', () => {
        expect(DMSReducers.getIsSelectionModeOn(state)).toEqual(true)
    })
})
