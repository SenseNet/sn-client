import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as React from 'react'
import { ReferenceCell } from '../src/ContentList/CellTemplates/ReferenceCell'

/**
 * ReferenceCell Component tests
 */
describe('ReferenceCell component', () => {
  configure({ adapter: new Adapter() })
  it('Should render without crashing', () => {
    const component = shallow(
      <ReferenceCell content={{ Id: 1, Name: 'a', Type: 'Folder', Path: '' }} fieldName={'Type'} />,
    )
    component.unmount()
  })
})
