import { Button, Dialog, DialogTitle, FormControlLabel, IconButton, TextField, Tooltip } from '@material-ui/core'
import { Editor as TiptapEditor } from '@tiptap/react'
import { shallow } from 'enzyme'
import React from 'react'
import { LinkControl } from '../src/components/controls'
import { defaultLocalization } from '../src/context'
import { createExtensions } from '../src/extension-list'

describe('link control', () => {
  const onChange = jest.fn(({ editor }) => editor.getHTML())
  const editor = new TiptapEditor({
    content: '<p>Hello world</p>',
    extensions: createExtensions(),
    onUpdate: onChange,
  })

  it('should render properly', () => {
    const wrapper = shallow(<LinkControl editor={editor} />)
    expect(wrapper.find(Tooltip).prop('title')).toBe(defaultLocalization.menubar.link)
    expect(wrapper.find(IconButton).exists()).toBeTruthy()
  })

  it('should open dialog on button click', () => {
    editor.commands.setTextSelection({ from: 0, to: 6 })

    const wrapper = shallow(<LinkControl editor={editor} />)
    expect(wrapper.find(Dialog).prop('open')).toBe(false)
    expect(wrapper.find(IconButton).simulate('click'))
    expect(wrapper.find(Dialog).prop('open')).toBe(true)
    expect(wrapper.find(DialogTitle).text()).toBe(defaultLocalization.linkControl.title)
  })

  it('should add a link to the selected text', () => {
    editor.commands.setTextSelection({ from: 0, to: 6 })

    const wrapper = shallow(<LinkControl editor={editor} />)
    expect(wrapper.find(IconButton).simulate('click'))
    wrapper.find(TextField).simulate('change', { target: { value: 'https://sensenet.com' } })
    wrapper
      .find(FormControlLabel)
      .prop('control')
      .props.onChange({ target: { checked: true }, persist: jest.fn() })
    wrapper
      .findWhere((node) => {
        return node.type() === Button && node.text() === defaultLocalization.linkControl.submit
      })
      .simulate('click')

    expect(onChange).toReturnWith(
      '<p><a target="_blank" rel="noopener noreferrer nofollow" href="https://sensenet.com">Hello</a> world</p>',
    )
  })
})
