import Input from '@material-ui/core/Input'
import Typography from '@material-ui/core/Typography'
import { sleepAsync } from '@sensenet/client-utils'
import { Image } from '@sensenet/default-content-types'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { errorMessages, FileUpload, isTextBinaryFieldValue } from '../src/fieldcontrols/file-upload'

jest.mock('react-monaco-editor', () => {
  const React = require('react')

  return jest.fn((props) =>
    React.createElement(
      'div',
      {
        'data-test': 'mock-monaco-editor',
        'data-language': props.language,
        onDoubleClick: () => props.onChange(props.value),
        onClick: () => props.onChange('<ChangedContentType />'),
      },
      props.value,
    ),
  )
})

const defaultSettings = {
  Name: 'Binary',
  FieldClassName: 'SenseNet.ContentRepository.Fields.BinaryField',
  DisplayName: 'Binary',
  Description: 'The binary content of the document.',
  Type: 'BinaryFieldSetting',
}

const fileContent: Image = {
  Id: 3777,
  Path: '/Root/Sites/Default_Site/infos/images/approving_enabled.png',
  Name: 'approving_enabled.png',
  DisplayName: 'approving_enabled.png',
  Type: 'Image',
  Icon: 'image',
}

const repository = {
  load: jest.fn(() => {
    return { d: { Binary: { FileName: { FullFileName: 'approving_enabled.png' } } } }
  }),
  upload: {
    file: jest.fn(),
  },
  fetch: jest.fn(() =>
    Promise.resolve({
      ok: true,
      text: () => Promise.resolve('<ContentType />'),
    }),
  ),
  configuration: {
    repositoryUrl: 'https://example.com',
    token: 'token',
  },
} as any
describe('File upload field control', () => {
  it('should throw error when no repository is provided', () => {
    // Don't show console errors when tests runs
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
    mount(<FileUpload settings={defaultSettings} />)
    expect(consoleSpy).toBeCalledWith(errorMessages.repository)
    // Restore console.errors
    jest.restoreAllMocks()
  })

  it('should throw error when no content is provided', () => {
    // Don't show console errors when tests runs
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
    mount(<FileUpload settings={defaultSettings} actionName="browse" repository={repository} />)
    expect(consoleSpy).toBeCalledWith(errorMessages.contentToFetch)
    // Restore console.errors
    jest.restoreAllMocks()
  })

  it('should show the file name of the content in browse view', async () => {
    let wrapper: any
    await act(async () => {
      wrapper = mount(<FileUpload settings={defaultSettings} repository={repository} content={fileContent} />)
    })
    expect(wrapper.update().find(Typography).first().text()).toBe(defaultSettings.DisplayName)
  })

  it('should handle uploads from input', async () => {
    const fieldOnChange = jest.fn()
    const wrapper = shallow(
      <FileUpload
        actionName="edit"
        settings={defaultSettings}
        fieldOnChange={fieldOnChange}
        repository={repository}
        content={fileContent}
      />,
    )

    wrapper.find(Input).simulate('change', { target: { files: [], value: 'somePath' }, persist: jest.fn() })
    await sleepAsync(0)
    expect(repository.upload.file).toBeCalled()
  })

  it('should show monaco editor and download button for text binary fields in edit view', async () => {
    const fieldOnChange = jest.fn()
    const value = {
      __mediaresource: {
        content_type: 'text/xml',
        media_src: '/binaryhandler.ashx?nodeid=3777&propertyname=Binary&',
      },
    }
    let wrapper: any

    await act(async () => {
      wrapper = mount(
        <FileUpload
          actionName="edit"
          fieldValue={value as any}
          settings={{ ...defaultSettings, IsText: true }}
          repository={repository}
          content={fileContent}
          fieldOnChange={fieldOnChange}
        />,
      )
    })

    expect(wrapper.update().find("[data-test='mock-monaco-editor']").exists()).toBe(true)
    expect(wrapper.find("[data-test='download-button']").exists()).toBe(true)
    expect(wrapper.find("[data-test='binary-text-editor']").prop('style')).toMatchObject({ height: 420 })
    expect(wrapper.find("[data-test='binary-text-editor-resize-handle']").exists()).toBe(true)

    wrapper.find("[data-test='mock-monaco-editor']").simulate('doubleClick')

    const unchangedValue = fieldOnChange.mock.calls[0][1]

    expect(fieldOnChange.mock.calls[0][0]).toBe(defaultSettings.Name)
    expect(isTextBinaryFieldValue(unchangedValue)).toBe(true)
    expect(unchangedValue.text).toBe('<ContentType />')
    expect(unchangedValue.isModified).toBe(false)
    expect(wrapper.update().find("[data-test='binary-text-modified-indicator']").exists()).toBe(false)

    const preventDefault = jest.fn()

    await act(async () => {
      wrapper.find("[data-test='binary-text-editor-resize-handle']").simulate('keydown', {
        key: 'ArrowDown',
        preventDefault,
      })
      await sleepAsync(0)
    })

    expect(preventDefault).toBeCalled()
    expect(wrapper.update().find("[data-test='binary-text-editor']").prop('style')).toMatchObject({ height: 460 })

    wrapper.find("[data-test='mock-monaco-editor']").simulate('click')

    const changedValue = fieldOnChange.mock.calls[1][1]

    expect(fieldOnChange.mock.calls[1][0]).toBe(defaultSettings.Name)
    expect(isTextBinaryFieldValue(changedValue)).toBe(true)
    expect(changedValue.text).toBe('<ChangedContentType />')
    expect(changedValue.isModified).toBe(true)
    expect(wrapper.update().find("[data-test='binary-text-modified-indicator']").text()).toBe(
      defaultLocalization.fileUpload.modifiedStatus,
    )
  })

  it('should throw error when no content is provided in upload', async () => {
    // Don't show console errors when tests runs
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
    const wrapper = shallow(<FileUpload actionName="edit" settings={defaultSettings} repository={repository} />)
    wrapper.find(Input).simulate('change', { target: { files: [], value: 'somePath' }, persist: jest.fn() })
    await sleepAsync(0)
    expect(consoleSpy).toBeCalledWith(errorMessages.contentToUpload)
    // Restore console.errors
    jest.restoreAllMocks()
  })

  it('should throw error when no repository is provided in upload', async () => {
    // Don't show console errors when tests runs
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
    const wrapper = shallow(<FileUpload actionName="edit" settings={defaultSettings} />)
    wrapper.find(Input).simulate('change', { target: { files: [], value: 'somePath' }, persist: jest.fn() })
    await sleepAsync(0)
    expect(consoleSpy).toBeCalledWith(errorMessages.repository)
    /// Restore console.errors
    jest.restoreAllMocks()
  })
  it('should click on download button', async () => {
    const value = {
      __mediaresource: {
        content_type: 'image/png',
        media_src: '/binaryhandler.ashx?nodeid=3777&propertyname=Binary&',
      },
    }

    const consoleSpy = jest.spyOn(console, 'error')
    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <FileUpload
          actionName="browse"
          fieldValue={value as any}
          settings={defaultSettings}
          repository={repository}
          content={fileContent}
        />,
      )
    })

    wrapper.find("[data-test='download-button']").last().simulate('click')

    expect(consoleSpy).toBeCalledTimes(0)
    /// Restore console.errors
    jest.restoreAllMocks()
  })
})
