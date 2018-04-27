import * as React from 'react'
import { Provider } from 'react-redux'

import { expect } from 'chai'
import { BrandingWatermark } from 'material-ui-icons'
import * as renderer from 'react-test-renderer'
import { ToggleWatermarkWidget } from '../../../src/components/document-widgets/ToggleWatermark'
import { documentReceivedAction } from '../../../src/store/Document'
import { exampleDocumentData, useTestContext } from '../../viewercontext'

/**
 * Toggle Watermark widget tests
 */
export const toggleWatermarkWidgetTests = describe('ToggleWatermarkWidget component', () => {

    let c!: renderer.ReactTestRenderer

    after(() => {
        c.unmount()
    })

    it('Should render without crashing', () => {
        useTestContext((ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))

            c = renderer.create(
                <Provider store={ctx.store}>
                    <ToggleWatermarkWidget>
                    </ToggleWatermarkWidget>
                </Provider>)
        })
    })

    it('Click on toggle should toggle the watermark', () => {
        useTestContext((ctx) => {
            const originalValue = ctx.store.getState().sensenetDocumentViewer.viewer.showWatermark
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
            c = renderer.create(
                <Provider store={ctx.store}>
                    <ToggleWatermarkWidget>
                    </ToggleWatermarkWidget>
                </Provider>)
            const button = c.root.findByType(BrandingWatermark)
            button.props.onClick()
            expect(ctx.store.getState().sensenetDocumentViewer.viewer.showWatermark).to.not.eq(originalValue)

            button.props.onClick()
            expect(ctx.store.getState().sensenetDocumentViewer.viewer.showWatermark).to.be.eq(originalValue)
        })
    })
})
