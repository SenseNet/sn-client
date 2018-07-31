import * as React from 'react'
import { Provider } from 'react-redux'

import { RotateLeft, RotateRight } from '@material-ui/icons'
import { expect } from 'chai'
import * as renderer from 'react-test-renderer'
import { RotateDocumentWidget } from '../../../src/components/document-widgets/RotateDocument'
import { documentReceivedAction } from '../../../src/store/Document'
import { availabelImagesReceivedAction } from '../../../src/store/PreviewImages'
import { exampleDocumentData, useTestContext } from '../../viewercontext'

/**
 * Rotate Document widget tests
 */
export const rotateDocumentWidgetTests: Mocha.Suite = describe('RotateDocumentWidget component', () => {

    let c!: renderer.ReactTestRenderer

    after(() => {
        c.unmount()
    })

    it('Should render without crashing', () => {
        useTestContext((ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))

            c = renderer.create(
                <Provider store={ctx.store}>
                    <RotateDocumentWidget>
                    </RotateDocumentWidget>
                </Provider>)
        })
    })

    it('RotateLeft should trigger a rotate to left', () => {
        useTestContext((ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
            ctx.store.dispatch(availabelImagesReceivedAction([{
                Attributes: {
                    degree: 0,
                },
                Index: 1,
                Height: 100,
                Width: 100,
            }]))
            c = renderer.create(
                <Provider store={ctx.store}>
                    <RotateDocumentWidget>
                    </RotateDocumentWidget>
                </Provider>)
            const button = c.root.findByType(RotateLeft)
            button.props.onClick()
            expect((ctx.store.getState().sensenetDocumentViewer.previewImages.AvailableImages[0] as any).Attributes.degree)
                .to.be.eq(270)
        })
    })

    it('RotateRight should trigger a rotate to left', () => {
        useTestContext((ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
            ctx.store.dispatch(availabelImagesReceivedAction([{
                Attributes: {
                    degree: 0,
                },
                Index: 1,
                Height: 100,
                Width: 100,
            }]))
            c = renderer.create(
                <Provider store={ctx.store}>
                    <RotateDocumentWidget>
                    </RotateDocumentWidget>
                </Provider>)
            const button = c.root.findByType(RotateRight)
            button.props.onClick()
            expect((ctx.store.getState().sensenetDocumentViewer.previewImages.AvailableImages[0] as any).Attributes.degree)
                .to.be.eq(90)
        })
    })
})
