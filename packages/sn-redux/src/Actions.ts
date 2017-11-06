import { normalize } from 'normalizr';
import { Schemas } from './Schema';
import { Content, IContent, ODataApi, ODataHelper, Repository, ContentTypes } from 'sn-client-js';

/**
 * Module that contains the action creators.
 *
 * _Redux actions are payloads of information that send data from your application to your store. They are the only source of information for the store. You send them to the store using
 * ```store.dispatch()```. Actions are plain JavaScript objects. Actions must have a type property that indicates the type of action being performed._
 *
 * Learn more about Redux actions [here](http://redux.js.org/docs/basics/Actions.html)
 *
 * Following are Redux actions but they're all related with a sensenet built-in action. Since this sensenet built-in actions are OData actions and functions and they get and set
 * data throught ajax request we have to handle the main steps of their process separately. So there're three separate redux action for every sensenet action:
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
 *         dispatch(Actions.createContent(content))
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
 * const sensenet = Reducers.sensenet;
 * const myReducer = combineReducers({
 *   sensenet,
 *   listByFilter
 * });
 *
 * const store = Store.configureStore(myReducer);
 * ```
 */
export module Actions {
    /**
     * Action creator for intializing a sensenet store.
     * @param path {string} Path of the root Content
     * @param options {OData.IODataParams} Represents an ODataOptions object based on the IODataOptions interface. Holds the possible url parameters as properties.
     */
    export const InitSensenetStore = (path?: string, options: ODataApi.IODataParams<IContent> = {}) => ({
        type: 'INIT_SENSENET_STORE',
        path: path ? path : '/Root',
        options: options
    })
    /**
     * Action creator for requesting a content from sensenet Content Repository to get its children content.
     * @param path {string} Path of the requested parent item.
     * @param options {OData.IODataParams<T>} Represents an ODataOptions object based on the IODataOptions interface. Holds the possible url parameters as properties.
     * @param contentType {ContentType} Content Type of the requested content.
     * @returns {Object} Returns a redux action with the properties type, path, options and contentType.
     */
    export const RequestContent = <T extends IContent = IContent>(path: string, options: ODataApi.IODataParams<T> = {}, contentType?: { new(...args): T }) => ({
        type: 'FETCH_CONTENT_REQUEST',
        path,
        options,
        contentType
    });
    /**
     * Action creator for the step when a fetching request ends successfully.
     * @param response {Content[]} response of the ajax request as a Content array.
     * @param params {string} String with the url params.
     * @returns {Object} Returns a redux action with the properties type, normalized response and params.
     */
    export const ReceiveContent = (response: IContent[], params: any) =>
        ({
            type: 'FETCH_CONTENT_SUCCESS',
            response: normalize(response, Schemas.arrayOfContent),
            params
        })
    /**
     * Action creator for the step when a fetching request failed.
     * @param params {string} String with the url params.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type, params and errormessage.
    */
    export const ReceiveContentFailure = (params: any, error: any) => ({
        type: 'FETCH_CONTENT_FAILURE',
        params,
        message: error.message
    });
    /**
     * Action creator for loading a content from sensenet Content Repository.
     * @param id {number} Path of the requested item.
     * @param options {OData.IODataParams<T>} Represents an ODataOptions object based on the IODataOptions interface. Holds the possible url parameters as properties.
     * @param contentType {ContentType} Content Type of the requested content.
     * @returns {Object} Returns a redux action with the properties id, options and contentType.
     */
    export const LoadContent = <T extends IContent = IContent>(id: number, options: ODataApi.IODataParams<T> = {}, contentType?: { new(...args): T }) => ({
        type: 'LOAD_CONTENT_REQUEST',
        id,
        options: options,
        contentType
    });
    /**
     * Action creator for the step when a loading request ends successfully.
     * @param response {Content} response of the ajax request as a Content object.
     * @param params {string} String with the url params.
     * @returns {Object} Returns a redux action with the properties type, normalized response and params.
     */
    export const ReceiveLoadedContent = <T extends IContent = IContent>(response: Content<T>, params: any) =>
        ({
            type: 'LOAD_CONTENT_SUCCESS',
            response,
            params
        })
    /**
     * Action creator for the step when a loading request failed.
     * @param params {string} String with the url params.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type, params and errormessage.
    */
    export const ReceiveLoadedContentFailure = (params: any, error: any) => ({
        type: 'LOAD_CONTENT_FAILURE',
        params,
        message: error.message
    });
    /**
     * Action creator for loading Actions of a Content from sensenet Content Repository.
     * @param content {Content} The requested Content.
     * @param scenario {string} The Actions should be in the given Scenario
     */
    export const LoadContentActions = (content: IContent, scenario?: string) => ({
        type: 'LOAD_CONTENT_ACTIONS',
        content,
        scenario
    })
    /**
     * Action creator for the step when a Action loading request ends successfully.
     * @param response {any} JSON response of the ajax request.
     */
    export const ReceiveContentActions = (response: any) => ({
        type: 'LOAD_CONTENT_ACTIONS_SUCCESS',
        actions: response
    })
    /**
     * Action creator for the step when a loading Actions request failed.
     * @param error {any} The catched error object.
     */
    export const ReceiveContentActionsFailure = (error: any) => ({
        type: 'LOAD_CONTENT_ACTIONS_FAILURE',
        error
    })
    /**
     * Action creator for reloading a content from sensenet Content Repository.
     * @param content {Content} The Content that shold be reloaded.
     * @param actionName {string} Name of the action witch which we want to reload the content (edit, new, etc).
     * @returns {Object} Returns a redux action with the properties type and actionName.
     */
    export const ReloadContent = <T extends IContent = IContent>(content: Content<T>, actionName: 'edit' | 'view') => ({
        type: 'RELOAD_CONTENT_REQUEST',
        content,
        actionName
    });
    /**
     * Action creator for the step when a reloading request ends successfully.
     * @param response {Content} Response of the ajax request as Content.
     * @returns {Object} Returns a redux action with the properties type and the response.
     */
    export const ReceiveReloadedContent = (response: Content) =>
        ({
            type: 'RELOAD_CONTENT_SUCCESS',
            response
        })
    /**
     * Action creator for the step when a reloading request failed.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type and errormessage.
    */
    export const ReceiveReloadedContentFailure = (error: any) => ({
        type: 'RELOAD_CONTENT_FAILURE',
        message: error.message
    });
    /**
     * Action creator for reloading fields of a content from sensenet Content Repository.
     * @param content {Content} The Content which' fields should be reloaded.
     * @param fields {any[]} List of the fields to be loaded
     * @returns {Object} Returns a redux action with the properties type and fields.
     */
    export const ReloadContentFields = (content: Content, fields: any[]) => ({
        type: 'RELOAD_CONTENTFIELDS_REQUEST',
        content,
        fields
    });
    /**
     * Action creator for the step when a reloading fields of a content request ends successfully.
     * @param response {Content} Response of the ajax request as a Content.
     * @returns {Object} Returns a redux action with the properties type and normalized response.
     */
    export const ReceiveReloadedContentFields = (response: Content) =>
        ({
            type: 'RELOAD_CONTENTFIELDS_SUCCESS',
            response: response
        })
    /**
     * Action creator for the step when a reloading fields of a content request failed.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type and errormessage.
    */
    export const ReceiveReloadedContentFieldsFailure = (error: any) => ({
        type: 'RELOAD_CONTENTFIELDS_FAILURE',
        message: error.message
    });
    /**
     * Action creator for creating a Content in the Content Repository.
     * @param content {Content} Content that have to be created in the Content Respository.
     * @returns {Object} Returns a redux action with the properties type, path of the parent and content.
     */
    export const CreateContent = <T extends IContent = IContent>(content: T) => ({
        type: 'CREATE_CONTENT_REQUEST',
        content
    });
    /**
     * Action creator for the step when Content creation on the server ends successfully.
     * @param response {Content} JSON response of the ajax request as a Content.
     * @returns {Object} Returns a redux action with the properties type and the normalized response.
     */
    export const CreateContentSuccess = (response: Content) =>
        ({
            type: 'CREATE_CONTENT_SUCCESS',
            response: normalize(response, Schemas.content)
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
      * @param content {Object} Content object with the field value pairs that have to be modified.
      * @returns {Object} Returns a redux action with the properties type, id and fields.
     */
    export const UpdateContent = <T extends IContent = IContent>(content: Partial<T>) => ({
        type: 'UPDATE_CONTENT_REQUEST',
        content
    });
    /**
     * Action creator for the step when Content modification on the server ends successfully.
     * @param response {Content} JSON response of the ajax request as a Content.
     * @returns {Object} Returns a redux action with the properties type and the response.
     */
    export const UpdateContentSuccess = (response: Content) =>
        ({
            type: 'UPDATE_CONTENT_SUCCESS',
            response: response
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
      * @param content {content} Content object that has to be deleted.
      * @param permanently {boolean} Defines whether the a Content must be moved to the Trash or deleted permanently.
      * @returns {Object} Returns a redux action with the properties type, id and permanently.
    */
    export const Delete = <T extends IContent = IContent>(content: T, permanently: boolean = false) => ({ type: 'DELETE_CONTENT_REQUEST', content, permanently });
    /**
      * Action creator for the step when Content deleted successfully.
      * @param index {number} Index of the item in the state collection.
      * @param id {number} Id of the item in the state collection.
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
      * @param path {string} Path of parent the Content.
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
    export const DeleteBatchSuccess = (ids: number[]) => ({
        type: 'DELETE_BATCH_SUCCESS',
        ids
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
      * @param content {number} Content that should be checked out.
      * @returns {Object} Returns a redux action with the properties type and id .
    */
    export const CheckOut = <T extends IContent = IContent>(content: T) => ({
        type: 'CHECKOUT_CONTENT_REQUEST',
        content
    })
    /**
      * Action creator for the step when a Content is checked out successfully.
      * @param response {Content} JSON response of the ajax request as a Content object.
      * @returns {Object} Returns a redux action with the properties type and the normalized JSON response.
    */
    export const CheckOutSuccess = (response: Content) => ({
        type: 'CHECKOUT_CONTENT_SUCCESS',
        response: response
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
      * @param content {Content} Content that should be checked in.
      * @returns {Object} Returns a redux action with the properties type, id and checkinComment.
    */
    export const CheckIn = <T extends IContent = IContent>(content: T, checkInComment: string = '') => ({
        type: 'CHECKIN_CONTENT_REQUEST',
        content,
        checkInComment
    })
    /**
      * Action creator for the step when a Content is checked in successfully.
      * @param response {Content} JSON response of the ajax request as a Content object.
      * @returns {Object} Returns a redux action with the properties type and the normalized JSON response.
    */
    export const CheckInSuccess = (response: Content) => ({
        type: 'CHECKIN_CONTENT_SUCCESS',
        response: response
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
      * @param content {Content} Content that should be published.
      * @returns {Object} Returns a redux action with the properties type and id.
    */
    export const Publish = <T extends IContent = IContent>(content: T) => ({
        type: 'PUBLISH_CONTENT_REQUEST',
        content
    })
    /**
      * Action creator for the step when a Content is published successfully.
      * @param response {Content} JSON response of the ajax request as a Content object.
      * @returns {Object} Returns a redux action with the properties type and the normalized JSON response.
    */
    export const PublishSuccess = (response: Content) => ({
        type: 'PUBLISH_CONTENT_SUCCESS',
        response: response
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
      * @param content {Content} Content that should be approved.
      * @returns {Object} Returns a redux action with the properties type and id.
    */
    export const Approve = <T extends IContent = IContent>(content: T) => ({
        type: 'APPROVE_CONTENT_REQUEST',
        content
    })
    /**
      * Action creator for the step when a Content is approved successfully.
      * @param response {Content} JSON response of the ajax request as a Content object.
      * @returns {Object} Returns a redux action with the properties type and the normalized JSON response.
    */
    export const ApproveSuccess = (response: Content) => ({
        type: 'APPROVE_CONTENT_SUCCESS',
        response: response
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
      * @param content {Content} Content that should be rejected.
      * @param rejectReason {string} Reason of rejecting.
      * @returns {Object} Returns a redux action with the properties type, rejectReason and id.
    */
    export const Reject = <T extends IContent = IContent>(content: T, rejectReason: string = '') => ({
        type: 'REJECT_CONTENT_REQUEST',
        content,
        rejectReason
    })
    /**
      * Action creator for the step when a Content is rejected successfully.
      * @param response {Content} JSON response of the ajax request as a Content object.
      * @returns {Object} Returns a redux action with the properties type and the normalized JSON response.
    */
    export const RejectSuccess = (response: Content) => ({
        type: 'REJECT_CONTENT_SUCCESS',
        response: response
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
      * @param content {Content} Content that should be checked in.
      * @returns {Object} Returns a redux action with the properties type and id.
    */
    export const UndoCheckout = <T extends IContent = IContent>(content: T) => ({
        type: 'UNDOCHECKOUT_CONTENT_REQUEST',
        content
    })
    /**
      * Action creator for the step when a Content is checked-in successfully.
      * @param response {Content} JSON response of the ajax request as a Content object.
      * @returns {Object} Returns a redux action with the properties type and the normalized JSON response.
    */
    export const UndoCheckoutSuccess = (response: Content) => ({
        type: 'UNDOCHECKOUT_CONTENT_SUCCESS',
        response: response
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
      * @param content {Content} Content that should be checked in.
      * @returns {Object} Returns a redux action with the properties type and id.
    */
    export const ForceUndoCheckout = <T extends IContent = IContent>(content: T) => ({
        type: 'FORCEUNDOCHECKOUT_CONTENT_REQUEST',
        content
    })
    /**
      * Action creator for the step when a Content is checked-in successfully.
      * @param response {Content} JSON response of the ajax request as a Content object.
      * @returns {Object} Returns a redux action with the properties type and the normalized JSON response.
    */
    export const ForceUndoCheckoutSuccess = (response: Content) => ({
        type: 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS',
        response: response
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
      * @param content {Content} Content that should be checked in.
      * @param version {string} Specify which old version to restore
      * @returns {Object} Returns a redux action with the properties type and id.
    */
    export const RestoreVersion = <T extends IContent = IContent>(content: T, version: string) => ({
        type: 'RESTOREVERSION_CONTENT_REQUEST',
        content,
        version
    })
    /**
      * Action creator for the step when a Content is restored to a previous version successfully.
      * @param response {Content} JSON response of the ajax request as a Content object.
      * @returns {Object} Returns a redux action with the properties type and the normalized JSON response.
    */
    export const RestoreVersionSuccess = (response: Content) => ({
        type: 'RESTOREVERSION_CONTENT_SUCCESS',
        response: response
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
      * Action creator for check user state in a sensenet ECM application.
      * @returns {Object} Returns a redux action with the properties.
    */
    export const CheckLoginState = () => ({
        type: 'CHECK_LOGIN_STATE_REQUEST'
    })
    /**
     * Action creator for user changes.
     * @param user {ContentTypes.User} User that should be checked.
     */
    export const UserChanged = (user) => ({
        type: 'USER_CHANGED',
        user
    })

    /**
      * Action creator for login a user to a sensenet portal.
      * @param {string} userName Login name of the user.
      * @param {string} password Password of the user.
      * @returns {Object} Returns a redux action with the properties userName and password.
    */
    export const UserLogin = (userName: string, password: string) => ({
        type: 'USER_LOGIN_REQUEST',
        userName,
        password
    })
    /**
     * Action creator for handling a user login success response without a loggedin user.
     * @param {boolean} response Response of the login request
     * @returns {Object} Returns a redux action with the properties userName and password.
     */
    export const UserLoginBuffer = (response: boolean) => ({
        type: 'USER_LOGIN_BUFFER',
        response
    })
    /**
      * Action creator for the step when a User is logged in successfully.
      * @param response {any} JSON response of the ajax request.
      * @returns {Object} Returns a redux action with the user as a response.
    */

    export const UserLoginSuccess = (content: Content<ContentTypes.User>) => ({
        type: 'USER_LOGIN_SUCCESS',
        response: content
    })
    /**
     * Action creator for the step when login of a user is failed.
     * @param error {any} The catched error object.
     * @returns {Object} Returns a redux action with the properties type and the error message.
    */
    export const UserLoginFailure = (error: {status?: number, message: string}) => ({
        type: 'USER_LOGIN_FAILURE',
        message: (error.status === 403) ? 'The username or the password is not valid!' : error.message
    })
    /**
      * Action creator for logout a user from a sensenet portal.
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
    /**
      * Action creator for load repository config.
      * @param repositoryConfig {any} The repository config object.
      * @returns {Object} Returns a redux action.
    */
    export const LoadRepository = (repositoryConfig) => ({
        type: 'LOAD_REPOSITORY',
        repository: repositoryConfig
    })
    /**
     * Action creator for selecting a Content
     * @param id {number} The id of the selected Content
    * @returns {Object} Returns a redux action.
     */
    export const SelectContent = (id) => ({
        type: 'SELECT_CONTENT',
        id
    })
    /**
     * Action creator for deselecting a Content
     * @param id {number} The id of the deselected Content
    * @returns {Object} Returns a redux action.
     */
    export const DeSelectContent = (id) => ({
        type: 'DESELECT_CONTENT',
        id
    })/**
    * Action creator for clearing the array of selected content
   * @returns {Object} Returns a redux action.
    */
    export const ClearSelection = () => ({
        type: 'CLEAR_SELECTION'
    })
    /**
     * Action creator for a request for get actions of a content by a given scenario.
     * @param content {Content} The name of the scenario
     * @param scenario {string} The name of the scenario
    * @returns {Object} Returns a redux action.
     */
    export const RequestContentActions = (content, scenario?: string) => ({
        type: 'REQUEST_CONTENT_ACTIONS',
        content,
        scenario
    })
    /**
     * Action creator for the step getting the actions of a content successfully.
     * @param response {any} JSON response of the ajax request.
     * @returns {Object} Returns a redux action with a response.
     */
    export const RequestContentActionsSuccess = (response: any, id: number) => {
        return ({
            type: 'REQUEST_CONTENT_ACTIONS_SUCCESS',
            response: response,
            id
        })
    }
    /**
     * Action creator for the step when getting the actions of a content is failed
     * @param error {any} JSON response of the ajax request.
     * @returns {Object} Returns a redux action with a response.
     */
    export const RequestContentActionsFailure = (error: any) => ({
        type: 'REQUEST_CONTENT_ACTIONS_FAILURE',
        message: error.message
    })
    /**
     * Action creator for uploading a Content into the Content Repository.
     * @param {Content} content The parent Content
     * @param file The file that should be uploaded
     * @param {ContentTypes.ContentType} [contentType=ContentTypes.File] ContentType of the Content that should be created with the binary (default is File)
     * @param {boolean} [overwrite=true] Determines whether the existing file with a same name should be overwritten or not (default is true)
     * @param {Object} [body=null] Contains extra stuff to request body 
     * @param {string} [propertyName='Binary'] Name of the field where the binary should be saved
     * @returns {Object} Returns a redux action with the properties type, content, file, contentType, overwrite, body and propertyName.
     */
    export const UploadRequest = (content: Content, file, contentType?, overwrite?: boolean, body?, propertyName?: string) => ({
        type: 'UPLOAD_CONTENT_REQUEST',
        content,
        file,
        contentType: contentType || ContentTypes.File,
        overwrite: typeof overwrite !== 'undefined' ? overwrite : true,
        body: body ? body : null,
        propertyName: propertyName ? propertyName : 'Binary'
    })
    /**
     * Action creator for the step when a content was uploaded successfully.
     * @param response {any} JSON response of the ajax request.
     * @returns {Object} Returns a redux action with a response.
     */
    export const UploadSuccess = (response) => ({
        type: 'UPLOAD_CONTENT_SUCCESS',
        response
    })
    /**
     * Action creator for the step when uploading a content is failed
     * @param error {any} JSON response of the ajax request.
     * @returns {Object} Returns a redux action with a response.
     */
    export const UploadFailure = (error: any) => ({
        type: 'UPLOAD_CONTENT_FAILURE',
        message: error.message
    })
}