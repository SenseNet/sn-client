import { ODataBatchResponse } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { combineReducers, Reducer } from 'redux'
import { copyBatch, deleteBatch, PromiseReturns } from '../Actions'

/**
 * Reducer to handle Actions on the OdataBatchResponse object.
 * @param state Represents the current state.
 * @param action Represents an action that is called.
 * @returns state. Returns the next state based on the action.
 */
export const odataBatchResponse: Reducer<ODataBatchResponse<GenericContent> | null> = (state = null, action) => {
    switch (action.type) {
        case 'DELETE_BATCH_SUCCESS':
        case 'COPY_BATCH_SUCCESS':
        case 'MOVE_BATCH_SUCCESS':
            return (action.result as PromiseReturns<typeof deleteBatch | typeof copyBatch | typeof copyBatch>)
        default:
            return state
    }
}
/**
 * Reducer to handle Actions on the batchResponseError object.
 * @param  state Represents the current state.
 * @param  action Represents an action that is called.
 * @returns  state. Returns the next state based on the action.
 */
export const batchResponseError: Reducer<string> = (state = '', action) => {
    switch (action.type) {
        case 'DELETE_BATCH_FAILURE':
        case 'COPY_BATCH_FAILURE':
        case 'MOVE_BATCH_FAILURE':
            return action.error.message
        default:
            return state
    }
}
/**
 * Reducer combining response and error into a single object, ```batchResponses```.
 */
export const batchResponses = combineReducers<{
    response: ReturnType<typeof odataBatchResponse>,
    error: ReturnType<typeof batchResponseError>,
}>({
    response: odataBatchResponse,
    error: batchResponseError,
})
