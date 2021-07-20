import { MenuItem } from '@material-ui/core'
import { EditorContent } from '@tiptap/react'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { ContextMenu } from '../src/components/context-menu'
import { Editor } from '../src/components/editor'
import { MenuBar } from '../src/components/menu-bar'
import { defaultLocalization } from '../src/context'

describe('editor', () => {
  it('should be rendered properly', () => {
    const wrapper = shallow(<Editor />)
    expect(wrapper.find(MenuBar).exists()).toBeTruthy()
    expect(wrapper.find(EditorContent).exists()).toBeTruthy()
  })

  it('should set all the props', () => {
    const value = '<p>Hello World</p>'
    const wrapper = mount(<Editor content={value} autofocus={true} readOnly={true} />)

    const { options } = wrapper.find(EditorContent).prop('editor')
    expect(options.content).toBe(value)
    expect(options.editable).toBe(false)
    expect(options.autofocus).toBe(true)
  })

  it('should render placeholder if no content is passed', () => {
    const placeholder = 'Placeholder'
    const wrapper = mount(<Editor placeholder={placeholder} />)

    const placeholderExtension = wrapper
      .find(EditorContent)
      .prop('editor')
      .options.extensions.find((extension) => extension.name === 'placeholder')

    expect(placeholderExtension.options.placeholder).toBe(placeholder)
  })

  it('should call onChange when content updates', () => {
    const value = '<p>Hello World</p>'
    const onChange = jest.fn()
    const wrapper = mount(<Editor content={value} onChange={onChange} />)

    act(() => {
      wrapper.find(EditorContent).prop('editor').commands.setContent('<p>New value</p>', true)
    })

    expect(onChange).toBeCalled()
  })

  it('should open context menu on right click inside a table and execute action on MenuItem click', () => {
    const onChange = jest.fn(({ editor }) => editor.getHTML())
    const value =
      '<table><tbody><tr><th colspan="1" rowspan="1"><p></p></th><th colspan="1" rowspan="1"><p></p></th></tr><tr><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td></tr></tbody></table>'
    const wrapper = mount(<Editor content={value} autofocus={true} onChange={onChange} />)

    expect(wrapper.find(ContextMenu).prop('open')).toBe(false)

    act(() => {
      wrapper.find(EditorContent).simulate('contextmenu')
    })
    wrapper.update()

    expect(wrapper.find(ContextMenu).prop('open')).toBe(true)

    wrapper
      .find(ContextMenu)
      .findWhere((node) => {
        return node.type() === MenuItem && node.text() === defaultLocalization.contextMenu.deleteTable
      })
      .simulate('click')

    expect(onChange).toReturnWith('<p></p>')
    expect(wrapper.find(ContextMenu).prop('open')).toBe(false)
  })
})
