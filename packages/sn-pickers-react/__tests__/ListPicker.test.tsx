import { mount } from 'enzyme'
import React from 'react'
import useAsync from 'react-use/lib/useAsync'
import { ItemComponent } from '../src/ListPicker/Item'
import { ListPickerComponent } from '../src/ListPicker/ListPicker'
import { genericContentItems } from './mocks/items'

jest.mock('react-use/lib/useAsync')

describe('List picker component', () => {
  it('render list items', () => {
    ;(useAsync as any).mockReturnValue({ value: undefined }).mockReturnValueOnce({ value: genericContentItems })
    const wrapper = mount(<ListPickerComponent loadParent={jest.fn()} loadItems={jest.fn()} />)
    expect(wrapper.find(ItemComponent).length).toBe(4)
  })
})
