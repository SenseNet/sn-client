import { ActionModel, GenericContent, Schema } from '@sensenet/default-content-types'
import { Action, combineReducers, Reducer } from 'redux'
import { loadContent, loadContentActions, PromiseReturns } from '../Actions'
import { contentState } from './contentstate'

/**
 * Reducer to handle Actions on the contenterror property in the currentcontent object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns state. Returns the next state based on the action.
 */
export const contenterror: Reducer<object | null> = (state = null, action) => {
  switch (action.type) {
    case 'CREATE_CONTENT_FAILURE':
    case 'UPDATE_CONTENT_FAILURE':
    case 'DELETE_CONTENT_FAILURE':
    case 'CHECKIN_CONTENT_FAILURE':
    case 'CHECKOUT_CONTENT_FAILURE':
    case 'PUBLISH_CONTENT_FAILURE':
    case 'APPROVE_CONTENT_FAILURE':
    case 'REJECT_CONTENT_FAILURE':
    case 'UNDOCHECKOUT_CONTENT_FAILURE':
    case 'FORCEUNDOCHECKOUT_CONTENT_FAILURE':
    case 'RESTOREVERSION_CONTENT_FAILURE':
      return action.error.message
    case 'FETCH_CONTENT':
    case 'FETCH_CONTENT_FAILURE':
    case 'CREATE_CONTENT':
    case 'CREATE_CONTENT_SUCCESS':
    case 'UPDATE_CONTENT':
    case 'UPDATE_CONTENT_SUCCESS':
    case 'DELETE_CONTENT':
    case 'DELETE_CONTENT_SUCCESS':
    case 'CHECKIN_CONTENT':
    case 'CHECKIN_CONTENT_SUCCESS':
    case 'CHECKOUT_CONTENT':
    case 'CHECKOUT_CONTENT_SUCCESS':
    case 'APPROVE_CONTENT':
    case 'APPROVE_CONTENT_SUCCESS':
    case 'PUBLISH_CONTENT':
    case 'PUBLISH_CONTENT_SUCCESS':
    case 'REJECT_CONTENT':
    case 'REJECT_CONTENT_SUCCESS':
    case 'UNDOCHECKOUT_CONTENT':
    case 'UNDOCHECKOUT_CONTENT_SUCCESS':
    case 'FORCEUNDOCHECKOUT_CONTENT':
    case 'FORCEUNDOCHECKOUT_CONTENT_SUCCESS':
    case 'RESTOREVERSION_CONTENT':
    case 'RESTOREVERSION_CONTENT_SUCCESS':
      return null
    default:
      return state
  }
}
/**
 * Reducer to handle Actions on the contentactions object in the currentcontent object.
 * @param [state={}] Represents the current state.
 * @param action Represents an action that is called.
 * @returns state. Returns the next state based on the action.
 */
export const contentactions: Reducer<ActionModel[]> = (state = [], action) => {
  switch (action.type) {
    case 'LOAD_CONTENT_ACTIONS_SUCCESS':
      return (action.result as PromiseReturns<typeof loadContentActions>).d.Actions
    default:
      return state
  }
}
/**
 * Reducer to handle Actions on the fields object in the currentcontent object.
 * @param [state={}] Represents the current state.
 * @param action Represents an action that is called.
 * @returns state. Returns the next state based on the action.
 */
export const fields: Reducer<{}> = (state = {}, action) => {
  switch (action.type) {
    case 'LOAD_CONTENT_SUCCESS':
      return {}
    case 'CHANGE_FIELD_VALUE': {
      const f: any = state
      f[action.name] = action.value
      return f
    }
    default:
      return state
  }
}
/**
 * Reducer to handle Actions on the content object in the currentcontent object.
 * @param [state={}] Represents the current state.
 * @param action Represents an action that is called.
 * @returns state. Returns the next state based on the action.
 */
export const content: Reducer<GenericContent | null> = (state = null, action) => {
  switch (action.type) {
    case 'LOAD_CONTENT_SUCCESS':
      return (action.result as PromiseReturns<typeof loadContent>).d
    default:
      return state
  }
}
/**
 * Reducer to contain schema of the current content
 * @param [state={}] Represents the current state.
 * @param action Represents an action that is called.
 * @returns state. Returns the next state based on the action.
 */
export const schema: Reducer<Schema | null, Action & { result: Schema }> = (state = null, action) => {
  switch (action.type) {
    case 'GET_SCHEMA_SUCCESS':
      return action.result as Schema
    default:
      return state
  }
}
/**
 * Reducer combining contentState, error, actions, fields and content into a single object, ```currentcontent```.
 */
export const currentcontent = combineReducers<{
  contentState: ReturnType<typeof contentState>
  error: ReturnType<typeof contenterror>
  actions: ReturnType<typeof contentactions>
  fields: ReturnType<typeof fields>
  content: ReturnType<typeof content>
  schema: ReturnType<typeof schema>
}>({
  contentState,
  error: contenterror,
  actions: contentactions,
  fields,
  content,
  schema,
})
