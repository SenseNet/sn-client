/* eslint-disable react/display-name */
import React from 'react'
import { Repository } from '@sensenet/client-core'
import {
  ColorPicker,
  DateTimePicker,
  DisplayName,
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
  Avatar,
  CheckboxGroup,
  AllowedChildTypes,
  DatePicker,
} from '@sensenet/controls-react/src'
import { GenericContent, VersioningMode } from '@sensenet/default-content-types/src'
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
// import autocompleteNotes from '../notes/fieldcontrols/AutoComplete.md'
// import fileUploadNotes from '../notes/fieldcontrols/FileUpload.md'
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
  repositoryUrl: 'https://dmsservice.demo.sensenet.com',
  requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'DisplayName'] as any,
  schemas: customSchema,
  sessionLifetime: 'expiration',
})

const testContent: GenericContent = {
  Name: 'Document_Library',
  Id: 4808,
  Path: '/Root/Sites/Default_Site',
  Type: 'GenericContent',
  VersioningMode: VersioningMode.Option0,
  ModificationDate: new Date().toISOString(),
  Index: 42,
}

const userContent = {
  Name: 'Alba Monday',
  Path: 'Root/IMS/Public/alba',
  DisplayName: 'Alba Monday',
  Id: 4,
  Icon: 'user',
  Type: 'User',
  BirthDate: new Date(2000, 5, 15).toISOString(),
  Avatar: { Url: '/Root/Sites/Default_Site/demoavatars/alba.jpg' },
}

const PleaseLogin = () => (
  <div style={{ fontStyle: 'italic', fontSize: 13 }}>
    To see this control in action, please login at
    <a target="_blank" href="https://dmsservice.demo.sensenet.com/" rel="noopener noreferrer">
      https://dmsservice.demo.sensenet.com/
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

// storiesOf('FieldControls.AutoComplete', module)
//   .addDecorator(withKnobs)
//   .addDecorator(withA11y)
//   .addDecorator(withActions('change'))
//   .add(
//     'new mode',
//     () => (
//       <AutoComplete
//         actionName="new"
//         fieldName="Name"
//         labelText={text('Label', 'AutoComplete label')}
//         readOnly={boolean('Readonly', false)}
//         required={boolean('Required', false)}
//         className={text('Additional class name', 'autocomplete-field')}
//         placeHolderText={text('Placeholder', 'placeholder')}
//         errorText={text('Error text')}
//         fieldOnChange={action('change')}
//         hintText={text('Hint', 'AutoComplete hint')}
//         dataSource={tagsInputDataSource}
//         repository={testRepository}
//       />
//     ),
//     { notes: { markdown: autocompleteNotes } },
//   )
//   .add(
//     'edit mode',
//     () => (
//       <AutoComplete
//         actionName="edit"
//         fieldName="Name"
//         labelText={text('Label', 'AutoComplete label')}
//         readOnly={boolean('Readonly', false)}
//         required={boolean('Required', false)}
//         className={text('Additional class name', 'autoomplete-field')}
//         placeHolderText={text('Placeholder', 'placeholder')}
//         errorText={text('Error text')}
//         fieldOnChange={action('change')}
//         hintText={text('Hint', 'AutoComplete hint')}
//         dataSource={tagsInputDataSource}
//         repository={testRepository}
//         value={[2]}
//       />
//     ),
//     { notes: { markdown: autocompleteNotes } },
//   )
//   .add(
//     'browse mode',
//     () => (
//       <AutoComplete
//         fieldName="Name"
//         actionName="browse"
//         labelText={text('Label', 'AutoComplete label')}
//         className={text('Additional class name', 'autocomplete-field')}
//         value={[1, 2]}
//         fieldOnChange={action('change')}
//         dataSource={tagsInputDataSource}
//         repository={testRepository}
//       />
//     ),
//     { notes: { markdown: autocompleteNotes } },
//   )

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
      component={DateTimePicker}
      fieldName="ModificationDate"
    />
  ),
  markdown: datetimepickerNotes,
  storyName: 'FieldControls.DateTimePicker',
})

fieldControlStory({
  component: actionName => (
    <DynamicControl
      actionName={actionName}
      repository={testRepository}
      content={testContent}
      component={DisplayName}
      fieldName="Name"
    />
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

//TODO: example with currency
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
      fieldName="Version"
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
      content={testContent}
      component={ReferenceGrid}
      fieldName="Name"
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
      content={testContent}
      component={TagsInput}
      fieldName="ModifiedBy"
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
