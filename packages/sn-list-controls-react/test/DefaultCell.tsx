import { expect } from 'chai'
import * as React from 'react'
import { create } from 'react-test-renderer'
import { DefaultCell } from '../src/ContentList/CellTemplates/DefaultCell'

/**
 * DefaultCell Component tests
 */
describe('DefaultCell component', () => {
  it('Should render without crashing without selected class by default', () => {
    const component = create(
      <DefaultCell content={{ Id: 123, Path: '', Name: '', Type: 'Folder' }} field={'Type'} isSelected={false} />,
    )
    expect((component.toTree() as any).rendered.props.className).to.be.eq('')
    component.unmount()
  })

  it('Should add selected class from props', () => {
    const component = create(
      <DefaultCell content={{ Id: 123, Path: '', Name: '', Type: 'Folder' }} field={'Type'} isSelected={true} />,
    )
    expect((component.toTree() as any).rendered.props.className).to.be.eq('selected')
    component.unmount()
  })
})
