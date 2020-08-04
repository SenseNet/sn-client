import { resources } from '../assets/resources'
import * as DMSReducers from '../Reducers'

describe('email reducer', () => {
  it('should return the initial state', () => {
    expect(DMSReducers.email(undefined, { type: '' })).toEqual('')
  })
  it('should return the registered email', () => {
    expect(DMSReducers.email(undefined, { type: 'USER_REGISTRATION_REQUEST', email: 'alba@sensenet.com' })).toEqual(
      'alba@sensenet.com',
    )
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
    expect(DMSReducers.registrationError(undefined, { type: '' })).toEqual(null)
  })
  it('should return an error message', () => {
    expect(DMSReducers.registrationError(undefined, { type: 'USER_REGISTRATION_FAILURE' })).toEqual(
      resources.USER_IS_ALREADY_REGISTERED,
    )
  })
})

describe('isRegistering reducer', () => {
  it('should return the initial state', () => {
    expect(DMSReducers.isRegistering(undefined, { type: '' })).toEqual(false)
  })
  it('should return true after a registration request', () => {
    expect(
      DMSReducers.isRegistering(undefined, { type: 'USER_REGISTRATION_REQUEST', email: 'alba@sensenet.com' }),
    ).toEqual(true)
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
    expect(DMSReducers.registrationDone(undefined, { type: '' })).toEqual(false)
  })
  it('should return true after registration success', () => {
    expect(DMSReducers.registrationDone(undefined, { type: 'USER_REGISTRATION_REQUEST_SUCCESS' })).toEqual(true)
  })
  it('should return false after a registration request', () => {
    expect(
      DMSReducers.registrationDone(undefined, { type: 'USER_REGISTRATION_REQUEST', email: 'alba@sensenet.com' }),
    ).toEqual(false)
  })
  it('should return false after registration failure', () => {
    expect(DMSReducers.registrationDone(undefined, { type: 'USER_REGISTRATION_FAILURE' })).toEqual(false)
  })
  it('should return false after clearing a registration', () => {
    expect(DMSReducers.registrationDone(undefined, { type: 'CLEAR_USER_REGISTRATION' })).toEqual(false)
  })
})

describe('actions reducer', () => {
  it('should return the initial state', () => {
    expect(DMSReducers.actions(undefined, { type: '' })).toEqual([])
  })
  it('should return the actionlist from the response', () => {
    const payload = {
      d: {
        results: ['Move', 'Copy'] as any[],
      },
    }
    expect(
      DMSReducers.actions(undefined, {
        type: 'LOAD_CONTENT_ACTIONS_SUCCESS',
        payload,
      }),
    ).toEqual([])
  })
  it('should return the actionlist from the response', () => {
    const actions = ['Move', 'Copy'] as any[]

    expect(DMSReducers.actions(undefined, { type: 'OPEN_ACTIONMENU', actions })).toEqual(['Move', 'Copy'])
  })
})

describe('open reducer', () => {
  it('should return the initial state', () => {
    expect(DMSReducers.open(undefined, { type: '' })).toEqual(false)
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
    expect(DMSReducers.id(undefined, { type: '' })).toEqual(null)
  })
  it('should return the opened content items id', () => {
    expect(DMSReducers.id(undefined, { type: 'OPEN_ACTIONMENU', id: 1 })).toEqual(1)
  })
})

describe('title reducer', () => {
  it('should return the initial state', () => {
    expect(DMSReducers.title(undefined, { type: '' })).toEqual('')
  })
  it('should return the opened content items id', () => {
    expect(DMSReducers.title(undefined, { type: 'OPEN_ACTIONMENU', title: 'sample' })).toEqual('sample')
  })
})

describe('position reducer', () => {
  it('should return the initial state', () => {
    expect(DMSReducers.anchorElement(undefined, { type: '' })).toEqual(null)
  })
  it('should return the opened content items position', () => {
    expect(DMSReducers.anchorElement(undefined, { type: 'OPEN_ACTIONMENU', element: null })).toEqual(null)
  })
})

describe('rootId reducer', () => {
  it('should return the initial state', () => {
    expect(DMSReducers.rootId(undefined, { type: '' })).toEqual(null)
  })
  it('should return the root id', () => {
    expect(
      DMSReducers.rootId(undefined, {
        type: 'LOAD_CONTENT_SUCCESS',
        payload: { d: { Id: 1, Path: '/login', Name: '', Type: '' } },
      }),
    ).toEqual(null)
  })
  it('should return null', () => {
    expect(
      DMSReducers.rootId(undefined, {
        type: 'LOAD_CONTENT_SUCCESS',
        payload: { d: { Id: 1, Path: '/Default_Site', Name: '', Type: '' } },
      }),
    ).toEqual(null)
  })
})

describe('currentId reducer', () => {
  it('should return the initial state', () => {
    expect(DMSReducers.currentId(undefined, { type: '' })).toEqual(null)
  })
  it('should return the current id', () => {
    expect(DMSReducers.currentId(undefined, { type: 'SET_CURRENT_ID', id: 1 })).toEqual(1)
  })
})

describe('editedItemId reducer', () => {
  it('should return the initial state', () => {
    expect(DMSReducers.editedItemId(undefined, { type: '' })).toEqual(null)
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
    expect(DMSReducers.isLoading(undefined, { type: '' })).toEqual(false)
  })
  it('should return the current state of loading', () => {
    expect(DMSReducers.isLoading(undefined, { type: 'LOAD_CONTENT_REQUEST' })).toEqual(true)
  })
})

describe('isSelectionModeOn reducer', () => {
  it('should return the initial state', () => {
    expect(DMSReducers.isSelectionModeOn(undefined, { type: '' })).toEqual(false)
  })
  it('should return the current state of selection mode', () => {
    expect(DMSReducers.isSelectionModeOn(undefined, { type: 'SELECTION_MODE_ON' })).toEqual(true)
  })
})

describe('breadcrumb reducer', () => {
  it('should return the initial state', () => {
    expect(DMSReducers.breadcrumb(undefined, { type: '' })).toEqual([])
  })
  it('should return null when default_site is a part of the response path', () => {
    expect(
      DMSReducers.breadcrumb(undefined, {
        type: 'LOAD_CONTENT_SUCCESS',
        payload: { d: { Path: '/Default_Site' } },
      }),
    ).toEqual([])
  })
  it('should return [aaa]', () => {
    expect(
      DMSReducers.breadcrumb(undefined, {
        type: 'LOAD_CONTENT_SUCCESS',
        payload: { d: { DisplayName: 'aaa', Id: 1, Path: '/aaa' } },
      }),
    ).toEqual([])
  })
  it('should return [aaa, bbb]', () => {
    expect(
      DMSReducers.breadcrumb(
        [
          { name: 'aaa', id: 1, path: '/aaa' },
          { name: 'bbb', id: 2, path: '/bbb' },
        ],
        {
          type: 'LOAD_CONTENT_SUCCESS',
          payload: { d: { DisplayName: 'aaa', Id: 1, Path: '/aaa' } },
        },
      ),
    ).toEqual([
      { id: 1, name: 'aaa', path: '/aaa' },
      { id: 2, name: 'bbb', path: '/bbb' },
    ])
  })
})
