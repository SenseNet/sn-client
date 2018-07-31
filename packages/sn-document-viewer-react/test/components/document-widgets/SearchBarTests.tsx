import * as React from 'react'
import { Provider } from 'react-redux'
import * as renderer from 'react-test-renderer'
import { SearchBar } from '../../../src/components/document-widgets/SearchBar'
import { useTestContext } from '../../viewercontext'

/**
 * Toggle Shapes widget tests
 */
export const searchBarWidgetTests: Mocha.Suite = describe('ToggleShapesWidget component', () => {

    let c!: renderer.ReactTestRenderer

    after(() => {
        c.unmount()
    })

    it('Should render without crashing', () => {
        useTestContext((ctx) => {
            c = renderer.create(
                <Provider store={ctx.store}>
                    <SearchBar />
                </Provider>)
        })
    })
})
