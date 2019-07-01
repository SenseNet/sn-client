/* eslint-disable react/display-name */
import React from 'react'
import { Repository } from '@sensenet/client-core'
import {
  AllowedChildTypes,
  AutoComplete,
  Avatar,
  BooleanComponent,
  CheckboxGroup,
  ColorPicker,
  DatePicker,
  DropDownList,
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
  TimePicker,
} from '@sensenet/controls-react/src'
import { GenericContent, Group, Task, User, VersioningMode } from '@sensenet/default-content-types/src'
import shorttextNotes from '../notes/fieldcontrols/ShortText.md'
import displaynameNotes from '../notes/fieldcontrols/DisplayName.md'
import checkboxgroupNotes from '../notes/fieldcontrols/CheckboxGroup.md'
import dropdownlistNotes from '../notes/fieldcontrols/DropDownList.md'
import radiobuttongroupNotes from '../notes/fieldcontrols/RadioButtonGroup.md'
import datetimepickerNotes from '../notes/fieldcontrols/DateTimePicker.md'
import datepickerNotes from '../notes/fieldcontrols/DatePicker.md'
import timepickerNotes from '../notes/fieldcontrols/TimePicker.md'
import textareasNotes from '../notes/fieldcontrols/Textarea.md'
import richtextNotes from '../notes/fieldcontrols/RichTextEditor.md'
import nameNotes from '../notes/fieldcontrols/Name.md'
import filenameNotes from '../notes/fieldcontrols/FileName.md'
import passwordNotes from '../notes/fieldcontrols/Password.md'
import numberNotes from '../notes/fieldcontrols/Number.md'
import tagsInputNotes from '../notes/fieldcontrols/TagsInput.md'
import autocompleteNotes from '../notes/fieldcontrols/AutoComplete.md'
import referenceGridNotes from '../notes/fieldcontrols/ReferenceGrid.md'
import avatarNotes from '../notes/fieldcontrols/Avatar.md'
// import approvingModeChoiceNotes from '../notes/fieldcontrols/ApprovingModeChoice.md'
// import versioningModeChoiceNotes from '../notes/fieldcontrols/VersioningModeChoice.md'
// import versioningModeNotes from '../notes/fieldcontrols/VersioningMode.md'
import colorPickerNotes from '../notes/fieldcontrols/ColorPicker.md'
import allowedTypeNotes from '../notes/fieldcontrols/AllowedChildTypes.md'
import { customSchema } from './custom-schema'
import { DynamicControl } from './dynamic-control'
import { fieldControlStory } from './field-control-story'

export const testRepository = new Repository({
  repositoryUrl: 'https://devservice.demo.sensenet.com',
  requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'DisplayName'] as any,
  schemas: customSchema,
  sessionLifetime: 'expiration',
})

const taskContent: Task = {
  Id: 2344,
  Name: 'Task',
  Path: '/Root/Sites/Default_Site',
  Type: 'Task',
  TaskCompletion: 20,
}

const testContent: GenericContent = {
  Name: 'Document_Library',
  DisplayName: 'Document Library',
  Description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu mi arcu.
  Praesent vel ante vel nulla ornare bibendum et nec libero.
  Proin ornare imperdiet ex luctus cursus. Cras turpis quam, faucibus et ante sed, egestas mollis nisi.
  Maecenas sit amet tempus justo. Etiam id metus diam.
  Curabitur semper facilisis odio, eu vehicula nibh auctor a.
  Donec eleifend aliquam massa, vel dictum erat suscipit quis.`,
  Id: 4808,
  Path: '/Root/Sites/Default_Site',
  Type: 'GenericContent',
  VersioningMode: VersioningMode.Option0,
  ModificationDate: new Date().toISOString(),
  Index: 42,
}

const userContent: User = {
  Name: 'Alba Monday',
  Path: 'Root/IMS/Public/alba',
  DisplayName: 'Alba Monday',
  Id: 4804,
  Type: 'User',
  BirthDate: new Date(2000, 5, 15).toISOString(),
  Avatar: { Url: '/Root/Sites/Default_Site/demoavatars/alba.jpg' },
  Enabled: true,
  Manager: {
    Name: 'Business Cat',
    Path: 'Root/IMS/Public/businesscat',
    DisplayName: 'Business Cat',
    Id: 4810,
    Type: 'User',
  },
}

const groupContent: Group = {
  Id: 4815,
  Type: 'Group',
  Name: 'DMSAdmins',
  Path: '/Root/IMS/Public/DMSAdmins',
  Members: [userContent],
}

const PleaseLogin = () => (
  <div style={{ fontStyle: 'italic', fontSize: 13 }}>
    To see this control in action, please login at{' '}
    <a target="_blank" href="https://devservice.demo.sensenet.com/" rel="noopener noreferrer">
      https://devservice.demo.sensenet.com/
    </a>
  </div>
)

fieldControlStory({
  component: actionName => (
    <div>
      <PleaseLogin />
      <br />
      <DynamicControl
        actionName={actionName}
        repository={testRepository}
        content={testContent}
        component={AllowedChildTypes}
        fieldName="AllowedChildTypes"
      />
    </div>
  ),
  markdown: allowedTypeNotes,
  storyName: 'FieldControls.AllowedChildTypes',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={groupContent}
      component={AutoComplete}
      fieldName="Members"
    />
  ),
  markdown: autocompleteNotes,
  storyName: 'FieldControls.AutoComplete',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={userContent}
      component={Avatar}
      fieldName="Avatar"
    />
  ),
  markdown: avatarNotes,
  storyName: 'FieldControls.Avatar',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={userContent}
      component={BooleanComponent}
      fieldName="Enabled"
    />
  ),
  markdown: '',
  storyName: 'FieldControls.Boolean',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={CheckboxGroup}
      fieldName="VersioningMode"
    />
  ),
  markdown: checkboxgroupNotes,
  storyName: 'FieldControls.CheckboxGroup',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={ColorPicker}
      fieldName="Color"
    />
  ),
  markdown: colorPickerNotes,
  storyName: 'FieldControls.ColorPicker',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={userContent}
      component={DatePicker}
      fieldName="BirthDate"
    />
  ),
  markdown: datepickerNotes,
  storyName: 'FieldControls.DatePicker',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={DatePicker}
      fieldName="ModificationDate"
    />
  ),
  markdown: datetimepickerNotes,
  storyName: 'FieldControls.DateTimePicker',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl actionName={actionName} repository={testRepository} content={testContent} fieldName="DisplayName" />
  ),
  markdown: displaynameNotes,
  storyName: 'FieldControls.DisplayName',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={DropDownList}
      fieldName="VersioningMode"
    />
  ),
  markdown: dropdownlistNotes,
  storyName: 'FieldControls.DropDownList',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={FileName}
      fieldName="Name"
    />
  ),
  markdown: filenameNotes,
  storyName: 'FieldControls.FileName',
})

// storiesOf('FieldControls.FileUpload', module)
//   .addDecorator(withKnobs)
//   .addDecorator(withA11y)
//   .addDecorator(withActions('change'))
//   .add(
//     'new mode',
//     () => (
//       <FileUpload
//         actionName="new"
//         labelText={text('Label', 'FileUpload label')}
//         fieldOnChange={action('change')}
//         className={text('Additional class name', 'fileupload-field')}
//         placeHolderText={text('Placeholder', 'placeholder')}
//         hintText={text('Hint', 'FileUpload hint')}
//         fieldName="Name"
//         repository={testRepository}
//       />
//     ),
//     { notes: { markdown: fileUploadNotes } },
//   )

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={Name}
      fieldName="Name"
    />
  ),
  markdown: nameNotes,
  storyName: 'FieldControls.Name',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={NumberComponent}
      fieldName="Index"
    />
  ),
  markdown: numberNotes,
  storyName: 'FieldControls.Number',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={taskContent}
      component={NumberComponent}
      fieldName="TaskCompletion"
    />
  ),
  markdown: '',
  storyName: 'FieldControls.Number.Percantage',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={Password}
      fieldName="Name"
    />
  ),
  markdown: passwordNotes,
  storyName: 'FieldControls.Password',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={RadioButtonGroup}
      fieldName="VersioningMode"
    />
  ),
  markdown: radiobuttongroupNotes,
  storyName: 'FieldControls.RadioButtonGroup',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={groupContent}
      component={ReferenceGrid}
      fieldName="Members"
    />
  ),
  markdown: referenceGridNotes,
  storyName: 'FieldControls.ReferenceGrid',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={RichTextEditor}
      fieldName="Description"
    />
  ),
  markdown: richtextNotes,
  storyName: 'FieldControls.RichTextEditor',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={ShortText}
      fieldName="Name"
    />
  ),
  markdown: shorttextNotes,
  storyName: 'FieldControls.ShortText',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={groupContent}
      component={TagsInput}
      fieldName="Members"
    />
  ),
  markdown: tagsInputNotes,
  storyName: 'FieldControls.TagsInput',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={Textarea}
      fieldName="Description"
    />
  ),
  markdown: textareasNotes,
  storyName: 'FieldControls.Textarea',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={TimePicker}
      fieldName="ModificationDate"
    />
  ),
  markdown: timepickerNotes,
  storyName: 'FieldControls.TimePicker',
})
