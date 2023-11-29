import { ActionName } from '@sensenet/control-mapper'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { defaultLocalization, HtmlEditor } from '../src/fieldcontrols'

jest.mock('react-monaco-editor', () =>
  jest.fn((props) => {
    console.log(props)
    return (
      <div data-test="mock-monaco-editor" onChange={props.fieldOnChange} ref={props.editorRef}>
        {props.value}
      </div>
    )
  }),
)

describe('Html Editor', () => {
  it('should display the content', async () => {
    const onChange = jest.fn()
    const props = {
      actionName: 'edit' as ActionName,
      settings: {
        Name: 'test',
        DisplayName: 'Test',
        Description: 'Test',
        Compulsory: false,
        ReadOnly: false,
        DefaultValue: 'Test',
        Type: 'LongTextField',
        FieldClassName: 'SenseNet.ContentRepository.Fields.LongTextField',
      },
      localization: defaultLocalization,
      fieldValue: '<p>Test</p>',
      fieldOnChange: onChange,
    }

    const wrapper = mount(<HtmlEditor {...props} />)

    wrapper.update()

    const htmlEditorContainer = wrapper!.find('[data-test="html-editor-container"]')

    expect(htmlEditorContainer.text()).toBe('<p>Test</p>')

    const mockMonacoEditor = wrapper.find('[data-test="mock-monaco-editor"]')

    await act(async () => {
      mockMonacoEditor.prop('onChange')?.('<p>Changed Test</p>' as any)
    })

    //should be called with onChange

    expect(props.fieldOnChange).toBeCalledWith('<p>Changed Test</p>')
  })
})
