import { Injector } from '@furystack/inject'
import { sensenetDocumentViewerReducer } from '@sensenet/document-viewer-react/dist/store'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { ReduxDiMiddleware } from 'redux-di-middleware'
import { commandPalette } from './CommandPalette'
import { editContent } from './EditContent'
import { persistedState } from './PersistedState'

const sensenetDocumentViewer = sensenetDocumentViewerReducer

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const rootReducer = combineReducers({
  persistedState,
  commandPalette,
  editContent,
  sensenetDocumentViewer,
})
export type rootStateType = ReturnType<typeof rootReducer>
export const diMiddleware = new ReduxDiMiddleware(new Injector())
export const store = createStore(rootReducer, {}, composeEnhancers(applyMiddleware(diMiddleware.getMiddleware())))
