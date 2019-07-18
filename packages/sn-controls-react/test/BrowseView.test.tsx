import React from 'react'
import { Repository } from '@sensenet/client-core'
import { GenericContent, VersioningMode } from '@sensenet/default-content-types'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import { BrowseView } from '../src/viewcontrols/BrowseView'
import {
  AllowedChildTypes,
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
  TagsInput,
  Textarea,
} from '../src/fieldcontrols'
import { schema } from './__mocks__/schema'

export const testRepository = new Repository({
  repositoryUrl: 'https://devservice.demo.sensenet.com',
  requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'DisplayName'],
  schemas: schema,
  sessionLifetime: 'expiration',
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

describe('Browse view component', () => {
  it('should render all the controls for Generic content', () => {
    const wrapper = shallow(<BrowseView content={testFile} repository={testRepository}></BrowseView>)
    expect(wrapper.find(Typography).text()).toBe(testFile.DisplayName)
    expect(wrapper.find(FileName)).toHaveLength(1)
    expect(wrapper.find(TagsInput)).toHaveLength(1)
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
    expect(wrapper.find(Textarea)).toHaveLength(2)
    expect(wrapper.find(Avatar)).toHaveLength(1)
    expect(wrapper.find(ColorPicker)).toHaveLength(2)
  })
})
