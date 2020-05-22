import React from 'react'
import { shallow } from 'enzyme'
import { Icon, iconType } from '../src/components/Icon'
import { ImageIcon } from '../src/components/image/Icon'

/**
 * Image Icon Component tests
 */
describe('Icon component', () => {
  it('Should render without crashing', () => {
    expect(
      shallow(<ImageIcon size={16} style={{ marginLeft: 2 }} iconName="workspace" />).matchesElement(<span />),
    ).toBe(true)
  })
  it('Should render without crashing without size param', () => {
    expect(shallow(<ImageIcon iconName="workspace" />).matchesElement(<span />)).toBe(true)
  })
  it('Should render without crashing with onClick param', () => {
    expect(
      shallow(
        <ImageIcon onClick={(e: React.MouseEvent<HTMLElement>) => console.log(e.target)} iconName="workspace" />,
      ).matchesElement(<span />),
    ).toBe(true)
  })
  it('Should render without crashing with overlay', () => {
    expect(
      shallow(
        <ImageIcon onClick={(e: React.MouseEvent<HTMLElement>) => console.log(e.target)} iconName="workspace">
          <Icon type={iconType.materialui} iconName="forward" />
        </ImageIcon>,
      ).matchesElement(<span />),
    ).toBe(false)
  })
})
