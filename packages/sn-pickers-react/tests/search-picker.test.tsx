import { Checkbox, ListItem, Typography } from '@material-ui/core'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { SearchPicker } from '../src'
import { SelectionProvider } from '../src/context/selection'
import { genericContentItems } from './mocks/items'

describe('Search picker component', () => {
  it('should handle selection on input change', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <SelectionProvider allowMultiple={false}>
          <SearchPicker items={genericContentItems} repository={{} as any} />
        </SelectionProvider>,
      )
    })

    await act(async () => {
      await wrapper.find(ListItem).at(1).find(Checkbox).prop('onChange')({ target: { checked: true } })
      wrapper.update()
    })

    await act(async () => {
      await wrapper.find(ListItem).at(2).find(Checkbox).prop('onChange')({ target: { checked: true } })
      wrapper.update()
    })

    expect(wrapper.findWhere((node) => node.name() === 'input' && node.prop('checked') === true)).toHaveLength(1)
  })

  it('should handle selection on click', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <SelectionProvider allowMultiple={false}>
          <SearchPicker items={genericContentItems} repository={{} as any} />
        </SelectionProvider>,
      )
    })

    await act(async () => {
      await wrapper.find(ListItem).at(3).simulate('click')
      wrapper.update()
    })

    expect(wrapper.findWhere((node) => node.name() === 'input' && node.prop('checked') === true)).toHaveLength(1)

    //Double click should not change the selection

    await act(async () => {
      await wrapper.find(ListItem).at(3).simulate('dblclick')
      wrapper.update()
    })

    expect(wrapper.findWhere((node) => node.name() === 'input' && node.prop('checked') === true)).toHaveLength(1)

    //parent Double Click should not change the selection

    await act(async () => {
      await wrapper.find(ListItem).at(3).closest("[data-testid='search-list-item-container']").simulate('dblclick')
      wrapper.update()
    })

    expect(wrapper.findWhere((node) => node.name() === 'input' && node.prop('checked') === true)).toHaveLength(1)
  })

  it('should handle multiple selection', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <SelectionProvider allowMultiple={true}>
          <SearchPicker items={genericContentItems} repository={{} as any} />
        </SelectionProvider>,
      )
    })

    await act(async () => {
      await wrapper.find(ListItem).at(1).find(Checkbox).prop('onChange')({ target: { checked: true } })
      wrapper.update()
    })

    await act(async () => {
      await wrapper.find(ListItem).at(2).find(Checkbox).prop('onChange')({ target: { checked: true } })
      wrapper.update()
    })

    expect(wrapper.findWhere((node) => node.name() === 'input' && node.prop('checked') === true)).toHaveLength(2)
  })

  it('should not render checkbox before blacklisted content', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <SearchPicker items={genericContentItems} repository={{} as any} selectionBlacklist={['path1']} />,
      )
    })

    expect(wrapper.find(ListItem).first().find(Checkbox).exists()).toBeFalsy()
  })

  it('should render an error message when error', async () => {
    const errorMessage = 'Internal server error'
    let wrapper: any
    await act(async () => {
      wrapper = mount(<SearchPicker items={genericContentItems} error={errorMessage} repository={{} as any} />)
    })

    expect(wrapper.find(Typography).text()).toEqual(errorMessage)
  })
})
