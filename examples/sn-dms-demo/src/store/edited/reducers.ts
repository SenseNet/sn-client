import { GenericContent } from '@sensenet/default-content-types'
import { loadContent, PromiseReturns } from '@sensenet/redux/dist/Actions'
import { AnyAction, Reducer } from 'redux'

export const editedContent: Reducer<GenericContent | null> = (state: GenericContent | null = null, action: AnyAction) => {
    switch (action.type) {
        case 'LOAD_EDITED_CONTENT_SUCCESS':
            return (action.result as PromiseReturns<typeof loadContent>).d
        default:
            return state
    }
}
