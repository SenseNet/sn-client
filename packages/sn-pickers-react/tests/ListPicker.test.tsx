import Checkbox from '@material-ui/core/Checkbox'
import ListItem from '@material-ui/core/ListItem'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { ListPicker } from '../src/components/ListPicker'
import { genericContentItems } from './mocks/items'
import { PickerWithoutOptions } from './mocks/Pickers'

describe('List picker component', () => {
  const repository = (loadCollectionValue?: unknown, loadValue?: unknown) => {
    return {
      loadCollection: () => {
        return {
          d: {
            results: loadCollectionValue,
          },
        }
      },
      load: () => {
        return {
          d: loadValue,
        }
      },
    }
  }

  it('should render list items', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<ListPicker repository={repository(genericContentItems) as any} />)
    })

    expect(wrapper.update().find(ListItem).exists()).toBeTruthy()
    expect(wrapper.find(ListItem).length).toBe(4)
  })

  it('should call renderLoading when loading is true', async () => {
    const loadingRenderer = jest.fn(() => null)
    let wrapper: any
    await act(async () => {
      wrapper = mount(<ListPicker renderLoading={loadingRenderer as any} repository={repository() as any} />)
    })
    expect(wrapper.find(ListItem).exists()).toBeFalsy()
    expect(loadingRenderer).toBeCalled()
  })

  it('should render nothing when no renderLoading and loading is true', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<ListPicker repository={repository() as any} />)
    })
    expect(wrapper.find(ListItem).exists()).toBeFalsy()
  })

  it('should render an error message when error', async () => {
    const errorRenderer = jest.fn(() => null)
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <ListPicker
          renderError={errorRenderer as any}
          repository={
            {
              loadCollection: () => {
                throw new Error('error')
              },
            } as any
          }
        />,
      )
    })
    expect(wrapper.find(ListItem).exists()).toBeFalsy()
    expect(errorRenderer).toBeCalled()
  })

  it('should render nothing when no renderError and error', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <ListPicker
          repository={
            {
              loadCollection: () => {
                throw new Error('error')
              },
            } as any
          }
        />,
      )
    })

    expect(wrapper.find(ListItem).exists()).toBeFalsy()
  })

  it('should handle navigation to parent/list item', async () => {
    const onNavigation = jest.fn()
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <ListPicker onTreeNavigation={onNavigation} repository={repository(genericContentItems) as any} />,
      )
    })

    await act(async () => {
      wrapper.update().find(ListItem).first().simulate('dblclick')
    })
    expect(onNavigation).toBeCalledWith(genericContentItems[0].Path)
    await act(async () => {
      wrapper.find(ListItem).first().simulate('dblclick')
    })
    expect(onNavigation).toBeCalledWith(genericContentItems[3].Path)
  })

  // it('should handle selection', async () => {
  //   const onSelectionChanged = jest.fn()
  //   let wrapper: any
  //   await act(async () => {
  //     wrapper = mount(
  //       <ListPicker onSelectionChanged={onSelectionChanged} repository={repository(genericContentItems) as any} />,
  //     )
  //   })

  //   const onChange = wrapper.update().find(ListItem).first().find(Checkbox).prop('onChange')
  //   act(() => {
  //     onChange?.({ target: { checked: true } } as any, true)
  //   })
  //   wrapper.update()

  //   // console.log(wrapper.debug())
  //   expect(onSelectionChanged).toBeCalled()
  // })

  it('render list items when no options passed to useListPicker', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<PickerWithoutOptions repository={repository(genericContentItems) as any} />)
    })
    expect(wrapper.update().find('li').exists()).toBeTruthy()
    expect(wrapper.find('li').length).toBe(4)
  })
})
