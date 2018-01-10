import { DMSEpics } from '../Epics'
import configureMockStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';
import { Mocks } from 'sn-client-js';
import 'rxjs';

describe('registrationEpic Epic', () => {
    
    let repo: Mocks.MockRepository = new Mocks.MockRepository();
    let store;
    const epicMiddleware = createEpicMiddleware(DMSEpics.registrationEpic, { dependencies: { repository: repo } });
    const mockStore = configureMockStore([epicMiddleware]);

    beforeEach(() => {
        store = mockStore();
    });

    afterEach(() => {
        epicMiddleware.replaceEpic(DMSEpics.registrationEpic);
    });
    it('handles success', () => {
        store.dispatch({ type: 'USER_REGISTRATION_REQUEST', email: 'alba@sensenet.com', password: 'alba' });
        expect(store.getActions()).toEqual(
            [{
                type: 'USER_REGISTRATION_REQUEST',
                email: 'alba@sensenet.com', 
                password: 'alba'
            }]);
    })
});