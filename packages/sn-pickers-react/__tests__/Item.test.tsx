import { shallow } from 'enzyme'
import React from 'react'
import { ItemComponent, ItemProps } from '../src/ListPicker/Item'
import { ItemList } from '../src/ListPicker/ItemsList'
import { items, MockData } from './mocks/items'

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
})

describe('ItemsList component', () => {
  it('should return multiple Items with rendered texts', () => {
    const renderItem = (item: ItemProps<MockData>) => <div>{item.nodeData && item.nodeData.text}</div>
    const wrapper = shallow(<ItemList<MockData> items={items} renderItem={renderItem} />)
    expect(wrapper.find(ItemComponent).length).toBe(items.length)
    expect(
      wrapper
        .find(ItemComponent)
        .first()
        .dive()
        .text(),
    ).toBe('Csiga')
  })
})
