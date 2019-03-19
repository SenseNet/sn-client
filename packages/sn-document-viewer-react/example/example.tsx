import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { combineReducers, createStore } from 'redux'
import { getStoreConfig, sensenetDocumentViewerReducer } from '../src/store'
import { ExampleAppLayout, exampleSettings } from './ExampleAppLayout'

const storeConfig = getStoreConfig(exampleSettings)

const rootReducer = combineReducers({
  sensenetDocumentViewer: sensenetDocumentViewerReducer,
})

const store = createStore(rootReducer, storeConfig.preloadedState, storeConfig.enhancer)

/**
 * Showcase application for document viewer
 */
export const ViewerExampleApp = () => (
  <Provider store={store}>
    <ExampleAppLayout />
  </Provider>
)
ReactDOM.render(<ViewerExampleApp />, document.getElementById('root'))
