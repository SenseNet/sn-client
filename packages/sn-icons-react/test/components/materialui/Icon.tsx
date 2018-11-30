import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { Icon, iconType } from '../../../src/components/Icon'
import { MaterialIcon } from '../../../src/components/materialui/Icon'
/**
 * MaterialUI Icon Component tests
 */
export const materialuiIconTests: Mocha.Suite = describe('Icon component', () => {
  let c!: renderer.ReactTestRenderer

  after(() => {
    c.unmount()
  })

  it('Should render without crashing', () => {
    c = renderer.create(<MaterialIcon iconName="workspace" />)
  })
  it('Should render without crashing with fontSize', () => {
    c = renderer.create(<MaterialIcon fontSize="default" iconName="workspace" />)
  })
  it('Should render without crashing with color', () => {
    c = renderer.create(<MaterialIcon color="primary" iconName="workspace" />)
  })
  it('Should render without crashing with classes', () => {
    c = renderer.create(<MaterialIcon classes={{}} iconName="workspace" />)
  })
  it('Should render without crashing with styles', () => {
    c = renderer.create(<MaterialIcon style={{}} iconName="workspace" />)
  })
  it('Should render without crashing with onClick', () => {
    c = renderer.create(<MaterialIcon onClick={e => console.log(e.target)} iconName="workspace" />)
  })
  it('Should render without crashing with className', () => {
    c = renderer.create(
      <MaterialIcon onClick={e => console.log(e.target)} className="workspace" iconName="workspace" />,
    )
  })
  it('Should render without crashing with overlay', () => {
    c = renderer.create(
      <MaterialIcon color="primary" fontSize="default" classes={{}} iconName="workspace">
        <Icon type={iconType.materialui} iconName="forward" />
      </MaterialIcon>,
    )
  })
})
