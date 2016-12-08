"use strict";
const redux_observable_1 = require('redux-observable');
const Rx = require('@reactivex/rxjs');
const SN = require('sn-client-js');
const Actions_1 = require('./Actions');
const Reducers_1 = require('./Reducers');
const { ajax } = Rx.Observable;
var Epics;
(function (Epics) {
    Epics.fetchContentEpic = action$ => {
        return action$.ofType('FETCH_CONTENT_REQUEST')
            .mergeMap(action => {
            let params = `${action.filter}`;
            return SN.ODataApiActionObservables.FetchContent(action.path, params)
                .map((response) => Actions_1.Actions.ReceiveContent(response.response, params))
                .catch(error => Rx.Observable.of(Actions_1.Actions.ReceiveContentFailure(params, error)));
        });
    };
    Epics.createContentEpic = action$ => {
        return action$.ofType('CREATE_CONTENT_REQUEST')
            .mergeMap(action => {
            let content = action.content;
            content['__ContentType'] = content.Type;
            return SN.ODataApiActionObservables.CreateContent(action.path, content)
                .map(Actions_1.Actions.CreateContentSuccess)
                .catch(error => Rx.Observable.of(Actions_1.Actions.CreateContentFailure(error)));
        });
    };
    Epics.updateContentEpic = (action$, store) => {
        return action$.ofType('UPDATE_CONTENT_REQUEST')
            .mergeMap(action => {
            return SN.ODataApiActionObservables.PatchContent(action.id, action.fields)
                .map(Actions_1.Actions.UpdateContentSuccess)
                .catch(error => Rx.Observable.of(Actions_1.Actions.UpdateContentFailure(error)));
        });
    };
    Epics.deleteContentEpic = (action$, store) => {
        return action$.ofType('DELETE_CONTENT_REQUEST')
            .mergeMap(action => {
            return SN.ODataApiActionObservables.DeleteContent(action.id, action.permanently)
                .map((response) => {
                const state = store.getState();
                const ids = Reducers_1.Reducers.getIds(state.collection);
                return Actions_1.Actions.DeleteSuccess(ids.indexOf(action.id), action.id);
            })
                .catch(error => Rx.Observable.of(Actions_1.Actions.DeleteFailure(error)));
        });
    };
    Epics.deleteBatchEpic = (action$, store) => {
        return action$.ofType('DELETE_BATCH_REQUEST')
            .mergeMap(action => {
            const Action = new SN.ODataApi.CustomAction({ name: 'DeleteBatch', path: action.path, isAction: true, requiredParams: ['paths'] });
            return SN.ODataApiActionObservables.CreateCustomAction(Action, { data: { 'paths': action.ids, 'permanently': action.permanently } })
                .map((response) => {
                const state = store.getState();
                const ids = Reducers_1.Reducers.getIds(state.collection);
                let indexes = [];
                for (let i = 0; i < ids.length; i++) {
                    if (action.ids.indexOf(ids[i]) > -1) {
                        indexes.push(i);
                    }
                }
                return Actions_1.Actions.DeleteBatchSuccess(indexes);
            })
                .catch(error => Rx.Observable.of(Actions_1.Actions.DeleteBatchFailure(error)));
        });
    };
    Epics.checkoutContentEpic = (action$, store) => {
        return action$.ofType('CHECKOUT_CONTENT_REQUEST')
            .mergeMap(action => {
            const Action = new SN.ODataApi.CustomAction({ name: 'CheckOut', id: action.id, isAction: true });
            return SN.ODataApiActionObservables.CreateCustomAction(Action)
                .map(Actions_1.Actions.CheckOutSuccess)
                .catch(error => Rx.Observable.of(Actions_1.Actions.CheckOutFailure(error)));
        });
    };
    Epics.checkinContentEpic = (action$, store) => {
        return action$.ofType('CHECKIN_CONTENT_REQUEST')
            .mergeMap(action => {
            const Action = new SN.ODataApi.CustomAction({ name: 'CheckIn', id: action.id, isAction: true, params: ['checkInComment'] });
            return SN.ODataApiActionObservables.CreateCustomAction(Action, { data: { 'checkInComments': action.checkInComment } })
                .map(Actions_1.Actions.CheckInSuccess)
                .catch(error => Rx.Observable.of(Actions_1.Actions.CheckInFailure(error)));
        });
    };
    Epics.publishContentEpic = (action$, store) => {
        return action$.ofType('PUBLISH_CONTENT_REQUEST')
            .mergeMap(action => {
            const Action = new SN.ODataApi.CustomAction({ name: 'Publish', id: action.id, isAction: true });
            return SN.ODataApiActionObservables.CreateCustomAction(Action)
                .map(Actions_1.Actions.PublishSuccess)
                .catch(error => Rx.Observable.of(Actions_1.Actions.PublishFailure(error)));
        });
    };
    Epics.approveContentEpic = (action$, store) => {
        return action$.ofType('APPROVE_CONTENT_REQUEST')
            .mergeMap(action => {
            const Action = new SN.ODataApi.CustomAction({ name: 'Approve', id: action.id, isAction: true });
            return SN.ODataApiActionObservables.CreateCustomAction(Action)
                .map(Actions_1.Actions.ApproveSuccess)
                .catch(error => Rx.Observable.of(Actions_1.Actions.ApproveFailure(error)));
        });
    };
    Epics.rejectContentEpic = (action$, store) => {
        return action$.ofType('REJECT_CONTENT_REQUEST')
            .mergeMap(action => {
            const Action = new SN.ODataApi.CustomAction({ name: 'Reject', id: action.id, isAction: true, params: ['rejectReason'] });
            return SN.ODataApiActionObservables.CreateCustomAction(Action, { data: { 'rejectReason': action.rejectReason ? action.rejectReason : '' } })
                .map(Actions_1.Actions.RejectSuccess)
                .catch(error => Rx.Observable.of(Actions_1.Actions.RejectFailure(error)));
        });
    };
    Epics.undocheckoutContentEpic = (action$, store) => {
        return action$.ofType('UNDOCHECKOUT_CONTENT_REQUEST')
            .mergeMap(action => {
            const Action = new SN.ODataApi.CustomAction({ name: 'UndoCheckout', id: action.id, isAction: true });
            return SN.ODataApiActionObservables.CreateCustomAction(Action)
                .map(Actions_1.Actions.UndoCheckoutSuccess)
                .catch(error => Rx.Observable.of(Actions_1.Actions.UndoCheckoutFailure(error)));
        });
    };
    Epics.forceundocheckoutContentEpic = (action$, store) => {
        return action$.ofType('FORCEUNDOCHECKOUT_CONTENT_REQUEST')
            .mergeMap(action => {
            const Action = new SN.ODataApi.CustomAction({ name: 'ForceUndoCheckout', id: action.id, isAction: true });
            return SN.ODataApiActionObservables.CreateCustomAction(Action)
                .map(Actions_1.Actions.ForceUndoCheckoutSuccess)
                .catch(error => Rx.Observable.of(Actions_1.Actions.ForceUndoCheckoutFailure(error)));
        });
    };
    Epics.restoreversionContentEpic = (action$, store) => {
        return action$.ofType('RESTOREVERSION_CONTENT_REQUEST')
            .mergeMap(action => {
            const Action = new SN.ODataApi.CustomAction({ name: 'RestoreVersion', id: action.id, isAction: true, params: ['version'] });
            return SN.ODataApiActionObservables.CreateCustomAction(Action, { data: { 'version': action.version } })
                .map(Actions_1.Actions.RestoreVersionSuccess)
                .catch(error => Rx.Observable.of(Actions_1.Actions.RestoreVersionFailure(error)));
        });
    };
    Epics.rootEpic = redux_observable_1.combineEpics(Epics.fetchContentEpic, Epics.createContentEpic, Epics.updateContentEpic, Epics.deleteContentEpic, Epics.deleteBatchEpic, Epics.checkoutContentEpic, Epics.checkinContentEpic, Epics.publishContentEpic, Epics.approveContentEpic, Epics.rejectContentEpic, Epics.undocheckoutContentEpic, Epics.forceundocheckoutContentEpic, Epics.restoreversionContentEpic);
})(Epics = exports.Epics || (exports.Epics = {}));

//# sourceMappingURL=Epics.js.map
