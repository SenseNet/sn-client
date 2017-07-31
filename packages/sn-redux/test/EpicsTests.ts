import * as Chai from 'chai';
import configureMockStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';
import { Mocks, ContentTypes, HttpProviders, Authentication, ODataApi, Content } from 'sn-client-js';
import { Epics } from '../src/Epics'
const expect = Chai.expect;
import 'rxjs';

describe('Epics', () => {

    let repo: Mocks.MockRepository = new Mocks.MockRepository();
    (repo.Authentication as Mocks.MockAuthService).stateSubject.next(Authentication.LoginState.Authenticated);
    (repo.httpProviderRef as Mocks.MockHttpProvider).UseTimeout = false;

    beforeEach(() => {
        (repo.httpProviderRef as Mocks.MockHttpProvider).setError({message: 'XMLHttpRequest is not supported by your browser'});

    })
    describe('fetchContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.fetchContentEpic, {dependencies: {repository: repo}});
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
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
                    options: {}
                },
                {
                    type: 'FETCH_CONTENT_FAILURE',
                    params: new ODataApi.ODataParams({select: ['Id', 'Type']}),
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
    describe('loadContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.loadContentEpic, {dependencies: {repository: repo}});
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.fetchContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'LOAD_CONTENT_REQUEST', path: '/workspaces/Project', options: {} });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'LOAD_CONTENT_REQUEST',
                    path: '/workspaces/Project',
                    options: {}
                },
                {
                    type: 'LOAD_CONTENT_FAILURE',
                    params: new ODataApi.ODataParams({select: ['Id', 'Type']}),
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
    describe('reloadContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.reloadContentEpic, {dependencies: {repository: repo}});
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.fetchContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'RELOAD_CONTENT_REQUEST', path: '/workspaces/Project', options: {} });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'RELOAD_CONTENT_REQUEST',
                    path: '/workspaces/Project',
                    options: {}
                },
                {
                    type: 'RELOAD_CONTENT_FAILURE',
                    params: new ODataApi.ODataParams({select: ['Id', 'Type']}),
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
    describe('reloadContentFields Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.reloadContentFieldsEpic, {dependencies: {repository: repo}});
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.fetchContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'RELOAD_CONTENTFIELDS_REQUEST', path: '/workspaces/Project', options: {} });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'RELOAD_CONTENTFIELDS_REQUEST',
                    path: '/workspaces/Project',
                    options: {}
                },
                {
                    type: 'RELOAD_CONTENTFIELDS_FAILURE',
                    params: new ODataApi.ODataParams({select: ['Id', 'Type']}),
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
    describe('createContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.createContentEpic, {dependencies: {repository: repo}});
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.createContentEpic);
        });
        it('handles the error', () => {
            const content = new ContentTypes.Task({
                Name: 'My Task',
                DueDate: null
            }, repo)['options'];
            store.dispatch({ type: 'CREATE_CONTENT_REQUEST', path: '/workspaces/Project', content, contentType: Content });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'CREATE_CONTENT_REQUEST',
                    path: '/workspaces/Project',
                    content,
                    contentType: Content
                },
                {
                    type: 'CREATE_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
    describe('updateContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.updateContentEpic, {dependencies: {repository: repo}});
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.updateContentEpic);
        });
        it('handles the error', () => {
            const fields = { DisplayName: 'My article', Index: 2 };
            store.dispatch({ type: 'UPDATE_CONTENT_REQUEST', id: 111, fields });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'UPDATE_CONTENT_REQUEST',
                    id: 111,
                    fields
                },
                {
                    type: 'UPDATE_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
    describe('deleteContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.deleteContentEpic, {dependencies: {repository: repo}});
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.deleteContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'DELETE_CONTENT_REQUEST', id: 111, permanently: false });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'DELETE_CONTENT_REQUEST',
                    id: 111,
                    permanently: false
                },
                {
                    type: 'DELETE_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
    describe('deleteBatch Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.deleteBatchEpic, {dependencies: {repository: repo}});
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.deleteBatchEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'DELETE_BATCH_REQUEST', path: '/workspaces/Project', paths: ['1', '2'], permanently: false });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'DELETE_BATCH_REQUEST',
                    path: '/workspaces/Project',
                    paths: ['1', '2'],
                    permanently: false
                },
                {
                    type: 'DELETE_BATCH_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
    describe('checkoutContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.checkoutContentEpic, {dependencies: {repository: repo}});
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.checkoutContentEpic);
        });
        it('handles the error', () => {
            (repo.httpProviderRef as Mocks.MockHttpProvider).setError({message: 'Checkout Content failed'});
            store.dispatch({ type: 'CHECKOUT_CONTENT_REQUEST', id: 111 });
                expect(store.getActions()).to.be.deep.eq(
                    [{
                        type: 'CHECKOUT_CONTENT_REQUEST',
                        id: 111
                    },
                    {
                        type: 'CHECKOUT_CONTENT_FAILURE',
                        message: 'Checkout Content failed'
                    }]);
        })
    });
    describe('checkinContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.checkinContentEpic, {dependencies: {repository: repo}});
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.checkinContentEpic);
        });
        it('handles the error', () => {

            (repo.httpProviderRef as Mocks.MockHttpProvider).setError({message: 'Checkin Content failed'});

            store.dispatch({ type: 'CHECKIN_CONTENT_REQUEST', id: 111, checkinComment: 'comment' });
                expect(store.getActions()).to.be.deep.eq(
                    [{
                        type: 'CHECKIN_CONTENT_REQUEST',
                        id: 111,
                        checkinComment: 'comment'
                    },
                    {
                        type: 'CHECKIN_CONTENT_FAILURE',
                        message: 'Checkin Content failed'
                    }]);
        })
    });
    describe('publishContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.publishContentEpic, {dependencies: {repository: repo}});
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.publishContentEpic);
        });
        it('handles the error', () => {
            (repo.httpProviderRef as Mocks.MockHttpProvider).setError({message: 'Publish Content failed'});
            store.dispatch({ type: 'PUBLISH_CONTENT_REQUEST', id: 111 });

                expect(store.getActions()).to.be.deep.eq(
                    [{
                        type: 'PUBLISH_CONTENT_REQUEST',
                        id: 111
                    },
                    {
                        type: 'PUBLISH_CONTENT_FAILURE',
                        message: 'Publish Content failed'
                    }]);
        })
    });
    describe('approveContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.approveContentEpic, {dependencies: {repository: repo}});
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.approveContentEpic);
        });
        it('handles the error', () => {
            (repo.httpProviderRef as Mocks.MockHttpProvider).setError({message: 'Approve Content failed'});
            store.dispatch({ type: 'APPROVE_CONTENT_REQUEST', id: 111 });
                expect(store.getActions()).to.be.deep.eq(
                    [{
                        type: 'APPROVE_CONTENT_REQUEST',
                        id: 111
                    },
                    {
                        type: 'APPROVE_CONTENT_FAILURE',
                        message: 'Approve Content failed'
                    }]);
        })
    });
    describe('rejectContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.rejectContentEpic, {dependencies: {repository: repo}});
        const mockStore = configureMockStore([epicMiddleware]);

        beforeEach(() => {
            store = mockStore();
        });

        afterEach(() => {
            epicMiddleware.replaceEpic(Epics.rejectContentEpic);
        });
        it('handles the error', () => {
            (repo.httpProviderRef as Mocks.MockHttpProvider).setError({message: 'Reject Content failed'});
            store.dispatch({ type: 'REJECT_CONTENT_REQUEST', id: 111, rejectReason: 'reason' });
                expect(store.getActions()).to.be.deep.eq(
                    [{
                        type: 'REJECT_CONTENT_REQUEST',
                        id: 111,
                        rejectReason: 'reason'
                    },
                    {
                        type: 'REJECT_CONTENT_FAILURE',
                        message: 'Reject Content failed'
                    }]);
        });
    });
    describe('undocheckoutContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.undocheckoutContentEpic, {dependencies: {repository: repo}});
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.undocheckoutContentEpic);
        });
        it('handles the error', () => {
            (repo.httpProviderRef as Mocks.MockHttpProvider).setError({message: 'Undo Checkout failed'});
            store.dispatch({ type: 'UNDOCHECKOUT_CONTENT_REQUEST', id: 111 });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'UNDOCHECKOUT_CONTENT_REQUEST',
                    id: 111
                },
                {
                    type: 'UNDOCHECKOUT_CONTENT_FAILURE',
                    message: 'Undo Checkout failed'
                }]);
        })
    });
    describe('forceundocheckoutContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.forceundocheckoutContentEpic, {dependencies: {repository: repo}});
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.forceundocheckoutContentEpic);
        });
        it('handles the error', () => {
            (repo.httpProviderRef as Mocks.MockHttpProvider).setError({message: 'ForceUndoCheckout failed'});
            store.dispatch({ type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST', id: 111 });
                expect(store.getActions()).to.be.deep.eq(
                    [{
                        type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST',
                        id: 111
                    },
                    {
                        type: 'FORCEUNDOCHECKOUT_CONTENT_FAILURE',
                        message: 'ForceUndoCheckout failed'
                    }]);
        })
    });
    describe('restoreVersion Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.restoreversionContentEpic, {dependencies: {repository: repo}});
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.restoreversionContentEpic);
        });
        it('handles the error', () => {
            (repo.httpProviderRef as Mocks.MockHttpProvider).setError({message: 'Restore failed'});
            store.dispatch({ type: 'RESTOREVERSION_CONTENT_REQUEST', id: 111, version: 'A.1.0' });
                expect(store.getActions()).to.be.deep.eq(
                    [{
                        type: 'RESTOREVERSION_CONTENT_REQUEST',
                        id: 111,
                        version: 'A.1.0'
                    },
                    {
                        type: 'RESTOREVERSION_CONTENT_FAILURE',
                        message: 'Restore failed'
                    }]);
        });
    });
    describe('login Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.userLoginEpic, {dependencies: {repository: repo}});
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.userLoginEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'USER_LOGIN_REQUEST', id: 111, username: 'alba', password: 'alba' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'USER_LOGIN_REQUEST',
                    id: 111,
                    username: 'alba',
                    password: 'alba'
                },
                {
                    type: 'USER_LOGIN_FAILURE',
                    message: 'Failed to log in.'
                }]);
        })
    });
    describe('logout Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.userLogoutEpic, {dependencies: {repository: repo}});
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.userLogoutEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'USER_LOGOUT_REQUEST', id: 111, username: 'alba', password: 'alba' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'USER_LOGOUT_REQUEST',
                    id: 111,
                    username: 'alba',
                    password: 'alba'
                },
                {
                    type: 'USER_LOGOUT_SUCCESS'
                }]);
        })
    });
    describe('checkLoginState Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.checkLoginStateEpic, {dependencies: {repository: repo}});
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            epicMiddleware.replaceEpic(Epics.userLoginEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'CHECK_LOGIN_STATE_REQUEST' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'CHECK_LOGIN_STATE_REQUEST',
                }]);
        })
    });
});