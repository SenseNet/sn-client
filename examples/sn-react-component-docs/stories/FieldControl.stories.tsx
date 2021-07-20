/* eslint-disable react/display-name */
import { Repository } from '@sensenet/client-core'
import {
  AllowedChildTypes,
  AutoComplete,
  Avatar,
  Checkbox,
  CheckboxGroup,
  ColorPicker,
  DatePicker,
  DropDownList,
  FileName,
  FileUpload,
  Name,
  NumberField,
  Password,
  RadioButtonGroup,
  reactControlMapper,
  ReferenceGrid,
  RichTextEditor,
  ShortText,
  Switcher,
  TagsInput,
  Textarea,
  TimePicker,
} from '@sensenet/controls-react/src'
import { GenericContent, Group, Image, Task, User, VersioningMode } from '@sensenet/default-content-types/src'
import React from 'react'
import allowedTypeNotes from '../notes/fieldcontrols/AllowedChildTypes.md'
import autocompleteNotes from '../notes/fieldcontrols/AutoComplete.md'
import avatarNotes from '../notes/fieldcontrols/Avatar.md'
import checkboxgroupNotes from '../notes/fieldcontrols/CheckboxGroup.md'
import colorPickerNotes from '../notes/fieldcontrols/ColorPicker.md'
import datepickerNotes from '../notes/fieldcontrols/DatePicker.md'
import datetimepickerNotes from '../notes/fieldcontrols/DateTimePicker.md'
import displaynameNotes from '../notes/fieldcontrols/DisplayName.md'
import dropdownlistNotes from '../notes/fieldcontrols/DropDownList.md'
import filenameNotes from '../notes/fieldcontrols/FileName.md'
import fileUploadNotes from '../notes/fieldcontrols/FileUpload.md'
import nameNotes from '../notes/fieldcontrols/Name.md'
import numberNotes from '../notes/fieldcontrols/Number.md'
import passwordNotes from '../notes/fieldcontrols/Password.md'
import radiobuttongroupNotes from '../notes/fieldcontrols/RadioButtonGroup.md'
import referenceGridNotes from '../notes/fieldcontrols/ReferenceGrid.md'
import richtextNotes from '../notes/fieldcontrols/RichTextEditor.md'
import shorttextNotes from '../notes/fieldcontrols/ShortText.md'
import tagsInputNotes from '../notes/fieldcontrols/TagsInput.md'
import textareasNotes from '../notes/fieldcontrols/Textarea.md'
import timepickerNotes from '../notes/fieldcontrols/TimePicker.md'
// import approvingModeChoiceNotes from '../notes/fieldcontrols/ApprovingModeChoice.md'
// import versioningModeChoiceNotes from '../notes/fieldcontrols/VersioningModeChoice.md'
// import versioningModeNotes from '../notes/fieldcontrols/VersioningMode.md'
import { customSchema } from './custom-schema'
import { DynamicControl } from './dynamic-control'
import { fieldControlStory } from './field-control-story'
import { Login } from './Login'

export const testRepository = new Repository({
  repositoryUrl: 'https://dev.demo.sensenet.com',
  requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'DisplayName'] as any,
  schemas: customSchema,
})

const taskContent: Task = {
  Id: 2344,
  Name: 'Task',
  Path: '/Root/Content/IT/Tasks',
  Type: 'Task',
  TaskCompletion: 20,
}

const fileContent: Image = {
  Id: 3777,
  Path: '/Root/Content/IT/ImageLibrary/bagas-haryo-1415756-unsplash.jpg',
  Name: 'bagas-haryo-1415756-unsplash.jpg',
  DisplayName: 'bagas-haryo-1415756-unsplash.jpg',
  Type: 'Image',
  Icon: 'image',
  RateAvg: 32.5,
}

const testContent: GenericContent & { ExpectedRevenue: number; Color: string; Password: string } = {
  Name: 'Document_Library',
  DisplayName: 'Document Library',
  Description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu mi arcu.
  Praesent vel ante vel nulla ornare bibendum et nec libero.
  Proin ornare imperdiet ex luctus cursus. Cras turpis quam, faucibus et ante sed, egestas mollis nisi.
  Maecenas sit amet tempus justo. Etiam id metus diam.
  Curabitur semper facilisis odio, eu vehicula nibh auctor a.
  Donec eleifend aliquam massa, vel dictum erat suscipit quis.`,
  Id: 4808,
  Path: '/Root/Content',
  Type: 'GenericContent',
  VersioningMode: [VersioningMode.Option1],
  ModificationDate: new Date().toISOString(),
  Index: 42,
  ExpectedRevenue: 21.0,
  Color: '#016d9e',
  Password: 'password',
}

const userContent: User = {
  Name: 'Developer Dog',
  Path: 'Root/IMS/Public/devdog',
  DisplayName: 'Developer Dog',
  Id: 1498,
  Type: 'User',
  BirthDate: new Date(2000, 5, 15).toISOString(),
  Avatar: { Url: '/Root/Content/demoavatars/devdog.jpeg' },
  Enabled: true,
  Manager: {
    Name: 'Business Cat',
    Path: 'Root/IMS/Public/businesscat',
    DisplayName: 'Business Cat',
    Id: 1497,
    Type: 'User',
  },
}

const groupContent: Group = {
  Id: 4815,
  Type: 'Group',
  Name: 'Administrators',
  Path: '/Root/IMS/Public/Administrators',
  Members: [userContent],
}

fieldControlStory({
  component: (actionName) => (
    <div>
      <Login>
        <DynamicControl
          actionName={actionName}
          repository={testRepository}
          content={testContent}
          component={AllowedChildTypes}
          fieldName="AllowedChildTypes"
        />
      </Login>
    </div>
  ),
  markdown: allowedTypeNotes,
  storyName: 'FieldControls/AllowedChildTypes',
})

fieldControlStory({
  component: (actionName) => (
    <div>
      <Login>
        <DynamicControl
          actionName={actionName}
          repository={testRepository}
          content={groupContent}
          component={AutoComplete}
          fieldName="Members"
        />
      </Login>
    </div>
  ),
  markdown: autocompleteNotes,
  storyName: 'FieldControls/AutoComplete',
})

fieldControlStory({
  component: (actionName) => (
    <div>
      <Login>
        <DynamicControl
          actionName={actionName}
          repository={testRepository}
          content={userContent}
          component={(props) => <Avatar handleAdd={() => null} {...props} />}
          fieldName="Avatar"
        />
      </Login>
    </div>
  ),
  markdown: avatarNotes,
  storyName: 'FieldControls/Avatar',
})

fieldControlStory({
  component: (actionName) => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={userContent}
      component={Checkbox}
      fieldName="Enabled"
    />
  ),
  markdown: '',
  storyName: 'FieldControls/Checkbox',
})

fieldControlStory({
  component: (actionName) => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={userContent}
      component={Switcher}
      fieldName="Enabled"
    />
  ),
  markdown: '',
  storyName: 'FieldControls/Switcher',
})

fieldControlStory({
  component: (actionName) => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={CheckboxGroup}
      fieldName="VersioningMode"
    />
  ),
  markdown: checkboxgroupNotes,
  storyName: 'FieldControls/CheckboxGroup',
})

fieldControlStory({
  component: (actionName) => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={ColorPicker}
      fieldName="Color"
    />
  ),
  markdown: colorPickerNotes,
  storyName: 'FieldControls/ColorPicker',
})

fieldControlStory({
  component: (actionName) => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={userContent}
      component={DatePicker}
      fieldName="BirthDate"
    />
  ),
  markdown: datepickerNotes,
  storyName: 'FieldControls/DatePicker',
})

fieldControlStory({
  component: (actionName) => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={DatePicker}
      fieldName="ModificationDate"
    />
  ),
  markdown: datetimepickerNotes,
  storyName: 'FieldControls/DateTimePicker',
})

fieldControlStory({
  component: (actionName) => (
    <DynamicControl actionName={actionName} repository={testRepository} content={testContent} fieldName="DisplayName" />
  ),
  markdown: displaynameNotes,
  storyName: 'FieldControls/DisplayName',
})

fieldControlStory({
  component: (actionName) => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={DropDownList}
      fieldName="VersioningMode"
    />
  ),
  markdown: dropdownlistNotes,
  storyName: 'FieldControls/DropDownList',
})

fieldControlStory({
  component: (actionName) => {
    const schema = reactControlMapper(testRepository).getFullSchemaForContentType('File', actionName)
    const fieldMapping = schema.fieldMappings.find((a) => a.fieldSettings.Name === 'DisplayName')
    return (
      <FileName
        actionName={actionName}
        repository={testRepository}
        content={actionName !== 'new' ? fileContent : undefined}
        extension="jpg"
        fieldValue={actionName !== 'new' ? fileContent.DisplayName : undefined}
        settings={fieldMapping!.fieldSettings}
      />
    )
  },
  markdown: filenameNotes,
  storyName: 'FieldControls/FileName',
})

fieldControlStory({
  component: (actionName) => (
    <div>
      <Login>
        <DynamicControl
          actionName={actionName}
          repository={testRepository}
          content={fileContent}
          component={FileUpload}
          fieldName="Binary"
        />
      </Login>
    </div>
  ),
  markdown: fileUploadNotes,
  storyName: 'FieldControls/FileUpload',
})

fieldControlStory({
  component: (actionName) => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={Name}
      fieldName="Name"
    />
  ),
  markdown: nameNotes,
  storyName: 'FieldControls/Name',
})

fieldControlStory({
  component: (actionName) => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={NumberField}
      fieldName="Index"
    />
  ),
  markdown: numberNotes,
  storyName: 'FieldControls/Number',
})

fieldControlStory({
  component: (actionName) => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={taskContent}
      component={NumberField}
      fieldName="TaskCompletion"
    />
  ),
  markdown: numberNotes,
  storyName: 'FieldControls/Number.Percantage',
})

fieldControlStory({
  component: (actionName) => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={NumberField}
      fieldName="ExpectedRevenue"
    />
  ),
  markdown: numberNotes,
  storyName: 'FieldControls/Number.Currency',
})

fieldControlStory({
  component: (actionName) => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={fileContent}
      component={NumberField}
      fieldName="RateAvg"
    />
  ),
  markdown: numberNotes,
  storyName: 'FieldControls/Number.Double',
})

fieldControlStory({
  component: (actionName) => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={userContent}
      component={Password}
      fieldName="Password"
    />
  ),
  markdown: passwordNotes,
  storyName: 'FieldControls/Password',
})

fieldControlStory({
  component: (actionName) => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={RadioButtonGroup}
      fieldName="VersioningMode"
    />
  ),
  markdown: radiobuttongroupNotes,
  storyName: 'FieldControls/RadioButtonGroup',
})

fieldControlStory({
  component: (actionName) => (
    <div>
      <Login>
        <DynamicControl
          actionName={actionName}
          repository={testRepository}
          content={groupContent}
          component={ReferenceGrid}
          fieldName="Members"
        />
      </Login>
    </div>
  ),
  markdown: referenceGridNotes,
  storyName: 'FieldControls/ReferenceGrid',
})

fieldControlStory({
  component: (actionName) => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={RichTextEditor}
      fieldName="Description"
    />
  ),
  markdown: richtextNotes,
  storyName: 'FieldControls/RichTextEditor',
})

fieldControlStory({
  component: (actionName) => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={ShortText}
      fieldName="Name"
    />
  ),
  markdown: shorttextNotes,
  storyName: 'FieldControls/ShortText',
})

fieldControlStory({
  component: (actionName) => (
    <div>
      <Login>
        <DynamicControl
          actionName={actionName}
          repository={testRepository}
          content={groupContent}
          component={TagsInput}
          fieldName="Members"
        />
      </Login>
    </div>
  ),
  markdown: tagsInputNotes,
  storyName: 'FieldControls/TagsInput',
})

fieldControlStory({
  component: (actionName) => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={Textarea}
      fieldName="Description"
    />
  ),
  markdown: textareasNotes,
  storyName: 'FieldControls/Textarea',
})

fieldControlStory({
  component: (actionName) => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={TimePicker}
      fieldName="ModificationDate"
    />
  ),
  markdown: timepickerNotes,
  storyName: 'FieldControls/TimePicker',
})
