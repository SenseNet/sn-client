import { DMSActions } from './Actions';

import { ActionsObservable, combineEpics } from 'redux-observable';
import { Observable } from '@reactivex/rxjs';
import { ajax } from 'rxjs/observable/dom/ajax'
import { Actions, Epics } from 'sn-redux'
import { Repository, ODataHelper } from 'sn-client-js'

export module DMSEpics {
    export const registrationEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
        return action$.ofType('USER_REGISTRATION_REQUEST')
            .mergeMap(action => {
                return dependencies.repository.Ajax(ODataHelper.joinPaths("/Root/IMS('Public')/RegisterUser"), 'POST', Object, JSON.stringify({
                    'email': action.email,
                    'password': action.password
                }))
                    .map(DMSActions.UserRegistrationSuccess)
                    .catch(error => Observable.of(DMSActions.UserRegistrationFailure(error)))
            })
    }

    export const rootEpic = combineEpics(
        Epics.rootEpic,
        registrationEpic
    );

}