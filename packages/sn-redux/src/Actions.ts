import { normalize } from 'normalizr';
import { Schemas } from './Schema';
import * as SN from 'sn-client-js';

/**
 * Module that contains the action creators. 
 * 
 * _Redux actions are payloads of information that send data from your application to your store. They are the only source of information for the store. You send them to the store using 
 * ```store.dispatch()```. Actions are plain JavaScript objects. Actions must have a type property that indicates the type of action being performed._
 * 
 * Learn more about Redux actions [here](http://redux.js.org/docs/basics/Actions.html)
 * 
 * Following are Redux actions but they're all related with a Sense/Net built-in action. Since this Sense/Net built-in actions are OData actions and functions and they get and set 
 * data throught ajax request we have to handle the main steps of their process separately. So there're three separate redux action for every Sense/Net action:
 * one for the request itself and two for the two possible end of an ajax request, success and fail.
 * 
 * All of the JSON responses with content or collection are normalized so you shouldn't care about how to handle nested data structure, normalizr takes JSON and a schema and replaces 
 * nested entities with their IDs, gathering all entities in dictionaries.
 * For further information about normalizr check this [link](https://github.com/paularmstrong/normalizr).
 * 
 * ```
 * [{
 *  Id: 5145,
 *  DisplayName: 'Some Article',
 *  Status: ['Active']
 * }, {
 *  Id: 5146,
 *  Displayname: 'Other Article',
 *  Status: ['Completed']
 * }]
 * 
 * ```
 * 
 * is normalized to
 * 
 * ```
 * result: [5145, 5146],
 * entities: {
 *  collection: {
 *      5145: {
 *          Id: 5145,
 *          DisplayName: 'Some Article',
 *          Status: ['Active']
 *      },
 *      5146: {
 *          Id: 5146,
 *          Displayname: 'Other Article',
 *          Status: ['Completed']
 *      }
 *  }
 * }
 * ```
 * 
 * Following module now cover the CRUD operations, so it contains Actions which are related to fetching, creating, deleting and updating Content. Other built-in SenseNet OData
 * Actions and Functions will be the parts of this module too and you are be able to add your custom Actions too by combining your reducers with the built-in ones.
 * 
 * ### Using built-in redux actions in your views
 * 
 * ```
 * import * as React from 'react'
 * import { connect } from 'react-redux'
 * import { TextField } from 'material-ui/TextField';
 * import RaisedButton from 'material-ui/RaisedButton';
 * import { Actions } from 'sn-redux';
 * import { Content } from './SenseNet/Content';
 * 
 * let AddTodo = ({ dispatch }) => {
 *   let input
 * 
 *   return (
 *     <div>
 *       <form onSubmit={e => {
 *         e.preventDefault()
 *         if (!input.value.trim()) {
 *           return
 *         }
 *         const content = new Content({
 *           Type: 'Task',
 *           DisplayName: input.value
 *         });
 *         content["Status"] = "active";
 *         const ROOT_URL = 'https://mySite.com/OData.svc/workspaces/Project/budapestprojectworkspace/Tasks';
 *         dispatch(Actions.createContent(ROOT_URL, content))
 *         input.value = ''
 *       } }>
 *         <input className="textField" ref={node => {
 *           input = node
 *         } } />
 *         <RaisedButton type="submit" primary={true} label="Add Todo" />
 *       </form>
 *     </div>
 *   )
 * }
 * AddTodo = connect()(AddTodo)
 * ```
 * 
 * ### Combining your custom redux reducers with sn-redux's root reducer.
 * 
 * ```
 * import { combineReducers } from 'redux';
 * import { Store, Reducers } from 'sn-redux';
 * import { Root } from './components/Root'
 * import { listByFilter } from './reducers/filtering'
 * 
 * const collection = Reducers.collection;
 * const myReducer = combineReducers({
 *   collection,
 *   listByFilter
 * });
 * 
 * const store = Store.configureStore(myReducer);
 * ```
 */
export module Actions {
    /**
     * Action creator for requesting a content from Sense/Net Content Repository to get its children content.
     * @param path {string} Path of the requested parent item.
     * @param options {OData.IODataParams} Represents an ODataOptions object based on the IODataOptions interface. Holds the possible url parameters as properties.
     * @returns {Object} Returns a redux action with the properties type, path and filter. 
     */
    export const RequestContent = (path: string, options: SN.ODataApi.IODataParams = {}) => ({
        type: 'FETCH_CONTENT_REQUEST',
        path,
        filter: SN.ODataHelper.buildUrlParamString(options)
    });
    /**
     * Action creator for the step when a fetching request ends successfully.
     * @param response {any} JSON response of the ajax request.
     * @param filter {string} String with the url params.
     * @returns {Object} Returns a redux action with the properties type, normalized response and filter. 
     */
    export const ReceiveContent = (response: any, filter: string) =>
        ({
            type: 'FETCH_CONTENT_SUCCESS',
            response: normalize(response.d.results, Schemas.arrayOfContent),
            filter
        })
    /**
     * Action creator for the step when a fetching request failed.
     * @param filter {string} String with the url params.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type, filter and errormessage. 
    */
    export const ReceiveContentFailure = (filter: string, error: any) => ({
        type: 'FETCH_CONTENT_FAILURE',
        filter,
        message: error.message
    });
    /**
     * Action creator for creating a Content in the Content Repository.
     * @param path {string} Path of the parent item.
     * @param content {Content} Content that have to be created in the Content Respository.
     * @returns {Object} Returns a redux action with the properties type, path of the parent and content. 
     */
    export const CreateContent = (path: string, content: SN.Content) => ({ type: 'CREATE_CONTENT_REQUEST', content, path });
    /**
     * Action creator for the step when Content creation on the server ends successfully.
     * @param response {any} JSON response of the ajax request.
     * @returns {Object} Returns a redux action with the properties type and the normalized response. 
     */
    export const CreateContentSuccess = (response: any) =>
        ({
            type: 'CREATE_CONTENT_SUCCESS',
            response: normalize(response.response.d, Schemas.content)
        });
    /**
     * Action creator for the step when Content creation failed on the server.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type and the error message. 
    */
    export const CreateContentFailure = (error: any) => ({
        type: 'CREATE_CONTENT_FAILURE',
        message: error.message
    });
    /**
      * Action creator for updating a Content in the Content Repository.
      * @param id {number} Id of the Content that has to be updated.
      * @param fields {Object} Object with the field value pairs that have to be modified.
      * @returns {Object} Returns a redux action with the properties type, id and fields. 
     */
    export const UpdateContent = (id: number, fields: Object) => ({ type: 'UPDATE_CONTENT_REQUEST', id, fields });
    /**
     * Action creator for the step when Content modification on the server ends successfully.
     * @param response {any} JSON response of the ajax request.
     * @returns {Object} Returns a redux action with the properties type and the response. 
     */
    export const UpdateContentSuccess = (response: any) =>
        ({
            type: 'UPDATE_CONTENT_SUCCESS',
            response: normalize(response.response.d, Schemas.content)
        });
    /**
     * Action creator for the step when Content modification failed on the server.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type and the error message. 
    */
    export const UpdateContentFailure = (error: any) => ({
        type: 'UPDATE_CONTENT_FAILURE',
        message: error.message
    })
    /**
      * Action creator for deleting a Content from the Content Repository.
      * @param id {number} Id of the Content that has to be deleted.
      * @param permanently {boolean} Defines whether the a Content must be moved to the Trash or deleted permanently.
      * @returns {Object} Returns a redux action with the properties type, id and permanently. 
    */
    export const Delete = (id: number, permanently: boolean = false) => ({ type: 'DELETE_CONTENT_REQUEST', id, permanently });
    /**
      * Action creator for the step when Content deleted successfully.
      * @param index {number} Index of the item in the state collection.
      * @returns {Object} Returns a redux action with the properties type and index. 
    */
    export const DeleteSuccess = (index: number, id: number) => ({
        type: 'DELETE_CONTENT_SUCCESS',
        index,
        id
    })
    /**
     * Action creator for the step when deleting a Content is failed.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type and the error message. 
    */
    export const DeleteFailure = (error: any) => ({
        type: 'DELETE_CONTENT_FAILURE',
        message: error.message
    })
    /**
      * Action creator for deleting multiple Content from the Content Repository.
      * @param path {string} Path of the parent Content.
      * @param ids {string[]} Array of ids of the Content that should be deleted.
      * @param permanently {boolean} Defines whether Content must be moved to the Trash or deleted permanently.
      * @returns {Object} Returns a redux action with the properties type, id and permanently. 
    */
    export const DeleteBatch = (path: string, ids: string[], permanently: boolean = false) => ({
        type: 'DELETE_BATCH_REQUEST',
        path,
        ids,
        permanently
    })
    /**
      * Action creator for the step when multiple Content deleted successfully.
      * @param indexes {number[]} Array of indexes of the items in the state collection that should be removed.
      * @returns {Object} Returns a redux action with the properties type and index. 
    */
    export const DeleteBatchSuccess = (indexes: number[]) => ({
        type: 'DELETE_BATCH_SUCCESS',
        indexes
    })
    /**
     * Action creator for the step when deleting multiple Content is failed.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type and the error message. 
    */
    export const DeleteBatchFailure = (error: any) => ({
        type: 'DELETE_BATCH_FAILURE',
        message: error.message
    })
    /**
      * Action creator for checking out a Content in the Content Repository.
      * @param id {number} Id of the content that should be checked out.
      * @returns {Object} Returns a redux action with the properties type and id . 
    */
    export const CheckOut = (id: number) => ({
        type: 'CHECKOUT_CONTENT_REQUEST',
        id
    })
    /**
      * Action creator for the step when a Content is checked out successfully.
      * @param response {any} JSON response of the ajax request.
      * @returns {Object} Returns a redux action with the properties type and the normalized JSON response. 
    */
    export const CheckOutSuccess = (response: any) => ({
        type: 'CHECKOUT_CONTENT_SUCCESS',
        response: normalize(response.response.d, Schemas.content)
    })
    /**
     * Action creator for the step when checking out a Content is failed.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type and the error message. 
    */
    export const CheckOutFailure = (error: any) => ({
        type: 'CHECKOUT_CONTENT_FAILURE',
        message: error.message
    })
    /**
      * Action creator for checking in a Content in the Content Repository.
      * @param id {number} Id of the content that should be checked in.
      * @returns {Object} Returns a redux action with the properties type, id and checkinComment. 
    */
    export const CheckIn = (id: number, checkInComment: string = '') => ({
        type: 'CHECKIN_CONTENT_REQUEST',
        id,
        checkInComment
    })
    /**
      * Action creator for the step when a Content is checked in successfully.
      * @param response {any} JSON response of the ajax request.
      * @returns {Object} Returns a redux action with the properties type and the normalized JSON response. 
    */
    export const CheckInSuccess = (response: any) => ({
        type: 'CHECKIN_CONTENT_SUCCESS',
        response: normalize(response.response.d, Schemas.content)
    })
    /**
     * Action creator for the step when checking out a Content is failed.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type and the error message. 
    */
    export const CheckInFailure = (error: any) => ({
        type: 'CHECKIN_CONTENT_FAILURE',
        message: error.message
    })
    /**
      * Action creator for publishing a Content in the Content Repository.
      * @param id {number} Id of the content that should be published.
      * @returns {Object} Returns a redux action with the properties type and id. 
    */
    export const Publish = (id: number) => ({
        type: 'PUBLISH_CONTENT_REQUEST',
        id
    })
    /**
      * Action creator for the step when a Content is published successfully.
      * @param response {any} JSON response of the ajax request.
      * @returns {Object} Returns a redux action with the properties type and the normalized JSON response. 
    */
    export const PublishSuccess = (response: any) => ({
        type: 'PUBLISH_CONTENT_SUCCESS',
        response: normalize(response.response.d, Schemas.content)
    })
    /**
     * Action creator for the step when publishing a Content is failed.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type and the error message. 
    */
    export const PublishFailure = (error: any) => ({
        type: 'PUBLISH_CONTENT_FAILURE',
        message: error.message
    })
    /**
      * Action creator for approving a Content in the Content Repository.
      * @param id {number} Id of the content that should be approved.
      * @returns {Object} Returns a redux action with the properties type and id. 
    */
    export const Approve = (id: number) => ({
        type: 'APPROVE_CONTENT_REQUEST',
        id
    })
    /**
      * Action creator for the step when a Content is approved successfully.
      * @param response {any} JSON response of the ajax request.
      * @returns {Object} Returns a redux action with the properties type and the normalized JSON response. 
    */
    export const ApproveSuccess = (response: any) => ({
        type: 'APPROVE_CONTENT_SUCCESS',
        response: normalize(response.response.d, Schemas.content)
    })
    /**
     * Action creator for the step when approving a Content is failed.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type and the error message. 
    */
    export const ApproveFailure = (error: any) => ({
        type: 'APPROVE_CONTENT_FAILURE',
        message: error.message
    })
    /**
      * Action creator for rejecting a Content in the Content Repository.
      * @param id {number} Id of the content that should be rejected.
      * @param rejectReason {string} Reason of rejecting.
      * @returns {Object} Returns a redux action with the properties type, rejectReason and id. 
    */
    export const Reject = (id: number, rejectReason: string = '') => ({
        type: 'REJECT_CONTENT_REQUEST',
        id,
        rejectReason
    })
    /**
      * Action creator for the step when a Content is rejected successfully.
      * @param response {any} JSON response of the ajax request.
      * @returns {Object} Returns a redux action with the properties type and the normalized JSON response. 
    */
    export const RejectSuccess = (response: any) => ({
        type: 'REJECT_CONTENT_SUCCESS',
        response: normalize(response.response.d, Schemas.content)
    })
    /**
     * Action creator for the step when rejecting a Content is failed.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type and the error message. 
    */
    export const RejectFailure = (error: any) => ({
        type: 'REJECT_CONTENT_FAILURE',
        message: error.message
    })
    /**
      * Action creator for undoing checkout on a Content in the Content Repository.
      * @param id {number} Id of the content that should be checked in.
      * @returns {Object} Returns a redux action with the properties type and id. 
    */
    export const UndoCheckout = (id: number) => ({
        type: 'UNDOCHECKOUT_CONTENT_REQUEST',
        id
    })
    /**
      * Action creator for the step when a Content is checked-in successfully.
      * @param response {any} JSON response of the ajax request.
      * @returns {Object} Returns a redux action with the properties type and the normalized JSON response. 
    */
    export const UndoCheckoutSuccess = (response: any) => ({
        type: 'UNDOCHECKOUT_CONTENT_SUCCESS',
        response: normalize(response.response.d, Schemas.content)
    })
    /**
     * Action creator for the step when undoing checkout on a Content is failed.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type and the error message. 
    */
    export const UndoCheckoutFailure = (error: any) => ({
        type: 'UNDOCHECKOUT_CONTENT_FAILURE',
        message: error.message
    })
    /**
      * Action creator for undoing checkout on a Content in the Content Repository.
      * @param id {number} Id of the content that should be checked in.
      * @returns {Object} Returns a redux action with the properties type and id. 
    */
    export const ForceUndoCheckout = (id: number) => ({
        type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST',
        id
    })
    /**
      * Action creator for the step when a Content is checked-in successfully.
      * @param response {any} JSON response of the ajax request.
      * @returns {Object} Returns a redux action with the properties type and the normalized JSON response. 
    */
    export const ForceUndoCheckoutSuccess = (response: any) => ({
        type: 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS',
        response: normalize(response.response.d, Schemas.content)
    })
    /**
     * Action creator for the step when undoing checkout on a Content is failed.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type and the error message. 
    */
    export const ForceUndoCheckoutFailure = (error: any) => ({
        type: 'FORCEUNDOCHECKOUT_CONTENT_FAILURE',
        message: error.message
    })
    /**
      * Action creator for restoring the version of a Content in the Content Repository.
      * @param id {number} Id of the content that should be checked in.
      * @param version {string} Specify which old version to restore
      * @returns {Object} Returns a redux action with the properties type and id. 
    */
    export const RestoreVersion = (id: number, version: string) => ({
        type: 'RESTOREVERSION_CONTENT_REQUEST',
        id,
        version
    })
    /**
      * Action creator for the step when a Content is restored to a previous version successfully.
      * @param response {any} JSON response of the ajax request.
      * @returns {Object} Returns a redux action with the properties type and the normalized JSON response. 
    */
    export const RestoreVersionSuccess = (response: any) => ({
        type: 'RESTOREVERSION_CONTENT_SUCCESS',
        response: normalize(response.response.d, Schemas.content)
    })
    /**
     * Action creator for the step when restoring a previous version of a Content is failed.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type and the error message. 
    */
    export const RestoreVersionFailure = (error: any) => ({
        type: 'RESTOREVERSION_CONTENT_FAILURE',
        message: error.message
    })

    /**
      * Action creator for login a user to a Sense/Net portal.
      * @param userName {string} Login name of the user.
      * @param password {string} Password of the user.
      * @returns {Object} Returns a redux action with the properties userName and password.
    */
    export const UserLogin = (userName: string, password: string) => ({
        type: 'USER_LOGIN_REQUEST',
        userName,
        password
    })
    /**
      * Action creator for the step when a User is logged in successfully.
      * @param response {any} JSON response of the ajax request.
      * @returns {Object} Returns a redux action with the user as a response.
    */
    export const UserLoginSuccess = (response: any) => ({
        type: 'USER_LOGIN_SUCCESS',
        response: response.response.d
    })
    /**
     * Action creator for the step when login of a user is failed.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type and the error message. 
    */
    export const UserLoginFailure = (error: any) => ({
        type: 'USER_LOGIN_FAILURE',
        message: (error.status === 403) ? 'The username or the password is not valid!' : error.message
    })

    /**
      * Action creator for logout a user from a Sense/Net portal.
      * @returns {Object} Returns a redux action.
    */
    export const UserLogout = () => ({
        type: 'USER_LOGOUT_REQUEST'
    })
    /**
      * Action creator for the step when a user is logged out successfully.
      * @param response {any} JSON response of the ajax request.
      * @returns {Object} Returns a redux action with a response.
    */
    export const UserLogoutSuccess = (response: any) => ({
        type: 'USER_LOGOUT_SUCCESS'
    })
    /**
     * Action creator for the step when logging out of a user is failed.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type and the error message. 
    */
    export const UserLogoutFailure = (error: any) => ({
        type: 'USER_LOGOUT_FAILURE',
        message: error.message
    })
}