import ListItem from '@material-ui/core/ListItem/ListItem'
import { shallow } from 'enzyme'
import React from 'react'
import { ListPickerComponent } from '../src/ListPicker/ListPicker'
import { genericContentItems } from './mocks/items'

describe('List picker component', () => {
  it('render list items', () => {
    const loadItems = () => Promise.resolve(genericContentItems)
    const wrapper = shallow(<ListPickerComponent loadItems={loadItems} />)
    expect(wrapper.find(ListItem).length).toBe(4)
  })
})
