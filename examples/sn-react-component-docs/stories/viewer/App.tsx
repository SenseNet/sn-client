import { configureStore } from '@sensenet/document-viewer-react'
import React from 'react'
import { Provider } from 'react-redux'
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
