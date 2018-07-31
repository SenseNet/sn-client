import * as React from 'react'
import { Provider } from 'react-redux'

import * as renderer from 'react-test-renderer'
import { LayoutAppBar } from '../../src/components/LayoutAppBar'
import { documentReceivedAction } from '../../src/store/Document'
import { exampleDocumentData, useTestContext } from '../viewercontext'

/**
 * LayoutAppBar Component tests
 */
export const layoutAppBarTests: Mocha.Suite = describe('Layout AppBar component', () => {

    let c!: renderer.ReactTestRenderer

    after(() => {
        c.unmount()
    })

    it('Should render without crashing', () => {
        useTestContext((ctx) => {
            ctx.store.dispatch(documentReceivedAction(exampleDocumentData))

            c = renderer.create(
                <Provider store={ctx.store}>
                    <LayoutAppBar>
                        <span>test</span>
                    </LayoutAppBar>
                </Provider>)
        })
    })
})
