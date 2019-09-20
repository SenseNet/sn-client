import ListItem from '@material-ui/core/ListItem'
import { Repository } from '@sensenet/client-core'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { sleepAsync } from '@sensenet/client-utils'
import { act } from 'react-dom/test-utils'
import * as loaders from '../src/ListPicker/loaders'
import { ListPickerComponent } from '../src/ListPicker'
import { genericContentItems } from './mocks/items'
import { PickerWithoutOptions } from './mocks/Pickers'

jest.mock('../src/ListPicker/loaders', () => ({
  loadItems: jest.fn(async () => []),
}))

describe('List picker component', () => {
  it('should render list items', async () => {
    ;(loaders.loadItems as any).mockReturnValue(Promise.resolve(genericContentItems))
    act(async () => {
      const wrapper = shallow(<ListPickerComponent repository={new Repository()} />)
      await sleepAsync(1)
      expect(wrapper.find(ListItem).exists()).toBeTruthy()
      expect(wrapper.find(ListItem).length).toBe(4)
    })
  })

  it('should call renderLoading when loading is true', () => {
    ;(loaders.loadItems as any).mockReturnValue(Promise.resolve(undefined))
    const loadingRenderer = jest.fn()
    act(async () => {
      const wrapper = shallow(<ListPickerComponent renderLoading={loadingRenderer} repository={new Repository()} />)
      expect(wrapper.find(ListItem).exists()).toBeFalsy()
      expect(loadingRenderer).toBeCalled()
    })
  })

  it('should render nothing when no renderLoading and loading is true', () => {
    ;(loaders.loadItems as any).mockReturnValue({ data: undefined, isLoading: true })
    act(async () => {
      const wrapper = shallow(<ListPickerComponent repository={new Repository()} />)
      expect(wrapper.find(ListItem).exists()).toBeFalsy()
    })
  })

  it('should render an error message when error', () => {
    ;(loaders.loadItems as any).mockReturnValue(Promise.reject('Error'))
    const errorRenderer = jest.fn()
    act(async () => {
      const wrapper = shallow(<ListPickerComponent renderError={errorRenderer} repository={new Repository()} />)
      expect(wrapper.find(ListItem).exists()).toBeFalsy()
      expect(errorRenderer).toBeCalled()
    })
  })

  it('should render nothing when no renderError and error', () => {
    ;(loaders.loadItems as any).mockReturnValue(Promise.reject('Error'))
    const wrapper = shallow(<ListPickerComponent repository={new Repository()} />)
    expect(wrapper.find(ListItem).exists()).toBeFalsy()
  })

  it('should handle navigation to parent/list item', () => {
    ;(loaders.loadItems as any).mockReturnValue(Promise.resolve(genericContentItems))
    const onNavigation = jest.fn()
    act(async () => {
      const wrapper = mount(<ListPickerComponent onNavigation={onNavigation} repository={new Repository()} />)
      wrapper
        .find(ListItem)
        .first()
        .simulate('dblclick')
      expect(onNavigation).toBeCalledWith(genericContentItems[0].Path)
      wrapper
        .find(ListItem)
        .last()
        .simulate('dblclick')
      expect(onNavigation).toBeCalledWith(genericContentItems[3].Path)
    })
  })

  it('should handle selection', () => {
    ;(loaders.loadItems as any).mockReturnValue(Promise.resolve(genericContentItems))
    const onSelectionChanged = jest.fn()
    act(async () => {
      const wrapper = mount(
        <ListPickerComponent onSelectionChanged={onSelectionChanged} repository={new Repository()} />,
      )
      wrapper
        .find(ListItem)
        .first()
        .simulate('click')
      expect(onSelectionChanged).toBeCalled()
    })
  })

  it('render list items when no options passed to useListPicker', () => {
    ;(loaders.loadItems as any).mockReturnValue(Promise.resolve(genericContentItems))
    act(async () => {
      const wrapper = shallow(<PickerWithoutOptions repository={new Repository()} />)
      expect(wrapper.find('li').exists()).toBeTruthy()
      expect(wrapper.find('li').length).toBe(4)
    })
  })
})
