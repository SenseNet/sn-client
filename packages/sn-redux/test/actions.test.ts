import { GoogleOauthProvider } from '@sensenet/authentication-google'
import { JwtService } from '@sensenet/authentication-jwt'
import {
  Content,
  LoginState,
  ODataBatchResponse,
  ODataCollectionResponse,
  ODataResponse,
  ODataSharingResponse,
  Repository,
  SharingLevel,
  SharingMode,
} from '@sensenet/client-core'
import { ActionModel, GenericContent, Task, User } from '@sensenet/default-content-types'
import * as Actions from '../src/Actions'

const jwtMockResponse = {
  ok: true,
  status: 200,
  json: async () => {
    return {
      access:
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzZW5zZW5ldC10b2tlbi1zZXJ2aWNlIiwic3ViIjoic2Vuc2VuZXQiLCJhdWQiOiJjbGllbnQiLCJleHAiOjE1MTk4MzM0MDQsImlhdCI6MTUxOTgzMzEwNCwibmJmIjoxNTE5ODMzMTA0LCJuYW1lIjoiUHVibGljXFxhbGJhQHNlbnNlbmV0LmNvbSIsImp0aSI6ImUyMTgyOGQxOWVlMjQwNDM4MTAzMTZhMjkwZjQ3YzkxIn0',
      refresh:
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzZW5zZW5ldC10b2tlbi1zZXJ2aWNlIiwic3ViIjoic2Vuc2VuZXQiLCJhdWQiOiJjbGllbnQiLCJleHAiOjE1MTk5MTk4MDQsImlhdCI6MTUxOTgzMzEwNCwibmJmIjoxNTE5ODMzNDA0LCJuYW1lIjoiUHVibGljXFxhbGJhQHNlbnNlbmV0LmNvbSIsImp0aSI6IjgzZDZmNzA0NjNmNTQ4YWZhN2U4ZDAxMmIyMGRiYzRiIn0',
    }
  },
} as Response

const repository = new Repository({ repositoryUrl: 'https://dev.demo.sensenet.com/' }, async () => jwtMockResponse)

export const _jwtService = new JwtService(repository)

const collectionMockResponse = {
  ok: true,
  status: 200,
  json: async () => {
    return {
      d: {
        results: [],
      },
    }
  },
} as Response

const contentMockResponse = {
  ok: true,
  status: 200,
  json: async () => {
    return {
      d: {
        Name: 'DefaultSite',
      },
    }
  },
} as Response

const actionsMockResponse = {
  ok: true,
  status: 200,
  json: async () => {
    return {
      d: [],
    }
  },
} as Response

const uploadResponse = {
  ok: true,
  status: 200,
  json: async () => {
    return {
      Id: 4037,
      Length: 18431,
      Name: 'LICENSE',
      // eslint-disable-next-line @typescript-eslint/camelcase
      Thumbnail_url: '/Root/Sites/Default_Site/Workspace/Document_Library/LICENSE',
      Type: 'File',
      Url: '/Root/Sites/Default_Site/Workspace/Document_Library/LICENSE',
    }
  },
} as Response

const countResponse = {
  ok: true,
  status: 200,
  json: async () => {
    return 4
  },
}

const propertyResponse = {
  ok: true,
  status: 200,
  json: async () => {
    return {
      d: {
        DisplayName: 'Document Workspaces',
      },
    }
  },
}

const propertyValueResponse = {
  ok: true,
  status: 200,
  json: async () => {
    return 'Document Workspaces'
  },
}

const metadataResponse = {
  ok: true,
  status: 200,
  'content-type': 'application/xml; charset=utf-8',
}

const schemaResponse = {
  ok: true,
  status: 200,
  json: async () => {
    return [
      {
        ContentTypeName: 'ContentType',
        DisplayName: 'Content Type',
        Description: 'A content type is a reusable set of fields you want to apply to certain content.',
        Icon: 'ContentType',
        AllowIndexing: true,
        AllowIncrementalNaming: false,
        AllowedChildTypes: [],
        HandlerName: 'SenseNet.ContentRepository.Schema.ContentType',
        FieldSettings: [
          {
            Type: 'IntegerFieldSetting',
            Name: 'Id',
            FieldClassName: 'SenseNet.ContentRepository.Fields.IntegerField',
            DisplayName: 'Id',
            Description: 'A unique ID for the Content.',
            ReadOnly: true,
            Compulsory: false,
            OutputMethod: 0,
            Visible: false,
            VisibleBrowse: 1,
            VisibleEdit: 1,
            VisibleNew: 1,
            DefaultOrder: 0,
          },
        ],
      },
    ]
  },
} as Response

const sharingResponse = {
  ok: true,
  status: 200,
  json: async () => {
    return {
      Token: 'devdog@sensenet.com',
      Id: 11,
    }
  },
} as Response

const sharingEntriesResponse = {
  ok: true,
  status: 200,
  json: async () => {
    return {
      d: {
        results: [{ Token: 'devdog@sensenet.com' }, { Token: 'alba@sensenet.com' }],
      },
    }
  },
} as Response

const previewNumberResponse = {
  ok: true,
  status: 200,
  json: async () => {
    return 4
  },
} as Response

const emptyResponse = {
  ok: true,
  status: 200,
  json: async () => undefined,
} as Response

const previewCommentResponse = {
  ok: true,
  status: 200,
  json: async () => {
    return {
      id: '1234',
      createdBy: { Name: 'alba' } as User,
      page: 3,
      x: 100,
      y: 100,
      text: 'Lorem ipsum',
    }
  },
} as Response

const previewCommentsResponse = {
  ok: true,
  status: 200,
  json: async () => [
    {
      id: '1234',
      createdBy: { Name: 'alba' } as User,
      page: 3,
      x: 100,
      y: 100,
      text: 'Lorem ipsum',
    },
    {
      id: '5678',
      createdBy: { Name: 'devdog' } as User,
      page: 3,
      x: 100,
      y: 200,
      text: 'Dolor sit amet',
    },
  ],
} as Response

describe('Actions', () => {
  const path = '/workspaces/project'
  let repo: Repository
  beforeEach(() => {
    repo = new Repository({ repositoryUrl: 'https://dev.demo.sensenet.com/' }, async () => contentMockResponse)
  })
  describe('FetchContent', () => {
    beforeEach(() => {
      repo = new Repository({ repositoryUrl: 'https://dev.demo.sensenet.com/' }, async () => collectionMockResponse)
    })
    describe('Action types are types', () => {
      expect(Actions.requestContent(path, { scenario: '' }).type).toBe('FETCH_CONTENT')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.loadCollection() resolves', () => {
        let data: ODataCollectionResponse<GenericContent>
        let dataWithoutOptions: ODataCollectionResponse<GenericContent>
        let mockCollectionResponseData: ReturnType<typeof collectionMockResponse['json']>
        beforeEach(async () => {
          data = await Actions.requestContent(path, { scenario: '' }).payload(repo)
          dataWithoutOptions = await Actions.requestContent(path).payload(repo)
          mockCollectionResponseData = await collectionMockResponse.json()
        })
        it('should return a FETCH_CONTENT action', () => {
          expect(Actions.requestContent(path, { scenario: '' })).toHaveProperty('type', 'FETCH_CONTENT')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(mockCollectionResponseData)
        })
        it('should return mockdata without options attribute', async () => {
          expect(dataWithoutOptions).toEqual(mockCollectionResponseData)
        })
      })
    })
  })
  describe('LoadContent', () => {
    describe('Action types are types', () => {
      expect(Actions.loadContent(path, {}).type).toBe('LOAD_CONTENT')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.load() resolves', () => {
        let data: ODataResponse<Content>
        let dataWithoutOptions: ODataResponse<Content>
        let dataWithExpandUndefined: ODataResponse<Content>
        let dataWithStringExpand: ODataResponse<Content>
        let dataWithStringExpandWorkspace: ODataResponse<Content>
        let dataWithSelectWorkspace: ODataResponse<Content>
        const expectedResult = { d: { Name: 'DefaultSite' } }
        beforeEach(async () => {
          data = await Actions.loadContent(path, {}).payload(repo)
          dataWithoutOptions = await Actions.loadContent(path).payload(repo)
          dataWithExpandUndefined = await Actions.loadContent(path, { expand: undefined }).payload(repo)
          dataWithStringExpand = await Actions.loadContent(path, { expand: ['Owner'] }).payload(repo)
          dataWithStringExpandWorkspace = await Actions.loadContent(path, { expand: ['Workspace'] }).payload(repo)
          dataWithSelectWorkspace = await Actions.loadContent(path, { select: ['Workspace'] }).payload(repo)
        })
        it('should return a LOAD_CONTENT action', () => {
          expect(Actions.loadContent(path, {})).toHaveProperty('type', 'LOAD_CONTENT')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
        it('should return mockdata without options attribute', async () => {
          expect(dataWithoutOptions).toEqual(expectedResult)
        })
        it('should return mockdata', () => {
          expect(dataWithExpandUndefined).toEqual(expectedResult)
        })
        it('should return mockdata', () => {
          expect(dataWithStringExpand).toEqual(expectedResult)
        })
        it('should return mockdata', () => {
          expect(dataWithStringExpandWorkspace).toEqual(expectedResult)
        })
        it('should return mockdata', () => {
          expect(dataWithSelectWorkspace).toEqual(expectedResult)
        })
        it('should return LOAD_CONTENT action', () => {
          expect(Actions.loadContent(path, { expand: undefined })).toHaveProperty('type', 'LOAD_CONTENT')
        })
        it('should return LOAD_CONTENT action', () => {
          expect(Actions.loadContent(path, { expand: ['Owner'] })).toHaveProperty('type', 'LOAD_CONTENT')
        })
        it('should return LOAD_CONTENT action', () => {
          expect(Actions.loadContent(path, { expand: ['Workspace'] })).toHaveProperty('type', 'LOAD_CONTENT')
        })
      })
    })
  })
  describe('LoadContentActions', () => {
    beforeEach(() => {
      repo = new Repository({ repositoryUrl: 'https://dev.demo.sensenet.com/' }, async () => actionsMockResponse)
    })
    describe('Action types are types', () => {
      expect(Actions.loadContentActions(path).type).toBe('LOAD_CONTENT_ACTIONS')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.getActions() resolves', () => {
        let data: { d: { Actions: ActionModel[] } }
        const expectedResult = { d: [] }
        beforeEach(async () => {
          data = await Actions.loadContentActions(path).payload(repo)
        })
        it('should return a LOAD_CONTENT_ACTIONS action', () => {
          expect(Actions.loadContentActions(path)).toHaveProperty('type', 'LOAD_CONTENT_ACTIONS')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('CreateContent', () => {
    const content = { DisplayName: 'My content', Id: 123 } as Task

    describe('Action types are types', () => {
      expect(Actions.createContent(path, content, 'Task').type).toBe('CREATE_CONTENT')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.post() resolves', () => {
        let data: ODataResponse<Task>
        const expectedResult = { d: { Name: 'DefaultSite' } }
        beforeEach(async () => {
          data = await Actions.createContent(path, content, 'Task').payload(repo)
        })
        it('should return a CREATE_CONTENT action', () => {
          expect(Actions.createContent(path, content, 'Task')).toHaveProperty('type', 'CREATE_CONTENT')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('UpdateContent', () => {
    const content = { DisplayName: 'My content', Id: 123 } as Task

    describe('Action types are types', () => {
      expect(Actions.updateContent(content, content).type).toBe('UPDATE_CONTENT')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.patch() resolves', () => {
        let data: ODataResponse<Content>
        const expectedResult = { d: { Name: 'DefaultSite' } }
        beforeEach(async () => {
          data = await Actions.updateContent(content, content).payload(repo)
        })
        it('should return a UPDATE_CONTENT action', () => {
          expect(Actions.updateContent(content, content)).toHaveProperty('type', 'UPDATE_CONTENT')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('ResetContent', () => {
    const content = { DisplayName: 'My content', Id: 123 } as Task

    describe('Action types are types', () => {
      expect(Actions.resetContent(content, content).type).toBe('RESET_CONTENT')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.patch() resolves', () => {
        let data: ODataResponse<Content>
        const expectedResult = { d: { Name: 'DefaultSite' } }
        beforeEach(async () => {
          data = await Actions.resetContent(content, content).payload(repo)
        })
        it('should return a RESET_CONTENT action', () => {
          expect(Actions.resetContent(content, content)).toHaveProperty('type', 'RESET_CONTENT')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('DeleteContent', () => {
    describe('Action types are types', () => {
      expect(Actions.deleteContent(path, true).type).toBe('DELETE_CONTENT')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.delete() resolves', () => {
        let data: ODataBatchResponse<Content>
        const expectedResult = { d: { Name: 'DefaultSite' } }
        beforeEach(async () => {
          data = await Actions.deleteContent(path).payload(repo)
        })
        it('should return a DELETE_CONTENT action', () => {
          expect(Actions.deleteContent(path)).toHaveProperty('type', 'DELETE_CONTENT')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('DeleteBatchContent', () => {
    describe('Action types are types', () => {
      expect(Actions.deleteBatch([1, 2], true).type).toBe('DELETE_BATCH')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.delete() resolves', () => {
        let data: ODataBatchResponse<Content>
        const expectedResult = { d: { Name: 'DefaultSite' } }
        beforeEach(async () => {
          data = await Actions.deleteBatch([1, 2]).payload(repo)
        })
        it('should return a DELETE_BATCH action', () => {
          expect(Actions.deleteBatch([1, 2])).toHaveProperty('type', 'DELETE_BATCH')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('CopyContent', () => {
    describe('Action types are types', () => {
      expect(Actions.copyContent(path, '/workspaces').type).toBe('COPY_CONTENT')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.copy() resolves', () => {
        let data: ODataBatchResponse<Content>
        const expectedResult = { d: { Name: 'DefaultSite' } }
        beforeEach(async () => {
          data = await Actions.copyContent(path, '/workspaces').payload(repo)
        })
        it('should return a COPY_CONTENT action', () => {
          expect(Actions.copyContent(path, '/workspaces')).toHaveProperty('type', 'COPY_CONTENT')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('CopyBatchContent', () => {
    describe('Action types are types', () => {
      expect(Actions.copyBatch([path], '/workspaces').type).toBe('COPY_BATCH')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.copy() resolves', () => {
        let data: ODataBatchResponse<Content>
        const expectedResult = { d: { Name: 'DefaultSite' } }
        beforeEach(async () => {
          data = await Actions.copyBatch([path], '/workspaces').payload(repo)
        })
        it('should return a COPY_BATCH action', () => {
          expect(Actions.copyBatch([path], '/workspaces')).toHaveProperty('type', 'COPY_BATCH')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('MoveContent', () => {
    describe('Action types are types', () => {
      expect(Actions.moveContent(path, '/workspaces').type).toBe('MOVE_CONTENT')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.move() resolves', () => {
        let data: ODataBatchResponse<Content>
        const expectedResult = { d: { Name: 'DefaultSite' } }
        beforeEach(async () => {
          data = await Actions.moveContent(path, '/workspaces').payload(repo)
        })
        it('should return a MOVE_CONTENT action', () => {
          expect(Actions.moveContent(path, '/workspaces')).toHaveProperty('type', 'MOVE_CONTENT')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('MoveBatchContent', () => {
    describe('Action types are types', () => {
      expect(Actions.moveBatch([path], '/workspaces').type).toBe('MOVE_BATCH')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.move() resolves', () => {
        let data: ODataBatchResponse<Content>
        const expectedResult = { d: { Name: 'DefaultSite' } }
        beforeEach(async () => {
          data = await Actions.moveBatch([path], '/workspaces').payload(repo)
        })
        it('should return a MOVE_BATCH action', () => {
          expect(Actions.moveBatch([path], '/workspaces')).toHaveProperty('type', 'MOVE_BATCH')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('CheckoutContent', () => {
    describe('Action types are types', () => {
      expect(Actions.checkOut('/workspaces').type).toBe('CHECKOUT_CONTENT')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.versioning.checkout() resolves', () => {
        let data: ODataResponse<Content>
        const expectedResult = { d: { Name: 'DefaultSite' } }
        beforeEach(async () => {
          data = await Actions.checkOut('/workspaces').payload(repo)
        })
        it('should return a CHECKOUT_CONTENT action', () => {
          expect(Actions.checkOut('/workspaces')).toHaveProperty('type', 'CHECKOUT_CONTENT')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('CheckinContent', () => {
    describe('Action types are types', () => {
      expect(Actions.checkIn('/workspaces').type).toBe('CHECKIN_CONTENT')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.versioning.checkin() resolves', () => {
        let data: ODataResponse<Content>
        const expectedResult = { d: { Name: 'DefaultSite' } }
        beforeEach(async () => {
          data = await Actions.checkIn('/workspaces').payload(repo)
        })
        it('should return a CHECKIN_CONTENT action', () => {
          expect(Actions.checkIn('/workspaces')).toHaveProperty('type', 'CHECKIN_CONTENT')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('PublishContent', () => {
    describe('Action types are types', () => {
      expect(Actions.publish('/workspaces').type).toBe('PUBLISH_CONTENT')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.versioning.publish() resolves', () => {
        let data: ODataResponse<Content>
        const expectedResult = { d: { Name: 'DefaultSite' } }
        beforeEach(async () => {
          data = await Actions.publish('/workspaces').payload(repo)
        })
        it('should return a PUBLISH_CONTENT action', () => {
          expect(Actions.publish('/workspaces')).toHaveProperty('type', 'PUBLISH_CONTENT')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('ApproveContent', () => {
    describe('Action types are types', () => {
      expect(Actions.approve('/workspaces').type).toBe('APPROVE_CONTENT')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.versioning.approve() resolves', () => {
        let data: ODataResponse<Content>
        const expectedResult = { d: { Name: 'DefaultSite' } }
        beforeEach(async () => {
          data = await Actions.approve('/workspaces').payload(repo)
        })
        it('should return a APPROVE_CONTENT action', () => {
          expect(Actions.approve('/workspaces')).toHaveProperty('type', 'APPROVE_CONTENT')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('RejectContent', () => {
    describe('Action types are types', () => {
      expect(Actions.rejectContent('/workspaces').type).toBe('REJECT_CONTENT')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.versioning.reject() resolves', () => {
        let data: ODataResponse<Content>
        const expectedResult = { d: { Name: 'DefaultSite' } }
        beforeEach(async () => {
          data = await Actions.rejectContent('/workspaces').payload(repo)
        })
        it('should return a REJECT_CONTENT action', () => {
          expect(Actions.rejectContent('/workspaces')).toHaveProperty('type', 'REJECT_CONTENT')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('UndoCheckoutContent', () => {
    describe('Action types are types', () => {
      expect(Actions.undoCheckout('/workspaces').type).toBe('UNDOCHECKOUT_CONTENT')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.versioning.undoCheckout() resolves', () => {
        let data: ODataResponse<Content>
        const expectedResult = { d: { Name: 'DefaultSite' } }
        beforeEach(async () => {
          data = await Actions.undoCheckout('/workspaces').payload(repo)
        })
        it('should return a UNDOCHECKOUT_CONTENT action', () => {
          expect(Actions.undoCheckout('/workspaces')).toHaveProperty('type', 'UNDOCHECKOUT_CONTENT')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('ForceUndoCheckoutContent', () => {
    describe('Action types are types', () => {
      expect(Actions.forceUndoCheckout('/workspaces').type).toBe('FORCE_UNDOCHECKOUT_CONTENT')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.versioning.forceUndoCheckout() resolves', () => {
        let data: ODataResponse<Content>
        const expectedResult = { d: { Name: 'DefaultSite' } }
        beforeEach(async () => {
          data = await Actions.forceUndoCheckout('/workspaces').payload(repo)
        })
        it('should return a FORCE_UNDOCHECKOUT_CONTENT action', () => {
          expect(Actions.forceUndoCheckout('/workspaces')).toHaveProperty('type', 'FORCE_UNDOCHECKOUT_CONTENT')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('RestoreVersion', () => {
    describe('Action types are types', () => {
      expect(Actions.restoreVersion('/workspaces', '1').type).toBe('RESTOREVERSION_CONTENT')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.versioning.restoreVersion() resolves', () => {
        let data: ODataResponse<Content>
        const expectedResult = { d: { Name: 'DefaultSite' } }
        beforeEach(async () => {
          data = await Actions.restoreVersion('/workspaces', '1').payload(repo)
        })
        it('should return a RESTOREVERSION_CONTENT action', () => {
          expect(Actions.restoreVersion('/workspaces', '1')).toHaveProperty('type', 'RESTOREVERSION_CONTENT')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('loginStateChanged', () => {
    it('should return the current authentication state', () => {
      const expectedAction = {
        type: 'USER_LOGIN_STATE_CHANGED',
        loginState: LoginState.Unauthenticated,
      }
      expect(Actions.loginStateChanged(LoginState.Unauthenticated)).toEqual(expectedAction)
    })
  })
  describe('UserChanged', () => {
    it('should return the user changed action', () => {
      const user = { Name: 'alba' } as User
      const expectedAction = {
        type: 'USER_CHANGED',
        user,
      }
      expect(Actions.userChanged(user)).toEqual(expectedAction)
    })
  })
  describe('UserLogin', () => {
    describe('Action types are types', () => {
      expect(Actions.userLogin('alba', 'alba').type).toBe('USER_LOGIN')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.authentication.login() resolves', () => {
        let data: boolean
        beforeEach(async () => {
          data = await Actions.userLogin('alba', 'alba').payload(repository)
        })
        it('should return a USER_LOGIN action', () => {
          expect(Actions.userLogin('alba', 'alba')).toHaveProperty('type', 'USER_LOGIN')
        })
        it('should return mockdata', () => {
          expect(data).toBeFalsy()
        })
      })
    })
  })
  describe('UserLoginGoogle', () => {
    const googleOauthProvider = {
      login: async () => true,
    } as GoogleOauthProvider
    it('should create an action to a user login with google', () => {
      expect(Actions.userLoginGoogle(googleOauthProvider).type).toBe('USER_LOGIN_GOOGLE')
    })
    describe('serviceChecks()', () => {
      describe('Given provider.login() resolves', () => {
        let data: boolean
        beforeEach(async () => {
          data = await Actions.userLoginGoogle(googleOauthProvider, 'gasgsdagsdagd.dgsgfshdfhs').payload()
        })
        it('should return a USER_LOGIN_GOOGLE action', () => {
          expect(Actions.userLoginGoogle(googleOauthProvider)).toHaveProperty('type', 'USER_LOGIN_GOOGLE')
        })
        it('should return mockdata', () => {
          expect(data).toBeTruthy()
        })
      })
    })
    describe('serviceChecks() false', () => {
      describe('Given provider.login() resolves', () => {
        const googleOauthProvider2 = {
          login: async () => false,
        } as GoogleOauthProvider
        let data: boolean
        beforeEach(async () => {
          data = await Actions.userLoginGoogle(googleOauthProvider2, 'gasgsdagsdagd.dgsgfshdfhs').payload()
        })
        it('should return a USER_LOGIN_GOOGLE action', () => {
          expect(Actions.userLoginGoogle(googleOauthProvider2)).toHaveProperty('type', 'USER_LOGIN_GOOGLE')
        })
        it('should return mockdata', () => {
          expect(data).toBeFalsy()
        })
      })
    })
  })
  describe('UserLogout', () => {
    describe('Action types are types', () => {
      expect(Actions.userLogout().type).toBe('USER_LOGOUT')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.authentication.logout() resolves', () => {
        let data: boolean
        beforeEach(async () => {
          data = await Actions.userLogout().payload(repository)
        })
        it('should return a USER_LOGOUT action', () => {
          expect(Actions.userLogout()).toHaveProperty('type', 'USER_LOGOUT')
        })
        it('should return mockdata', () => {
          expect(data).toBeTruthy()
        })
      })
    })
  })
  describe('LoadRepository', () => {
    it('should return the repository load action', () => {
      const expectedAction = {
        type: 'LOAD_REPOSITORY',
        repository: {},
      }
      expect(Actions.loadRepository({} as any)).toEqual(expectedAction)
    })
  })
  describe('SelectContent', () => {
    const content = { DisplayName: 'My content', Id: 1 } as Task
    it('should return the select content action', () => {
      const expectedAction = {
        type: 'SELECT_CONTENT',
        content,
      }
      expect(Actions.selectContent(content)).toEqual(expectedAction)
    })
  })
  describe('DeSelectContent', () => {
    const content = { DisplayName: 'My content', Id: 1 } as Task
    it('should return the deselect content action', () => {
      const expectedAction = {
        type: 'DESELECT_CONTENT',
        content,
      }
      expect(Actions.deSelectContent(content)).toEqual(expectedAction)
    })
  })
  describe('ClearSelection', () => {
    it('should return the clear selection action', () => {
      const expectedAction = {
        type: 'CLEAR_SELECTION',
      }
      expect(Actions.clearSelection()).toEqual(expectedAction)
    })
  })
  describe('UploadContent', () => {
    beforeEach(() => {
      repo = new Repository(
        {},
        async (..._args: any[]) =>
          ({ ok: 'true', json: async () => uploadResponse.json(), text: async () => '' } as any),
      )
      repo.load = () => contentMockResponse.json()
    })
    describe('Action types are types', () => {
      expect(
        Actions.uploadRequest(
          'Root/Example',
          ({ size: 65535000, slice: (..._args: any[]) => '' } as any) as File,
          'Binary',
        ).type,
      ).toBe('UPLOAD_CONTENT')
    })

    describe('serviceChecks()', () => {
      describe('Given Upload.file() resolves', () => {
        let data: ODataResponse<Content>
        beforeEach(async () => {
          data = await Actions.uploadRequest(
            'Root/Example',
            ({ size: 65535000, slice: (..._args: any[]) => '' } as any) as File,
            'Binary',
          ).payload(repo)
        })
        it('should return a UPLOAD_CONTENT action', () => {
          expect(
            Actions.uploadRequest(
              '/Root/Example',
              ({ size: 65535000, slice: (..._args: any[]) => '' } as any) as File,
              'File',
            ),
          ).toHaveProperty('type', 'UPLOAD_CONTENT')
        })
        it('should return mockdata', () => {
          expect(data).toEqual({
            d: {
              Name: 'DefaultSite',
            },
          })
        })
      })
    })
  })

  describe('changeFieldValue', () => {
    it('should return CHANGE_FIELD_VALUE action', () => {
      const expectedAction = {
        type: 'CHANGE_FIELD_VALUE',
        name: 'Name',
        value: 'aaa',
      }
      expect(Actions.changeFieldValue('Name', 'aaa')).toEqual(expectedAction)
    })
  })
  describe('getSchemaByTypeName', () => {
    beforeEach(() => {
      repo = new Repository({ repositoryUrl: 'https://dev.demo.sensenet.com/' }, async () => contentMockResponse)
    })
    describe('Action types are types', () => {
      expect(Actions.getSchemaByTypeName('Task').type).toBe('GET_SCHEMA_BY_TYPENAME')
    })
    it('should return task schema', () => {
      const data = Actions.getSchemaByTypeName('Task').payload(repo)
      expect(data).toEqual(repo.schemas.getSchemaByName('Task'))
    })
  })
  describe('setDefaultOdataOptions', () => {
    it('should return SET_ODATAOPTIONS action', () => {
      const expectedAction = {
        type: 'SET_ODATAOPTIONS',
        options: {
          scenario: '',
        },
      }
      expect(Actions.setDefaultOdataOptions({ scenario: '' })).toEqual(expectedAction)
    })
  })
  describe('getChildrenCount', () => {
    beforeEach(() => {
      repo = new Repository({ repositoryUrl: 'https://dev.demo.sensenet.com/' }, async () => countResponse as any)
    })
    describe('Action types are types', () => {
      expect(Actions.getChildrenCount(path).type).toBe('GET_CHILDREN_COUNT')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.fetch() resolves', () => {
        let data: any
        beforeEach(async () => {
          data = await Actions.getChildrenCount(path).payload(repo)
        })
        it('should return a GET_CHILDREN_COUNT action', () => {
          expect(Actions.getChildrenCount(path)).toHaveProperty('type', 'GET_CHILDREN_COUNT')
        })
        it('should return 4', () => {
          expect(data).toEqual(countResponse)
        })
      })
    })
  })
  describe('getProperty', () => {
    beforeEach(() => {
      repo = new Repository({ repositoryUrl: 'https://dev.demo.sensenet.com/' }, async () => propertyResponse as any)
    })
    describe('Action types are types', () => {
      expect(Actions.getProperty(path, 'DisplayName').type).toBe('GET_PROPERTY')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.fetch() resolves', () => {
        let data: any
        beforeEach(async () => {
          data = await Actions.getProperty(path, 'DisplayName').payload(repo)
        })
        it('should return a GET_PROPERTY action', () => {
          expect(Actions.getProperty(path, 'DisplayName')).toHaveProperty('type', 'GET_PROPERTY')
        })
        it('should return propertyResponse', () => {
          expect(data).toEqual(propertyResponse)
        })
      })
    })
  })
  describe('getPropertyValue', () => {
    beforeEach(() => {
      repo = new Repository(
        { repositoryUrl: 'https://dev.demo.sensenet.com/' },
        async () => propertyValueResponse as any,
      )
    })
    describe('Action types are types', () => {
      expect(Actions.getPropertyValue(path, 'DisplayName').type).toBe('GET_PROPERTY_VALUE')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.fetch() resolves', () => {
        let data: any
        beforeEach(async () => {
          data = await Actions.getPropertyValue(path, 'DisplayName').payload(repo)
        })
        it('should return a GET_PROPERTY_VALUE action', () => {
          expect(Actions.getPropertyValue(path, 'DisplayName')).toHaveProperty('type', 'GET_PROPERTY_VALUE')
        })
        it('should return propertyResponse', () => {
          expect(data).toEqual(propertyValueResponse)
        })
      })
    })
  })
  describe('getMetadata', () => {
    beforeEach(() => {
      repo = new Repository({ repositoryUrl: 'https://dev.demo.sensenet.com/' }, async () => metadataResponse as any)
    })
    describe('Action types are types', () => {
      expect(Actions.getMetadata(path).type).toBe('GET_METADATA')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.fetch() resolves', () => {
        let data: any
        beforeEach(async () => {
          data = await Actions.getMetadata(path).payload(repo)
        })
        it('should return a GET_METADATA action', () => {
          expect(Actions.getMetadata(path)).toHaveProperty('type', 'GET_METADATA')
        })
        it('should return propertyResponse', () => {
          expect(data).toEqual(metadataResponse)
        })
      })
    })
  })
  describe('getSchema', () => {
    beforeEach(() => {
      repo = new Repository({ repositoryUrl: 'https://dev.demo.sensenet.com/' }, async () => schemaResponse as any)
    })
    describe('Action types are types', () => {
      expect(Actions.getSchema().type).toBe('GET_SCHEMA')
    })
    describe('serviceChecks()', () => {
      describe('Given repository.getSchema() resolves', () => {
        let data
        let mockSchemaResponseData: ReturnType<typeof schemaResponse['json']>
        beforeEach(async () => {
          data = await Actions.getSchema().payload(repo)
          mockSchemaResponseData = await schemaResponse.json()
        })
        it('should return a GET_SCHEMA action', () => {
          expect(Actions.getSchema()).toHaveProperty('type', 'GET_SCHEMA')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(mockSchemaResponseData)
        })
      })
    })
  })
  describe('share', () => {
    beforeEach(() => {
      repo = new Repository({ repositoryUrl: 'https://dev.demo.sensenet.com/' }, async () => sharingResponse)
    })
    describe('Action types are types', () => {
      expect(
        Actions.share({
          identity: 'devdog@sensenet.com',
          sharingLevel: SharingLevel.Edit,
          sharingMode: SharingMode.Private,
          content: { Id: 42 } as GenericContent,
        }).type,
      ).toBe('SHARE')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.share() resolves', () => {
        let data: ODataSharingResponse
        const expectedResult = { Token: 'devdog@sensenet.com', Id: 11 }
        beforeEach(async () => {
          data = await Actions.share({
            identity: 'devdog@sensenet.com',
            sharingLevel: SharingLevel.Edit,
            sharingMode: SharingMode.Private,
            content: { Id: 42 } as GenericContent,
          }).payload(repo)
        })
        it('should return a SHARE action', () => {
          expect(
            Actions.share({
              identity: 'devdog@sensenet.com',
              sharingLevel: SharingLevel.Edit,
              sharingMode: SharingMode.Private,
              content: { Id: 42 } as GenericContent,
            }),
          ).toHaveProperty('type', 'SHARE')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('remove sharing', () => {
    beforeEach(() => {
      repo = new Repository({ repositoryUrl: 'https://dev.demo.sensenet.com/' }, async () => sharingResponse)
    })
    describe('Action types are types', () => {
      expect(Actions.removeSharing({ Id: 42 } as GenericContent, 11).type).toBe('REMOVE_SHARING')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.removeSharing() resolves', () => {
        let data: ODataSharingResponse
        const expectedResult = { Token: 'devdog@sensenet.com', Id: 11 }
        beforeEach(async () => {
          data = await Actions.removeSharing({ Id: 42 } as GenericContent, 11).payload(repo)
        })
        it('should return a REMOVE_SHARING action', () => {
          expect(Actions.removeSharing({ Id: 42 } as GenericContent, 11)).toHaveProperty('type', 'REMOVE_SHARING')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('getSharingEntries', () => {
    beforeEach(() => {
      repo = new Repository({ repositoryUrl: 'https://dev.demo.sensenet.com/' }, async () => sharingEntriesResponse)
    })
    describe('Action types are types', () => {
      expect(Actions.getSharingEntries(42).type).toBe('GET_SHARING_ENTRIES')
    })

    describe('serviceChecks()', () => {
      describe('Given getSharingEntries() resolves', () => {
        let data: any
        const expectedResult = { d: { results: [{ Token: 'devdog@sensenet.com' }, { Token: 'alba@sensenet.com' }] } }
        beforeEach(async () => {
          data = await Actions.getSharingEntries(42).payload(repo)
        })
        it('should return a GET_SHARING_ENTRIES action', () => {
          expect(Actions.getSharingEntries(42)).toHaveProperty('type', 'GET_SHARING_ENTRIES')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('checkPreviews', () => {
    beforeEach(() => {
      repo = new Repository({ repositoryUrl: 'https://dev.demo.sensenet.com/' }, async () => previewNumberResponse)
    })
    describe('Action types are types', () => {
      expect(Actions.checkPreviews(42).type).toBe('CHECK_PREVIEWS')
    })

    describe('serviceChecks()', () => {
      describe('Given checkPreviews() resolves', () => {
        let data: any
        const expectedResult = 4
        beforeEach(async () => {
          data = await Actions.checkPreviews(42).payload(repo)
        })
        it('should return a CHECK_PREVIEWS action', () => {
          expect(Actions.checkPreviews(42)).toHaveProperty('type', 'CHECK_PREVIEWS')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('getPageCount', () => {
    beforeEach(() => {
      repo = new Repository({ repositoryUrl: 'https://dev.demo.sensenet.com/' }, async () => previewNumberResponse)
    })
    describe('Action types are types', () => {
      expect(Actions.getPageCount(42).type).toBe('GET_PAGE_COUNT')
    })

    describe('serviceChecks()', () => {
      describe('Given getPageCount() resolves', () => {
        let data: any
        const expectedResult = 4
        beforeEach(async () => {
          data = await Actions.getPageCount(42).payload(repo)
        })
        it('should return a GET_PAGE_COUNT action', () => {
          expect(Actions.getPageCount(42)).toHaveProperty('type', 'GET_PAGE_COUNT')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('regeneratePreviews', () => {
    beforeEach(() => {
      repo = new Repository({ repositoryUrl: 'https://dev.demo.sensenet.com/' }, async () => emptyResponse as any)
    })
    describe('Action types are types', () => {
      expect(Actions.regeneratePreviews(42).type).toBe('REGENERATE_PREVIEW_IMAGES')
    })

    describe('serviceChecks()', () => {
      describe('Given repository.executeAction() resolves', () => {
        let data: any
        beforeEach(async () => {
          data = await Actions.regeneratePreviews(42).payload(repo)
        })
        it('should return a REGENERATE_PREVIEW_IMAGES action', () => {
          expect(Actions.regeneratePreviews(42)).toHaveProperty('type', 'REGENERATE_PREVIEW_IMAGES')
        })
        it('should return propertyResponse', () => {
          expect(data).toBeUndefined()
        })
      })
    })
  })
  describe('getPreviewComments', () => {
    beforeEach(() => {
      repo = new Repository({ repositoryUrl: 'https://dev.demo.sensenet.com/' }, async () => previewCommentsResponse)
    })
    describe('Action types are types', () => {
      expect(Actions.getPreviewComments(42, 4).type).toBe('GET_PREVIEW_COMMENTS')
    })

    describe('serviceChecks()', () => {
      describe('Given getPreviewComments() resolves', () => {
        let data: any
        const expectedResult = [
          {
            id: '1234',
            createdBy: { Name: 'alba' } as User,
            page: 3,
            x: 100,
            y: 100,
            text: 'Lorem ipsum',
          },
          {
            id: '5678',
            createdBy: { Name: 'devdog' } as User,
            page: 3,
            x: 100,
            y: 200,
            text: 'Dolor sit amet',
          },
        ]
        beforeEach(async () => {
          data = await Actions.getPreviewComments(42, 4).payload(repo)
        })
        it('should return a GET_PREVIEW_COMMENTS action', () => {
          expect(Actions.getPreviewComments(42, 4)).toHaveProperty('type', 'GET_PREVIEW_COMMENTS')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('addPreviewComment', () => {
    beforeEach(() => {
      repo = new Repository({ repositoryUrl: 'https://dev.demo.sensenet.com/' }, async () => previewCommentResponse)
    })
    describe('Action types are types', () => {
      expect(Actions.addPreviewComment(42, 4, 100, 100, 'Lorem ipsum').type).toBe('ADD_PREVIEW_COMMENT')
    })

    describe('serviceChecks()', () => {
      describe('Given addPreviewComment() resolves', () => {
        let data: any
        const expectedResult = {
          id: '1234',
          createdBy: { Name: 'alba' } as User,
          page: 3,
          x: 100,
          y: 100,
          text: 'Lorem ipsum',
        }
        beforeEach(async () => {
          data = await Actions.addPreviewComment(42, 4, 100, 100, 'Lorem ipsum').payload(repo)
        })
        it('should return a ADD_PREVIEW_COMMENT action', () => {
          expect(Actions.addPreviewComment(42, 4, 100, 100, 'Lorem ipsum')).toHaveProperty(
            'type',
            'ADD_PREVIEW_COMMENT',
          )
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('removePreviewComment', () => {
    beforeEach(() => {
      repo = new Repository({ repositoryUrl: 'https://dev.demo.sensenet.com/' }, async () => previewCommentResponse)
    })
    describe('Action types are types', () => {
      expect(Actions.removePreviewComment(42, 5678).type).toBe('REMOVE_PREVIEW_COMMENT')
    })

    describe('serviceChecks()', () => {
      describe('Given removePreviewComment() resolves', () => {
        let data: any
        const expectedResult = {
          id: '1234',
          createdBy: { Name: 'alba' } as User,
          page: 3,
          x: 100,
          y: 100,
          text: 'Lorem ipsum',
        }
        beforeEach(async () => {
          data = await Actions.removePreviewComment(42, 5678).payload(repo)
        })
        it('should return a REMOVE_PREVIEW_COMMENT action', () => {
          expect(Actions.removePreviewComment(42, 5678)).toHaveProperty('type', 'REMOVE_PREVIEW_COMMENT')
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
  describe('restoreFromTrash', () => {
    beforeEach(() => {
      repo = new Repository({ repositoryUrl: 'https://dev.demo.sensenet.com/' }, async () => contentMockResponse)
    })
    describe('Action types are types', () => {
      expect(Actions.restoreFromTrash(42, '/Root/Content/IT/Document_Library').type).toBe('RESTORE_FROM_TRASH')
    })

    describe('serviceChecks()', () => {
      describe('Given addPreviewComment() resolves', () => {
        let data: any
        const expectedResult = {
          d: {
            Name: 'DefaultSite',
          },
        }
        beforeEach(async () => {
          data = await Actions.restoreFromTrash(42, '/Root/Content/IT/Document_Library').payload(repo)
        })
        it('should return a RESTORE_FROM_TRASH action', () => {
          expect(Actions.restoreFromTrash(42, '/Root/Content/IT/Document_Library')).toHaveProperty(
            'type',
            'RESTORE_FROM_TRASH',
          )
        })
        it('should return mockdata', () => {
          expect(data).toEqual(expectedResult)
        })
      })
    })
  })
})
