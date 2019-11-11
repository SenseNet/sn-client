import { shallow } from 'enzyme'
import React from 'react'
import { Icon, iconType } from '../src/components/Icon'
import { MaterialIcon } from '../src/components/materialui/Icon'

/**
 * MaterialUI Icon Component tests
 */
describe('Icon component', () => {
  it('Should render without crashing', () => {
    expect(shallow(<MaterialIcon className="workspace" iconName="workspace" />).hasClass('workspace')).toBe(true)
  })
  it('Should render without crashing with fontSize', () => {
    expect(
      shallow(<MaterialIcon className="workspace" fontSize="default" iconName="workspace" />).hasClass('workspace'),
    ).toBe(true)
  })
  it('Should render without crashing with color', () => {
    expect(
      shallow(<MaterialIcon className="workspace" color="primary" iconName="workspace" />).hasClass('workspace'),
    ).toBe(true)
  })
  it('Should render without crashing with classes', () => {
    expect(
      shallow(<MaterialIcon className="workspace" classes={{}} iconName="workspace" />).hasClass('workspace'),
    ).toBe(true)
  })
  it('Should render without crashing with styles', () => {
    expect(shallow(<MaterialIcon className="workspace" style={{}} iconName="workspace" />).hasClass('workspace')).toBe(
      true,
    )
  })
  it('Should render without crashing with onClick', () => {
    expect(
      shallow(
        <MaterialIcon
          className="workspace"
          onClick={(e: React.MouseEvent<HTMLElement>) => console.log(e.target)}
          iconName="workspace"
        />,
      ).hasClass('workspace'),
    ).toBe(true)
  })
  it('Should render without crashing with className', () => {
    expect(shallow(<MaterialIcon className="workspace" iconName="workspace" />).hasClass('workspace')).toBe(true)
  })
  it('Should render without crashing with overlay', () => {
    expect(
      shallow(
        <MaterialIcon iconName="folder" className="workspace">
          <Icon type={iconType.materialui} iconName="forward" />
        </MaterialIcon>,
      ).hasClass('workspace'),
    ).toBe(true)
  })
})
