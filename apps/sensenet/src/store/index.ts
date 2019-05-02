import { commentsStateReducer, sensenetDocumentViewerReducer } from '@sensenet/document-viewer-react'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { ReduxDiMiddleware } from 'redux-di-middleware'
import { snInjector } from '../context'
import { commandPalette } from './CommandPalette'

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const rootReducer = combineReducers({
  commandPalette,
  sensenetDocumentViewer: sensenetDocumentViewerReducer,
  comments: commentsStateReducer,
})
export type rootStateType = ReturnType<typeof rootReducer>
export const diMiddleware = new ReduxDiMiddleware(snInjector)
export const store = createStore(rootReducer, {}, composeEnhancers(applyMiddleware(diMiddleware.getMiddleware())))
