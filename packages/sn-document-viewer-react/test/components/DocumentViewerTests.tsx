import { expect } from 'chai'
import * as React from 'react'
import { Provider } from 'react-redux'
import * as renderer from 'react-test-renderer'
import { DocumentViewerError } from '../../src/components'
import { DocumentViewer } from '../../src/components/DocumentViewer'
import { exampleDocumentData, useTestContext, useTestContextWithSettings } from '../viewercontext'

/**
 * Tests for the Document Viewer main component
 */
export const documentViewerTests = describe('Document Viewer component', () => {
    it('Should render without crashing', () => {
        useTestContext((ctx) => {
            const c = renderer.create(
                <Provider store={ctx.store} >
                    <DocumentViewer documentIdOrPath="" hostName=""/>
                </Provider>)
            c.unmount()
        })
    })

    it('Should poll document data if there is an Id or Path provided and stop polling on unmount', (done: MochaDone) => {
        let c!: renderer.ReactTestRenderer
        after(() => {
            c.unmount()
        })
        const exampleIdOrPath = 'Example/Id/Or/Path'
        useTestContextWithSettings({
            getDocumentData: async ({idOrPath}) => {
                expect(idOrPath).to.be.eq(exampleIdOrPath)
                done()
                return exampleDocumentData
            },
        }, (ctx) => {
            c = renderer.create(
                <Provider store={ctx.store}>
                    <DocumentViewer documentIdOrPath={exampleIdOrPath} hostName="" />
                </Provider>)
        })
    })

    it('Should start polling again on path change', (done: MochaDone) => {
        let c!: renderer.ReactTestRenderer
        let pollCount = 0
        after(() => {
            c.unmount()
        })
        const exampleIdOrPath = 'Example/Id/Or/Path'
        useTestContextWithSettings({
            getDocumentData: async (idOrPath) => {
                pollCount++
                if (pollCount === 2) {
                    done()
                }
                return exampleDocumentData
            },
        }, (ctx) => {
            c = renderer.create(
                <Provider store={ctx.store} >
                    <DocumentViewer documentIdOrPath={exampleIdOrPath} hostName="" />
                </Provider>)
            setTimeout(() => {
                const component = c.root.findByType(DocumentViewer).children[0] as renderer.ReactTestInstance
                component.instance.componentWillReceiveProps({ ...component.instance.props, documentIdOrPath: 123456 })
            }, 100)
        })
    })

    it('should render the Error component when failed to get doc data', (done: MochaDone) => {
        let c!: renderer.ReactTestRenderer
        after(() => {
            c.unmount()
        })
        const exampleIdOrPath = 'Example/Id/Or/Path'
        useTestContextWithSettings({
            getDocumentData: async (idOrPath) => {
                throw Error('Nooo')
            },
        }, (ctx) => {
            c = renderer.create(
                <Provider store={ctx.store} >
                    <DocumentViewer documentIdOrPath={exampleIdOrPath} hostName="" />
                </Provider>)
            setTimeout(() => {
                const error = c.root.findByType(DocumentViewerError).instance
                expect(error).to.be.not.eq(null)
                done()
            }, 100)
        })
    })
})
