import { shallow } from 'enzyme'

import * as React from 'react'
import { DateCell } from '../src/ContentList/CellTemplates/DateCell'

/**
 * DateCell Component tests
 */
describe('DateCell component', () => {
  it('Should render without crashing', () => {
    const component = shallow(<DateCell date="2017-05-02T12:23Z" />)
    component.unmount()
  })
})
