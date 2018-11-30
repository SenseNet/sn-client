import { Icon } from '@sensenet/icons-react'
import { expect } from 'chai'
import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { DisplayNameCell } from '../../ContentList/CellTemplates/DisplayNameCell'

/**
 * DisplayNameCell Component tests
 */
export const DisplayNameCellTests: Mocha.Suite = describe('DisplayNameCell component', () => {
  it('Should render without crashing', () => {
    const component = renderer.create(
      <DisplayNameCell icons={{}} content={{ Id: 123, Path: '', Name: '', Type: 'Folder' }} isSelected={false} />,
    )
    expect(component.root.findAllByType(Icon).length).to.be.eq(0)
    component.unmount()
  })

  it('Should get the Icon property from the content if available', () => {
    const component = renderer.create(
      <DisplayNameCell
        icons={{}}
        content={{ Id: 123, Path: '', Name: '', Type: 'Folder', Icon: 'File' }}
        isSelected={false}
      />,
    )
    expect(component.root.findAllByType(Icon).length).to.be.eq(0)
    component.unmount()
  })

  it('Should should display an icon if available', () => {
    const component = renderer.create(
      <DisplayNameCell
        icons={{ file: 'file' }}
        content={{ Id: 123, Path: '', Name: '', Type: 'Folder', Icon: 'File' }}
        isSelected={false}
      />,
    )
    expect(component.root.findAllByType(Icon).length).to.be.eq(1)
    component.unmount()
  })
  it('Should render without crashing when icon is office related', () => {
    const component = renderer.create(
      <DisplayNameCell
        icons={{}}
        content={{ Id: 123, Path: '', Name: '', Type: 'Folder', Icon: 'word' }}
        isSelected={false}
      />,
    )
    expect(component.root.findAllByType(Icon).length).to.be.eq(0)
    component.unmount()
  })
})
