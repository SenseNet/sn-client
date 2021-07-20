import { Button, Dialog, DialogTitle, FormControlLabel, IconButton, TextField, Tooltip } from '@material-ui/core'
import { Editor as TiptapEditor } from '@tiptap/react'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { TableControl } from '../src/components/controls'
import { defaultLocalization } from '../src/context'
import { createExtensions } from '../src/extension-list'

describe('table control', () => {
  const onChange = jest.fn(({ editor }) => editor.getHTML())
  const editor = new TiptapEditor({
    extensions: createExtensions(),
    onUpdate: onChange,
  })

  it('should be rendered properly', () => {
    const wrapper = shallow(<TableControl editor={editor} />)
    expect(wrapper.find(Tooltip).prop('title')).toBe(defaultLocalization.menubar.table)
    expect(wrapper.find(IconButton).exists()).toBeTruthy()
  })

  it('should open dialog on button click', () => {
    const wrapper = shallow(<TableControl editor={editor} />)
    expect(wrapper.find(Dialog).prop('open')).toBe(false)
    wrapper.find(IconButton).simulate('click')
    expect(wrapper.find(Dialog).prop('open')).toBe(true)
    expect(wrapper.find(DialogTitle).text()).toBe(defaultLocalization.tableControl.title)
  })

  it('should close dialog on cancel button click', () => {
    const wrapper = shallow(<TableControl editor={editor} />)
    wrapper.find(IconButton).simulate('click')
    expect(wrapper.find(Dialog).prop('open')).toBe(true)

    wrapper
      .findWhere((node) => {
        return node.type() === Button && node.text() === defaultLocalization.common.cancel
      })
      .simulate('click')

    expect(wrapper.find(Dialog).prop('open')).toBe(false)
  })

  it('should insert a table', () => {
    const wrapper = mount(<TableControl editor={editor} />)
    expect(wrapper.find(IconButton).simulate('click'))
    wrapper.find(TextField).forEach((field) => field.find('input').simulate('change', { target: { value: 3 } }))

    wrapper
      .findWhere((node) => {
        return node.type() === Button && node.text() === defaultLocalization.tableControl.submit
      })
      .simulate('click')

    expect(onChange).toReturnWith(
      '<table><tbody><tr><th colspan="1" rowspan="1"><p></p></th><th colspan="1" rowspan="1"><p></p></th><th colspan="1" rowspan="1"><p></p></th></tr><tr><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td></tr><tr><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td></tr></tbody></table>',
    )
  })

  it('should insert a table without header', () => {
    editor.commands.setContent('')

    const wrapper = mount(<TableControl editor={editor} />)
    expect(wrapper.find(IconButton).simulate('click'))
    wrapper.find(TextField).forEach((field) => field.find('input').simulate('change', { target: { value: 3 } }))

    act(() => {
      wrapper
        .find(FormControlLabel)
        .prop('control')
        .props.onChange({ target: { checked: false }, persist: jest.fn() })
    })

    wrapper
      .findWhere((node) => {
        return node.type() === Button && node.text() === defaultLocalization.tableControl.submit
      })
      .simulate('click')

    expect(onChange).toReturnWith(
      '<table><tbody><tr><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td></tr><tr><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td></tr><tr><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td></tr></tbody></table>',
    )
  })
})
