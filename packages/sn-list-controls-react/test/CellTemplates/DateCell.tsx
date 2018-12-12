import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { DateCell } from '../../src/ContentList/CellTemplates/DateCell'

/**
 * DateCell Component tests
 */
export const dateCellTests: Mocha.Suite = describe('DateCell component', () => {
  it('Should render without crashing', () => {
    const component = renderer.create(<DateCell date="2017-05-02T12:23Z" />)
    component.unmount()
  })
})
