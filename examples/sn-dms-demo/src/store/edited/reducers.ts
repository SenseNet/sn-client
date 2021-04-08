import { GenericContent } from '@sensenet/default-content-types'
import { Actions } from '@sensenet/redux'
import { PromiseReturns } from '@sensenet/redux/dist/types/Actions'
import { AnyAction, Reducer } from 'redux'

export const editedContent: Reducer<GenericContent | null> = (state = null, action: AnyAction) => {
  switch (action.type) {
    case 'LOAD_EDITED_CONTENT_SUCCESS':
      return (action.result as PromiseReturns<typeof Actions.loadContent>).d
    default:
      return state
  }
}
