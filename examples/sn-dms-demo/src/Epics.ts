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

    export const loadProfileDoclibEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
        return action$.ofType('USER_CHANGED')
            .mergeMap(action => {
                const id = location.href
                const path = action.user.Name === 'Visitor' ? '/Root' :
                    '/Root/Profiles/Public/' + action.user.Name + '/Document_Library'
                return dependencies.repository.Load(path, { select: 'all' })
                    .map((response) => {
                        store.dispatch(Actions.RequestContent(path, { select: ['Id', 'Path', 'DisplayName', 'ModificationDate', 'Icon'], orderby: ['IsFolder desc', 'DisplayName asc'] as any }))
                        return Actions.ReceiveLoadedContent(response, action.options)
                    })
                    .catch(error => {
                        return Observable.of(Actions.ReceiveLoadedContentFailure(action.options, error))
                    })
            }
            );
    }

    export const rootEpic = combineEpics(
        Epics.rootEpic,
        registrationEpic,
        //loadProfileDoclibEpic
    );

}