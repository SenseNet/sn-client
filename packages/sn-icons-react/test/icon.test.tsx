import React from 'react'
import { shallow } from 'enzyme'
import { Icon, iconType } from '../src/components/Icon'

/**
 * Page Component tests
 */
export const pageTests = describe('Icon component', () => {
  it('Should render without crashing', () => {
    expect(
      shallow(
        <Icon
          className="workspace"
          type={iconType.materialui}
          iconName="workspace"
          onClick={(e) => console.log(e.target)}
        />,
      ).hasClass('workspace'),
    ).toBe(true)
  })
  it('Should render without crashing', () => {
    expect(
      shallow(
        <Icon
          className="workspace"
          type={iconType.fontawesome}
          iconName="workspace"
          onClick={(e) => console.log(e.target)}
        />,
      ).hasClass('workspace'),
    ).toBe(false)
  })
  it('Should render without crashing', () => {
    expect(
      shallow(
        <Icon
          className="workspace"
          type={iconType.flaticon}
          iconName="workspace"
          onClick={(e) => console.log(e.target)}
        />,
      ).hasClass('flaticon-workspace'),
    ).toBe(false)
  })
  it('Should render without crashing', () => {
    expect(
      shallow(
        <Icon className="workspace" iconName="workspace" onClick={(e) => console.log(e.target)}>
          <span>aaa</span>
        </Icon>,
      ).hasClass('workspace'),
    ).toBe(true)
  })
  it('Should render without crashing', () => {
    expect(
      shallow(
        <Icon
          className="workspace"
          type={iconType.materialui}
          iconName="workspace"
          onClick={(e) => console.log(e.target)}>
          <span>aaa</span>
        </Icon>,
      ).hasClass('workspace'),
    ).toBe(true)
  })
  it('Should render without crashing', () => {
    expect(
      shallow(
        <Icon
          className="workspace"
          type={iconType.fontawesome}
          iconName="workspace"
          onClick={(e) => console.log(e.target)}>
          <span>aaa</span>
        </Icon>,
      ).hasClass('workspace'),
    ).toBe(false)
  })
  it('Should render without crashing', () => {
    expect(
      shallow(
        <Icon
          className="workspace"
          type={iconType.flaticon}
          iconName="workspace"
          onClick={(e) => console.log(e.target)}>
          <span>aaa</span>
        </Icon>,
      ).hasClass('flaticon-workspace'),
    ).toBe(false)
  })
  it('Should render without crashing', () => {
    expect(
      shallow(
        <Icon className="workspace" iconName="workspace" onClick={(e) => console.log(e.target)}>
          <span>aaa</span>
        </Icon>,
      ).hasClass('workspace'),
    ).toBe(true)
  })
  it('Should trigger the given function on click event', () => {
    const mockEvent = jest.fn()
    const wrapper = shallow(
      <Icon className="workspace" type={iconType.materialui} iconName="workspace" onClick={mockEvent} />,
    )
    wrapper.simulate('click')
    expect(mockEvent).toBeCalled()
  })
  it('Should trigger the given function on click event', () => {
    const mockEvent = jest.fn()
    const wrapper = shallow(
      <Icon className="workspace" type={iconType.fontawesome} iconName="workspace" onClick={mockEvent} />,
    )
    wrapper.simulate('click')
    expect(mockEvent).toBeCalled()
  })
  it('Should trigger the given function on click event', () => {
    const mockEvent = jest.fn()
    const wrapper = shallow(
      <Icon className="workspace" type={iconType.flaticon} iconName="workspace" onClick={mockEvent} />,
    )
    wrapper.simulate('click')
    expect(mockEvent).toBeCalled()
  })
  it('Should trigger the given function on click event', () => {
    const mockEvent = jest.fn()
    const wrapper = shallow(<Icon className="workspace" iconName="workspace" onClick={mockEvent} />)
    wrapper.simulate('click')
    expect(mockEvent).toBeCalled()
  })
})
