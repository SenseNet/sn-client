"use strict";
require('rxjs');
const nock = require('nock');
const Chai = require('chai');
const redux_mock_store_1 = require('redux-mock-store');
const redux_observable_1 = require('redux-observable');
const SN = require('sn-client-js');
const Epics_1 = require('../src/Epics');
const expect = Chai.expect;
describe('Epics', () => {
    let window = {
        'siteUrl': 'https://daily.demo.sensenet.com'
    };
    beforeEach(() => {
        window['siteUrl'] = "https://daily.demo.sensenet.com";
    });
    describe('fetchContent Epic', () => {
        let store;
        const epicMiddleware = redux_observable_1.createEpicMiddleware(Epics_1.Epics.fetchContentEpic);
        const mockStore = redux_mock_store_1.default([epicMiddleware]);
        before(() => {
            store = mockStore();
        });
        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics_1.Epics.fetchContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'FETCH_CONTENT_REQUEST', path: '/workspaces/Project' });
            expect(store.getActions()).to.be.deep.eq([{
                    type: 'FETCH_CONTENT_REQUEST',
                    path: '/workspaces/Project'
                },
                {
                    type: 'FETCH_CONTENT_FAILURE',
                    filter: 'undefined',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        });
    });
    describe('createContent Epic', () => {
        let store;
        const epicMiddleware = redux_observable_1.createEpicMiddleware(Epics_1.Epics.createContentEpic);
        const mockStore = redux_mock_store_1.default([epicMiddleware]);
        before(() => {
            store = mockStore();
        });
        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics_1.Epics.createContentEpic);
        });
        it('handles the error', () => {
            const content = SN.Content.Create('Article', { DisplayName: 'My article' });
            store.dispatch({ type: 'CREATE_CONTENT_REQUEST', path: '/workspaces/Project', content });
            expect(store.getActions()).to.be.deep.eq([{
                    type: 'CREATE_CONTENT_REQUEST',
                    path: '/workspaces/Project',
                    content
                },
                {
                    type: 'CREATE_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        });
    });
    describe('updateContent Epic', () => {
        let store;
        const epicMiddleware = redux_observable_1.createEpicMiddleware(Epics_1.Epics.updateContentEpic);
        const mockStore = redux_mock_store_1.default([epicMiddleware]);
        before(() => {
            store = mockStore();
        });
        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics_1.Epics.updateContentEpic);
        });
        it('handles the error', () => {
            const fields = { DisplayName: 'My article', Index: 2 };
            store.dispatch({ type: 'UPDATE_CONTENT_REQUEST', id: 111, fields });
            expect(store.getActions()).to.be.deep.eq([{
                    type: 'UPDATE_CONTENT_REQUEST',
                    id: 111,
                    fields
                },
                {
                    type: 'UPDATE_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        });
    });
    describe('deleteContent Epic', () => {
        let store;
        const epicMiddleware = redux_observable_1.createEpicMiddleware(Epics_1.Epics.deleteContentEpic);
        const mockStore = redux_mock_store_1.default([epicMiddleware]);
        before(() => {
            store = mockStore();
        });
        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics_1.Epics.deleteContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'DELETE_CONTENT_REQUEST', id: 111, permanently: false });
            expect(store.getActions()).to.be.deep.eq([{
                    type: 'DELETE_CONTENT_REQUEST',
                    id: 111,
                    permanently: false
                },
                {
                    type: 'DELETE_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        });
    });
    describe('deleteBatch Epic', () => {
        let store;
        const epicMiddleware = redux_observable_1.createEpicMiddleware(Epics_1.Epics.deleteBatchEpic);
        const mockStore = redux_mock_store_1.default([epicMiddleware]);
        before(() => {
            store = mockStore();
        });
        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics_1.Epics.deleteBatchEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'DELETE_BATCH_REQUEST', path: '/workspaces/Project', paths: ['1', '2'], permanently: false });
            expect(store.getActions()).to.be.deep.eq([{
                    type: 'DELETE_BATCH_REQUEST',
                    path: '/workspaces/Project',
                    paths: ['1', '2'],
                    permanently: false
                },
                {
                    type: 'DELETE_BATCH_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        });
    });
    describe('checkoutContent Epic', () => {
        let store;
        const epicMiddleware = redux_observable_1.createEpicMiddleware(Epics_1.Epics.checkoutContentEpic);
        const mockStore = redux_mock_store_1.default([epicMiddleware]);
        before(() => {
            store = mockStore();
        });
        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics_1.Epics.checkoutContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'CHECKOUT_CONTENT_REQUEST', id: 111 });
            expect(store.getActions()).to.be.deep.eq([{
                    type: 'CHECKOUT_CONTENT_REQUEST',
                    id: 111
                },
                {
                    type: 'CHECKOUT_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        });
    });
    describe('checkinContent Epic', () => {
        let store;
        const epicMiddleware = redux_observable_1.createEpicMiddleware(Epics_1.Epics.checkinContentEpic);
        const mockStore = redux_mock_store_1.default([epicMiddleware]);
        before(() => {
            store = mockStore();
        });
        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics_1.Epics.checkinContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'CHECKIN_CONTENT_REQUEST', id: 111, checkinComment: 'comment' });
            expect(store.getActions()).to.be.deep.eq([{
                    type: 'CHECKIN_CONTENT_REQUEST',
                    id: 111,
                    checkinComment: 'comment'
                },
                {
                    type: 'CHECKIN_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        });
    });
    describe('publishContent Epic', () => {
        let store;
        const epicMiddleware = redux_observable_1.createEpicMiddleware(Epics_1.Epics.publishContentEpic);
        const mockStore = redux_mock_store_1.default([epicMiddleware]);
        before(() => {
            store = mockStore();
        });
        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics_1.Epics.publishContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'PUBLISH_CONTENT_REQUEST', id: 111 });
            expect(store.getActions()).to.be.deep.eq([{
                    type: 'PUBLISH_CONTENT_REQUEST',
                    id: 111
                },
                {
                    type: 'PUBLISH_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        });
    });
    describe('approveContent Epic', () => {
        let store;
        const epicMiddleware = redux_observable_1.createEpicMiddleware(Epics_1.Epics.approveContentEpic);
        const mockStore = redux_mock_store_1.default([epicMiddleware]);
        before(() => {
            store = mockStore();
        });
        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics_1.Epics.approveContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'APPROVE_CONTENT_REQUEST', id: 111 });
            expect(store.getActions()).to.be.deep.eq([{
                    type: 'APPROVE_CONTENT_REQUEST',
                    id: 111
                },
                {
                    type: 'APPROVE_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        });
    });
    describe('rejectContent Epic', () => {
        let store;
        const epicMiddleware = redux_observable_1.createEpicMiddleware(Epics_1.Epics.rejectContentEpic);
        const mockStore = redux_mock_store_1.default([epicMiddleware]);
        beforeEach(() => {
            store = mockStore();
        });
        afterEach(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics_1.Epics.rejectContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'REJECT_CONTENT_REQUEST', id: 111, rejectReason: 'reason' });
            expect(store.getActions()).to.be.deep.eq([{
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
            expect(store.getActions()).to.be.deep.eq([{
                    type: 'REJECT_CONTENT_REQUEST',
                    id: 111
                },
                {
                    type: 'REJECT_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        });
    });
    describe('undocheckoutContent Epic', () => {
        let store;
        const epicMiddleware = redux_observable_1.createEpicMiddleware(Epics_1.Epics.undocheckoutContentEpic);
        const mockStore = redux_mock_store_1.default([epicMiddleware]);
        before(() => {
            store = mockStore();
        });
        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics_1.Epics.undocheckoutContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'UNDOCHECKOUT_CONTENT_REQUEST', id: 111 });
            expect(store.getActions()).to.be.deep.eq([{
                    type: 'UNDOCHECKOUT_CONTENT_REQUEST',
                    id: 111
                },
                {
                    type: 'UNDOCHECKOUT_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        });
    });
    describe('forceundocheckoutContent Epic', () => {
        let store;
        const epicMiddleware = redux_observable_1.createEpicMiddleware(Epics_1.Epics.forceundocheckoutContentEpic);
        const mockStore = redux_mock_store_1.default([epicMiddleware]);
        before(() => {
            store = mockStore();
        });
        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics_1.Epics.forceundocheckoutContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST', id: 111 });
            expect(store.getActions()).to.be.deep.eq([{
                    type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST',
                    id: 111
                },
                {
                    type: 'FORCEUNDOCHECKOUT_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        });
    });
    describe('restoreVersion Epic', () => {
        let store;
        const epicMiddleware = redux_observable_1.createEpicMiddleware(Epics_1.Epics.restoreversionContentEpic);
        const mockStore = redux_mock_store_1.default([epicMiddleware]);
        before(() => {
            store = mockStore();
        });
        after(() => {
            nock.cleanAll();
            epicMiddleware.replaceEpic(Epics_1.Epics.restoreversionContentEpic);
        });
        it('handles the error', () => {
            store.dispatch({ type: 'RESTOREVERSION_CONTENT_REQUEST', id: 111, version: 'A.1.0' });
            expect(store.getActions()).to.be.deep.eq([{
                    type: 'RESTOREVERSION_CONTENT_REQUEST',
                    id: 111,
                    version: 'A.1.0'
                },
                {
                    type: 'RESTOREVERSION_CONTENT_FAILURE',
                    message: 'XMLHttpRequest is not supported by your browser'
                }]);
        });
    });
});

//# sourceMappingURL=EpicsTests.js.map
