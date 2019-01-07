import { sensenetDocumentViewerReducer } from '@sensenet/document-viewer-react/dist/store'
import { Reducers } from '@sensenet/redux'
import { combineReducers } from 'redux'
import { dms } from '../Reducers'

const sensenet = Reducers.sensenet
const sensenetDocumentViewer = sensenetDocumentViewerReducer

export const rootReducer = combineReducers({
  sensenet,
  dms,
  sensenetDocumentViewer,
})

export type rootStateType = ReturnType<typeof rootReducer>
