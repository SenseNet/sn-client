import { Action, applyMiddleware, compose, createStore, Store } from 'redux'
import { ReduxDiMiddleware } from 'redux-di-middleware'
import { Injector } from '@furystack/inject'
import { DocumentViewerApiSettings } from '../models/DocumentViewerApiSettings'
import { rootReducer, RootReducerType } from './RootReducer'

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

/**
 * gets a configuration object for the Store instance
 * @param {DocumentViewerSettings} settings The Settings object for the document viewer instance
 */
export const getStoreConfig = (settings: DocumentViewerApiSettings) => {
  const di = new ReduxDiMiddleware(new Injector())
  di.setInjectable(settings)
  return {
    rootReducer,
    preloadedState: { sensenetDocumentViewer: { documentState: { isLoading: true } } },
    enhancer: composeEnhancers(applyMiddleware(di.getMiddleware())),
  }
}

/**
 * returns a Store object for a Document Viewer instance
 * @param {DocumentViewerSettings} settings The Settings object for the document viewer instance
 */
export const configureStore: (settings: DocumentViewerApiSettings) => Store<RootReducerType> = settings => {
  const config = getStoreConfig(settings)
  return createStore<RootReducerType, Action, {}, {}>(config.rootReducer, config.preloadedState, config.enhancer)
}

export * from './Comments'
export * from './Document'
export * from './PreviewImages'
export * from './RootReducer'
export * from './Viewer'
