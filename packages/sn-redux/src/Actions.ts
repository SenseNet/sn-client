/**
 * @module  Actions
 * @description Module that contains the action creators.
 *
 * _Redux actions are payloads of information that send data from your application to your store. They are the only source of information for the store. You send them to the store using
 * ```store.dispatch()```. Actions are plain JavaScript objects. Actions must have a type property that indicates the type of action being performed._
 *
 * Learn more about Redux actions [here](http://redux.js.org/docs/basics/Actions.html)
 *
 * Following are Redux actions but they're all related with a sensenet built-in action. Since this sensenet built-in actions are OData actions and functions and they get and set
 * data throught ajax request we have to handle the main steps of their process separately. There's a custom [middleware](https://github.com/SenseNet/sn-redux-promise-middleware)
 * included automatically when you create a sensenet store with Store.createSensenetStore. So that we don't have to create separate redux actions for every state of the actions
 * only one for the main request.
 *
 * All of the JSON responses with content or collection are normalized so you shouldn't care about how to handle nested data structure, normalizr takes JSON and a schema and replaces
 * nested entities with their Ids, gathering all entities in dictionaries.
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
 * results: [5145, 5146],
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
 * ### Using built-in redux actions in your views
 *
 * ```
 * import * as React from 'react'
 * import { connect } from 'react-redux'
 * import { TextField } from 'material-ui/TextField';
 * import RaisedButton from 'material-ui/RaisedButton';
 * import { Actions } from '@sensenet/redux';
 * import { Task } from '@sensenet/default-content-types';
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
 *         const content = {
 *           Name: input.value,
 *           Status: 'active',
 *          } as Task
 *
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
 * ```
 *
 * ### Combining your custom redux reducers with sensenet root reducer.
 *
 * ```
 * import { combineReducers } from 'redux';
 * import { Store, Reducers } from '@sensenet/redux';
 * import { Repository } from '@sensenet/client-core'
 * import { Root } from './components/Root'
 * import { listByFilter } from './reducers/filtering'
 *
 * const sensenet = Reducers.sensenet;
 * const myReducer = combineReducers({
 *   sensenet,
 *   listByFilter
 * });
 * const repository = new Repository({ repositoryUrl: 'https://mySensenetSite.com' }, async () => ({ ok: true } as any))
 * const options = {
 * repository,
 * rootReducer: myReducer
 * } as Store.CreateStoreOptions
 * const store = Store.createSensenetStore(options);
 * ```
 */
/**
 */
import { GoogleOauthProvider } from '@sensenet/authentication-google'
import { IContent, IODataResponse, LoginState, Repository, Upload } from '@sensenet/client-core'
import { IODataBatchResponse } from '@sensenet/client-core/dist/Models/IODataBatchResponse'
import { IODataParams } from '@sensenet/client-core/dist/Models/IODataParams'
import { GenericContent, IActionModel, Schema } from '@sensenet/default-content-types'
import { normalize } from 'normalizr'
import * as Schemas from './Schema'

/**
 * Action creator for requesting a content from sensenet Content Repository to get its children content.
 * @param path {string} path of the requested parent item.
 * @param options {OData.IODataParams<T>} Represents an ODataOptions object based on the IODataOptions interface. Holds the possible url parameters as properties.
 * @returns {Object} Returns normalized data while dispatches the next action based on the response.
 */
export const requestContent = (path: string, options: IODataParams<GenericContent> & { scenario: string } = { scenario: ''}) => ({
    type: 'FETCH_CONTENT',
    // tslint:disable:completed-docs
    async payload(repository: Repository) {
        const data = await repository.loadCollection({
            path,
            oDataOptions: options,
        })
        return normalize(data.d.results, Schemas.arrayOfContent)
    },
})
/**
 * Action creator for loading a content from sensenet Content Repository.
 * @param idOrPath {number|string} Id or path of the requested item.
 * @param options {OData.IODataParams<T>} Represents an ODataOptions object based on the IODataOptions interface. Holds the possible url parameters as properties.
 * @returns {Object} Returns the Content while dispatches the next action based on the response.
 */
export const loadContent = <T extends IContent = IContent>(idOrPath: number | string, options: IODataParams<T> = {}) => ({
    type: 'LOAD_CONTENT',
    // tslint:disable:completed-docs
    async payload(repository: Repository): Promise<IODataResponse<T>> {
        const data = await repository.load<T>({ idOrPath, oDataOptions: options })
        return data
    },
})
/**
 * Action creator for loading Actions of a Content from sensenet Content Repository.
 * @param idOrPath {number | string} Id or path of the requested Content.
 * @param scenario {string} The Actions should be in the given Scenario
 * @returns {Object} Returns the list of actions and dispatches the next action based on the response.
 */
export const loadContentActions = (idOrPath: number | string, scenario?: string) => ({
    type: 'LOAD_CONTENT_ACTIONS',
    // tslint:disable:completed-docs
    async payload(repository: Repository): Promise<{ d: IActionModel[] }> {
        const data = await repository.getActions({ idOrPath, scenario })
        return data
    },
})
/**
 * Action creator for creating a Content in the Content Repository.
 * @param parentPath {string} Path of the Content where the new Content should be created.
 * @param content {Content} Content that have to be created in the Content Respository.
 * @param contentType {string} Name of the Content Type of the Content.
 * @returns {Object} Returns the newly created Content and dispatches the next action based on the response.
 */
export const createContent = <T extends IContent = IContent>(parentPath: string, content: T, contentType: string) => ({
    type: 'CREATE_CONTENT',
    // tslint:disable:completed-docs
    async payload(repository: Repository): Promise<IODataResponse<T>> {
        const data = await repository.post<T>({ parentPath, content, contentType })
        return data
    },
})
/**
 * Action creator for creating a Content in the Content Repository.
 * @param idOrPath {number|string} Id or path of the Content.
 * @param content {Content} Content with the patchable Fields.
 * @returns {Object} Returns the modified Content and dispatches the next action based on the response.
 */
export const updateContent = <T extends IContent = IContent>(idOrPath: number | string, content: Partial<T>) => ({
    type: 'UPDATE_CONTENT',
    // tslint:disable:completed-docs
    async payload(repository: Repository) {
        const data = await repository.patch<T>({ idOrPath, content })
        return data
    },
})
/**
 * Action creator for deleting a Content from the Content Repository.
 * @param idOrPath {number | string} Id or path of the Content object that should be deleted.
 * @param permanently {boolean} Defines whether the a Content must be moved to the Trash or deleted permanently.
 * @returns {Object} Returns an object with the deleted item or error  and dispatches the next action based on the response.
 */
export const deleteContent = (idOrPath: number | string, permanently: boolean = false) => ({
    type: 'DELETE_CONTENT',
    // tslint:disable:completed-docs
    async payload(repository: Repository): Promise<IODataBatchResponse<IContent>> {
        const data = await repository.delete({ idOrPath, permanent: permanently })
        return data
    },
})
/**
 * Action creator for deleting multiple Content from the Content Repository.
 * @param contentItems {Array<number | string>} Array of ids or paths' of the Content items that should be deleted.
 * @param permanently {boolean} Defines whether Content must be moved to the Trash or deleted permanently.
 * @returns {Object} Returns an object with the deleted items or errors  and dispatches the next action based on the response.
 */
export const deleteBatch = (contentItems: Array<number | string>, permanently: boolean = false) => ({
    type: 'DELETE_BATCH',
    // tslint:disable:completed-docs
    async payload(repository: Repository): Promise<IODataBatchResponse<IContent>> {
        const data = await repository.delete({ idOrPath: contentItems, permanent: permanently })
        return data
    },
})
/**
 * Action creator for copying a Content in the Content Repository.
 * @param idOrPath {number|string} Id or path of the Content that should be copied.
 * @param targetPath {string} Path of the parent Content where the given Content should be copied.
 * @returns {Object} Returns the Content and dispatches the next action based on the response.
 */
export const copyContent = (idOrPath: number | string, targetPath: string) => ({
    type: 'COPY_CONTENT',
    // tslint:disable:completed-docs
    async payload(repository: Repository): Promise<IODataBatchResponse<IContent>> {
        const data = await repository.copy({ idOrPath, targetPath })
        return data
    },
})
/**
 * Action creator for copying multiple Content in the Content Repository.
 * @param idOrPath {Array<number | string>} Ids or paths' of the Content items that should be copied.
 * @param targetPath {string} Path of the parent Content where the given Content should be copied.
 * @returns {Object} Returns the list of the Content and dispatches the next action based on the response.
 */
export const copyBatch = (items: Array<number | string>, targetPath: string) => ({
    type: 'COPY_BATCH',
    // tslint:disable:completed-docs
    async payload(repository: Repository): Promise<IODataBatchResponse<IContent>> {
        const data = await repository.copy({ idOrPath: items, targetPath })
        return data
    },
})
/**
 * Action creator for moving a Content in the Content Repository.
 * @param idOrPath {number|string} Id or path of the Content that should be moved.
 * @param targetPath {string} Path of the parent Content where the given Content should be moved.
 * @returns {Object} Returns the Content and dispatches the next action based on the response.
 */
export const moveContent = (idOrPath: number | string, targetPath: string) => ({
    type: 'MOVE_CONTENT',
    // tslint:disable:completed-docs
    async payload(repository: Repository): Promise<IODataBatchResponse<IContent>> {
        const data = await repository.move({ idOrPath, targetPath })
        return data
    },
})
/**
 * Action creator for moving multiple Content in the Content Repository.
 * @param idOrPath {Array<number | string>} Ids or paths' of the Content items that should be moved.
 * @param targetPath {string} Path of the parent Content where the given Content should be moved.
 * @returns {Object} Returns the list of the Content and dispatches the next action based on the response.
 */
export const moveBatch = (items: Array<number | string>, targetPath: string) => ({
    type: 'MOVE_BATCH',
    // tslint:disable:completed-docs
    async payload(repository: Repository): Promise<IODataBatchResponse<IContent>> {
        const data = await repository.copy({ idOrPath: items, targetPath })
        return data
    },
})
/**
 * Action creator for checking out a Content in the Content Repository.
 * @param idOrPath {number | string} Id or path of the Content that should be checked out.
 * @param options {IODataParams} Options to filter the response.
 * @returns {Object} Returns the Content and dispatches the next action based on the response.
 */
export const checkOut = <T extends IContent = IContent>(idOrPath: number | string, options?: IODataParams<T>) => ({
    type: 'CHECKOUT_CONTENT',
    // tslint:disable:completed-docs
    async payload(repository: Repository) {
        const data = await repository.versioning.checkOut(idOrPath, options)
        return data
    },
})
/**
 * Action creator for checking in a Content in the Content Repository.
 * @param idOrPath {number | string} Id or Path of the Content that should be checked in.
 * @param checkInComments {string=''} Comments of the checkin.
 * @param options {IODataParams} Options to filter the response.
 * @returns {Object} Returns the Content and dispatches the next action based on the response.
 */
export const checkIn = <T extends IContent = IContent>(idOrPath: number | string, checkInComments: string = '', options?: IODataParams<T>) => ({
    type: 'CHECKIN_CONTENT',
    // tslint:disable:completed-docs
    async payload(repository: Repository) {
        const data = await repository.versioning.checkIn(idOrPath, checkInComments, options)
        return data
    },
})
/**
 * Action creator for publishing a Content in the Content Repository.
 * @param idOrPath {number | string} Id or Path of the Content that should be published.
 * @param options {IODataParams} Options to filter the response.
 * @returns {Object} Returns the Content and dispatches the next action based on the response.
 */
export const publish = <T extends IContent = IContent>(idOrPath: number | string, options?: IODataParams<T>) => ({
    type: 'PUBLISH_CONTENT',
    // tslint:disable:completed-docs
    async payload(repository: Repository) {
        const data = await repository.versioning.publish(idOrPath, options)
        return data
    },
})
/**
 * Action creator for approving a Content in the Content Repository.
 * @param idOrPath {number | string} Id or Path of the Content that should be approved.
 * @param options {IODataParams} Options to filter the response.
 * @returns {Object} Returns the Content and dispatches the next action based on the response.
 */
export const approve = <T extends IContent = IContent>(idOrPath: number | string, options?: IODataParams<T>) => ({
    type: 'APPROVE_CONTENT',
    // tslint:disable:completed-docs
    async payload(repository: Repository) {
        const data = await repository.versioning.approve(idOrPath, options)
        return data
    },
})
/**
 * Action creator for rejecting a Content in the Content Repository.
 * @param idOrPath {number | string} Id or Path of the Content that should be rejected.
 * @param rejectReason {string} Reason of rejecting.
 * @param options {IODataParams} Options to filter the response.
 * @returns {Object} Returns the Content and dispatches the next action based on the response.
 */
export const rejectContent = <T extends IContent = IContent>(idOrPath: number | string, rejectReason: string = '', options?: IODataParams<T>) => ({
    type: 'REJECT_CONTENT',
    // tslint:disable:completed-docs
    async payload(repository: Repository) {
        const data = await repository.versioning.reject(idOrPath, rejectReason, options)
        return data
    },
})
/**
 * Action creator for undoing checkout on a Content in the Content Repository.
 * @param idOrPath {number | string} Id or Path of the Content on which undo checkout be called.
 * @param options {IODataParams} Options to filter the response.
 * @returns {Object} Returns the Content and dispatches the next action based on the response.
 */
export const undoCheckout = <T extends IContent = IContent>(idOrPath: number | string, options?: IODataParams<T>) => ({
    type: 'UNDOCHECKOUT_CONTENT',
    // tslint:disable:completed-docs
    async payload(repository: Repository) {
        const data = await repository.versioning.undoCheckOut(idOrPath, options)
        return data
    },
})
/**
 * Action creator for force undoing checkout on a Content in the Content Repository.
 * @param idOrPath {number | string} Id or Path of the Content on which force undo checkout be called.
 * @param options {IODataParams} Options to filter the response.
 * @returns {Object} Returns the Content and dispatches the next action based on the response.
 */
export const forceUndoCheckout = <T extends IContent = IContent>(idOrPath: number | string, options?: IODataParams<T>) => ({
    type: 'FORCE_UNDOCHECKOUT_CONTENT',
    // tslint:disable:completed-docs
    async payload(repository: Repository) {
        const data = await repository.versioning.forceUndoCheckOut(idOrPath, options)
        return data
    },
})
/**
 * Action creator for restoring the version of a Content in the Content Repository.
 * @param idOrPath {number | string} Id or Path of the Content that should be checked in.
 * @param version {string} Specify which old version to restore.
 * @param options {IODataParams} Options to filter the response.
 * @returns {Object} Returns the Content and dispatches the next action based on the response.
 */
export const restoreVersion = <T extends IContent = IContent>(idOrPath: number | string, version: string, options?: IODataParams<T>) => ({
    type: 'RESTOREVERSION_CONTENT',
    // tslint:disable:completed-docs
    async payload(repository: Repository) {
        const data = await repository.versioning.restoreVersion(idOrPath, version, options)
        return data
    },
})
/**
 * Action creator for check user state in a sensenet application.
 * @returns {Object} Returns a redux action with the properties.
 */
export const loginStateChanged = (loginState: LoginState) => ({
    type: 'USER_LOGIN_STATE_CHANGED',
    loginState,
})
/**
 * Action creator for user changes.
 * @param user {ContentTypes.User} User that should be checked.
 * @returns {Object} Returns a redux action with the properties.
 */
export const userChanged = (user) => ({
    type: 'USER_CHANGED',
    user,
})
/**
 * Action creator for login a user to a sensenet portal.
 * @param {string} userName Login name of the user.
 * @param {string} password Password of the user.
 * @returns {Object} Returns a redux action with the properties userName and password.
 */
export const userLogin = (userName: string, password: string) => ({
    type: 'USER_LOGIN',
    // tslint:disable:completed-docs
    async payload(repository) {
        const response = await repository.authentication.login(userName, password)
        return response
    },
})
// /**
//  * Action creator for handling a user login success response without a loggedin user.
//  * @param {boolean} response Response of the login request
//  * @returns {Object} Returns a redux action with the properties userName and password.
//  */
// export const userLoginBuffer = (response: boolean) => ({
//     type: 'USER_LOGIN_BUFFER',
//     async payload(repository: Repository) {
//         const data = await new Promise(
//             (resolve, reject) => repository.authentication.currentUser.subscribe((user) => {
//                 resolve(user)
//             }, false))
//         return data
//     },
// })
/**
 * Action creator for login a user to a sensenet portal with her google account.
 * @returns {Object} Returns a redux action.
 */
export const userLoginGoogle = (provider: GoogleOauthProvider, token?: string) => ({
    type: 'USER_LOGIN_GOOGLE',
    async payload(repository: Repository) {
        const response = await provider.login(token)
        return response
    },
})
/**
 * Action creator for logout a user from a sensenet portal.
 * @returns {Object} Returns a redux action.
 */
export const userLogout = () => ({
    type: 'USER_LOGOUT',
    // tslint:disable:completed-docs
    async payload(repository) {
        const response = await repository.authentication.logout()
        return response
    },
})
/**
 * Action creator for load repository config.
 * @param repositoryConfig {any} The repository config object.
 * @returns {Object} Returns a redux action.
 */
export const loadRepository = (repositoryConfig) => ({
    type: 'LOAD_REPOSITORY',
    repository: repositoryConfig,
})
/**
 * Action creator for selecting a Content
 * @param id {number} The id of the selected Content
 * @returns {Object} Returns a redux action.
 */
export const selectContent = (content) => ({
    type: 'SELECT_CONTENT',
    content,
})
/**
 * Action creator for deselecting a Content
 * @param id {number} The id of the deselected Content
 * @returns {Object} Returns a redux action.
 */
export const deSelectContent = (content) => ({
    type: 'DESELECT_CONTENT',
    content,
})
/**
 * Action creator for clearing the array of selected content
 * @returns {Object} Returns a redux action.
 */
export const clearSelection = () => ({
    type: 'CLEAR_SELECTION',
})
/**
 * Action creator for uploading a Content into the Content Repository.
 * @param {parentPath} string The parent Content items path.
 * @param file The file that should be uploaded
 * @param {ContentTypes.ContentType} [contentType=ContentTypes.File] ContentType of the Content that should be created with the binary (default is File)
 * @param {boolean} [overwrite=true] Determines whether the existing file with a same name should be overwritten or not (default is true)
 * @param {Object} [body=null] Contains extra stuff to request body
 * @param {string} [propertyName='Binary'] Name of the field where the binary should be saved
 * @returns {Object} Returns a redux action with the properties type, content, file, contentType, overwrite, body and propertyName.
 */
export const uploadRequest = <T extends IContent>(parentPath: string, file, contentType?, overwrite: boolean = true, body?, propertyName: string = 'Binary') => ({
    type: 'UPLOAD_CONTENT',
    // tslint:disable:completed-docs
    async payload(repository: Repository): Promise<T> {
        const data = await Upload.file<T>({
            binaryPropertyName: propertyName,
            overwrite,
            file,
            repository,
            contentTypeName: contentType,
            parentPath,
        })
        const content = await repository.load<T>({ idOrPath: data.Id })
        return content.d
    },
})
/**
 * Action creator for changing a field value of a content
 * @param {string} name Name of the field.
 * @param {any} value Value of the field.
 */
export const changeFieldValue = (name: string, value: any) => ({
    type: 'CHANGE_FIELD_VALUE',
    name,
    value,
})
/**
 * Action creator for loading schema of a given type
 * @param {string} typeName Name of the Content Type.
 */
export const getSchema = (typeName: string) => ({
    type: 'GET_SCHEMA',
    payload(repository: Repository): Schema {
        const data = repository.schemas.getSchemaByName(typeName)
        return data
    },
})
/**
 * Action creator for setting the default select, expandm etc. options
 * @param {string} typeName Name of the Content Type.
 */
export const setDefaultOdataOptions = (options: IODataParams<GenericContent> & { scenario: string } = { scenario: ''}) => ({
    type: 'SET_ODATAOPTIONS',
    options,
})
