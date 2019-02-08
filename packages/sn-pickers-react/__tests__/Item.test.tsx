import { shallow } from 'enzyme'
import React from 'react'
import { ItemComponent, ItemProps } from '../src/ListPicker'
import { MockData } from './mocks/items'

describe('Item component', () => {
  it('should return a div with a rendered text', () => {
    const renderItem = (item: ItemProps<MockData>) => <div>{item.nodeData && item.nodeData.text}</div>
    const text = 'some text'
    const wrapper = shallow(<ItemComponent<MockData> nodeData={{ text, Id: 1 }} renderItem={renderItem} />)
    expect(wrapper.find('div')).toBeTruthy()
    expect(
      wrapper
        .find('div')
        .last()
        .text(),
    ).toBe(text)
  })

  it('should render the Id without renderItem props', () => {
    const wrapper = shallow(<ItemComponent<MockData> nodeData={{ text: 'some text', Id: 1 }} />)
    expect(wrapper.find('li')).toBeTruthy()
    expect(wrapper.find('li').text()).toBe('1')
  })

  it('click action should work', () => {
    const renderItem = (item: ItemProps<MockData>) => <div>{item.nodeData && item.nodeData.text}</div>
    const clickHandler = jest.fn()
    const wrapper = shallow(
      <ItemComponent<MockData>
        onClickHandler={clickHandler}
        nodeData={{ text: 'some text', Id: 1 }}
        renderItem={renderItem}
      />,
    )
    wrapper
      .find('div')
      .first()
      .simulate('click')
    expect(clickHandler).toBeCalled()
  })

  it('double click action should work', () => {
    const doubleClickHandler = jest.fn()
    const wrapper = shallow(
      <ItemComponent<MockData> onDoubleClickHandler={doubleClickHandler} nodeData={{ text: 'some text', Id: 1 }} />,
    )
    wrapper.find('div').simulate('doubleClick')
    expect(doubleClickHandler).toBeCalled()
  })
})
