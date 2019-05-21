import ListItem from '@material-ui/core/ListItem'
import { Repository } from '@sensenet/client-core'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { useAsync } from 'react-async'
import { ListPickerComponent } from '../src/ListPicker'
import { genericContentItems } from './mocks/items'

jest.mock('react-async')

describe('List picker component', () => {
  it('should render list items without parent', () => {
    ;(useAsync as any).mockReturnValue({ data: genericContentItems })
    const wrapper = shallow(<ListPickerComponent repository={new Repository()} />)
    expect(wrapper.find(ListItem).exists()).toBeTruthy()
    expect(wrapper.find(ListItem).length).toBe(4)
  })

  it('should render loading when parent is loading', () => {
    ;(useAsync as any).mockReturnValue({ data: undefined, isLoading: true })
    const loadingRenderer = jest.fn()
    const wrapper = shallow(<ListPickerComponent renderLoading={loadingRenderer} repository={new Repository()} />)
    expect(wrapper.find(ListItem).exists()).toBeFalsy()
    expect(loadingRenderer).toBeCalled()
  })

  it('should handle navigation', () => {
    ;(useAsync as any).mockReturnValue({ data: undefined }).mockReturnValueOnce({ data: genericContentItems })
    const onNavigation = jest.fn()
    const wrapper = mount(<ListPickerComponent onNavigation={onNavigation} repository={new Repository()} />)
    wrapper
      .find(ListItem)
      .first()
      .simulate('dblclick')
    expect(onNavigation).toBeCalled()
  })

  it('should not render loading when items are loading and render loading is not defined', () => {
    ;(useAsync as any).mockReturnValue({ data: undefined }).mockReturnValueOnce({ data: undefined, isLoading: true })
    const wrapper = shallow(<ListPickerComponent repository={new Repository()} />)
    expect(wrapper.find(ListItem).exists()).toBeFalsy()
  })
})
