import { shallow } from 'enzyme'

import * as React from 'react'
import { ReferenceCell } from '../src/ContentList/CellTemplates/ReferenceCell'

/**
 * ReferenceCell Component tests
 */
describe('ReferenceCell component', () => {
  it('Should render without crashing', () => {
    const component = shallow(
      <ReferenceCell content={{ Id: 1, Name: 'a', Type: 'Folder', Path: '' }} fieldName={'Type'} />,
    )
    component.unmount()
  })
})
