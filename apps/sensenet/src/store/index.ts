import { Injector } from '@furystack/inject'
import { commentsStateReducer, sensenetDocumentViewerReducer } from '@sensenet/document-viewer-react'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { ReduxDiMiddleware } from 'redux-di-middleware'
import { commandPalette } from './CommandPalette'
import { editContent } from './EditContent'

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const rootReducer = combineReducers({
  commandPalette,
  editContent,
  sensenetDocumentViewer: sensenetDocumentViewerReducer,
  comments: commentsStateReducer,
})
export type rootStateType = ReturnType<typeof rootReducer>
export const diMiddleware = new ReduxDiMiddleware(new Injector())
export const store = createStore(rootReducer, {}, composeEnhancers(applyMiddleware(diMiddleware.getMiddleware())))
