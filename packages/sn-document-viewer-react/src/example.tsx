import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { createStore } from 'redux'
import { combineReducers } from 'redux'
import { ExampleAppLayout, exampleSettings } from './ExampleAppLayout'
import { getStoreConfig, sensenetDocumentViewerReducer } from './store'

const storeConfig = getStoreConfig(exampleSettings)

const rootReducer = combineReducers({
  sensenetDocumentViewer: sensenetDocumentViewerReducer,
  myStuff: (state = {}, action: any) => {
    if (action.type === 'SN_DOCVEWER_DOCUMENT_SAVE_CHANGES_SUCCESS') {
      // tslint:disable-next-line:no-console
      // console.log('Changes saved')
    }
    return state
  },
})

const store = createStore(rootReducer, storeConfig.preloadedState, storeConfig.enhancer)

ReactDOM.render(
  <Provider store={store}>
    <ExampleAppLayout />
  </Provider>,
  document.getElementById('example'),
)
