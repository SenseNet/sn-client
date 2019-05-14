import { commentsStateReducer, sensenetDocumentViewerReducer } from '@sensenet/document-viewer-react'
import { Reducers } from '@sensenet/redux'
import { combineReducers } from 'redux'
import { wopi } from '../components/wopi/store/reducers'
import { dms } from '../Reducers'

const sensenet = Reducers.sensenet

export const rootReducer = combineReducers({
  sensenet,
  dms,
  sensenetDocumentViewer: sensenetDocumentViewerReducer,
  comments: commentsStateReducer,
  wopi,
})

export type rootStateType = ReturnType<typeof rootReducer>
