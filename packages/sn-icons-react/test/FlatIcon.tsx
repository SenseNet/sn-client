import { shallow } from 'enzyme'

import 'jest'
import React from 'react'
import { FlatIcon } from '../src/components/flaticon/Icon'
import { Icon, iconType } from '../src/components/Icon'
/**
 * Flat Icon Component tests
 */
describe('Icon component', () => {
  it('Should render without crashing', () => {
    expect(shallow(<FlatIcon iconName="folder-symbol" />).hasClass('flaticon-folder-symbol')).toBe(true)
  })
  it('Should render without crashing with fontSize', () => {
    expect(shallow(<FlatIcon iconName="folder-symbol" fontSize="default" />).hasClass('flaticon-folder-symbol')).toBe(
      true,
    )
  })
  it('Should render without crashing with color', () => {
    expect(shallow(<FlatIcon iconName="folder-symbol" color="primary" />).hasClass('flaticon-folder-symbol')).toBe(true)
  })
  it('Should render without crashing with classes', () => {
    expect(shallow(<FlatIcon iconName="folder-symbol" classes={{}} />).hasClass('flaticon-folder-symbol')).toBe(true)
  })
  it('Should render without crashing with styles', () => {
    expect(shallow(<FlatIcon iconName="folder-symbol" style={{}} />).hasClass('flaticon-folder-symbol')).toBe(true)
  })
  it('Should render without crashing with onClick', () => {
    expect(
      shallow(
        <FlatIcon iconName="folder-symbol" onClick={(e: React.MouseEvent<HTMLElement>) => console.log(e.target)} />,
      ).hasClass('flaticon-folder-symbol'),
    ).toBe(true)
  })
  it('Should render without crashing with children component', () => {
    expect(
      shallow(
        <FlatIcon onClick={(e: React.MouseEvent<HTMLElement>) => console.log(e.target)} iconName="folder-symbol">
          <Icon type={iconType.materialui} iconName="forward" />
        </FlatIcon>,
      ).hasClass('flaticon-folder-symbol'),
    ).toBe(true)
  })
})
