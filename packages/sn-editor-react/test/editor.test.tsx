import { EditorContent } from '@tiptap/react'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Editor } from '../src/components/editor'
import { MenuBar } from '../src/components/menu-bar'

describe('editor', () => {
  it('should render properly', () => {
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

  it('should render placeholder if no content passed', () => {
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
})
