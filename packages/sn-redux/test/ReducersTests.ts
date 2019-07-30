import { Content, LoginState, ODataBatchResponse, ODataParams, Repository } from '@sensenet/client-core'
import { ActionModel, GenericContent, Status, User, Workspace } from '@sensenet/default-content-types'
import * as Reducers from '../src/reducers'

const defaultAction = {
  type: '',
  user: {} as User,
  result: {},
}

describe('Reducers', () => {
  describe('country reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.country(undefined, defaultAction)).toEqual('')
    })
  })

  describe('language reducer', () => {
    const user = { Language: ['hu-HU'] }
    const user2 = {}
    it('should return the initial state', () => {
      expect(Reducers.language(undefined, defaultAction)).toEqual('en-US')
    })
    it('should return the language set on the user', () => {
      expect(Reducers.language(undefined, { type: 'USER_CHANGED', user })).toEqual('hu-HU')
    })
    it('should return the initial language', () => {
      expect(Reducers.language(undefined, { type: 'USER_CHANGED', user: user2 })).toEqual('en-US')
    })
  })

  describe('loginState reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.loginState(undefined, defaultAction)).toEqual(LoginState.Pending)
    })
    it('should return the new state', () => {
      expect(
        Reducers.loginState(undefined, { type: 'USER_LOGIN_STATE_CHANGED', loginState: LoginState.Authenticated }),
      ).toEqual(LoginState.Authenticated)
    })
  })

  describe('loginError reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.loginError(undefined, defaultAction)).toEqual(null)
    })
    it('should return null', () => {
      expect(Reducers.loginError(undefined, { type: 'USER_LOGIN_SUCCESS', result: true })).toEqual(null)
    })
    it('should return an error message', () => {
      expect(Reducers.loginError(undefined, { type: 'USER_LOGIN_SUCCESS', result: false })).toEqual(
        'Wrong username or password!',
      )
    })
    it('should return an error message', () => {
      expect(Reducers.loginError(undefined, { type: 'USER_LOGIN_FAILURE', error: { message: 'error' } })).toEqual(
        'error',
      )
    })
    it('should return an error message', () => {
      expect(Reducers.loginError(undefined, { type: 'USER_LOGOUT_FAILURE', error: { message: 'error' } })).toEqual(
        'error',
      )
    })
  })

  describe('userName reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.userName(undefined, defaultAction)).toEqual('Visitor')
    })
    it('should return the logged-in users name', () => {
      expect(
        Reducers.userName(undefined, { type: 'USER_CHANGED', user: { Name: 'Alba', Id: 5, Type: 'User', Path: '' } }),
      ).toEqual('Alba')
    })
  })

  describe('fullName reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.fullName(undefined, defaultAction)).toEqual('Visitor')
    })
    it('should return the logged-in users full-name', () => {
      expect(
        Reducers.fullName(undefined, {
          type: 'USER_CHANGED',
          user: { DisplayName: 'Alba Monday', Id: 5, Type: 'User', Path: '', Name: 'Alba' },
        }),
      ).toEqual('Alba Monday')
    })
  })

  describe('userLanguage reducer', () => {
    const user: User = { Language: ['hu-HU'] as any, Id: 123, Path: '/', Type: 'User', Name: 'Example' }
    const user2 = {} as any
    it('should return the initial state', () => {
      expect(Reducers.userLanguage(undefined, defaultAction)).toEqual('en-US')
    })
    it('should return the language set on the user', () => {
      expect(Reducers.userLanguage(undefined, { type: 'USER_CHANGED', user })).toEqual('hu-HU')
    })
    it('should return the initial language', () => {
      expect(Reducers.userLanguage(undefined, { type: 'USER_CHANGED', user: user2 })).toEqual('en-US')
    })
  })

  describe('userAvatarPath reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.userAvatarPath(undefined, defaultAction)).toEqual('')
    })
    it('should return the initial state', () => {
      expect(
        Reducers.userAvatarPath(undefined, { type: 'USER_CHANGED', user: { DisplayName: 'Alba Monday' } as any }),
      ).toEqual('')
    })
    it('should return the logged-in users avatars path', () => {
      expect(
        Reducers.userAvatarPath(undefined, {
          type: 'USER_CHANGED',
          user: { Avatar: { Url: 'Alba Monday' } } as any,
        }),
      ).toEqual('Alba Monday')
    })
  })

  describe('ids reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.ids(undefined, defaultAction)).toEqual([])
    })
    it('should handle FETCH_CONTENT_SUCCESS', () => {
      expect(
        Reducers.ids([], {
          type: 'FETCH_CONTENT_SUCCESS',
          result: {
            d: {
              results: [
                {
                  Id: 5145,
                  DisplayName: 'Some Article',
                  Status: ['Active'],
                },
                {
                  Id: 5146,
                  Displayname: 'Other Article',
                  Status: ['Completed'],
                },
              ],
            },
          },
        }),
      ).toEqual([5145, 5146])
    })
    it('should handle CREATE_CONTENT_SUCCESS', () => {
      expect(
        Reducers.ids([1, 2, 3], {
          type: 'CREATE_CONTENT_SUCCESS',
          result: {
            d: { Id: 4 },
          },
        }),
      ).toEqual([1, 2, 3, 4])
    })
    it('should handle DELETE_CONTENT_SUCCESS', () => {
      expect(
        Reducers.ids([1, 2, 3], {
          type: 'DELETE_CONTENT_SUCCESS',
          result: {
            d: {
              results: [{ Id: 1 }],
            },
          } as ODataBatchResponse<Content>,
        }),
      ).toEqual([2, 3])
    })
    it('should handle UPDATE_CONTENT_SUCCESS', () => {
      expect(
        Reducers.ids([1, 2, 3], {
          type: 'UPLOAD_CONTENT_SUCCESS',
          result: {
            d: {
              Id: 4,
            },
          },
        }),
      ).toEqual([1, 2, 3, 4])
    })
    it('should handle UPDATE_CONTENT_SUCCESS with existing id', () => {
      expect(
        Reducers.ids([1, 2, 3], {
          type: 'UPLOAD_CONTENT_SUCCESS',
          result: {
            d: {
              Id: 3,
            },
          },
        }),
      ).toEqual([1, 2, 3])
    })
    it('should handle DELETE_BATCH_SUCCESS', () => {
      expect(
        Reducers.ids([1, 2, 3], {
          type: 'DELETE_BATCH_SUCCESS',
          result: {
            d: {
              results: [{ Id: 1 }, { Id: 2 }],
              errors: [],
            },
          },
        }),
      ).toEqual([3])
    })
    it('should handle DELETE_BATCH_SUCCESS', () => {
      expect(
        Reducers.ids([1, 2, 3], {
          type: 'DELETE_BATCH_SUCCESS',
          result: {
            d: {
              results: [],
              errors: [],
            },
          },
        }),
      ).toEqual([1, 2, 3])
    })
    it('should handle MOVE_BATCH_SUCCESS', () => {
      expect(
        Reducers.ids([1, 2, 3], {
          type: 'MOVE_BATCH_SUCCESS',
          result: {
            d: {
              results: [{ Id: 1 }, { Id: 2 }],
              errors: [],
            },
          },
        }),
      ).toEqual([3])
    })
    it('should handle MOVE_BATCH_SUCCESS', () => {
      expect(
        Reducers.ids([1, 2, 3], {
          type: 'MOVE_BATCH_SUCCESS',
          result: {
            d: {
              results: [],
              errors: [],
            },
          },
        }),
      ).toEqual([1, 2, 3])
    })
  })

  describe('entities reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.entities(undefined, defaultAction)).toEqual([])
    })
    it('should return a new state with the given response', () => {
      expect(Reducers.entities(undefined, { type: '', result: { entities: { entities: { a: 0, b: 2 } } } })).toEqual([])
    })
    it('should handle UPDATE_CONTENT_SUCCESS', () => {
      const entities = [
        {
          Id: 5145,
          DisplayName: 'Some Article',
          Status: Status.active,
          Name: 'SomeArticle',
          Path: '',
          Type: 'Task',
        },
        {
          Id: 5146,
          Displayname: 'Other Article',
          Status: Status.completed,
          Name: 'OtherArticle',
          Path: '',
          Type: 'Task',
        },
      ]
      expect(
        Reducers.entities(entities, {
          type: 'UPDATE_CONTENT_SUCCESS',
          result: {
            d: {
              Id: 5145,
              DisplayName: 'aaa',
              Status: Status.active,
            },
          },
        }),
      ).toEqual([
        { Id: 5145, DisplayName: 'aaa', Status: 'active' },
        {
          Id: 5146,
          Displayname: 'Other Article',
          Status: 'completed',
          Name: 'OtherArticle',
          Path: '',
          Type: 'Task',
        },
      ])
    })
    it('should handle UPLOAD_CONTENT_SUCCESS', () => {
      const entities = [
        {
          Id: 5122,
          DisplayName: 'Some Article',
          Status: Status.active,
          Name: 'SomeArticle',
          Path: '',
          Type: 'Task',
        },
        {
          Id: 5146,
          Displayname: 'Other Article',
          Status: Status.completed,
          Name: 'OtherArticle',
          Path: '',
          Type: 'Task',
        },
      ]
      expect(
        Reducers.entities(entities, {
          type: 'UPLOAD_CONTENT_SUCCESS',
          result: { d: { Id: 5145, DisplayName: 'aaa', Status: Status.active } },
        }),
      ).toEqual([
        {
          Id: 5145,
          DisplayName: 'aaa',
          Status: Status.active,
        },
        {
          Id: 5122,
          DisplayName: 'Some Article',
          Status: Status.active,
          Name: 'SomeArticle',
          Path: '',
          Type: 'Task',
        },
        {
          Id: 5146,
          Displayname: 'Other Article',
          Status: Status.completed,
          Name: 'OtherArticle',
          Path: '',
          Type: 'Task',
        },
      ])
    })
    it('should handle UPLOAD_CONTENT_SUCCESS with existing content', () => {
      const entities = [
        {
          Id: 5122,
          DisplayName: 'Some Article',
          Status: Status.active,
          Name: 'SomeArticle',
          Path: '',
          Type: 'Task',
        },
        {
          Id: 5146,
          Displayname: 'Other Article',
          Status: Status.completed,
          Name: 'OtherArticle',
          Path: '',
          Type: 'Task',
        },
      ]
      expect(
        Reducers.entities(entities, {
          type: 'UPLOAD_CONTENT_SUCCESS',
          result: {
            d: {
              Id: 5122,
              DisplayName: 'Some Article',
              Status: Status.active,
              Name: 'SomeArticle',
              Path: '',
              Type: 'Task',
            },
          },
        }),
      ).toEqual([
        {
          Id: 5122,
          DisplayName: 'Some Article',
          Status: Status.active,
          Name: 'SomeArticle',
          Path: '',
          Type: 'Task',
        },
        {
          Id: 5146,
          Displayname: 'Other Article',
          Status: Status.completed,
          Name: 'OtherArticle',
          Path: '',
          Type: 'Task',
        },
      ])
    })
    it('should handle CREATE_CONTENT_SUCCESS', () => {
      const entities = [
        {
          Id: 5122,
          DisplayName: 'Some Article',
          Status: Status.active,
          Name: 'SomeArticle',
          Path: '',
          Type: 'Task',
        },
        {
          Id: 5146,
          Displayname: 'Other Article',
          Status: Status.completed,
          Name: 'OtherArticle',
          Path: '',
          Type: 'Task',
        },
      ]
      expect(
        Reducers.entities(entities, {
          type: 'CREATE_CONTENT_SUCCESS',
          result: { d: { Id: 5145, DisplayName: 'aaa', Status: Status.active } },
        }),
      ).toEqual([
        {
          Id: 5145,
          DisplayName: 'aaa',
          Status: Status.active,
        },
        {
          Id: 5122,
          DisplayName: 'Some Article',
          Status: Status.active,
          Name: 'SomeArticle',
          Path: '',
          Type: 'Task',
        },
        {
          Id: 5146,
          Displayname: 'Other Article',
          Status: Status.completed,
          Name: 'OtherArticle',
          Path: '',
          Type: 'Task',
        },
      ])
    })
    it('should handle CREATE_CONTENT_SUCCESS', () => {
      const entities = [
        {
          Id: 5122,
          DisplayName: 'Some Article',
          Status: Status.active,
          Name: 'SomeArticle',
          Path: '',
          Type: 'Task',
        },
        {
          Id: 5146,
          Displayname: 'Other Article',
          Status: Status.completed,
          Name: 'OtherArticle',
          Path: '',
          Type: 'Task',
        },
      ]
      expect(
        Reducers.entities(entities, {
          type: 'CREATE_CONTENT_SUCCESS',
          result: {
            d: {
              Id: 5122,
              DisplayName: 'Some Article',
              Status: Status.active,
              Name: 'SomeArticle',
              Path: '',
              Type: 'Task',
            },
          },
        }),
      ).toEqual([
        {
          Id: 5122,
          DisplayName: 'Some Article',
          Status: Status.active,
          Name: 'SomeArticle',
          Path: '',
          Type: 'Task',
        },
        {
          Id: 5146,
          Displayname: 'Other Article',
          Status: Status.completed,
          Name: 'OtherArticle',
          Path: '',
          Type: 'Task',
        },
      ])
    })
    it('should handle DELETE_BATCH_SUCCESS', () => {
      const entities = [
        {
          Id: 5145,
          DisplayName: 'Some Article',
          Status: Status.active,
          Name: 'SomeArticle',
          Path: '',
          Type: 'Task',
        },
        {
          Id: 5122,
          Displayname: 'Other Article',
          Status: Status.completed,
          Name: 'OtherArticle',
          Path: '',
          Type: 'Task',
        },
      ]
      expect(
        Reducers.entities(entities, {
          type: 'DELETE_BATCH_SUCCESS',
          result: {
            d: {
              results: [{ Id: 5122 }],
              errors: [],
            },
          },
        }),
      ).toEqual([
        {
          Id: 5145,
          DisplayName: 'Some Article',
          Status: Status.active,
          Name: 'SomeArticle',
          Path: '',
          Type: 'Task',
        },
      ])
    })
    it('should handle DELETE_CONTENT_SUCCESS', () => {
      const entities = [
        {
          Id: 5145,
          DisplayName: 'Some Article',
          Status: Status.active,
          Name: 'SomeArtice',
          Path: '',
          Type: 'Task',
        },
        {
          Id: 5122,
          Displayname: 'Other Article',
          Status: Status.completed,
          Name: 'OtherArticle',
          Path: '',
          Type: 'Task',
        },
      ]
      expect(
        Reducers.entities(entities, {
          type: 'DELETE_CONTENT_SUCCESS',
          result: {
            d: {
              results: [{ Id: 5122 }],
              errors: [],
            },
          },
        }),
      ).toEqual([
        {
          Id: 5145,
          DisplayName: 'Some Article',
          Status: Status.active,
          Name: 'SomeArtice',
          Path: '',
          Type: 'Task',
        },
      ])
    })
    it('should handle a custom Action', () => {
      expect(
        Reducers.entities(undefined, {
          type: 'AAAA',
          result: {
            d: {
              results: [{ Id: 5122 }],
              errors: [],
            },
          },
        }),
      ).toEqual([])
    })
  })

  describe('isFetching reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.isFetching(undefined, defaultAction)).toBe(false)
    })
    it('should handle FETCH_CONTENT_LOADING', () => {
      expect(Reducers.isFetching(false, { type: 'FETCH_CONTENT_LOADING' })).toBe(true)
    })
    it('should handle FETCH_CONTENT', () => {
      expect(Reducers.isFetching(true, { type: 'FETCH_CONTENT' })).toBe(false)
    })
    it('should handle FETCH_CONTENT_SUCCESS', () => {
      expect(Reducers.isFetching(true, { type: 'FETCH_CONTENT_SUCCESS' })).toBe(false)
    })
    it('should handle FETCH_CONTENT_FAILURE', () => {
      expect(Reducers.isFetching(true, { type: 'FETCH_CONTENT_FAILURE' })).toBe(false)
    })
  })

  describe('childrenerror reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.childrenerror(undefined, defaultAction)).toBe(null)
    })
    it('should handle FETCH_CONTENT_FAILURE', () => {
      expect(Reducers.childrenerror(null, { type: 'FETCH_CONTENT_FAILURE', error: { message: 'error' } })).toBe('error')
    })
    it('should handle CREATE_CONTENT_FAILURE', () => {
      expect(Reducers.childrenerror(null, { type: 'CREATE_CONTENT_FAILURE', error: { message: 'error' } })).toBe(null)
    })
    it('should handle UPDATE_CONTENT_FAILURE', () => {
      expect(Reducers.childrenerror(null, { type: 'UPDATE_CONTENT_FAILURE', error: { message: 'error' } })).toBe(null)
    })
    it('should handle DELETE_CONTENT_FAILURE', () => {
      expect(Reducers.childrenerror(null, { type: 'DELETE_CONTENT_FAILURE', error: { message: 'error' } })).toBe(null)
    })
    it('should handle CHECKIN_CONTENT_FAILURE', () => {
      expect(Reducers.childrenerror(null, { type: 'CHECKIN_CONTENT_FAILURE', error: { message: 'error' } })).toBe(null)
    })
    it('should handle CHECKOUT_CONTENT_FAILURE', () => {
      expect(Reducers.childrenerror(null, { type: 'CHECKOUT_CONTENT_FAILURE', error: { message: 'error' } })).toBe(null)
    })
    it('should handle PUBLISH_CONTENT_FAILURE', () => {
      expect(Reducers.childrenerror(null, { type: 'PUBLISH_CONTENT_FAILURE', error: { message: 'error' } })).toBe(null)
    })
    it('should handle APPROVE_CONTENT_FAILURE', () => {
      expect(Reducers.childrenerror(null, { type: 'APPROVE_CONTENT_FAILURE', error: { message: 'error' } })).toBe(null)
    })
    it('should handle REJECT_CONTENT_FAILURE', () => {
      expect(Reducers.childrenerror(null, { type: 'REJECT_CONTENT_FAILURE', error: { message: 'error' } })).toBe(null)
    })
    it('should handle UNDOCHECKOUT_CONTENT_FAILURE', () => {
      expect(Reducers.childrenerror(null, { type: 'UNDOCHECKOUT_CONTENT_FAILURE', error: { message: 'error' } })).toBe(
        null,
      )
    })
    it('should handle FORCEUNDOCHECKOUT_CONTENT_FAILURE', () => {
      expect(
        Reducers.childrenerror(null, { type: 'FORCEUNDOCHECKOUT_CONTENT_FAILURE', error: { message: 'error' } }),
      ).toBe(null)
    })
    it('should handle RESTOREVERSION_CONTENT_FAILURE', () => {
      expect(
        Reducers.childrenerror(null, { type: 'RESTOREVERSION_CONTENT_FAILURE', error: { message: 'error' } }),
      ).toBe(null)
    })
    it('should handle FETCH_CONTENT', () => {
      expect(Reducers.childrenerror(null, { type: 'FETCH_CONTENT', result: null })).toBe(null)
    })
    it('should handle FETCH_CONTENT_SUCCESS', () => {
      expect(Reducers.childrenerror(null, { type: 'FETCH_CONTENT_SUCCESS', result: null })).toBe(null)
    })
    it('should handle CREATE_CONTENT', () => {
      expect(Reducers.childrenerror(null, { type: 'CREATE_CONTENT', result: null })).toBe(null)
    })
    it('should handle CREATE_CONTENT_SUCCESS', () => {
      expect(Reducers.childrenerror(null, { type: 'CREATE_CONTENT_SUCCESS', result: null })).toBe(null)
    })
    it('should handle UPDATE_CONTENT', () => {
      expect(Reducers.childrenerror(null, { type: 'UPDATE_CONTENT', result: null })).toBe(null)
    })
    it('should handle UPDATE_CONTENT_SUCCESS', () => {
      expect(Reducers.childrenerror(null, { type: 'UPDATE_CONTENT_SUCCESS', result: null })).toBe(null)
    })
    it('should handle DELETE_CONTENT', () => {
      expect(Reducers.childrenerror(null, { type: 'DELETE_CONTENT', result: null })).toBe(null)
    })
    it('should handle DELETE_CONTENT_SUCCESS', () => {
      expect(Reducers.childrenerror(null, { type: 'DELETE_CONTENT_SUCCESS', result: null })).toBe(null)
    })
    it('should handle CHECKIN_CONTENT', () => {
      expect(Reducers.childrenerror(null, { type: 'CHECKIN_CONTENT', result: null })).toBe(null)
    })
    it('should handle CHECKIN_CONTENT_SUCCESS', () => {
      expect(Reducers.childrenerror(null, { type: 'CHECKIN_CONTENT_SUCCESS', result: null })).toBe(null)
    })
    it('should handle CHECKOUT_CONTENT', () => {
      expect(Reducers.childrenerror(null, { type: 'CHECKOUT_CONTENT', result: null })).toBe(null)
    })
    it('should handle CHECKOUT_CONTENT_SUCCESS', () => {
      expect(Reducers.childrenerror(null, { type: 'CHECKOUT_CONTENT_SUCCESS', result: null })).toBe(null)
    })
    it('should handle APPROVE_CONTENT', () => {
      expect(Reducers.childrenerror(null, { type: 'APPROVE_CONTENT', result: null })).toBe(null)
    })
    it('should handle APPROVE_CONTENT_SUCCESS', () => {
      expect(Reducers.childrenerror(null, { type: 'APPROVE_CONTENT_SUCCESS', result: null })).toBe(null)
    })
    it('should handle PUBLISH_CONTENT', () => {
      expect(Reducers.childrenerror(null, { type: 'PUBLISH_CONTENT', result: null })).toBe(null)
    })
    it('should handle PUBLISH_CONTENT_SUCCESS', () => {
      expect(Reducers.childrenerror(null, { type: 'PUBLISH_CONTENT_SUCCESS', result: null })).toBe(null)
    })
    it('should handle REJECT_CONTENT', () => {
      expect(Reducers.childrenerror(null, { type: 'REJECT_CONTENT', result: null })).toBe(null)
    })
    it('should handle REJECT_CONTENT_SUCCESS', () => {
      expect(Reducers.childrenerror(null, { type: 'REJECT_CONTENT_SUCCESS', result: null })).toBe(null)
    })
    it('should handle UNDOCHECKOUT_CONTENT', () => {
      expect(Reducers.childrenerror(null, { type: 'UNDOCHECKOUT_CONTENT', result: null })).toBe(null)
    })
    it('should handle UNDOCHECKOUT_CONTENT_SUCCESS', () => {
      expect(Reducers.childrenerror(null, { type: 'UNDOCHECKOUT_CONTENT_SUCCESS', result: null })).toBe(null)
    })
    it('should handle FORCEUNDOCHECKOUT_CONTENT', () => {
      expect(Reducers.childrenerror(null, { type: 'FORCEUNDOCHECKOUT_CONTENT', result: null })).toBe(null)
    })
    it('should handle FORCEUNDOCHECKOUT_CONTENT_SUCCESS', () => {
      expect(Reducers.childrenerror(null, { type: 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS', result: null })).toBe(null)
    })
    it('should handle RESTOREVERSION_CONTENT', () => {
      expect(Reducers.childrenerror(null, { type: 'RESTOREVERSION_CONTENT', result: null })).toBe(null)
    })
    it('should handle RESTOREVERSION_CONTENT_SUCCESS', () => {
      expect(Reducers.childrenerror(null, { type: 'RESTOREVERSION_CONTENT_SUCCESS', result: null })).toBe(null)
    })
  })
  describe('childrenactions reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.childrenactions(undefined, defaultAction)).toEqual([])
    })
    it('should handle REQUEST_CONTENT_ACTIONS_SUCCESS', () => {
      const action = {
        type: 'REQUEST_CONTENT_ACTIONS_SUCCESS',
        result: [
          {
            ActionName: 'Rename',
          },
        ],
      }
      expect(Reducers.childrenactions(undefined, action)).toEqual([{ ActionName: 'Rename' }])
    })
  })
  describe('isOpened reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.isOpened(undefined, defaultAction)).toBe(null)
    })
    it('should return 1', () => {
      const action = {
        type: 'REQUEST_CONTENT_ACTIONS_SUCCESS',
        id: 1,
      }
      expect(Reducers.isOpened(undefined, action)).toBe(1)
    })
  })
  describe('isSaved reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.isSaved(undefined, defaultAction)).toEqual(true)
    })
    it('should return false', () => {
      expect(Reducers.isSaved(undefined, { type: 'CREATE_CONTENT' })).toEqual(false)
    })
    it('should return false', () => {
      expect(Reducers.isSaved(undefined, { type: 'CREATE_CONTENT_FAILURE' })).toEqual(false)
    })
    it('should return false', () => {
      expect(Reducers.isSaved(undefined, { type: 'UPDATE_CONTENT' })).toEqual(false)
    })
    it('should return false', () => {
      expect(Reducers.isSaved(undefined, { type: 'UPDATE_CONTENT_FAILURE' })).toEqual(false)
    })
    it('should return false', () => {
      expect(Reducers.isSaved(undefined, { type: 'LOAD_CONTENT' })).toEqual(false)
    })
    it('should return false', () => {
      expect(Reducers.isSaved(undefined, { type: 'LOAD_CONTENT_FAILURE' })).toEqual(false)
    })
  })
  describe('isValid reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.isValid(undefined, defaultAction)).toEqual(true)
    })
  })
  describe('isDirty reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.isDirty(undefined, defaultAction)).toEqual(false)
    })
  })
  describe('isOperationInProgress reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.isOperationInProgress(undefined, defaultAction)).toEqual(false)
    })
    it('should return true', () => {
      expect(Reducers.isOperationInProgress(undefined, { type: 'CREATE_CONTENT_LOADING' })).toEqual(true)
    })
    it('should return true', () => {
      expect(Reducers.isOperationInProgress(undefined, { type: 'UPDATE_CONTENT_LOADING' })).toEqual(true)
    })
    it('should return true', () => {
      expect(Reducers.isOperationInProgress(undefined, { type: 'DELETE_CONTENT_LOADING' })).toEqual(true)
    })
  })
  describe('contenterror reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.contenterror(undefined, defaultAction)).toBe(null)
    })
    it('should handle FETCH_CONTENT_FAILURE', () => {
      expect(Reducers.contenterror(null, { type: 'FETCH_CONTENT_FAILURE', error: { message: 'error' } })).toBe(null)
    })
    it('should handle CREATE_CONTENT_FAILURE', () => {
      expect(Reducers.contenterror(null, { type: 'CREATE_CONTENT_FAILURE', error: { message: 'error' } })).toBe('error')
    })
    it('should handle UPDATE_CONTENT_FAILURE', () => {
      expect(Reducers.contenterror(null, { type: 'UPDATE_CONTENT_FAILURE', error: { message: 'error' } })).toBe('error')
    })
    it('should handle DELETE_CONTENT_FAILURE', () => {
      expect(Reducers.contenterror(null, { type: 'DELETE_CONTENT_FAILURE', error: { message: 'error' } })).toBe('error')
    })
    it('should handle CHECKIN_CONTENT_FAILURE', () => {
      expect(Reducers.contenterror(null, { type: 'CHECKIN_CONTENT_FAILURE', error: { message: 'error' } })).toBe(
        'error',
      )
    })
    it('should handle CHECKOUT_CONTENT_FAILURE', () => {
      expect(Reducers.contenterror(null, { type: 'CHECKOUT_CONTENT_FAILURE', error: { message: 'error' } })).toBe(
        'error',
      )
    })
    it('should handle PUBLISH_CONTENT_FAILURE', () => {
      expect(Reducers.contenterror(null, { type: 'PUBLISH_CONTENT_FAILURE', error: { message: 'error' } })).toBe(
        'error',
      )
    })
    it('should handle APPROVE_CONTENT_FAILURE', () => {
      expect(Reducers.contenterror(null, { type: 'APPROVE_CONTENT_FAILURE', error: { message: 'error' } })).toBe(
        'error',
      )
    })
    it('should handle REJECT_CONTENT_FAILURE', () => {
      expect(Reducers.contenterror(null, { type: 'REJECT_CONTENT_FAILURE', error: { message: 'error' } })).toBe('error')
    })
    it('should handle UNDOCHECKOUT_CONTENT_FAILURE', () => {
      expect(Reducers.contenterror(null, { type: 'UNDOCHECKOUT_CONTENT_FAILURE', error: { message: 'error' } })).toBe(
        'error',
      )
    })
    it('should handle FORCEUNDOCHECKOUT_CONTENT_FAILURE', () => {
      expect(
        Reducers.contenterror(null, { type: 'FORCEUNDOCHECKOUT_CONTENT_FAILURE', error: { message: 'error' } }),
      ).toBe('error')
    })
    it('should handle RESTOREVERSION_CONTENT_FAILURE', () => {
      expect(Reducers.contenterror(null, { type: 'RESTOREVERSION_CONTENT_FAILURE', error: { message: 'error' } })).toBe(
        'error',
      )
    })
    it('should handle FETCH_CONTENT', () => {
      expect(Reducers.contenterror(null, { type: 'FETCH_CONTENT' })).toBe(null)
    })
    it('should handle FETCH_CONTENT_SUCCESS', () => {
      expect(Reducers.contenterror(null, { type: 'FETCH_CONTENT_SUCCESS' })).toBe(null)
    })
    it('should handle CREATE_CONTENT', () => {
      expect(Reducers.contenterror(null, { type: 'CREATE_CONTENT' })).toBe(null)
    })
    it('should handle CREATE_CONTENT_SUCCESS', () => {
      expect(Reducers.contenterror(null, { type: 'CREATE_CONTENT_SUCCESS' })).toBe(null)
    })
    it('should handle UPDATE_CONTENT', () => {
      expect(Reducers.contenterror(null, { type: 'UPDATE_CONTENT' })).toBe(null)
    })
    it('should handle UPDATE_CONTENT_SUCCESS', () => {
      expect(Reducers.contenterror(null, { type: 'UPDATE_CONTENT_SUCCESS' })).toBe(null)
    })
    it('should handle DELETE_CONTENT', () => {
      expect(Reducers.contenterror(null, { type: 'DELETE_CONTENT' })).toBe(null)
    })
    it('should handle DELETE_CONTENT_SUCCESS', () => {
      expect(Reducers.contenterror(null, { type: 'DELETE_CONTENT_SUCCESS' })).toBe(null)
    })
    it('should handle CHECKIN_CONTENT', () => {
      expect(Reducers.contenterror(null, { type: 'CHECKIN_CONTENT' })).toBe(null)
    })
    it('should handle CHECKIN_CONTENT_SUCCESS', () => {
      expect(Reducers.contenterror(null, { type: 'CHECKIN_CONTENT_SUCCESS' })).toBe(null)
    })
    it('should handle CHECKOUT_CONTENT', () => {
      expect(Reducers.contenterror(null, { type: 'CHECKOUT_CONTENT' })).toBe(null)
    })
    it('should handle CHECKOUT_CONTENT_SUCCESS', () => {
      expect(Reducers.contenterror(null, { type: 'CHECKOUT_CONTENT_SUCCESS' })).toBe(null)
    })
    it('should handle APPROVE_CONTENT', () => {
      expect(Reducers.contenterror(null, { type: 'APPROVE_CONTENT' })).toBe(null)
    })
    it('should handle APPROVE_CONTENT_SUCCESS', () => {
      expect(Reducers.contenterror(null, { type: 'APPROVE_CONTENT_SUCCESS' })).toBe(null)
    })
    it('should handle PUBLISH_CONTENT', () => {
      expect(Reducers.contenterror(null, { type: 'PUBLISH_CONTENT' })).toBe(null)
    })
    it('should handle PUBLISH_CONTENT_SUCCESS', () => {
      expect(Reducers.contenterror(null, { type: 'PUBLISH_CONTENT_SUCCESS' })).toBe(null)
    })
    it('should handle REJECT_CONTENT', () => {
      expect(Reducers.contenterror(null, { type: 'REJECT_CONTENT' })).toBe(null)
    })
    it('should handle REJECT_CONTENT_SUCCESS', () => {
      expect(Reducers.contenterror(null, { type: 'REJECT_CONTENT_SUCCESS' })).toBe(null)
    })
    it('should handle UNDOCHECKOUT_CONTENT', () => {
      expect(Reducers.contenterror(null, { type: 'UNDOCHECKOUT_CONTENT' })).toBe(null)
    })
    it('should handle UNDOCHECKOUT_CONTENT_SUCCESS', () => {
      expect(Reducers.contenterror(null, { type: 'UNDOCHECKOUT_CONTENT_SUCCESS' })).toBe(null)
    })
    it('should handle FORCEUNDOCHECKOUT_CONTENT', () => {
      expect(Reducers.contenterror(null, { type: 'FORCEUNDOCHECKOUT_CONTENT' })).toBe(null)
    })
    it('should handle FORCEUNDOCHECKOUT_CONTENT_SUCCESS', () => {
      expect(Reducers.contenterror(null, { type: 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS' })).toBe(null)
    })
    it('should handle RESTOREVERSION_CONTENT', () => {
      expect(Reducers.contenterror(null, { type: 'RESTOREVERSION_CONTENT' })).toBe(null)
    })
    it('should handle RESTOREVERSION_CONTENT_SUCCESS', () => {
      expect(Reducers.contenterror(null, { type: 'RESTOREVERSION_CONTENT_SUCCESS' })).toBe(null)
    })
    it('should handle FETCH_CONTENT_PENDING', () => {
      expect(Reducers.contenterror(null, { type: 'FETCH_CONTENT_PENDING' })).toBe(null)
    })
  })
  describe('contentactions reducer', () => {
    const action = {
      type: 'LOAD_CONTENT_ACTIONS_SUCCESS',
      result: {
        d: {
          Actions: [{ Name: 'aaa' } as ActionModel, { Name: 'bbb' } as ActionModel] as ActionModel[],
        },
      },
    }
    it('should return the initial state', () => {
      expect(Reducers.contentactions(undefined, defaultAction)).toEqual([])
    })
    it('should return an array with actions', () => {
      expect(Reducers.contentactions(undefined, action)).toEqual([{ Name: 'aaa' }, { Name: 'bbb' }])
    })
  })
  describe('fields reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.fields(undefined, defaultAction)).toEqual({})
    })
    it('should return an empty object', () => {
      const content = {
        Path: '/Root/Sites/Default_Site/tasks',
        Status: Status.active,
      }
      const action = {
        type: 'LOAD_CONTENT_SUCCESS',
        payload: content,
      }
      expect(Reducers.fields({}, action)).toEqual({})
    })
    it('should return changed fields of the content', () => {
      const action = {
        type: 'CHANGE_FIELD_VALUE',
        name: 'Name',
        value: 'aaa',
      }
      expect(Reducers.fields({}, action)).toEqual({
        Name: 'aaa',
      })
    })
  })
  describe('schema reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.schema(undefined, defaultAction as any)).toEqual(null)
    })
    it('should return schema of the given content type', () => {
      const action = {
        type: 'GET_SCHEMA_SUCCESS',
        result: { Icon: 'FormItem' },
      }
      expect(Reducers.schema(undefined, action as any)).toEqual({
        Icon: 'FormItem',
      })
    })
  })
  describe('content reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.fields(undefined, defaultAction)).toEqual({})
    })
    it('should return a content', () => {
      const content = {
        Path: '/Root/Sites/Default_Site/tasks',
        Status: Status.active,
      }
      const action = {
        type: 'LOAD_CONTENT_SUCCESS',
        result: { d: content },
      }
      expect(Reducers.content(undefined, action)).toEqual(content)
    })
  })
  describe('selected reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.selectedIds(undefined, defaultAction)).toEqual([])
    })
    it('should return an array with one item with the id 1', () => {
      const content = {
        Path: '/Root/Sites/Default_Site/tasks',
        Status: Status.active,
        Id: 1,
      }
      const action = {
        type: 'SELECT_CONTENT',
        content,
      }
      expect(Reducers.selectedIds(undefined, action)).toEqual([1])
    })
    it('should return an array with two items with the id 1 and 2', () => {
      const content = {
        Path: '/Root/Sites/Default_Site/tasks',
        Status: Status.active,
        Id: 2,
      }
      const action = {
        type: 'SELECT_CONTENT',
        content,
      }
      expect(Reducers.selectedIds([1], action)).toEqual([1, 2])
    })
    it('should return an array with one item with the id 1', () => {
      const content = {
        Path: '/Root/Sites/Default_Site/tasks',
        Status: Status.active,
        Id: 2,
      }
      const action = {
        type: 'DESELECT_CONTENT',
        content,
      }
      expect(Reducers.selectedIds([1, 2], action)).toEqual([1])
    })
    it('should return an empty array', () => {
      const content = {
        Path: '/Root/Sites/Default_Site/tasks',
        Status: Status.active,
        Id: 1,
      }
      const action = {
        type: 'DESELECT_CONTENT',
        content,
      }
      expect(Reducers.selectedIds([1], action)).toEqual([])
    })
    it('should return an empty array', () => {
      const action = {
        type: 'CLEAR_SELECTION',
      }
      expect(Reducers.selectedIds([1], action)).toEqual([])
    })
  })
  describe('selectedContent reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.selectedContentItems(undefined, defaultAction)).toEqual({})
    })
    it('should return an object with one currentitems item with the id 1', () => {
      const content = {
        Path: '/Root/Sites/Default_Site/tasks',
        Status: Status.active,
        Id: 1,
      }
      const action = {
        type: 'SELECT_CONTENT',
        content,
      }
      expect(Reducers.selectedContentItems(undefined, action)).toEqual({ 1: content })
    })
    it('should return an object with two items with the id 1 and 2', () => {
      const entities = {
        1: {
          Id: 1,
          DisplayName: 'Some Article',
          Status: ['Active'],
        },
      }
      const content = {
        Path: '/Root/Sites/Default_Site/tasks',
        Status: Status.active,
        Id: 2,
      }
      const action = {
        type: 'SELECT_CONTENT',
        content,
      }
      expect(Reducers.selectedContentItems(entities, action)).toEqual({
        1: {
          Id: 1,
          DisplayName: 'Some Article',
          Status: ['Active'],
        },
        2: content,
      })
    })
    it('should return an object with one item with the id 1', () => {
      const entities = {
        1: {
          Id: 1,
          DisplayName: 'Some Article',
          Status: ['Active'],
        },
        2: {
          Id: 2,
          DisplayName: 'Some Article',
          Status: ['Active'],
        },
      }
      const content = {
        Path: '/Root/Sites/Default_Site/tasks',
        Status: Status.active,
        Id: 2,
      }
      const action = {
        type: 'DESELECT_CONTENT',
        content,
      }
      expect(Reducers.selectedContentItems(entities, action)).toEqual({
        1: {
          Id: 1,
          DisplayName: 'Some Article',
          Status: ['Active'],
        },
      })
    })
    it('should return an empty object', () => {
      const entities = {
        1: {
          Id: 1,
          DisplayName: 'Some Article',
          Status: ['Active'],
        },
      }
      const content = {
        Path: '/Root/Sites/Default_Site/tasks',
        Status: Status.active,
        Id: 1,
      }
      const action = {
        type: 'DESELECT_CONTENT',
        content,
      }
      expect(Reducers.selectedContentItems(entities, action)).toEqual({})
    })
    it('should return an empty object', () => {
      const entities = {
        1: {
          Id: 1,
          DisplayName: 'Some Article',
          Status: ['Active'],
        },
      }
      const action = {
        type: 'CLEAR_SELECTION',
      }
      expect(Reducers.selectedContentItems(entities, action)).toEqual({})
    })
  })
  describe('batchResponseError reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.batchResponseError(undefined, defaultAction)).toEqual('')
    })
    it('should return an error message', () => {
      const action = {
        type: 'DELETE_BATCH_FAILURE',
        error: {
          message: 'error',
        },
      }
      expect(Reducers.batchResponseError(undefined, action)).toEqual('error')
    })
    it('should return an error message', () => {
      const action = {
        type: 'MOVE_BATCH_FAILURE',
        error: {
          message: 'error',
        },
      }
      expect(Reducers.batchResponseError(undefined, action)).toEqual('error')
    })
    it('should return an empty string', () => {
      const action = {
        type: 'MOVE_BATCH_SUCCESS',
        payload: {},
      }
      expect(Reducers.batchResponseError(undefined, action)).toEqual('')
    })
  })
  describe('OdataBatchResponse reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.odataBatchResponse(undefined, defaultAction)).toEqual(null)
    })
    it('should return a response object', () => {
      const action = {
        type: 'DELETE_BATCH_SUCCESS',
        result: {
          vmi: '1',
        },
      }
      expect(Reducers.odataBatchResponse(undefined, action)).toEqual({
        vmi: '1',
      })
    })
    it('should return an error message', () => {
      const action = {
        type: 'COPY_BATCH_SUCCESS',
        result: {
          vmi: '1',
        },
      }
      expect(Reducers.odataBatchResponse(undefined, action)).toEqual({
        vmi: '1',
      })
    })
    it('should return null by default', () => {
      const action = {
        type: 'MOVE_BATCH_FAILURE',
        error: 'error',
      }
      expect(Reducers.odataBatchResponse(undefined, action)).toEqual(null)
    })
  })
  describe('options reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.options(undefined, defaultAction)).toBe(null)
    })
    it('should return the given option object', () => {
      const options = {
        top: 0,
        skip: 0,
      } as ODataParams<GenericContent>
      expect(Reducers.options(undefined, { type: 'SET_ODATAOPTIONS', options })).toEqual({ top: 0, skip: 0 })
    })
  })
  describe('currentworkspace reducer', () => {
    it('should return the initial state', () => {
      expect(Reducers.currentworkspace(undefined, defaultAction)).toEqual(null)
    })
    it('should return the given Workspace object', () => {
      expect(
        Reducers.currentworkspace(undefined, {
          type: 'LOAD_CONTENT_SUCCESS',
          result: {
            d: {
              Workspace: {
                Id: 1,
              } as Workspace,
            },
          },
        }),
      ).toEqual({ Id: 1 })
    })
  })
  describe('getContent', () => {
    const state = {
      entities: {
        collection: {
          5145: {
            Id: 5145,
            DisplayName: 'Some Article',
            Status: ['Active'],
          },
          5146: {
            Id: 5146,
            Displayname: 'Other Article',
            Status: ['Completed'],
          },
        },
      },
    }
    it('should return the content from the state by the given id', () => {
      expect(Reducers.getContent(state.entities.collection as any, 5145)).toEqual({
        Id: 5145,
        DisplayName: 'Some Article',
        Status: ['Active'],
      })
    })
  })

  describe('repository reducer', () => {
    const repository = new Repository({}, async () => ({ ok: true } as any))
    it('should return the initial state', () => {
      expect(Reducers.repository(undefined, {} as any)).toEqual(null)
    })
    it('should return the repository config', () => {
      expect(
        Reducers.repository(null, { type: 'LOAD_REPOSITORY', repository: repository.configuration as any }),
      ).toEqual(repository.configuration)
    })
  })

  describe('getIds', () => {
    const state = {
      ids: [5145, 5146],
    }
    it('should return the id array from the current state', () => {
      expect(Reducers.getIds(state)).toEqual([5145, 5146])
    })
  })

  describe('getFetching', () => {
    const state = {
      ids: [5145, 5146],
      isFetching: false,
    }
    it('should return the value of isFetching from the current state', () => {
      expect(Reducers.getFetching(state)).toBe(false)
    })
  })

  describe('getError', () => {
    const state = {
      ids: [5145, 5146],
      isFetching: false,
      error: 'error',
    }
    it('should return the value of errorMessage from the current state', () => {
      expect(Reducers.getError(state)).toBe('error')
    })
  })

  describe('getAuthenticationStatus', () => {
    const state = {
      session: {
        loginState: LoginState.Authenticated,
      },
    }
    it('should return true if the user is authenticated state', () => {
      expect(Reducers.getAuthenticationStatus(state as any)).toBe(LoginState.Authenticated)
    })
  })

  describe('getAuthenticationError', () => {
    const state = {
      session: {
        error: 'error',
      },
    }
    it('should return the value of errorMessage from the current state', () => {
      expect(Reducers.getAuthenticationError(state as any)).toBe('error')
    })
  })
  describe('getRepositoryUrl', () => {
    const state = {
      session: {
        repository: {
          repositoryUrl: 'https://dmsservice.demo.sensenet.com',
        },
      },
    }
    it('should return the value of RepositoryUrl from the current state', () => {
      expect(Reducers.getRepositoryUrl(state as any)).toBe('https://dmsservice.demo.sensenet.com')
    })
  })
  describe('getSelectedContentIds', () => {
    const state = {
      selected: {
        ids: [1, 2],
        entities: {
          1: {
            DisplaName: 'aaa',
            Id: 1,
          },
          2: {
            DisplaName: 'bbb',
            Id: 2,
          },
        },
      },
    }
    it('should return the value of the selected reducers current state, an array with two items', () => {
      expect(Reducers.getSelectedContentIds(state as any)).toEqual([1, 2])
    })
  })
  describe('getSelectedContentItems', () => {
    const state = {
      selected: {
        ids: [1, 2],
        entities: {
          1: {
            DisplaName: 'aaa',
            Id: 1,
          },
          2: {
            DisplaName: 'bbb',
            Id: 2,
          },
        },
      },
    }
    it('should return the value of the selected reducers current state, an array with two items', () => {
      expect(Reducers.getSelectedContentItems(state as any)).toEqual({
        1: {
          DisplaName: 'aaa',
          Id: 1,
        },
        2: {
          DisplaName: 'bbb',
          Id: 2,
        },
      })
    })
  })
  describe('getOpenedContentId', () => {
    const state = {
      isOpened: 1,
    }
    it('should return 1 as the opened items id', () => {
      expect(Reducers.getOpenedContent(state as any)).toBe(1)
    })
  })
  describe('getChildrenActions', () => {
    const state = {
      actions: [
        {
          ActionName: 'Rename',
        },
      ],
    }
    it('should return 1 as the opened items id', () => {
      expect(Reducers.getChildrenActions(state as any)).toEqual([{ ActionName: 'Rename' }])
    })
  })
  describe('getCurrentContent', () => {
    const state = {
      currentcontent: {
        content: {
          DisplayName: 'my content',
        },
      },
    }
    it('should return the content', () => {
      expect(Reducers.getCurrentContent(state as any)).toEqual({ DisplayName: 'my content' })
    })
  })
  describe('getChildren', () => {
    const state = {
      entities: {
        5145: {
          Id: 5145,
          DisplayName: 'Some Article',
          Status: ['Active'],
        },
        5146: {
          Id: 5146,
          Displayname: 'Other Article',
          Status: ['Completed'],
        },
      },
    }
    it('should return the currentitems object', () => {
      expect(Reducers.getChildren(state as any)).toEqual({
        5145: {
          Id: 5145,
          DisplayName: 'Some Article',
          Status: ['Active'],
        },
        5146: {
          Id: 5146,
          Displayname: 'Other Article',
          Status: ['Completed'],
        },
      })
    })
  })
  describe('getFields', () => {
    const state = {
      currentcontent: {
        fields: {
          Name: 'aaa',
        },
      },
    }
    it('should return the list of the fields that were changed', () => {
      expect(Reducers.getFields(state as any)).toEqual({
        Name: 'aaa',
      })
    })
  })
  describe('getSchema', () => {
    const state = {
      currentcontent: {
        schema: {
          Name: 'aaa',
        },
      },
    }
    it('should return the schema of the current content', () => {
      expect(Reducers.getSchema(state as any)).toEqual({
        Name: 'aaa',
      })
    })
  })
})
