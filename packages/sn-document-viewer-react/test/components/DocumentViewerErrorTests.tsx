/// <reference types="mocha" />

import { expect } from 'chai'
import * as React from 'react'
import { Provider } from 'react-redux'
import * as renderer from 'react-test-renderer'
import { DocumentViewerError, getPreviewState } from '../../src/components/DocumentViewerError'
import { exampleDocumentData, useTestContext } from '../viewercontext'

/**
 * DocumentViewerError Component tests
 */
export const documentViewerErrorTests: Mocha.Suite = describe('Document Viewer Error component', () => {
  it('Should render without crashing', () => {
    useTestContext(ctx => {
      const c = renderer.create(
        <Provider store={ctx.store}>
          <DocumentViewerError error=":(" />
        </Provider>,
      )
      c.unmount()
    })
  })

  describe('getPreviewState method', () => {
    it('Should set the preview state to 1 when there is a document', () => {
      const state = {
        sensenetDocumentViewer: {
          documentState: {
            document: { ...exampleDocumentData },
            idOrPath: true,
          },
        },
      }
      const previewState = getPreviewState(state as any)
      expect(previewState).to.be.eq(1)
    })

    it('Should set the preview state to -1 when there is no document', () => {
      const state = {
        sensenetDocumentViewer: {
          documentState: {},
        },
      }
      const previewState = getPreviewState(state as any)
      expect(previewState).to.be.eq(-1)
    })
  })
})
