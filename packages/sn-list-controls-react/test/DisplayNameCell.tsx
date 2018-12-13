import { Icon } from '@sensenet/icons-react'
import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { DisplayNameCell } from '../src/ContentList/CellTemplates/DisplayNameCell'

/**
 * DisplayNameCell Component tests
 */
describe('DisplayNameCell component', () => {
  it('Should render without crashing', () => {
    const component = renderer.create(
      <DisplayNameCell icons={{}} content={{ Id: 123, Path: '', Name: '', Type: 'Folder' }} isSelected={false} />,
    )
    expect(component.root.findAllByType(Icon).length).toBe(0)
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
    expect(component.root.findAllByType(Icon).length).toBe(0)
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
    expect(component.root.findAllByType(Icon).length).toBe(1)
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
    expect(component.root.findAllByType(Icon).length).toBe(0)
    component.unmount()
  })
})
