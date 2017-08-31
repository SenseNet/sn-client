import { Actions } from './Actions';
import { Reducers } from './Reducers';

import { ActionsObservable, combineEpics } from 'redux-observable';
import { Observable } from '@reactivex/rxjs';
import { Repository, Content, Collection, ODataApi, Authentication } from 'sn-client-js';

/**
 * Module for redux-observable Epics of the sensenet built-in OData actions.
 *
 * _An Epic is the core primitive of [redux-observable](https://redux-observable.js.org). It is a function which takes a stream of actions and returns a stream of actions._
 *
 * Learn more about redux-observable Epics [here](https://redux-observable.js.org/docs/basics/Epics.html);
 *
 * In sensenet's case it means that the action steps (for exmaple request, success, fail) or multiple actions can be combined into Epics. It's extremely useful if you have
 * to work with async action or you have a complex process with multiple steps that have to wait for each other like validation, multiple step saving, etc.
 *
 * Following epics cover the CRUD operations and all the other built-in sensenet OData Actions. All of these Epics are combined into one root Epic. If you want to use them in
 * your application without any customization you don't have to do anything special, because it is set as default at the store creation, but if you want add you custom Epics to it
 * use combineEpics on sensenets root Epic and yours.
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
     * Epic for initialize a sensenet Redux store. It checks the InitSensenetStore Action and calls the necessary ones snycronously. Loads the current content,
     * checks the login state with CheckLoginState, fetch the children items with RequestContent and loads the current content related actions with
     * LoadContentActions.
     */
    export const initSensenetStoreEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
        return action$.ofType('INIT_SENSENET_STORE')
            .mergeMap(action => {
                dependencies.repository.GetCurrentUser().subscribe(user => {
                    store.dispatch(Actions.UserChanged(user))
                })
                store.dispatch(Actions.CheckLoginState())
                store.dispatch(Actions.LoadRepository(dependencies.repository.Config))
                return dependencies.repository.Load(action.path, action.options)
                    .map((response) => {
                        store.dispatch(Actions.RequestContent(action.path, action.options))
                        return Actions.ReceiveLoadedContent(response, action.options)
                    })
                    .catch(error => {
                        return Observable.of(Actions.ReceiveLoadedContentFailure(action.options, error))
                    })
            })
    }
    /**
     * Epic for fetching content from the Content Repository. It is related to three redux actions, returns the ```RequestContent``` action and sends the JSON response to the
     * ```ReceiveContent``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```ReceiveContentFailure``` action.
     */
    export const fetchContentEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
        return action$.ofType('FETCH_CONTENT_REQUEST')
            .mergeMap(action => {
                let collection = new Collection.Collection([], dependencies.repository, action.contentType);
                return collection.Read(action.path, action.options)
                    .map((response) => Actions.ReceiveContent(response, action.options))
                    .catch(error => {
                        return Observable.of(Actions.ReceiveContentFailure(action.options, error))
                    })
            }
            );
    }
    /**
     * Epic for loading content from the Content Repository. It is related to three redux actions, returns the ```LoadContent``` action and sends the JSON response to the
     * ```ReceiveLoadedContent``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```ReceiveLoadedContentFailure``` action.
     */
    export const loadContentEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
        return action$.ofType('LOAD_CONTENT_REQUEST')
            .mergeMap(action => {
                return dependencies.repository.Load(action.id, action.options)
                    .map((response) => {
                        store.dispatch(Actions.LoadContentActions(response, action.scenario))
                        return Actions.ReceiveLoadedContent(response, action.options)
                    })
                    .catch(error => {
                        return Observable.of(Actions.ReceiveLoadedContentFailure(action.options, error))
                    })
            }
            );
    }
    /**
     * Epic for loading Actions of a content from the Content Repository. It is related to three redux actions, returns the ```LoadContentActions``` action and sends the JSON response to the
     * ```ReceiveContentActions``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```ReceiveContentActionsFailure``` action.
     */
    export const loadContentActionsEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
        return action$.ofType('LOAD_CONTENT_ACTIONS')
            .mergeMap(action => {
                return action.content.Actions(action.scenario)
                    .map(Actions.ReceiveContentActions)
                    .catch(error => Observable.of(Actions.ReceiveContentActionsFailure(error)))
            })
    }
    /**
     * Epic for reloading content from the Content Repository. It is related to three redux actions, returns the ```ReloadContent``` action and sends the JSON response to the
     * ```ReceiveReloadedContent``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```ReceiveReloadedContentFailure``` action.
     */
    export const reloadContentEpic = (action$, store) => {
        return action$.ofType('RELOAD_CONTENT_REQUEST')
            .mergeMap(action => {
                return action.content.Reload(action.actionname)
                    .map((response) => Actions.ReceiveReloadedContent(response))
                    .catch(error => {
                        return Observable.of(Actions.ReceiveReloadedContentFailure(error))
                    })
            }
            );
    }
    /**
     * Epic for reloading fields of a content from the Content Repository. It is related to three redux actions, returns the ```ReloadContentFields``` action and sends the JSON response to the
     * ```ReceiveReloadedContentFields``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```ReceiveReloadedContentFieldsFailure``` action.
     */
    export const reloadContentFieldsEpic = (action$, store) => {
        return action$.ofType('RELOAD_CONTENTFIELDS_REQUEST')
            .mergeMap(action => {
                return action.content.ReloadFields(action.fields)
                    .map((response) => Actions.ReceiveReloadedContentFields(response))
                    .catch(error => {
                        return Observable.of(Actions.ReceiveReloadedContentFieldsFailure(error))
                    })
            }
            );
    }
    /**
     * Epic for creating a Content in the Content Repository. It is related to three redux actions, returns ```CreateContent``` action and sends the JSON response to the
     * ```CreateContentSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```CreateContentFailure``` action.
     */
    export const createContentEpic = (action$, store) => {
        return action$.ofType('CREATE_CONTENT_REQUEST')
            .mergeMap(action => {
                return action.content.Save()
                    .map(Actions.CreateContentSuccess)
                    .catch(error => Observable.of(Actions.CreateContentFailure(error)))
            })
    }
    /**
     * Epic for updating metadata of a Content in the Content Repository. It is related to three redux actions, returns ```UpdateContent``` action and sends the JSON response to the
     * ```UpdateContentSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```UpdateContentFailure``` action.
     */
    export const updateContentEpic = (action$, store) => {
        return action$.ofType('UPDATE_CONTENT_REQUEST')
            .mergeMap(action => {
                return action.content.Save()
                    .map(Actions.UpdateContentSuccess)
                    .catch(error => Observable.of(Actions.UpdateContentFailure(error)))
            })
    }
    /**
     * Epic to delete a Content from the Content Repository. It is related to three redux actions, returns ```Delete``` action and sends the response to the
     * ```DeleteSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```DeleteFailure``` action.
     */
    export const deleteContentEpic = (action$, store) => {
        return action$.ofType('DELETE_CONTENT_REQUEST')
            .mergeMap(action => {
                return action.content.Delete(action.id, action.permanently)
                    .map((response) => {
                        const state = store.getState();
                        const ids = Reducers.getIds(state.collection);
                        return Actions.DeleteSuccess(ids.indexOf(action.id), action.id);
                    })
                    .catch(error => Observable.of(Actions.DeleteFailure(error)))
            })
    }
    /**
     * Epic to delete multiple Content from the Content Repository. It is related to three redux actions, returns ```DeleteBatch``` action and sends the response to the
     * ```DeleteBatchSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```DeleteBatchFailure``` action.
     */
    export const deleteBatchEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
        return action$.ofType('DELETE_BATCH_REQUEST')
            .mergeMap(action => {
                let collection = new Collection.Collection([], dependencies.repository, action.contentType);
                return collection.Remove(action.ids, false)
                    .map((response) => {
                        const state = store.getState();
                        const ids = Reducers.getIds(state.collection);
                        return Actions.DeleteBatchSuccess(ids);
                    })
                    .catch(error => Observable.of(Actions.DeleteBatchFailure(error)))
            })
    }
    /**
     * Epic to checkout a Content in the Content Repository. It is related to three redux actions, returns ```CheckOut``` action and sends the response to the
     * ```CheckOutSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```CheckOutFailure``` action.
     */
    export const checkoutContentEpic = (action$, store) => {
        return action$.ofType('CHECKOUT_CONTENT_REQUEST')
            .mergeMap(action => {
                return action.content.Checkout()
                    .map(Actions.CheckOutSuccess)
                    .catch(error => Observable.of(Actions.CheckOutFailure(error)))
            })
    }

    /**
         * Epic to checkin a Content in the Content Repository. It is related to three redux actions, returns ```CheckIn``` action and sends the response to the
         * ```CheckInSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```CheckInFailure``` action.
         */
    export const checkinContentEpic = (action$, store) => {
        return action$.ofType('CHECKIN_CONTENT_REQUEST')
            .mergeMap(action => {
                return action.content.CheckIn(action.checkinComment)
                    .map(Actions.CheckInSuccess)
                    .catch(error => Observable.of(Actions.CheckInFailure(error)))
            })
    }
    /**
         * Epic to publish a Content in the Content Repository. It is related to three redux actions, returns ```Publish``` action and sends the response to the
         * ```PublishSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```PublishFailure``` action.
         */
    export const publishContentEpic = (action$, store) => {
        return action$.ofType('PUBLISH_CONTENT_REQUEST')
            .mergeMap(action => {
                return action.content.Publish()
                    .map(Actions.PublishSuccess)
                    .catch(error => Observable.of(Actions.PublishFailure(error)))
            })
    }
    /**
         * Epic to approve a Content in the Content Repository. It is related to three redux actions, returns ```Approve``` action and sends the response to the
         * ```ApproveSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```ApproveFailure``` action.
         */
    export const approveContentEpic = (action$, store) => {
        return action$.ofType('APPROVE_CONTENT_REQUEST')
            .mergeMap(action => {
                return action.content.Approve()
                    .map(Actions.ApproveSuccess)
                    .catch(error => Observable.of(Actions.ApproveFailure(error)))
            })
    }
    /**
         * Epic to reject a Content in the Content Repository. It is related to three redux actions, returns ```Reject``` action and sends the response to the
         * ```RejectSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```RejectFailure``` action.
         */
    export const rejectContentEpic = (action$, store) => {
        return action$.ofType('REJECT_CONTENT_REQUEST')
            .mergeMap(action => {
                return action.content.Reject(action.rejectReason)
                    .map(Actions.RejectSuccess)
                    .catch(error => Observable.of(Actions.RejectFailure(error)))
            })
    }
    /**
         * Epic to undo checkout a Content in the Content Repository. It is related to three redux actions, returns ```UndoCheckout``` action and sends the response to the
         * ```UndoCheckoutSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```UndoCheckoutFailure``` action.
         */
    export const undocheckoutContentEpic = (action$, store) => {
        return action$.ofType('UNDOCHECKOUT_CONTENT_REQUEST')
            .mergeMap(action => {
                return action.content.UndoCheckout()
                    .map(Actions.UndoCheckoutSuccess)
                    .catch(error => Observable.of(Actions.UndoCheckoutFailure(error)))
            })
    }
    /**
         * Epic to force undo checkout a Content in the Content Repository. It is related to three redux actions, returns ```ForceUndoCheckout``` action and sends the response to the
         * ```ForceUndoCheckoutSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```ForceUndoCheckoutFailure``` action.
         */
    export const forceundocheckoutContentEpic = (action$, store) => {
        return action$.ofType('FORCEUNDOCHECKOUT_CONTENT_REQUEST')
            .mergeMap(action => {
                return action.content.ForceUndoCheckout()
                    .map(Actions.ForceUndoCheckoutSuccess)
                    .catch(error => Observable.of(Actions.ForceUndoCheckoutFailure(error)))
            })
    }
    /**
         * Epic to restore a version of a Content in the Content Repository. It is related to three redux actions, returns ```RestoreVersion``` action and sends the response to the
         * ```RestoreVersionSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```RestoreVersionFailure``` action.
         */
    export const restoreversionContentEpic = (action$, store) => {
        return action$.ofType('RESTOREVERSION_CONTENT_REQUEST')
            .mergeMap(action => {
                return action.content.RestoreVersion(action.version)
                    .map(Actions.RestoreVersionSuccess)
                    .catch(error => Observable.of(Actions.RestoreVersionFailure(error)))
            })
    }

    /**
     * Epic to wait for the current login state to be initialized
     */
    export const checkLoginStateEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
        return action$.ofType('CHECK_LOGIN_STATE_REQUEST')
            .mergeMap(action => {
                return dependencies.repository.Authentication.State.skipWhile(state => state === Authentication.LoginState.Pending)
                    .first()
                    .map(result => {
                        return result === Authentication.LoginState.Authenticated ?
                            Actions.UserLoginSuccess(result)
                            :
                            Actions.UserLoginFailure({ message: null });
                    })
            })
    }

    /**
     * Epic to login a user to a sensenet portal. It is related to three redux actions, returns ```LoginUser``` action and sends the response to the
     * ```LoginUserSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```LoginUserFailure``` action.
     */
    export const userLoginEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
        return action$.ofType('USER_LOGIN_REQUEST')
            .mergeMap(action => {
                return dependencies.repository.Authentication.Login(action.userName, action.password)
                    .map(result => {
                        return result ?
                            Actions.UserLoginSuccess(result)
                            :
                            Actions.UserLoginFailure({ message: 'Failed to log in.' });
                    })
                    .catch(error => Observable.of(Actions.UserLoginFailure(error)))
            })
    }
    /**
         * Epic to logout a user from a sensenet portal. It is related to three redux actions, returns ```LogoutUser``` action and sends the response to the
         * ```LogoutUserSuccess``` action if the ajax request ended successfully or catches the error if the request failed and sends the error message to the ```LogoutUserFailure``` action.
         */
    export const userLogoutEpic = (action$, store, dependencies?: { repository: Repository.BaseRepository }) => {
        return action$.ofType('USER_LOGOUT_REQUEST')
            .mergeMap(action => {
                return dependencies.repository.Authentication.Logout()
                    .map(Actions.UserLogoutSuccess)
                    .catch(error => Observable.of(Actions.UserLogoutFailure(error)))
            })
    }
    /**
     * sn-redux root Epic, the main Epic combination that is used on a default sensenet application. Contains Epics related to CRUD operations and thr other built-in sensenet
     * [OData Actions and Function](http://wiki.sensenet.com/Built-in_OData_actions_and_functions).
     */
    export const rootEpic = combineEpics(
        initSensenetStoreEpic,
        fetchContentEpic,
        loadContentEpic,
        loadContentActionsEpic,
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
        userLogoutEpic,
        checkLoginStateEpic
    );
}

