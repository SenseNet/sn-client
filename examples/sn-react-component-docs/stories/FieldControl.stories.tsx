import { withA11y } from '@storybook/addon-a11y'
import { action } from '@storybook/addon-actions'
import { withActions } from '@storybook/addon-actions/dist/preview'
import { boolean, date, number, select, text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import { Repository } from '@sensenet/client-core'
import { customSchema } from './ViewControl.stories'

import {
  AutoComplete,
  Avatar,
  CheckboxGroup,
  ColorPicker,
  DatePicker,
  DateTimePicker,
  DisplayName,
  DropDownList,
  FileName,
  FileUpload,
  Name,
  Number,
  Password,
  RadioButtonGroup,
  ReferenceGrid,
  RichTextEditor,
  ShortText,
  TagsInput,
  Textarea,
  TimePicker,
} from '@sensenet/controls-react/src'
import { User } from '@sensenet/default-content-types/src'

export const testRepository = new Repository({
  repositoryUrl: 'https://dmsservice.demo.sensenet.com',
  requiredSelect: ['Id', 'Path', 'Name', 'Type', 'ParentId', 'DisplayName'] as any,
  schemas: customSchema,
  sessionLifetime: 'expiration',
})

const currencyOptions = {
  USD: '$',
  EUR: '€',
  BTC: '฿',
  JPY: '¥',
}

const tagsInputDataSource = [
  { DisplayName: 'Alba Monday', Id: 1 } as User,
  { DisplayName: 'Terry Cherry', Id: 2 } as User,
]

const referenceGridDataSource = [
  { DisplayName: 'Aenean semper.doc', Id: 4083, IsFolder: false, Children: [], Type: 'File' },
  { DisplayName: 'Aliquam porta suscipit ante.doc', Id: 4082, IsFolder: false, Children: [], Type: 'File' },
  { DisplayName: 'Duis et lorem.doc', Id: 4085, IsFolder: false, Children: [], Type: 'File' },
]

const shorttextNotes = require('../notes/fieldcontrols/ShortText.md')
const displaynameNotes = require('../notes/fieldcontrols/DisplayName.md')
const checkboxgroupNotes = require('../notes/fieldcontrols/CheckboxGroup.md')
const dropdownlistNotes = require('../notes/fieldcontrols/DropDownList.md')
const radiobuttongroupNotes = require('../notes/fieldcontrols/RadioButtonGroup.md')
const datetimepickerNotes = require('../notes/fieldcontrols/DateTimePicker.md')
const datepickerNotes = require('../notes/fieldcontrols/DatePicker.md')
const timepickerNotes = require('../notes/fieldcontrols/TimePicker.md')
const textareasNotes = require('../notes/fieldcontrols/Textarea.md')
const richtextNotes = require('../notes/fieldcontrols/RichTextEditor.md')
const nameNotes = require('../notes/fieldcontrols/Name.md')
const filenameNotes = require('../notes/fieldcontrols/FileName.md')
const passwordNotes = require('../notes/fieldcontrols/Password.md')
const numberNotes = require('../notes/fieldcontrols/Number.md')
const tagsInputNotes = require('../notes/fieldcontrols/TagsInput.md')
const autocompleteNotes = require('../notes/fieldcontrols/AutoComplete.md')
const fileUploadNotes = require('../notes/fieldcontrols/FileUpload.md')
const referenceGridNotes = require('../notes/fieldcontrols/ReferenceGrid.md')
const avatarNotes = require('../notes/fieldcontrols/Avatar.md')
const approvingModeChoiceNotes = require('../notes/fieldcontrols/ApprovingModeChoice.md')
const versioningModeChoiceNotes = require('../notes/fieldcontrols/VersioningModeChoice.md')
const versioningModeNotes = require('../notes/fieldcontrols/VersioningMode.md')
const colorPickerNotes = require('../notes/fieldcontrols/ColorPicker.md')

storiesOf('FieldControls.AutoComplete', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <AutoComplete
        data-actionName="new"
        name="Name"
        data-labelText={text('Label', 'AutoComplete label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'autocomplete-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'AutoComplete hint')}
        dataSource={tagsInputDataSource}
        repository={testRepository}
      />
    ),
    { notes: { markdown: autocompleteNotes } },
  )
  .add(
    'edit mode',
    () => (
      <AutoComplete
        data-actionName="edit"
        name="Name"
        data-labelText={text('Label', 'AutoComplete label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'autoomplete-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'AutoComplete hint')}
        dataSource={tagsInputDataSource}
        repository={testRepository}
        data-fieldValue={[2]}
      />
    ),
    { notes: { markdown: autocompleteNotes } },
  )
  .add(
    'browse mode',
    () => (
      <AutoComplete
        data-textType="LongText"
        name="Name"
        data-actionName="browse"
        data-labelText={text('Label', 'AutoComplete label')}
        className={text('Additional class name', 'autocomplete-field')}
        data-fieldValue={[1, 2]}
        onChange={action('change')}
        dataSource={tagsInputDataSource}
        repository={testRepository}
      />
    ),
    { notes: { markdown: autocompleteNotes } },
  )

storiesOf('FieldControls.Avatar', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <Avatar
        data-actionName="new"
        name="Name"
        data-labelText={text('Label', 'Avatar label')}
        readOnly={boolean('Readonly', false)}
        className={text('Additional class name', 'avatar-field')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Avatar hint')}
        dataSource={referenceGridDataSource}
        repository={testRepository}
        data-repository={testRepository}
        data-selectionRoot={['/demoavatars']}
        content={
          {
            DisplayName: 'Alba Monday',
            Id: 4,
            Icon: 'user',
            Type: 'User',
            Avatar: { Url: 'https://dmsservice.demo.sensenet.com/Root/Sites/Default_Site/demoavatars/alba.jpg' },
          } as User
        }
      />
    ),
    { notes: { markdown: avatarNotes } },
  )
  .add(
    'edit mode',
    () => (
      <Avatar
        data-actionName="edit"
        name="Name"
        data-labelText={text('Label', 'Avatar label')}
        readOnly={boolean('Readonly', false)}
        className={text('Additional class name', 'avatar-field')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Avatar hint')}
        dataSource={referenceGridDataSource}
        repository={testRepository}
        data-repository={testRepository}
        data-fieldValue="/Root/Sites/Default_Site/demoavatars/alba.jpg"
        data-selectionRoot={['/demoavatars']}
        content={
          {
            DisplayName: 'Alba Monday',
            Id: 4,
            Icon: 'user',
            Type: 'User',
            Avatar: { Url: 'https://dmsservice.demo.sensenet.com/Root/Sites/Default_Site/demoavatars/alba.jpg' },
          } as User
        }
      />
    ),
    { notes: { markdown: avatarNotes } },
  )
  .add(
    'browse mode',
    () => (
      <Avatar
        name="Name"
        data-actionName="browse"
        data-labelText={text('Label', 'Avatar label')}
        className={text('Additional class name', 'avatar-field')}
        data-fieldValue="/Root/Sites/Default_Site/demoavatars/alba.jpg"
        onChange={action('change')}
        dataSource={tagsInputDataSource}
        repository={testRepository}
        content={
          {
            DisplayName: 'Alba Monday',
            Id: 4,
            Icon: 'user',
            Type: 'User',
            Avatar: { Url: 'https://dmsservice.demo.sensenet.com/Root/Sites/Default_Site/demoavatars/alba.jpg' },
          } as User
        }
      />
    ),
    { notes: { markdown: avatarNotes } },
  )

storiesOf('FieldControls.CheckboxGroup', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .add(
    'new mode',
    () => (
      <CheckboxGroup
        data-labelText={text('Label', 'Checkboxgroup label')}
        data-actionName="new"
        onChange={action('change')}
        options={[{ Text: 'option1', Value: 1 }, { Text: 'option2', Value: 2 }, { Text: 'option3', Value: 3 }]}
        data-allowMultiple={boolean('Allow multiple', false)}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        data-errorText={text('Error text', '')}
        data-hintText={text('Hint', 'Checkboxgroup hint')}
        data-allowExtraValue={boolean('Allow extra value', false)}
        name="VersioningMode"
      />
    ),
    { notes: { markdown: checkboxgroupNotes } },
  )
  .add(
    'edit mode',
    () => (
      <CheckboxGroup
        data-labelText={text('Label', 'Checkboxgroup label')}
        data-actionName="edit"
        onChange={action('change')}
        options={[{ Text: 'option1', Value: 1 }, { Text: 'option2', Value: 2 }, { Text: 'option3', Value: 3 }]}
        data-fieldValue={[3]}
        data-allowMultiple={boolean('Allow multiple', false)}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        data-errorText={text('Error text', '')}
        data-hintText={text('Hint', 'Checkboxgroup hint')}
        data-allowExtraValue={boolean('Allow extra value', false)}
        name="VersioningMode"
      />
    ),
    { notes: { markdown: checkboxgroupNotes } },
  )
  .add(
    'browse mode',
    () => (
      <CheckboxGroup
        data-labelText={text('Label', 'Checkboxgroup label')}
        data-actionName="browse"
        onChange={action('change')}
        options={[{ Text: 'option1', Value: 1 }, { Text: 'option2', Value: 2 }, { Text: 'option3', Value: 3 }]}
        data-fieldValue={[3]}
        value={3}
        name="VersioningMode"
      />
    ),
    { notes: { markdown: checkboxgroupNotes } },
  )

storiesOf('FieldControls.ColorPicker', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <ColorPicker
        data-labelText={text('Label', 'ColorPicker label')}
        data-actionName="new"
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'colorpicker-field')}
        data-errorText={text('Error text')}
        data-defaultValue={dateKnob('Default value')}
        data-hintText={text('Hint', 'ColorPicker hint')}
        name="ModificationDate"
      />
    ),
    { notes: { markdown: colorPickerNotes } },
  )

storiesOf('FieldControls.DatePicker', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <DatePicker
        data-actionName="new"
        data-labelText={text('Label', 'DatePicker label')}
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'datepicker-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        data-defaultValue={dateKnob('Default value')}
        data-hintText={text('Hint', 'DatePicker hint')}
        name="ModificationDate"
      />
    ),
    { notes: { markdown: datepickerNotes } },
  )
  .add(
    'edit mode',
    () => (
      <DatePicker
        data-actionName="edit"
        data-labelText={text('Label', 'DatePicker label')}
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'datepicker-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={dateKnob('Value')}
        data-hintText={text('Hint', 'DatePicker hint')}
        name="ModificationDate"
      />
    ),
    { notes: { markdown: datepickerNotes } },
  )
  .add(
    'browse mode',
    () => (
      <DatePicker
        data-actionName="browse"
        data-labelText={text('Label', 'DatePicker label')}
        value="2013-03-26T03:55:00"
        onChange={action('change')}
        data-displayMode={select('Display mode', ['relative', 'calendar', 'raw'], 'relative')}
        className={text('Additional class name', 'datepicker-field')}
        name="ModificationDate"
      />
    ),
    { notes: { markdown: datepickerNotes } },
  )

storiesOf('FieldControls.DateTimePicker', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <DateTimePicker
        data-actionName="new"
        data-labelText={text('Label', 'DateTimePicker label')}
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'datetimepicker-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        data-defaultValue={dateKnob('Default value')}
        data-hintText={text('Hint', 'DateTimePicker hint')}
        name="Name"
      />
    ),
    { notes: { markdown: datetimepickerNotes } },
  )
  .add(
    'edit mode',
    () => (
      <DateTimePicker
        data-actionName="edit"
        data-labelText={text('Label', 'DateTimePicker label')}
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'datetimepicker-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={dateKnob('Value')}
        data-hintText={text('Hint', 'DateTimePicker hint')}
        name="Name"
      />
    ),
    { notes: { markdown: datetimepickerNotes } },
  )
  .add(
    'browse mode',
    () => (
      <DateTimePicker
        data-actionName="browse"
        data-labelText={text('Label', 'DateTimePicker label')}
        value="2018-10-03T03:55:00"
        onChange={action('change')}
        data-displayMode={select('Display mode', ['relative', 'calendar', 'raw'], 'relative')}
        className={text('Additional class name', 'datetimepicker-field')}
        name="Name"
      />
    ),
    { notes: { markdown: datetimepickerNotes } },
  )

storiesOf('FieldControls.DisplayName', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <DisplayName
        data-actionName="new"
        data-labelText={text('Label', 'DisplayName label')}
        data-defaultValue={text('Default value', 'DisplayName default value')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'displayname-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'DisplayName hint')}
        name="Name"
      />
    ),
    { notes: { markdown: displaynameNotes } },
  )
  .add(
    'edit mode',
    () => (
      <DisplayName
        data-labelText={text('Label', 'DisplayName label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'displayname-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={text('Value', 'DisplayName value')}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text('Hint', 'DisplayName hint')}
        name="Name"
      />
    ),
    { notes: { markdown: displaynameNotes } },
  )
  .add(
    'browse mode',
    () => (
      <DisplayName
        data-actionName="browse"
        data-labelText={text('Label', 'DisplayName label')}
        className={text('Additional class name', 'displayname-field')}
        value={text('Value', 'DisplayName value')}
        onChange={action('change')}
        name="Name"
      />
    ),
    { notes: { markdown: displaynameNotes } },
  )

storiesOf('FieldControls.DropDownList', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <DropDownList
        data-actionName="new"
        data-labelText={text('Label', 'DropDownList label')}
        data-defaultValue={'2'}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'dropdownlist-field')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'DropDownList hint')}
        options={[{ Text: 'option1', Value: 1 }, { Text: 'option2', Value: 2 }, { Text: 'option3', Value: 3 }]}
        name="Version"
      />
    ),
    { notes: { markdown: dropdownlistNotes } },
  )
  .add(
    'edit mode',
    () => (
      <DropDownList
        data-labelText={text('Label', 'DropDownList label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'dropdownlist-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        data-fieldValue={[3]}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text('Hint', 'DropDownList hint')}
        options={[{ Text: 'option1', Value: 1 }, { Text: 'option2', Value: 2 }, { Text: 'option3', Value: 3 }]}
        name="VersioningMode"
      />
    ),
    { notes: { markdown: dropdownlistNotes } },
  )
  .add(
    'browse mode',
    () => (
      <DropDownList
        data-actionName="browse"
        data-labelText={text('Label', 'DropDownList label')}
        className={text('Additional class name', 'dropdownlist-field')}
        data-fieldValue={text('Value', [2])}
        onChange={action('change')}
        options={[{ Text: 'option1', Value: 1 }, { Text: 'option2', Value: 2 }, { Text: 'option3', Value: 3 }]}
        name="VersioningMode"
      />
    ),
    { notes: { markdown: dropdownlistNotes } },
  )
  .add(
    'ApprovingModeChoice',
    () => (
      <DropDownList
        data-labelText={text('Label', 'ApprovingModeChoice label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'approvingmodechoice-field')}
        data-fieldValue={[3]}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text('Hint', 'It shows the approval mode of the current content.')}
        options={[{ Text: 'Inherited (Off)', Value: 1 }, { Text: 'Off', Value: 2 }, { Text: 'On', Value: 3 }]}
        name="ApprovingMode"
      />
    ),
    { notes: { markdown: approvingModeChoiceNotes } },
  )
  .add(
    'VersioningModeChoice',
    () => (
      <DropDownList
        data-labelText={text('Label', 'Version history')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'versioningmodechoice-field')}
        data-fieldValue={[3]}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text(
          'Hint',
          'Specify whether the system should create a new version whenever you create or modify a content below this content.',
        )}
        options={[
          { Text: 'Inherited', Value: 1 },
          { Text: 'None', Value: 2 },
          { Text: 'Major only', Value: 3 },
          { Text: 'Major and minor', Value: 4 },
        ]}
        name="VersioningMode"
      />
    ),
    { notes: { markdown: versioningModeChoiceNotes } },
  )

  .add(
    'VersioningMode',
    () => (
      <DropDownList
        data-labelText={text('Label', 'Versioning for current content')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'versioningmodechoice-field')}
        data-fieldValue={[3]}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text('Hint', 'It shows the versioning mode of the current content.')}
        options={[
          { Text: 'Inherited', Value: 1 },
          { Text: 'None', Value: 2 },
          { Text: 'Major only', Value: 3 },
          { Text: 'Major and minor', Value: 4 },
        ]}
        name="VersioningMode"
      />
    ),
    { notes: { markdown: versioningModeNotes } },
  )

storiesOf('FieldControls.FileName', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <FileName
        data-actionName="new"
        data-labelText={text('Label', 'FileName label')}
        data-defaultValue={text('Default value', 'FileName default value')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'filename-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'FileName hint')}
        data-extension={text('Extension', 'docx')}
        name="Name"
      />
    ),
    { notes: { markdown: filenameNotes } },
  )
  .add(
    'edit mode',
    () => (
      <FileName
        data-labelText={text('Label', 'FileName label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'filename-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={text('Value', 'filename.docx')}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text('Hint', 'FileName hint')}
        name="Name"
      />
    ),
    { notes: { markdown: filenameNotes } },
  )
  .add(
    'browse mode',
    () => (
      <FileName
        data-actionName="browse"
        data-labelText={text('Label', 'FileName label')}
        className={text('Additional class name', 'filename-field')}
        value={text('Value', 'Lorem-ipsum.docx')}
        onChange={action('change')}
        name="Name"
      />
    ),
    { notes: { markdown: filenameNotes } },
  )

storiesOf('FieldControls.FileUpload', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <FileUpload
        data-actionName="new"
        data-labelText={text('Label', 'FileUpload label')}
        onChange={action('change')}
        className={text('Additional class name', 'fileupload-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-hintText={text('Hint', 'FileUpload hint')}
        name="Name"
        data-repository={testRepository}
      />
    ),
    { notes: { markdown: fileUploadNotes } },
  )

storiesOf('FieldControls.Name', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <Name
        data-actionName="new"
        data-labelText={text('Label', 'Name label')}
        data-defaultValue={text('Default value', 'Name default value')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'name-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Name hint')}
        name="Name"
      />
    ),
    { notes: { markdown: nameNotes } },
  )
  .add(
    'edit mode',
    () => (
      <Name
        data-labelText={text('Label', 'Name label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'name-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={text('Value', 'Name value')}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text('Hint', 'Name hint')}
        name="Name"
      />
    ),
    { notes: { markdown: nameNotes } },
  )
  .add(
    'browse mode',
    () => (
      <Name
        data-actionName="browse"
        data-labelText={text('Label', 'Name label')}
        className={text('Additional class name', 'name-field')}
        value={text('Value', 'Name value')}
        onChange={action('change')}
        name="Name"
      />
    ),
    { notes: { markdown: nameNotes } },
  )

storiesOf('FieldControls.Number', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode integer',
    () => (
      <Number
        data-actionName="new"
        data-labelText={text('Label', 'Number label')}
        data-defaultValue={number('Default value', 2)}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'number-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Number hint')}
        max={number('Maximum value')}
        min={number('Minimum value')}
        data-decimal={boolean('Decimal', false)}
        data-digits={number('Digits', 2)}
        data-step={number('Step', 1)}
        data-isPercentage={boolean('Percentage', false)}
        data-isCurrency={boolean('Currency', false)}
        data-currency={select('Currency symbol', currencyOptions, '$')}
        name="Index"
      />
    ),
    { notes: { markdown: numberNotes } },
  )
  .add(
    'new mode decimal',
    () => (
      <Number
        data-actionName="new"
        data-labelText={text('Label', 'Number label')}
        data-defaultValue={number('Default value', 2.1)}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'number-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Number hint')}
        max={number('Maximum value')}
        min={number('Minimum value')}
        data-decimal={boolean('Decimal', true)}
        data-digits={number('Digits', 2)}
        data-step={number('Step', 0.01)}
        data-isPercentage={boolean('Percentage', false)}
        data-isCurrency={boolean('Currency', false)}
        data-currency={select('Currency symbol', currencyOptions, '$')}
        name="Index"
      />
    ),
    { notes: { markdown: numberNotes } },
  )
  .add(
    'edit mode integer',
    () => (
      <Number
        data-actionName="edit"
        data-labelText={text('Label', 'Number label')}
        value={number('Value', 4)}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'number-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Number hint')}
        max={number('Maximum value')}
        min={number('Minimum value')}
        data-decimal={boolean('Decimal', false)}
        data-digits={number('Digits', 2)}
        data-step={number('Step', 1)}
        data-isPercentage={boolean('Percentage', false)}
        data-isCurrency={boolean('Currency', false)}
        data-currency={select('Currency symbol', currencyOptions, '$')}
        name="Index"
      />
    ),
    { notes: { markdown: numberNotes } },
  )
  .add(
    'edit mode decimal',
    () => (
      <Number
        data-actionName="edit"
        data-labelText={text('Label', 'Number label')}
        value={number('Value', 4.45)}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'number-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Number hint')}
        max={number('Maximum value')}
        min={number('Minimum value')}
        data-decimal={boolean('Decimal', true)}
        data-digits={number('Digits', 2)}
        data-step={number('Step', 1.12)}
        data-isPercentage={boolean('Percentage', false)}
        data-isCurrency={boolean('Currency', false)}
        data-currency={select('Currency symbol', currencyOptions, '$')}
        name="Index"
      />
    ),
    { notes: { markdown: numberNotes } },
  )
  .add(
    'browse mode',
    () => (
      <Number
        data-actionName="browse"
        data-labelText={text('Label', 'Number label')}
        value={number('Value', 4)}
        className={text('Additional class name', 'number-field')}
        onChange={action('change')}
        data-isPercentage={boolean('Percentage', false)}
        data-isCurrency={boolean('Currency', false)}
        data-currency={select('Currency symbol', currencyOptions, '$')}
        name="Index"
      />
    ),
    { notes: { markdown: numberNotes } },
  )
  .add(
    'new mode currency',
    () => (
      <Number
        data-actionName="new"
        data-labelText={text('Label', 'Currency label')}
        data-defaultValue={number('Default value', 2.1)}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'currency-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Currency hint')}
        max={number('Maximum value')}
        min={number('Minimum value')}
        data-isCurrency={boolean('Currency', true)}
        data-currency={select('Currency symbol', currencyOptions, '$')}
        name="Index"
      />
    ),
    { notes: { markdown: numberNotes } },
  )
  .add(
    'edit mode currency',
    () => (
      <Number
        data-actionName="edit"
        data-labelText={text('Label', 'Currency label')}
        value={number('Value', 4)}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'currency-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Currency hint')}
        max={number('Maximum value')}
        min={number('Minimum value')}
        data-isCurrency={boolean('Currency', true)}
        data-currency={select('Currency symbol', currencyOptions, '$')}
        name="Index"
      />
    ),
    { notes: { markdown: numberNotes } },
  )
  .add(
    'browse mode currency',
    () => (
      <Number
        data-actionName="browse"
        data-labelText={text('Label', 'Currency label')}
        value={number('Value', 4.45)}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'currency-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Currency hint')}
        max={number('Maximum value')}
        min={number('Minimum value')}
        data-isCurrency={boolean('Currency', true)}
        data-currency={select('Currency symbol', currencyOptions, '$')}
        name="Index"
      />
    ),
    { notes: { markdown: numberNotes } },
  )

storiesOf('FieldControls.Password', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <Password
        data-actionName="new"
        data-labelText={text('Label', 'Password label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'pasword-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Password hint')}
        name="Name"
      />
    ),
    { notes: { markdown: passwordNotes } },
  )
  .add(
    'edit mode',
    () => (
      <Password
        data-labelText={text('Label', 'Password label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'password-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={text('Value', 'Password value')}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text('Hint', 'Password hint')}
        name="Name"
      />
    ),
    { notes: { markdown: passwordNotes } },
  )

storiesOf('FieldControls.RadioButtonGroup', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <RadioButtonGroup
        data-actionName="new"
        data-labelText={text('Label', 'RadioButtonGroup label')}
        data-defaultValue={'3'}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'radiobuttongroup-field')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'RadioButtonGroup hint')}
        options={[
          {
            Value: '0',
            Text: 'Inherited',
          },
          {
            Value: '1',
            Text: 'None',
          },
          {
            Value: '2',
            Text: 'Major only',
          },
          {
            Value: '3',
            Text: 'Major and minor',
          },
        ]}
        name="Version"
      />
    ),
    { notes: { markdown: radiobuttongroupNotes } },
  )
  .add(
    'edit mode',
    () => (
      <RadioButtonGroup
        data-labelText={text('Label', 'RadioButtonGroup label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'radiobuttongroup-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        data-fieldValue={[3]}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text('Hint', 'RadioButtonGroup hint')}
        options={[{ Text: 'option1', Value: 1 }, { Text: 'option2', Value: 2 }, { Text: 'option3', Value: 3 }]}
        name="VersioningMode"
      />
    ),
    { notes: { markdown: radiobuttongroupNotes } },
  )
  .add(
    'browse mode',
    () => (
      <RadioButtonGroup
        data-actionName="browse"
        data-labelText={text('Label', 'RadioButtonGroup label')}
        className={text('Additional class name', 'radiobuttongroup-field')}
        data-fieldValue={text('Value', [2])}
        onChange={action('change')}
        options={[{ Text: 'option1', Value: 1 }, { Text: 'option2', Value: 2 }, { Text: 'option3', Value: 3 }]}
        name="VersioningMode"
      />
    ),
    { notes: { markdown: radiobuttongroupNotes } },
  )

storiesOf('FieldControls.ReferenceGrid', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <ReferenceGrid
        data-actionName="new"
        data-labelText={text('Label', 'ReferenceGrid label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'reference-field')}
        onChange={action('change')}
        name="Name"
        data-fieldValue={[]}
        dataSource={referenceGridDataSource}
        repository={testRepository}
        data-repository={testRepository}
        data-selectionRoot={['/workspaces']}
        data-allowedTypes={['File']}
      />
    ),
    { notes: { markdown: referenceGridNotes } },
  )
  .add(
    'edit mode',
    () => (
      <ReferenceGrid
        data-labelText={text('Label', 'ReferenceGrid label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'reference-field')}
        data-errorText={text('Error text')}
        data-fieldValue={[{ DisplayName: 'Aenean semper.docx', Id: 4, Icon: 'word', Type: 'File' }]}
        data-actionName="edit"
        onChange={action('change')}
        name="Name"
        dataSource={referenceGridDataSource}
        repository={testRepository}
        data-repository={testRepository}
        data-selectionRoot={['/workspaces']}
        data-allowedTypes={['File']}
      />
    ),
    { notes: { markdown: referenceGridNotes } },
  )
  .add(
    'browse mode',
    () => (
      <ReferenceGrid
        data-actionName="browse"
        data-labelText={text('Label', 'ReferenceGrid label')}
        className={text('Additional class name', 'reference-field')}
        data-fieldValue={[
          {
            DisplayName: 'Alba Monday',
            Id: 4,
            Icon: 'user',
            Type: 'User',
            Avatar: { Url: 'https://dmsservice.demo.sensenet.com/Root/Sites/Default_Site/demoavatars/alba.jpg' },
          } as User,
        ]}
        onChange={action('change')}
        name="Name"
        dataSource={tagsInputDataSource}
        repository={testRepository}
      />
    ),
    { notes: { markdown: referenceGridNotes } },
  )

storiesOf('FieldControls.RichTextEditor', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <RichTextEditor
        data-actionName="new"
        data-labelText={text('Label', 'RichTextEditor label')}
        data-defaultValue={text('Default value', 'RichTextEditor default value')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'richtext-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'RichTextEditor hint')}
        name="Description"
      />
    ),
    { notes: { markdown: richtextNotes } },
  )
  .add(
    'edit mode',
    () => (
      <RichTextEditor
        data-actionName="edit"
        data-labelText={text('Label', 'RichTextEditor label')}
        value={text('Value', 'RichTextEditor value')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'richtext-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'RichTextEditor hint')}
        name="Description"
      />
    ),
    { notes: { markdown: richtextNotes } },
  )
  .add(
    'browse mode',
    () => (
      <RichTextEditor
        data-actionName="browse"
        data-labelText={text('Label', 'RichTextEditor label')}
        value={text(
          'Value',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec iaculis lectus, sed blandit urna. Nullam in auctor odio, eu eleifend diam. Curabitur rutrum ullamcorper nunc, sit amet consectetur turpis elementum ac. Aenean lorem lorem, feugiat sit amet sem at, accumsan cursus leo.',
        )}
        className={text('Additional class name', 'richtext-field')}
        name="Description"
        onChange={action('change')}
      />
    ),
    { notes: { markdown: richtextNotes } },
  )

storiesOf('FieldControls.ShortText', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <ShortText
        data-actionName="new"
        data-labelText={text('Label', 'ShortText label')}
        data-defaultValue={text('Default value', 'ShortText default value')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'shorttext-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Shorttext hint')}
        name="Name"
      />
    ),
    { notes: { markdown: shorttextNotes } },
  )
  .add(
    'edit mode',
    () => (
      <ShortText
        data-labelText={text('Label', 'ShortText label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'shorttext-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={text('Value', 'ShortText value')}
        data-actionName="edit"
        onChange={action('change')}
        data-hintText={text('Hint', 'Shorttext hint')}
        name="Name"
      />
    ),
    { notes: { markdown: shorttextNotes } },
  )
  .add(
    'browse mode',
    () => (
      <ShortText
        data-actionName="browse"
        data-labelText={text('Label', 'ShortText label')}
        className={text('Additional class name', 'shorttext-field')}
        value={text('Value', 'ShortText value')}
        onChange={action('change')}
        name="Name"
      />
    ),
    { notes: { markdown: shorttextNotes } },
  )

storiesOf('FieldControls.TagsInput', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <TagsInput
        data-actionName="new"
        data-labelText={text('Label', 'TagsInput label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'tagsinput-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'TagsInput hint')}
        dataSource={tagsInputDataSource}
        repository={testRepository}
        data-allowMultiple={boolean('Allow multiple selection', false)}
        name="ModifiedBy"
      />
    ),
    { notes: { markdown: tagsInputNotes } },
  )
  .add(
    'edit mode',
    () => (
      <TagsInput
        data-actionName="edit"
        data-labelText={text('Label', 'TagsInput label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'tagsinput-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'TagsInput hint')}
        dataSource={tagsInputDataSource}
        repository={testRepository}
        data-allowMultiple={boolean('Allow multiple selection', false)}
        data-fieldValue={[2]}
        name="ModifiedBy"
      />
    ),
    { notes: { markdown: tagsInputNotes } },
  )
  .add(
    'browse mode',
    () => (
      <TagsInput
        data-textType="LongText"
        data-actionName="browse"
        data-labelText={text('Label', 'Textarea label')}
        className={text('Additional class name', 'textarea-field')}
        data-fieldValue={[1, 2]}
        onChange={action('change')}
        dataSource={tagsInputDataSource}
        repository={testRepository}
        name="ModifiedBy"
      />
    ),
    { notes: { markdown: tagsInputNotes } },
  )

storiesOf('FieldControls.Textarea', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <Textarea
        data-actionName="new"
        data-textType="LongText"
        data-labelText={text('Label', 'Textarea label')}
        data-defaultValue={text('Default value', 'Textarea default value')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'textarea-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        onChange={action('change')}
        data-hintText={text('Hint', 'Textarea hint')}
        name="Description"
      />
    ),
    { notes: { markdown: textareasNotes } },
  )
  .add(
    'edit mode',
    () => (
      <Textarea
        data-textType="LongText"
        data-actionName="edit"
        data-labelText={text('Label', 'Textarea label')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'textarea-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={text(
          'Value',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec iaculis lectus, sed blandit urna. Nullam in auctor odio, eu eleifend diam. Curabitur rutrum ullamcorper nunc, sit amet consectetur turpis elementum ac. Aenean lorem lorem, feugiat sit amet sem at, accumsan cursus leo.',
        )}
        onChange={action('change')}
        data-hintText={text('Hint', 'Textarea hint')}
        name="Description"
      />
    ),
    { notes: { markdown: textareasNotes } },
  )
  .add(
    'browse mode',
    () => (
      <Textarea
        data-textType="LongText"
        data-actionName="browse"
        data-labelText={text('Label', 'Textarea label')}
        className={text('Additional class name', 'textarea-field')}
        value={text(
          'Value',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec iaculis lectus, sed blandit urna. Nullam in auctor odio, eu eleifend diam. Curabitur rutrum ullamcorper nunc, sit amet consectetur turpis elementum ac. Aenean lorem lorem, feugiat sit amet sem at, accumsan cursus leo.',
        )}
        onChange={action('change')}
        name="Description"
      />
    ),
    { notes: { markdown: textareasNotes } },
  )

storiesOf('FieldControls.TimePicker', module)
  .addDecorator(withKnobs)
  .addDecorator(withA11y)
  .addDecorator(withActions('change'))
  .add(
    'new mode',
    () => (
      <TimePicker
        data-actionName="new"
        data-labelText={text('Label', 'TimePicker label')}
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'timepicker-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        data-defaultValue={dateKnob('Default value')}
        data-hintText={text('Hint', 'TimePicker hint')}
        name="ModificationDate"
      />
    ),
    { notes: { markdown: timepickerNotes } },
  )
  .add(
    'edit mode',
    () => (
      <TimePicker
        data-actionName="edit"
        data-labelText={text('Label', 'TimePicker label')}
        onChange={action('change')}
        readOnly={boolean('Readonly', false)}
        required={boolean('Required', false)}
        className={text('Additional class name', 'timepicker-field')}
        data-placeHolderText={text('Placeholder', 'placeholder')}
        data-errorText={text('Error text')}
        value={dateKnob('Value')}
        data-hintText={text('Hint', 'TimePicker hint')}
        name="ModificationDate"
      />
    ),
    { notes: { markdown: timepickerNotes } },
  )
  .add(
    'browse mode',
    () => (
      <TimePicker
        data-actionName="browse"
        data-labelText={text('Label', 'TimePicker label')}
        value={text('Value', '03:50:00')}
        onChange={action('change')}
        className={text('Additional class name', 'timepicker-field')}
        name="ModificationDate"
      />
    ),
    { notes: { markdown: timepickerNotes } },
  )

function dateKnob(name: string, defaultValue = new Date()) {
  const stringTimestamp = date(name, defaultValue)
  return new Date(stringTimestamp).toISOString()
}
