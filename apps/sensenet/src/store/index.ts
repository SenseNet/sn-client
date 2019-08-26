import { commentsStateReducer, sensenetDocumentViewerReducer } from '@sensenet/document-viewer-react'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { ReduxDiMiddleware } from 'redux-di-middleware'
import { snInjector } from '../sn-injector'

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const rootReducer = combineReducers({
  sensenetDocumentViewer: sensenetDocumentViewerReducer,
  comments: commentsStateReducer,
})
export type rootStateType = ReturnType<typeof rootReducer>
export const diMiddleware = new ReduxDiMiddleware(snInjector)
export const store = createStore(rootReducer, {}, composeEnhancers(applyMiddleware(diMiddleware.getMiddleware())))
