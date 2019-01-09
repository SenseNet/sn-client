import * as React from 'react'
import { Provider } from 'react-redux'
import * as renderer from 'react-test-renderer'
import { SearchBar } from '../src/components/document-widgets/SearchBar'
import { useTestContext } from './__Mocks__/viewercontext'

/**
 * Toggle Shapes widget tests
 */
describe('ToggleShapesWidget component', () => {
  let c!: renderer.ReactTestRenderer

  afterEach(() => {
    c.unmount()
  })

  it('Should render without crashing', () => {
    useTestContext(ctx => {
      c = renderer.create(
        <Provider store={ctx.store}>
          <SearchBar />
        </Provider>,
      )
    })
  })
})
