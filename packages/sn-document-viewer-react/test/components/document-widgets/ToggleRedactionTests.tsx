import * as React from 'react'
import { Provider } from 'react-redux'

import { PictureInPicture } from '@material-ui/icons'
import { expect } from 'chai'
import * as renderer from 'react-test-renderer'
import { ToggleRedactionWidget } from '../../../src/components/document-widgets/ToggleRedaction'
import { documentReceivedAction } from '../../../src/store/Document'
import { exampleDocumentData, useTestContext } from '../../viewercontext'

/**
 * Toggle Redaction widget tests
 */
export const toggleRedactionTests: Mocha.Suite = describe('ToggleRedactionWidget component', () => {

    let c!: renderer.ReactTestRenderer

    after(() => {
        c.unmount()
    })

    it('Should render without crashing', () => {
        useTestContext((ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))

            c = renderer.create(
                <Provider store={ctx.store}>
                    <ToggleRedactionWidget>
                    </ToggleRedactionWidget>
                </Provider>)
        })
    })

    it('Click on toggle should toggle the redaction', () => {
        useTestContext((ctx) => {
            const originalValue = ctx.store.getState().sensenetDocumentViewer.viewer.showRedaction
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
            c = renderer.create(
                <Provider store={ctx.store}>
                    <ToggleRedactionWidget>
                    </ToggleRedactionWidget>
                </Provider>)
            const button = c.root.findByType(PictureInPicture)
            button.props.onClick()
            expect(ctx.store.getState().sensenetDocumentViewer.viewer.showRedaction).to.not.eq(originalValue)

            button.props.onClick()
            expect(ctx.store.getState().sensenetDocumentViewer.viewer.showRedaction).to.be.eq(originalValue)
        })
    })
})
