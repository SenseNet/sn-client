import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { configureStore } from '../src/store'
import { ExampleAppLayout, exampleSettings } from './ExampleAppLayout'

const store = configureStore(exampleSettings)

/**
 * Showcase application for document viewer
 */
export const ViewerExampleApp = () => (
  <Provider store={store}>
    <ExampleAppLayout />
  </Provider>
)
ReactDOM.render(<ViewerExampleApp />, document.getElementById('root'))
