import { DMSActions } from './Actions';

import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { Epics } from 'sn-redux'
import { Repository, ODataHelper } from 'sn-client-js'

enum MessageMode { error = 'error', warning = 'warning', info = 'info' }

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

    export const deleteSuccessEpic = action$ =>
        action$.ofType('DELETE_CONTENT_SUCCESS', 'DELETE_BATCH_SUCCESS')
            .mapTo(DMSActions.OpenMessageBar(MessageMode.info, { message: 'Delete was successfully' }));

    export const deleteFailureEpic = action$ =>
        action$.ofType('DELETE_CONTENT_FAILURE', 'DELETE_BATCH_FAILURE')
            .mergeMap(action => DMSActions.OpenMessageBar(MessageMode.error, { message: action.error }));

    export const rootEpic = combineEpics(
        Epics.rootEpic,
        registrationEpic,
        deleteSuccessEpic,
        deleteFailureEpic
    );

}