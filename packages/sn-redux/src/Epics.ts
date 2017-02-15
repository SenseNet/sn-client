import { ActionsObservable, combineEpics } from 'redux-observable';
import * as Rx from '@reactivex/rxjs';
import * as SN from 'sn-client-js';
import { Actions } from './Actions';
import { Reducers } from './Reducers';

const { ajax } = Rx.Observable;

/**
 * Module for redux-observable Epics of the Sense/Net built-in OData actions.
 * 
 * _An Epic is the core primitive of [redux-observable](https://redux-observable.js.org). It is a function which takes a stream of actions and returns a stream of actions._
 * 
 * Learn more about redux-observable Epics [here](https://redux-observable.js.org/docs/basics/Epics.html);
 * 
 * In Sense/Net's case it means that the action steps (for exmaple request, success, fail) or multiple actions can be combined into Epics. It's extremely useful if you have
 * to work with async action or you have a complex process with multiple steps that have to wait for each other like validation, multiple step saving, etc.
 * 
 * Following epics cover the CRUD operations and all the other built-in Sense/Net OData Actions. All of these Epics are combined into one root Epic. If you want to use them in
 * your application without any customization you don't have to do anything special, because it is set as default at the store creation, but if you want add you custom Epics to it
 * use combineEpics on Sense/Nets root Epic and yours.
 * 
 * ```
 * import { combineEpics } from 'redux-observable';
 * import { myCombinedEpics } from '../myApp/Epics';
 * import { myRootReducer } from '../myApp/Reducers';
 * import { rootEpic } from '../sn-redux/Epics';
 * 
 * const myRootEpic = combinedEpics(
 *  rootEpic,
 *  myCombinedEpics
 * );
 * 
 * const store = Store.configureStore(myRootReducer, myRootEpic, [Authentication]);
 * ``` 
 */

export module Epics {
    /**
     * Epic for fetching content from the Content Repository. It is related to three redux actions, returns the ```RequestContent``` action and sends the JSON response to the
     * ```ReceiveContent``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```ReceiveContentFailure``` action.
     */
    export const fetchContentEpic = action$ => {
        return action$.ofType('FETCH_CONTENT_REQUEST')
            .mergeMap(action => {
                let params = `${action.filter}`;
                return SN.ODataApiActionObservables.FetchContent(action.path, params)
                    .map((response) => Actions.ReceiveContent(response.response, params))
                    .catch(error => Rx.Observable.of(Actions.ReceiveContentFailure(params, error)))
            }
            );
    }
    /**
     * Epic for creating a Content in the Content Repository. It is related to three redux actions, returns ```CreateContent``` action and sends the JSON response to the
     * ```CreateContentSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```CreateContentFailure``` action.
     */
    export const createContentEpic = action$ => {
        return action$.ofType('CREATE_CONTENT_REQUEST')
            .mergeMap(action => {
                let content = action.content;
                content['__ContentType'] = content.Type;
                return SN.ODataApiActionObservables.CreateContent(action.path, content)
                    .map(Actions.CreateContentSuccess)
                    .catch(error => Rx.Observable.of(Actions.CreateContentFailure(error)))
            })
    }
    /**
     * Epic for updating metadata of a Content in the Content Repository. It is related to three redux actions, returns ```UpdateContent``` action and sends the JSON response to the
     * ```UpdateContentSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```UpdateContentFailure``` action.
     */
    export const updateContentEpic = (action$, store) => {
        return action$.ofType('UPDATE_CONTENT_REQUEST')
            .mergeMap(action => {
                return SN.ODataApiActionObservables.PatchContent(action.id, action.fields)
                    .map(Actions.UpdateContentSuccess)
                    .catch(error => Rx.Observable.of(Actions.UpdateContentFailure(error)))
            })
    }
    /**
     * Epic to delete a Content from the Content Repository. It is related to three redux actions, returns ```Delete``` action and sends the response to the
     * ```DeleteSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```DeleteFailure``` action.
     */
    export const deleteContentEpic = (action$, store) => {
        return action$.ofType('DELETE_CONTENT_REQUEST')
            .mergeMap(action => {
                return SN.ODataApiActionObservables.DeleteContent(action.id, action.permanently)
                    .map((response) => {
                        const state = store.getState();
                        const ids = Reducers.getIds(state.collection);
                        return Actions.DeleteSuccess(ids.indexOf(action.id), action.id);
                    })
                    .catch(error => Rx.Observable.of(Actions.DeleteFailure(error)))
            })
    }
    /**
     * Epic to delete multiple Content from the Content Repository. It is related to three redux actions, returns ```DeleteBatch``` action and sends the response to the
     * ```DeleteBatchSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```DeleteBatchFailure``` action.
     */
    export const deleteBatchEpic = (action$, store) => {
        return action$.ofType('DELETE_BATCH_REQUEST')
            .mergeMap(action => {
                const Action = new SN.ODataApi.CustomAction({ name: 'DeleteBatch', path: action.path, isAction: true, requiredParams: ['paths'] });
                return SN.ODataApiActionObservables.CreateCustomAction(Action, { data: { 'paths': action.ids, 'permanently': action.permanently } })
                    .map((response) => {
                        const state = store.getState();
                        const ids = Reducers.getIds(state.collection);
                        let indexes = [];
                        for (let i = 0; i < ids.length; i++) {
                            if (action.ids.indexOf(ids[i]) > -1) {
                                indexes.push(i);
                            }
                        }
                        return Actions.DeleteBatchSuccess(indexes);
                    })
                    .catch(error => Rx.Observable.of(Actions.DeleteBatchFailure(error)))
            })
    }
    /**
     * Epic to checkout a Content in the Content Repository. It is related to three redux actions, returns ```CheckOut``` action and sends the response to the
     * ```CheckOutSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```CheckOutFailure``` action.
     */
    export const checkoutContentEpic = (action$, store) => {
        return action$.ofType('CHECKOUT_CONTENT_REQUEST')
            .mergeMap(action => {
                const Action = new SN.ODataApi.CustomAction({ name: 'CheckOut', id: action.id, isAction: true });
                return SN.ODataApiActionObservables.CreateCustomAction(Action)
                    .map(Actions.CheckOutSuccess)
                    .catch(error => Rx.Observable.of(Actions.CheckOutFailure(error)))
            })
    }

    /**
         * Epic to checkin a Content in the Content Repository. It is related to three redux actions, returns ```CheckIn``` action and sends the response to the
         * ```CheckInSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```CheckInFailure``` action.
         */
    export const checkinContentEpic = (action$, store) => {
        return action$.ofType('CHECKIN_CONTENT_REQUEST')
            .mergeMap(action => {
                const Action = new SN.ODataApi.CustomAction({ name: 'CheckIn', id: action.id, isAction: true, params: ['checkInComment'] });
                return SN.ODataApiActionObservables.CreateCustomAction(Action, { data: { 'checkInComments': action.checkInComment } })
                    .map(Actions.CheckInSuccess)
                    .catch(error => Rx.Observable.of(Actions.CheckInFailure(error)))
            })
    }
    /**
         * Epic to publish a Content in the Content Repository. It is related to three redux actions, returns ```Publish``` action and sends the response to the
         * ```PublishSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```PublishFailure``` action.
         */
    export const publishContentEpic = (action$, store) => {
        return action$.ofType('PUBLISH_CONTENT_REQUEST')
            .mergeMap(action => {
                const Action = new SN.ODataApi.CustomAction({ name: 'Publish', id: action.id, isAction: true });
                return SN.ODataApiActionObservables.CreateCustomAction(Action)
                    .map(Actions.PublishSuccess)
                    .catch(error => Rx.Observable.of(Actions.PublishFailure(error)))
            })
    }
    /**
         * Epic to approve a Content in the Content Repository. It is related to three redux actions, returns ```Approve``` action and sends the response to the
         * ```ApproveSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```ApproveFailure``` action.
         */
    export const approveContentEpic = (action$, store) => {
        return action$.ofType('APPROVE_CONTENT_REQUEST')
            .mergeMap(action => {
                const Action = new SN.ODataApi.CustomAction({ name: 'Approve', id: action.id, isAction: true });
                return SN.ODataApiActionObservables.CreateCustomAction(Action)
                    .map(Actions.ApproveSuccess)
                    .catch(error => Rx.Observable.of(Actions.ApproveFailure(error)))
            })
    }
    /**
         * Epic to reject a Content in the Content Repository. It is related to three redux actions, returns ```Reject``` action and sends the response to the
         * ```RejectSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```RejectFailure``` action.
         */
    export const rejectContentEpic = (action$, store) => {
        return action$.ofType('REJECT_CONTENT_REQUEST')
            .mergeMap(action => {
                const Action = new SN.ODataApi.CustomAction({ name: 'Reject', id: action.id, isAction: true, params: ['rejectReason'] });
                return SN.ODataApiActionObservables.CreateCustomAction(Action, { data: { 'rejectReason': action.rejectReason ? action.rejectReason : '' } })
                    .map(Actions.RejectSuccess)
                    .catch(error => Rx.Observable.of(Actions.RejectFailure(error)))
            })
    }
    /**
         * Epic to undo checkout a Content in the Content Repository. It is related to three redux actions, returns ```UndoCheckout``` action and sends the response to the
         * ```UndoCheckoutSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```UndoCheckoutFailure``` action.
         */
    export const undocheckoutContentEpic = (action$, store) => {
        return action$.ofType('UNDOCHECKOUT_CONTENT_REQUEST')
            .mergeMap(action => {
                const Action = new SN.ODataApi.CustomAction({ name: 'UndoCheckout', id: action.id, isAction: true });
                return SN.ODataApiActionObservables.CreateCustomAction(Action)
                    .map(Actions.UndoCheckoutSuccess)
                    .catch(error => Rx.Observable.of(Actions.UndoCheckoutFailure(error)))
            })
    }
    /**
         * Epic to force undo checkout a Content in the Content Repository. It is related to three redux actions, returns ```ForceUndoCheckout``` action and sends the response to the
         * ```ForceUndoCheckoutSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```ForceUndoCheckoutFailure``` action.
         */
    export const forceundocheckoutContentEpic = (action$, store) => {
        return action$.ofType('FORCEUNDOCHECKOUT_CONTENT_REQUEST')
            .mergeMap(action => {
                const Action = new SN.ODataApi.CustomAction({ name: 'ForceUndoCheckout', id: action.id, isAction: true });
                return SN.ODataApiActionObservables.CreateCustomAction(Action)
                    .map(Actions.ForceUndoCheckoutSuccess)
                    .catch(error => Rx.Observable.of(Actions.ForceUndoCheckoutFailure(error)))
            })
    }
    /**
         * Epic to restore a version of a Content in the Content Repository. It is related to three redux actions, returns ```RestoreVersion``` action and sends the response to the
         * ```RestoreVersionSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```RestoreVersionFailure``` action.
         */
    export const restoreversionContentEpic = (action$, store) => {
        return action$.ofType('RESTOREVERSION_CONTENT_REQUEST')
            .mergeMap(action => {
                const Action = new SN.ODataApi.CustomAction({ name: 'RestoreVersion', id: action.id, isAction: true, params: ['version'] });
                return SN.ODataApiActionObservables.CreateCustomAction(Action, { data: { 'version': action.version } })
                    .map(Actions.RestoreVersionSuccess)
                    .catch(error => Rx.Observable.of(Actions.RestoreVersionFailure(error)))
            })
    }
    /**
         * Epic to login a user to a Sense/Net portal. It is related to three redux actions, returns ```LoginUser``` action and sends the response to the
         * ```LoginUserSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```LoginUserFailure``` action.
         */
    export const userLoginEpic = (action$, store) => {
        return action$.ofType('USER_LOGIN_REQUEST')
            .mergeMap(action => {
                const Action = new SN.ODataApi.CustomAction({ name: 'Login', path: '/Root', isAction: true, requiredParams: ['username', 'password'], noCache: true });
                return SN.ODataApiActionObservables.Login(Action, { data: { 'username': action.userName, 'password': action.password } })
                    .map(Actions.UserLoginSuccess)
                    .catch(error => Rx.Observable.of(Actions.UserLoginFailure(error)))
            })
    }
    /**
         * Epic to logout a user from a Sense/Net portal. It is related to three redux actions, returns ```LogoutUser``` action and sends the response to the
         * ```LogoutUserSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```LogoutUserFailure``` action.
         */
    export const userLogoutEpic = (action$, store) => {
        return action$.ofType('USER_LOGOUT_REQUEST')
            .mergeMap(action => {
                const Action = new SN.ODataApi.CustomAction({ name: 'Logout', path: '/Root', isAction: true, noCache: true });
                return SN.ODataApiActionObservables.Logout(Action, {})
                    .map(Actions.UserLogoutSuccess)
                    .catch(error => Rx.Observable.of(Actions.UserLogoutFailure(error)))
            })
    }
    /**
     * sn-redux root Epic, the main Epic combination that is used on a default Sense/Net application. Contains Epics related to CRUD operations and thr other built-in Sense/Net
     * [OData Actions and Function](http://wiki.sensenet.com/Built-in_OData_actions_and_functions).
     */
    export const rootEpic = combineEpics(
        fetchContentEpic,
        createContentEpic,
        updateContentEpic,
        deleteContentEpic,
        deleteBatchEpic,
        checkoutContentEpic,
        checkinContentEpic,
        publishContentEpic,
        approveContentEpic,
        rejectContentEpic,
        undocheckoutContentEpic,
        forceundocheckoutContentEpic,
        restoreversionContentEpic,
        userLoginEpic,
        userLogoutEpic
    );
}