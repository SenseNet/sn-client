import { Checkbox, ListItem } from '@material-ui/core'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { SelectionList } from '../src'
import { SelectionProvider } from '../src/context/selection'
import { genericContentItems } from './mocks/items'

describe('Selection list component', () => {
  it('should handle deselection', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <SelectionProvider allowMultiple={true} defaultValue={genericContentItems}>
          <SelectionList repository={{} as any} />
        </SelectionProvider>,
      )
    })

    await act(async () => {
      await wrapper.find(ListItem).at(1).find(Checkbox).prop('onChange')({ target: { checked: false } })
      wrapper.update()
    })

    expect(wrapper.findWhere((node) => node.name() === 'input' && node.prop('checked') === true)).toHaveLength(
      genericContentItems.length - 1,
    )
  })
})
