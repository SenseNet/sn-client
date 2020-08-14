import { Repository } from '@sensenet/client-core'
import { GenericContent, VersioningMode } from '@sensenet/default-content-types'
import Typography from '@material-ui/core/Typography'
import { shallow } from 'enzyme'
import React from 'react'
import {
  AllowedChildTypes,
  AutoComplete,
  Avatar,
  BooleanComponent,
  CheckboxGroup,
  ColorPicker,
  DatePicker,
  DropDownList,
  EmptyFieldControl,
  FileName,
  Name,
  NumberComponent,
  Password,
  RadioButtonGroup,
  ReferenceGrid,
  RichTextEditor,
  ShortText,
  Textarea,
} from '../src/fieldcontrols'
import { NewView } from '../src/viewcontrols'
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

describe('New view component', () => {
  it('should render all components', () => {
    const wrapper = shallow(
      <NewView repository={testRepository} showTitle={true} contentTypeName="GenericContent" />,
    ).dive()
    expect(wrapper.find(Typography).text()).toBe('New $Ctd-GenericContent,DisplayName')
    expect(wrapper.find(FileName)).toHaveLength(1)
    expect(wrapper.find(AutoComplete)).toHaveLength(1)
    expect(wrapper.find(ReferenceGrid)).toHaveLength(1)
    expect(wrapper.find(Name)).toHaveLength(1)
    expect(wrapper.find(ShortText)).toHaveLength(2)
    expect(wrapper.find(EmptyFieldControl)).toHaveLength(1)
    expect(wrapper.find(RichTextEditor)).toHaveLength(2)
    expect(wrapper.find(Password)).toHaveLength(1)
    expect(wrapper.find(BooleanComponent)).toHaveLength(2)
    expect(wrapper.find(NumberComponent)).toHaveLength(3)
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
      <NewView repository={testRepository} onSubmit={onSubmit} contentTypeName="GenericContent" />,
    ).dive()
    const onChange = wrapper.find(CheckboxGroup).first().prop('fieldOnChange')
    onChange?.('VersioningMode', VersioningMode.Option1)
    wrapper.find('[component="form"]').simulate('submit', { preventDefault: jest.fn() })
    expect(onSubmit).toBeCalledWith({ VersioningMode: '1' }, 'GenericContent')
  })
})
