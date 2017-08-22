///<reference path="../node_modules/@types/mocha/index.d.ts"/>
import { Actions } from '../src/Actions'
import * as Chai from 'chai';
import { Content, Mocks, IContentOptions, ContentTypes, Repository } from 'sn-client-js';
const expect = Chai.expect;

describe('Actions', () => {
    const path = '/workspaces/project';
    let repo: Mocks.MockRepository = new Mocks.MockRepository();
    describe('InitSensenetStore', () => {
        it('should create an action to an init sensenet store request', () => {
            const expectedAction = {
                type: 'INIT_SENSENET_STORE',
                path: '/workspaces/project',
                options: {}
            }
            expect(Actions.InitSensenetStore(path, {})).to.deep.equal(expectedAction)
        });
        it('should create an action to an init sensenet store request with "/Root"', () => {
            const expectedAction = {
                type: 'INIT_SENSENET_STORE',
                path: '/Root',
                options: {}
            }
            expect(Actions.InitSensenetStore()).to.deep.equal(expectedAction)
        });
    })
    describe('FetchContent', () => {
        it('should create an action to a fetch content request', () => {
            const expectedAction = {
                type: 'FETCH_CONTENT_REQUEST',
                path: '/workspaces/project',
                options: {},
                contentType: Content
            }
            expect(Actions.RequestContent(path, {}, Content)).to.deep.equal(expectedAction)
        });
        it('should create an action to a fetch content request', () => {
            const expectedAction = {
                type: 'FETCH_CONTENT_REQUEST',
                path: '/workspaces/project',
                options: {},
                contentType: undefined
            }
            expect(Actions.RequestContent(path)).to.deep.equal(expectedAction)
        });
        it('should create an action to receive content', () => {
            const expectedAction = {
                type: 'FETCH_CONTENT_SUCCESS',
                response: { entities: {}, result: [] },
                params: '?$select=Id,Type&metadata=no'
            }
            expect(Actions.ReceiveContent([], '?$select=Id,Type&metadata=no')).to.deep.equal(expectedAction)
        });
        it('should create an action to content fetch request failure', () => {
            const expectedAction = {
                type: 'FETCH_CONTENT_FAILURE',
                message: 'error',
                params: '?$select=Id,Type&metadata=no'
            }
            expect(Actions.ReceiveContentFailure('?$select=Id,Type&metadata=no', { message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('LoadContent', () => {
        it('should create an action to a load content request', () => {
            const expectedAction = {
                type: 'LOAD_CONTENT_REQUEST',
                id: 123,
                options: {},
                contentType: ContentTypes.Task
            }
            expect(Actions.LoadContent(123, {}, ContentTypes.Task)).to.deep.equal(expectedAction)
        });
        it('should create an action to a load content request', () => {
            const expectedAction = {
                type: 'LOAD_CONTENT_REQUEST',
                id: 123,
                options: {},
                contentType: undefined
            }
            expect(Actions.LoadContent(123)).to.deep.equal(expectedAction)
        });
        it('should create an action to receive a loaded content', () => {
            const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
            expect(Actions.ReceiveLoadedContent(content, { select: ['Id', 'DisplayName'] }).response.DisplayName).to.deep.equal('My content')
        });

        it('should create an action to content reload request failure', () => {
            const expectedAction = {
                type: 'LOAD_CONTENT_FAILURE',
                message: 'error',
                params: '?$select=Id,Type&metadata=no'
            }
            expect(Actions.ReceiveLoadedContentFailure('?$select=Id,Type&metadata=no', { message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('LoadContentActions', () => {
        it('should create an action to a load content actions request', () => {
            const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
            const expectedAction = {
                type: 'LOAD_CONTENT_ACTIONS',
                content: content,
                scenario: 'ListItem'
            }
            expect(Actions.LoadContentActions(content, 'ListItem')).to.deep.equal(expectedAction)
        });
        it('should create an action to receive a loaded contents actions', () => {
            const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
            const expectedAction = {
                type: 'LOAD_CONTENT_ACTIONS_SUCCESS',
                actions: ['aa', 'bb']
            }
            expect(Actions.ReceiveContentActions(['aa', 'bb'])).to.deep.equal(expectedAction)
        });
        it('should create an action to load content action request failure', () => {
            const expectedAction = {
                type: 'LOAD_CONTENT_ACTIONS_FAILURE',
                error: 'error'
            }
            expect(Actions.ReceiveContentActionsFailure('error')).to.deep.equal(expectedAction)
        });
    });
    describe('ReloadContent', () => {
        it('should create an action to a reload content request', () => {
            const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
            const expectedAction = {
                type: 'RELOAD_CONTENT_REQUEST',
                content,
                actionName: 'edit'
            }
            expect(Actions.ReloadContent(content, 'edit')).to.deep.equal(expectedAction)
        });
        it('should create an action to receive the reloaded content', () => {
            const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
            expect(Actions.ReceiveReloadedContent(content).response.DisplayName).to.deep.equal('My content')
        });
        it('should create an action to content load request failure', () => {
            const expectedAction = {
                type: 'RELOAD_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.ReceiveReloadedContentFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('ReloadContentFields', () => {
        it('should create an action to a reload fields of a content request', () => {
            const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
            const expectedAction = {
                type: 'RELOAD_CONTENTFIELDS_REQUEST',
                content,
                fields: ['Id', 'DisplayName']
            }
            expect(Actions.ReloadContentFields(content, ['Id', 'DisplayName'])).to.deep.equal(expectedAction)
        });
        it('should create an action to receive the reloaded fields of a content', () => {
            const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
            expect(Actions.ReceiveReloadedContentFields(content).response.DisplayName).to.deep.equal('My content')
        });
        it('should create an action to content load request failure', () => {
            const expectedAction = {
                type: 'RELOAD_CONTENTFIELDS_FAILURE',
                message: 'error'
            }
            expect(Actions.ReceiveReloadedContentFieldsFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('CreateContent', () => {
        const content = Content.Create({
            Id: 123,
            DisplayName: 'My Content'
        }, ContentTypes.Task, repo);

        it('should create an action to a create content request', () => {
            const expectedAction = {
                type: 'CREATE_CONTENT_REQUEST',
                content
            };
            expect(Actions.CreateContent(content)).to.deep.equal(expectedAction)
        });
        it('should create an action to a create content success', () => {
            expect(Actions.CreateContentSuccess(content).response.entities.entities['123'].options.DisplayName).to.be.eq('My Content')
        });
        it('should create an action to content creation failure', () => {
            const expectedAction = {
                type: 'CREATE_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.CreateContentFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('UpdateContent', () => {
        it('should create an action to an update content request', () => {
            const expectedAction = {
                type: 'UPDATE_CONTENT_REQUEST',
                content: { Index: 2 }
            }
            expect(Actions.UpdateContent({
                Index: 2
            })).to.deep.equal(expectedAction)
        });
        it('should create an action to update content success', () => {
            const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
            expect(Actions.UpdateContentSuccess(content).response.DisplayName).to.deep.equal('My content')
        });
        it('should create an action to content update request failure', () => {
            const expectedAction = {
                type: 'UPDATE_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.UpdateContentFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('DeleteContent', () => {
        const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
        it('should create an action to a delete content request', () => {
            const expectedAction = {
                type: 'DELETE_CONTENT_REQUEST',
                content,
                permanently: false
            }
            expect(Actions.Delete(content, false)).to.deep.equal(expectedAction)
        });
        it('should create an action to a delete content request', () => {
            const expectedAction = {
                type: 'DELETE_CONTENT_REQUEST',
                content,
                permanently: false
            }
            expect(Actions.Delete(content)).to.deep.equal(expectedAction)
        });
        it('should create an action to delete content success', () => {
            const expectedAction = {
                type: 'DELETE_CONTENT_SUCCESS',
                index: 0, 
                id: 123
            }
            expect(Actions.DeleteSuccess(0, 123)).to.deep.equal(expectedAction)
        });
        it('should create an action to delete content failure', () => {
            const expectedAction = {
                type: 'DELETE_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.DeleteFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('DeleteBatchContent', () => {
        it('should create an action to a delete content request', () => {
            const expectedAction = {
                type: 'DELETE_BATCH_REQUEST',
                path: path,
                ids: ['1', '2', '3'],
                permanently: false
            }
            expect(Actions.DeleteBatch(path, ['1', '2', '3'], false)).to.deep.equal(expectedAction)
        });
        it('should create an action to a delete content request', () => {
            const expectedAction = {
                type: 'DELETE_BATCH_REQUEST',
                path: path,
                ids: ['1', '2', '3'],
                permanently: false
            }
            expect(Actions.DeleteBatch(path, ['1', '2', '3'])).to.deep.equal(expectedAction)
        });
        it('should create an action to delete content success', () => {
            const expectedAction = {
                type: 'DELETE_BATCH_SUCCESS',
                ids: [0, 1, 2]
            }
            expect(Actions.DeleteBatchSuccess([0, 1, 2])).to.deep.equal(expectedAction)
        });
        it('should create an action to delete content failure', () => {
            const expectedAction = {
                type: 'DELETE_BATCH_FAILURE',
                message: 'error'
            }
            expect(Actions.DeleteBatchFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('CheckoutContent', () => {
        const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
        it('should create an action to a checkout content request', () => {
            const expectedAction = {
                type: 'CHECKOUT_CONTENT_REQUEST',
                content
            }
            expect(Actions.CheckOut(content)).to.deep.equal(expectedAction)
        });
        it('should create an action to checkout content success', () => {
            const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
            expect(Actions.CheckOutSuccess(content).response.DisplayName).to.deep.equal('My content')
        });
        it('should create an action to checkout content failure', () => {
            const expectedAction = {
                type: 'CHECKOUT_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.CheckOutFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('CheckinContent', () => {
        const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
        it('should create an action to a checkin content request', () => {
            const expectedAction = {
                type: 'CHECKIN_CONTENT_REQUEST',
                content,
                checkInComment: 'comment'
            }
            expect(Actions.CheckIn(content, 'comment')).to.deep.equal(expectedAction)
        });
        it('should create an action to a checkin content request', () => {
            const expectedAction = {
                type: 'CHECKIN_CONTENT_REQUEST',
                content,
                checkInComment: ''
            }
            expect(Actions.CheckIn(content)).to.deep.equal(expectedAction)
        });
        it('should create an action to checkin content success', () => {
            const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
            expect(Actions.CheckInSuccess(content).response.DisplayName).to.deep.equal('My content')
        });
        it('should create an action to checkin content failure', () => {
            const expectedAction = {
                type: 'CHECKIN_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.CheckInFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('PublishContent', () => {
        const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
        it('should create an action to a publish content request', () => {
            const expectedAction = {
                type: 'PUBLISH_CONTENT_REQUEST',
                content
            }
            expect(Actions.Publish(content)).to.deep.equal(expectedAction)
        });
        it('should create an action to publish content success', () => {
            const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
            expect(Actions.PublishSuccess(content).response.DisplayName).to.deep.equal('My content')
        });
        it('should create an action to publish content failure', () => {
            const expectedAction = {
                type: 'PUBLISH_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.PublishFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('ApproveContent', () => {
        const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
        it('should create an action to an approve content request', () => {
            const expectedAction = {
                type: 'APPROVE_CONTENT_REQUEST',
                content
            }
            expect(Actions.Approve(content)).to.deep.equal(expectedAction)
        });
        it('should create an action to approve content success', () => {
            const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
            expect(Actions.ApproveSuccess(content).response.DisplayName).to.deep.equal('My content')
        });
        it('should create an action to approve content failure', () => {
            const expectedAction = {
                type: 'APPROVE_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.ApproveFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('RejectContent', () => {
        const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
        it('should create an action to an reject content request', () => {
            const expectedAction = {
                type: 'REJECT_CONTENT_REQUEST',
                content,
                rejectReason: 'reason'
            }
            expect(Actions.Reject(content, 'reason')).to.deep.equal(expectedAction)
        });
        it('should create an action to an reject content request', () => {
            const expectedAction = {
                type: 'REJECT_CONTENT_REQUEST',
                content,
                rejectReason: ''
            }
            expect(Actions.Reject(content)).to.deep.equal(expectedAction)
        });
        it('should create an action to reject content success', () => {
            const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
            expect(Actions.RejectSuccess(content).response.DisplayName).to.deep.equal('My content')
        });
        it('should create an action to reject content failure', () => {
            const expectedAction = {
                type: 'REJECT_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.RejectFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('UndoCheckoutContent', () => {
        const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
        it('should create an action to an undo-checkout content request', () => {
            const expectedAction = {
                type: 'UNDOCHECKOUT_CONTENT_REQUEST',
                content
            }
            expect(Actions.UndoCheckout(content)).to.deep.equal(expectedAction)
        });
        it('should create an action to undo-checkout content success', () => {
            const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
            expect(Actions.UndoCheckoutSuccess(content).response.DisplayName).to.deep.equal('My content')
        });
        it('should create an action to undo-checkout content failure', () => {
            const expectedAction = {
                type: 'UNDOCHECKOUT_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.UndoCheckoutFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('ForceUndoCheckoutContent', () => {
        const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
        it('should create an action to a force undo-checkout content request', () => {
            const expectedAction = {
                type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST',
                content
            }
            expect(Actions.ForceUndoCheckout(content)).to.deep.equal(expectedAction)
        });
        it('should create an action to force undo-checkout content success', () => {
            const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
            expect(Actions.ForceUndoCheckoutSuccess(content).response.DisplayName).to.deep.equal('My content')
        });
        it('should create an action to force undo-checkout content failure', () => {
            const expectedAction = {
                type: 'FORCEUNDOCHECKOUT_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.ForceUndoCheckoutFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('RestoreVersion', () => {
        const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
        it('should create an action to a version restore request', () => {
            const expectedAction = {
                type: 'RESTOREVERSION_CONTENT_REQUEST',
                content,
                version: 'A.1.0'
            }
            expect(Actions.RestoreVersion(content, 'A.1.0')).to.deep.equal(expectedAction)
        });
        it('should create an action to a version restore success', () => {
            const content = Content.Create({ DisplayName: 'My content', Id: 123 }, ContentTypes.Task, repo)
            expect(Actions.RestoreVersionSuccess(content).response.DisplayName).to.deep.equal('My content')
        });
        it('should create an action to a version restore failure', () => {
            const expectedAction = {
                type: 'RESTOREVERSION_CONTENT_FAILURE',
                message: 'error'
            }
            expect(Actions.RestoreVersionFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('UserLogin', () => {
        it('should create an action to a user login request', () => {
            const expectedAction = {
                type: 'USER_LOGIN_REQUEST',
                userName: 'alba',
                password: 'alba'
            }
            expect(Actions.UserLogin('alba', 'alba')).to.deep.equal(expectedAction)
        });
        it('should create an action to a user login success', () => {
            const expectedAction = {
                type: 'USER_LOGIN_SUCCESS',
                response: true
            }
            expect(Actions.UserLoginSuccess(true)).to.deep.equal(expectedAction)
        });
        it('should create an action to a user login failure', () => {
            const expectedAction = {
                type: 'USER_LOGIN_FAILURE',
                message: 'error'
            }
            expect(Actions.UserLoginFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
        it('should create an action to a user login failure with the proper message when 403', () => {
            const expectedAction = {
                type: 'USER_LOGIN_FAILURE',
                message: 'The username or the password is not valid!'
            }
            expect(Actions.UserLoginFailure({ message: 'The username or the password is not valid!', status: 403 })).to.deep.equal(expectedAction)
        });
    });
    describe('UserLogout', () => {
        it('should create an action to a user logout request', () => {
            const expectedAction = {
                type: 'USER_LOGOUT_REQUEST'
            }
            expect(Actions.UserLogout()).to.deep.equal(expectedAction)
        });
        it('should create an action to a user logout success', () => {
            const expectedAction = {
                type: 'USER_LOGOUT_SUCCESS'
            }
            expect(Actions.UserLogoutSuccess({})).to.deep.equal(expectedAction)
        });
        it('should create an action to a user logout failure', () => {
            const expectedAction = {
                type: 'USER_LOGOUT_FAILURE',
                message: 'error'
            }
            expect(Actions.UserLogoutFailure({ message: 'error' })).to.deep.equal(expectedAction)
        });
    });
    describe('CheckLoginState', () => {
        it('should return the current authentication state', () => {
            const expectedAction = {
                type: 'CHECK_LOGIN_STATE_REQUEST'
            }
            expect(Actions.CheckLoginState()).to.deep.equal(expectedAction)
        });
    });
    describe('UserChanged', () => {
        it('should return the user changed action', () => {
            const user = Content.Create({ Name: 'alba' }, ContentTypes.User, repo)
            const expectedAction = {
                type: 'USER_CHANGED',
                user
            }
            expect(Actions.UserChanged(user)).to.deep.equal(expectedAction)
        });
    });
});