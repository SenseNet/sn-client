import { Button, Checkbox, IconButton, Link, ListItem, ListItemText, TextField } from '@material-ui/core'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { SearchPicker, SelectionList, TreePicker } from '../src'
import { Picker } from '../src/components/picker'
import { genericContentItems } from './mocks/items'

describe('Picker component', () => {
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

  it('should render properly', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<Picker repository={repository(genericContentItems) as any} />)
    })

    expect(wrapper.update().find(ListItem).exists()).toBeTruthy()
    expect(wrapper.find(TextField).exists()).toBeTruthy()
    expect(wrapper.find(Button).length).toBe(2)
    expect(wrapper.find(ListItem).length).toBe(4)
  })

  it('should render disabled submit button when execution is in progress', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<Picker repository={repository() as any} isExecInProgress={true} />)
    })

    const submitButton = wrapper.update().find(Button).at(1)
    expect(submitButton.props().disabled).toBeTruthy()
  })

  it('texts of "Show selected" link and in submit button should contain the count of selected items', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<Picker repository={repository(genericContentItems) as any} required={1} />)
    })

    wrapper.update()

    expect(wrapper.find(Button).at(1).text()).toContain('Submit')
    expect(wrapper.find(Link).text()).toContain('Show selected')
  })

  it('should handle submit', async () => {
    const onSubmit = jest.fn()
    let wrapper: any
    await act(async () => {
      wrapper = mount(<Picker repository={repository(genericContentItems) as any} handleSubmit={onSubmit} />)
    })

    await act(async () => wrapper.find(Button).at(1).simulate('click'))

    expect(onSubmit).toBeCalled()
  })

  it('should handle cancellation', async () => {
    const onCancel = jest.fn()
    let wrapper: any
    await act(async () => {
      wrapper = mount(<Picker repository={repository(genericContentItems) as any} handleCancel={onCancel} />)
    })

    await act(async () => wrapper.find(Button).at(0).simulate('click'))

    expect(onCancel).toBeCalled()
  })

  it('should enter selection view mode after link is clicked', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<Picker repository={repository(genericContentItems) as any} />)
    })

    expect(wrapper.update().find(SelectionList).exists()).toBeFalsy()

    await act(async () => wrapper.find(Link).prop('onClick')())
    wrapper.update()

    expect(wrapper.update().find(SelectionList).exists()).toBeTruthy()
  })

  it('should enter tree view mode after icon is clicked', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<Picker repository={repository(genericContentItems) as any} />)
    })

    // navigate to selection list from tree view
    await act(async () => wrapper.find(Link).prop('onClick')())

    wrapper.update()

    expect(wrapper.update().find(TreePicker).exists()).toBeFalsy()

    // navigate back to tree view
    await act(async () => {
      await wrapper.find(IconButton).prop('onClick')()
      wrapper.update()
    })

    expect(wrapper.update().find(TreePicker).exists()).toBeTruthy()
  })

  it('should enter search mode after input getting focus', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<Picker repository={repository(genericContentItems) as any} />)
    })

    expect(wrapper.update().find(SearchPicker).exists()).toBeFalsy()

    act(() => wrapper.find(TextField).prop('onFocus')())
    wrapper.update()

    expect(wrapper.update().find(SearchPicker).exists()).toBeTruthy()
  })

  it('should refresh the results after search', async () => {
    jest.useFakeTimers('legacy')

    let wrapper: any
    const repositoryInstance = repository(genericContentItems)
    await act(async () => {
      wrapper = mount(<Picker repository={repositoryInstance as any} selectionRoots={['/Root/Content']} />)
    })

    await act(async () => {
      const searchField = wrapper.find(TextField)
      searchField.prop('onFocus')()

      repositoryInstance.loadCollection = () => ({
        d: {
          results: [
            {
              Id: 10,
              Type: 'Folder',
              Path: 'path',
              Name: 'SampleWorkspace',
              DisplayName: 'Sample Workspace',
            },
          ],
        },
      })

      await searchField.prop('onChange')({ target: { value: 'workspace' } })
      jest.advanceTimersByTime(250)
    })

    wrapper.update()

    expect(wrapper.find(ListItem).length).toBe(1)
    expect(wrapper.find(ListItemText).prop('primary')).toBe('Sample Workspace')
  })

  it('should search inside SelectionRoots', async () => {
    jest.useFakeTimers('legacy')

    let wrapper: any
    const loadCollection = jest.fn()
    await act(async () => {
      wrapper = mount(
        <Picker repository={{ loadCollection } as any} selectionRoots={['/Root/Content', '/Root/IMS/Public']} />,
      )
    })

    await act(async () => {
      const searchField = wrapper.find(TextField)
      searchField.prop('onFocus')()

      await searchField.prop('onChange')({ target: { value: 'workspace' } })
      jest.advanceTimersByTime(250)

      expect(loadCollection.mock.calls[1][0].oDataOptions).toEqual({
        query:
          '(Name:\'*workspace*\' OR DisplayName:\'*workspace*\') AND (InTree:"/Root/Content" OR InTree:"/Root/IMS/Public")',
      })
    })

    wrapper.update()
  })

  it('should handle distinct SelectionRoots', async () => {
    const loadCollection = () => ({
      d: {
        results: [
          {
            Id: 10,
            Type: 'Folder',
            Path: '/Root/Content',
            Name: 'SampleWorkspace',
            DisplayName: 'Sample Workspace',
          },
        ],
      },
    })
    const load = jest.fn()
    const onTreeNavigation = jest.fn()

    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <Picker
          currentPath="/Root/Content"
          repository={{ loadCollection, load } as any}
          selectionRoots={['/Root/Content', '/Root/IMS/Public', '/Root/Content/TestFolder']}
          onTreeNavigation={onTreeNavigation}
        />,
      )
    })

    wrapper.update()

    await act(async () => wrapper.update().find(ListItem).at(0).simulate('dblclick'))

    expect(onTreeNavigation).toHaveBeenCalledWith('!VirtualRoot!')

    expect(load).toHaveBeenCalledWith({ idOrPath: '/Root/Content', oDataOptions: undefined })
    expect(load).toHaveBeenCalledWith({
      idOrPath: '/Root/IMS/Public',
      oDataOptions: undefined,
    })
  })
})
