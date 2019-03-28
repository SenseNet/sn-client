import { commentsStateReducer, sensenetDocumentViewerReducer } from '@sensenet/document-viewer-react'
import { Reducers } from '@sensenet/redux'
import { combineReducers } from 'redux'
import { dms } from '../Reducers'

const sensenet = Reducers.sensenet

export const rootReducer = combineReducers({
  sensenet,
  dms,
  sensenetDocumentViewer: sensenetDocumentViewerReducer,
  comments: commentsStateReducer,
})

export type rootStateType = ReturnType<typeof rootReducer>
