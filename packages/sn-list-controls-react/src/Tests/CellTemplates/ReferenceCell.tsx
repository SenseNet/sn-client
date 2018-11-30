import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { ReferenceCell } from '../../ContentList/CellTemplates/ReferenceCell'

/**
 * ReferenceCell Component tests
 */
export const referenceCellTests: Mocha.Suite = describe('ReferenceCell component', () => {
  it('Should render without crashing', () => {
    const component = renderer.create(
      <ReferenceCell content={{ Id: 1, Name: 'a', Type: 'Folder', Path: '' }} fieldName={'Type'} />,
    )
    component.unmount()
  })
})
