import * as Chai from 'chai';
import configureMockStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';
import { Mocks, ContentTypes, Authentication } from 'sn-client-js';
import { Epics } from '../src/Epics'
import { Actions } from '../src/Actions'
const expect = Chai.expect;
import 'rxjs';

let store, repo: Mocks.MockRepository, epicMiddleware, mockStore, content;
const initBefores = (epic) => {
    repo = new Mocks.MockRepository();
    epicMiddleware = createEpicMiddleware(epic, { dependencies: { repository: repo } })
    mockStore = configureMockStore([epicMiddleware]);
    store = mockStore();
    content = repo.HandleLoadedContent({ DisplayName: 'My Content', Id: 123, Path: '/workspaces', Name: 'MyContent' }, ContentTypes.Task)
}


describe('Epics', () => {

    beforeEach(() => {
        (repo.HttpProviderRef as Mocks.MockHttpProvider).AddError({ message: 'XMLHttpRequest is not supported by your browser' });
    })
    describe('fetchContent Epic', () => {

        before(() => {
            initBefores(Epics.fetchContentEpic)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.fetchContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'FETCH_CONTENT_REQUEST', path: '/workspaces/Project', options: {} });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'FETCH_CONTENT_REQUEST',
                    path: '/workspaces/Project',
                    options:
                    {
                        select: ['Id', 'Path', 'Name', 'Type', 'DisplayName', 'Description', 'Icon'],
                        metadata: 'no',
                        inlinecount: 'allpages',
                        expand: undefined,
                        top: 1000
                    }
                }]);
        })
    });
    describe('initSensenetStoreEpic Epic', () => {
        before(() => {
            initBefores(Epics.initSensenetStoreEpic)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.initSensenetStoreEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'INIT_SENSENET_STORE', path: '/workspaces', options: {} });
            expect(store.getActions()).to.be.deep.equal([
                {
                    type: 'INIT_SENSENET_STORE',
                    path: '/workspaces',
                    options:
                    {
                        select: ['Id',
                            'Path',
                            'Name',
                            'Type',
                            'DisplayName',
                            'Description',
                            'Icon'],
                        metadata: 'no',
                        inlinecount: 'allpages',
                        expand: undefined,
                        top: 1000
                    }
                },
                {
                    type: 'LOAD_REPOSITORY',
                    repository: repo.Config
                },
                { type: 'USER_LOGIN_FAILURE', message: null }]);
        })
    })

    describe('loadContent Epic', () => {

        before(() => {
            initBefores(Epics.loadContentEpic)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.loadContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'LOAD_CONTENT_REQUEST', path: '/workspaces/Project', options: {} });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'LOAD_CONTENT_REQUEST',
                    path: '/workspaces/Project',
                    options:
                    {
                        select: ['Id',
                            'Path',
                            'Name',
                            'Type',
                            'DisplayName',
                            'Description',
                            'Icon'],
                        metadata: 'no',
                        inlinecount: 'allpages',
                        expand: undefined,
                        top: 1000
                    }
                }]);
        })
    });
    describe('reloadContent Epic', () => {

        before(() => {
            initBefores(Epics.reloadContentEpic)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.reloadContentEpic);
        });

        it('handles the error', () => {
            content.Save('/workspaces')
            store.dispatch({ type: 'RELOAD_CONTENT_REQUEST', content, options: {} });
            expect(store.getActions()).to.be.deep.eq([
                {
                    type: 'RELOAD_CONTENT_REQUEST',
                    content,
                    options: {}
                }]);
        })
        it('handles the error', () => {
            store.dispatch({ type: 'RELOAD_CONTENT_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'RELOAD_CONTENT_REQUEST',
                    content,
                    options: {}
                },
                { type: 'RELOAD_CONTENT_FAILURE', error: 'error' }]);
        })
    });
    describe('reloadContentFields Epic', () => {
        before(() => {
            initBefores(Epics.reloadContentFieldsEpic)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.reloadContentFieldsEpic);
        });

        it('handles the error', () => {
            store.dispatch({ type: 'RELOAD_CONTENTFIELDS_REQUEST', content, options: {}, fields: ['DisplayName'] });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'RELOAD_CONTENTFIELDS_REQUEST',
                    content: content,
                    options: {},
                    fields: ['DisplayName']
                }]);
        })
        it('handles the error', () => {
            store.dispatch({ type: 'RELOAD_CONTENTFIELDS_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'RELOAD_CONTENTFIELDS_REQUEST',
                    content,
                    options: {},
                    fields: ['DisplayName']
                },
                { type: 'RELOAD_CONTENTFIELDS_FAILURE', error: 'error' }]);
        })
    });
    describe('createContent Epic', () => {
        before(() => {
            initBefores(Epics.createContentEpic)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.createContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'CREATE_CONTENT_REQUEST', content });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'CREATE_CONTENT_REQUEST',
                    content: content
                },
                {
                    type: 'CREATE_CONTENT_SUCCESS',
                    response: { entities: { entities: { '123': content } }, result: 123 }
                }]);
        })
        it('handles the error', () => {
            store.dispatch({ type: 'CREATE_CONTENT_FAILURE', error: { message: 'error' } });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'CREATE_CONTENT_REQUEST',
                    content: content
                },
                {
                    type: 'CREATE_CONTENT_SUCCESS',
                    response: { entities: { entities: { '123': content } }, result: 123 }
                },
                { type: 'CREATE_CONTENT_FAILURE', error: { message: 'error' } }]);
        })
    });
    describe('updateContent Epic', () => {
        before(() => {
            initBefores(Epics.updateContentEpic)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.updateContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'UPDATE_CONTENT_REQUEST', content });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'UPDATE_CONTENT_REQUEST',
                    content
                },
                {
                    type: 'UPDATE_CONTENT_SUCCESS',
                    response: content
                }]);
        })
        it('handles the error', () => {
            store.dispatch({ type: 'UPDATE_CONTENT_FAILURE', error: { message: 'error' } });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'UPDATE_CONTENT_REQUEST',
                    content: content
                },
                {
                    type: 'UPDATE_CONTENT_SUCCESS',
                    response: content
                },
                { type: 'UPDATE_CONTENT_FAILURE', error: { message: 'error' } }]);
        })
    });
    describe('deleteContent Epic', () => {
        before(() => {
            initBefores(Epics.deleteContentEpic)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.deleteContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'DELETE_CONTENT_REQUEST', content, permanently: false });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'DELETE_CONTENT_REQUEST',
                    content,
                    permanently: false
                }]);
        })
        it('handles the error', () => {
            store.dispatch({ type: 'DELETE_CONTENT_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'DELETE_CONTENT_REQUEST',
                    content,
                    permanently: false
                },
                { type: 'DELETE_CONTENT_FAILURE', error: 'error' }]);
        })
    });
    describe('deleteBatch Epic', () => {
        before(() => {
            initBefores(Epics.deleteBatchEpic)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.deleteBatchEpic);
        });
        it('handles the error', () => {
            store.dispatch({
                type: 'DELETE_BATCH_REQUEST', contentItems: {
                    1: {
                        DisplaName: 'aaa',
                        Id: 1
                    },
                    2: {
                        DisplaName: 'bbb',
                        Id: 2
                    }
                }, permanently: false
            });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'DELETE_BATCH_REQUEST',
                    contentItems: {
                        1: {
                            DisplaName: 'aaa',
                            Id: 1
                        },
                        2: {
                            DisplaName: 'bbb',
                            Id: 2
                        }
                    },
                    permanently: false
                }]);
        })
        it('handles the error', () => {
            store.dispatch({ type: 'DELETE_BATCH_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'DELETE_BATCH_REQUEST',
                    contentItems: {
                        1: {
                            DisplaName: 'aaa',
                            Id: 1
                        },
                        2: {
                            DisplaName: 'bbb',
                            Id: 2
                        }
                    },
                    permanently: false
                },
                { type: 'DELETE_BATCH_FAILURE', error: 'error' }]);
        })
    });
    describe('copyBatch Epic', () => {
        before(() => {
            initBefores(Epics.copyBatchEpic)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.copyBatchEpic);
        });

        it('handles the error', () => {
            store.dispatch({ type: 'COPY_BATCH_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{ type: 'COPY_BATCH_FAILURE', error: 'error' }]);
        })
    });
    describe('moveBatch Epic', () => {
        before(() => {
            initBefores(Epics.moveBatchEpic)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.moveBatchEpic);
        });

        it('handles the error', () => {
            store.dispatch({ type: 'MOVE_BATCH_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{ type: 'MOVE_BATCH_FAILURE', error: 'error' }]);
        })
    });
    describe('checkoutContent Epic', () => {
        before(() => {
            initBefores(Epics.checkoutContentEpic)
        });
        after(() => {
            epicMiddleware.replaceEpic(Epics.checkoutContentEpic);
        });
        it('handles the error', () => {
            (repo.HttpProviderRef as Mocks.MockHttpProvider).AddError({ message: 'Checkout Content failed' });
            store.dispatch({ type: 'CHECKOUT_CONTENT_REQUEST', content });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'CHECKOUT_CONTENT_REQUEST',
                    content
                }]);
        })
        it('handles the error', () => {
            store.dispatch({ type: 'CHECKOUT_CONTENT_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'CHECKOUT_CONTENT_REQUEST',
                    content
                },
                { type: 'CHECKOUT_CONTENT_FAILURE', error: 'error' }]);
        })
    });
    describe('checkinContent Epic', () => {
        before(() => {
            initBefores(Epics.checkinContentEpic)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.checkinContentEpic);
        });
        it('handles the error', () => {
            (repo.HttpProviderRef as Mocks.MockHttpProvider).AddError({ message: 'Checkin Content failed' });

            store.dispatch({ type: 'CHECKIN_CONTENT_REQUEST', content, checkinComment: 'comment' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'CHECKIN_CONTENT_REQUEST',
                    content,
                    checkinComment: 'comment'
                }]);
        })
        it('handles the error', () => {
            (repo.HttpProviderRef as Mocks.MockHttpProvider).AddError({ message: 'Checkin Content failed' });

            store.dispatch({ type: 'CHECKIN_CONTENT_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'CHECKIN_CONTENT_REQUEST',
                    content,
                    checkinComment: 'comment'
                },
                { type: 'CHECKIN_CONTENT_FAILURE', error: 'error' }]);
        })
    });
    describe('publishContent Epic', () => {
        before(() => {
            initBefores(Epics.publishContentEpic)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.publishContentEpic);
        });
        it('handles the error', () => {
            (repo.HttpProviderRef as Mocks.MockHttpProvider).AddError({ message: 'Publish Content failed' });
            store.dispatch({ type: 'PUBLISH_CONTENT_REQUEST', content });

            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'PUBLISH_CONTENT_REQUEST',
                    content
                }]);
        })
        it('handles the error', () => {
            (repo.HttpProviderRef as Mocks.MockHttpProvider).AddError({ message: 'Publish Content failed' });
            store.dispatch({ type: 'PUBLISH_CONTENT_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'PUBLISH_CONTENT_REQUEST',
                    content
                },
                { type: 'PUBLISH_CONTENT_FAILURE', error: 'error' }]);
        })
    });
    describe('approveContent Epic', () => {
        before(() => {
            initBefores(Epics.approveContentEpic)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.approveContentEpic);
        });
        it('handles the error', () => {
            (repo.HttpProviderRef as Mocks.MockHttpProvider).AddError({ message: 'Approve Content failed' });
            store.dispatch({ type: 'APPROVE_CONTENT_REQUEST', content });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'APPROVE_CONTENT_REQUEST',
                    content
                }]);
        })
        it('handles the error', () => {
            (repo.HttpProviderRef as Mocks.MockHttpProvider).AddError({ message: 'Approve Content failed' });
            store.dispatch({ type: 'APPROVE_CONTENT_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'APPROVE_CONTENT_REQUEST',
                    content
                },
                { type: 'APPROVE_CONTENT_FAILURE', error: 'error' }]);
        })
    });
    describe('rejectContent Epic', () => {
        before(() => {
            initBefores(Epics.rejectContentEpic)
        });

        afterEach(() => {
            epicMiddleware.replaceEpic(Epics.rejectContentEpic);
        });
        it('handles the error', () => {
            (repo.HttpProviderRef as Mocks.MockHttpProvider).AddError({ message: 'Reject Content failed' });
            store.dispatch({ type: 'REJECT_CONTENT_REQUEST', content, rejectReason: 'reason' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'REJECT_CONTENT_REQUEST',
                    content,
                    rejectReason: 'reason'
                }]);
        });
        it('handles the error', () => {
            (repo.HttpProviderRef as Mocks.MockHttpProvider).AddError({ message: 'Reject Content failed' });
            store.dispatch({ type: 'REJECT_CONTENT_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'REJECT_CONTENT_REQUEST',
                    content,
                    rejectReason: 'reason'
                },
                { type: '@@redux-observable/EPIC_END' },
                { type: 'REJECT_CONTENT_FAILURE', error: 'error' }]);
        });
    });
    describe('undocheckoutContent Epic', () => {
        before(() => {
            initBefores(Epics.undocheckoutContentEpic)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.undocheckoutContentEpic);
        });
        it('handles the error', () => {
            (repo.HttpProviderRef as Mocks.MockHttpProvider).AddError({ message: 'Undo Checkout failed' });
            store.dispatch({ type: 'UNDOCHECKOUT_CONTENT_REQUEST', content });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'UNDOCHECKOUT_CONTENT_REQUEST',
                    content
                }]);
        })
        it('handles the error', () => {
            (repo.HttpProviderRef as Mocks.MockHttpProvider).AddError({ message: 'Undo Checkout failed' });
            store.dispatch({ type: 'UNDOCHECKOUT_CONTENT_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'UNDOCHECKOUT_CONTENT_REQUEST',
                    content
                },
                { type: 'UNDOCHECKOUT_CONTENT_FAILURE', error: 'error' }]);
        })
    });
    describe('forceundocheckoutContent Epic', () => {
        before(() => {
            initBefores(Epics.forceundocheckoutContentEpic)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.forceundocheckoutContentEpic);
        });
        it('handles the error', () => {
            (repo.HttpProviderRef as Mocks.MockHttpProvider).AddError({ message: 'ForceUndoCheckout failed' });
            store.dispatch({ type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST', content });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST',
                    content
                }]);
        })
        it('handles the error', () => {
            (repo.HttpProviderRef as Mocks.MockHttpProvider).AddError({ message: 'ForceUndoCheckout failed' });
            store.dispatch({ type: 'FORCEUNDOCHECKOUT_CONTENT_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST',
                    content
                },
                { type: 'FORCEUNDOCHECKOUT_CONTENT_FAILURE', error: 'error' }]);
        })
    });
    describe('restoreVersion Epic', () => {
        before(() => {
            initBefores(Epics.restoreversionContentEpic)
        });
        after(() => {
            epicMiddleware.replaceEpic(Epics.restoreversionContentEpic);
        });
        it('handles the error', () => {
            (repo.HttpProviderRef as Mocks.MockHttpProvider).AddError({ message: 'Restore failed' });
            store.dispatch({ type: 'RESTOREVERSION_CONTENT_REQUEST', content, version: 'A.1.0' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'RESTOREVERSION_CONTENT_REQUEST',
                    content,
                    version: 'A.1.0'
                }]);
        });
        it('handles the error', () => {
            (repo.HttpProviderRef as Mocks.MockHttpProvider).AddError({ message: 'Restore failed' });
            store.dispatch({ type: 'RESTOREVERSION_CONTENT_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'RESTOREVERSION_CONTENT_REQUEST',
                    content,
                    version: 'A.1.0'
                },
                { type: 'RESTOREVERSION_CONTENT_FAILURE', error: 'error' }]);
        });
    });
    describe('login Epic', () => {
        before(() => {
            initBefores(Epics.userLoginEpic)
        });

        afterEach(() => {
            epicMiddleware.replaceEpic(Epics.userLoginEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'USER_LOGIN_REQUEST', username: 'alba', password: 'alba' });
            (repo.Authentication as Mocks.MockAuthService).StateSubject.next(Authentication.LoginState.Unauthenticated);
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'USER_LOGIN_REQUEST',
                    username: 'alba',
                    password: 'alba'
                },
                { type: 'USER_LOGIN_FAILURE', message: 'Failed to log in.' }]);
        })
        it('handles the loggedin user', () => {
            store.dispatch({ type: 'USER_LOGIN_REQUEST', username: 'user', password: 'password' });
            (repo.Authentication as Mocks.MockAuthService).StateSubject.next(Authentication.LoginState.Authenticated);
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'USER_LOGIN_REQUEST',
                    username: 'alba',
                    password: 'alba'
                },
                { type: 'USER_LOGIN_FAILURE', message: 'Failed to log in.' },
                { type: '@@redux-observable/EPIC_END' },
                {
                    type: 'USER_LOGIN_REQUEST',
                    username: 'user',
                    password: 'password'
                },
                { type: 'USER_LOGIN_FAILURE', message: 'Failed to log in.' }]);
        })
    });
    describe('logout Epic', () => {
        before(() => {
            initBefores(Epics.userLogoutEpic)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.userLogoutEpic);
        });
        it('handles the success', () => {
            (repo.Authentication as Mocks.MockAuthService).StateSubject.next(Authentication.LoginState.Unauthenticated);
            store.dispatch({ type: 'USER_LOGOUT_REQUEST', id: 111, username: 'alba', password: 'alba' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'USER_LOGOUT_REQUEST',
                    id: 111,
                    username: 'alba',
                    password: 'alba'
                },
                { type: 'USER_LOGOUT_SUCCESS' }]);
        })
        it('handles the error', () => {
            (repo.Authentication as Mocks.MockAuthService).StateSubject.next(Authentication.LoginState.Authenticated);
            store.dispatch({ type: 'USER_LOGOUT_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'USER_LOGOUT_REQUEST',
                    id: 111,
                    username: 'alba',
                    password: 'alba'
                },
                { type: 'USER_LOGOUT_SUCCESS' },
                { type: 'USER_LOGOUT_FAILURE', error: 'error' }]);
        })
    });
    describe('checkLoginState Epic', () => {
        beforeEach(() => {
            initBefores(Epics.checkLoginStateEpic)
        });

        afterEach(() => {
            epicMiddleware.replaceEpic(Epics.userLoginEpic);
        });
        it('handles a loggedin user', () => {
            const user = repo.CreateContent({ Name: 'alba', Id: 2, Path: '/Root' }, ContentTypes.User);
            store.dispatch(Actions.UserLoginSuccess(user));
            (repo.Authentication as Mocks.MockAuthService).StateSubject.next(Authentication.LoginState.Authenticated);
            store.dispatch({ type: 'CHECK_LOGIN_STATE_REQUEST' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'USER_LOGIN_SUCCESS',
                    response: user
                },
                { type: 'CHECK_LOGIN_STATE_REQUEST' },
                { type: 'USER_LOGIN_BUFFER', response: true }
                ]);
        })
        it('handles an error', () => {
            repo.Authentication.StateSubject.next(Authentication.LoginState.Unauthenticated);
            store.dispatch({ type: 'CHECK_LOGIN_STATE_REQUEST' });
            expect(store.getActions()).to.be.deep.eq(
                [{ type: 'CHECK_LOGIN_STATE_REQUEST' },
                { type: 'USER_LOGIN_FAILURE', message: null }]);
        })
    });
    describe('getContentActions Epic', () => {
        before(() => {
            initBefores(Epics.getContentActions)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.getContentActions);
        });
        it('handles the success', () => {
            store.dispatch({ type: 'REQUEST_CONTENT_ACTIONS', content, scenario: 'DMSDemoScenario' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'REQUEST_CONTENT_ACTIONS',
                    content: content,
                    scenario: 'DMSDemoScenario'
                }]);
        })
        it('handles the error', () => {
            store.dispatch({ type: 'REQUEST_CONTENT_ACTIONS_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'REQUEST_CONTENT_ACTIONS',
                    content,
                    scenario: 'DMSDemoScenario'
                },
                { type: 'REQUEST_CONTENT_ACTIONS_FAILURE', error: 'error' }]);
        })
    });
    describe('loadContentActionsEpic Epic', () => {
        before(() => {
            initBefores(Epics.loadContentActionsEpic)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.loadContentActionsEpic);
        });
        it('handles the success', () => {
            store.dispatch({ type: 'LOAD_CONTENT_ACTIONS', content, scenario: 'DMSDemoScenario' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'LOAD_CONTENT_ACTIONS',
                    content,
                    scenario: 'DMSDemoScenario'
                },
                ]);
        })
        it('handles the error', () => {
            store.dispatch({ type: 'LOAD_CONTENT_ACTIONS_FAILURE', error: 'error' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'LOAD_CONTENT_ACTIONS',
                    content,
                    scenario: 'DMSDemoScenario'
                },
                { type: 'LOAD_CONTENT_ACTIONS_FAILURE', error: 'error' }]);
        })
    });
    describe('userLoginBufferEpic Epic', () => {
        before(() => {
            initBefores(Epics.userLoginBufferEpic)
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.userLoginBufferEpic);
        });
        it('handles the success', () => {
            store.dispatch({ type: 'USER_LOGIN_BUFFER', response: true });
            expect(store.getActions()).to.be.deep.eq(
                [{ type: 'USER_LOGIN_BUFFER', response: true }]);
        })
    })
});