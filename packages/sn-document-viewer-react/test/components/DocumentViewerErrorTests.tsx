import * as React from 'react'
import { Provider } from 'react-redux'
import * as renderer from 'react-test-renderer'
import { DocumentViewerError } from '../../src/components/DocumentViewerError'
import { useTestContext } from '../viewercontext'

/**
 * DocumentViewerError Component tests
 */
export const documentViewerErrorTests = describe('Document Viewer Error component', () => {
    it('Should render without crashing', () => {
        useTestContext((ctx) => {
            const c = renderer.create(
                <Provider store={ctx.store}>
                <DocumentViewerError error=":(" />
                </Provider>)
            c.unmount()
        })
    })
})
