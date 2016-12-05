"use strict";
const Reducers_1 = require('../src/Reducers');
const Chai = require('chai');
const expect = Chai.expect;
describe('byId reducer', () => {
    it('should return the initial state', () => {
        expect(Reducers_1.Reducers.byId(undefined, {})).to.be.deep.equal({});
    });
    it('should handle DELETE_CONTENT_SUCCESS', () => {
        const ids = [1, 2, 3];
        expect(Reducers_1.Reducers.byId(ids, { type: 'DELETE_CONTENT_SUCCESS', id: 1 })).to.be.deep.equal({ 0: 1, 2: 3 });
    });
    it('should return a new state with the given response', () => {
        expect(Reducers_1.Reducers.byId({}, { response: { entities: { collection: { a: 0, b: 2 } } } }))
            .to.be.deep.eq({ a: 0, b: 2 });
    });
});
describe('ids reducer', () => {
    it('should return the initial state', () => {
        expect(Reducers_1.Reducers.ids(undefined, {})).to.be.deep.equal([]);
    });
    it('should handle FETCH_CONTENT_SUCCESS', () => {
        expect(Reducers_1.Reducers.ids([], {
            type: 'FETCH_CONTENT_SUCCESS',
            response: {
                result: [5145, 5146],
                entities: {
                    collection: {
                        5145: {
                            Id: 5145,
                            DisplayName: 'Some Article',
                            Status: ['Active']
                        },
                        5146: {
                            Id: 5146,
                            Displayname: 'Other Article',
                            Status: ['Completed']
                        }
                    }
                }
            },
            filter: "?$select=Id,Type&metadata=no"
        }))
            .to.be.deep.equal([5145, 5146]);
    });
    it('should handle ADD_CONTENT_SUCCESS', () => {
        expect(Reducers_1.Reducers.ids([], {
            type: 'ADD_CONTENT_SUCCESS',
            response: {
                entities: {
                    collection: {
                        123: {
                            DisplayName: 'My content',
                            Id: 123
                        }
                    }
                },
                result: 123
            },
            filter: "?$select=Id,Type&metadata=no"
        }))
            .to.be.deep.equal([123]);
    });
    it('should handle DELETE_CONTENT_SUCCESS', () => {
        expect(Reducers_1.Reducers.ids([1, 2, 3], {
            type: 'DELETE_CONTENT_SUCCESS',
            index: 0,
            id: 1
        }))
            .to.be.deep.equal([2, 3]);
    });
});
describe('isFetching reducer', () => {
    it('should return the initial state', () => {
        expect(Reducers_1.Reducers.isFetching(undefined, {})).to.be.eq(false);
    });
    it('should handle FETCH_CONTENT_SUCCESS', () => {
        expect(Reducers_1.Reducers.isFetching(false, { type: 'FETCH_CONTENT_REQUEST' })).to.be.eq(true);
    });
    it('should handle FETCH_CONTENT_SUCCESS', () => {
        expect(Reducers_1.Reducers.isFetching(true, { type: 'FETCH_CONTENT_SUCCESS' })).to.be.eq(false);
    });
    it('should handle FETCH_CONTENT_FAILURE', () => {
        expect(Reducers_1.Reducers.isFetching(true, { type: 'FETCH_CONTENT_FAILURE' })).to.be.eq(false);
    });
});
describe('errorMessage reducer', () => {
    it('should return the initial state', () => {
        expect(Reducers_1.Reducers.errorMessage(undefined, {})).to.be.eq(null);
    });
    it('should handle FETCH_CONTENT_FAILURE', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'FETCH_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
    });
    it('should handle CREATE_CONTENT_FAILURE', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'CREATE_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
    });
    it('should handle UPDATE_CONTENT_FAILURE', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'UPDATE_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
    });
    it('should handle DELETE_CONTENT_FAILURE', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'DELETE_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
    });
    it('should handle CHECKIN_CONTENT_FAILURE', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'CHECKIN_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
    });
    it('should handle CHECKOUT_CONTENT_FAILURE', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'CHECKOUT_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
    });
    it('should handle PUBLISH_CONTENT_FAILURE', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'PUBLISH_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
    });
    it('should handle APPROVE_CONTENT_FAILURE', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'APPROVE_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
    });
    it('should handle REJECT_CONTENT_FAILURE', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'REJECT_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
    });
    it('should handle UNDOCHECKOUT_CONTENT_FAILURE', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'UNDOCHECKOUT_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
    });
    it('should handle FORCEUNDOCHECKOUT_CONTENT_FAILURE', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'FORCEUNDOCHECKOUT_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
    });
    it('should handle RESTOREVERSION_CONTENT_FAILURE', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'RESTOREVERSION_CONTENT_FAILURE', message: 'error' })).to.be.eq('error');
    });
    it('should handle FETCH_CONTENT_REQUEST', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'FETCH_CONTENT_REQUEST' })).to.be.eq(null);
    });
    it('should handle FETCH_CONTENT_SUCCESS', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'FETCH_CONTENT_SUCCESS' })).to.be.eq(null);
    });
    it('should handle CREATE_CONTENT_REQUEST', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'CREATE_CONTENT_REQUEST' })).to.be.eq(null);
    });
    it('should handle CREATE_CONTENT_SUCCESS', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'CREATE_CONTENT_SUCCESS' })).to.be.eq(null);
    });
    it('should handle UPDATE_CONTENT_REQUEST', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'UPDATE_CONTENT_REQUEST' })).to.be.eq(null);
    });
    it('should handle UPDATE_CONTENT_SUCCESS', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'UPDATE_CONTENT_SUCCESS' })).to.be.eq(null);
    });
    it('should handle DELETE_CONTENT_REQUEST', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'DELETE_CONTENT_REQUEST' })).to.be.eq(null);
    });
    it('should handle DELETE_CONTENT_SUCCESS', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'DELETE_CONTENT_SUCCESS' })).to.be.eq(null);
    });
    it('should handle CHECKIN_CONTENT_REQUEST', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'CHECKIN_CONTENT_REQUEST' })).to.be.eq(null);
    });
    it('should handle CHECKIN_CONTENT_SUCCESS', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'CHECKIN_CONTENT_SUCCESS' })).to.be.eq(null);
    });
    it('should handle CHECKOUT_CONTENT_REQUEST', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'CHECKOUT_CONTENT_REQUEST' })).to.be.eq(null);
    });
    it('should handle CHECKOUT_CONTENT_SUCCESS', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'CHECKOUT_CONTENT_SUCCESS' })).to.be.eq(null);
    });
    it('should handle APPROVE_CONTENT_REQUEST', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'APPROVE_CONTENT_REQUEST' })).to.be.eq(null);
    });
    it('should handle APPROVE_CONTENT_SUCCESS', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'APPROVE_CONTENT_SUCCESS' })).to.be.eq(null);
    });
    it('should handle PUBLISH_CONTENT_REQUEST', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'PUBLISH_CONTENT_REQUEST' })).to.be.eq(null);
    });
    it('should handle PUBLISH_CONTENT_SUCCESS', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'PUBLISH_CONTENT_SUCCESS' })).to.be.eq(null);
    });
    it('should handle REJECT_CONTENT_REQUEST', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'REJECT_CONTENT_REQUEST' })).to.be.eq(null);
    });
    it('should handle REJECT_CONTENT_SUCCESS', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'REJECT_CONTENT_SUCCESS' })).to.be.eq(null);
    });
    it('should handle UNDOCHECKOUT_CONTENT_REQUEST', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'UNDOCHECKOUT_CONTENT_REQUEST' })).to.be.eq(null);
    });
    it('should handle UNDOCHECKOUT_CONTENT_SUCCESS', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'UNDOCHECKOUT_CONTENT_SUCCESS' })).to.be.eq(null);
    });
    it('should handle FORCEUNDOCHECKOUT_CONTENT_REQUEST', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST' })).to.be.eq(null);
    });
    it('should handle FORCEUNDOCHECKOUT_CONTENT_SUCCESS', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS' })).to.be.eq(null);
    });
    it('should handle RESTOREVERSION_CONTENT_REQUEST', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'RESTOREVERSION_CONTENT_REQUEST' })).to.be.eq(null);
    });
    it('should handle RESTOREVERSION_CONTENT_SUCCESS', () => {
        expect(Reducers_1.Reducers.errorMessage(null, { type: 'RESTOREVERSION_CONTENT_SUCCESS' })).to.be.eq(null);
    });
});
describe('getContent', () => {
    const state = {
        entities: {
            collection: {
                5145: {
                    Id: 5145,
                    DisplayName: 'Some Article',
                    Status: ['Active']
                },
                5146: {
                    Id: 5146,
                    Displayname: 'Other Article',
                    Status: ['Completed']
                }
            }
        }
    };
    it('should return the content from the state by the given id', () => {
        expect(Reducers_1.Reducers.getContent(state.entities.collection, 5145)).to.be.deep.eq({
            Id: 5145,
            DisplayName: 'Some Article',
            Status: ['Active']
        });
    });
});
describe('getIds', () => {
    const state = {
        ids: [5145, 5146]
    };
    it('should return the id array from the current state', () => {
        expect(Reducers_1.Reducers.getIds(state)).to.be.deep.eq([5145, 5146]);
    });
});
describe('getFetching', () => {
    const state = {
        ids: [5145, 5146],
        isFetching: false
    };
    it('should return the value of isFetching from the current state', () => {
        expect(Reducers_1.Reducers.getFetching(state)).to.be.eq(false);
    });
});
describe('getError', () => {
    const state = {
        ids: [5145, 5146],
        isFetching: false,
        errorMessage: 'error'
    };
    it('should return the value of errorMessage from the current state', () => {
        expect(Reducers_1.Reducers.getError(state)).to.be.eq('error');
    });
});

//# sourceMappingURL=ReducersTests.js.map
