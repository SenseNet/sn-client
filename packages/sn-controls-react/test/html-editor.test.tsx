import { ActionName } from '@sensenet/control-mapper'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { defaultLocalization, HtmlEditor } from '../src/fieldcontrols'

jest.mock('react-monaco-editor', () =>
  jest.fn((props) => {
    return <div data-test="mock-monaco-editor">{props.value}</div>
  }),
)

describe('Html Editor', () => {
  it('should display the content', async () => {
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
      fieldOnChange: jest.fn(),
    }

    let wrapper: ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>

    await act(async () => {
      wrapper = mount(<HtmlEditor {...props} />)
    })
    wrapper!.update()

    const htmlEditorContainer = wrapper!.find('[data-test="html-editor-container"]')

    expect(htmlEditorContainer.text()).toBe('<p>Test</p>')
  })
})
