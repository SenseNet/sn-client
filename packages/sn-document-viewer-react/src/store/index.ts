import { Store } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { Reducer } from 'redux'
import { StoreEnhancer } from 'redux'
import thunk from 'redux-thunk'
import { DocumentViewerSettings } from '../models'
import { rootReducer, RootReducerType } from './RootReducer'

/**
 * gets a configuration object for the Store instance
 * @param {DocumentViewerSettings} settings The Settings object for the document viewer instance
 */
export const getStoreConfig: (settings: DocumentViewerSettings) => {rootReducer: Reducer<RootReducerType>, preloadedState: RootReducerType, enhancer: StoreEnhancer<any>}
     = (settings: DocumentViewerSettings) => {
    return {
        rootReducer,
        preloadedState: {sensenetDocumentViewer: {documentState: {isLoading: true}}} as RootReducerType,
        enhancer: applyMiddleware(thunk.withExtraArgument(settings)),
    }
}

/**
 * returns a Store object for a Document Viewer instance
 * @param {DocumentViewerSettings} settings The Settings object for the document viewer instance
 */
export const configureStore: (settings: DocumentViewerSettings) => Store<RootReducerType> = (settings: DocumentViewerSettings) => {
    const config = getStoreConfig(settings)
    return createStore<RootReducerType>(config.rootReducer, config.preloadedState, config.enhancer)
}

export * from './Document'
export * from './PreviewImages'
export * from './RootReducer'
export * from './Viewer'
