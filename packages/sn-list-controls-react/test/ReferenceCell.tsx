import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { ReferenceCell } from '../src/ContentList/CellTemplates/ReferenceCell'

/**
 * ReferenceCell Component tests
 */
describe('ReferenceCell component', () => {
  it('Should render without crashing', () => {
    const component = renderer.create(
      <ReferenceCell content={{ Id: 1, Name: 'a', Type: 'Folder', Path: '' }} fieldName={'Type'} />,
    )
    component.unmount()
  })
})
