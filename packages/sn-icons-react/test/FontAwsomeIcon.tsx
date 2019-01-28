import { shallow } from 'enzyme'

import 'jest'
import React from 'react'
import { FontAwesomeIcon } from '../src/components/fontawesome/Icon'
import { Icon, iconType } from '../src/components/Icon'
/**
 * FontAwesome Icon Component tests
 */
describe('Icon component', () => {
  it('Should render without crashing', () => {
    expect(shallow(<FontAwesomeIcon iconName="folder" />).hasClass('fa-folder')).toBe(true)
  })
  it('Should render without crashing with fontSize', () => {
    expect(shallow(<FontAwesomeIcon fontSize="default" iconName="folder" />).hasClass('fa-folder')).toBe(true)
  })
  it('Should render without crashing with color', () => {
    expect(shallow(<FontAwesomeIcon color="primary" iconName="folder" />).hasClass('fa-folder')).toBe(true)
  })
  it('Should render without crashing with classes', () => {
    expect(shallow(<FontAwesomeIcon classes={{}} iconName="folder" />).hasClass('fa-folder')).toBe(true)
  })
  it('Should render without crashing with styles', () => {
    expect(shallow(<FontAwesomeIcon style={{}} iconName="folder" />).hasClass('fa-folder')).toBe(true)
  })
  it('Should render without crashing with onClick', () => {
    expect(
      shallow(
        <FontAwesomeIcon onClick={(e: React.MouseEvent<HTMLElement>) => console.log(e.target)} iconName="folder" />,
      ).hasClass('fa-folder'),
    ).toBe(true)
  })
  it('Should render without crashing with children component', () => {
    expect(
      shallow(
        <FontAwesomeIcon iconName="folder">
          <Icon type={iconType.materialui} iconName="forward" />
        </FontAwesomeIcon>,
      ).hasClass('fa-folder'),
    ).toBe(true)
  })
})
