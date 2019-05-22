import ListItem from '@material-ui/core/ListItem'
import { Repository } from '@sensenet/client-core'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { useAsync } from 'react-async'
import { ListPickerComponent } from '../src/ListPicker'
import { genericContentItems } from './mocks/items'

jest.mock('react-async')

describe('List picker component', () => {
  it('should render list items', () => {
    ;(useAsync as any).mockReturnValue({ data: genericContentItems })
    const wrapper = shallow(<ListPickerComponent repository={new Repository()} />)
    expect(wrapper.find(ListItem).exists()).toBeTruthy()
    expect(wrapper.find(ListItem).length).toBe(4)
  })

  it('should call renderLoading when loading is true', () => {
    ;(useAsync as any).mockReturnValue({ data: undefined, isLoading: true })
    const loadingRenderer = jest.fn()
    const wrapper = shallow(<ListPickerComponent renderLoading={loadingRenderer} repository={new Repository()} />)
    expect(wrapper.find(ListItem).exists()).toBeFalsy()
    expect(loadingRenderer).toBeCalled()
  })

  it('should render nothing when no renderLoading and loading is true', () => {
    ;(useAsync as any).mockReturnValue({ data: undefined, isLoading: true })
    const wrapper = shallow(<ListPickerComponent repository={new Repository()} />)
    expect(wrapper.find(ListItem).exists()).toBeFalsy()
  })

  it('should render an error message when error', () => {
    ;(useAsync as any).mockReturnValue({ data: undefined, error: { message: 'Error' } })
    const errorRenderer = jest.fn()
    const wrapper = shallow(<ListPickerComponent renderError={errorRenderer} repository={new Repository()} />)
    expect(wrapper.find(ListItem).exists()).toBeFalsy()
    expect(errorRenderer).toBeCalled()
  })

  it('should render nothing when no renderError and error', () => {
    ;(useAsync as any).mockReturnValue({ data: undefined, error: { message: 'Error' } })
    const wrapper = shallow(<ListPickerComponent repository={new Repository()} />)
    expect(wrapper.find(ListItem).exists()).toBeFalsy()
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

  it('should handle selection', () => {
    ;(useAsync as any).mockReturnValue({ data: undefined }).mockReturnValueOnce({ data: genericContentItems })
    const onSelectionChanged = jest.fn()
    const wrapper = mount(<ListPickerComponent onSelectionChanged={onSelectionChanged} repository={new Repository()} />)
    wrapper
      .find(ListItem)
      .first()
      .simulate('click')
    expect(onSelectionChanged).toBeCalled()
  })
})
