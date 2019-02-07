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

  it('should add secondary click action', () => {
    const renderItem = (item: ItemProps<MockData>) => {
      const onClick = (event: React.MouseEvent<Element, MouseEvent>) => {
        item.actionClickHandler && item.actionClickHandler(item, event)
      }
      return (
        <div>
          {item.nodeData && item.nodeData.text} <span onClick={onClick}>icon</span>
        </div>
      )
    }
    const text = 'some text'
    const actionClickHandler = jest.fn()
    const wrapper = shallow(
      <ItemComponent<MockData>
        actionClickHandler={actionClickHandler}
        nodeData={{ text, Id: 1 }}
        renderItem={renderItem}
      />,
    )
    expect(wrapper.find('span')).toBeTruthy()
    wrapper.find('span').simulate('click')
    expect(actionClickHandler).toBeCalled()
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
