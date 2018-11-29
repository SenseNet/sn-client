import { GoogleOauthProvider } from '@sensenet/authentication-google'
import { JwtService } from '@sensenet/authentication-jwt'
import { Content, LoginState, ODataBatchResponse, ODataCollectionResponse, ODataResponse, Repository } from '@sensenet/client-core'
import { GenericContent, IActionModel, Task, User } from '@sensenet/default-content-types'
import { expect } from 'chai'
import * as Actions from '../src/Actions'

declare const global: any

global.window = {
    location: {
        origin: '',
    },
}

// tslint:disable:completed-docs

global.File = class {
    public size: number = 1024
    public namme: string = 'file.txt'
    public slice(..._args: any[]) { return '' }
}
// tslint:disable-next-line:max-classes-per-file
global.FormData = class {
    public append(..._args: any[]) { /** */ }
}

const repository = new Repository({ repositoryUrl: 'https://dmsservice.demo.sensenet.com/' }, async () => jwtMockResponse)

// tslint:disable-next-line:variable-name
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
            Thumbnail_url: '/Root/Sites/Default_Site/Workspace/Document_Library/LICENSE',
            Type: 'File',
            Url: '/Root/Sites/Default_Site/Workspace/Document_Library/LICENSE',
        }
    },
} as Response

const jwtMockResponse = {
    ok: true,
    status: 200,
    json: async () => {
        return {
            access: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzZW5zZW5ldC10b2tlbi1zZXJ2aWNlIiwic3ViIjoic2Vuc2VuZXQiLCJhdWQiOiJjbGllbnQiLCJleHAiOjE1MTk4MzM0MDQsImlhdCI6MTUxOTgzMzEwNCwibmJmIjoxNTE5ODMzMTA0LCJuYW1lIjoiUHVibGljXFxhbGJhQHNlbnNlbmV0LmNvbSIsImp0aSI6ImUyMTgyOGQxOWVlMjQwNDM4MTAzMTZhMjkwZjQ3YzkxIn0',
            refresh: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzZW5zZW5ldC10b2tlbi1zZXJ2aWNlIiwic3ViIjoic2Vuc2VuZXQiLCJhdWQiOiJjbGllbnQiLCJleHAiOjE1MTk5MTk4MDQsImlhdCI6MTUxOTgzMzEwNCwibmJmIjoxNTE5ODMzNDA0LCJuYW1lIjoiUHVibGljXFxhbGJhQHNlbnNlbmV0LmNvbSIsImp0aSI6IjgzZDZmNzA0NjNmNTQ4YWZhN2U4ZDAxMmIyMGRiYzRiIn0',
        }
    },
} as Response

describe('Actions', () => {
    const path = '/workspaces/project'
    // tslint:disable-next-line:variable-name
    let repo: Repository
    beforeEach(() => {
        repo = new Repository({ repositoryUrl: 'https://dmsservice.demo.sensenet.com/' }, async () => contentMockResponse)
    })
    describe('FetchContent', () => {
        beforeEach(() => {
            repo = new Repository({ repositoryUrl: 'https://dmsservice.demo.sensenet.com/' }, async () => collectionMockResponse)
        })
        describe('Action types are types', () => {
            expect(Actions.requestContent(path, { scenario: '' }).type).to.eql('FETCH_CONTENT')
        })

        describe('serviceChecks()', () => {
            context('Given repository.loadCollection() resolves', () => {
                let data: ODataCollectionResponse<GenericContent>
                let dataWithoutOptions: ODataCollectionResponse<GenericContent>
                let mockCollectionResponseData: ReturnType<typeof collectionMockResponse['json']>
                beforeEach(async () => {
                    data = await Actions.requestContent(path, { scenario: '' }).payload(repo)
                    dataWithoutOptions = await Actions.requestContent(path).payload(repo)
                    mockCollectionResponseData = (await collectionMockResponse.json())
                })
                it('should return a FETCH_CONTENT action', () => {
                    expect(Actions.requestContent(path, { scenario: '' })).to.have.property(
                        'type', 'FETCH_CONTENT',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal(mockCollectionResponseData)
                })
                it('should return mockdata without options attribute', async () => {
                    expect(dataWithoutOptions).to.deep.equal(mockCollectionResponseData)
                })
            })
        })
    })
    describe('LoadContent', () => {
        describe('Action types are types', () => {
            expect(Actions.loadContent(path, {}).type).to.eql('LOAD_CONTENT')
        })

        describe('serviceChecks()', () => {
            context('Given repository.load() resolves', () => {
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
                    dataWithStringExpand = await Actions.loadContent(path, { expand: 'Owner' }).payload(repo)
                    dataWithStringExpandWorkspace = await Actions.loadContent(path, { expand: 'Workspace' }).payload(repo)
                    dataWithSelectWorkspace = await Actions.loadContent(path, { select: 'Workspace' }).payload(repo)
                })
                it('should return a LOAD_CONTENT action', () => {
                    expect(Actions.loadContent(path, {})).to.have.property(
                        'type', 'LOAD_CONTENT',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal(expectedResult)
                })
                it('should return mockdata without options attribute', async () => {
                    expect(dataWithoutOptions).to.deep.equal(expectedResult)
                })
                it('should return mockdata', () => {
                    expect(dataWithExpandUndefined).to.deep.equal(expectedResult)
                })
                it('should return mockdata', () => {
                    expect(dataWithStringExpand).to.deep.equal(expectedResult)
                })
                it('should return mockdata', () => {
                    expect(dataWithStringExpandWorkspace).to.deep.equal(expectedResult)
                })
                it('should return mockdata', () => {
                    expect(dataWithSelectWorkspace).to.deep.equal(expectedResult)
                })
                it('should return LOAD_CONTENT action', () => {
                    expect(Actions.loadContent(path, { expand: undefined })).to.have.property(
                        'type', 'LOAD_CONTENT',
                    )
                })
                it('should return LOAD_CONTENT action', () => {
                    expect(Actions.loadContent(path, { expand: 'Owner' })).to.have.property(
                        'type', 'LOAD_CONTENT',
                    )
                })
                it('should return LOAD_CONTENT action', () => {
                    expect(Actions.loadContent(path, { expand: 'Workspace' })).to.have.property(
                        'type', 'LOAD_CONTENT',
                    )
                })
            })
        })
    })
    describe('LoadContentActions', () => {
        beforeEach(() => {
            repo = new Repository({ repositoryUrl: 'https://dmsservice.demo.sensenet.com/' }, async () => actionsMockResponse)
        })
        describe('Action types are types', () => {
            expect(Actions.loadContentActions(path).type).to.eql('LOAD_CONTENT_ACTIONS')
        })

        describe('serviceChecks()', () => {
            context('Given repository.getActions() resolves', () => {
                let data: { d: { Actions: IActionModel[] } }
                const expectedResult = { d: [] }
                beforeEach(async () => {
                    data = await Actions.loadContentActions(path).payload(repo)
                })
                it('should return a LOAD_CONTENT_ACTIONS action', () => {
                    expect(Actions.loadContentActions(path)).to.have.property(
                        'type', 'LOAD_CONTENT_ACTIONS',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal(expectedResult)
                })
            })
        })
    })
    describe('CreateContent', () => {
        const content = { DisplayName: 'My content', Id: 123 } as Task

        describe('Action types are types', () => {
            expect(Actions.createContent(path, content, 'Task').type).to.eql('CREATE_CONTENT')
        })

        describe('serviceChecks()', () => {
            context('Given repository.post() resolves', () => {
                let data: ODataResponse<Task>
                const expectedResult = { d: { Name: 'DefaultSite' } }
                beforeEach(async () => {
                    data = await Actions.createContent(path, content, 'Task').payload(repo)
                })
                it('should return a CREATE_CONTENT action', () => {
                    expect(Actions.createContent(path, content, 'Task')).to.have.property(
                        'type', 'CREATE_CONTENT',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal(expectedResult)
                })
            })
        })
    })
    describe('UpdateContent', () => {
        const content = { DisplayName: 'My content', Id: 123 } as Task

        describe('Action types are types', () => {
            expect(Actions.updateContent(path, content).type).to.eql('UPDATE_CONTENT')
        })

        describe('serviceChecks()', () => {
            context('Given repository.patch() resolves', () => {
                let data: ODataResponse<Content>
                const expectedResult = { d: { Name: 'DefaultSite' } }
                beforeEach(async () => {
                    data = await Actions.updateContent(path, content).payload(repo)
                })
                it('should return a UPDATE_CONTENT action', () => {
                    expect(Actions.updateContent(path, content)).to.have.property(
                        'type', 'UPDATE_CONTENT',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal(expectedResult)
                })
            })
        })
    })
    describe('DeleteContent', () => {
        describe('Action types are types', () => {
            expect(Actions.deleteContent(path, true).type).to.eql('DELETE_CONTENT')
        })

        describe('serviceChecks()', () => {
            context('Given repository.delete() resolves', () => {
                let data: ODataBatchResponse<Content>
                const expectedResult = { d: { Name: 'DefaultSite' } }
                beforeEach(async () => {
                    data = await Actions.deleteContent(path).payload(repo)
                })
                it('should return a DELETE_CONTENT action', () => {
                    expect(Actions.deleteContent(path)).to.have.property(
                        'type', 'DELETE_CONTENT',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal(expectedResult)
                })
            })
        })
    })
    describe('DeleteBatchContent', () => {
        describe('Action types are types', () => {
            expect(Actions.deleteBatch([1, 2], true).type).to.eql('DELETE_BATCH')
        })

        describe('serviceChecks()', () => {
            context('Given repository.delete() resolves', () => {
                let data: ODataBatchResponse<Content>
                const expectedResult = { d: { Name: 'DefaultSite' } }
                beforeEach(async () => {
                    data = await Actions.deleteBatch([1, 2]).payload(repo)
                })
                it('should return a DELETE_BATCH action', () => {
                    expect(Actions.deleteBatch([1, 2])).to.have.property(
                        'type', 'DELETE_BATCH',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal(expectedResult)
                })
            })
        })
    })
    describe('CopyContent', () => {
        describe('Action types are types', () => {
            expect(Actions.copyContent(path, '/workspaces').type).to.eql('COPY_CONTENT')
        })

        describe('serviceChecks()', () => {
            context('Given repository.copy() resolves', () => {
                let data: ODataBatchResponse<Content>
                const expectedResult = { d: { Name: 'DefaultSite' } }
                beforeEach(async () => {
                    data = await Actions.copyContent(path, '/workspaces').payload(repo)
                })
                it('should return a COPY_CONTENT action', () => {
                    expect(Actions.copyContent(path, '/workspaces')).to.have.property(
                        'type', 'COPY_CONTENT',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal(expectedResult)
                })
            })
        })
    })
    describe('CopyBatchContent', () => {
        describe('Action types are types', () => {
            expect(Actions.copyBatch([path], '/workspaces').type).to.eql('COPY_BATCH')
        })

        describe('serviceChecks()', () => {
            context('Given repository.copy() resolves', () => {
                let data: ODataBatchResponse<Content>
                const expectedResult = { d: { Name: 'DefaultSite' } }
                beforeEach(async () => {
                    data = await Actions.copyBatch([path], '/workspaces').payload(repo)
                })
                it('should return a COPY_BATCH action', () => {
                    expect(Actions.copyBatch([path], '/workspaces')).to.have.property(
                        'type', 'COPY_BATCH',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal(expectedResult)
                })
            })
        })
    })
    describe('MoveContent', () => {
        describe('Action types are types', () => {
            expect(Actions.moveContent(path, '/workspaces').type).to.eql('MOVE_CONTENT')
        })

        describe('serviceChecks()', () => {
            context('Given repository.move() resolves', () => {
                let data: ODataBatchResponse<Content>
                const expectedResult = { d: { Name: 'DefaultSite' } }
                beforeEach(async () => {
                    data = await Actions.moveContent(path, '/workspaces').payload(repo)
                })
                it('should return a MOVE_CONTENT action', () => {
                    expect(Actions.moveContent(path, '/workspaces')).to.have.property(
                        'type', 'MOVE_CONTENT',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal(expectedResult)
                })
            })
        })
    })
    describe('MoveBatchContent', () => {
        describe('Action types are types', () => {
            expect(Actions.moveBatch([path], '/workspaces').type).to.eql('MOVE_BATCH')
        })

        describe('serviceChecks()', () => {
            context('Given repository.move() resolves', () => {
                let data: ODataBatchResponse<Content>
                const expectedResult = { d: { Name: 'DefaultSite' } }
                beforeEach(async () => {
                    data = await Actions.moveBatch([path], '/workspaces').payload(repo)
                })
                it('should return a MOVE_BATCH action', () => {
                    expect(Actions.moveBatch([path], '/workspaces')).to.have.property(
                        'type', 'MOVE_BATCH',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal(expectedResult)
                })
            })
        })
    })
    describe('CheckoutContent', () => {
        describe('Action types are types', () => {
            expect(Actions.checkOut('/workspaces').type).to.eql('CHECKOUT_CONTENT')
        })

        describe('serviceChecks()', () => {
            context('Given repository.versioning.checkout() resolves', () => {
                let data: ODataResponse<Content>
                const expectedResult = { d: { Name: 'DefaultSite' } }
                beforeEach(async () => {
                    data = await Actions.checkOut('/workspaces').payload(repo)
                })
                it('should return a CHECKOUT_CONTENT action', () => {
                    expect(Actions.checkOut('/workspaces')).to.have.property(
                        'type', 'CHECKOUT_CONTENT',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal(expectedResult)
                })
            })
        })
    })
    describe('CheckinContent', () => {
        describe('Action types are types', () => {
            expect(Actions.checkIn('/workspaces').type).to.eql('CHECKIN_CONTENT')
        })

        describe('serviceChecks()', () => {
            context('Given repository.versioning.checkin() resolves', () => {
                let data: ODataResponse<Content>
                const expectedResult = { d: { Name: 'DefaultSite' } }
                beforeEach(async () => {
                    data = await Actions.checkIn('/workspaces').payload(repo)
                })
                it('should return a CHECKIN_CONTENT action', () => {
                    expect(Actions.checkIn('/workspaces')).to.have.property(
                        'type', 'CHECKIN_CONTENT',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal(expectedResult)
                })
            })
        })
    })
    describe('PublishContent', () => {
        describe('Action types are types', () => {
            expect(Actions.publish('/workspaces').type).to.eql('PUBLISH_CONTENT')
        })

        describe('serviceChecks()', () => {
            context('Given repository.versioning.publish() resolves', () => {
                let data: ODataResponse<Content>
                const expectedResult = { d: { Name: 'DefaultSite' } }
                beforeEach(async () => {
                    data = await Actions.publish('/workspaces').payload(repo)
                })
                it('should return a PUBLISH_CONTENT action', () => {
                    expect(Actions.publish('/workspaces')).to.have.property(
                        'type', 'PUBLISH_CONTENT',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal(expectedResult)
                })
            })
        })
    })
    describe('ApproveContent', () => {
        describe('Action types are types', () => {
            expect(Actions.approve('/workspaces').type).to.eql('APPROVE_CONTENT')
        })

        describe('serviceChecks()', () => {
            context('Given repository.versioning.approve() resolves', () => {
                let data: ODataResponse<Content>
                const expectedResult = { d: { Name: 'DefaultSite' } }
                beforeEach(async () => {
                    data = await Actions.approve('/workspaces').payload(repo)
                })
                it('should return a APPROVE_CONTENT action', () => {
                    expect(Actions.approve('/workspaces')).to.have.property(
                        'type', 'APPROVE_CONTENT',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal(expectedResult)
                })
            })
        })
    })
    describe('RejectContent', () => {
        describe('Action types are types', () => {
            expect(Actions.rejectContent('/workspaces').type).to.eql('REJECT_CONTENT')
        })

        describe('serviceChecks()', () => {
            context('Given repository.versioning.reject() resolves', () => {
                let data: ODataResponse<Content>
                const expectedResult = { d: { Name: 'DefaultSite' } }
                beforeEach(async () => {
                    data = await Actions.rejectContent('/workspaces').payload(repo)
                })
                it('should return a REJECT_CONTENT action', () => {
                    expect(Actions.rejectContent('/workspaces')).to.have.property(
                        'type', 'REJECT_CONTENT',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal(expectedResult)
                })
            })
        })
    })
    describe('UndoCheckoutContent', () => {
        describe('Action types are types', () => {
            expect(Actions.undoCheckout('/workspaces').type).to.eql('UNDOCHECKOUT_CONTENT')
        })

        describe('serviceChecks()', () => {
            context('Given repository.versioning.undoCheckout() resolves', () => {
                let data: ODataResponse<Content>
                const expectedResult = { d: { Name: 'DefaultSite' } }
                beforeEach(async () => {
                    data = await Actions.undoCheckout('/workspaces').payload(repo)
                })
                it('should return a UNDOCHECKOUT_CONTENT action', () => {
                    expect(Actions.undoCheckout('/workspaces')).to.have.property(
                        'type', 'UNDOCHECKOUT_CONTENT',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal(expectedResult)
                })
            })
        })
    })
    describe('ForceUndoCheckoutContent', () => {
        describe('Action types are types', () => {
            expect(Actions.forceUndoCheckout('/workspaces').type).to.eql('FORCE_UNDOCHECKOUT_CONTENT')
        })

        describe('serviceChecks()', () => {
            context('Given repository.versioning.forceUndoCheckout() resolves', () => {
                let data: ODataResponse<Content>
                const expectedResult = { d: { Name: 'DefaultSite' } }
                beforeEach(async () => {
                    data = await Actions.forceUndoCheckout('/workspaces').payload(repo)
                })
                it('should return a FORCE_UNDOCHECKOUT_CONTENT action', () => {
                    expect(Actions.forceUndoCheckout('/workspaces')).to.have.property(
                        'type', 'FORCE_UNDOCHECKOUT_CONTENT',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal(expectedResult)
                })
            })
        })
    })
    describe('RestoreVersion', () => {
        describe('Action types are types', () => {
            expect(Actions.restoreVersion('/workspaces', '1').type).to.eql('RESTOREVERSION_CONTENT')
        })

        describe('serviceChecks()', () => {
            context('Given repository.versioning.restoreVersion() resolves', () => {
                let data: ODataResponse<Content>
                const expectedResult = { d: { Name: 'DefaultSite' } }
                beforeEach(async () => {
                    data = await Actions.restoreVersion('/workspaces', '1').payload(repo)
                })
                it('should return a RESTOREVERSION_CONTENT action', () => {
                    expect(Actions.restoreVersion('/workspaces', '1')).to.have.property(
                        'type', 'RESTOREVERSION_CONTENT',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal(expectedResult)
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
            expect(Actions.loginStateChanged(LoginState.Unauthenticated)).to.deep.equal(expectedAction)
        })
    })
    describe('UserChanged', () => {
        it('should return the user changed action', () => {
            const user = { Name: 'alba' } as User
            const expectedAction = {
                type: 'USER_CHANGED',
                user,
            }
            expect(Actions.userChanged(user)).to.deep.equal(expectedAction)
        })
    })
    describe('UserLogin', () => {
        describe('Action types are types', () => {
            expect(Actions.userLogin('alba', 'alba').type).to.eql('USER_LOGIN')
        })

        describe('serviceChecks()', () => {
            context('Given repository.authentication.login() resolves', () => {
                let data: boolean
                beforeEach(async () => {
                    data = await Actions.userLogin('alba', 'alba').payload(repository)
                })
                it('should return a USER_LOGIN action', () => {
                    expect(Actions.userLogin('alba', 'alba')).to.have.property(
                        'type', 'USER_LOGIN',
                    )
                })
                it('should return mockdata', () => {
                    // tslint:disable-next-line:no-unused-expression
                    expect(data).to.be.false
                })
            })
        })
    })
    describe('UserLoginGoogle', () => {
        const googleOauthProvider = {
            login: async () => true,
        } as GoogleOauthProvider
        it('should create an action to a user login with google', () => {
            expect(Actions.userLoginGoogle(googleOauthProvider).type).to.eql('USER_LOGIN_GOOGLE')
        })
        describe('serviceChecks()', () => {
            context('Given provider.login() resolves', async () => {
                let data: boolean
                beforeEach(async () => {
                    data = await Actions.userLoginGoogle(googleOauthProvider, 'gasgsdagsdagd.dgsgfshdfhs').payload()
                })
                it('should return a USER_LOGIN_GOOGLE action', () => {
                    expect(Actions.userLoginGoogle(googleOauthProvider)).to.have.property(
                        'type', 'USER_LOGIN_GOOGLE',
                    )
                })
                it('should return mockdata', () => {
                    // tslint:disable-next-line:no-unused-expression
                    expect(data).to.be.true
                })
            })
        })
        describe('serviceChecks() false', () => {
            context('Given provider.login() resolves', () => {
                const googleOauthProvider2 = {
                    login: async () => false,
                } as GoogleOauthProvider
                let data: boolean
                beforeEach(async () => {
                    data = await Actions.userLoginGoogle(googleOauthProvider2, 'gasgsdagsdagd.dgsgfshdfhs').payload()
                })
                it('should return a USER_LOGIN_GOOGLE action', () => {
                    expect(Actions.userLoginGoogle(googleOauthProvider2)).to.have.property(
                        'type', 'USER_LOGIN_GOOGLE',
                    )
                })
                it('should return mockdata', () => {
                    // tslint:disable-next-line:no-unused-expression
                    expect(data).to.be.false
                })
            })
        })
    })
    describe('UserLogout', () => {
        describe('Action types are types', () => {
            expect(Actions.userLogout().type).to.eql('USER_LOGOUT')
        })

        describe('serviceChecks()', () => {
            context('Given repository.authentication.logout() resolves', () => {
                let data: boolean
                beforeEach(async () => {
                    data = await Actions.userLogout().payload(repository)
                })
                it('should return a USER_LOGOUT action', () => {
                    expect(Actions.userLogout()).to.have.property(
                        'type', 'USER_LOGOUT',
                    )
                })
                it('should return mockdata', () => {
                    // tslint:disable-next-line:no-unused-expression
                    expect(data).to.be.true
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
            expect(Actions.loadRepository({} as any)).to.deep.equal(expectedAction)
        })
    })
    describe('SelectContent', () => {
        const content = { DisplayName: 'My content', Id: 1 } as Task
        it('should return the select content action', () => {
            const expectedAction = {
                type: 'SELECT_CONTENT',
                content,
            }
            expect(Actions.selectContent(content)).to.deep.equal(expectedAction)
        })
    })
    describe('DeSelectContent', () => {
        const content = { DisplayName: 'My content', Id: 1 } as Task
        it('should return the deselect content action', () => {
            const expectedAction = {
                type: 'DESELECT_CONTENT',
                content,
            }
            expect(Actions.deSelectContent(content)).to.deep.equal(expectedAction)
        })
    })
    describe('ClearSelection', () => {
        it('should return the clear selection action', () => {
            const expectedAction = {
                type: 'CLEAR_SELECTION',
            }
            expect(Actions.clearSelection()).to.deep.equal(expectedAction)
        })
    })
    describe('UploadContent', () => {
        beforeEach(() => {
            repo = new Repository({}, async (..._args: any[]) => ({ ok: 'true', json: async () => (uploadResponse.json()), text: async () => '' } as any))
            repo.load = () => contentMockResponse.json()
        })
        describe('Action types are types', () => {
            expect(Actions.uploadRequest('Root/Example', { size: 65535000, slice: (..._args: any[]) => '' } as any as File, 'Binary').type).to.eql('UPLOAD_CONTENT')
        })

        describe('serviceChecks()', () => {
            context('Given Upload.file() resolves', () => {
                let data: ODataResponse<Content>
                beforeEach(async () => {
                    data = await Actions.uploadRequest('Root/Example', { size: 65535000, slice: (..._args: any[]) => '' } as any as File, 'Binary').payload(repo)

                })
                it('should return a UPLOAD_CONTENT action', () => {
                    expect(Actions.uploadRequest('/Root/Example', { size: 65535000, slice: (..._args: any[]) => '' } as any as File, 'File')).to.have.property(
                        'type', 'UPLOAD_CONTENT',
                    )
                })
                it('should return mockdata', () => {
                    expect(data).to.deep.equal({
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
            expect(Actions.changeFieldValue('Name', 'aaa')).to.deep.equal(expectedAction)
        })
    })
    describe('getSchema', () => {
        beforeEach(() => {
            repo = new Repository({ repositoryUrl: 'https://dmsservice.demo.sensenet.com/' }, async () => contentMockResponse)
        })
        describe('Action types are types', () => {
            expect(Actions.getSchema('Task').type).to.eql('GET_SCHEMA')
        })
        it('should return task schema', () => {
            const data = Actions.getSchema('Task').payload(repo)
            expect(data).to.deep.equal(repo.schemas.getSchemaByName('Task'))
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
            expect(Actions.setDefaultOdataOptions({ scenario: '' })).to.deep.equal(expectedAction)
        })
    })
})
