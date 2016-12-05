///<reference path="../node_modules/@types/mocha/index.d.ts"/>
import 'rxjs';
import * as nock from 'nock';
import * as Chai from 'chai';
import configureMockStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';
import * as SN from 'sn-client-js';
import { Epics } from '../src/Epics'
const expect = Chai.expect;

describe('Epics', () => {
    describe('fetchContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.fetchContentEpic);
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics.fetchContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'FETCH_CONTENT_REQUEST', path: '/workspaces/Project' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'FETCH_CONTENT_REQUEST',
                    path: '/workspaces/Project'
                },
                {
                    type: 'FETCH_CONTENT_FAILURE',
                    filter: 'undefined',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
    describe('createContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.createContentEpic);
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics.createContentEpic);
        });
        it('handles the error', () => {
            const content = SN.Content.Create('Article', { DisplayName: 'My article' })
            store.dispatch({ type: 'CREATE_CONTENT_REQUEST', path: '/workspaces/Project', content });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'CREATE_CONTENT_REQUEST',
                    path: '/workspaces/Project',
                    content
                },
                {
                    type: 'CREATE_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
    describe('updateContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.updateContentEpic);
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            nock.cleanAll();
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
        const epicMiddleware = createEpicMiddleware(Epics.deleteContentEpic);
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            nock.cleanAll();
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
        const epicMiddleware = createEpicMiddleware(Epics.deleteBatchEpic);
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            nock.cleanAll();
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
        const epicMiddleware = createEpicMiddleware(Epics.checkoutContentEpic);
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics.checkoutContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'CHECKOUT_CONTENT_REQUEST', id: 111 });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'CHECKOUT_CONTENT_REQUEST',
                    id: 111
                },
                {
                    type: 'CHECKOUT_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
    describe('checkinContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.checkinContentEpic);
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics.checkinContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'CHECKIN_CONTENT_REQUEST', id: 111, checkinComment: 'comment' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'CHECKIN_CONTENT_REQUEST',
                    id: 111,
                    checkinComment: 'comment'
                },
                {
                    type: 'CHECKIN_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
    describe('publishContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.publishContentEpic);
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics.publishContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'PUBLISH_CONTENT_REQUEST', id: 111 });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'PUBLISH_CONTENT_REQUEST',
                    id: 111
                },
                {
                    type: 'PUBLISH_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
    describe('approveContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.approveContentEpic);
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics.approveContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'APPROVE_CONTENT_REQUEST', id: 111 });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'APPROVE_CONTENT_REQUEST',
                    id: 111
                },
                {
                    type: 'APPROVE_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
    describe('rejectContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.rejectContentEpic);
        const mockStore = configureMockStore([epicMiddleware]);

        beforeEach(() => {
            store = mockStore();
        });

        afterEach(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics.rejectContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'REJECT_CONTENT_REQUEST', id: 111, rejectReason: 'reason' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'REJECT_CONTENT_REQUEST',
                    id: 111,
                    rejectReason: 'reason'
                },
                {
                    type: 'REJECT_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'REJECT_CONTENT_REQUEST', id: 111 });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'REJECT_CONTENT_REQUEST',
                    id: 111
                },
                {
                    type: 'REJECT_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
    describe('undocheckoutContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.undocheckoutContentEpic);
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics.undocheckoutContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'UNDOCHECKOUT_CONTENT_REQUEST', id: 111 });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'UNDOCHECKOUT_CONTENT_REQUEST',
                    id: 111
                },
                {
                    type: 'UNDOCHECKOUT_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
    describe('forceundocheckoutContent Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.forceundocheckoutContentEpic);
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics.forceundocheckoutContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST', id: 111 });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST',
                    id: 111
                },
                {
                    type: 'FORCEUNDOCHECKOUT_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
    describe('restoreVersion Epic', () => {
        let store;
        const epicMiddleware = createEpicMiddleware(Epics.restoreversionContentEpic);
        const mockStore = configureMockStore([epicMiddleware]);

        before(() => {
            store = mockStore();
        });

        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics.restoreversionContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'RESTOREVERSION_CONTENT_REQUEST', id: 111, version: 'A.1.0' });
            expect(store.getActions()).to.be.deep.eq(
                [{
                    type: 'RESTOREVERSION_CONTENT_REQUEST',
                    id: 111, 
                    version: 'A.1.0'
                },
                {
                    type: 'RESTOREVERSION_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        })
    });
});