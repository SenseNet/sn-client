import { Button, Dialog, DialogTitle, IconButton, Tooltip } from '@material-ui/core'
import { setImmediate } from 'timers'
import { Editor as TiptapEditor } from '@tiptap/react'
import { shallow } from 'enzyme'
import React from 'react'
import { ImageControl } from '../src/components/controls'
import { defaultLocalization } from '../src/context'
import { createExtensions } from '../src/extension-list'
import { FileReaderMock } from './__mocks__/file-reader'

describe('image control', () => {
  const onChange = jest.fn(({ editor }) => editor.getHTML())
  const editor = new TiptapEditor({
    content: '<p>Hello world</p>',
    extensions: createExtensions(),
    onUpdate: onChange,
  })

  const fileReader = new FileReaderMock()
  jest.spyOn(window, 'FileReader').mockImplementation(() => fileReader)

  it('should be rendered properly', () => {
    const wrapper = shallow(<ImageControl editor={editor} />)
    expect(wrapper.find(Tooltip).prop('title')).toBe(defaultLocalization.imageControl.title)
    expect(wrapper.find(IconButton).exists()).toBeTruthy()
  })

  it('should open dialog on button click', () => {
    const wrapper = shallow(<ImageControl editor={editor} />)
    expect(wrapper.find(Dialog).prop('open')).toBe(false)
    wrapper.find('input').simulate('change', { target: { files: [], value: 'somePath' }, persist: jest.fn() })
    expect(wrapper.find(Dialog).prop('open')).toBe(true)
    expect(wrapper.find(DialogTitle).text()).toBe(defaultLocalization.imageControl.title)
  })

  it('should insert the image', (done) => {
    fileReader.result = 'imagecontent'

    const wrapper = shallow(<ImageControl editor={editor} />)
    wrapper.find('input').simulate('change', {
      target: { files: [new File([new ArrayBuffer(1)], 'file.jpg')], value: 'somePath' },
      persist: jest.fn(),
    })

    fileReader.onload({ target: { result: fileReader.result } })

    setImmediate(() => {
      wrapper.update()

      expect(wrapper.find('img')).toHaveLength(1)
      expect(wrapper.find('img').prop('src')).toBe(fileReader.result)

      wrapper
        .findWhere((node) => {
          return node.type() === Button && node.text() === defaultLocalization.imageControl.submit
        })
        .simulate('click')

      expect(onChange).toReturnWith('<p></p><figure><img src="imagecontent"></figure><p>Hello world</p>')

      done()
    })
  })
})
