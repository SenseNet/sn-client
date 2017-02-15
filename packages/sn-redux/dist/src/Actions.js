"use strict";
const normalizr_1 = require("normalizr");
const Schema_1 = require("./Schema");
const SN = require("sn-client-js");
var Actions;
(function (Actions) {
    Actions.RequestContent = (path, options = {}) => ({
        type: 'FETCH_CONTENT_REQUEST',
        path,
        filter: SN.ODataHelper.buildUrlParamString(options)
    });
    Actions.ReceiveContent = (response, filter) => ({
        type: 'FETCH_CONTENT_SUCCESS',
        response: normalizr_1.normalize(response.d.results, Schema_1.Schemas.arrayOfContent),
        filter
    });
    Actions.ReceiveContentFailure = (filter, error) => ({
        type: 'FETCH_CONTENT_FAILURE',
        filter,
        message: error.message
    });
    Actions.CreateContent = (path, content) => ({ type: 'CREATE_CONTENT_REQUEST', content, path });
    Actions.CreateContentSuccess = (response) => ({
        type: 'CREATE_CONTENT_SUCCESS',
        response: normalizr_1.normalize(response.response.d, Schema_1.Schemas.content)
    });
    Actions.CreateContentFailure = (error) => ({
        type: 'CREATE_CONTENT_FAILURE',
        message: error.message
    });
    Actions.UpdateContent = (id, fields) => ({ type: 'UPDATE_CONTENT_REQUEST', id, fields });
    Actions.UpdateContentSuccess = (response) => ({
        type: 'UPDATE_CONTENT_SUCCESS',
        response: normalizr_1.normalize(response.response.d, Schema_1.Schemas.content)
    });
    Actions.UpdateContentFailure = (error) => ({
        type: 'UPDATE_CONTENT_FAILURE',
        message: error.message
    });
    Actions.Delete = (id, permanently = false) => ({ type: 'DELETE_CONTENT_REQUEST', id, permanently });
    Actions.DeleteSuccess = (index, id) => ({
        type: 'DELETE_CONTENT_SUCCESS',
        index,
        id
    });
    Actions.DeleteFailure = (error) => ({
        type: 'DELETE_CONTENT_FAILURE',
        message: error.message
    });
    Actions.DeleteBatch = (path, ids, permanently = false) => ({
        type: 'DELETE_BATCH_REQUEST',
        path,
        ids,
        permanently
    });
    Actions.DeleteBatchSuccess = (indexes) => ({
        type: 'DELETE_BATCH_SUCCESS',
        indexes
    });
    Actions.DeleteBatchFailure = (error) => ({
        type: 'DELETE_BATCH_FAILURE',
        message: error.message
    });
    Actions.CheckOut = (id) => ({
        type: 'CHECKOUT_CONTENT_REQUEST',
        id
    });
    Actions.CheckOutSuccess = (response) => ({
        type: 'CHECKOUT_CONTENT_SUCCESS',
        response: normalizr_1.normalize(response.response.d, Schema_1.Schemas.content)
    });
    Actions.CheckOutFailure = (error) => ({
        type: 'CHECKOUT_CONTENT_FAILURE',
        message: error.message
    });
    Actions.CheckIn = (id, checkInComment = '') => ({
        type: 'CHECKIN_CONTENT_REQUEST',
        id,
        checkInComment
    });
    Actions.CheckInSuccess = (response) => ({
        type: 'CHECKIN_CONTENT_SUCCESS',
        response: normalizr_1.normalize(response.response.d, Schema_1.Schemas.content)
    });
    Actions.CheckInFailure = (error) => ({
        type: 'CHECKIN_CONTENT_FAILURE',
        message: error.message
    });
    Actions.Publish = (id) => ({
        type: 'PUBLISH_CONTENT_REQUEST',
        id
    });
    Actions.PublishSuccess = (response) => ({
        type: 'PUBLISH_CONTENT_SUCCESS',
        response: normalizr_1.normalize(response.response.d, Schema_1.Schemas.content)
    });
    Actions.PublishFailure = (error) => ({
        type: 'PUBLISH_CONTENT_FAILURE',
        message: error.message
    });
    Actions.Approve = (id) => ({
        type: 'APPROVE_CONTENT_REQUEST',
        id
    });
    Actions.ApproveSuccess = (response) => ({
        type: 'APPROVE_CONTENT_SUCCESS',
        response: normalizr_1.normalize(response.response.d, Schema_1.Schemas.content)
    });
    Actions.ApproveFailure = (error) => ({
        type: 'APPROVE_CONTENT_FAILURE',
        message: error.message
    });
    Actions.Reject = (id, rejectReason = '') => ({
        type: 'REJECT_CONTENT_REQUEST',
        id,
        rejectReason
    });
    Actions.RejectSuccess = (response) => ({
        type: 'REJECT_CONTENT_SUCCESS',
        response: normalizr_1.normalize(response.response.d, Schema_1.Schemas.content)
    });
    Actions.RejectFailure = (error) => ({
        type: 'REJECT_CONTENT_FAILURE',
        message: error.message
    });
    Actions.UndoCheckout = (id) => ({
        type: 'UNDOCHECKOUT_CONTENT_REQUEST',
        id
    });
    Actions.UndoCheckoutSuccess = (response) => ({
        type: 'UNDOCHECKOUT_CONTENT_SUCCESS',
        response: normalizr_1.normalize(response.response.d, Schema_1.Schemas.content)
    });
    Actions.UndoCheckoutFailure = (error) => ({
        type: 'UNDOCHECKOUT_CONTENT_FAILURE',
        message: error.message
    });
    Actions.ForceUndoCheckout = (id) => ({
        type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST',
        id
    });
    Actions.ForceUndoCheckoutSuccess = (response) => ({
        type: 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS',
        response: normalizr_1.normalize(response.response.d, Schema_1.Schemas.content)
    });
    Actions.ForceUndoCheckoutFailure = (error) => ({
        type: 'FORCEUNDOCHECKOUT_CONTENT_FAILURE',
        message: error.message
    });
    Actions.RestoreVersion = (id, version) => ({
        type: 'RESTOREVERSION_CONTENT_REQUEST',
        id,
        version
    });
    Actions.RestoreVersionSuccess = (response) => ({
        type: 'RESTOREVERSION_CONTENT_SUCCESS',
        response: normalizr_1.normalize(response.response.d, Schema_1.Schemas.content)
    });
    Actions.RestoreVersionFailure = (error) => ({
        type: 'RESTOREVERSION_CONTENT_FAILURE',
        message: error.message
    });
    Actions.UserLogin = (userName, password) => ({
        type: 'USER_LOGIN_REQUEST',
        userName,
        password
    });
    Actions.UserLoginSuccess = (response) => ({
        type: 'USER_LOGIN_SUCCESS',
        response: response.response.d
    });
    Actions.UserLoginFailure = (error) => ({
        type: 'USER_LOGIN_FAILURE',
        message: (error.status === 403) ? 'The username or the password is not valid!' : error.message
    });
    Actions.UserLogout = () => ({
        type: 'USER_LOGOUT_REQUEST'
    });
    Actions.UserLogoutSuccess = (response) => ({
        type: 'USER_LOGOUT_SUCCESS'
    });
    Actions.UserLogoutFailure = (error) => ({
        type: 'USER_LOGOUT_FAILURE',
        message: error.message
    });
})(Actions = exports.Actions || (exports.Actions = {}));

//# sourceMappingURL=Actions.js.map
