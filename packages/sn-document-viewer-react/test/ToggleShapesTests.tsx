import Dashboard from '@material-ui/icons/Dashboard'
import * as React from 'react'
import { Provider } from 'react-redux'
import * as renderer from 'react-test-renderer'
import { ToggleShapesWidget } from '../src/components/document-widgets/ToggleShapes'
import { documentReceivedAction } from '../src/store/Document'
import { exampleDocumentData, useTestContext } from './__Mocks__/viewercontext'

/**
 * Toggle Shapes widget tests
 */
describe('ToggleShapesWidget component', () => {
  let c!: renderer.ReactTestRenderer

  afterEach(() => {
    c.unmount()
  })

  it('Should render without crashing', () => {
    useTestContext(ctx => {
      ctx.store.dispatch(documentReceivedAction(exampleDocumentData))

      c = renderer.create(
        <Provider store={ctx.store}>
          <ToggleShapesWidget />
        </Provider>,
      )
    })
  })

  it('Click on toggle should toggle the shapes', () => {
    useTestContext(ctx => {
      const originalValue = ctx.store.getState().sensenetDocumentViewer.viewer.showShapes
      ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
      c = renderer.create(
        <Provider store={ctx.store}>
          <ToggleShapesWidget />
        </Provider>,
      )
      const button = c.root.findByType(Dashboard)
      button.props.onClick()
      expect(ctx.store.getState().sensenetDocumentViewer.viewer.showShapes).not.toBe(originalValue)

      button.props.onClick()
      expect(ctx.store.getState().sensenetDocumentViewer.viewer.showShapes).toBe(originalValue)
    })
  })
})
