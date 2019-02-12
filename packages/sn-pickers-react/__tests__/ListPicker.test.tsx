import { shallow } from 'enzyme'
import React from 'react'
import { ItemComponent } from '../src/ListPicker/Item'
import { ListPickerComponent } from '../src/ListPicker/ListPicker'
import { genericContentItems } from './mocks/items'

describe('List picker component', () => {
  it.skip('render list items', async () => {
    const loadItems = () => Promise.resolve(genericContentItems)
    const wrapper = shallow(<ListPickerComponent loadParent={jest.fn()} loadItems={loadItems} />)
    expect(wrapper.find(ItemComponent).length).toBe(4)
  })
})
