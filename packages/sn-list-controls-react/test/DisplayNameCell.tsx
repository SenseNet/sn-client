import { shallow } from 'enzyme'

import * as React from 'react'
import { DisplayNameCell } from '../src/ContentList/CellTemplates/DisplayNameCell'

/**
 * DisplayNameCell Component tests
 */
describe('DisplayNameCell component', () => {
  it('Should render without crashing', () => {
    const component = shallow(
      <DisplayNameCell icons={{}} content={{ Id: 123, Path: '', Name: '', Type: 'Folder' }} isSelected={false} />,
    )
    component.unmount()
  })

  it('Should get the Icon property from the content if available', () => {
    const component = shallow(
      <DisplayNameCell
        icons={{}}
        content={{ Id: 123, Path: '', Name: '', Type: 'Folder', Icon: 'File' }}
        isSelected={false}
      />,
    )
    component.unmount()
  })

  it('Should should display an icon if available', () => {
    const component = shallow(
      <DisplayNameCell
        icons={{ file: 'file' }}
        content={{ Id: 123, Path: '', Name: '', Type: 'Folder', Icon: 'File' }}
        isSelected={false}
      />,
    )
    component.unmount()
  })
  it('Should render without crashing when icon is office related', () => {
    const component = shallow(
      <DisplayNameCell
        icons={{}}
        content={{ Id: 123, Path: '', Name: '', Type: 'Folder', Icon: 'word' }}
        isSelected={false}
      />,
    )
    component.unmount()
  })
})
