import { sensenetDocumentViewerReducer } from '@sensenet/document-viewer-react/dist/store'
import { Reducers } from '@sensenet/redux'
import { combineReducers } from 'redux'
import * as DMSReducers from '../Reducers'

const sensenet = Reducers.sensenet
const dms = DMSReducers.dms
const sensenetDocumentViewer = sensenetDocumentViewerReducer

export const rootReducer = combineReducers({
    sensenet,
    dms,
    sensenetDocumentViewer,
})

export type rootStateType = ReturnType<typeof rootReducer>
