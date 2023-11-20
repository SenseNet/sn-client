import { Button, Checkbox, IconButton, Link, ListItem, ListItemText, TextField } from '@material-ui/core'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { SearchPicker, SelectionList, TreePicker } from '../src'
import { Picker, PickerModes } from '../src/components/picker'
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

  const repositoryForPickerHelper = (loadCollectionValue?: unknown, loadValue?: unknown) => {}

  it('should render properly', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<Picker repository={repository(genericContentItems) as any} />)
    })

    expect(wrapper.update().find(ListItem).exists()).toBeTruthy()
    expect(wrapper.find(TextField).exists()).toBeTruthy()
    expect(wrapper.find(Button).length).toBe(2)
    expect(wrapper.find(ListItem).length).toBe(5)
  })

  it('should render disabled submit button when execution is in progress', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<Picker repository={repository() as any} isExecInProgress={true} />)
    })

    const submitButton = wrapper.update().find(Button).at(1)
    expect(submitButton.props().disabled).toBeTruthy()
  })

  it('should always activate submit button', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<Picker repository={repository(genericContentItems) as any} />)
    })
    expect(wrapper.update().find(Button).at(1).props().disabled).toBeFalsy()
  })

  it('should not selected line when click the selected ListItem', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<Picker repository={repository(genericContentItems) as any} />)
    })

    expect(wrapper.update().find(ListItem).exists()).toBeTruthy()
    await act(async () => wrapper.update().find(ListItem).at(0).simulate('click'))
    await act(async () => wrapper.update().find(ListItem).at(0).simulate('click'))
    expect(wrapper.update().find(ListItem).at(0).prop('selected')).toBeFalsy()
  })

  it('should render DisplayName of the currentParent props', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <Picker
          repository={repository(genericContentItems) as any}
          currentParent={{ Id: 1, Name: 'Test', Path: 'Content/Workspace', Type: 'Folder', DisplayName: 'test' }}
        />,
      )
    })
    await act(async () => wrapper.update().find(ListItem).at(0).simulate('click'))
    expect(wrapper.prop('currentParent').DisplayName).toBe('test')
  })

  it('texts of "Show selected" link and in submit button should render', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<Picker repository={repository(genericContentItems) as any} required={1} />)
    })

    wrapper.update()

    expect(wrapper.find(Button).at(1).text()).toContain('Submit')
    expect(wrapper.find("[data-test='show-selected-container'] button").text()).toContain('Show selected')
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

    act(() => wrapper.find("[data-test='show-selected-container'] button").prop('onClick')())
    wrapper.update()

    expect(wrapper.update().find(SelectionList).exists()).toBeTruthy()
  })

  it('should enter tree view mode after icon is clicked', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<Picker repository={repository(genericContentItems) as any} />)
    })

    // navigate to selection list from tree view
    act(() => wrapper.find("[data-test='show-selected-container'] button").prop('onClick')())

    wrapper.update()

    expect(wrapper.update().find(TreePicker).exists()).toBeFalsy()

    // navigate back to tree view
    await act(async () => {
      await wrapper.find(IconButton).prop('onClick')()
      wrapper.update()
    })

    expect(wrapper.update().find(TreePicker).exists()).toBeTruthy()
  })

  it('should selected line when click on ListItem', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <Picker
          treePickerMode={PickerModes.COPY_MOVE_TREE}
          repository={repository(genericContentItems) as any}
          currentParent={{ Id: 1, Name: 'Test', Path: 'Content/Workspace', Type: 'Folder', DisplayName: 'test' }}
        />,
      )
    })

    expect(wrapper.update().find(ListItem).exists()).toBeTruthy()
    await act(() => wrapper.find(ListItem).at(0).prop('onClick')())
    expect(wrapper.update().find(ListItem).at(0).prop('selected')).toBeTruthy()
  })

  it('should set destination name when select one listItem', async () => {
    let wrapper: any
    const setDestination = jest.fn()
    await act(async () => {
      wrapper = mount(
        <Picker
          repository={repository(genericContentItems) as any}
          currentParent={{ Id: 1, Name: 'Test', Path: 'Content/Workspace', Type: 'Folder', DisplayName: 'test' }}
          setDestination={setDestination}
          treePickerMode={PickerModes.COPY_MOVE_TREE}
        />,
      )
    })

    await act(async () => wrapper.update().find(ListItem).at(0).simulate('click'))
    expect(setDestination).toHaveBeenCalledTimes(1)
    expect(setDestination).toBeCalledWith(genericContentItems[0].DisplayName)
  })

  it('copy-move tree should render an error message when error', async () => {
    const errorRenderer = jest.fn(() => null)
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <Picker
          renderError={errorRenderer as any}
          repository={
            {
              loadCollection: () => {
                throw new Error('error')
              },
            } as any
          }
          treePickerMode={PickerModes.COPY_MOVE_TREE}
        />,
      )
    })
    expect(wrapper.find(ListItem).exists()).toBeFalsy()
    expect(errorRenderer).toBeCalled()
  })

  it('copy-move tree should call renderLoading when loading is true', async () => {
    const loadingRenderer = jest.fn(() => null)
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <TreePicker
          renderLoading={loadingRenderer as any}
          repository={repository() as any}
          treePickerMode={PickerModes.COPY_MOVE_TREE}
        />,
      )
    })
    expect(wrapper.find(ListItem).exists()).toBeFalsy()
    expect(loadingRenderer).toBeCalled()
  })

  it('should set destination name when unselect one listItem', async () => {
    let wrapper: any
    const setDestination = jest.fn()
    await act(async () => {
      wrapper = mount(
        <Picker
          treePickerMode={PickerModes.COPY_MOVE_TREE}
          repository={repository(genericContentItems) as any}
          setDestination={setDestination}
        />,
      )
    })

    await act(async () => wrapper.update().find(ListItem).at(0).simulate('click'))
    await act(async () => wrapper.update().find(ListItem).at(0).simulate('click'))
    expect(setDestination).toHaveBeenCalledTimes(2)
  })

  it('should set default selection after navigate in to folder and re-select same listItems', async () => {
    let wrapper: any
    const setDestination = jest.fn()
    await act(async () => {
      wrapper = mount(
        <Picker
          repository={repository(genericContentItems) as any}
          currentParent={{ Id: 1, Name: 'Test', Path: 'Content/Workspace', Type: 'Folder', DisplayName: 'test' }}
          setDestination={setDestination}
          treePickerMode={PickerModes.COPY_MOVE_TREE}
        />,
      )
    })

    await act(async () => wrapper.update().find(ListItem).at(0).simulate('dblclick'))
    await act(async () => wrapper.update().find(ListItem).at(1).simulate('click'))
    await act(async () => wrapper.update().find(ListItem).at(1).simulate('click'))

    expect(setDestination).toHaveBeenCalledTimes(3)
  })

  it('should set default selection after navigate in to not folder and re-select same listItems', async () => {
    let wrapper: any
    const setDestination = jest.fn()
    await act(async () => {
      wrapper = mount(
        <Picker
          repository={repository(genericContentItems) as any}
          currentParent={{ Id: 1, Name: 'Test', Path: 'Content/Workspace', Type: 'Folder', DisplayName: 'test' }}
          setDestination={setDestination}
          treePickerMode={PickerModes.COPY_MOVE_TREE}
        />,
      )
    })

    await act(async () => wrapper.update().find(ListItem).at(4).simulate('dblclick'))
    await act(async () => wrapper.update().find(ListItem).at(4).simulate('click'))
    await act(async () => wrapper.update().find(ListItem).at(4).simulate('click'))

    expect(setDestination).toHaveBeenCalledTimes(2)
  })

  it('texts of "Show selected" link and in submit button should contain the count of selected items', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<Picker repository={repository(genericContentItems) as any} required={1} />)
    })

    expect(wrapper.update().find("[data-test='show-selected-container'] button").text()).toContain('(0)')

    await act(
      async () =>
        await wrapper.find(ListItem).at(1).find(Checkbox).prop('onChange')({ target: { checked: true } } as any, true),
    )

    expect(wrapper.update().find("[data-test='show-selected-container'] button").text()).toContain('(1)')
  })

  it('After doubleclick a checkbox, list item should not be selected', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<Picker repository={repository(genericContentItems) as any} required={1} />)
    })

    expect(wrapper.update().find("[data-test='show-selected-container'] button").text()).toContain('(0)')

    await act(async () => await wrapper.find(ListItem).at(1).find(Checkbox).simulate('dblclick'))

    expect(wrapper.update().find("[data-test='show-selected-container'] button").text()).toContain('(0)')
  })

  it('should allow multiple selection', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<Picker repository={repository(genericContentItems) as any} allowMultiple={true} />)
    })

    expect(wrapper.update().find("[data-test='show-selected-container'] button").text()).toContain('(0)')

    await act(async () => {
      await wrapper.update().find(ListItem).at(1).find(Checkbox).prop('onChange')(
        { target: { checked: true } } as any,
        true,
      )
      await wrapper.update().find(ListItem).at(4).find(Checkbox).prop('onChange')(
        { target: { checked: true } } as any,
        true,
      )
    })

    expect(wrapper.update().find("[data-test='show-selected-container'] button").text()).toContain('(2)')
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
          '(Name:\'*workspace*\' OR DisplayName:\'*workspace*\' .AUTOFILTERS:OFF) AND (InTree:"/Root/Content" OR InTree:"/Root/IMS/Public")',
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

  it('should render helper Current Conten based on SelectionRoot', async () => {
    let helperItems = { Id: 1, Name: 'Item1', DisplayName: 'Display Item1', Path: '/Root/Content/EN/Blog/Posts' }

    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <Picker
          selectionRoots={['/Root/Content/EN/Blog/Posts']}
          contextPath="/Root/Content/EN/Blog/Posts"
          repository={repository(genericContentItems, helperItems) as any}
        />,
      )
    })

    wrapper.update()

    //data-test current-content should be rendered

    expect(
      wrapper
        .find(Link)
        .filterWhere((n: { prop: (arg0: string) => string }) => n.prop('data-test') === 'current-content')
        .exists(),
    ).toBeTruthy()

    helperItems = { Id: 1, Name: 'Item1', DisplayName: 'Display Item1', Path: '/Root/Content/HU/Blog/Posts' }

    await act(async () => {
      wrapper = mount(
        <Picker
          selectionRoots={['/Root/Content/HU/Blog/Posts']}
          contextPath="/Root/Content/EN/Blog/Posts"
          repository={repository(genericContentItems, helperItems) as any}
        />,
      )
    })

    wrapper.update()

    expect(
      wrapper
        .find(Link)
        .filterWhere((n: { prop: (arg0: string) => string }) => n.prop('data-test') === 'current-content')
        .exists(),
    ).toBeFalsy()
  })

  it('Should render Selection Roots', async () => {
    let wrapper: any

    // helper items should be rendered

    const helperItems = {
      '/Root/Content/EN/Blog/Posts': {
        Id: 1,
        Name: 'Item1',
        DisplayName: 'Display Item1',
        Path: '/Root/Content/EN/Blog/Posts',
      },
      '/Root/Content/HU/Blog/Posts': {
        Id: 1,
        Name: 'Item1',
        DisplayName: 'Display Item1',
        Path: '/Root/Content/HU/Blog/Posts',
      },
    }

    const repositoryHandle = (loadCollectionValue?: unknown) => {
      return {
        loadCollection: () => {
          return {
            d: {
              results: loadCollectionValue,
            },
          }
        },
        load: (item: { idOrPath: string | number }) => {
          return {
            d: helperItems[item.idOrPath],
          }
        },
      }
    }

    await act(async () => {
      wrapper = mount(
        <Picker
          selectionRoots={['/Root/Content/HU/Blog/Posts']}
          contextPath="/Root/Content/EN/Blog/Posts"
          repository={repositoryHandle(genericContentItems) as any}
        />,
      )
    })

    wrapper.update()

    expect(
      wrapper
        .find(Link)
        .filterWhere(
          (n: { prop: (arg0: string) => string }) =>
            n.prop('data-test') === `path-helper-${helperItems['/Root/Content/HU/Blog/Posts'].Path}`,
        )
        .exists(),
    ).toBeTruthy()

    //click on a helper item

    //test current helper items

    await act(async () => {
      wrapper
        .find(Link)
        .filterWhere(
          (n: { prop: (arg0: string) => string }) =>
            n.prop('data-test') === `path-helper-${helperItems['/Root/Content/HU/Blog/Posts'].Path}`,
        )
        .simulate('click')
    })

    wrapper.update()

    expect(
      wrapper
        .find(Link)
        .filterWhere(
          (n: { prop: (arg0: string) => string }) =>
            n.prop('data-test') === `path-helper-${helperItems['/Root/Content/HU/Blog/Posts'].Path}`,
        )
        .exists(),
    ).toBeTruthy()
  })
})
