import * as React from 'react'
import { Provider } from 'react-redux'

import RotateLeft from '@material-ui/icons/RotateLeft'
import RotateRight from '@material-ui/icons/RotateRight'
import { expect } from 'chai'
import * as renderer from 'react-test-renderer'
import { RotatePageWidget } from '../src/components/page-widgets/RotatePage'
import { documentReceivedAction } from '../src/store/Document'
import { availabelImagesReceivedAction } from '../src/store/PreviewImages'
import { exampleDocumentData, useTestContext } from './__Mocks__/viewercontext'

/**
 * RotatePage widget tests
 */
describe('RotatePageWidget component', () => {
  let c!: renderer.ReactTestRenderer

  afterEach(() => {
    c.unmount()
  })

  it('Should render without crashing', () => {
    useTestContext(ctx => {
      ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
      const page = ctx.store.getState().sensenetDocumentViewer.previewImages.AvailableImages[0]
      c = renderer.create(
        <Provider store={ctx.store}>
          <RotatePageWidget page={page} viewPort={{ width: 1024, height: 768 }} zoomRatio={1} />
        </Provider>,
      )
    })
  })

  it('RotateLeft should trigger a rotate to left', () => {
    useTestContext(ctx => {
      ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
      ctx.store.dispatch(
        availabelImagesReceivedAction([
          {
            Attributes: {
              degree: 0,
            },
            Index: 1,
            Height: 100,
            Width: 100,
          },
        ]),
      )
      const page = ctx.store.getState().sensenetDocumentViewer.previewImages.AvailableImages[0]

      c = renderer.create(
        <Provider store={ctx.store}>
          <RotatePageWidget page={page} viewPort={{ width: 1024, height: 768 }} zoomRatio={1} />
        </Provider>,
      )
      const button = c.root.findByType(RotateLeft)
      button.props.onClick()
      expect(
        (ctx.store.getState().sensenetDocumentViewer.previewImages.AvailableImages[0] as any).Attributes.degree,
      ).to.be.eq(270)
    })
  })

  it('RotateRight should trigger a rotate to left', () => {
    useTestContext(ctx => {
      ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
      ctx.store.dispatch(
        availabelImagesReceivedAction([
          {
            Attributes: {
              degree: 0,
            },
            Index: 1,
            Height: 100,
            Width: 100,
          },
        ]),
      )
      const page = ctx.store.getState().sensenetDocumentViewer.previewImages.AvailableImages[0]
      c = renderer.create(
        <Provider store={ctx.store}>
          <RotatePageWidget page={page} viewPort={{ width: 1024, height: 768 }} zoomRatio={1} />
        </Provider>,
      )
      const button = c.root.findByType(RotateRight)
      button.props.onClick()
      expect(
        (ctx.store.getState().sensenetDocumentViewer.previewImages.AvailableImages[0] as any).Attributes.degree,
      ).to.be.eq(90)
    })
  })
})
