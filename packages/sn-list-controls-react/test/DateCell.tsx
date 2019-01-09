import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as React from 'react'
import { DateCell } from '../src/ContentList/CellTemplates/DateCell'

/**
 * DateCell Component tests
 */
describe('DateCell component', () => {
  configure({ adapter: new Adapter() })
  it('Should render without crashing', () => {
    const component = shallow(<DateCell date="2017-05-02T12:23Z" />)
    component.unmount()
  })
})
