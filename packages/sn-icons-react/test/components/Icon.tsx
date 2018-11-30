import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { Icon, iconType } from '../../src/components/Icon'
/**
 * Page Component tests
 */
export const pageTests: Mocha.Suite = describe('Icon component', () => {
  let c!: renderer.ReactTestRenderer

  after(() => {
    c.unmount()
  })

  it('Should render without crashing', () => {
    c = renderer.create(<Icon type={iconType.materialui} iconName="workspace" />)
  })
  it('Should render without crashing', () => {
    c = renderer.create(<Icon type={iconType.fontawesome} iconName="workspace" />)
  })
  it('Should render without crashing', () => {
    c = renderer.create(<Icon type={iconType.flaticon} iconName="workspace" />)
  })
  it('Should render without crashing', () => {
    c = renderer.create(<Icon type={iconType.image} iconName="workspace" />)
  })
  it('Should render without crashing', () => {
    c = renderer.create(<Icon type={null} iconName="workspace" />)
  })
  it('Should render without crashing', () => {
    c = renderer.create(<Icon iconName="workspace" />)
  })
  it('Should render without crashing', () => {
    c = renderer.create(<Icon color="primary" fontSize="default" classes={{}} type={null} iconName="workspace" />)
  })
  it('Should render without crashing with overlay', () => {
    c = renderer.create(
      <Icon color="primary" fontSize="default" classes={{}} type={iconType.materialui} iconName="workspace">
        <Icon type={iconType.materialui} iconName="forward" />
      </Icon>,
    )
  })
  it('Should render without crashing with overlay', () => {
    c = renderer.create(
      <Icon color="primary" fontSize="default" classes={{}} type={iconType.flaticon} iconName="workspace">
        <Icon type={iconType.materialui} iconName="forward" />
      </Icon>,
    )
  })
  it('Should render without crashing with overlay', () => {
    c = renderer.create(
      <Icon color="primary" fontSize="default" classes={{}} type={iconType.fontawesome} iconName="workspace">
        <Icon type={iconType.materialui} iconName="forward" />
      </Icon>,
    )
  })
  it('Should render without crashing with overlay', () => {
    c = renderer.create(
      <Icon color="primary" fontSize="default" classes={{}} type={iconType.image} iconName="workspace">
        <Icon type={iconType.materialui} iconName="forward" />
      </Icon>,
    )
  })
})
