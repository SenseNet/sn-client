import { shallow } from 'enzyme'

import 'jest'
import React from 'react'
import { Icon, iconType } from '../src/components/Icon'
/**
 * Page Component tests
 */
export const pageTests = describe('Icon component', () => {
  it('Should render without crashing', () => {
    expect(
      shallow(<Icon className="workspace" type={iconType.materialui} iconName="workspace" />).hasClass('workspace'),
    ).toBe(true)
  })
  it('Should render without crashing', () => {
    expect(
      shallow(<Icon className="workspace" type={iconType.fontawesome} iconName="workspace" />).hasClass('workspace'),
    ).toBe(false)
  })
  it('Should render without crashing', () => {
    expect(
      shallow(<Icon className="workspace" type={iconType.flaticon} iconName="workspace" />).hasClass(
        'flaticon-workspace',
      ),
    ).toBe(false)
  })
  // it('Should render without crashing', () => {
  //   expect(shallow(<Icon type={iconType.image} iconName="workspace" />)).toBe(true)
  // })
  // it('Should render without crashing', () => {
  //   expect(shallow(<Icon type={null} iconName="workspace" />)).toBe(true)
  // })
  // it('Should render without crashing', () => {
  //   expect(shallow(<Icon iconName="workspace" />)).toBe(true)
  // })
  // it('Should render without crashing', () => {
  //   expect(shallow(<Icon color="primary" fontSize="default" classes={{}} type={null} iconName="workspace" />)).toBe(true)
  // })
  // it('Should render without crashing with overlay', () => {
  //   expect(shallow(<Icon color="primary" fontSize="default" classes={{}} type={null} iconName="workspace" />).contains(<Icon type={iconType.materialui} iconName="forward" />)).toBe(true)
  // })
  // it('Should render without crashing with overlay', () => {
  //   expect(shallow(<Icon color="primary" fontSize="default" classes={{}} type={iconType.flaticon} iconName="workspace" />).contains(<Icon type={iconType.materialui} iconName="forward" />)).toBe(true)
  // })
  // it('Should render without crashing with overlay', () => {
  //   expect(shallow(<Icon color="primary" fontSize="default" classes={{}} type={iconType.fontawesome} iconName="workspace" />).contains(<Icon type={iconType.materialui} iconName="forward" />)).toBe(true)
  // })
  // it('Should render without crashing with overlay', () => {
  //   expect(shallow(<Icon color="primary" fontSize="default" classes={{}} type={iconType.image} iconName="workspace" />).contains(<Icon type={iconType.materialui} iconName="forward" />)).toBe(true)
  // })
})
