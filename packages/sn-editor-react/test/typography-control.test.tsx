import { Select, Tooltip } from '@material-ui/core'
import { Editor as TiptapEditor } from '@tiptap/react'
import { shallow } from 'enzyme'
import React from 'react'
import { TypographyControl } from '../src/components/controls'
import { defaultLocalization } from '../src/context'
import { createExtensions } from '../src/extension-list'

describe('typography control', () => {
  const editor = new TiptapEditor({
    content: '<h6>Hello</h6><p>world</p>',
    extensions: createExtensions(),
  })

  it('should be rendered properly', () => {
    const options = [
      defaultLocalization.typographyControl.paragraph,
      ...Array.from(Array(6).keys()).map((index) => `${defaultLocalization.typographyControl.heading} ${index + 1}`),
    ]
    const wrapper = shallow(<TypographyControl editor={editor} />)
    wrapper
      .find(Select)
      .children()
      .forEach((currentOption, index) => {
        expect(currentOption.text()).toBe(options[index])
      })
    expect(wrapper.find(Tooltip).prop('title')).toBe(defaultLocalization.menubar.typography)
  })

  it('should handle input', () => {
    editor.commands.setTextSelection(2)

    const wrapper = shallow(<TypographyControl editor={editor} />)
    expect(wrapper.find(Select).prop('value')).toBe(6)
  })
})
