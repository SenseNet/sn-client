import * as React from 'react'
import { Provider } from 'react-redux'

import { expect } from 'chai'
import * as renderer from 'react-test-renderer'
import { ShapeAnnotation, ShapeHighlight } from '../../../src/components/page-widgets/Shape'
import { ShapesWidget } from '../../../src/components/page-widgets/Shapes'
import { documentPermissionsReceived, documentReceivedAction } from '../../../src/store/Document'
import { availabelImagesReceivedAction } from '../../../src/store/PreviewImages'
import { exampleDocumentData, useTestContext } from '../../viewercontext'

/**
 * Shapes widget tests
 */
export const shapesWidgetTests: Mocha.Suite = describe('ShapesWidget component', () => {

    let c!: renderer.ReactTestRenderer

    after(() => {
        c.unmount()
    })

    it('Should render without crashing', () => {
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
            const page = ctx.store.getState().sensenetDocumentViewer.previewImages.AvailableImages[0]
            c = renderer.create(
                <Provider store={ctx.store}>
                    <ShapesWidget page={page} viewPort={{ width: 1024, height: 768 }} zoomRatio={1}>
                    </ShapesWidget>
                </Provider>)
        })
    })

    it('Delete should remove shapes', () => {
        useTestContext((ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
            ctx.store.dispatch(documentPermissionsReceived(true, true, true))
            ctx.store.dispatch(availabelImagesReceivedAction([{
                Attributes: {
                    degree: 0,
                },
                Index: 1,
                Height: 100,
                Width: 100,
            }]))
            const page = ctx.store.getState().sensenetDocumentViewer.previewImages.AvailableImages[0]
            c = renderer.create(
                <Provider store={ctx.store}>
                    <ShapesWidget page={page} viewPort={{ width: 1024, height: 768 }} zoomRatio={1}>
                    </ShapesWidget>
                </Provider>)

            const highlight = c.root.findByType(ShapeHighlight).children[0] as any
            const guid = highlight.props.shape.guid
            highlight.instance.state.handleKeyPress({ key: 'Delete' }, highlight.instance.props.shape)
            expect(ctx.store.getState().sensenetDocumentViewer.documentState.document.shapes.annotations.find((s) => s.guid === guid)).to.be.eq(undefined)
        })
    })

    it('Delete shouldn\'t remove the annotation shape', () => {
        useTestContext((ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
            ctx.store.dispatch(documentPermissionsReceived(true, true, true))
            ctx.store.dispatch(availabelImagesReceivedAction([{
                Attributes: {
                    degree: 0,
                },
                Index: 1,
                Height: 100,
                Width: 100,
            }]))
            const page = ctx.store.getState().sensenetDocumentViewer.previewImages.AvailableImages[0]
            c = renderer.create(
                <Provider store={ctx.store}>
                    <ShapesWidget page={page} viewPort={{ width: 1024, height: 768 }} zoomRatio={1}>
                    </ShapesWidget>
                </Provider>)

            const annotation = c.root.findByType(ShapeAnnotation).children[0] as any
            const guid = annotation.props.shape.guid
            annotation.instance.state.handleKeyPress({ key: 'Delete' }, annotation.instance.props.shape)
            expect(ctx.store.getState().sensenetDocumentViewer.documentState.document.shapes.annotations.find((s) => s.guid === guid)).to.not.be.eq(undefined)
        })
    })

    it('Focus and blur should update the focused state property', () => {
        useTestContext((ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
            ctx.store.dispatch(documentPermissionsReceived(true, true, true))
            ctx.store.dispatch(availabelImagesReceivedAction([{
                Attributes: {
                    degree: 0,
                },
                Index: 1,
                Height: 100,
                Width: 100,
            }]))
            const page = ctx.store.getState().sensenetDocumentViewer.previewImages.AvailableImages[0]
            c = renderer.create(
                <Provider store={ctx.store}>
                    <ShapesWidget page={page} viewPort={{ width: 1024, height: 768 }} zoomRatio={1}>
                    </ShapesWidget>
                </Provider>)

            const annotation = c.root.findByType(ShapeAnnotation).children[0] as any
            expect(annotation.instance.state.focused).to.be.eq(false)

            // focus
            annotation.instance.state.onFocus()
            expect(annotation.instance.state.focused).to.be.eq(true)

            // focus on child
            annotation.instance.state.onBlur({ currentTarget: { contains: () => true, innerText: ' a ' }, nativeEvent: {} })
            expect(annotation.instance.state.focused).to.be.eq(true)

            // blur
            annotation.instance.state.onBlur({ currentTarget: { contains: () => false, innerText: ' a ' }, nativeEvent: {} })
            expect(annotation.instance.state.focused).to.be.eq(false)

            // annotation text should be updated and trimmed
            expect(annotation.instance.props.shape.text).to.be.eq('a')
        })
    })

    it('Resized should update the shape data', () => {
        useTestContext((ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
            ctx.store.dispatch(documentPermissionsReceived(true, true, true))
            ctx.store.dispatch(availabelImagesReceivedAction([{
                Attributes: {
                    degree: 0,
                },
                Index: 1,
                Height: 100,
                Width: 100,
            }]))
            const page = ctx.store.getState().sensenetDocumentViewer.previewImages.AvailableImages[0]
            c = renderer.create(
                <Provider store={ctx.store}>
                    <ShapesWidget page={page} viewPort={{ width: 1024, height: 768 }} zoomRatio={1}>
                    </ShapesWidget>
                </Provider>)

            const annotation = c.root.findByType(ShapeAnnotation).children[0] as any
            expect(annotation.instance.state.focused).to.be.eq(false)

            // resize
            annotation.instance.state.onResized({ currentTarget: { getBoundingClientRect: () => ({ widt: 10, height: 10 }) } }, 'annotations', annotation.instance.props.shape)
        })
    })

    it('onDragStart should add shape data to dataTransfer', () => {
        useTestContext((ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))
            ctx.store.dispatch(documentPermissionsReceived(true, true, true))
            ctx.store.dispatch(availabelImagesReceivedAction([{
                Attributes: {
                    degree: 0,
                },
                Index: 1,
                Height: 100,
                Width: 100,
            }]))
            const page = ctx.store.getState().sensenetDocumentViewer.previewImages.AvailableImages[0]
            c = renderer.create(
                <Provider store={ctx.store}>
                    <ShapesWidget page={page} viewPort={{ width: 1024, height: 768 }} zoomRatio={1}>
                    </ShapesWidget>
                </Provider>)

            const annotation = c.root.findByType(ShapeAnnotation).children[0] as any
            expect(annotation.instance.state.focused).to.be.eq(false)

            // onDragStart
            annotation.instance.state.onDragStart({
                dataTransfer: {
                    setData: (key: string, value: string) => {
                        expect(key).to.be.eq('shape')
                        expect(typeof value).to.be.eq('string')
                        /** */
                    },
                },
                currentTarget: {
                    getBoundingClientRect: () => ({top: 5, left: 5, width: 100, height: 100}),
                },
            }, 'annotations', annotation.instance.props.shape)
        })
    })
})
