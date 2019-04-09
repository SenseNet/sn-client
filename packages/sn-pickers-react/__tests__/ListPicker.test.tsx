import { Repository } from '@sensenet/client-core'
import { shallow } from 'enzyme'
import React from 'react'
import { useAsync } from 'react-async'
import { ItemComponent, ListPickerComponent } from '../src/ListPicker'
import { genericContentItems, mockContent } from './mocks/items'

jest.mock('react-async')

describe('List picker component', () => {
  it('should render list items without parent', () => {
    ;(useAsync as any).mockReturnValue({ data: undefined }).mockReturnValueOnce({ data: genericContentItems })
    const wrapper = shallow(<ListPickerComponent repository={new Repository()} />)
    expect(wrapper.find(ItemComponent).exists()).toBeTruthy()
    expect(wrapper.find(ItemComponent).length).toBe(4)
  })

  it('should render list items with parent', () => {
    ;(useAsync as any).mockReturnValue({ data: mockContent }).mockReturnValueOnce({ data: genericContentItems })
    const wrapper = shallow(<ListPickerComponent repository={new Repository()} />)
    expect(wrapper.find(ItemComponent).exists()).toBeTruthy()
    expect(wrapper.find(ItemComponent).length).toBe(5)
  })

  it('should render loading when parent is loading', () => {
    ;(useAsync as any).mockReturnValue({ data: undefined, isLoading: true })
    const loadingRenderer = jest.fn()
    const wrapper = shallow(<ListPickerComponent renderLoading={loadingRenderer} repository={new Repository()} />)
    expect(wrapper.find(ItemComponent).exists()).toBeFalsy()
    expect(loadingRenderer).toBeCalled()
  })

  it('should not render loading when items are loading and render loading is not defined', () => {
    ;(useAsync as any).mockReturnValue({ data: undefined }).mockReturnValueOnce({ data: undefined, isLoading: true })
    const wrapper = shallow(<ListPickerComponent repository={new Repository()} />)
    expect(wrapper.find(ItemComponent).exists()).toBeFalsy()
  })
})
