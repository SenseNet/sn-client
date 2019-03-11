import { Injector } from '@furystack/inject'
import { sensenetDocumentViewerReducer } from '@sensenet/document-viewer-react/dist/store'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { ReduxDiMiddleware } from 'redux-di-middleware'
import { commander } from './Commander'
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
  commander,
})

export type rootStateType = ReturnType<typeof rootReducer>
export const diMiddleware = new ReduxDiMiddleware(Injector.Default)

export const store = createStore(rootReducer, {}, composeEnhancers(applyMiddleware(diMiddleware.getMiddleware())))
