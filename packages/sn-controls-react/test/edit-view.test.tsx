import { IconButton } from '@material-ui/core'
import { Repository } from '@sensenet/client-core'
import { GenericContent, VersioningMode } from '@sensenet/default-content-types'
import { mount, ReactWrapper, shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import {
  AllowedChildTypes,
  AutoComplete,
  Avatar,
  Checkbox,
  CheckboxGroup,
  ColorPicker,
  DatePicker,
  DropDownList,
  EmptyFieldControl,
  FileName,
  Name,
  NumberField,
  Password,
  RadioButtonGroup,
  ReferenceGrid,
  RichTextEditor,
  ShortText,
  Textarea,
} from '../src/fieldcontrols'
import { EditView } from '../src/viewcontrols'
import { schema } from './__mocks__/schema'

export const testRepository = new Repository({
  repositoryUrl: 'https://dev.demo.sensenet.com',
  requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'DisplayName'],
  schemas: schema,
})

export const testFile: GenericContent = {
  Id: 1,
  Name: 'Sample-document.docx',
  DisplayName: 'Sample-document.docx',
  Path: '/Root/Profiles/Public/alba/Document_Library/Sample-document.docx',
  Type: 'File',
  Index: 42,
  VersioningMode: [VersioningMode.Option0],
  AllowedChildTypes: [1, 2],
  Description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec iaculis lectus, sed blandit urna. Nullam in auctor odio, eu eleifend diam. Curabitur rutrum ullamcorper nunc, sit amet consectetur turpis elementum ac. Aenean lorem lorem, feugiat sit amet sem at, accumsan cursus leo.',
}

export const testContent: GenericContent = {
  Id: 1,
  Name: 'TestContent',
  DisplayName: 'Test content',
  Path: '/Root/Content/TestContent',
  Type: 'TestContentType',
  Index: 42,
  VersioningMode: [VersioningMode.Option0],
  AllowedChildTypes: [1, 2],
  Description: 'Lorem ipsum short description.',
}

describe('Edit view component', () => {
  it('should render all components', () => {
    const wrapper = shallow(<EditView repository={testRepository} content={testFile} contentTypeName={testFile.Type} />)
    expect(wrapper.find(FileName)).toHaveLength(1)
    expect(wrapper.find(AutoComplete)).toHaveLength(1)
    expect(wrapper.find(ReferenceGrid)).toHaveLength(1)
    expect(wrapper.find(Name)).toHaveLength(1)
    expect(wrapper.find(ShortText)).toHaveLength(2)
    expect(wrapper.find(EmptyFieldControl)).toHaveLength(1)
    expect(wrapper.find(RichTextEditor)).toHaveLength(2)
    expect(wrapper.find(Password)).toHaveLength(1)
    expect(wrapper.find(Checkbox)).toHaveLength(2)
    expect(wrapper.find(NumberField)).toHaveLength(3)
    expect(wrapper.find(AllowedChildTypes)).toHaveLength(1)
    expect(wrapper.find(CheckboxGroup)).toHaveLength(2)
    expect(wrapper.find(DatePicker)).toHaveLength(1)
    expect(wrapper.find(DropDownList)).toHaveLength(2)
    expect(wrapper.find(RadioButtonGroup)).toHaveLength(1)
    expect(wrapper.find(Textarea)).toHaveLength(3)
    expect(wrapper.find(Avatar)).toHaveLength(1)
    expect(wrapper.find(ColorPicker)).toHaveLength(2)
  })
  it('should handle change', () => {
    const onSubmit = jest.fn()
    const wrapper = shallow(
      <EditView repository={testRepository} onSubmit={onSubmit} content={testFile} contentTypeName={testFile.Type} />,
    )
    const onChange = wrapper.find(CheckboxGroup).first().prop('fieldOnChange')
    onChange?.('VersioningMode', VersioningMode.Option1)
    wrapper.find('[component="form"]').simulate('submit', { preventDefault: jest.fn() })
    expect(onSubmit).toBeCalledWith({ VersioningMode: '1' }, 'GenericContent')
  })
  //Advanced field tests
  it('Advanced field header should be visible', () => {
    const wrapper = mount(
      <EditView repository={testRepository} content={testContent} contentTypeName={testContent.Type} />,
    )
    wrapper.update()

    const element = wrapper.find('[data-test="advanced-field-container"]')
    expect(element.exists()).toBe(true)

    wrapper.unmount()
  })
  it('Advanced fields should be invisible by default', () => {
    const wrapper = shallow(
      <EditView repository={testRepository} content={testContent} contentTypeName={testContent.Type} />,
    )
    const element = wrapper.find('[data-test="advanced-field-container"]')
    expect(element.find(DatePicker).exists()).toBe(false)
    expect(element.find(ShortText).exists()).toBe(false)
  })
  it('Advanced fields should be visible after clicking on show icon', () => {
    const wrapper = shallow(
      <EditView repository={testRepository} content={testContent} contentTypeName={testContent.Type} />,
    )
    wrapper.update()

    wrapper.find('[data-test="advanced-field-container"]').find(IconButton).simulate('click')
    wrapper.update()

    const element = wrapper.find('[data-test="advanced-field-container"]')
    expect(element.find(DatePicker).exists()).toBe(true)
    expect(element.find(ShortText).exists()).toBe(true)
  })
  it('Should render advanced fields in the right section', async () => {
    const wrapper = mount(
      <EditView repository={testRepository} content={testContent} contentTypeName={testContent.Type} />,
    )
    wrapper.update()

    const parent = wrapper.find('[data-test="advanced-field-container"]')
    expect(parent.find(DatePicker)).toHaveLength(1)
    expect(parent.find(ShortText)).toHaveLength(1)

    wrapper.unmount()
  })
})
