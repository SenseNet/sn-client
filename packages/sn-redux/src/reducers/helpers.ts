import { LoginState } from '@sensenet/client-core'
import { currentitems } from './currentitems'
import { sensenet } from './sensenet'

/**
 * Method to get a Content item from a state object by its Id.
 * @param state Current state object.
 * @param Id Id of the Content.
 * @returns content. Returns the Content from a state object with the given Id.
 */
export const getContent = <T>(state: T[], id: number) => state[id]
/**
 * Method to get the ```ids``` array from a state object.
 * @param state Current state object.
 * @returns content. Returns the ```ids``` array from the given state.
 */
export const getIds = (state: any) => state.ids
/**
 * Method to get if the fetching of data is in progress.
 * @param state Current state object.
 * @returns Returns true or false whether data fetching is in progress or not.
 */
export const getFetching = (state: any) => state.isFetching
/**
 * Method to get the error message.
 * @param state Current state object.
 * @returns Returns the error message.
 */
export const getError = (state: any) => {
    return state.error
}
/**
 * Method to get the authentication status.
 * @param state Current state object.
 * @returns Returns the authentication state.
 */
export const getAuthenticationStatus = (state: ReturnType<typeof sensenet>) => {
    return state.session.loginState as LoginState
}
/**
 * Method to get the authentication error.
 * @param state Current state object.
 * @returns Returns the error message.
 */
export const getAuthenticationError = (state: ReturnType<typeof sensenet>) => {
    return state.session.error
}
/**
 * Method to get the repository url.
 * @param state Current state object.
 * @returns Returns the url of the repository.
 */
export const getRepositoryUrl = (state: ReturnType<typeof sensenet>) => {
    return state.session.repository && state.session.repository.repositoryUrl
}
/**
 * Method to get the ids of the selected content items.
 * @param state Current state object.
 * @returns Returns an array with the ids.
 */
export const getSelectedContentIds = (state: ReturnType<typeof sensenet>) => {
    return state.selected.ids
}
/**
 * Method to get the selected content items.
 * @param state Current state object.
 * @returns Returns an Oject with the selected content items.
 */
export const getSelectedContentItems = (state: ReturnType<typeof sensenet>) => {
    return state.selected.entities
}
/**
 * Method to get the id of the opened content item.
 * @param state Current state object.
 * @returns Returns the id of the opened content item.
 */
export const getOpenedContent = (state: ReturnType<typeof currentitems>) => {
    return state.isOpened
}
/**
 * Method to get the list of actions of the currentitems items.
 * @param state Current state object.
 * @returns Returns the list of actions.
 */
export const getChildrenActions = (state: ReturnType<typeof currentitems>) => {
    return state.actions
}
/**
 * Method to get the current content object.
 * @param state Current state object.
 * @returns Returns the content object.
 */
export const getCurrentContent = (state: ReturnType<typeof sensenet>) => {
    return state.currentcontent.content
}
/**
 * Method to get the currentitems items.
 * @param state Current state object.
 * @returns Returns the content items as an object.
 */
export const getChildren = (state: ReturnType<typeof currentitems>) => {
    return state.entities
}
/**
 * Method to get the list of current content's chanegd fields and their values.
 * @param state Current state object.
 * @returns Returns the list of the fields.
 */
export const getFields = (state: ReturnType<typeof sensenet>) => {
    return state.currentcontent.fields
}
/**
 * Method to get the schema of current content.
 * @param state Current state object.
 * @returns Returns the schema object.
 */
export const getSchema = (state: ReturnType<typeof sensenet>) => {
    return state.currentcontent.schema
}
