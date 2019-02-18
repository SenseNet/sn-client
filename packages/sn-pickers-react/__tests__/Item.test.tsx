import { GenericContent } from '@sensenet/default-content-types'
import { shallow } from 'enzyme'
import React from 'react'
import { ItemComponent } from '../src/ListPicker'
import { mockContent } from './mocks/items'

describe('Item component', () => {
  it('should return a div with a rendered text', () => {
    const renderItem = (item: GenericContent) => <div>{item.Name}</div>
    const wrapper = shallow(<ItemComponent node={mockContent} renderItem={renderItem} />)
    expect(wrapper.find('div')).toBeTruthy()
    expect(
      wrapper
        .find('div')
        .last()
        .text(),
    ).toBe(mockContent.Name)
  })

  it('should render the Name without renderItem props', () => {
    const wrapper = shallow(<ItemComponent node={mockContent} />)
    expect(wrapper.find('li')).toBeTruthy()
    expect(wrapper.find('li').text()).toBe('MockFolder')
  })

  it('click action should work', () => {
    const renderItem = (item: GenericContent) => <div>{item.Name}</div>
    const clickHandler = jest.fn()
    const wrapper = shallow(<ItemComponent onClickHandler={clickHandler} node={mockContent} renderItem={renderItem} />)
    wrapper
      .find('div')
      .first()
      .simulate('click')
    expect(clickHandler).toBeCalled()
  })

  it('double click action should work', () => {
    const doubleClickHandler = jest.fn()
    const wrapper = shallow(<ItemComponent onDoubleClickHandler={doubleClickHandler} node={mockContent} />)
    wrapper.find('div').simulate('doubleClick')
    expect(doubleClickHandler).toBeCalled()
  })
})
