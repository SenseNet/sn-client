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

ReactDOM.render(
  <Provider store={store}>
    <ExampleAppLayout />
  </Provider>,
  document.getElementById('root'),
)
